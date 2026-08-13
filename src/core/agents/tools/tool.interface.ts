import { z } from 'zod';
import { AgentPermission, AgentExecutionContext } from '../interfaces/agent.interface';

export interface BaseToolOptions<TInput = any, TOutput = any> {
  name: string;
  description: string;
  inputSchema: z.ZodSchema<TInput>;
  outputSchema: z.ZodSchema<TOutput>;
  permissions?: AgentPermission[];
}

export abstract class BaseTool<TInput = any, TOutput = any> {
  public name: string;
  public description: string;
  public inputSchema: z.ZodSchema<TInput>;
  public outputSchema: z.ZodSchema<TOutput>;
  public permissions: AgentPermission[];

  constructor(options: BaseToolOptions<TInput, TOutput>) {
    this.name = options.name;
    this.description = options.description;
    this.inputSchema = options.inputSchema;
    this.outputSchema = options.outputSchema;
    this.permissions = options.permissions || [];
  }

  public abstract run(input: TInput, context?: AgentExecutionContext): Promise<TOutput>;

  public async execute(input: TInput, context?: AgentExecutionContext): Promise<TOutput> {
    const validatedInput = this.inputSchema.parse(input);
    const output = await this.run(validatedInput, context);
    return this.outputSchema.parse(output);
  }
}
