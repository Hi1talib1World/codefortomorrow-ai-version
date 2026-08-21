import { randomUUID } from 'crypto';
import { AgentRegistry, defaultAgentRegistry } from '../registry/agent.registry';
import { AgentExecutionContext, AgentExecutionResult } from '../interfaces/agent.interface';
import AgentExecution from '../../../models/agentExecution.model';

export interface OrchestrationRequest {
  agentId?: string;
  taskIntent?: string;
  inputData: any;
  userId?: string;
  userRole?: 'student' | 'teacher' | 'admin' | 'guest';
}

export class AIOrchestrator {
  private registry: AgentRegistry;

  constructor(registry: AgentRegistry = defaultAgentRegistry) {
    this.registry = registry;
  }

  public determineAgent(request: OrchestrationRequest): string {
    if (request.agentId && this.registry.getAgent(request.agentId)) {
      return request.agentId;
    }

    const intent = (request.taskIntent || '').toLowerCase();

    if (intent.includes('curriculum') || intent.includes('lesson') || intent.includes('exercise') || intent.includes('quiz')) {
      return 'curriculum_factory';
    }

    if (intent.includes('student') || intent.includes('analytics') || intent.includes('mastery') || intent.includes('gap')) {
      return 'student_analytics';
    }

    if (intent.includes('b2b') || intent.includes('sales') || intent.includes('school') || intent.includes('lead') || intent.includes('outreach')) {
      return 'b2b_sales';
    }

    return 'curriculum_factory';
  }

  public async processRequest(
    request: OrchestrationRequest
  ): Promise<AgentExecutionResult> {
    const executionId = `exec_${Date.now()}_${randomUUID().slice(0, 8)}`;
    const startTime = Date.now();

    const targetAgentId = this.determineAgent(request);
    const agent = this.registry.getAgent(targetAgentId);

    if (!agent) {
      const errorMsg = `No agent found registered for ID "${targetAgentId}"`;
      return {
        executionId,
        agentId: targetAgentId,
        status: 'failed',
        error: errorMsg,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
        latencyMs: Date.now() - startTime,
        tokensUsed: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        estimatedCostUsd: 0,
        logs: [{ timestamp: new Date().toISOString(), message: errorMsg, level: 'error' }]
      };
    }

    const context: AgentExecutionContext = {
      executionId,
      userId: request.userId,
      userRole: request.userRole || 'guest'
    };

    const result = await agent.execute(request.inputData, context);

    try {
      await AgentExecution.create({
        executionId: result.executionId,
        agentId: result.agentId,
        agentName: agent.name,
        task: request.taskIntent || agent.name,
        status: result.status,
        inputData: request.inputData,
        outputData: result.data,
        errorDetails: result.error,
        startedAt: new Date(result.startedAt),
        completedAt: new Date(result.completedAt),
        latencyMs: result.latencyMs,
        aiModel: 'gemini-2.5-flash',
        inputTokens: result.tokensUsed.inputTokens,
        outputTokens: result.tokensUsed.outputTokens,
        totalTokens: result.tokensUsed.totalTokens,
        estimatedCostUsd: result.estimatedCostUsd,
        userId: request.userId,
        userRole: request.userRole,
        logs: result.logs.map(l => ({ timestamp: new Date(l.timestamp), message: l.message, level: l.level }))
      });
    } catch (dbErr) {
      console.error('[AIOrchestrator] Error logging execution to DB:', dbErr);
    }

    return result;
  }
}

export const defaultAIOrchestrator = new AIOrchestrator();
