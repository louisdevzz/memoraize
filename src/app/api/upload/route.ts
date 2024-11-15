import { NextResponse } from "next/server";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const fileType = formData.get('fileType') as string; // 'image' or 'audio'

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        // Validate file type
        if (fileType === 'image' && !file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: "File must be an image" },
                { status: 400 }
            );
        }

        if (fileType === 'audio' && !file.type.startsWith('audio/')) {
            return NextResponse.json(
                { error: "File must be an audio file" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${uuidv4()}${path.extname(file.name)}`;
        
        // Create uploads directory based on file type
        const uploadDir = path.join(process.cwd(), 'public/uploads', fileType);
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Save file
        await writeFile(path.join(uploadDir, filename), buffer);

        return NextResponse.json({ 
            url: `/uploads/${fileType}/${filename}`
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: "Error uploading file" },
            { status: 500 }
        );
    }
} 