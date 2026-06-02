import React from 'react';
import { AgentLogEntry } from './AgentPanel';

interface ReportFeedProps {
  logs: AgentLogEntry[];
}

const severityStyles: Record<AgentLogEntry['severity'], string> = {
  info: 'text-slate-500',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  error: 'text-rose-600',
};

const ReportFeed: React.FC<ReportFeedProps> = ({ logs }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Live report feed</p>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Recent</span>
      </div>
      <div className="max-h-72 space-y-3 overflow-y-auto pr-2">
        {logs.length === 0 ? (
          <p className="text-sm leading-6 text-slate-500">No reports yet. Trigger a job or wait for live events.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="rounded-2xl bg-white p-3 shadow-sm shadow-slate-100">
              <div className="flex items-center justify-between gap-3">
                <p className={`text-sm font-medium ${severityStyles[log.severity]}`}>{log.message}</p>
                <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportFeed;
