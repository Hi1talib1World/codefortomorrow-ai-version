import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'lesson_completed' | 'streak_at_risk' | 'leaderboard_rank_change' | 'course_unlocked' | 'general';
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['lesson_completed', 'streak_at_risk', 'leaderboard_rank_change', 'course_unlocked', 'general'],
    default: 'general',
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;
