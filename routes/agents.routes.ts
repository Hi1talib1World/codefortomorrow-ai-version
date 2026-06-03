import express from 'express';
import { getActiveAgents, sendMessageToAgent, streamAgentEvents } from '../controllers/agents.controller';
import { protect } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/admin.middleware';

const router = express.Router();

// Apply auth + admin guard to all agents routes
router.use(protect, adminOnly);

// Get list of active subagents status
router.get('/status', getActiveAgents);

// Live stream of agent events using Server-Sent Events (SSE)
router.get('/stream', streamAgentEvents);

// Send a command to a subagent
router.post('/:id/command', sendMessageToAgent);

export default router;
