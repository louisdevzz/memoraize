import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || '';

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

export async function GET(
    request: NextRequest,
    { params }: any
) {    
    try {
        const { id } = params;
        const userId = await verifyAuth();
        await connectDB();

        const lesson = await Lesson.findOne({ slug: id, userId });

        if (!lesson) {
            return NextResponse.json(
                { error: 'Lesson not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json(lesson);
    } catch (error) {
        console.error('Error fetching lesson:', error);
        return NextResponse.json(
            { error: 'Failed to fetch lesson' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: any
) {
    try {
        const userId = await verifyAuth();
        await connectDB();

        const { id } = params;
        
        // Find and delete the lesson by slug and userId
        const deletedLesson = await Lesson.findOneAndDelete({ 
            slug: id,
            userId 
        });

        if (!deletedLesson) {
            return NextResponse.json(
                { error: 'Lesson not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            message: 'Lesson deleted successfully',
            deletedLesson 
        });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        return NextResponse.json(
            { error: 'Failed to delete lesson' },
            { status: 500 }
        );
    }
} 