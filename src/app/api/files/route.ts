import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@vercel/postgres';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        const filename = searchParams.get('filename');

        if (!id || !filename) {
            return NextResponse.json(
                { error: "Missing id or filename" },
                { status: 400 }
            );
        }

        const client = createClient();
        await client.connect();

        const { rows } = await client.sql`
            SELECT data, content_type
            FROM uploads
            WHERE id = ${id} AND filename = ${filename}
        `;

        await client.end();

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 }
            );
        }

        const file = rows[0];
        const buffer = Buffer.from(file.data, 'base64');

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': file.content_type,
                'Content-Disposition': `inline; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Error retrieving file:', error);
        return NextResponse.json(
            { error: "Error retrieving file" },
            { status: 500 }
        );
    }
} 