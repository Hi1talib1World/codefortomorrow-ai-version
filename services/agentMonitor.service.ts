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

// Simulation structures
interface JobStep {
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  delayMs: number;
}

interface JobTemplate {
  taskName: string;
  steps: JobStep[];
}

const studentAnalyticsJobs: JobTemplate[] = [
  {
    taskName: 'Analyzing learning bottleneck',
    steps: [
      { message: 'Querying user progress database for daily learning metrics...', severity: 'info', delayMs: 1500 },
      { message: 'Aggregating session duration and completion rates for 42 active students.', severity: 'info', delayMs: 2000 },
      { message: 'Anomaly detected: 3 users experienced high error rates on "Loops & Iterations".', severity: 'warning', delayMs: 2500 },
      { message: 'Generated student anomaly report #AR-904 and queued for review.', severity: 'success', delayMs: 1500 },
    ],
  },
  {
    taskName: 'Recalculating student mastery profiles',
    steps: [
      { message: 'Ingesting raw interaction events stream from frontend...', severity: 'info', delayMs: 1000 },
      { message: 'Parsing event logs for student ID range [1040-1080].', severity: 'info', delayMs: 1500 },
      { message: 'Updating skill mastery models in student profiles database.', severity: 'info', delayMs: 2000 },
      { message: 'Successfully updated student engagement index (mean increase: +4.2%).', severity: 'success', delayMs: 1000 },
    ],
  },
  {
    taskName: 'Running predictive drop-out model',
    steps: [
      { message: 'Running regression model to predict course drop-out risk...', severity: 'info', delayMs: 2000 },
      { message: 'Failed to retrieve classification weights from cache. Rebuilding model...', severity: 'warning', delayMs: 2000 },
      { message: 'Successfully re-trained predictor model (accuracy: 94.2%).', severity: 'success', delayMs: 1500 },
    ],
  },
];

const curriculumFactoryJobs: JobTemplate[] = [
  {
    taskName: 'Generating Next.js learning module',
    steps: [
      { message: 'Scanning syllabus database for pending curriculum requests...', severity: 'info', delayMs: 1500 },
      { message: 'Synthesizing lesson patch for "Introduction to Next.js routing" (Level: Intermediate).', severity: 'info', delayMs: 2500 },
      { message: 'Generating 5 interactive challenges with associated Jest unit tests.', severity: 'info', delayMs: 2000 },
      { message: 'Successfully compiled and verified JSX code blocks for curriculum patch.', severity: 'success', delayMs: 1500 },
    ],
  },
  {
    taskName: 'Refining database courses using feedback',
    steps: [
      { message: 'Parsing curriculum feedback submitted by active educators...', severity: 'info', delayMs: 1000 },
      { message: 'Refining quiz answers for "Introduction to SQL" to remove ambiguous choices.', severity: 'info', delayMs: 2000 },
      { message: 'Published updated SQL syllabus patch #CF-202 to production.', severity: 'success', delayMs: 1500 },
    ],
  },
  {
    taskName: 'Translating course assets',
    steps: [
      { message: 'Translating "Python Data Types" module into Spanish and French...', severity: 'info', delayMs: 1500 },
      { message: 'Translating course resources... Language API rate limit reached! Retrying in 2s...', severity: 'warning', delayMs: 2000 },
      { message: 'Translation completed successfully. 12 localized files generated.', severity: 'success', delayMs: 1500 },
    ],
  },
];

const b2bSalesJobs: JobTemplate[] = [
  {
    taskName: 'Analyzing inbound pipelines',
    steps: [
      { message: 'Fetching new leads from HubSpot/Salesforce integration pipeline...', severity: 'info', delayMs: 1500 },
      { message: 'Scoring 18 inbound organization leads using value prediction model.', severity: 'info', delayMs: 2000 },
      { message: 'Identified high-value opportunity: "Global Tech Academy" (est. contract: $45k/yr).', severity: 'success', delayMs: 1500 },
    ],
  },
  {
    taskName: 'Generating enterprise proposals',
    steps: [
      { message: 'Drafting automated follow-up proposal for "Boston School District"...', severity: 'info', delayMs: 1500 },
      { message: 'Customizing platform white-label pricing sheet for 500+ licenses.', severity: 'info', delayMs: 2000 },
      { message: 'Proposal generated and emailed to lead contact (j.smith@boston.edu).', severity: 'success', delayMs: 1500 },
    ],
  },
  {
    taskName: 'Compiling competitive market analysis',
    steps: [
      { message: 'Analyzing competitive intelligence feeds for K-12 coding curriculum.', severity: 'info', delayMs: 2000 },
      { message: 'Unable to retrieve price points for competitor "LearnCode". Utilizing historical estimation.', severity: 'warning', delayMs: 2000 },
      { message: 'Completed market report. Updated sales pitch decks in shared repository.', severity: 'success', delayMs: 1500 },
    ],
  },
];

