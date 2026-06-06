import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  title: string;
  slug: string;
  type: 'post' | 'announcement' | 'featured';
  status: 'draft' | 'live';
  body: string;
  coverImageUrl?: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema = new Schema<IContent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: {
      type: String,
      enum: ['post', 'announcement', 'featured'],
      default: 'post',
    },
    status: {
      type: String,
      enum: ['draft', 'live'],
      default: 'draft',
    },
    body: { type: String, default: '' },
    coverImageUrl: { type: String },
    tags: { type: [String], default: [] },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

// Optimizing for content queries
contentSchema.index({ type: 1, status: 1 });
contentSchema.index({ author: 1 });

// Auto-generate slug from title before validate
contentSchema.pre('validate', function (this: IContent, next: (err?: Error) => void) {
  if (this.isModified('title') && !this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now();
  }
  next();
});


const Content = mongoose.model<IContent>('Content', contentSchema);
export default Content;
