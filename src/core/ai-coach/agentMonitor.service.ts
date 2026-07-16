import { Response } from 'express';
import { randomUUID } from 'crypto';
import { AIEngine } from './aiEngine';

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
  isPaused: boolean;
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
    isPaused: false,
  };
}

function broadcastSse(event: SseEventPayload) {
  const payload = JSON.stringify(event);
  for (const client of Array.from(sseClients)) {
    try {
      client.write(`event: agentEvent\n`);
      client.write(`data: ${payload}\n\n`);
      if (typeof (client as any).flush === 'function') {
        (client as any).flush();
      }
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
}

function createSseClient(res: Response) {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-store',
    'X-Accel-Buffering': 'no',
  });
  res.write(': connected\n\n');
  if (typeof (res as any).flush === 'function') {
    (res as any).flush();
  }

  sseClients.add(res);
  res.on('close', () => {
    sseClients.delete(res);
  });

  broadcastSse({ eventType: 'snapshot', state: Array.from(agentStateMap.values()) });
}

// Detailed step-by-step progress simulation for manual commands
function triggerAgentCommand(agentId: string, command: string) {
  const state = agentStateMap.get(agentId);
  if (!state) {
    throw new Error(`Unknown agent ${agentId}`);
  }
  if (state.isPaused) {
    throw new Error(`Agent ${state.name} is paused. Please resume the agent before sending commands.`);
  }

  const activeTaskName = command.length > 30 ? `${command.substring(0, 30)}...` : command;
  updateAgentStatus(agentId, 'Working', activeTaskName);
  appendAgentLog(agentId, `Message received: "${command}". Processing...`, 'info');

  // Trigger the asynchronous Gemini chat call
  (async () => {
    try {
      const result = await AIEngine.chatWithAgent(agentId, command);
      
      // Optimized performance thoughts sequence
      let delay = 200;
      result.thoughts.forEach((thought) => {
        setTimeout(() => {
          const current = agentStateMap.get(agentId);
          if (current && current.status === 'Working' && current.activeTask === activeTaskName) {
            appendAgentLog(agentId, `[Analysis] ${thought}`, 'info');
          }
        }, delay);
        delay += 350;
      });

      // Optimized performance response delivery
      setTimeout(() => {
        const current = agentStateMap.get(agentId);
        if (current && current.status === 'Working' && current.activeTask === activeTaskName) {
          current.processedJobs += 1;
          updateAgentStatus(agentId, 'Idle', null);
          appendAgentLog(agentId, `${result.response}`, 'success');
        }
      }, delay);
      
    } catch (err: any) {
      console.error('Agent chat sequence failed:', err.message);
      updateAgentStatus(agentId, 'Idle', null);
      appendAgentLog(agentId, `Error processing message: ${err.message}`, 'error');
    }
  })();

  return state;
}

function pauseAgent(agentId: string) {
  const state = agentStateMap.get(agentId);
  if (!state) {
    throw new Error(`Unknown agent ${agentId}`);
  }
  state.isPaused = true;
  state.status = 'Idle'; // Force state to Idle to immediately halt active timeout progress logs
  state.activeTask = null; // Clear any active task reference
  state.lastUpdated = new Date().toISOString();
  agentStateMap.set(agentId, state);
  broadcastSse({ eventType: 'status', state: Array.from(agentStateMap.values()) });
  appendAgentLog(agentId, 'Agent execution paused. Background jobs suspended.', 'warning');
  return state;
}

function resumeAgent(agentId: string) {
  const state = agentStateMap.get(agentId);
  if (!state) {
    throw new Error(`Unknown agent ${agentId}`);
  }
  state.isPaused = false;
  state.lastUpdated = new Date().toISOString();
  agentStateMap.set(agentId, state);
  broadcastSse({ eventType: 'status', state: Array.from(agentStateMap.values()) });
  appendAgentLog(agentId, 'Agent execution resumed. Background jobs active.', 'success');
  return state;
}

initAgentMonitor();

export type { AgentState, AgentLogEntry };
export { getAgentDashboard, createSseClient, triggerAgentCommand, pauseAgent, resumeAgent };
