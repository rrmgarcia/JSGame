import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";
import { generateMathContext } from "@/lib/chat.contexts";
import { generateSummary } from "@/helpers/generateSummary";
import NodeCache from "node-cache";
import { generateQuiz } from "@/helpers/generateQuiz";
// import { fetchUnitDetails, fetchUserProgress } from '@/helpers/curriculum';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined");
}

type Message = {
  role: string;
  content: string;
  createdAt: string;
};

type Conversation = {
  _id: ObjectId;
  conversationID: string;
  userID: string;
  messages: Message[];
  total: number;
  summary: string[];
};

const responseCache = new NodeCache({ stdTTL: 300 });

// export async function POST(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//     }

//     const client = await clientPromise;
//     const db = client.db();

//     const { messages, chatContext, conversationID } = await req.json();
//     const userID = session.user.id;

//     if (!messages) {
//       return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
//     }

//     const userMessage = messages[messages.length - 1].content;

//     // check cache first
//     const cachedResponse = responseCache.get(userMessage);
//     if (cachedResponse) {
//       return NextResponse.json(
//         {
//           conversationID: conversationID || new ObjectId().toString(),
//           message: cachedResponse,
//         },
//         { status: 200 }
//       );
//     }

//     let conversationHistory: Message[] = [];
//     let newConversationID = conversationID || new ObjectId().toString();

//     if (conversationID) {
//       const existingConversation = await db.collection('conversations').findOne({ conversationID, userID });
//       if (existingConversation) {
//         conversationHistory = existingConversation.messages;
//       }
//     }

//     let context = '';
//     if (chatContext === 'math') {
//       context = await generateMathContext(messages, userID);
//     }

//     // Avoid duplication
//     const systemMessageExists = messages.some((msg: any) => msg.role === 'system' && msg.content.includes('You are a math tutor'));
//     if (!systemMessageExists) {
//       messages.push({
//         role: 'system',
//         content: context,
//       });
//     }

//     const completeMessages = [...conversationHistory, ...messages];

//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo-0125',
//       messages: completeMessages,
//       stream: false,
//       temperature: 1,
//     });

//     const assistantMessage: Message = {
//       role: 'assistant',
//       content: response.choices?.[0]?.message?.content ?? '',
//       createdAt: new Date().toISOString(),
//     };

//     completeMessages.push(assistantMessage);

//     const conversationPairs = [];
//     for (let i = 0; i < completeMessages.length; i++) {
//       if (completeMessages[i].role === 'user') {
//         const question = completeMessages[i].content;
//         const answer = completeMessages[i + 1]?.role === 'assistant' ? completeMessages[i + 1].content : '';
//         conversationPairs.push(`${question}\n${answer}`);
//       }
//     }

//     const summaries = await generateSummary(conversationPairs);
//     const quizzes = await generateQuiz(conversationPairs);

//     await db.collection('conversations').updateOne(
//       { conversationID: newConversationID, userID },
//       {
//         $set: {
//           conversationID: newConversationID,
//           userID,
//           messages: completeMessages,
//           total: completeMessages.length,
//           summary: summaries,
//           quiz: quizzes,
//         },
//       },
//       { upsert: true }
//     );

//     // cache the response
//     responseCache.set(userMessage, assistantMessage.content);

//     return NextResponse.json(
//       {
//         conversationID: newConversationID,
//         message: assistantMessage.content,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error in POST request (conversations):', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { messages, userId } = data;

    const context = await generateMathContext(messages, userId);
    return new Response(JSON.stringify({ context }), { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
