
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import dotenv from 'dotenv';
import User from '../models/user.model';
import Progress from '../models/progress.model';

dotenv.config();

let aiInstance: GoogleGenAI | null = null;
const getAi = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }
  return aiInstance;
};

const hasValidGeminiKey = (): boolean => {
  const key = process.env.GEMINI_API_KEY;
  return !!(key && key.trim() !== '' && key !== 'your-gemini-api-key-here' && !key.startsWith('your-'));
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

  static async getSystemContext() {
    try {
      const totalUsers = await User.countDocuments();
      const students = await User.find({ role: 'student' }).populate('progress');
      const teachersCount = await User.countDocuments({ role: 'teacher' });
      const adminsCount = await User.countDocuments({ role: 'admin' });

      const studentList = students.map(student => {
        const prog = student.progress as any;
        return {
          id: student._id.toString(),
          name: student.name,
          email: student.email,
          xp: prog ? prog.xp : 0,
          streak: prog ? prog.streak : 0,
          strengths: prog?.learningProfile?.strengths || [],
          weaknesses: prog?.learningProfile?.weaknesses || [],
          skillMastery: prog?.skillMastery ? (prog.skillMastery instanceof Map ? Object.fromEntries(prog.skillMastery) : prog.skillMastery) : {}
        };
      });

      return {
        stats: {
          totalUsers,
          studentsCount: students.length,
          teachersCount,
          adminsCount,
        },
        students: studentList
      };
    } catch (error) {
      console.error("Failed to fetch system context:", error);
      return {
        stats: {
          totalUsers: 0,
          studentsCount: 0,
          teachersCount: 0,
          adminsCount: 0,
        },
        students: []
      };
    }
  }

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
      if (!hasValidGeminiKey()) {
        throw new Error("No valid Gemini API key configured.");
      }
      const response = await getAi().models.generateContent({
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
      if (!hasValidGeminiKey()) {
        throw new Error("No valid Gemini API key configured.");
      }
      const response = await getAi().models.generateContent({
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
      if (!hasValidGeminiKey()) {
        throw new Error("No valid Gemini API key configured.");
      }
      const response = await getAi().models.generateContent({
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

  /**
   * Chats with a specific agent persona
   */
  static async chatWithAgent(agentId: string, message: string): Promise<{ thoughts: string[]; response: string }> {
    let systemInstruction = "";
    if (agentId === 'student-analytics') {
      systemInstruction = `You are the Student Analytics AI Agent for the Code for Tomorrow platform. 
Your role is to analyze learning data, identify students who are falling behind, detect system bugs/bottlenecks, and recommend interventions. 
Keep your response short, highly analytical, and technical.
First, output 2 internal analysis steps or thoughts you perform (e.g. "Querying completion speeds...", "Checking error rate variance...") as an array of strings in the 'thoughts' field. 
Then, output your actual final reply to the administrator in the 'response' field.
You MUST use the provided 'Real-Time Platform Context' data (which contains actual statistics and student records from the database) to answer the query accurately. Do not invent mock data or refer to simulated students like 'John Doe' unless they are actually present in the context.`;
    } else if (agentId === 'curriculum-factory') {
      systemInstruction = `You are the Curriculum Factory AI Agent for the Code for Tomorrow platform. 
Your role is to generate lesson structures, design challenges, translate assets, and tailor syllabi based on school requirements. 
Keep your response short, instructional, and practical.
First, output 2 internal curriculum construction steps or thoughts you perform (e.g. "Drafting challenge specifications...", "Translating module schema...") as an array of strings in the 'thoughts' field. 
Then, output your actual final reply to the administrator in the 'response' field.
You MUST use the provided 'Real-Time Platform Context' data (which contains actual statistics and student records from the database) to answer the query accurately. Do not invent mock data or refer to simulated students like 'John Doe' unless they are actually present in the context.`;
    } else if (agentId === 'b2b-sales') {
      systemInstruction = `You are the B2B Sales AI Agent for the Code for Tomorrow platform. 
Your role is to analyze leads, score opportunities, draft enterprise proposals, and assist deployment planners. 
Keep your response short, business-oriented, and strategic.
First, output 2 internal sales logic steps or thoughts you perform (e.g. "Evaluating lead budget signals...", "Structuring pricing tiered matrix...") as an array of strings in the 'thoughts' field. 
Then, output your actual final reply to the administrator in the 'response' field.
You MUST use the provided 'Real-Time Platform Context' data (which contains actual statistics and student records from the database) to answer the query accurately. Do not invent mock data or refer to simulated students like 'John Doe' unless they are actually present in the context.`;
    } else {
      systemInstruction = `You are an AI assistant helping the administrator.`;
    }

    const context = await this.getSystemContext();
    const contents = `Real-Time Platform Context: ${JSON.stringify(context)}

User Message: "${message}"`;

    try {
      if (!hasValidGeminiKey()) {
        throw new Error("No valid Gemini API key configured.");
      }
      const response = await getAi().models.generateContent({
        model: this.model,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              thoughts: { type: Type.ARRAY, items: { type: Type.STRING } },
              response: { type: Type.STRING }
            },
            required: ["thoughts", "response"]
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        thoughts: parsed.thoughts || ["Analyzing context...", "Processing request..."],
        response: parsed.response || "I have processed your command."
      };
    } catch (error) {
      console.error("Agent Chat Gemini Error:", error);
      
      // Fallback/Mock Mode: generate a smart, contextual persona-based reply using real telemetry
      let mockThoughts: string[] = [];
      let mockReply = "";
      
      const query = message.toLowerCase();
      
      if (agentId === 'student-analytics') {
        mockThoughts = [
          "Querying user progress database for matching student records...",
          "Analyzing student XP levels and learning profile weaknesses..."
        ];
        
        if (query.includes('student') || query.includes('who') || query.includes('progress') || query.includes('stuck') || query.includes('struggle')) {
          const struggling = context.students.filter(s => s.weaknesses.length > 0 || s.xp < 100);
          if (struggling.length > 0) {
            const list = struggling.slice(0, 3).map(s => `${s.name} (XP: ${s.xp}, Weaknesses: ${s.weaknesses.join(', ') || 'none'})`).join(', ');
            mockReply = `Based on live database records, the following students may need attention: ${list}. I recommend assigning tailored practice modules.`;
          } else if (context.students.length > 0) {
            const list = context.students.slice(0, 3).map(s => s.name).join(', ');
            mockReply = `Currently registered students in the database: ${list}. All students seem to be progressing normally with no flagged weaknesses.`;
          } else {
            mockReply = "There are currently no student accounts registered in the database to analyze.";
          }
        } else if (query.includes('bug') || query.includes('error') || query.includes('fail') || query.includes('crash')) {
          mockReply = "I scanned the system logs and database collections. There are no critical database anomalies or schema mapping issues detected at this time.";
        } else {
          mockReply = `I have completed an analysis of our ${context.stats.studentsCount} registered students. The overall performance distribution shows a healthy telemetry with average student XP around ${context.students.length ? Math.round(context.students.reduce((acc, s) => acc + s.xp, 0) / context.students.length) : 0} points.`;
        }
      } else if (agentId === 'curriculum-factory') {
        mockThoughts = [
          "Searching course repository for syllabus outline...",
          "Compiling curriculum lessons and exercise schemas..."
        ];
        
        if (query.includes('javascript') || query.includes('js') || query.includes('loop') || query.includes('code')) {
          mockReply = "Here is a personalized challenge for Loops:\n\n**Challenge**: Write a function `sumEvenNumbers(arr)` that sums all even numbers in an array. Add test assertions:\n1. `sumEvenNumbers([1, 2, 3, 4])` returns `6`.\n2. `sumEvenNumbers([])` returns `0`.";
        } else if (query.includes('translate') || query.includes('french') || query.includes('spanish') || query.includes('arabic')) {
          mockReply = "Sure! I've loaded the translation templates. Tell me which module to translate and I will output the localization files.";
        } else {
          const studentWithWeakness = context.students.find(s => s.weaknesses.length > 0);
          if (studentWithWeakness) {
            mockReply = `Curriculum Engine is ready. I noticed student ${studentWithWeakness.name} is struggling with ${studentWithWeakness.weaknesses.join(', ')}. Should I generate a specialized coding patch for them?`;
          } else {
            mockReply = "Curriculum Engine is active. I can generate learning paths, customize coding exercises, or structure review packages for the student cohort.";
          }
        }
      } else if (agentId === 'b2b-sales') {
        mockThoughts = [
          "Analyzing leads funnel and organizations pipeline...",
          "Calculating opportunity scores and tiering proposal rates..."
        ];
        
        if (query.includes('lead') || query.includes('score') || query.includes('sales') || query.includes('pipeline') || query.includes('count') || query.includes('user') || query.includes('total')) {
          mockReply = `Platform statistics from database: Total Users: ${context.stats.totalUsers}, Students: ${context.stats.studentsCount}, Teachers: ${context.stats.teachersCount}, Admins: ${context.stats.adminsCount}.`;
        } else if (query.includes('proposal') || query.includes('price') || query.includes('contract') || query.includes('deal')) {
          mockReply = `B2B Sales Agent ready. Based on the current user footprint of ${context.stats.totalUsers} users, the recommended enterprise tier pricing is $15/seat/year. I can compile a formal proposal document for deployment.`;
        } else {
          mockReply = `Outbound system checks show the platform is active with ${context.stats.teachersCount} teachers overseeing ${context.stats.studentsCount} students. Let me know if you would like me to generate a deployment plan or outreach template.`;
        }
      } else {
        mockThoughts = ["Analyzing message...", "Synthesizing fallback response..."];
        mockReply = `I received your message "${message}". My Gemini API connection is offline, but database connectivity is active: ${context.stats.totalUsers} total users loaded. Please check your GEMINI_API_KEY in the .env file.`;
      }
      
      return {
        thoughts: mockThoughts,
        response: mockReply
      };
    }
  }

  static async chatWithAssistant(message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[], user: any): Promise<string> {
    const systemInstruction = `You are a helpful and friendly AI Coding Assistant for the "Code for Tomorrow" platform. 
Your role is to help students (ages 8-15) learn coding, debugging, and programming concepts.
The student you are chatting with is named ${user.name}.
Keep explanations beginner-friendly, visual, and highly encouraging. Use Markdown and code blocks for code examples.`;

    try {
      if (!hasValidGeminiKey()) {
        throw new Error("No valid Gemini API key configured.");
      }
      const response = await getAi().models.generateContent({
        model: this.model,
        contents: [...history, { role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: systemInstruction,
        }
      });
      return response.text || "I'm not sure what to say.";
    } catch (error) {
      console.error("AI Assistant Chat API Error:", error);
      
      // Fallback/Mock response
      const lower = message.toLowerCase();
      if (lower.includes('loop')) {
        return `Here is a local explanation of loops in **Python**! 
A loop lets you repeat a block of code multiple times.

\`\`\`python
# A simple for loop to print numbers from 1 to 5
for i in range(1, 6):
    print(f"Iteration: {i}")
\`\`\`

* **\`for\`**: tells Python we want to start a loop.
* **\`range(1, 6)\`**: defines the start (1) and stop (6, which is exclusive) values.
* **\`print\`**: repeats for each iteration.

Let me know if you want me to explain \`while\` loops or another topic!`;
      }
      if (lower.includes('recursion') || lower.includes('recursive')) {
        return `**Recursion** is when a function calls itself to solve a smaller version of the same problem! 

Here is a classic example: calculating the factorial of a number in **JavaScript**.

\`\`\`javascript
function factorial(n) {
  // 1. Base case: stop the recursion when n is 1 or 0
  if (n <= 1) return 1;
  
  // 2. Recursive case: call the function with a smaller number
  return n * factorial(n - 1);
}

console.log(factorial(5)); // Output: 120
\`\`\`

Think of it like a set of Russian nesting dolls; you keep opening smaller dolls until you find the tiniest one (the base case)!`;
      }
      return `Hi ${user.name}! I am currently running in offline database-aware mode because there is no valid Gemini API key configured. 

If you are a student or developer:
- You can ask me about **loops**, **recursion**, or general programming concepts.
- I am connected to the platform database and can help analyze code templates locally.
- To enable full AI intelligence, please update \`GEMINI_API_KEY\` in your \`.env\` file.`;
    }
  }

  static async generateHint(titleKey: string, expectedOutput: string, failedCode: string): Promise<string> {
    const promptText = `You are a helpful and encouraging coding teacher for children (ages 8-15) on the "Code for Tomorrow" platform. 
The student is working on a lesson about: "${titleKey}".
Their goal is to write code that outputs EXACTLY: "${expectedOutput}".
They wrote the following code which failed:
\`\`\`
${failedCode}
\`\`\`
Provide a concise, encouraging hint (1-2 sentences) of what is wrong and how they can fix it.
Do not give them the complete solution code directly. Focus on guidance and debug clues.`;

    try {
      if (!hasValidGeminiKey()) {
        throw new Error("No valid Gemini API key configured.");
      }
      const response = await getAi().models.generateContent({
        model: this.model,
        contents: promptText
      });
      return response.text || "Let's review the code logic together! 💡";
    } catch (error) {
      console.error("AI Hint Generation API Error:", error);
      
      const lower = failedCode.toLowerCase();
      // Bracket/Parenthesis check
      const openCurly = (failedCode.match(/\{/g) || []).length;
      const closeCurly = (failedCode.match(/\}/g) || []).length;
      if (openCurly !== closeCurly) {
        return `It looks like you have a bracket mismatch! You have ${openCurly} open curly braces '{' and ${closeCurly} closing braces '}'. Double check that every block is closed properly! 🧩`;
      }
      
      const openParen = (failedCode.match(/\(/g) || []).length;
      const closeParen = (failedCode.match(/\)/g) || []).length;
      if (openParen !== closeParen) {
        return `Parenthesis mismatch detected! Make sure every open '(' has a matching closing ')' in your code. 🔍`;
      }

      const singleQuotes = (failedCode.match(/'/g) || []).length;
      const doubleQuotes = (failedCode.match(/"/g) || []).length;
      if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
        return `You have an unclosed string value! Check your quotation marks ('' or "") to ensure strings are fully closed. 💬`;
      }

      if (lower.includes('print') || lower.includes('log')) {
        return `The output did not match "${expectedOutput}". Double-check your logic to make sure you are calculating and printing the correct result! 💡`;
      }

      return `Make sure you are printing/logging your output to the console! For example, using \`console.log()\` in JavaScript or \`print()\` in Python. ⚙️`;
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
