import mongoose, { Document, Types } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description?: string;
  lessons: string[]; // could be lesson IDs or titles
  owner: Types.ObjectId; // reference to User
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new mongoose.Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String },
    lessons: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>('Course', courseSchema);
