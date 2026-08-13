import mongoose, { Schema, Document } from 'mongoose';

export type LeadStatus = 'new' | 'qualified' | 'outreach_drafted' | 'approved' | 'contacted' | 'closed_won' | 'closed_lost';
export type LeadPriority = 'low' | 'medium' | 'high';

export interface IB2BLead extends Document {
  organizationName: string;
  organizationType: 'school' | 'university' | 'academy' | 'government' | 'other';
  country: string;
  city?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  studentCountEstimate?: number;
  status: LeadStatus;
  priority: LeadPriority;
  aiScore?: number; // 0 - 100
  aiQualificationNotes?: string;
  outreachDraft?: {
    subject: string;
    body: string;
    generatedAt: Date;
    suggestedFollowUpDate?: Date;
  };
  humanApprovalStatus: 'pending' | 'approved' | 'rejected' | 'modified';
  approvedByUserId?: string;
  approvedAt?: Date;
  communicationHistory: Array<{
    timestamp: Date;
    action: string;
    details: string;
    performedBy: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const B2BLeadSchema: Schema = new Schema(
  {
    organizationName: { type: String, required: true, index: true },
    organizationType: {
      type: String,
      enum: ['school', 'university', 'academy', 'government', 'other'],
      default: 'school'
    },
    country: { type: String, required: true, default: 'Morocco' },
    city: { type: String, default: 'Essaouira' },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true, index: true },
    contactPhone: { type: String },
    studentCountEstimate: { type: Number, default: 250 },
    status: {
      type: String,
      enum: ['new', 'qualified', 'outreach_drafted', 'approved', 'contacted', 'closed_won', 'closed_lost'],
      default: 'new',
      index: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    aiScore: { type: Number, default: 75 },
    aiQualificationNotes: { type: String },
    outreachDraft: {
      subject: { type: String },
      body: { type: String },
      generatedAt: { type: Date },
      suggestedFollowUpDate: { type: Date }
    },
    humanApprovalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'modified'],
      default: 'pending',
      index: true
    },
    approvedByUserId: { type: String },
    approvedAt: { type: Date },
    communicationHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        action: { type: String, required: true },
        details: { type: String, required: true },
        performedBy: { type: String, default: 'b2b-sales-agent' }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.B2BLead || mongoose.model<IB2BLead>('B2BLead', B2BLeadSchema);
