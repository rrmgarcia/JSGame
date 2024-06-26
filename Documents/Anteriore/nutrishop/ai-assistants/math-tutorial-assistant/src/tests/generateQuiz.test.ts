import { generateQuiz } from '@/helpers/generateQuiz';
import OpenAI from 'openai';

jest.mock('openai');

describe('generateQuiz', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a quiz based on chapter details', async () => {
    const mockOpenAIResponse = {
      choices: [{ message: { content: 'Question 1: What is 2+2?' } }],
    };
    OpenAI.prototype.chat.completions.create = jest.fn().mockResolvedValue(mockOpenAIResponse);

    const chapters = [
      {
        chapterTitle: 'Chapter 1',
        lessons: [{ title: 'Lesson 1', about: 'Introduction' }],
      },
    ];

    const quiz = await generateQuiz(chapters);
    expect(quiz).toEqual(['Question 1: What is 2+2?']);
    expect(OpenAI.prototype.chat.completions.create).toHaveBeenCalled();
  });
});
