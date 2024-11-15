import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { category, topic, prompt } = await req.json();

        const systemPrompt = `You are a helpful AI that creates educational flashcards. 
        Create flashcards for the category "${category}" about "${topic}".
        Each flashcard should be either text-based or multiple choice.
        For multiple choice questions, provide 4 options with one correct answer.
        Format your response as a JSON array of flashcard objects.
        
        For text flashcards use the format:
        {
            "type": "text",
            "front": "question",
            "back": "answer"
        }
        
        For multiple choice flashcards use the format:
        {
            "type": "multipleChoice",
            "front": "question",
            "back": "full explanation of the answer",
            "options": ["option1", "option2", "option3", "option4"],
            "correctOption": "correct option from the options array"
        }`;

        const userPrompt = prompt || `Create 5 flashcards about ${topic} in ${category}`;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "gpt-3.5-turbo",
            temperature: 0.7,
            response_format: { type: "json_object" },
        });

        const response = completion.choices[0].message.content;
        if (!response) {
            throw new Error("No response from OpenAI");
        }

        const flashcards = JSON.parse(response).flashcards;

        return NextResponse.json({ flashcards });
    } catch (error) {
        console.error("Error generating flashcards:", error);
        return NextResponse.json(
            { error: "Failed to generate flashcards" },
            { status: 500 }
        );
    }
} 