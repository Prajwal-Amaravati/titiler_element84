// app/query/route.ts
import { NextResponse } from 'next/server';
import QueryFromDBController from './query_from_db_controller'; // Import your controller

const queryController = new QueryFromDBController();

export async function POST(request: Request) {
    try {
        const reqBody = await request.json(); // Parse the JSON body
        console.log("the body", reqBody); // Corrected console.log statement
        const { placeName } = reqBody; // Extract 'placeName' from the request body

        if (!placeName || typeof placeName !== 'string') {
            return NextResponse.json({ error: 'Invalid place name' }, { status: 400 });
        }

        const response = await queryController.handleQuery(placeName); // Query the database
        console.log("the response", response);
        return NextResponse.json(response); // Return the database response as JSON
    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
