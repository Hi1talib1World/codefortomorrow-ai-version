import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import dotenv from 'dotenv';
import { AIProvider, AIProviderOptions, AIProviderResponse } from './ai.provider.interface';

dotenv.config();

// Pricing rates per 1k tokens for cost estimation ($250 cost-budget tracking)
const MODEL_PRICING_USD_PER_1K: Record<string, { input: number; output: number }> = {
  'gemini-2.5-flash': { input: 0.000075, output: 0.0003 },
  'gemini-2.5-pro': { input: 0.00125, output: 0.005 },
  'default': { input: 0.0001, output: 0.0004 }
};

export class GeminiAIProvider implements AIProvider {
  public name = 'Google Gemini Provider';
  private client: GoogleGenAI;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel = 'gemini-2.5-flash') {
    const key = apiKey || process.env.GEMINI_API_KEY || process.env.API_KEY || '';
    this.client = new GoogleGenAI({ apiKey: key });
    this.defaultModel = process.env.AI_MODEL || defaultModel;
  }

  public estimateCost(inputTokens: number, outputTokens: number, model = this.defaultModel): number {
    const rates = MODEL_PRICING_USD_PER_1K[model] || MODEL_PRICING_USD_PER_1K['default'];
    const inputCost = (inputTokens / 1000) * rates.input;
    const outputCost = (outputTokens / 1000) * rates.output;
    return Math.round((inputCost + outputCost) * 100000) / 100000;
  }

  public async generate(
    prompt: string,
    options?: AIProviderOptions
  ): Promise<AIProviderResponse<string>> {
    const startTime = Date.now();
    const targetModel = options?.model || this.defaultModel;

    try {
      const response = await this.client.models.generateContent({
        model: targetModel,
        contents: prompt,
        config: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens,
          topP: options?.topP,
          systemInstruction: options?.systemInstruction
        }
      });

      const latencyMs = Date.now() - startTime;
      const text = response.text || '';
      
      const usage = response.usageMetadata || {};
      const inputTokens = usage.promptTokenCount || Math.ceil(prompt.length / 4);
      const outputTokens = usage.candidatesTokenCount || Math.ceil(text.length / 4);
      const totalTokens = usage.totalTokenCount || (inputTokens + outputTokens);
      const estimatedCostUsd = this.estimateCost(inputTokens, outputTokens, targetModel);

      return {
        content: text,
        rawText: text,
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCostUsd,
        model: targetModel,
        latencyMs
      };
    } catch (error) {
      console.error('[GeminiAIProvider] Error generating text:', error);
      throw new Error(`AI Provider generation failed: ${(error as Error).message}`);
    }
  }

  public async generateStructured<TSchema extends z.ZodSchema>(
    prompt: string,
    schema: TSchema,
    options?: AIProviderOptions
  ): Promise<AIProviderResponse<z.infer<TSchema>>> {
    const startTime = Date.now();
    const targetModel = options?.model || this.defaultModel;

    const structuredPrompt = `${prompt}

IMPORTANT: You MUST reply with ONLY a valid, raw JSON object adhering to the schema. Do NOT include markdown code blocks (\`\`\`json), explanations, or preamble.`;

    try {
      const response = await this.client.models.generateContent({
        model: targetModel,
        contents: structuredPrompt,
        config: {
          temperature: options?.temperature ?? 0.2, // Lower temp for structured outputs
          maxOutputTokens: options?.maxTokens,
          systemInstruction: options?.systemInstruction || 'You are an AI system that outputs strictly valid JSON.'
        }
      });

      const latencyMs = Date.now() - startTime;
      let text = (response.text || '').trim();

      // Clean markdown code blocks if AI included them
      if (text.startsWith('```')) {
        text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      }

      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch (jsonErr) {
        console.warn('[GeminiAIProvider] Malformed JSON received, attempting fallback repair...');
        // Attempt basic JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error(`Invalid JSON syntax: ${(jsonErr as Error).message}`);
        }
      }

      const validated = schema.parse(parsed);

      const usage = response.usageMetadata || {};
      const inputTokens = usage.promptTokenCount || Math.ceil(prompt.length / 4);
      const outputTokens = usage.candidatesTokenCount || Math.ceil(text.length / 4);
      const totalTokens = usage.totalTokenCount || (inputTokens + outputTokens);
      const estimatedCostUsd = this.estimateCost(inputTokens, outputTokens, targetModel);

      return {
        content: validated,
        rawText: text,
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCostUsd,
        model: targetModel,
        latencyMs
      };
    } catch (error) {
      console.error('[GeminiAIProvider] Error generating structured output:', error);
      throw new Error(`Structured AI Provider validation failed: ${(error as Error).message}`);
    }
  }
}

export const defaultAIProvider = new GeminiAIProvider();
