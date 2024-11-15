import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || '';

export async function GET(request: Request) {
    try {
        const headersList = await headers();
        const token = headersList.get('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { error: 'No token provided' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        
        return NextResponse.json({ id: decoded.userId });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
        );
    }
} 