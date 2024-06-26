// Mock environment variables
process.env.GOOGLE_CLIENT_ID = 'your-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'your-client-secret';
process.env.OPENAI_API_KEY = 'your-openai-api-key';

// Mock the next-auth module
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() => Promise.resolve({ user: { id: 'testUserId' } })),
}));

// Mock the authOptions module
jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

// Mock the OpenAI client
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: jest.fn(() => ({
              choices: [{ message: { content: 'Quiz question 1' } }],
            })),
          },
        },
        embeddings: {
          create: jest.fn(() => ({
            data: [{ embedding: [0.1, 0.2, 0.3] }],
          })),
        },
      };
    }),
  };
});
