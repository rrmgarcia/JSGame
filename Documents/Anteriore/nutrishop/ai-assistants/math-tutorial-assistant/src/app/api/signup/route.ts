import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {

    const data = await req.json();
    const { user } = data;

    if (!user || !user.email) {
      console.error('Invalid user data:', user);
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email: user.email });
    if (existingUser) {
      console.log('User already exists:', existingUser);
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const newUser = {
      email: user.email,
      name: user.name,
      image: user.image,
      provider: user.provider,
      createdAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newUser);
    console.log('User created:', result);

    return NextResponse.json({ message: 'User created successfully', result }, { status: 201 });
  } catch (error) {
    console.error('Error during user creation:', error);
    return NextResponse.json({ error: 'Error during user creation' }, { status: 500 });
  }
}
