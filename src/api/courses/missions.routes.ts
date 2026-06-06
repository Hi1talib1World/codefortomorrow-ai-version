import express from 'express';
import { getStudentProgress, getSkillStates, getMissions } from '../controllers/missions.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Apply authorization guard middleware
router.use(protect);

router.get('/progress/:userId', getStudentProgress);
router.get('/skills/:userId', getSkillStates);
router.get('/missions/:userId', getMissions);

export default router;
