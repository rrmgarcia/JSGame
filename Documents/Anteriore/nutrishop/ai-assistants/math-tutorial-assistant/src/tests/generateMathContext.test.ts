import { generateMathContext } from '@/lib/chat.contexts';
import { fetchAllCurriculums, fetchUnitDetails, fetchUserProgress, generateFlexibleMapping } from '@/helpers/curriculum';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

jest.mock('@/helpers/curriculum', () => ({
  fetchAllCurriculums: jest.fn(),
  fetchUnitDetails: jest.fn(),
  fetchUserProgress: jest.fn(),
  generateFlexibleMapping: jest.fn(),
}));

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(),
}));

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

describe('generateMathContext', () => {
  const mockMessages: Message[] = [{ role: 'user', content: "Follow Assistant's Curriculum" }];
  const userId = '60af884b5096421b25674632'; // Valid ObjectId string

  beforeEach(() => {
    jest.clearAllMocks();
    (clientPromise as unknown as jest.Mock).mockResolvedValue({
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          findOne: jest.fn(),
          find: jest.fn().mockReturnValue({
            toArray: jest.fn(),
          }),
        }),
      }),
    });
  });

  it('should return a list of all units for a new user', async () => {
    const mockCurriculums = [
      { unitTitle: 'Unit 1: Foundations' },
      { unitTitle: 'Unit 2: Algebraic expressions' },
      // Add more units as needed
    ];
    (fetchAllCurriculums as jest.Mock).mockResolvedValue(mockCurriculums);

    const context = await generateMathContext(mockMessages, userId);

    expect(fetchAllCurriculums).toHaveBeenCalledTimes(1);
    expect(context).toContain('Here are the available units:');
    expect(context).toContain('- **Unit 1: Foundations**');
    expect(context).toContain('- **Unit 2: Algebraic expressions**');
  });

  it('should handle errors gracefully when fetching curriculums', async () => {
    (fetchAllCurriculums as jest.Mock).mockRejectedValue(new Error('Failed to fetch curriculums'));

    const context = await generateMathContext(mockMessages, userId);

    expect(fetchAllCurriculums).toHaveBeenCalledTimes(1);
    expect(context).toContain('Sorry, I could not retrieve the curriculum at this time.');
  });

  it('should handle errors gracefully when fetching user progress', async () => {
    const mockUnitMapping = { 'unit 1': '666bbb61821052c7cd6f4929' };
    (generateFlexibleMapping as jest.Mock).mockResolvedValue(mockUnitMapping);
    const mockMessagesWithUnit: Message[] = [{ role: 'user', content: 'Tell me about unit 1' }];
    (fetchUserProgress as jest.Mock).mockRejectedValue(new Error('Failed to fetch user progress'));

    const context = await generateMathContext(mockMessagesWithUnit, userId);

    expect(fetchUserProgress).toHaveBeenCalledTimes(1);
    expect(context).toContain('Sorry, an error occurred while processing your request.');
  });
});
