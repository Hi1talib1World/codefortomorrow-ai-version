import mongoose, { Document, Types } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description?: string;
  lessons: Types.ObjectId[]; // reference to Lesson ObjectIds
  owner: Types.ObjectId; // reference to User
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new mongoose.Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>('Course', courseSchema);
