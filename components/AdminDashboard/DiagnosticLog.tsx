import React, { useState, useEffect } from 'react';

// Simple placeholder diagnostic log component for Admin Dashboard
const DiagnosticLog: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  // Simulate log generation
  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toISOString();
      setLogs(prev => [...prev, `[$ {timestamp}] System check OK`]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 p-4 bg-black/30 border border-slate-800 rounded-lg overflow-auto max-h-48 text-xs text-[#FBBF24]/80 font-mono">
      {logs.map((log, idx) => (
        <div key={idx}>{log}</div>
      ))}
    </div>
  );
};

export default DiagnosticLog;
