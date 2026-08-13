import { z } from 'zod';

export type AgentPermission = 'read:students' | 'write:curriculum' | 'read:crm' | 'write:crm' | 'admin:all';

export interface ToolDefinition<TInput = any, TOutput = any> {
  name: string;
  description: string;
  inputSchema: z.ZodSchema<TInput>;
  outputSchema: z.ZodSchema<TOutput>;
  permissions: AgentPermission[];
  execute(input: TInput, context?: AgentExecutionContext): Promise<TOutput>;
}

export interface AgentExecutionContext {
  executionId: string;
  userId?: string;
  userRole?: 'student' | 'teacher' | 'admin' | 'guest';
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface AgentExecutionResult<TData = any> {
  executionId: string;
  agentId: string;
  status: 'success' | 'failed' | 'requires_human_approval';
  data?: TData;
  error?: string;
  startedAt: string;
  completedAt: string;
  latencyMs: number;
  tokensUsed: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  estimatedCostUsd: number;
  logs: Array<{ timestamp: string; message: string; level: 'info' | 'warn' | 'error' }>;
}

export interface AgentInterface<TInput = any, TOutput = any> {
  id: string;
  name: string;
  description: string;
  version: string;
  capabilities: string[];
  permissions: AgentPermission[];
  tools: ToolDefinition[];

  validateInput(input: TInput): { valid: boolean; errors?: string[] };
  validateOutput(output: TOutput): { valid: boolean; errors?: string[] };

  execute(
    input: TInput,
    context: AgentExecutionContext
  ): Promise<AgentExecutionResult<TOutput>>;
}
