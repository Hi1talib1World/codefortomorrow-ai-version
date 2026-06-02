import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/admin.middleware';
import { getAgentsStatus, streamAgentEvents, postAgentCommand } from '../controllers/agents.controller';

const router = Router();

router.use(protect, adminOnly);
router.get('/agents/status', getAgentsStatus);
router.get('/agents/stream', streamAgentEvents);
router.post('/agents/:agentId/command', postAgentCommand);

export default router;
