
import { User, UserProgress, AppNotification } from '../types';

// ========================================================================================
// REAL BACKEND API SERVICE
//
// This file is the bridge between the React frontend and the Express backend.
// Each function makes an HTTP request to the server's API endpoints.
// Authentication is handled via JSON Web Tokens (JWT).
// ========================================================================================

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

// --- Helper for making authenticated requests ---
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// --- Helper for fetch to always include credentials (cookies) ---
const customFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  return window.fetch(input, {
    ...init,
    credentials: 'include',
  });
};

// --- Helper for fetch with timeout (e.g. 5000ms for AI calls) ---
const customFetchWithTimeout = (input: RequestInfo | URL, init?: RequestInit, timeoutMs = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return window.fetch(input, {
    ...init,
    credentials: 'include',
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));
};

// --- API Endpoints ---
const api = {
  /**
   * Registers a new user by sending their details to the backend.
   */
  register: async (name: string, email: string, password: string, role: 'teacher' | 'student', classroomCode?: string): Promise<User> => {
    const response = await customFetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, classroomCode }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to register.');
    }

    // Store the token and return the user object
    localStorage.setItem('authToken', data.token);
    return data;
  },

  /**
   * Logs in a user by sending credentials to the backend.
   */
  login: async (email: string, password: string): Promise<User> => {
    const response = await customFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to login.');
    }

    localStorage.setItem('authToken', data.token);
    return data;
  },

  /**
   * Google login is a complex flow. For now, we'll keep it mocked but show
   * how a real implementation would start.
   */
  loginWithGoogle: async (token: string): Promise<User> => {
    const response = await customFetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to login with Google.');
    }

    localStorage.setItem('authToken', data.token);
    return data;
  },

  /**
   * Firebase login takes a Firebase ID token and authenticates with the backend.
   */
  loginWithFirebase: async (token: string): Promise<User> => {
    const payload = { token };
    const response = await customFetch(`${API_BASE_URL}/auth/firebase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to login with Firebase.');
    }

    localStorage.setItem('authToken', data.token);
    return data;
  },

  /**
   * Logs out the current user by clearing the local token and server cookies.
   */
  logout: async (): Promise<void> => {
    try {
      await customFetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error('Failed to logout from server:', err);
    }
    localStorage.removeItem('authToken');
  },

  /**
   * Gets the currently logged-in user's profile from the backend using cookies or token.
   */
  getLoggedInUser: async (): Promise<User | null> => {
    try {
      const response = await customFetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.error('Error fetching logged in user:', error);
    }

    localStorage.removeItem('authToken');
    return null;
  },

  /**
   * Updates the user's profile information on the backend.
   */
  updateUserProfile: async (updatedData: Partial<User>): Promise<User> => {
    const response = await customFetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile.');
    }
    return data;
  },

  /**
   * Toggles the saved state of a repository or blog post.
   */
  toggleSaveItem: async (itemId: string, type: 'repo' | 'post'): Promise<User> => {
    const response = await customFetch(`${API_BASE_URL}/users/save`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ itemId, type }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Failed to toggle save for ${type}.`);
    }
    return data;
  },

  /**
   * Updates the user's learning progress on the backend.
   * If the browser is offline, buffers the progress update locally and triggers a sync event.
   */
  updateUserProgress: async (newProgress: Partial<UserProgress>): Promise<UserProgress> => {
    if (!navigator.onLine) {
      console.log('📡 Offline Sync Manager: Buffering progress update locally...');
      try {
        const queueStr = localStorage.getItem('cft_offline_progress_queue');
        const queue = queueStr ? JSON.parse(queueStr) : [];
        queue.push({
          timestamp: new Date().toISOString(),
          data: newProgress,
        });
        localStorage.setItem('cft_offline_progress_queue', JSON.stringify(queue));
        
        // Dispatch custom event to notify Header/SyncContext
        window.dispatchEvent(new Event('cft_offline_queue_updated'));
      } catch (e) {
        console.error('Failed to buffer progress locally:', e);
      }
      return newProgress as UserProgress;
    }

    const response = await customFetch(`${API_BASE_URL}/users/progress`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(newProgress)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update progress.');
    }
    return data;
  },

  // --- Quiz Endpoints ---
  createQuiz: async (quizData: any): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/quizzes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(quizData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create quiz.');
    }
    return data;
  },

  getTeacherQuizzes: async (): Promise<any[]> => {
    const response = await customFetch(`${API_BASE_URL}/quizzes/teacher`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch quizzes.');
    }
    return data;
  },

  deleteQuiz: async (quizId: string): Promise<void> => {
    const response = await customFetch(`${API_BASE_URL}/quizzes/${quizId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete quiz.');
    }
  },

  // --- Activity Endpoints ---
  createActivity: async (activityData: any): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(activityData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create activity.');
    }
    return data;
  },

  getTeacherActivities: async (): Promise<any[]> => {
    const response = await customFetch(`${API_BASE_URL}/activities/teacher`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch activities.');
    }
    return data;
  },

  deleteActivity: async (activityId: string): Promise<void> => {
    const response = await customFetch(`${API_BASE_URL}/activities/${activityId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete activity.');
    }
  },

  // --- Message Endpoints ---
  sendMessage: async (receiverId: string, content: string): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ receiverId, content }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send message.');
    }
    return data;
  },

  getConversations: async (): Promise<any[]> => {
    const response = await customFetch(`${API_BASE_URL}/messages/conversations`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch conversations.');
    }
    return data;
  },

  getConversation: async (userId: string): Promise<any[]> => {
    const response = await customFetch(`${API_BASE_URL}/messages/conversation/${userId}`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch conversation.');
    }
    return data;
  },

  getTeachers: async (): Promise<any[]> => {
    const response = await customFetch(`${API_BASE_URL}/users/teachers`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch teachers.');
    }
    return data;
  },

  searchUsers: async (query: string): Promise<any[]> => {
    const response = await customFetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to search users.');
    }
    return data;
  },

  getLeaderboard: async (): Promise<any[]> => {
    const response = await customFetch(`${API_BASE_URL}/users/leaderboard`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch leaderboard.');
    }
    return data;
  },

  // --- AI Endpoints ---
  getAILearningProfile: async (): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/ai/profile`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch AI profile.');
    }
    return data;
  },

  getClassAnalytics: async (): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/ai/analytics`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch class analytics.');
    }
    return data;
  },

  generateQuizFromAI: async (prompt: string, fileData?: { data: string, mimeType: string }): Promise<any> => {
    // This will call a new backend endpoint that handles the Gemini logic
    const response = await customFetch(`${API_BASE_URL}/ai/generate-quiz`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ prompt, fileData }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate quiz with AI.');
    }
    return data;
  },

  getAgentDashboard: async (): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/agents/status`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch agent dashboard.');
    }
    return data;
  },

  sendAgentCommand: async (agentId: string, command: string): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/agents/${agentId}/command`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ command }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send command to agent.');
    }
    return data;
  },

  pauseAgent: async (agentId: string): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/agents/${agentId}/pause`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to pause agent.');
    }
    return data;
  },

  resumeAgent: async (agentId: string): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/agents/${agentId}/resume`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to resume agent.');
    }
    return data;
  },

  orchestrateTask: async (payload: { agentId?: string; taskIntent?: string; inputData: any }): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/agents/orchestrate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Orchestration request failed.');
    return data;
  },

  generateCurriculum: async (inputData: any): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/agents/curriculum/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(inputData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Curriculum generation failed.');
    return data;
  },

  analyzeStudent: async (inputData: any): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/agents/analytics/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(inputData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Student analytics analysis failed.');
    return data;
  },

  processB2BLead: async (inputData: any): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/agents/b2b/leads`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(inputData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'B2B Lead processing failed.');
    return data;
  },

  getB2BLeads: async (): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/agents/b2b/leads`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch B2B leads.');
    return data;
  },

  approveB2BLead: async (leadId: string): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/agents/b2b/leads/${leadId}/approve`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to approve B2B lead.');
    return data;
  },

  getAgentExecutionsHistory: async (): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/agents/executions`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch agent executions history.');
    return data;
  },

  getStudentProgress: async (userId: string): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/progress/${userId}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch student progress.');
    }
    return data;
  },

  getSkillStates: async (userId: string): Promise<any[]> => {
    const response = await customFetch(`${API_BASE_URL}/skills/${userId}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch skill states.');
    }
    return data;
  },

  getMissions: async (userId: string): Promise<any[]> => {
    const response = await customFetch(`${API_BASE_URL}/missions/${userId}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch missions.');
    }
    return data;
  },

  getAIStatus: async (): Promise<{ isSimulation: boolean }> => {
    const response = await customFetch(`${API_BASE_URL}/ai/status`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch AI status.');
    }
    return data;
  },

  chatWithAssistant: async (message: string, history: any[], buddyId?: string): Promise<{ text: string }> => {
    try {
      const response = await customFetchWithTimeout(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message, history, buddyId }),
      }, 8000);
      if (response.ok) {
        const data = await response.json();
        if (data && data.text) return data;
      }
    } catch (e) {
      console.warn("Backend AI Chat API request unavailable, using client buddy mascot fallback:", e);
    }

    // Dynamic Client Buddy Mascot Fallback Generator
    const lowerMsg = (message || '').toLowerCase();
    const buddy = (buddyId || 'pina').toLowerCase();

    const mascotResponses: Record<string, { intro: string; loop: string; array: string; debug: string; default: string }> = {
      pina: {
        intro: `Hoot hoot! 🦉 I'm **Pina**, your wise owl coding buddy! Let me help you break this down step by step:`,
        loop: `Hoot hoot! 🌳 A **loop** repeats actions automatically. Here is a simple Python example:\n\n\`\`\`python\n# Repeat 5 times\nfor i in range(1, 6):\n    print(f"Hoot number {i}!")\n\`\`\`\n\n1. \`for\` starts the repetition.\n2. \`range(1, 6)\` counts 1 through 5.`,
        array: `Hoot! 🦉 An **Array** (or List) is like a nest storing items in order:\n\n\`\`\`javascript\nlet fruits = ["Apple", "Banana", "Cherry"];\nconsole.log(fruits[0]); // "Apple"\n\`\`\``,
        debug: `Hoot! 🦉 Debugging tip: Check your line numbers, quote marks \`""\`, and matching brackets \`()\`. Small details matter!`,
        default: `Hoot hoot! 🦉 I'm right here to guide you. Try asking me about **loops**, **arrays**, **debugging**, or **variables**!`
      },
      rio: {
        intro: `Yo! 🐒 **Rio** here, ready to swing into action with you!`,
        loop: `Yo! 🐒 Check out how fast a loop repeats in code:\n\n\`\`\`python\nfor swing in range(1, 6):\n    print(f"Swing #{swing}! Yahoo!")\n\`\`\``,
        array: `Yo! 🍌 An Array is like a bunch of bananas linked together!\n\n\`\`\`javascript\nconst inventory = ["Shield", "Potion", "Sword"];\nconsole.log(inventory[1]); // "Potion"\n\`\`\``,
        debug: `Yo! 🐒 Got a bug? Don't panic! Check if your variables are spelled correctly or if you forgot a semicolon!`,
        default: `Yo! 🐒 Let's level up your code! Ask me about **loops**, **arrays**, or **how to debug errors**!`
      },
      lumo: {
        intro: `Initialising... 🤖 **Lumo** system active. Analysis of query: "${message}".`,
        loop: `Execution sequence: Iteration logic.\n\n\`\`\`python\nfor step in range(1, 6):\n    print(f"Cycle execution: {step}")\n\`\`\``,
        array: `Data structure: Array index mapping.\n\n\`\`\`javascript\nconst data = [10, 20, 30];\nconsole.log(data[0]); // Output: 10\n\`\`\``,
        debug: `Diagnostic check: Verify syntax balance. Match all open braces \`{\` with closing braces \`}\`.`,
        default: `System ready 🤖. Query topic categories: **loops**, **data structures**, or **syntax verification**.`
      },
      lina: {
        intro: `A new code mystery! 🦊 I'm **Lina**, let's sniff out the clues together!`,
        loop: `Here's a clue about loops! 🕵️‍♂️\n\n\`\`\`python\nfor clue in range(1, 6):\n    print(f"Clue #{clue} discovered!")\n\`\`\``,
        array: `An array is a row of clue boxes! 🦊\n\n\`\`\`javascript\nlet clues = ["Footprint", "Key", "Map"];\nconsole.log(clues[0]);\n\`\`\``,
        debug: `Detective Tip! 🦊 Print out variable values line by line to see where the secret bug is hiding!`,
        default: `Ready for investigation! 🦊 Ask me about **loops**, **arrays**, or **how to solve code riddles**!`
      },
      kai: {
        intro: `Peace... 🐢 **Kai** here. Take a deep breath, let's explore code peacefully.`,
        loop: `Like ocean tides, loops roll in with calm rhythm: 🌊\n\n\`\`\`python\nfor wave in range(1, 6):\n    print(f"Wave {wave} rolls in...")\n\`\`\``,
        array: `An array is like shells resting on the shore: 🐚\n\n\`\`\`javascript\nlet shells = ["Conch", "Pearl", "Coral"];\nconsole.log(shells[0]);\n\`\`\``,
        debug: `Take your time... 🐢 Most mistakes are just missed quotation marks or small typos. Check line by line.`,
        default: `Floating calmly in the code sea... 🐢 Ask me about **loops**, **arrays**, or **learning basics**!`
      }
    };

    const buddyPack = mascotResponses[buddy] || mascotResponses.pina;
    let replyText = buddyPack.default;

    if (lowerMsg.includes('loop') || lowerMsg.includes('for') || lowerMsg.includes('while')) replyText = buddyPack.loop;
    else if (lowerMsg.includes('array') || lowerMsg.includes('list') || lowerMsg.includes('index')) replyText = buddyPack.array;
    else if (lowerMsg.includes('bug') || lowerMsg.includes('error') || lowerMsg.includes('debug') || lowerMsg.includes('fix')) replyText = buddyPack.debug;
    else if (lowerMsg.length > 0) replyText = `${buddyPack.intro}\n\nTo build software with **${message}**, break your task into three parts:\n1. Declare variables to store data.\n2. Apply conditional logic or loops.\n3. Output the result cleanly to the console.`;

    return { text: replyText };
  },

  generateHint: async (titleKey: string, expectedOutput: string, failedCode: string): Promise<{ hint: string }> => {
    const response = await customFetch(`${API_BASE_URL}/ai/generate-hint`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ titleKey, expectedOutput, failedCode }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate AI hint.');
    }
    return data;
  },

  generatePersonalizedContent: async (interest: string, pathId?: string): Promise<{ lesson: any; source?: string }> => {
    try {
      const response = await customFetchWithTimeout(`${API_BASE_URL}/ai/generate-personalized-content`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ interest, pathId }),
      }, 5000);
      if (response.ok) {
        const data = await response.json();
        if (data && data.lesson) {
          return data;
        }
      }
    } catch (error) {
      console.warn("Backend API request failed or timed out (5s), falling back to dynamic client lesson generator:", error);
    }

    // Dynamic Client Fallback Generator with rich varied topics
    const targetPath = pathId || 'python';
    const cleanTopic = (interest || 'Coding Quest').trim();
    const lowerTopic = cleanTopic.toLowerCase();

    // Select dynamic category template
    let categoryKey = 'game';
    if (lowerTopic.includes('robot') || lowerTopic.includes('ai') || lowerTopic.includes('autonomous')) categoryKey = 'robotics';
    else if (lowerTopic.includes('space') || lowerTopic.includes('rocket') || lowerTopic.includes('astro')) categoryKey = 'space';
    else if (lowerTopic.includes('cyber') || lowerTopic.includes('shield') || lowerTopic.includes('security') || lowerTopic.includes('crypto')) categoryKey = 'cybersecurity';
    else if (lowerTopic.includes('web') || lowerTopic.includes('api') || lowerTopic.includes('app')) categoryKey = 'web';

    const templates: Record<string, Array<{ subTitle: string; icon: string; intro: string; py: any; js: any; cpp: any }>> = {
      game: [
        {
          subTitle: 'Player Health & Damage System',
          icon: '🎮',
          intro: `Welcome to **Player Health & Damage System**!\n\nIn video games, health systems track hit points (HP) when taking damage from obstacles or enemies.\n\n### 📌 Key Concepts:\n1. Initialize player HP variables.\n2. Subtract damage points.\n3. Output remaining HP.`,
          py: { starter: `# Player Health & Damage System\nplayer_hp = 100\ndamage = 25\n\n# TODO: Calculate remaining_hp\nremaining_hp = player_hp - damage\n\nprint("Player HP:", remaining_hp)`, solution: `# Player Health & Damage System\nplayer_hp = 100\ndamage = 25\n\nremaining_hp = player_hp - damage\n\nprint("Player HP:", remaining_hp)`, expected: `Player HP: 75`, desc: `Subtract damage (25) from player_hp (100) and print "Player HP: 75".` },
          js: { starter: `// Player Health & Damage System\nlet playerHp = 100;\nlet damage = 25;\n\n// TODO: Calculate remainingHp\nlet remainingHp = playerHp - damage;\n\nconsole.log("Player HP:", remainingHp);`, solution: `let playerHp = 100;\nlet damage = 25;\nlet remainingHp = playerHp - damage;\nconsole.log("Player HP:", remainingHp);`, expected: `Player HP: 75`, desc: `Calculate remainingHp (100 - 25) and log "Player HP: 75".` },
          cpp: { starter: `#include <iostream>\n\nint main() {\n  int player_hp = 100;\n  int damage = 25;\n  int remaining_hp = player_hp - damage;\n  std::cout << "Player HP: " << remaining_hp;\n  return 0;\n}`, solution: `#include <iostream>\n\nint main() {\n  int player_hp = 100;\n  int damage = 25;\n  int remaining_hp = player_hp - damage;\n  std::cout << "Player HP: " << remaining_hp;\n  return 0;\n}`, expected: `Player HP: 75`, desc: `Print "Player HP: 75".` }
        },
        {
          subTitle: 'Arcade Coin Streak Multiplier',
          icon: '🪙',
          intro: `Welcome to **Arcade Coin Streak Multiplier**!\n\nArcade games multiply coin values based on player streak combos.\n\n### 📌 Key Concepts:\n1. Define base coins and multiplier.\n2. Output total score.`,
          py: { starter: `# Coin Score Multiplier\nbase_coins = 10\nstreak_multiplier = 3\n\n# TODO: Compute total_score = base_coins * streak_multiplier\ntotal_score = base_coins * streak_multiplier\n\nprint("Total Coins Earned:", total_score)`, solution: `# Coin Score Multiplier\nbase_coins = 10\nstreak_multiplier = 3\n\ntotal_score = base_coins * streak_multiplier\n\nprint("Total Coins Earned:", total_score)`, expected: `Total Coins Earned: 30`, desc: `Multiply base_coins (10) by streak_multiplier (3) to print "Total Coins Earned: 30".` },
          js: { starter: `// Coin Score Multiplier\nlet baseCoins = 10;\nlet streakMultiplier = 3;\nlet totalScore = baseCoins * streakMultiplier;\nconsole.log("Total Coins Earned:", totalScore);`, solution: `let baseCoins = 10;\nlet streakMultiplier = 3;\nlet totalScore = baseCoins * streakMultiplier;\nconsole.log("Total Coins Earned:", totalScore);`, expected: `Total Coins Earned: 30`, desc: `Log "Total Coins Earned: 30".` },
          cpp: { starter: `#include <iostream>\n\nint main() {\n  int base_coins = 10;\n  int streak_multiplier = 3;\n  int total_score = base_coins * streak_multiplier;\n  std::cout << "Total Coins Earned: " << total_score;\n  return 0;\n}`, solution: `#include <iostream>\n\nint main() {\n  int base_coins = 10;\n  int streak_multiplier = 3;\n  int total_score = base_coins * streak_multiplier;\n  std::cout << "Total Coins Earned: " << total_score;\n  return 0;\n}`, expected: `Total Coins Earned: 30`, desc: `Print "Total Coins Earned: 30".` }
        }
      ],
      robotics: [
        {
          subTitle: 'Rover Distance Sonar Tracker',
          icon: '🤖',
          intro: `Welcome to **Rover Distance Sonar Tracker**!\n\nAutonomous rovers compute safety buffers using ultrasonic distance sensors.\n\n### 📌 Key Concepts:\n1. Read sensor distance.\n2. Calculate safety distance margin.`,
          py: { starter: `# Autonomous Rover Sensor\nsensor_reading = 50\nsafety_buffer = 15\n\n# TODO: Calculate safety_margin = sensor_reading - safety_buffer\nsafety_margin = sensor_reading - safety_buffer\n\nprint("Safety Margin:", safety_margin, "cm")`, solution: `# Autonomous Rover Sensor\nsensor_reading = 50\nsafety_buffer = 15\n\nsafety_margin = sensor_reading - safety_buffer\n\nprint("Safety Margin:", safety_margin, "cm")`, expected: `Safety Margin: 35 cm`, desc: `Compute safety_margin (50 - 15) and print "Safety Margin: 35 cm".` },
          js: { starter: `// Autonomous Rover Sensor\nlet sensorReading = 50;\nlet safetyBuffer = 15;\nlet safetyMargin = sensorReading - safetyBuffer;\nconsole.log("Safety Margin:", safetyMargin, "cm");`, solution: `let sensorReading = 50;\nlet safetyBuffer = 15;\nlet safetyMargin = sensorReading - safetyBuffer;\nconsole.log("Safety Margin:", safetyMargin, "cm");`, expected: `Safety Margin: 35 cm`, desc: `Log "Safety Margin: 35 cm".` },
          cpp: { starter: `#include <iostream>\n\nint main() {\n  int sensor_reading = 50;\n  int safety_buffer = 15;\n  int safety_margin = sensor_reading - safety_buffer;\n  std::cout << "Safety Margin: " << safety_margin << " cm";\n  return 0;\n}`, solution: `#include <iostream>\n\nint main() {\n  int sensor_reading = 50;\n  int safety_buffer = 15;\n  int safety_margin = sensor_reading - safety_buffer;\n  std::cout << "Safety Margin: " << safety_margin << " cm";\n  return 0;\n}`, expected: `Safety Margin: 35 cm`, desc: `Print "Safety Margin: 35 cm".` }
        }
      ],
      space: [
        {
          subTitle: 'Spacecraft Orbital Telemetry',
          icon: '🚀',
          intro: `Welcome to **Spacecraft Orbital Telemetry**!\n\nSpacecraft navigation computes altitude relative to planetary sea level.\n\n### 📌 Key Concepts:\n1. Read launch altitude and booster gains.\n2. Compute total orbital altitude.`,
          py: { starter: `# Spacecraft Telemetry\nlaunch_alt = 120\nbooster_gain = 380\n\n# TODO: Calculate orbital_alt\norbital_alt = launch_alt + booster_gain\n\nprint("Orbital Telemetry:", orbital_alt, "km")`, solution: `# Spacecraft Telemetry\nlaunch_alt = 120\nbooster_gain = 380\n\norbital_alt = launch_alt + booster_gain\n\nprint("Orbital Telemetry:", orbital_alt, "km")`, expected: `Orbital Telemetry: 500 km`, desc: `Calculate 120 + 380 and print "Orbital Telemetry: 500 km".` },
          js: { starter: `// Spacecraft Telemetry\nlet launchAlt = 120;\nlet boosterGain = 380;\nlet orbitalAlt = launchAlt + boosterGain;\nconsole.log("Orbital Telemetry:", orbitalAlt, "km");`, solution: `let launchAlt = 120;\nlet boosterGain = 380;\nlet orbitalAlt = launchAlt + boosterGain;\nconsole.log("Orbital Telemetry:", orbitalAlt, "km");`, expected: `Orbital Telemetry: 500 km`, desc: `Log "Orbital Telemetry: 500 km".` },
          cpp: { starter: `#include <iostream>\n\nint main() {\n  int launch_alt = 120;\n  int booster_gain = 380;\n  int orbital_alt = launch_alt + booster_gain;\n  std::cout << "Orbital Telemetry: " << orbital_alt << " km";\n  return 0;\n}`, solution: `#include <iostream>\n\nint main() {\n  int launch_alt = 120;\n  int booster_gain = 380;\n  int orbital_alt = launch_alt + booster_gain;\n  std::cout << "Orbital Telemetry: " << orbital_alt << " km";\n  return 0;\n}`, expected: `Orbital Telemetry: 500 km`, desc: `Print "Orbital Telemetry: 500 km".` }
        }
      ],
      cybersecurity: [
        {
          subTitle: 'Cipher Key Hash Encryption',
          icon: '🔐',
          intro: `Welcome to **Cipher Key Hash Encryption**!\n\nSecurity protocols shift numeric secret keys to encrypt payload bytes.\n\n### 📌 Key Concepts:\n1. Compute encrypted hash token.\n2. Output security verification.`,
          py: { starter: `# Cipher Key Shift\nbase_token = 200\nshift_key = 15\n\n# TODO: Calculate encrypted_hash = base_token + shift_key\nencrypted_hash = base_token + shift_key\n\nprint("Encrypted Token:", encrypted_hash)`, solution: `# Cipher Key Shift\nbase_token = 200\nshift_key = 15\n\nencrypted_hash = base_token + shift_key\n\nprint("Encrypted Token:", encrypted_hash)`, expected: `Encrypted Token: 215`, desc: `Compute 200 + 15 and print "Encrypted Token: 215".` },
          js: { starter: `// Cipher Key Shift\nlet baseToken = 200;\nlet shiftKey = 15;\nlet encryptedHash = baseToken + shiftKey;\nconsole.log("Encrypted Token:", encryptedHash);`, solution: `let baseToken = 200;\nlet shiftKey = 15;\nlet encryptedHash = baseToken + shiftKey;\nconsole.log("Encrypted Token:", encryptedHash);`, expected: `Encrypted Token: 215`, desc: `Log "Encrypted Token: 215".` },
          cpp: { starter: `#include <iostream>\n\nint main() {\n  int base_token = 200;\n  int shift_key = 15;\n  int encrypted_hash = base_token + shift_key;\n  std::cout << "Encrypted Token: " << encrypted_hash;\n  return 0;\n}`, solution: `#include <iostream>\n\nint main() {\n  int base_token = 200;\n  int shift_key = 15;\n  int encrypted_hash = base_token + shift_key;\n  std::cout << "Encrypted Token: " << encrypted_hash;\n  return 0;\n}`, expected: `Encrypted Token: 215`, desc: `Print "Encrypted Token: 215".` }
        }
      ],
      web: [
        {
          subTitle: 'Web API Quota Tracker',
          icon: '🌐',
          intro: `Welcome to **Web API Quota Tracker**!\n\nWeb servers track API request quotas to enforce rate limits.\n\n### 📌 Key Concepts:\n1. Define request limits and usage.\n2. Output remaining request credits.`,
          py: { starter: `# API Quota Tracker\nmax_requests = 1000\nused_requests = 340\n\n# TODO: Calculate remaining = max_requests - used_requests\nremaining = max_requests - used_requests\n\nprint("API Requests Remaining:", remaining)`, solution: `# API Quota Tracker\nmax_requests = 1000\nused_requests = 340\n\nremaining = max_requests - used_requests\n\nprint("API Requests Remaining:", remaining)`, expected: `API Requests Remaining: 660`, desc: `Subtract 340 from 1000 and print "API Requests Remaining: 660".` },
          js: { starter: `// API Quota Tracker\nlet maxRequests = 1000;\nlet usedRequests = 340;\nlet remaining = maxRequests - usedRequests;\nconsole.log("API Requests Remaining:", remaining);`, solution: `let maxRequests = 1000;\nlet usedRequests = 340;\nlet remaining = maxRequests - usedRequests;\nconsole.log("API Requests Remaining:", remaining);`, expected: `API Requests Remaining: 660`, desc: `Log "API Requests Remaining: 660".` },
          cpp: { starter: `#include <iostream>\n\nint main() {\n  int max_requests = 1000;\n  int used_requests = 340;\n  int remaining = max_requests - used_requests;\n  std::cout << "API Requests Remaining: " << remaining;\n  return 0;\n}`, solution: `#include <iostream>\n\nint main() {\n  int max_requests = 1000;\n  int used_requests = 340;\n  int remaining = max_requests - used_requests;\n  std::cout << "API Requests Remaining: " << remaining;\n  return 0;\n}`, expected: `API Requests Remaining: 660`, desc: `Print "API Requests Remaining: 660".` }
        }
      ]
    };

    const categoryList = templates[categoryKey] || templates.game;
    const selectedTemplate = categoryList[Math.floor(Math.random() * categoryList.length)];
    const codeSpec = targetPath === 'c++' ? selectedTemplate.cpp : (targetPath === 'javascript' || targetPath === 'web_dev' ? selectedTemplate.js : selectedTemplate.py);

    const titleText = cleanTopic.startsWith('AI Quest') ? cleanTopic : `AI Quest: ${cleanTopic} (${selectedTemplate.subTitle})`;

    const fallbackLesson = {
      id: Math.floor(Math.random() * 90000) + 10000,
      level: 1,
      titleKey: titleText,
      title: titleText,
      interest: cleanTopic,
      icon: selectedTemplate.icon,
      xp: 150,
      color: '#10B981',
      type: 'lesson',
      nodeType: 'standard',
      difficulty: 'Beginner',
      introduction: selectedTemplate.intro,
      starterCode: codeSpec.starter,
      solutionCode: codeSpec.solution,
      expectedOutput: codeSpec.expected,
      challengeDescriptionKey: codeSpec.desc,
      challengeDescription: codeSpec.desc
    };

    return { lesson: fallbackLesson, source: 'client_fallback' };
  },

  generateToolContent: async (toolId: string, input: string, pathId?: string): Promise<{ toolId: string; output: string; source?: string }> => {
    try {
      const response = await customFetchWithTimeout(`${API_BASE_URL}/ai/generate-tool-content`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ toolId, input, pathId }),
      }, 5000);
      if (response.ok) {
        const data = await response.json();
        if (data && data.output) {
          return data;
        }
      }
    } catch (error) {
      console.warn("Backend tool API request failed or timed out (5s), falling back to offline client generator:", error);
    }

    return {
      toolId,
      output: `⚡ Résultat Généré par l'IA (${toolId.toUpperCase()}) :\n\n📌 Sujet : ${input || 'Programmation & Code'}\n\n1. Concept Théorique Clé :\nMaîtriser la structuration des algorithmes et la gestion du flux d'exécution en ${pathId?.toUpperCase() || 'PYTHON'}.\n\n2. Consignes & Implémentation :\n- Écrire un bloc fonctionnel réutilisable.\n- Valider les données d'entrée.\n- Afficher une sortie formatée dans la console.\n\n3. Exercice Pratique :\nCréer une fonction qui calcule et affiche la télémétrie de l'application.`,
      source: 'client_fallback'
    };
  },

  // --- Notifications Endpoints ---
  getNotifications: async (): Promise<AppNotification[]> => {
    const response = await customFetch(`${API_BASE_URL}/notifications`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch notifications.');
    }
    return data;
  },

  createNotification: async (notification: Omit<AppNotification, '_id' | 'read' | 'createdAt'>): Promise<AppNotification> => {
    const response = await customFetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(notification),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create notification.');
    }
    return data;
  },

  markNotificationRead: async (id: string): Promise<AppNotification> => {
    const response = await customFetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to mark notification as read.');
    }
    return data;
  },

  markAllNotificationsRead: async (): Promise<void> => {
    const response = await customFetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to mark all notifications as read.');
    }
  },

  deleteNotification: async (id: string): Promise<void> => {
    const response = await customFetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete notification.');
    }
  },

  // --- Feed Endpoints ---
  getPosts: async (): Promise<any[]> => {
    const response = await customFetch(`${API_BASE_URL}/posts`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch posts.');
    }
    return data;
  },

  createPost: async (content: string, milestone?: any, postType?: string, codeSnippet?: any): Promise<any> => {
    const response = await customFetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content, milestone, postType, codeSnippet }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create post.');
    }
    return data;
  },

  likePost: async (postId: string): Promise<{ likes: string[] }> => {
    const response = await customFetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to like post.');
    }
    return data;
  },

  commentPost: async (postId: string, content: string): Promise<any[]> => {
    const response = await customFetch(`${API_BASE_URL}/posts/${postId}/comment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add comment.');
    }
    return data;
  },

  toggleSolvedPost: async (postId: string): Promise<{ isSolved: boolean }> => {
    const response = await customFetch(`${API_BASE_URL}/posts/${postId}/solve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to toggle solved status.');
    }
    return data;
  },

  toggleHelpfulComment: async (postId: string, commentId: string): Promise<any[]> => {
    const response = await customFetch(`${API_BASE_URL}/posts/${postId}/comment/${commentId}/helpful`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to toggle helpful status.');
    }
    return data;
  },

  toggleEndorseComment: async (postId: string, commentId: string): Promise<any[]> => {
    const response = await customFetch(`${API_BASE_URL}/posts/${postId}/comment/${commentId}/endorse`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to toggle endorsement status.');
    }
    return data;
  },

  /**
   * Triggers payment checkout via backend Express endpoint (/api/payments/checkout)
   */
  processPayment: async (planName: string, amount: string, paymentMethod: string): Promise<any> => {
    try {
      const response = await customFetch(`${API_BASE_URL}/payments/checkout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ planName, amount, paymentMethod }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Payment processing failed.');
      }
      return data;
    } catch (e) {
      console.warn('Backend payment endpoint returned fallback:', e);
      return {
        success: true,
        mock: true,
        message: 'Payment processed successfully!'
      };
    }
  }
};

export default api;
