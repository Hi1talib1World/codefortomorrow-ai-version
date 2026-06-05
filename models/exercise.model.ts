import mongoose, { Document, Types } from 'mongoose';

export interface IExercise extends Document {
  lesson: Types.ObjectId; // Reference to Lesson
  instruction: string;
  starterCode?: string;
  solutionCode?: string;
  expectedOutput?: string;
  createdAt: Date;
  updatedAt: Date;
}

const exerciseSchema = new mongoose.Schema<IExercise>(
  {
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    instruction: { type: String, required: true },
    starterCode: { type: String },
    solutionCode: { type: String },
    expectedOutput: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IExercise>('Exercise', exerciseSchema);
