import { z } from 'zod';
import {
  AgentInterface,
  AgentExecutionContext,
  AgentExecutionResult,
  AgentPermission
} from '../interfaces/agent.interface';
import { CRMTool } from '../tools/crm.tool';
import { AIProvider } from '../../ai/provider/ai.provider.interface';
import { defaultAIProvider } from '../../ai/provider/gemini.provider';

export const B2BSalesInputSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required'),
  organizationType: z.enum(['school', 'university', 'academy', 'government', 'other']).default('school'),
  country: z.string().default('Morocco'),
  city: z.string().default('Essaouira'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().email('Valid email required'),
  studentCountEstimate: z.number().default(250)
});

export type B2BSalesInput = z.infer<typeof B2BSalesInputSchema>;

export const B2BSalesOutputSchema = z.object({
  lead_id: z.string().optional(),
  organization_name: z.string(),
  organization_type: z.string(),
  country: z.string(),
  contact: z.string(),
  status: z.enum(['new', 'qualified', 'outreach_drafted', 'approved', 'contacted', 'closed_won', 'closed_lost']),
  priority: z.enum(['low', 'medium', 'high']),
  ai_score: z.number(),
  qualification_notes: z.string(),
  outreach_draft: z.object({
    subject: z.string(),
    body: z.string(),
    suggested_follow_up_days: z.number()
  }),
  human_approval_required: z.boolean().default(true),
  next_action: z.string()
});

export type B2BSalesOutput = z.infer<typeof B2BSalesOutputSchema>;

export class B2BSalesAgent
  implements AgentInterface<B2BSalesInput, B2BSalesOutput>
{
  public id = 'b2b_sales';
  public name = 'B2B Sales Agent';
  public description = 'Qualifies institutional leads, generates outreach drafts, and enforces mandatory human approval before transmission.';
  public version = '1.0.0';
  public capabilities = [
    'qualify_leads',
    'generate_outreach_drafts',
    'enforce_human_approval',
    'manage_crm'
  ];
  public permissions: AgentPermission[] = ['read:crm', 'write:crm'];
  public tools = [new CRMTool()];
  private aiProvider: AIProvider;

  constructor(aiProvider: AIProvider = defaultAIProvider) {
    this.aiProvider = aiProvider;
  }

  public validateInput(input: B2BSalesInput) {
    const result = B2BSalesInputSchema.safeParse(input);
    if (!result.success) {
      return { valid: false, errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`) };
    }
    return { valid: true };
  }

  public validateOutput(output: B2BSalesOutput) {
    const result = B2BSalesOutputSchema.safeParse(output);
    if (!result.success) {
      return { valid: false, errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`) };
    }
    return { valid: true };
  }

  public async execute(
    input: B2BSalesInput,
    context: AgentExecutionContext
  ): Promise<AgentExecutionResult<B2BSalesOutput>> {
    const startTime = Date.now();
    const logs: Array<{ timestamp: string; message: string; level: 'info' | 'warn' | 'error' }> = [];

    const addLog = (message: string, level: 'info' | 'warn' | 'error' = 'info') => {
      logs.push({ timestamp: new Date().toISOString(), message, level });
    };

    addLog(`B2BSalesAgent qualifying lead: ${input.organizationName} (${input.city}, ${input.country})`);

    const inputValidation = this.validateInput(input);
    if (!inputValidation.valid) {
      const errorMsg = `Input validation failed: ${inputValidation.errors?.join(', ')}`;
      addLog(errorMsg, 'error');
      return {
        executionId: context.executionId,
        agentId: this.id,
        status: 'failed',
        error: errorMsg,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
        latencyMs: Date.now() - startTime,
        tokensUsed: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        estimatedCostUsd: 0,
        logs
      };
    }

    try {
      // 1. Save or update lead in database via CRMTool
      const crmTool = new CRMTool();
      const upsertResult = await crmTool.run({
        action: 'upsert_lead',
        leadData: input
      });

      const leadId = upsertResult.lead?._id?.toString() || 'lead_temp_id';
      addLog(`Upserted lead in CRM database (ID: ${leadId})...`);

      // 2. Generate personalized outreach draft using AIProvider
      const prompt = `
You are the B2B Sales Agent for Code for Tomorrow.
Generate a professional partnership outreach draft for:
- School / Institution: ${input.organizationName}
- Type: ${input.organizationType}
- Location: ${input.city}, ${input.country}
- Contact Person: ${input.contactName}
- Estimated Students: ${input.studentCountEstimate}

Produce a score (0-100), qualification notes, priority (low, medium, or high), and a tailored email draft (subject + body).
`;

      addLog(`Generating customized outreach proposal with ${this.aiProvider.name}...`);

      const aiResponse = await this.aiProvider.generateStructured(
        prompt,
        B2BSalesOutputSchema,
        {
          systemInstruction: 'You are an EdTech Institutional Partnership Specialist. IMPORTANT: Autonomous email sending is strictly prohibited. Drafts MUST require human approval.'
        }
      );

      // Force human approval safety guard
      aiResponse.content.lead_id = leadId;
      aiResponse.content.human_approval_required = true;
      aiResponse.content.status = 'outreach_drafted';
      aiResponse.content.next_action = 'Human Review & Approval Required';

      // 3. Persist outreach draft in CRM
      await crmTool.run({
        action: 'save_outreach_draft',
        leadId: leadId,
        outreachDraft: {
          subject: aiResponse.content.outreach_draft.subject,
          body: aiResponse.content.outreach_draft.body,
          suggestedFollowUpDays: aiResponse.content.outreach_draft.suggested_follow_up_days || 3
        }
      });

      addLog(`Draft saved to CRM. Human Approval Status set to "requires_human_approval".`);

      return {
        executionId: context.executionId,
        agentId: this.id,
        status: 'requires_human_approval',
        data: aiResponse.content,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
        latencyMs: Date.now() - startTime,
        tokensUsed: {
          inputTokens: aiResponse.inputTokens,
          outputTokens: aiResponse.outputTokens,
          totalTokens: aiResponse.totalTokens
        },
        estimatedCostUsd: aiResponse.estimatedCostUsd,
        logs
      };
    } catch (error) {
      const errorMsg = (error as Error).message;
      addLog(`B2B Sales execution error: ${errorMsg}`, 'error');
      return {
        executionId: context.executionId,
        agentId: this.id,
        status: 'failed',
        error: errorMsg,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
        latencyMs: Date.now() - startTime,
        tokensUsed: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        estimatedCostUsd: 0,
        logs
      };
    }
  }
}
