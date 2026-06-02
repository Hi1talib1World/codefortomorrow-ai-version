import { GoogleGenAI, Type } from '@google/genai';

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
const MODEL = process.env.GEMINI_MODEL || 'gemini-pro';

export class AIEngine {
  static async generateLearningProfile(context) {
    const prompt = `You are an AI learning coach for a rural EdTech deployment. Create a concise student learning profile for the following context:\n\n${JSON.stringify(context, null, 2)}\n\nReturn valid JSON with keys: summary, strengths, weaknesses, nextSteps, recommendations.`;

    const response = await client.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.STRING }
          },
          required: ['summary', 'strengths', 'weaknesses', 'nextSteps', 'recommendations']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  }

  static async generateTeacherSummary(classData) {
    const prompt = `Create a teacher analytics summary for the following class performance payload:\n\n${JSON.stringify(classData)}\n\nReturn a short, actionable paragraph and a set of three insight bullets.`;

    const response = await client.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        temperature: 0.1
      }
    });

    return response.text || 'No summary generated.';
  }

  static async generateStudentAnalysis(payload) {
    const prompt = `You are an AI student analytics coach for rural and emerging-market classrooms. Analyze the given learning event or student submission payload and return a concise diagnostic output.\n\nPayload:\n${JSON.stringify(payload, null, 2)}\n\nReturn valid JSON with keys: weaknesses, strengths, next_hint, confidence.`;

    const response = await client.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            next_hint: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ['weaknesses', 'strengths', 'next_hint', 'confidence']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  }

  static async generateSalesProposal(payload) {
    const prompt = `You are an expert B2B EdTech growth marketer. Build a concise sales proposal for a North African school or NGO based on this payload:\n\n${JSON.stringify(payload, null, 2)}\n\nReturn valid JSON with keys: proposal, pricing, keyBenefits, nextSteps.`;

    const response = await client.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(response.text || '{}');
  }

  static async generateQuiz(payload) {
    const prompt = `Generate a short, localized quiz for North African primary students based on this prompt:\n\n${payload.prompt}`;
    const input = payload.fileData ? { parts: [{ inlineData: { data: payload.fileData.data, mimeType: payload.fileData.mimeType } }, { text: prompt }] } : prompt;

    const response = await client.models.generateContent({
      model: MODEL,
      contents: input,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(response.text || '{}');
  }
}
