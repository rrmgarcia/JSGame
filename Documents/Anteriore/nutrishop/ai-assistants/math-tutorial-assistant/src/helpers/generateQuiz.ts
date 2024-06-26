import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined");
}

export async function generateQuiz(
  conversationPairs: string[]
): Promise<string[]> {
  const quizzes = [];

  for (const pair of conversationPairs) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that creates mathematical problem solving quizzes.",
          },
          {
            role: "user",
            content: `Create a quiz based on the most recent lesson or topic discussed: ${pair}`,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const quiz = response.choices?.[0]?.message?.content?.trim();
      if (quiz) {
        quizzes.push(quiz);
      } else {
        quizzes.push("No Quiz available.");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      quizzes.push("Error generating quiz.");
    }
  }

  return quizzes;
}
