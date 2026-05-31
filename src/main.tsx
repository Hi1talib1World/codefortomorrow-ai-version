import React from 'react';
import ReactDOM from 'react-dom/client';
import HomeDashboard from './components/HomeDashboard.jsx';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
      <HomeDashboard />
  </React.StrictMode>
);
