import { Router } from 'express';
import {
  handleLearningProfile,
  handleAnalyticsRequest,
  handleAnalyticsStatus,
  handleGenerateQuiz,
  handleLogUsage,
} from '../controllers/ai.controller.js';

const router = Router();

router.get('/profile', handleLearningProfile);
router.post('/analytics', handleAnalyticsRequest);
router.get('/analytics/status/:requestId', handleAnalyticsStatus);
router.post('/generate-quiz', handleGenerateQuiz);
router.post('/log-usage', handleLogUsage);

export default router;