const agentJobTemplates: Record<string, JobTemplate[]> = {
  'student-analytics': studentAnalyticsJobs,
  'curriculum-factory': curriculumFactoryJobs,
  'b2b-sales': b2bSalesJobs,
};

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

// Simulated job runner
function runSimulatedJob(agentId: string, template: JobTemplate) {
  const state = agentStateMap.get(agentId);
  if (!state || state.status === 'Working') return;

  updateAgentStatus(agentId, 'Working', template.taskName);
  appendAgentLog(agentId, `Initializing: ${template.taskName}...`, 'info');

  let currentDelay = 1000;

  template.steps.forEach((step) => {
    setTimeout(() => {
      const current = agentStateMap.get(agentId);
      if (current && current.status === 'Working' && current.activeTask === template.taskName) {
        appendAgentLog(agentId, step.message, step.severity);
      }
    }, currentDelay);
    currentDelay += step.delayMs;
  });

  setTimeout(() => {
    const current = agentStateMap.get(agentId);
    if (current && current.status === 'Working' && current.activeTask === template.taskName) {
      current.processedJobs += 1;
      updateAgentStatus(agentId, 'Idle', null);
      appendAgentLog(agentId, `Task completed successfully: ${template.taskName}.`, 'success');
    }
  }, currentDelay);
}

// Seed previous logs for nicer visual presentation on load
function preSeedLogs() {
  const now = Date.now();
  for (const agentId of agentStateMap.keys()) {
    const state = agentStateMap.get(agentId);
    if (!state) continue;

    const templates = agentJobTemplates[agentId];
    if (templates && templates.length > 0) {
      const template = templates[0];
      const timeOffset = 5 * 60 * 1000; // 5 mins ago
      
      const seedLogs: AgentLogEntry[] = [
        {
          id: randomUUID(),
          timestamp: new Date(now - timeOffset).toISOString(),
          message: `Initializing: ${template.taskName}...`,
          severity: 'info',
        },
        {
          id: randomUUID(),
          timestamp: new Date(now - timeOffset + 2000).toISOString(),
          message: template.steps[0].message,
          severity: template.steps[0].severity,
        },
        {
          id: randomUUID(),
          timestamp: new Date(now - timeOffset + 4000).toISOString(),
          message: `Task completed successfully: ${template.taskName}.`,
          severity: 'success',
        },
      ];

      agentLogs.set(agentId, seedLogs);
      state.processedJobs = 1;
      agentStateMap.set(agentId, state);
    }
  }
}

function initAgentMonitor() {
  for (const def of agentDefinitions) {
    agentStateMap.set(def.id, buildInitialAgentState(def));
    agentLogs.set(def.id, []);
  }

  preSeedLogs();

  // Run the job scheduler loop (check every 8 seconds)
  setInterval(() => {
    const idleAgents = Array.from(agentStateMap.values()).filter(a => a.status === 'Idle' && !a.isPaused);
    if (idleAgents.length > 0) {
      const randomAgent = idleAgents[Math.floor(Math.random() * idleAgents.length)];
      const templates = agentJobTemplates[randomAgent.id];
      if (templates && templates.length > 0) {
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        runSimulatedJob(randomAgent.id, randomTemplate);
      }
    }
  }, 8000);
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

  const activeTaskName = command.length > 30 ? `${command.substring(0, 30)}...` : command;
  updateAgentStatus(agentId, 'Working', activeTaskName);
  appendAgentLog(agentId, `Message received: "${command}". Processing...`, 'info');

  // Trigger the asynchronous Gemini chat call
  (async () => {
    try {
      const result = await AIEngine.chatWithAgent(agentId, command);
      
      // We will print the thoughts/steps sequentially with a 1.2s delay
      let delay = 1000;
      result.thoughts.forEach((thought) => {
        setTimeout(() => {
          const current = agentStateMap.get(agentId);
          if (current && current.status === 'Working' && current.activeTask === activeTaskName) {
            appendAgentLog(agentId, `[Analysis] ${thought}`, 'info');
          }
        }, delay);
        delay += 1200;
      });

      // Finally print the agent's reply
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
