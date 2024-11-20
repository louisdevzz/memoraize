import Lesson from "@/models/Lesson";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import connectDB from "@/lib/mongodb";

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

export async function GET(req: Request) {
    try {
        await connectDB();
        
        const userId = await verifyAuth();
        const lessons = await Lesson.find({ userId })
            .sort({ createdAt: -1 }) // Sort by newest first
            .select('title description slug flashcards createdAt visibility'); // Select specific fields
            
        return NextResponse.json(lessons);
    } catch (error: any) {
        console.error('Error fetching lessons:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch lessons' },
            { status: error.message === 'No token provided' || error.message === 'Invalid token' ? 401 : 500 }
        );
    }
} 