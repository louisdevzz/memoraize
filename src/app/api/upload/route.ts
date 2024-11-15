import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@vercel/postgres';

export async function POST(request: Request) {
    try {
        const client = createClient();
        await client.connect();

        // Create table if it doesn't exist
        await client.sql`
            CREATE TABLE IF NOT EXISTS uploads (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                file_type VARCHAR(50) NOT NULL,
                content_type VARCHAR(255) NOT NULL,
                data TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const fileType = formData.get('fileType') as string;

        if (!file) {
            await client.end();
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        // Validate file type
        if (fileType === 'image' && !file.type.startsWith('image/')) {
            await client.end();
            return NextResponse.json(
                { error: "File must be an image" },
                { status: 400 }
            );
        }

        if (fileType === 'audio' && !file.type.startsWith('audio/')) {
            await client.end();
            return NextResponse.json(
                { error: "File must be an audio file" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const filename = `${uuidv4()}${file.name.substring(file.name.lastIndexOf('.'))}`;
        
        // Convert buffer to base64 string
        const base64Data = buffer.toString('base64');
        
        // Store file metadata in Vercel Postgres
        const { rows } = await client.sql`
            INSERT INTO uploads (filename, file_type, content_type, data)
            VALUES (${filename}, ${fileType}, ${file.type}, ${base64Data})
            RETURNING id, filename
        `;

        await client.end();

        const fileUrl = `/api/files?id=${rows[0].id}&filename=${filename}`;

        return NextResponse.json({ 
            url: fileUrl
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: "Error uploading file" },
            { status: 500 }
        );
    }
} 