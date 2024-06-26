import { generateMathContext } from '@/lib/chat.contexts';
import { fetchAllCurriculums, fetchUserProgress, fetchUnitDetails, generateFlexibleMapping } from '@/helpers/curriculum';
import { ObjectId } from 'mongodb';

jest.mock('@/helpers/curriculum', () => ({
  fetchUserProgress: jest.fn(),
  fetchAllCurriculums: jest.fn(() => [
    { _id: '666bbb61821052c7cd6f4929', unitTitle: 'Unit 1: Foundations', chapters: [] },
    { _id: '666bbba7821052c7cd6f496e', unitTitle: 'Unit 2: Algebraic expressions', chapters: [] },
  ]),
  fetchUnitDetails: jest.fn((unitId: string) => {
    if (unitId === '666bbb61821052c7cd6f4929') {
      return { _id: '666bbb61821052c7cd6f4929', unitTitle: 'Unit 1: Foundations', chapters: [] };
    } else if (unitId === '666bbba7821052c7cd6f496e') {
      return { _id: '666bbba7821052c7cd6f496e', unitTitle: 'Unit 2: Algebraic expressions', chapters: [] };
    }
    return null;
  }),
  generateFlexibleMapping: jest.fn(async () => ({
    'unit 1: foundations': '666bbb61821052c7cd6f4929',
    'unit 2: algebraic expressions': '666bbba7821052c7cd6f496e',
  })),
}));

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

describe('generateMathContext', () => {
  it('provides a brief overview of other units with quiz restriction', async () => {
    const messages: Message[] = [{ role: 'user', content: 'Tell me about Unit 2' }];
    const userId = 'someUserId';
    (fetchUserProgress as jest.Mock).mockResolvedValue({ completedUnits: [] });

    const context = await generateMathContext(messages, userId);

    expect(context).toContain('Unit 2: Algebraic expressions');
    expect(context).toContain('You must complete Unit 1 quiz first to access quizzes for other units.');
  });

  it('allows access to quizzes if the user has completed Unit 1', async () => {
    const messages: Message[] = [{ role: 'user', content: 'Give me the quiz for Unit 2' }];
    const userId = 'someUserId';
    (fetchUserProgress as jest.Mock).mockResolvedValue({ completedUnits: [new ObjectId('666bbb61821052c7cd6f4929')] });

    const context = await generateMathContext(messages, userId);

    expect(context).toContain("This conversation is based on the unit titled 'Unit 2: Algebraic expressions'");
  });

  it('restricts access to quizzes if the user has not completed the previous unit quiz', async () => {
    const messages: Message[] = [{ role: 'user', content: 'Give me the quiz for Unit 2' }];
    const userId = 'someUserId';
    (fetchUserProgress as jest.Mock).mockResolvedValue({ completedUnits: [] });

    const context = await generateMathContext(messages, userId);

    expect(context).toContain('You must complete Unit 1 quiz first to access quizzes for other units.');
  });

  it('returns error message if unit details fetching fails', async () => {
    const messages: Message[] = [{ role: 'user', content: 'Tell me about Unit 2' }];
    const userId = 'someUserId';
    (fetchUnitDetails as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Fetching failed');
    });

    const context = await generateMathContext(messages, userId);

    expect(context).toContain('Sorry, an error occurred while processing your request.');
  });
});
