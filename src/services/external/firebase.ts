import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
  apiKey: getEnv('VITE_FIREBASE_API_KEY') || "AIzaSyBITCGLQUZXAaa3lhCqieUsNaR1fIanBV4",
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN') || "cofoto-13310.firebaseapp.com",
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID') || "cofoto-13310",
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET') || "cofoto-13310.firebasestorage.app",
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || "141729201523",
  appId: getEnv('VITE_FIREBASE_APP_ID') || "1:141729201523:web:cedf520729cb9afb351906",
  measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID') || "G-0B3EPSV742"
};

// Debug: output config (safe for public keys) to verify that env vars are loaded correctly
if (process.env.NODE_ENV !== 'production') {
  console.log('🔥 Firebase config loaded:', firebaseConfig);
}

// Warn if any placeholder values are still in use (helps catch missing env vars)
const placeholderCheck = Object.entries(firebaseConfig).some(([, v]) =>
  typeof v === 'string' && /placeholder|dummy|AIzaSy/.test(v)
);
if (placeholderCheck) {
  console.warn('⚠️ Firebase config contains placeholder values – ensure Netlify env vars are set correctly.');
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (guarded for non-browser environments)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Firebase Auth
export const auth = getAuth(app);

// Validate essential Firebase config keys
const REQUIRED_KEYS = ['apiKey', 'authDomain', 'projectId', 'appId'];
export const isFirebaseConfigured = REQUIRED_KEYS.every((key) => {
  const value = (firebaseConfig as any)[key];
  if (!value) return false;
  const lowered = value.toLowerCase();
  return !(lowered.includes('dummy') || lowered.includes('placeholder'));
});

// Google Auth Provider instance
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
    try {
      const userCredential = await fbSignInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      return idToken;
    } catch (error: any) {
      console.error('Firebase login error:', error?.code);
      console.error('Firebase login message:', error?.message);
      throw error;
    }
  },

  /**
   * Triggers Firebase Google Auth Login popup.
   * Returns the Firebase User ID token.
   */
  loginWithGooglePopup: async (): Promise<string> => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const idToken = await userCredential.user.getIdToken();
    return idToken;
  },
  // New method for redirect flow
  loginWithGoogleRedirect: async (): Promise<void> => {
    await signInWithRedirect(auth, googleProvider);
  },
};

// Helper to handle redirect result; should be called on app load
export const handleGoogleRedirectResult = async (): Promise<string | null> => {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      return await result.user.getIdToken();
    }
  } catch (error) {
    console.error('Google redirect sign-in error:', error);
  }
  return null;
};
