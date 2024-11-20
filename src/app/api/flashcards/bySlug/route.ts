import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lesson from '@/models/Lesson';
import { cookies } from 'next/headers';

// Helper function to verify authentication
async function verifyAuth() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie || !sessionCookie.value) {
        throw new Error('Not authenticated');
    }

    try {
        const session = JSON.parse(sessionCookie.value);
        if (!session || !session.userId) {
            throw new Error('Invalid session');
        }
        return session.userId;
    } catch (e) {
        throw new Error('Invalid session');
    }
}

export async function GET(request: NextRequest) {    
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        
        if (!slug) {
            return NextResponse.json(
                { error: 'Slug is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // First try to find the lesson without userId filter
        const lesson = await Lesson.findOne({ slug: slug });

        if (!lesson) {
            return NextResponse.json(
                { error: 'Lesson not found' },
                { status: 404 }
            );
        }

        // If lesson is private, verify ownership
        if (lesson.visibility === 'private') {
            try {
                const userId = await verifyAuth();
                if (lesson.userId !== userId) {
                    return NextResponse.json(
                        { error: 'Unauthorized to view this private lesson' },
                        { status: 403 }
                    );
                }
            } catch (error) {
                return NextResponse.json(
                    { error: 'Unauthorized to view this private lesson' },
                    { status: 403 }
                );
            }
        }

        // For public lessons or if user is authorized, check if the user is the owner
        let isOwner = false;
        try {
            const userId = await verifyAuth();
            isOwner = lesson.userId === userId;
        } catch (error) {
            // User is not logged in, isOwner remains false
        }

        // Return lesson with isOwner flag
        return NextResponse.json({
            ...lesson.toObject(),
            isOwner
        });

    } catch (error) {
        console.error('Error fetching lesson:', error);
        return NextResponse.json(
            { error: 'Failed to fetch lesson' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        
        if (!slug) {
            return NextResponse.json(
                { error: 'Slug is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // First find the lesson
        const lesson = await Lesson.findOne({ slug: slug });

        if (!lesson) {
            return NextResponse.json(
                { error: 'Lesson not found' },
                { status: 404 }
            );
        }

        // Verify ownership
        try {
            const userId = await verifyAuth();
            if (lesson.userId !== userId) {
                return NextResponse.json(
                    { error: 'Unauthorized to delete this lesson' },
                    { status: 403 }
                );
            }
        } catch (error) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Delete the lesson
        await Lesson.findOneAndDelete({ slug: slug });

        return NextResponse.json({ message: 'Lesson deleted successfully' });

    } catch (error) {
        console.error('Error deleting lesson:', error);
        return NextResponse.json(
            { error: 'Failed to delete lesson' },
            { status: 500 }
        );
    }
}
