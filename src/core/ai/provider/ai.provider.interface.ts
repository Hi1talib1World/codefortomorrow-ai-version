import { z } from 'zod';

export interface AIProviderOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  systemInstruction?: string;
}

export interface AIProviderResponse<T = string> {
  content: T;
  rawText: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  model: string;
  latencyMs: number;
}

export interface AIProvider {
  name: string;
  
  generate(
    prompt: string,
    options?: AIProviderOptions
  ): Promise<AIProviderResponse<string>>;

  generateStructured<TSchema extends z.ZodSchema>(
    prompt: string,
    schema: TSchema,
    options?: AIProviderOptions
  ): Promise<AIProviderResponse<z.infer<TSchema>>>;

  estimateCost(inputTokens: number, outputTokens: number, model?: string): number;
}
