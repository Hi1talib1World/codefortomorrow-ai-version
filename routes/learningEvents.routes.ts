import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  createLearningEvent,
  getStudentProgress,
  getSkillStates,
} from '../controllers/learningEvent.controller';

const router = Router();

router.use(protect);
router.post('/learning-events', createLearningEvent);
router.get('/student-progress/:id', getStudentProgress);
router.get('/skills/:id', getSkillStates);

export default router;
