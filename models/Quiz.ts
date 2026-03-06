import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface IQuiz extends Document {
  title: string;
  description: string;
  teacher: mongoose.Types.ObjectId;
  questions: IQuizQuestion[];
  assignedClasses: string[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuizQuestionSchema: Schema = new Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
});

const QuizSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  questions: { type: [QuizQuestionSchema], required: true },
  assignedClasses: { type: [String], default: [] },
  dueDate: { type: Date },
}, { timestamps: true });

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
