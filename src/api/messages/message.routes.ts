import express from 'express';
import { sendMessage, getConversation, getConversations } from './message.controller';
import { protect } from '../../../src/core/permissions/auth.middleware';

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/conversation/:userId', getConversation);

export default router;
