import type { NextApiRequest, NextApiResponse } from 'next';
import QueryFromDBController from '../../app/query_engine/query_from_db_controller';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const placeName = searchParams.get('placeName');

  if (typeof placeName !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid placeName' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const queryController = new QueryFromDBController();

  try {
    const centroid = await queryController.getcentroid(placeName);
    return new Response(JSON.stringify(centroid), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error querying centroid:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
