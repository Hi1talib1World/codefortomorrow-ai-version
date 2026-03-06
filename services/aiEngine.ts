
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface AIContext {
  studentName: string;
  currentPath: string;
  skillMastery: Record<string, number>;
  recentPerformance: any[];
  strengths: string[];
  weaknesses: string[];
}

export class AIEngine {
  private static model = "gemini-3-flash-preview";

  /**
   * Generates a personalized learning recommendation
   */
  static async getLearningRecommendation(context: AIContext): Promise<any> {
    const prompt = `
      You are an expert AI Learning Coach. 
      Analyze the following student context and provide a personalized learning recommendation.
      
      Student: ${context.studentName}
      Path: ${context.currentPath}
      Skill Mastery: ${JSON.stringify(context.skillMastery)}
      Strengths: ${context.strengths.join(', ')}
      Weaknesses: ${context.weaknesses.join(', ')}
      
      Return a JSON object with:
      - recommendation: A short, encouraging message.
      - nextSteps: An array of 3 specific topics to focus on.
      - difficultyAdjustment: "EASY", "MEDIUM", or "HARD" based on mastery.
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendation: { type: Type.STRING },
              nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
              difficultyAdjustment: { type: Type.STRING }
            },
            required: ["recommendation", "nextSteps", "difficultyAdjustment"]
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("AI Engine Error:", error);
      return this.getFallbackRecommendation();
    }
  }

  /**
   * Generates a performance summary for teachers
   */
  static async getTeacherSummary(classData: any): Promise<string> {
    const prompt = `
      Summarize the performance of this class. 
      Identify struggling students and overall trends.
      Data: ${JSON.stringify(classData)}
      
      Provide a concise 3-sentence summary.
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt
      });
      return response.text || "Unable to generate summary.";
    } catch (error) {
      return "Error generating summary.";
    }
  }

  private static getFallbackRecommendation() {
    return {
      recommendation: "Keep practicing your core skills to build a strong foundation!",
      nextSteps: ["Review previous lessons", "Complete daily challenges", "Practice basic syntax"],
      difficultyAdjustment: "MEDIUM"
    };
  }
}
