import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Add other SDK imports as needed, e.g. auth, firestore, storage
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBITCGLQUZXAaa3lhCqieUsNaR1fIanBV4",
  authDomain: "cofoto-13310.firebaseapp.com",
  projectId: "cofoto-13310",
  storageBucket: "cofoto-13310.firebasestorage.app",
  messagingSenderId: "141729201523",
  appId: "1:141729201523:web:cedf520729cb9afb351906",
  measurementId: "G-0B3EPSV742",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);
// Export other services if you import them
// export const auth = getAuth(firebaseApp);
// export const db = getFirestore(firebaseApp);
