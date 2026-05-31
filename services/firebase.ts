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

const app = initializeApp({
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
});

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

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
