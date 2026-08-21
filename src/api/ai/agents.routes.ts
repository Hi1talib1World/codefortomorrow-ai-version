import express from 'express';
import {
  getActiveAgents,
  sendMessageToAgent,
  streamAgentEvents,
  pauseAgent,
  resumeAgent,
  orchestrateTask,
  generateCurriculum,
  analyzeStudent,
  processB2BLead,
  getB2BLeads,
  approveB2BLead,
  getExecutionsHistory
} from './agents.controller';
import { protect } from '../../../src/core/permissions/auth.middleware';
import { adminOnly } from '../../../src/core/permissions/admin.middleware';

const router = express.Router();

// Apply auth + admin guard to all agents routes
router.use(protect, adminOnly);

// Get list of active subagents status & registry info
router.get('/status', getActiveAgents);

// Live stream of agent events using Server-Sent Events (SSE)
router.get('/stream', streamAgentEvents);

// Execution history & cost tracking summary
router.get('/executions', getExecutionsHistory);

// AI Orchestration Endpoint
router.post('/orchestrate', orchestrateTask);

// Agent Specific Endpoints
router.post('/curriculum/generate', generateCurriculum);
router.post('/analytics/analyze', analyzeStudent);

// B2B Sales & Human-in-the-Loop Approval Endpoints
router.get('/b2b/leads', getB2BLeads);
router.post('/b2b/leads', processB2BLead);
router.post('/b2b/leads/:id/approve', approveB2BLead);

// Send a command to a subagent
router.post('/:id/command', sendMessageToAgent);

// Pause / Resume agents
router.post('/:id/pause', pauseAgent);
router.post('/:id/resume', resumeAgent);

export default router;
