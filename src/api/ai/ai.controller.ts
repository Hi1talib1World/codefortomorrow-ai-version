
import { Request, Response } from 'express';
import { AIEngine } from '../services/aiEngine';
import User from '../models/user.model';
import Progress from '../models/progress.model';
import { GoogleGenAI } from '@google/genai';

export const getLearningProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).populate('progress');
    
    if (!user || !user.progress) {
      return res.status(404).json({ message: 'User or progress not found' });
    }

    const progress = user.progress as any;
    
    // Generate new recommendation if needed (e.g., once a day or if empty)
    const context = {
      studentName: user.name,
      currentPath: (user as any).currentPath || 'General',
      skillMastery: Object.fromEntries(progress.skillMastery || new Map()),
      recentPerformance: [], // Could fetch from quiz history
      strengths: progress.learningProfile.strengths,
      weaknesses: progress.learningProfile.weaknesses
    };

    const aiData = await AIEngine.getLearningRecommendation(context);
    
    // Update progress with AI insights
    progress.learningProfile.recommendations = aiData.nextSteps;
    await progress.save();

    res.json({
      profile: progress.learningProfile,
      recommendation: aiData.recommendation,
      nextSteps: aiData.nextSteps,
      difficulty: aiData.difficultyAdjustment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching AI profile' });
  }
};

export const getClassAnalytics = async (req: Request, res: Response) => {
  try {
    // Only teachers should access this
    if ((req as any).user.role !== 'teacher') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Fetch all students and their progress
    const students = await User.find({ role: 'student' }).populate('progress');
    
    const classData = students.map(s => ({
      name: s.name,
      xp: (s.progress as any)?.xp || 0,
      mastery: Object.fromEntries((s.progress as any)?.skillMastery || new Map())
    }));

    const summary = await AIEngine.getTeacherSummary(classData);

    res.json({
      summary,
      heatmap: classData, // Frontend will render this
      strugglingStudents: classData.filter(s => s.xp < 100) // Simple logic for now
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching class analytics' });
  }
};

export const generateQuiz = async (req: Request, res: Response) => {
  try {
    const { prompt, fileData } = req.body;
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    const model = "gemini-3-flash-preview";

    let contents: any;
    if (fileData) {
      contents = {
        parts: [
          { inlineData: { data: fileData.data, mimeType: fileData.mimeType } },
          { text: prompt }
        ]
      };
    } else {
      contents = prompt;
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text || '[]'));
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ message: 'Error generating quiz with AI' });
  }
};

export const logTokenUsage = async (req: Request, res: Response) => {
  // Placeholder for token logging logic
  res.json({ status: 'logged' });
};

export const chatWithAssistant = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    const responseText = await AIEngine.chatWithAssistant(message, history || [], (req as any).user);
    res.json({ text: responseText });
  } catch (error) {
    console.error("AI Assistant Chat Error:", error);
    res.status(500).json({ message: (error as Error).message || 'Error processing chat' });
  }
};

export const generateHint = async (req: Request, res: Response) => {
  try {
    const { titleKey, expectedOutput, failedCode } = req.body;
    if (!titleKey || !expectedOutput || !failedCode) {
      return res.status(400).json({ message: 'titleKey, expectedOutput, and failedCode are required.' });
    }

    const hint = await AIEngine.generateHint(titleKey, expectedOutput, failedCode);
    res.json({ hint });
  } catch (error) {
    console.error("AI Hint Generation Error:", error);
    res.status(500).json({ message: (error as Error).message || 'Error generating hint' });
  }
};

export const getAIStatus = async (_req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const isSimulation = !apiKey || apiKey === 'your-gemini-api-key-here' || apiKey.startsWith('your-');
  res.json({ isSimulation });
};
