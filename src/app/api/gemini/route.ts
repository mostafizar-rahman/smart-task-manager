import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { task, description } = await req.json();
        if (!task) {
            return NextResponse.json({ error: 'Task is required' }, { status: 400 });
        }
        if (!description) {
            return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }

        // Get Gemini API key from environment variables
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API key not set' }, { status: 500 });
        }

        // Gemini API endpoint for text generation
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

        // Prompt for subtasks
        const prompt = `Break this task into 3-5 smaller actionable subtasks as a list base on ${task} ${description}`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            }),
        });

        const data = await response.json();

        // Parse the response to extract subtasks (assuming Gemini returns a text list)
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const subtasks = Array.from(text.matchAll(/\*\*(.*?)\*\*/g), (m: any) => m[1].trim().replace(/:$/, ''));

        return NextResponse.json({ subtasks });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 