
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PostHogProvider } from 'posthog-js/react';
import { LanguageProvider } from './contexts/LanguageContext';
import { SyncProvider } from './contexts/SyncContext';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

const AppContent = () => (
  <LanguageProvider>
    <SyncProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SyncProvider>
  </LanguageProvider>
);

root.render(
  <React.StrictMode>
    {posthogKey ? (
      <PostHogProvider
        apiKey={posthogKey}
        options={{
          api_host: posthogHost,
          person_profiles: 'identified_only',
        }}
      >
        <AppContent />
      </PostHogProvider>
    ) : (
      <AppContent />
    )}
  </React.StrictMode>
);
