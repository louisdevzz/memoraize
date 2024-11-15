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

export async function GET(req: Request) {
    try {
        await connectDB();
        const lessons = await Lesson.find().sort({ createdAt: -1 });
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
        const { title, description, flashcards } = body;
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

        // Create new lesson
        const lesson = await Lesson.create({
            title,
            description,
            flashcards,
            userId,
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
    return NextResponse.json({ message: 'Hello, world!' });
}

export async function DELETE(req: Request) {
    return NextResponse.json({ message: 'Hello, world!' });
}