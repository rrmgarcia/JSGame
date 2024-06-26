import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    console.log('Attempting to connect to MongoDB with URI:', process.env.MONGODB_URI);
    const client = await clientPromise;
    const db = client.db();
    
    await db.command({ ping: 1 });
    console.log('Successfully connected to the database');
    return NextResponse.json({ status: 'ok', message: 'Connected to the database' });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to connect to the database', error: error.message });
  }
}
