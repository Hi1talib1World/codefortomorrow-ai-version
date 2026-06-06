import { Router } from 'express';
import { protect } from '../../../src/core/permissions/auth.middleware';
import {
  createLearningEvent,
  getStudentProgress,
  getSkillStates,
} from './learningEvent.controller';

const router = Router();

router.use(protect);
router.post('/learning-events', createLearningEvent);
router.get('/student-progress/:id', getStudentProgress);
router.get('/skills/:id', getSkillStates);

export default router;
