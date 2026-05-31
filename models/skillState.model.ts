import mongoose, { Schema, Document } from 'mongoose';

export interface ISkillState extends Document {
  student_id: string;
  school_id: string;
  region: string;
  skill_id: string;
  proficiency: number;
  trend: 'improving' | 'stable' | 'declining';
  confidence: number;
  attempts: number;
  successes: number;
  failures: number;
  last_attempt_at: Date | null;
  error_patterns: string[];
  weakness_signals: Array<{
    pattern: string;
    count: number;
    reason: string;
    detected_at: Date;
  }>;
  history: Array<{
    recorded_at: Date;
    proficiency: number;
    trend: string;
    confidence: number;
  }>;
  updated_at: Date;
}

const skillStateSchema = new Schema({
  student_id: { type: String, required: true, index: true },
  school_id: { type: String, default: 'default_school', index: true },
  region: { type: String, default: 'default_region', index: true },
  skill_id: { type: String, required: true, index: true },
  proficiency: { type: Number, required: true, min: 0, max: 1, default: 0 },
  trend: {
    type: String,
    required: true,
    enum: ['improving', 'stable', 'declining'],
    default: 'stable',
  },
  confidence: { type: Number, required: true, min: 0, max: 1, default: 0 },
  attempts: { type: Number, required: true, default: 0 },
  successes: { type: Number, required: true, default: 0 },
  failures: { type: Number, required: true, default: 0 },
  last_attempt_at: { type: Date, default: null },
  error_patterns: { type: [String], default: [] },
  weakness_signals: [{
    pattern: String,
    count: Number,
    reason: String,
    detected_at: Date,
  }],
  history: [{
    recorded_at: Date,
    proficiency: Number,
    trend: String,
    confidence: Number,
  }],
  updated_at: { type: Date, required: true, default: Date.now }
}, {
  collection: 'skill_states'
});

const SkillState = mongoose.models.SkillState || mongoose.model<ISkillState>('SkillState', skillStateSchema);
export default SkillState;
