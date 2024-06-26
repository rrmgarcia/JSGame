import clientPromise from '@/lib/mongodb';

export async function vectorSearch(embedding: number[]) {
  try {
    const client = await clientPromise;
    const db = client.db('test');

    const pipeline = [
      {
        $search: {
          index: 'vector_index',
          knnBeta: {
            vector: embedding,
            path: 'embedding',
            k: 5,
          },
        },
      },
      {
        $project: {
          embedding: 0,
        },
      },
    ];

    const documents = await db.collection('curriculums').aggregate(pipeline).toArray();
    return documents;
  } catch (error) {
    console.error('Error occurred during vector search:', error);
    throw new Error('Failed to perform vector search');
  }
}
