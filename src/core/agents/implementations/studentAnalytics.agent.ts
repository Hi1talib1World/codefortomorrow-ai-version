import { z } from 'zod';
import {
  AgentInterface,
  AgentExecutionContext,
  AgentExecutionResult,
  AgentPermission
} from '../interfaces/agent.interface';
import { StudentProfileTool } from '../tools/studentProfile.tool';
import { AIProvider } from '../../ai/provider/ai.provider.interface';
import { defaultAIProvider } from '../../ai/provider/gemini.provider';

export const AnalyticsInputSchema = z.object({
  studentId: z.string().optional(),
  email: z.string().optional(),
  pathId: z.string().default('python')
});

export type AnalyticsInput = z.infer<typeof AnalyticsInputSchema>;

export const AnalyticsOutputSchema = z.object({
  student_id: z.string(),
  student_name: z.string(),
  mastery: z.record(z.number()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  knowledge_gaps: z.array(z.string()),
  recommended_next_topic: z.string(),
  recommended_difficulty: z.enum(['easy', 'medium', 'hard']),
  teacher_alerts: z.array(z.string()),
  confidence: z.number()
});

export type AnalyticsOutput = z.infer<typeof AnalyticsOutputSchema>;

export class StudentAnalyticsAgent
  implements AgentInterface<AnalyticsInput, AnalyticsOutput>
{
  public id = 'student_analytics';
  public name = 'Student Analytics Agent';
  public description = 'Analyzes real DB metrics, mastery progression, skill gaps, and generates AI learning recommendations.';
  public version = '1.0.0';
  public capabilities = [
    'analyze_mastery',
    'identify_gaps',
    'recommend_topics',
    'generate_teacher_alerts'
  ];
  public permissions: AgentPermission[] = ['read:students'];
  public tools = [new StudentProfileTool()];
  private aiProvider: AIProvider;

  constructor(aiProvider: AIProvider = defaultAIProvider) {
    this.aiProvider = aiProvider;
  }

  public validateInput(input: AnalyticsInput) {
    const result = AnalyticsInputSchema.safeParse(input);
    if (!result.success) {
      return { valid: false, errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`) };
    }
    return { valid: true };
  }

  public validateOutput(output: AnalyticsOutput) {
    const result = AnalyticsOutputSchema.safeParse(output);
    if (!result.success) {
      return { valid: false, errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`) };
    }
    return { valid: true };
  }

  public async execute(
    input: AnalyticsInput,
    context: AgentExecutionContext
  ): Promise<AgentExecutionResult<AnalyticsOutput>> {
    const startTime = Date.now();
    const logs: Array<{ timestamp: string; message: string; level: 'info' | 'warn' | 'error' }> = [];

    const addLog = (message: string, level: 'info' | 'warn' | 'error' = 'info') => {
      logs.push({ timestamp: new Date().toISOString(), message, level });
    };

    addLog(`StudentAnalyticsAgent inspecting performance metrics for student...`);

    // 1. Deterministic DB Fetch via StudentProfileTool
    const profileTool = new StudentProfileTool();
    const profileResult = await profileTool.run({
      studentId: input.studentId,
      email: input.email,
      includeQuizHistory: true
    });

    addLog(`Fetched deterministic profile: ${profileResult.name} (XP: ${profileResult.xp}, Streak: ${profileResult.streak})`);

    try {
      const prompt = `
You are the Student Analytics Agent. Analyze the following actual student performance data from MongoDB:
- Student Name: ${profileResult.name}
- Skill Mastery: ${JSON.stringify(profileResult.skillMastery)}
- Known Strengths: ${profileResult.strengths.join(', ')}
- Known Weaknesses: ${profileResult.weaknesses.join(', ')}
- Completed Lessons: ${profileResult.completedLessonsCount}
- Average Quiz Score: ${profileResult.averageQuizScore}%

Based strictly on this data, construct the analytics summary containing:
- Mastery percentages map
- Strengths & weaknesses
- 2 Specific knowledge gaps
- Recommended next topic
- Recommended difficulty level (easy, medium, or hard)
- Teacher alerts (if any intervention is needed)
- Confidence score (0.0 to 1.0)
`;

      addLog(`Requesting AI diagnostic interpretation from ${this.aiProvider.name}...`);

      const aiResponse = await this.aiProvider.generateStructured(
        prompt,
        AnalyticsOutputSchema,
        {
          systemInstruction: 'You are an EdTech Learning Analytics AI. Do NOT invent student performance data. Synthesize recommendations based strictly on provided student metrics.'
        }
      );

      // Ensure DB student ID is preserved
      aiResponse.content.student_id = profileResult.studentId;
      aiResponse.content.student_name = profileResult.name;

      addLog(`AI Diagnostic complete in ${aiResponse.latencyMs}ms. Confidence score: ${aiResponse.content.confidence}`);

      return {
        executionId: context.executionId,
        agentId: this.id,
        status: 'success',
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
      addLog(`Student Analytics execution error: ${errorMsg}`, 'error');
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
