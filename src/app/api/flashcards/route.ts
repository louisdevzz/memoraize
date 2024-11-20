import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import connectDB from "@/lib/mongodb";
import Lesson from "@/models/Lesson";

async function verifyAuth() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie || !sessionCookie.value) {
        throw new Error('Not authenticated');
    }

    let session;
    try {
        session = JSON.parse(sessionCookie.value);
    } catch (e) {
        throw new Error('Invalid session');
    }

    if (!session || !session.email) {
        throw new Error('Invalid session data');
    }

    return session.email; // Using email as userId since that's what we have in the session
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const visibility = searchParams.get('visibility');
        
        const query = visibility === 'public' 
            ? { visibility: 'public' }
            : {};
            
        const lessons = await Lesson.find(query)
            .sort({ createdAt: -1 })
            .select('title description flashcards createdAt slug');
            
        return NextResponse.json(lessons);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        return NextResponse.json(
            { error: 'Failed to fetch lessons' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        // Verify authentication
        let userEmail;
        try {
            userEmail = await verifyAuth();
        } catch (error) {
            return NextResponse.json(
                { error: 'Please log in to continue' },
                { status: 401 }
            );
        }

        // Connect to database
        await connectDB();

        // Parse request body
        const body = await req.json();
        const { title, description, flashcards, visibility } = body;

        // Validate required fields
        if (!title?.trim()) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        if (!description?.trim()) {
            return NextResponse.json(
                { error: 'Description is required' },
                { status: 400 }
            );
        }

        if (!Array.isArray(flashcards) || flashcards.length === 0) {
            return NextResponse.json(
                { error: 'At least one flashcard is required' },
                { status: 400 }
            );
        }

        // Validate each flashcard
        for (const [index, card] of flashcards.entries()) {
            if (!card.type || !['text', 'image', 'multipleChoice', 'audio'].includes(card.type)) {
                return NextResponse.json(
                    { error: `Invalid type for flashcard ${index + 1}` },
                    { status: 400 }
                );
            }

            if (!card.front?.trim() || !card.back?.trim()) {
                return NextResponse.json(
                    { error: `Missing content for flashcard ${index + 1}` },
                    { status: 400 }
                );
            }

            if (card.type === 'multipleChoice') {
                if (!Array.isArray(card.options) || card.options.length < 2) {
                    return NextResponse.json(
                        { error: `Multiple choice flashcard ${index + 1} must have at least 2 options` },
                        { status: 400 }
                    );
                }
                if (!card.correctOption || !card.options.includes(card.correctOption)) {
                    return NextResponse.json(
                        { error: `Invalid correct option for flashcard ${index + 1}` },
                        { status: 400 }
                    );
                }
            }

            if (card.type === 'image' && !card.imageUrl) {
                return NextResponse.json(
                    { error: `Missing image URL for flashcard ${index + 1}` },
                    { status: 400 }
                );
            }

            if (card.type === 'audio' && !card.audioUrl) {
                return NextResponse.json(
                    { error: `Missing audio URL for flashcard ${index + 1}` },
                    { status: 400 }
                );
            }
        }

        // Create slug from title
        const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

        // Create new lesson
        const lesson = await Lesson.create({
            title,
            description,
            flashcards,
            userId: userEmail, // Using email as userId
            visibility: visibility || 'private',
            slug
        });

        return NextResponse.json(lesson, { status: 201 });
    } catch (error: any) {
        console.error('Error creating lesson:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create flashcard set' },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        // Verify authentication
        let userEmail;
        try {
            userEmail = await verifyAuth();
        } catch (error) {
            return NextResponse.json(
                { error: 'Please log in to continue' },
                { status: 401 }
            );
        }

        // Connect to database
        await connectDB();

        // Parse request body
        const body = await req.json();
        const { title, description, flashcards, slug, visibility } = body;

        // Validate required fields
        if (!title || !description || !flashcards || flashcards.length === 0 || !slug) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate flashcard structure
        const isValidFlashcards = flashcards.every((card: any) => 
            card.front && typeof card.front === 'string' &&
            card.back && typeof card.back === 'string'
        );

        if (!isValidFlashcards) {
            return NextResponse.json(
                { error: 'Invalid flashcard format' },
                { status: 400 }
            );
        }

        // Find and update the lesson
        const lesson = await Lesson.findOneAndUpdate(
            { slug, userId: userEmail },
            {
                title,
                description,
                flashcards,
                visibility: visibility || 'private',
                slug: title.toLowerCase().replace(/ /g, '-')
            },
            { new: true }
        );

        if (!lesson) {
            return NextResponse.json(
                { error: 'Lesson not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json(lesson);
    } catch (error) {
        console.error('Error updating lesson:', error);
        return NextResponse.json(
            { error: 'Failed to update lesson' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        // Verify authentication
        let userEmail;
        try {
            userEmail = await verifyAuth();
        } catch (error) {
            return NextResponse.json(
                { error: 'Please log in to continue' },
                { status: 401 }
            );
        }

        // Connect to database
        await connectDB();

        // Get the slug from the URL
        const url = new URL(req.url);
        const slug = url.searchParams.get('slug');

        if (!slug) {
            return NextResponse.json(
                { error: 'Slug parameter is required' },
                { status: 400 }
            );
        }

        // Find and delete the lesson
        const deletedLesson = await Lesson.findOneAndDelete({ slug, userId: userEmail });

        if (!deletedLesson) {
            return NextResponse.json(
                { error: 'Lesson not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        return NextResponse.json(
            { error: 'Failed to delete lesson' },
            { status: 500 }
        );
    }
}