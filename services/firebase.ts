import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';

// Helper to read environment variables safely in both Vite and Node environments without compiler errors.
const getEnv = (name: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name] as string;
  }
  const meta = import.meta as any;
  if (meta && meta.env && meta.env[name]) {
    return meta.env[name] as string;
  }
  return '';
};

// Firebase configuration settings.
// These fall back to safe placeholder values if env variables are not set in .env.
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY') || "dummy-api-key",
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN') || "dummy-project.firebaseapp.com",
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID') || "dummy-project",
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET') || "dummy-project.appspot.com",
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || "123456789",
  appId: getEnv('VITE_FIREBASE_APP_ID') || "1:1234:web:1234"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Google Auth Provider instance
const googleProvider = new GoogleAuthProvider();

export const firebaseService = {
  /**
   * Registers a user via Firebase Email and Password.
   * Returns the Firebase User ID token.
   */
  registerWithEmail: async (email: string, password: string): Promise<string> => {
    const userCredential = await fbCreateUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    return idToken;
  },

  /**
   * Logs in a user via Firebase Email and Password.
   * Returns the Firebase User ID token.
   */
  loginWithEmail: async (email: string, password: string): Promise<string> => {
    const userCredential = await fbSignInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    return idToken;
  },

  /**
   * Triggers Firebase Google Auth Login popup.
   * Returns the Firebase User ID token.
   */
  loginWithGooglePopup: async (): Promise<string> => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const idToken = await userCredential.user.getIdToken();
    return idToken;
  }
};
