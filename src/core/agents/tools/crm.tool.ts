import { z } from 'zod';
import { BaseTool } from './tool.interface';
import B2BLead from '../../../models/b2bLead.model';

const CRMToolInput = z.object({
  action: z.enum(['get_lead', 'upsert_lead', 'save_outreach_draft', 'approve_outreach']),
  leadId: z.string().optional(),
  leadData: z.object({
    organizationName: z.string().optional(),
    organizationType: z.enum(['school', 'university', 'academy', 'government', 'other']).optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    contactName: z.string().optional(),
    contactEmail: z.string().optional(),
    studentCountEstimate: z.number().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional()
  }).optional(),
  outreachDraft: z.object({
    subject: z.string(),
    body: z.string(),
    suggestedFollowUpDays: z.number().default(3)
  }).optional(),
  approvedByUserId: z.string().optional()
});

const CRMToolOutput = z.object({
  success: z.boolean(),
  lead: z.any().optional(),
  message: z.string().optional()
});

export class CRMTool extends BaseTool<
  z.infer<typeof CRMToolInput>,
  z.infer<typeof CRMToolOutput>
> {
  constructor() {
    super({
      name: 'CRMTool',
      description: 'Manages B2B school partnership leads, outreach drafts, and human approval status.',
      inputSchema: CRMToolInput,
      outputSchema: CRMToolOutput,
      permissions: ['read:crm', 'write:crm']
    });
  }

  public async run(
    input: z.infer<typeof CRMToolInput>
  ): Promise<z.infer<typeof CRMToolOutput>> {
    try {
      if (input.action === 'upsert_lead' && input.leadData) {
        let lead = null;
        if (input.leadData.contactEmail) {
          lead = await (B2BLead as any).findOne({ contactEmail: input.leadData.contactEmail });
        }

        if (lead) {
          Object.assign(lead, input.leadData);
          await lead.save();
        } else {
          lead = await B2BLead.create({
            organizationName: input.leadData.organizationName || 'Partner School',
            organizationType: input.leadData.organizationType || 'school',
            country: input.leadData.country || 'Morocco',
            city: input.leadData.city || 'Essaouira',
            contactName: input.leadData.contactName || 'School Admin',
            contactEmail: input.leadData.contactEmail || `admin_${Date.now()}@school.edu.ma`,
            studentCountEstimate: input.leadData.studentCountEstimate || 300,
            priority: input.leadData.priority || 'medium',
            status: 'new'
          });
        }

        return {
          success: true,
          lead,
          message: 'B2B Lead saved to CRM database.'
        };
      }

      if (input.action === 'save_outreach_draft' && input.leadId && input.outreachDraft) {
        const lead = await (B2BLead as any).findById(input.leadId);
        if (!lead) {
          return { success: false, message: 'Lead not found in CRM.' };
        }

        const followUpDate = new Date();
        followUpDate.setDate(followUpDate.getDate() + input.outreachDraft.suggestedFollowUpDays);

        lead.outreachDraft = {
          subject: input.outreachDraft.subject,
          body: input.outreachDraft.body,
          generatedAt: new Date(),
          suggestedFollowUpDate: followUpDate
        };
        lead.status = 'outreach_drafted';
        lead.humanApprovalStatus = 'pending';

        lead.communicationHistory.push({
          timestamp: new Date(),
          action: 'outreach_drafted',
          details: `Drafted subject: "${input.outreachDraft.subject}"`,
          performedBy: 'b2b-sales-agent'
        });

        await lead.save();

        return {
          success: true,
          lead,
          message: 'Outreach draft stored. Pending human review and approval.'
        };
      }

      if (input.action === 'approve_outreach' && input.leadId) {
        const lead = await (B2BLead as any).findById(input.leadId);
        if (!lead) {
          return { success: false, message: 'Lead not found.' };
        }

        lead.humanApprovalStatus = 'approved';
        lead.status = 'approved';
        lead.approvedByUserId = input.approvedByUserId || 'admin_user';
        lead.approvedAt = new Date();

        lead.communicationHistory.push({
          timestamp: new Date(),
          action: 'human_approved',
          details: `Outreach approved by user ${lead.approvedByUserId}`,
          performedBy: lead.approvedByUserId
        });

        await lead.save();

        return {
          success: true,
          lead,
          message: 'Outreach draft authorized by human supervisor. Ready for transmission.'
        };
      }

      return {
        success: true,
        message: 'CRM action completed.'
      };
    } catch (error) {
      return {
        success: false,
        message: `CRMTool error: ${(error as Error).message}`
      };
    }
  }
}
