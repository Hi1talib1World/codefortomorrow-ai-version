
import { Request, Response } from 'express';
import { AIEngine } from '../../../src/core/ai-coach/aiEngine';
import User from '../../../src/models/user.model';
import Progress from '../../../src/models/progress.model';
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
    const model = "gemini-2.5-flash";

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
    const { message, history, buddyId } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    const responseText = await AIEngine.chatWithAssistant(message, history || [], (req as any).user, buddyId);
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

export const generatePersonalizedContent = async (req: Request, res: Response) => {
  try {
    const { interest, pathId } = req.body;
    const userId = (req as any).user?.id || (req as any).user?._id;
    
    let userProgressContext = {
      xp: 0,
      streak: 0,
      currentPath: pathId || 'python',
      completedLessonsCount: 0,
    };

    if (userId) {
      const user = await User.findById(userId).populate('progress');
      if (user && user.progress) {
        const prog = user.progress as any;
        userProgressContext = {
          xp: prog.xp || 0,
          streak: prog.streak || 0,
          currentPath: pathId || user.currentPath || 'python',
          completedLessonsCount: (Object.values(prog.completedLessons || {}) as any[]).reduce((acc: number, arr: any) => acc + (Array.isArray(arr) ? arr.length : 0), 0)
        };
      }
    }

    const apiKey = process.env.GEMINI_API_KEY || '';
    const isSimulation = !apiKey || apiKey === 'your-gemini-api-key-here' || apiKey.startsWith('your-');

    const targetPath = userProgressContext.currentPath || 'python';
    const topicTitle = interest || 'Coding Mastery';

    if (isSimulation) {
      const mockLesson = {
        id: Math.floor(Math.random() * 90000) + 10000,
        level: Math.max(1, Math.min(10, Math.floor(userProgressContext.xp / 100) + 1)),
        titleKey: `AI Quest: ${topicTitle}`,
        title: `AI Quest: ${topicTitle}`,
        interest: topicTitle,
        icon: '🚀',
        xp: 30,
        color: '#10B981',
        type: 'lesson',
        nodeType: 'standard',
        difficulty: userProgressContext.xp > 200 ? 'Intermediate' : 'Beginner',
        introduction: `Welcome to your personalized AI coding adventure on **${topicTitle}**!\n\nIn this custom mission, you will build a functional program step-by-step applying core programming concepts to solve a real-world scenario in **${topicTitle}**.\n\n### 📌 Key Concepts:\n1. **Data Formatting & Output**: Writing clean, readable stdout.\n2. **Logic Flow**: Structuring code execution sequentially.\n3. **Variable Assignment**: Storing and calculating dynamic values.`,
        starterCode: targetPath === 'c++' 
          ? `// AI Quest: ${topicTitle}\n#include <iostream>\n\nint main() {\n  std::cout << "${topicTitle} Ready!";\n  return 0;\n}`
          : targetPath === 'javascript' || targetPath === 'web_dev'
          ? `// AI Quest: ${topicTitle}\nconsole.log("${topicTitle} Ready!");`
          : `# AI Quest: ${topicTitle}\nprint("${topicTitle} Ready!")`,
        solutionCode: targetPath === 'c++' 
          ? `#include <iostream>\n\nint main() {\n  std::cout << "${topicTitle} Ready!";\n  return 0;\n}`
          : targetPath === 'javascript' || targetPath === 'web_dev'
          ? `console.log("${topicTitle} Ready!");`
          : `print("${topicTitle} Ready!")`,
        expectedOutput: `${topicTitle} Ready!`,
        challengeDescriptionKey: `Create a program that outputs "${topicTitle} Ready!"`,
        challengeDescription: `Write code to print "${topicTitle} Ready!" to complete your custom AI mission.`
      };
      return res.json({ lesson: mockLesson, source: 'simulation' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";

    const prompt = `You are an expert AI Curriculum Designer for a student learning programming (${targetPath}).
Student Context:
- Student Interest: "${topicTitle}"
- Programming Language: "${targetPath}"
- Current XP: ${userProgressContext.xp}
- Lessons Completed: ${userProgressContext.completedLessonsCount}

Create a single personalized interactive coding lesson tailored to their interest. Return ONLY a valid JSON object matching this schema:
{
  "id": 99999,
  "level": 1,
  "title": "Short Catchy Title",
  "titleKey": "Short Catchy Title",
  "icon": "🚀",
  "xp": 30,
  "color": "#10B981",
  "type": "lesson",
  "nodeType": "standard",
  "difficulty": "Beginner",
  "introduction": "Multi-paragraph rich concept overview applying the interest to programming syntax.",
  "starterCode": "// Starter code for language",
  "solutionCode": "// Solution code",
  "expectedOutput": "Exact expected output string",
  "challengeDescription": "Task instructions for student"
}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const lessonData = JSON.parse(response.text || '{}');
    return res.json({ lesson: lessonData, source: 'gemini' });
  } catch (error) {
    console.error("Personalized AI Generation Error:", error);
    res.status(500).json({ message: 'Failed to generate personalized content' });
  }
};

export const generateToolContent = async (req: Request, res: Response) => {
  try {
    const { toolId, input, pathId } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || '';
    const isSimulation = !apiKey || apiKey === 'your-gemini-api-key-here' || apiKey.startsWith('your-');

    if (isSimulation) {
      return res.json({
        toolId,
        output: `⚡ Résultat Généré par l'IA (${toolId.toUpperCase()}) :\n\n📌 Sujet : ${input || 'Concepts & Pratique'}\n\n1. Aperçu Théorique :\nAnalyse structurée des concepts essentiels en ${pathId?.toUpperCase() || 'PYTHON'}.\n\n2. Consignes & Exercice :\nImplémenter un module fonctionnel gérant l'entrée de données et le traitement logique.\n\n3. Résultat Attendu :\nExécution fluide avec sortie console validée.`,
        source: 'simulation'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Tu es un assistant IA pédagogique expert pour des apprenants en programmation (${pathId || 'Python'}). Outil demandé : "${toolId}". Entrée utilisateur / Sujet : "${input}". Génère un contenu complet, clair et parfaitement structuré avec explications, consignes ou code.`
    });

    return res.json({ toolId, output: response.text || '', source: 'gemini' });
  } catch (error) {
    console.error("AI Tool Generation Error:", error);
    res.status(500).json({ message: 'Failed to generate AI tool content' });
  }
};
