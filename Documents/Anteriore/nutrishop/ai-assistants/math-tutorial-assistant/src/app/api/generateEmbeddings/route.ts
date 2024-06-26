import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ObjectId } from 'mongodb';

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

    const data = await db.collection('curriculums').find().toArray();
    if (!data.length) {
      console.log('No data found');
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }

    for (const curriculum of data) {
      const itemDetails = `
        Unit Title: ${curriculum.unitTitle}
        Chapters: ${curriculum.chapters
          .map(
            (chapter: any) => `
          Chapter Title: ${chapter.chapterTitle}
          Lessons: ${chapter.lessons
            .map(
              (lesson: any) => `
            Lesson Title: ${lesson.title}
            About: ${lesson.about || ''}
          `
            )
            .join('')}
        `
          )
          .join('')}
      `;

      console.log('Item Details:', itemDetails);

      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        encoding_format: 'float',
        input: itemDetails,
      });

      const embedding = embeddingResponse.data[0].embedding;
      if (!embedding) {
        console.error(`Embedding data not found for item ${curriculum.unitTitle}`);
        return NextResponse.json({ message: 'Embedding data not found' }, { status: 500 });
      }

      await db.collection('curriculums').updateOne({ _id: new ObjectId(curriculum._id) }, { $set: { embedding } });
    }

    return NextResponse.json({ message: 'Embeddings generated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
