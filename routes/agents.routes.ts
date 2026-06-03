import express from 'express';
import { getActiveAgents, sendMessageToAgent } from '../controllers/agents.controller';

const router = express.Router();

// Get list of active subagents
router.get('/', getActiveAgents);

// Send a message to a subagent
router.post('/:id/message', sendMessageToAgent);

export default router;
