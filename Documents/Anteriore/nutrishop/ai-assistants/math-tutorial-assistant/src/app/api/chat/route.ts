import { type CoreMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { generateSummary } from '@/helpers/generateSummary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateMathContext } from '@/lib/chat.contexts';

type Message = {
  role: string;
  content: string;
  createdAt: string;
};

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// export async function POST(req: NextRequest) {
//   const { messages, userID, conversationID } = await req.json();

//   // Establish MongoDB connection
//   const client = await clientPromise;
//   const db = client.db('test');
//   const collection = db.collection('conversations');

//   try {
//     let newConversationID = conversationID;

//     const result = await streamText({
//       model: openai('gpt-4'),
//       system: 'You are a math assistant. You will only answer math related queries.',
//       messages,
//     });

//     if (conversationID) {
//       // Update the existing conversation by appending new messages
//       const updateResult = await collection.updateOne({ userID, conversationID }, { $push: { messages: { $each: messages } } });

//       if (updateResult.matchedCount === 0) {
//         // If no document was found, create a new one
//         newConversationID = new ObjectId().toString();
//         await collection.insertOne({ conversationID: newConversationID, userID, messages, createdAt: new Date() });
//       }
//     } else {
//       // Generate a new conversation ID and create a new conversation document
//       newConversationID = new ObjectId().toString();
//       await collection.insertOne({ conversationID: newConversationID, userID, messages, createdAt: new Date() });
//     }

//     console.log('messages backend: ', messages);

//     return result.toAIStreamResponse();
//   } catch (error) {
//     console.error('Error storing messages in MongoDB:', error);
//     return new Response('Internal Server Error', { status: 500 });
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const { messages, chatContext, conversationID } = await req.json();
    const userID = session.user.id;

    if (!messages) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let conversationHistory: Message[] = [];
    let newConversationID = conversationID || new ObjectId().toString();

    if (conversationID) {
      const existingConversation = await db.collection('conversations').findOne({ conversationID, userID });
      if (existingConversation) {
        conversationHistory = existingConversation.messages;
      }
    }

    let context = '';
    if (chatContext === 'math') {
      context = await generateMathContext(messages, userID);
    }

    if (!context) {
      context =
        'You are a math tutor, an expert in all math lessons, topics, and subjects. You assist users with anything related to math. You will only answer math-related questions. You explain mathematical problems. You will create ten-item problem-solving quizzes for the user when they ask for it. You will check the answers of the user and provide their score after checking. You also recommend math topics to users based on the recent topic discussed.';
    }

    const systemMessageExists = messages.some((msg: any) => msg.role === 'system' && msg.content.includes('You are a math tutor'));
    if (!systemMessageExists) {
      messages.push({
        role: 'system',
        content: context,
      });
    }

    const completeMessages = [...conversationHistory, ...messages];

    const result = await streamText({
      model: openai('gpt-4'),
      system: 'You are a math assistant. You will only answer math related queries.',
      messages: completeMessages,
    });

    let assistantMessageContent = '';
    for await (const part of result.textStream) {
      assistantMessageContent += part;
    }

    const createdAt = new Date().toISOString();
    const assistantMessage: CoreMessage & { createdAt: string } = {
      role: 'assistant',
      content: assistantMessageContent,
      createdAt,
    };

    completeMessages.push(assistantMessage);

    const conversationPairs = [];
    for (let i = 0; i < completeMessages.length; i++) {
      if (completeMessages[i].role === 'user') {
        const question = completeMessages[i].content;
        const answer = completeMessages[i + 1]?.role === 'assistant' ? completeMessages[i + 1].content : '';
        conversationPairs.push(`${question}\n${answer}`);
      }
    }

    const summaries = await generateSummary(conversationPairs);

    await db.collection('conversations').updateOne(
      { conversationID: newConversationID, userID },
      {
        $set: {
          conversationID: newConversationID,
          userID,
          messages: completeMessages,
          total: completeMessages.length,
          summary: summaries,
        },
      },
      { upsert: true }
    );

    console.log('Updated conversation with ID:', newConversationID);
    return result.toAIStreamResponse();
  } catch (error) {
    console.error('Error storing messages in MongoDB:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}