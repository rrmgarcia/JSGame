import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const { userID } = await req.json();

    if (!userID) {
      console.error('Invalid user data:', userID);
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const firstChapterId = new ObjectId('667a0d6e43365af175fb7267');

    await db
      .collection('userProgress')
      .findOneAndUpdate(
        { userId: new ObjectId(userID) },
        { $setOnInsert: { userId: new ObjectId(userID), currentChapter: firstChapterId } },
        { upsert: true, returnDocument: 'after' }
      );

    return NextResponse.json({ message: 'User progress initialized successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error initializing user progress:', error);
    return NextResponse.json({ error: 'Error initializing user progress' }, { status: 500 });
  }
}
