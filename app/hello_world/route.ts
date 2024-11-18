// app/llm/route.ts
import { NextResponse } from 'next/server';
import { LlmView } from './hello_world_view'; // Import the LlmView class

export async function POST(request: Request) {
    try {
        const reqBody = await request.json(); // Parse the JSON body
        const response = await LlmView.handleRequest(reqBody); // Call the handleRequest method
        return NextResponse.json(response); // Return the response as JSON
    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
