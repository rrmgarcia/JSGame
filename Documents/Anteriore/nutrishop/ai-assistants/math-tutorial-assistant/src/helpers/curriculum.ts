import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import UserProgress from '@/schema/userProgress';

interface Lesson {
  title: string;
  about: string;
}

interface Chapter {
  _id: ObjectId;
  chapterTitle: string;
  lessons: Lesson[];
}

interface Curriculum {
  _id: ObjectId;
  unitTitle: string;
  chapters: Chapter[];
}

interface UserProgress {
  userId: ObjectId;
  completedChapters: ObjectId[];
  currentChapter: ObjectId;
}

export async function fetchChapterDetails(chapterId: string): Promise<Chapter | null> {
  const client = await clientPromise;
  const db = client.db();
  const curriculum = await db.collection('curriculums').findOne({ 'chapters._id': new ObjectId(chapterId) });
  if (!curriculum) return null;

  const chapter = curriculum.chapters.find((ch: any) => ch._id.toString() === chapterId);
  return chapter ? (chapter as Chapter) : null;
}

export async function fetchAllCurriculums(): Promise<Curriculum[]> {
  const client = await clientPromise;
  const db = client.db();
  const curriculums = (await db.collection('curriculums').find().toArray()) as unknown as Curriculum[];
  return curriculums;
}

export async function fetchUserProgress(userId: string): Promise<UserProgress> {
  const client = await clientPromise;
  const db = client.db();
  const userProgress = (await db.collection('userProgress').findOne({ userId: new ObjectId(userId) })) as UserProgress | null;

  if (!userProgress) {
    return { userId: new ObjectId(userId), completedChapters: [], currentChapter: new ObjectId('667a0d6e43365af175fb7267') }; // Use valid ObjectId here
  }

  if (!Array.isArray(userProgress.completedChapters)) {
    userProgress.completedChapters = [];
  }

  return userProgress;
}

export async function generateFlexibleMapping(): Promise<{ [key: string]: string }> {
  const curriculums = await fetchAllCurriculums();
  const chapterMapping: { [key: string]: string } = {};

  curriculums.forEach((curriculum) => {
    curriculum.chapters.forEach((chapter) => {
      const chapterId = chapter._id.toString();
      const chapterTitle = chapter.chapterTitle.toLowerCase();
      chapterMapping[chapterTitle] = chapterId;
      chapterMapping[chapterTitle.split(':')[1]?.trim() || chapterTitle] = chapterId;
    });
  });

  return chapterMapping;
}
