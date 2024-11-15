import { NextResponse } from "next/server";
import { createClient } from '@vercel/postgres';

export async function GET(
    { params }: any
) {
    try {
        const client = createClient();
        await client.connect();

        const { rows } = await client.sql`
            SELECT data, content_type
            FROM uploads
            WHERE id = ${params.id}
        `;

        await client.end();

        if (rows.length === 0) {
            return new NextResponse('File not found', { status: 404 });
        }

        const file = rows[0];
        // Convert base64 back to buffer
        const buffer = Buffer.from(file.data, 'base64');

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': file.content_type,
                'Cache-Control': 'public, max-age=31536000',
            },
        });
    } catch (error) {
        console.error('Error serving file:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 