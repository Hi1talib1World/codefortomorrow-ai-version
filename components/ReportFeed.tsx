import React from 'react';
import { AgentLogEntry } from './AgentPanel';

export interface GlobalAgentLogEntry extends AgentLogEntry {
  agentId?: string;
  agentName?: string;
}

interface ReportFeedProps {
  logs: GlobalAgentLogEntry[];
  isGlobal?: boolean;
}

const severityStyles: Record<AgentLogEntry['severity'], string> = {
  info: 'text-slate-500',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  error: 'text-rose-600',
};

const agentBadgeStyles: Record<string, string> = {
  'student-analytics': 'bg-blue-100 text-blue-800 border-blue-200',
  'curriculum-factory': 'bg-amber-100 text-amber-800 border-amber-200',
  'b2b-sales': 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const ReportFeed: React.FC<ReportFeedProps> = ({ logs, isGlobal = false }) => {
  return (
    <div className={`rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-100 backdrop-blur ${isGlobal ? 'h-full flex flex-col' : ''}`}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">
          {isGlobal ? 'Live Operations Feed' : 'Live report feed'}
        </p>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          {isGlobal && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
          Live
        </span>
      </div>
      <div className={`space-y-3 overflow-y-auto pr-1 ${isGlobal ? 'flex-1 max-h-[500px] min-h-[300px]' : 'max-h-72'}`}>
        {logs.length === 0 ? (
          <p className="text-sm leading-6 text-slate-500">No reports yet. Trigger a job or wait for live events.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3 shadow-sm shadow-slate-100/30">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {isGlobal && log.agentId && (
                    <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${agentBadgeStyles[log.agentId] || 'bg-slate-100 text-slate-700'}`}>
                      {log.agentName || log.agentId}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono ml-auto">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed font-medium ${severityStyles[log.severity]}`}>
                  {log.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportFeed;
