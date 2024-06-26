import { POST as conversationPost } from '@/app/api/conversations/route';
import { generateMathContext } from '@/lib/chat.contexts';
import { fetchUserProgress, fetchUnitDetails } from '@/helpers/curriculum';
import { generateQuiz } from '@/helpers/generateQuiz';
import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

// Mocking modules
jest.mock('@/helpers/curriculum', () => ({
  fetchUserProgress: jest.fn(),
  fetchUnitDetails: jest.fn(),
}));

jest.mock('@/lib/chat.contexts', () => ({
  generateMathContext: jest.fn(),
}));

jest.mock('@/helpers/generateQuiz', () => ({
  generateQuiz: jest.fn(() => Promise.resolve(['Quiz question 1'])),
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock environment variables for the test
process.env.GOOGLE_CLIENT_ID = 'your-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'your-client-secret';

// Define mock for clientPromise
const mockDb = {
  collection: jest.fn().mockReturnValue({
    updateOne: jest.fn(),
    findOne: jest.fn(),
  }),
};

const mockClient = {
  db: jest.fn().mockReturnValue(mockDb),
};

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve(mockClient)),
}));

describe('Conversation API POST', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle "generate quiz" message and return the first quiz question', async () => {
    const mockUserSession = { user: { id: '60af884b5096421b25674632' } }; // Valid ObjectId string
    (getServerSession as jest.Mock).mockResolvedValue(mockUserSession);

    const mockUserProgress = {
      userId: new ObjectId('60af884b5096421b25674632'), // Valid ObjectId string
      completedUnits: [],
      currentUnit: new ObjectId('60af884b5096421b25674633'), // Valid ObjectId string
    };
    (fetchUserProgress as jest.Mock).mockResolvedValue(mockUserProgress);

    const mockUnitDetails = {
      _id: new ObjectId('60af884b5096421b25674633'), // Valid ObjectId string
      unitTitle: 'Unit 1',
      chapters: [{ chapterTitle: 'Chapter 1', lessons: [{ title: 'Lesson 1', about: 'Intro' }] }],
    };
    (fetchUnitDetails as jest.Mock).mockResolvedValue(mockUnitDetails);

    (generateQuiz as jest.Mock).mockResolvedValue(['Quiz question 1']);

    const req = new NextRequest('http://localhost:3000/api/conversation', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'generate test' }],
        chatContext: 'math',
      }),
    });

    const res = await conversationPost(req);
    const jsonResponse = await res.json();

    expect(res.status).toBe(200);
    expect(jsonResponse.message).toContain('Here is your first question: Quiz question 1');
    expect(mockDb.collection('userProgress').updateOne).toHaveBeenCalledWith(
      { userId: new ObjectId('60af884b5096421b25674632') },
      { $set: { currentQuiz: ['Quiz question 1'], currentQuestionIndex: 0, quizScore: 0 } }
    );
  });
});
