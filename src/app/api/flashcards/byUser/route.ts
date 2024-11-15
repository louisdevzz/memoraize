import Lesson from "@/models/Lesson";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import connectDB from "@/lib/mongodb";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'flashcards';

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
        
        const userId = await verifyAuth();
        const lessons = await Lesson.find({ userId });
        return NextResponse.json(lessons);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        return NextResponse.json(
            { error: 'Failed to fetch lessons' },
            { status: 500 }
        );
    }
} 