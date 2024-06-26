import mongoose, { Schema, Document } from 'mongoose';

interface Score {
  quizId: string;
  score: number;
  dateTaken: Date;
}

interface Timestamps {
  started: Date;
  completed: Date;
}

interface IUserProgress extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  completedChapters: mongoose.Schema.Types.ObjectId[];
  currentChapter: mongoose.Schema.Types.ObjectId;
  scores: Map<string, Score[]>;
  timestamps: Map<string, Timestamps>;
}

const scoreSchema = new Schema({
  quizId: { type: String, required: true },
  score: { type: Number, required: true },
  dateTaken: { type: Date, required: true },
});

const timestampsSchema = new Schema({
  started: { type: Date, required: true },
  completed: { type: Date, required: true },
});

const userProgressSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  completedChapters: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  currentChapter: { type: mongoose.Schema.Types.ObjectId, required: true },
  scores: { type: Map, of: [scoreSchema], default: {} },
  timestamps: { type: Map, of: timestampsSchema, default: {} },
});

const UserProgress = mongoose.models.UserProgress || mongoose.model<IUserProgress>('UserProgress', userProgressSchema);

export default UserProgress;
