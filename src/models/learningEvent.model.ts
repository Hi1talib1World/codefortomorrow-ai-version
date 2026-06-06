import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningEvent extends Document {
  event_id: string;
  student_id: string;
  school_id: string;
  region: string;
  skill_id: string;
  event_type: 'submission' | 'quiz' | 'assessment' | 'feedback';
  payload: Record<string, any>;
  raw_score: number | null;
  error_codes: string[];
  received_at: Date;
  processed_at: Date | null;
  outcome: 'success' | 'failure' | 'partial';
}

const learningEventSchema = new Schema(
  {
    event_id: { type: String, required: true, unique: true, index: true },
    student_id: { type: String, required: true, index: true },
    school_id: { type: String, required: true, index: true },
    region: { type: String, required: true, index: true },
    skill_id: { type: String, required: true, index: true },
    event_type: {
      type: String,
      required: true,
      enum: ['submission', 'quiz', 'assessment', 'feedback'],
    },
    payload: {
      type: Schema.Types.Mixed,
      default: {},
    },
    raw_score: { type: Number, default: null },
    error_codes: { type: [String], default: [] },
    received_at: { type: Date, required: true, default: () => new Date() },
    processed_at: { type: Date, default: null },
    outcome: {
      type: String,
      required: true,
      enum: ['success', 'failure', 'partial'],
    },
  },
  {
    collection: 'learning_events',
    timestamps: false,
  }
);

const LearningEvent = mongoose.models.LearningEvent || mongoose.model<ILearningEvent>('LearningEvent', learningEventSchema);
export default LearningEvent;
