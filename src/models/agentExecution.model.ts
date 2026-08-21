import mongoose, { Schema, Document } from 'mongoose';

export interface IAgentExecution extends Document {
  executionId: string;
  agentId: string;
  agentName: string;
  task: string;
  status: 'success' | 'failed' | 'requires_human_approval' | 'pending';
  inputData: any;
  outputData: any;
  errorDetails?: string;
  startedAt: Date;
  completedAt?: Date;
  latencyMs: number;
  aiModel: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  userId?: string;
  userRole?: string;
  logs: Array<{ timestamp: Date; message: string; level: string }>;
  createdAt: Date;
  updatedAt: Date;
}

const AgentExecutionSchema: Schema = new Schema(
  {
    executionId: { type: String, required: true, unique: true, index: true },
    agentId: { type: String, required: true, index: true },
    agentName: { type: String, required: true },
    task: { type: String, required: true },
    status: {
      type: String,
      enum: ['success', 'failed', 'requires_human_approval', 'pending'],
      default: 'pending',
      index: true
    },
    inputData: { type: Schema.Types.Mixed },
    outputData: { type: Schema.Types.Mixed },
    errorDetails: { type: String },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    latencyMs: { type: Number, default: 0 },
    aiModel: { type: String, default: 'gemini-2.5-flash' },
    inputTokens: { type: Number, default: 0 },
    outputTokens: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
    estimatedCostUsd: { type: Number, default: 0 },
    userId: { type: String, index: true },
    userRole: { type: String },
    logs: [
      {
        timestamp: { type: Date, default: Date.now },
        message: { type: String, required: true },
        level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.AgentExecution ||
  mongoose.model<IAgentExecution>('AgentExecution', AgentExecutionSchema);
