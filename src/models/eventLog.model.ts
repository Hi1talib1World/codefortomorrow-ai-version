import mongoose, { Schema, Document } from 'mongoose';

export interface IEventLog extends Document {
  eventName: string;
  payload: any;
  status: 'pending' | 'success' | 'failed';
  traceId: string;
  attempts: number;
  maxAttempts: number;
  error?: string;
  timestamp: Date;
}

const EventLogSchema: Schema = new Schema({
  eventName: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed'], 
    default: 'pending',
    required: true 
  },
  traceId: { type: String, required: true, index: true },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 3 },
  error: { type: String },
  timestamp: { type: Date, default: Date.now, required: true },
});

// Clean JSON serialization to keep responses light and clean
EventLogSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model<IEventLog>('EventLog', EventLogSchema);
export { EventLogSchema };
