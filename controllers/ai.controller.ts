
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
