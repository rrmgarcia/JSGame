import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing environment variable OPENAI_API_KEY');
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('test');
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ message: 'No query message provided' }, { status: 400 });
    }

    const embeddedResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      encoding_format: 'float',
      input: query,
    });

    const embeddedQuery = embeddedResponse.data[0].embedding;

    const pipeline = [
      {
        $vectorSearch: {
          index: 'vector_index',
          queryVector: embeddedQuery,
          path: 'embedding',
          numCandidates: 5,
          limit: 5,
        },
      },
      {
        $project: {
          embedding: 0,
        },
      },
    ];

    const documents = await db.collection('curriculums').aggregate(pipeline).toArray();

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
