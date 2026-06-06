import express from 'express';
import { getStudentProgress, getSkillStates, getMissions } from './missions.controller';
import { protect } from '../../../src/core/permissions/auth.middleware';

const router = express.Router();

// Apply authorization guard middleware
router.use(protect);

router.get('/progress/:userId', getStudentProgress);
router.get('/skills/:userId', getSkillStates);
router.get('/missions/:userId', getMissions);

export default router;
