
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Use a safer fallback for the client ID to avoid typescript errors with import.meta
// Make sure to add VITE_GOOGLE_CLIENT_ID or GEMINI_API_KEY to your .env file
const clientId = (typeof process !== 'undefined' && process.env.VITE_GOOGLE_CLIENT_ID) ||
  (typeof process !== 'undefined' && process.env.GEMINI_API_KEY) ||
  'YOUR_GOOGLE_CLIENT_ID';

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <LanguageProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LanguageProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
