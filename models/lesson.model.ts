import mongoose, { Document, Types } from 'mongoose';

export interface ILesson extends Document {
  course: Types.ObjectId; // Reference to Course
  title: string;
  description?: string;
  exercises: Types.ObjectId[]; // Reference to Exercises
  xp: number;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new mongoose.Schema<ILesson>(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
    xp: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export default mongoose.model<ILesson>('Lesson', lessonSchema);
