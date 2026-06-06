import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedbackPacket extends Document {
  packet_id: string;
  student_id: string;
  school_id: string;
  region: string;
  skill_id: string;
  source: 'student' | 'teacher' | 'ai' | 'peer';
  feedback_text: string;
  rating: number;
  created_at: Date;
  metadata: Record<string, any>;
}

const feedbackPacketSchema = new Schema(
  {
    packet_id: { type: String, required: true, unique: true, index: true },
    student_id: { type: String, required: true, index: true },
    school_id: { type: String, required: true, index: true },
    region: { type: String, required: true, index: true },
    skill_id: { type: String, required: true, index: true },
    source: {
      type: String,
      required: true,
      enum: ['student', 'teacher', 'ai', 'peer'],
      default: 'ai',
    },
    feedback_text: { type: String, required: true },
    rating: { type: Number, min: 0, max: 1, default: 0 },
    created_at: { type: Date, required: true, default: () => new Date() },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    collection: 'feedback_packets',
    timestamps: false,
  }
);

const FeedbackPacket = mongoose.models.FeedbackPacket || mongoose.model<IFeedbackPacket>('FeedbackPacket', feedbackPacketSchema);
export default FeedbackPacket;
