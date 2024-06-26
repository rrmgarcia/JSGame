import { AssistantResponse } from "ai";
import OpenAI from "openai";
import clientPromise from "@/lib/mongodb";
import { generateSummary } from "@/helpers/generateSummary";
import { MessagesPage } from "openai/resources/beta/threads/messages.mjs";
import { generateMathContext } from "@/lib/chat.contexts";
import { generateQuiz } from "@/helpers/generateQuiz";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db();

  try {
    const input: {
      userId: string;
      conversationID: string | null;
      message: string;
    } = await req.json();
    console.log("Received input:", input);

    const conversationID =
      input.conversationID ?? (await openai.beta.threads.create({})).id;

    const createdMessage = await openai.beta.threads.messages.create(
      conversationID,
      {
        role: "user",
        content: input.message,
      }
    );

    const conversation = await db
      .collection("conversations")
      .findOne({ conversationID });
    let conversationHistory: any[] = [];
    if (conversation) {
      conversationHistory = conversation.messages;
    } else {
      await db.collection("conversations").insertOne({
        conversationID,
        userID: input.userId,
        messages: [],
        summary: [],
        total: 0,
        createdAt: new Date(),
      });
    }

    const userMessage = {
      role: "user",
      content: input.message,
      createdAt: new Date().toISOString(),
    };
    conversationHistory.push(userMessage);

    // math context
    const mathContext = await generateMathContext(
      conversationHistory,
      input.userId
    );

    const assistant = await openai.beta.assistants.create({
      name: "Math Tutor",
      instructions: mathContext,
      tools: [
        {
          type: "function",
          function: {
            name: "generateQuiz",
            description:
              "Generate a mathematical problem solving test based on the recent topic discussed",
            parameters: {
              type: "object",
              properties: {
                conversationPairs: {
                  type: "string",
                  description: "The recent math topic discussed.",
                },
              },
              required: ["topic"],
            },
          },
        },
        { type: "code_interpreter" },
      ],
      model: "gpt-4o",
    });
    return AssistantResponse(
      { threadId: conversationID, messageId: createdMessage.id },
      async ({ forwardStream }) => {
        try {
          const runStream = openai.beta.threads.runs.stream(conversationID, {
            assistant_id: assistant.id,
          });

          let runResult: any = (await forwardStream(runStream)) ?? {};

          while (
            runResult?.status === "requires_action" &&
            runResult.required_action?.type === "submit_tool_outputs"
          ) {
            const tool_outputs =
              runResult.required_action.submit_tool_outputs.tool_calls.map(
                (toolCall: any) => {
                  const parameters = JSON.parse(toolCall.function.arguments);
                  switch (toolCall.function.name) {
                    case "generateQuiz":
                      const topic = parameters.conversationPairs;
                      return {
                        function: toolCall.function,
                        output: generateQuiz(topic),
                      };
                    default:
                      throw new Error(
                        `Unknown tool call function: ${toolCall.function.name}`
                      );
                  }
                }
              );
            runResult = await forwardStream(
              openai.beta.threads.runs.submitToolOutputsStream(
                conversationID,
                runResult.id,
                { tool_outputs }
              )
            );
          }

          let assistantMessageContent = "";

          try {
            const assistantResponse: MessagesPage =
              await openai.beta.threads.messages.list(conversationID);

            assistantMessageContent =
              assistantResponse.data
                .filter((message: any) => message.role === "assistant")
                .map((message: any) =>
                  message.content
                    .map((segment: any) => segment.text.value)
                    .join(" ")
                )
                .join(" ") || "No response received";
          } catch (fetchError) {
            console.error("Error fetching assistant response:", fetchError);
          }

          const assistantMessage = {
            role: "assistant",
            content: assistantMessageContent,
            createdAt: new Date().toISOString(),
          };
          conversationHistory.push(assistantMessage);

          const conversationPairs = [];
          for (let i = 0; i < conversationHistory.length; i++) {
            if (conversationHistory[i].role === "user") {
              const question = conversationHistory[i].content;
              const answer =
                conversationHistory[i + 1]?.role === "assistant"
                  ? conversationHistory[i + 1].content
                  : "";
              conversationPairs.push(`${question}\n${answer}`);
            }
          }

          console.log(conversationHistory);

          const summaries = await generateSummary(conversationPairs);

          await db.collection("conversations").updateOne(
            { conversationID },
            {
              $set: {
                messages: conversationHistory,
                total: conversationHistory.length,
                summary: summaries,
              },
            }
          );
        } catch (innerError) {
          console.error("Error within AssistantResponse:", innerError);
          throw innerError;
        }
      }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
