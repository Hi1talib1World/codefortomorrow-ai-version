
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

// Make sure to add VITE_GOOGLE_CLIENT_ID to your environment variables
const clientId = getEnv('VITE_GOOGLE_CLIENT_ID') || getEnv('GOOGLE_CLIENT_ID') || '';

if (!clientId) {
  console.warn('⚠️ Google Client ID is missing. Google OAuth login will not function. Please configure VITE_GOOGLE_CLIENT_ID or GOOGLE_CLIENT_ID in your environment variables.');
}

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
