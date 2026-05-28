
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

let aiInstance: GoogleGenAI | null = null;
const getAi = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }
  return aiInstance;
};

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

  /**
   * Generates a beginner-friendly setup guide based on a repository's README
   */
  static async getBeginnerSetupGuide(repoName: string, repoDescription: string, readmeContent: string): Promise<string> {
    const prompt = `
      You are an expert AI Developer and friendly coding mentor.
      Your task is to generate a step-by-step, beginner-friendly setup guide for the following open-source project.
      
      Project Name: ${repoName}
      Description: ${repoDescription}
      
      Below is the project's raw README content:
      ---
      ${readmeContent.substring(0, 10000)}
      ---
      
      **Requirements for the Setup Guide:**
      1. Keep it simple and clear for absolute beginners (explain what commands do, e.g. "npm install downloads the project's dependencies").
      2. Structure the guide with clear headings (Prerequisites, Quick Installation, How to Run, and Basic Troubleshooting).
      3. Use clear markdown formatting, code blocks, and helpful emojis.
      4. Avoid overwhelming technical jargon; focus on the absolute minimum path to get the project running locally.
      
      Format your response in beautiful, clean Markdown. Do NOT include any intro or conversational filler (like "Here is the guide..."). Start directly with the title.
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt
      });
      return response.text || "Failed to generate setup guide.";
    } catch (error) {
      console.error("AI Setup Guide Generation Error:", error);
      return this.generateProgrammaticSetupGuide(repoName, readmeContent);
    }
  }

  /**
   * Programmatic fallback that parses a raw README and extracts setup instructions
   */
  private static generateProgrammaticSetupGuide(repoName: string, readmeContent: string): string {
    const lines = readmeContent.split(/\r?\n/);
    
    // Parse sections by headers
    const sections: { title: string; content: string[] }[] = [];
    let currentSection: { title: string; content: string[] } | null = null;
    
    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headerMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: headerMatch[2].trim(),
          content: []
        };
      } else if (currentSection) {
        currentSection.content.push(line);
      } else {
        if (line.trim()) {
          currentSection = { title: "Overview", content: [line] };
        }
      }
    }
    if (currentSection) {
      sections.push(currentSection);
    }

    const findSection = (keywords: string[]) => {
      return sections.find(s => 
        keywords.some(kw => s.title.toLowerCase().includes(kw))
      );
    };

    const prereqSec = findSection(['prerequisite', 'requirement', 'dependenc', 'prepare']);
    const installSec = findSection(['install', 'setup', 'build', 'quickstart', 'getting started']);
    const runSec = findSection(['run', 'start', 'usage', 'execut', 'dev', 'server', 'deploy']);
    const configSec = findSection(['config', 'env', 'troubleshoot', 'faq', 'error']);

    let guide = `# 🛠️ Beginner Setup Guide for ${repoName}\n\n`;
    guide += `> [!NOTE]\n`;
    guide += `> This guide was programmatically generated from the repository's README to help you get started quickly.\n\n`;

    let sectionsAdded = 0;

    if (prereqSec && prereqSec.content.join('\n').trim().length > 20) {
      guide += `### 📋 Prerequisites\n`;
      guide += prereqSec.content.join('\n').trim().substring(0, 1500) + `\n\n`;
      sectionsAdded++;
    }

    if (installSec && installSec.content.join('\n').trim().length > 20) {
      guide += `### ⚙️ Installation & Setup\n`;
      guide += installSec.content.join('\n').trim().substring(0, 2000) + `\n\n`;
      sectionsAdded++;
    }

    if (runSec && runSec.content.join('\n').trim().length > 20) {
      guide += `### 🚀 How to Run\n`;
      guide += runSec.content.join('\n').trim().substring(0, 2000) + `\n\n`;
      sectionsAdded++;
    }

    if (configSec && configSec.content.join('\n').trim().length > 20 && configSec !== installSec) {
      guide += `### 🔧 Configuration & Troubleshooting\n`;
      guide += configSec.content.join('\n').trim().substring(0, 1500) + `\n\n`;
      sectionsAdded++;
    }

    // Extract commands if we couldn't get a fully structured guide
    if (sectionsAdded < 2) {
      guide = `# 🛠️ Beginner Setup Guide for ${repoName}\n\n`;
      guide += `> [!NOTE]\n`;
      guide += `> This guide was programmatically generated by scanning the repository's code instructions.\n\n`;

      const codeBlocks: string[] = [];
      let inCodeBlock = false;
      let currentBlock: string[] = [];

      for (const line of lines) {
        if (line.startsWith('```')) {
          if (inCodeBlock) {
            inCodeBlock = false;
            codeBlocks.push(currentBlock.join('\n'));
            currentBlock = [];
          } else {
            inCodeBlock = true;
          }
        } else if (inCodeBlock) {
          currentBlock.push(line);
        }
      }

      const relevantBlocks = codeBlocks.filter(block => {
        const lower = block.toLowerCase();
        return (
          lower.includes('install') || 
          lower.includes('npm') || 
          lower.includes('pip') || 
          lower.includes('run') || 
          lower.includes('start') || 
          lower.includes('build') ||
          lower.includes('go ') ||
          lower.includes('cargo') ||
          lower.includes('python') ||
          lower.includes('docker')
        );
      });

      if (relevantBlocks.length > 0) {
        guide += `### ⚙️ Step-by-Step Commands\n\n`;
        guide += `Here are the installation and run commands found in the repository instructions:\n\n`;
        
        let commandIndex = 1;
        for (const block of relevantBlocks) {
          guide += `**Step ${commandIndex}:** Run the following command(s):\n`;
          guide += `\`\`\`bash\n${block.trim()}\n\`\`\`\n\n`;
          commandIndex++;
        }
      }

      guide += `### 📖 Learn More\n`;
      guide += `For detailed documentation and custom configurations, please switch to the **Full README** tab.`;
    }

    return guide;
  }

  private static getFallbackRecommendation() {
    return {
      recommendation: "Keep practicing your core skills to build a strong foundation!",
      nextSteps: ["Review previous lessons", "Complete daily challenges", "Practice basic syntax"],
      difficultyAdjustment: "MEDIUM"
    };
  }
}
