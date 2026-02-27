
import mongoose, { Schema, Document } from 'mongoose';

// Interface to define the structure of a Progress document for TypeScript
export interface IProgress extends Document {
  xp: number;
  streak: number;
  completedLessons: Map<string, number[]>;
  scores: Map<string, number>;
  badgesEarned: Map<string, string[]>;
  lastLessonCompletedDate: Date | null;
}

const progressSchema: Schema = new Schema({
  // Note: We don't need a reference back to the User here because
  // the User model will hold the reference to this document.
  xp: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  completedLessons: {
    type: Map,
    of: [Number],
    default: {},
  },
  scores: {
    type: Map,
    of: Number,
    default: {},
  },
  badgesEarned: {
    type: Map,
    of: [String],
    default: {},
  },
  lastLessonCompletedDate: {
    type: Date,
    default: null,
  },
});

const Progress = mongoose.model<IProgress>('Progress', progressSchema);

export default Progress;
