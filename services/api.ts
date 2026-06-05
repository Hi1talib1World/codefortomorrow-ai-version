
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

  chatWithAssistant: async (message: string, history: any[]): Promise<{ text: string }> => {
    const response = await customFetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, history }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to chat with AI assistant.');
    }
    return data;
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
  }
};

export default api;
