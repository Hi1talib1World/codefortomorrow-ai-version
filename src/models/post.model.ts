import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  _id?: mongoose.Types.ObjectId | string;
  author: mongoose.Types.ObjectId;
  content: string;
  isAnswer?: boolean;
  isEndorsed?: boolean;
  createdAt: Date;
}

export interface IMilestone {
  type: 'lesson' | 'streak' | 'xp' | 'level' | 'general';
  title: string;
  value: string | number;
}

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  content: string;
  postType: 'general' | 'question' | 'milestone' | 'challenge';
  isSolved: boolean;
  codeSnippet?: {
    code: string;
    language: string;
  };
  milestone?: IMilestone;
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema: Schema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  isAnswer: {
    type: Boolean,
    default: false,
  },
  isEndorsed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const milestoneSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['lesson', 'streak', 'xp', 'level', 'general'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

const postSchema: Schema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  postType: {
    type: String,
    enum: ['general', 'question', 'milestone', 'challenge'],
    default: 'general',
  },
  isSolved: {
    type: Boolean,
    default: false,
  },
  codeSnippet: {
    code: { type: String },
    language: { type: String },
  },
  milestone: {
    type: milestoneSchema,
    required: false,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [commentSchema],
}, {
  timestamps: true,
});

const Post = mongoose.model<IPost>('Post', postSchema);
export default Post;
