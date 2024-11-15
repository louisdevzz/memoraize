import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || ''; // Should match the one in auth routes

async function verifyAuth() {
    const headersList = await headers();
    const token = headersList.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        throw new Error('No token provided');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded.userId;
    } catch (error) {
        throw new Error('Invalid token');
    }
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
        try {
            await verifyAuth();
        } catch (error) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect to database
        await connectDB();

        // Parse request body
        const body = await req.json();
        const { title, description, flashcards, visibility } = body;
        const userId = await verifyAuth();
        
        // Validate required fields
        if (!title || !description || !flashcards || flashcards.length === 0) {
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

        // Create new lesson with visibility
        const lesson = await Lesson.create({
            title,
            description,
            flashcards,
            userId,
            visibility: visibility || 'private',
            slug: title.toLowerCase().replace(/ /g, '-')
        });

        return NextResponse.json(lesson, { status: 201 });
    } catch (error) {
        console.error('Error creating lesson:', error);
        return NextResponse.json(
            { error: 'Failed to create lesson' },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        // Verify authentication
        try {
            await verifyAuth();
        } catch (error) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect to database
        await connectDB();

        // Parse request body
        const body = await req.json();
        const { title, description, flashcards, slug, visibility } = body;
        const userId = await verifyAuth();

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
            { slug, userId },
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
        try {
            await verifyAuth();
        } catch (error) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect to database
        await connectDB();

        // Get the slug from the URL
        const url = new URL(req.url);
        const slug = url.searchParams.get('slug');
        const userId = await verifyAuth();

        if (!slug) {
            return NextResponse.json(
                { error: 'Slug parameter is required' },
                { status: 400 }
            );
        }

        // Find and delete the lesson
        const deletedLesson = await Lesson.findOneAndDelete({ slug, userId });

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