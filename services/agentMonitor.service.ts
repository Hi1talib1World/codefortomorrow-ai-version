import { Response } from 'express';
import { randomUUID } from 'crypto';

export type AgentStatus = 'Idle' | 'Working' | 'Offline';

type AgentDefinition = {
  id: string;
  name: string;
  description: string;
};

type AgentState = {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  activeTask: string | null;
  lastUpdated: string;
  processedJobs: number;
};

type AgentLogEntry = {
  id: string;
  timestamp: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
};

type SseEventPayload = {
  eventType: 'snapshot' | 'status' | 'log';
  agentId?: string;
  state?: AgentState[];
  log?: AgentLogEntry;
  message?: string;
};

const agentDefinitions: AgentDefinition[] = [
  {
    id: 'student-analytics',
    name: 'Student Analytics',
    description: 'Analyzes learner behavior, skill gaps, and performance signals.',
  },
  {
    id: 'curriculum-factory',
    name: 'Curriculum Factory',
    description: 'Generates personalized curriculum patches and learning missions.',
  },
  {
    id: 'b2b-sales',
    name: 'B2B Sales',
    description: 'Scores leads, generates proposals, and supports deployment planning.',
  },
];

const agentStateMap = new Map<string, AgentState>();
const agentLogs = new Map<string, AgentLogEntry[]>();
const sseClients = new Set<Response>();

function buildInitialAgentState(def: AgentDefinition): AgentState {
  return {
    id: def.id,
    name: def.name,
    description: def.description,
    status: 'Idle',
    activeTask: null,
    lastUpdated: new Date().toISOString(),
    processedJobs: 0,
  };
}

function broadcastSse(event: SseEventPayload) {
  const payload = JSON.stringify(event);
  for (const client of Array.from(sseClients)) {
    try {
      client.write(`event: agentEvent\n`);
      client.write(`data: ${payload}\n\n`);
    } catch (error) {
      sseClients.delete(client);
    }
  }
}

function appendAgentLog(agentId: string, message: string, severity: AgentLogEntry['severity'] = 'info') {
  const log: AgentLogEntry = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    message,
    severity,
  };

  const logs = agentLogs.get(agentId) ?? [];
  const updated = [log, ...logs].slice(0, 50);
  agentLogs.set(agentId, updated);

  broadcastSse({ eventType: 'log', agentId, log });
  return log;
}

function updateAgentStatus(agentId: string, status: AgentStatus, activeTask: string | null = null) {
  const state = agentStateMap.get(agentId);
  if (!state) {
    throw new Error(`Unknown agent ${agentId}`);
  }

  state.status = status;
  state.activeTask = activeTask;
  state.lastUpdated = new Date().toISOString();
  agentStateMap.set(agentId, state);

  broadcastSse({ eventType: 'status', agentId, state: Array.from(agentStateMap.values()) });
  return state;
}

function getAgentDashboard() {
  return {
    agents: Array.from(agentStateMap.values()),
    logs: Object.fromEntries(
      Array.from(agentLogs.entries()).map(([agentId, logEntries]) => [agentId, logEntries])
    ),
  };
}

function initAgentMonitor() {
  for (const def of agentDefinitions) {
    agentStateMap.set(def.id, buildInitialAgentState(def));
    agentLogs.set(def.id, []);
  }

  setInterval(() => {
    for (const agentId of agentStateMap.keys()) {
      const state = agentStateMap.get(agentId);
      if (!state) continue;
      const nextStatus: AgentStatus = state.status === 'Working' ? 'Idle' : Math.random() > 0.25 ? 'Working' : 'Idle';
      updateAgentStatus(agentId, nextStatus, nextStatus === 'Working' ? 'Processing queued tasks' : null);
      appendAgentLog(agentId, `${state.name} transitioned to ${nextStatus}.`, nextStatus === 'Idle' ? 'success' : 'info');
    }
  }, 30000);
}

function createSseClient(res: Response) {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-store',
    'X-Accel-Buffering': 'no',
  });
  res.write(': connected\n\n');

  sseClients.add(res);
  res.on('close', () => {
    sseClients.delete(res);
  });

  broadcastSse({ eventType: 'snapshot', state: Array.from(agentStateMap.values()) });
}

function triggerAgentCommand(agentId: string, command: string) {
  const state = agentStateMap.get(agentId);
  if (!state) {
    throw new Error(`Unknown agent ${agentId}`);
  }

  updateAgentStatus(agentId, 'Working', command);
  appendAgentLog(agentId, `Manual command received: ${command}`, 'info');

  setTimeout(() => {
    const updated = agentStateMap.get(agentId);
    if (!updated) return;
    updated.processedJobs += 1;
    updateAgentStatus(agentId, 'Idle', null);
    appendAgentLog(agentId, `Manual command completed: ${command}`, 'success');
  }, 5000 + Math.floor(Math.random() * 3000));

  return state;
}

initAgentMonitor();

export type { AgentState, AgentLogEntry };
export { getAgentDashboard, createSseClient, triggerAgentCommand };
