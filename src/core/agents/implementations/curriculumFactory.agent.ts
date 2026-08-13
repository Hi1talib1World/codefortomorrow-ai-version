import { z } from 'zod';
import {
  AgentInterface,
  AgentExecutionContext,
  AgentExecutionResult,
  AgentPermission
} from '../interfaces/agent.interface';
import { CurriculumTool } from '../tools/curriculum.tool';
import { AIProvider } from '../../ai/provider/ai.provider.interface';
import { defaultAIProvider } from '../../ai/provider/gemini.provider';

export const CurriculumInputSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  grade: z.string().default('6'),
  topic: z.string().min(1, 'Topic is required'),
  language: z.string().default('French'),
  learnerLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  learningObjectives: z.array(z.string()).default([]),
  durationMinutes: z.number().default(40)
});

export type CurriculumInput = z.infer<typeof CurriculumInputSchema>;

export const CurriculumOutputSchema = z.object({
  title: z.string(),
  learning_objectives: z.array(z.string()),
  prerequisites: z.array(z.string()),
  lesson_structure: z.array(
    z.object({
      step: z.number(),
      sectionTitle: z.string(),
      durationMinutes: z.number(),
      keyConcepts: z.array(z.string())
    })
  ),
  explanation: z.string(),
  activities: z.array(
    z.object({
      activityName: z.string(),
      type: z.string(),
      description: z.string()
    })
  ),
  exercises: z.array(
    z.object({
      question: z.string(),
      codeSnippet: z.string().optional(),
      hint: z.string()
    })
  ),
  assessment: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctAnswerIndex: z.number()
    })
  ),
  difficulty: z.string(),
  estimated_duration: z.number()
});

export type CurriculumOutput = z.infer<typeof CurriculumOutputSchema>;

export class CurriculumFactoryAgent
  implements AgentInterface<CurriculumInput, CurriculumOutput>
{
  public id = 'curriculum_factory';
  public name = 'Curriculum Factory Agent';
  public description = 'Generates structured, validated educational content, exercises, and lesson paths.';
  public version = '1.0.0';
  public capabilities = [
    'generate_lessons',
    'create_exercises',
    'differentiate_activities',
    'validate_learning_objectives'
  ];
  public permissions: AgentPermission[] = ['write:curriculum'];
  public tools = [new CurriculumTool()];
  private aiProvider: AIProvider;

  constructor(aiProvider: AIProvider = defaultAIProvider) {
    this.aiProvider = aiProvider;
  }

  public validateInput(input: CurriculumInput) {
    const result = CurriculumInputSchema.safeParse(input);
    if (!result.success) {
      return { valid: false, errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`) };
    }
    return { valid: true };
  }

  public validateOutput(output: CurriculumOutput) {
    const result = CurriculumOutputSchema.safeParse(output);
    if (!result.success) {
      return { valid: false, errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`) };
    }
    return { valid: true };
  }

  public async execute(
    input: CurriculumInput,
    context: AgentExecutionContext
  ): Promise<AgentExecutionResult<CurriculumOutput>> {
    const startTime = Date.now();
    const logs: Array<{ timestamp: string; message: string; level: 'info' | 'warn' | 'error' }> = [];

    const addLog = (message: string, level: 'info' | 'warn' | 'error' = 'info') => {
      logs.push({ timestamp: new Date().toISOString(), message, level });
    };

    addLog(`CurriculumFactoryAgent initiated for topic: "${input.topic}" (${input.subject})`);

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
      const prompt = `
You are the Curriculum Factory Agent. Generate a comprehensive educational lesson package based on:
- Subject: ${input.subject}
- Grade Level: ${input.grade}
- Topic: ${input.topic}
- Target Language: ${input.language}
- Learner Level: ${input.learnerLevel}
- Desired Duration: ${input.durationMinutes} minutes
- Target Objectives: ${input.learningObjectives.join(', ') || 'Core Mastery'}

Create clear explanations, 2 interactive activities, 2 exercises, and a 2-question quiz assessment.
`;

      addLog(`Sending prompt to AI Provider (${this.aiProvider.name})...`);

      const aiResponse = await this.aiProvider.generateStructured(
        prompt,
        CurriculumOutputSchema,
        {
          systemInstruction: `You are a world-class EdTech Curriculum Architect. Return JSON matching the requested schema exactly. Output all text in ${input.language}.`
        }
      );

      addLog(`AI generation completed in ${aiResponse.latencyMs}ms. Tokens used: ${aiResponse.totalTokens}`);

      const outputValidation = this.validateOutput(aiResponse.content);
      if (!outputValidation.valid) {
        addLog(`Output validation warning: ${outputValidation.errors?.join(', ')}`, 'warn');
      } else {
        addLog('Generated curriculum object passed Zod schema validation successfully.');
      }

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
      addLog(`Curriculum execution error: ${errorMsg}`, 'error');
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
