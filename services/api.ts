
import { User, UserProgress } from '../types';

// ========================================================================================
// REAL BACKEND API SERVICE
//
// This file is the bridge between the React frontend and the Express backend.
// Each function makes an HTTP request to the server's API endpoints.
// Authentication is handled via JSON Web Tokens (JWT).
// ========================================================================================

const API_BASE_URL = '/api'; // Using a relative URL for proxying in development

// --- Helper for making authenticated requests ---
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// --- API Endpoints ---
const api = {
  /**
   * Registers a new user by sending their details to the backend.
   */
  register: async (name: string, email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
  loginWithGoogle: (): Promise<User> => {
    // In a real app, this would redirect to '/api/auth/google', which would
    // handle the OAuth flow and eventually redirect back to the frontend with a token.
    console.warn("Google Login is currently mocked. A real implementation requires a full OAuth flow.");
    return new Promise((resolve) => {
        const now = new Date().toISOString();
        const guestUser: User = {
          _id: `guest_${Date.now()}`,
          name: 'Guest (Google)',
          email: `guest_${Date.now()}@code-cubs.com`,
          provider: 'google',
          profilePictureUrl: `https://ui-avatars.com/api/?name=G&background=random&color=fff`,
          progress: { xp: 0, streak: 0, completedLessons: {}, scores: {}, badgesEarned: {}, lastLessonCompletedDate: null },
          currentPath: null,
          role: null,
          createdAt: now,
          lastLogin: now,
        };
        resolve(guestUser);
    });
  },

  /**
   * Logs out the current user by clearing the local token.
   */
  logout: (): Promise<void> => {
    return new Promise(resolve => {
      localStorage.removeItem('authToken');
      resolve();
    });
  },

  /**
   * Gets the currently logged-in user's profile from the backend using the stored token.
   */
  getLoggedInUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      return response.json();
    }
    
    // If the token is invalid or expired, clear it
    if(response.status === 401) {
        localStorage.removeItem('authToken');
    }
    
    return null;
  },

  /**
   * Updates the user's profile information on the backend.
   */
  updateUserProfile: async (updatedData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
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
   * Updates the user's learning progress on the backend.
   */
  updateUserProgress: async (newProgress: UserProgress): Promise<UserProgress> => {
    const response = await fetch(`${API_BASE_URL}/users/progress`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newProgress)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update progress.');
    }
    return data;
  }
};

export default api;
