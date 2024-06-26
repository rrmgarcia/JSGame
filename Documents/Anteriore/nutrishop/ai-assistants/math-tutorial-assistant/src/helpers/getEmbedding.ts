import OpenAI from 'openai';

export async function getEmbedding(message: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  try {
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      encoding_format: 'float',
      input: message,
    });

    const embedding = embeddingResponse.data[0].embedding;
    return embedding;
  } catch (error) {
    console.error('Error getting embedding', error);
  }
}
