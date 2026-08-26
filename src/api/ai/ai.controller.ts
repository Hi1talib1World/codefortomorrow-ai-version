
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
    const cleanTopic = (interest || 'Coding Mastery').trim();
    const lowerTopic = cleanTopic.toLowerCase();

    if (isSimulation) {
      let subTitle = 'Player Health & Damage System';
      let icon = '🎮';
      let starterCode = `# ${cleanTopic}: Player Health System\nplayer_hp = 100\ndamage = 25\n\n# TODO: Compute remaining_hp\nremaining_hp = player_hp - damage\n\nprint("Player HP:", remaining_hp)`;
      let solutionCode = `# ${cleanTopic}: Player Health System\nplayer_hp = 100\ndamage = 25\n\nremaining_hp = player_hp - damage\n\nprint("Player HP:", remaining_hp)`;
      let expectedOutput = `Player HP: 75`;
      let desc = `Calculate remaining_hp (100 - 25) and print "Player HP: 75".`;

      if (lowerTopic.includes('space') || lowerTopic.includes('rocket') || lowerTopic.includes('astro')) {
        subTitle = 'Spacecraft Telemetry & Altitude';
        icon = '🚀';
        starterCode = `# Spacecraft Telemetry\nlaunch_alt = 120\nbooster_gain = 380\n\n# TODO: Calculate orbital_alt\norbital_alt = launch_alt + booster_gain\n\nprint("Orbital Telemetry:", orbital_alt, "km")`;
        solutionCode = `# Spacecraft Telemetry\nlaunch_alt = 120\nbooster_gain = 380\n\norbital_alt = launch_alt + booster_gain\n\nprint("Orbital Telemetry:", orbital_alt, "km")`;
        expectedOutput = `Orbital Telemetry: 500 km`;
        desc = `Add launch_alt (120) and booster_gain (380) to print "Orbital Telemetry: 500 km".`;
      } else if (lowerTopic.includes('robot') || lowerTopic.includes('ai') || lowerTopic.includes('autonomous')) {
        subTitle = 'Rover Obstacle Sonar Distance';
        icon = '🤖';
        starterCode = `# Autonomous Rover Distance Sensor\nsensor_reading = 50\nsafety_buffer = 15\n\n# TODO: Calculate safety_margin = sensor_reading - safety_buffer\nsafety_margin = sensor_reading - safety_buffer\n\nprint("Safety Margin:", safety_margin, "cm")`;
        solutionCode = `# Autonomous Rover Distance Sensor\nsensor_reading = 50\nsafety_buffer = 15\n\nsafety_margin = sensor_reading - safety_buffer\n\nprint("Safety Margin:", safety_margin, "cm")`;
        expectedOutput = `Safety Margin: 35 cm`;
        desc = `Calculate safety_margin (50 - 15) and print "Safety Margin: 35 cm".`;
      } else if (lowerTopic.includes('cyber') || lowerTopic.includes('security') || lowerTopic.includes('shield') || lowerTopic.includes('crypto')) {
        subTitle = 'Cipher Secret Key Verification';
        icon = '🔐';
        starterCode = `# Cipher Secret Key Shift\nbase_token = 200\nshift_key = 15\n\n# TODO: Compute encrypted_hash = base_token + shift_key\nencrypted_hash = base_token + shift_key\n\nprint("Encrypted Token:", encrypted_hash)`;
        solutionCode = `# Cipher Secret Key Shift\nbase_token = 200\nshift_key = 15\n\nencrypted_hash = base_token + shift_key\n\nprint("Encrypted Token:", encrypted_hash)`;
        expectedOutput = `Encrypted Token: 215`;
        desc = `Compute 200 + 15 and print "Encrypted Token: 215".`;
      }

      if (targetPath === 'javascript' || targetPath === 'web_dev') {
        starterCode = starterCode.replace(/#/g, '//').replace(/print\((.*?)\)/g, 'console.log($1)');
        solutionCode = solutionCode.replace(/#/g, '//').replace(/print\((.*?)\)/g, 'console.log($1)');
      }

      const mockLesson = {
        id: Math.floor(Math.random() * 90000) + 10000,
        level: Math.max(1, Math.min(10, Math.floor(userProgressContext.xp / 100) + 1)),
        titleKey: `AI Quest: ${cleanTopic} - ${subTitle}`,
        title: `AI Quest: ${cleanTopic} - ${subTitle}`,
        interest: cleanTopic,
        icon,
        xp: 150,
        color: '#10B981',
        type: 'lesson',
        nodeType: 'standard',
        difficulty: userProgressContext.xp > 200 ? 'Intermediate' : 'Beginner',
        introduction: `Welcome to your custom AI coding quest on **${cleanTopic}** (${subTitle})!\n\nIn this interactive mission, you will write functional code applying core logic in **${targetPath.toUpperCase()}**.\n\n### 📌 Key Objectives:\n1. Declare variables accurately.\n2. Execute arithmetic/logical calculations.\n3. Verify output string matches specification.`,
        starterCode,
        solutionCode,
        expectedOutput,
        challengeDescriptionKey: desc,
        challengeDescription: desc
      };
      return res.json({ lesson: mockLesson, source: 'simulation' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";

    const prompt = `You are an expert AI Curriculum Designer for a student learning programming in ${targetPath.toUpperCase()}.
Student Context:
- Specific Student Interest: "${cleanTopic}"
- Programming Language: "${targetPath}"
- Current XP: ${userProgressContext.xp}
- Lessons Completed: ${userProgressContext.completedLessonsCount}

Create a unique, creative, non-generic personalized coding lesson specifically tailored to "${cleanTopic}".
DO NOT use generic "Game Physics & Mechanics" unless explicitly requested. Make the title unique!

Return ONLY a valid JSON object matching this schema:
{
  "id": ${Math.floor(Math.random() * 90000) + 10000},
  "level": 1,
  "title": "AI Quest: [Unique Title matching ${cleanTopic}]",
  "titleKey": "AI Quest: [Unique Title matching ${cleanTopic}]",
  "icon": "🚀",
  "xp": 150,
  "color": "#10B981",
  "type": "lesson",
  "nodeType": "standard",
  "difficulty": "Beginner",
  "introduction": "Multi-paragraph rich concept overview connecting ${cleanTopic} to ${targetPath} syntax.",
  "starterCode": "// Starter code with TODO comment",
  "solutionCode": "// Working solution code",
  "expectedOutput": "Exact expected output string",
  "challengeDescription": "Step-by-step challenge instructions"
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
