
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
root.render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        person_profiles: 'identified_only',
      }}
    >
      <LanguageProvider>
        <SyncProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SyncProvider>
      </LanguageProvider>
    </PostHogProvider>
  </React.StrictMode>
);
