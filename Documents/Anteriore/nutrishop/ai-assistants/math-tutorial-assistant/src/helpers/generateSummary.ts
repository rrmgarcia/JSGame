import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined");
}

export async function generateSummary(
  conversationPairs: string[]
): Promise<string[]> {
  const summaries = [];

  for (const pair of conversationPairs) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that summarizes conversations.",
          },
          {
            role: "user",
            content: `Please summarize the following conversation: ${pair}`,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const summary = response.choices?.[0]?.message?.content?.trim();
      if (summary) {
        summaries.push(summary);
      } else {
        summaries.push("No summary available.");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      summaries.push("Error generating summary.");
    }
  }

  return summaries;
}
