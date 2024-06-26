import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      console.error('Invalid message data:', messages);
      return NextResponse.json({ error: 'Invalid message data' }, { status: 400 });
    }

    messages.push({
      role: 'system',
      content: 'You are a helpful assistant specializing in algebra basics from Khan Academy. Format your responses using markdown.',
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages,
      stream: false,
      temperature: 1,
    });

    return NextResponse.json({ message: response.choices[0].message.content }, { status: 200 });
  } catch (error) {
    console.error('Error during OpenAI request:', error);
    return NextResponse.json({ error: 'Error during OpenAI request' }, { status: 500 });
  }
}
