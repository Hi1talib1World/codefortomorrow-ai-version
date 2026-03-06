import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityStep {
  title: string;
  description: string;
  duration?: number; // in minutes
}

export interface IActivity extends Document {
  title: string;
  description: string;
  teacher: mongoose.Types.ObjectId;
  targetGrade: string;
  duration: number; // total duration in minutes
  materials: string[];
  steps: IActivityStep[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityStepSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number },
});

const ActivitySchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetGrade: { type: String, required: true },
  duration: { type: Number, required: true },
  materials: { type: [String], default: [] },
  steps: { type: [ActivityStepSchema], required: true },
  isPublic: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
