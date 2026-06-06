import mongoose, { Document, Types } from 'mongoose';

export interface ISubmission extends Document {
  user: Types.ObjectId; // Reference to User
  exercise: Types.ObjectId; // Reference to Exercise
  submittedCode: string;
  score?: number;
  status: 'passed' | 'failed' | 'pending';
  output?: string;
  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema = new mongoose.Schema<ISubmission>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    submittedCode: { type: String, required: true },
    score: { type: Number },
    status: { type: String, enum: ['passed', 'failed', 'pending'], default: 'pending' },
    output: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ISubmission>('Submission', submissionSchema);
