import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsCache extends Document {
  key: string;
  data: any;
  updatedAt: Date;
}

const AnalyticsCacheSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true, index: true },
  data: { type: Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

export default mongoose.model<IAnalyticsCache>('AnalyticsCache', AnalyticsCacheSchema);
export { AnalyticsCacheSchema };
