import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session');

        if (!sessionCookie || !sessionCookie.value) {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            );
        }

        let session;
        try {
            session = JSON.parse(sessionCookie.value);
        } catch (e) {
            return NextResponse.json(
                { message: 'Invalid session' },
                { status: 401 }
            );
        }

        if (!session || !session.email) {
            return NextResponse.json(
                { message: 'Invalid session data' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            email: session.email,
            name: session.name || session.email.split('@')[0]
        });

    } catch (error) {
        console.error('Error getting user data:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
} 