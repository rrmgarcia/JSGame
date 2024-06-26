import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const { name } = data;

    if (!name) {
      console.error('Invalid name data:', name);
      return NextResponse.json({ error: 'Invalid name data' }, { status: 400 });
    }

    const email = session.user.email;
    console.log({ email });

    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email });
    if (!existingUser) {
      console.error('User does not exist:', email);
      return NextResponse.json({ error: 'User does not exist' }, { status: 400 });
    }

    const result = await db.collection('users').updateOne({ email }, { $set: { name } });
    console.log('User updated:', result);

    return NextResponse.json({ message: 'User name updated successfully', result }, { status: 200 });
  } catch (error) {
    console.error('Error during user name update:', error);
    return NextResponse.json({ error: 'Error during user name update' }, { status: 500 });
  }
}
