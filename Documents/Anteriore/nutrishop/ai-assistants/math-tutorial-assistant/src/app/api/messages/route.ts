import { generateMathContext } from '@/lib/chat.contexts';
import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined');
}

export async function POST(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db('test');
  const { messages, conversationID, chatContext, userID } = await req.json();

  if (!messages || !conversationID) {
    return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
  }

  let context = ''; // Initialize context with an empty string

  if (chatContext === 'math') {
    context = await generateMathContext(messages, userID);
  }

  messages.push({
    role: 'system',
    content: context,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages,
    stream: false,
    temperature: 1,
  });

  messages.push({
    role: 'assistant',
    content: response.choices[0].message.content,
  });

  const conversationResponse = await fetch(`http://localhost:3000/api/conversations?id=${conversationID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
    }),
  });

  if (!conversationResponse.ok) {
    console.error('Failed to save conversation', await conversationResponse.text());
    return NextResponse.json({ message: 'Failed to save conversation.' }, { status: 500 });
  }

  return NextResponse.json({ message: response.choices[0].message }, { status: 200 });
}
