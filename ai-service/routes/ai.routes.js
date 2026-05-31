import { Router } from 'express';
import {
  handleLearningProfile,
  handleAnalyticsRequest,
  handleGenerateQuiz,
  handleProcessJob,
  handleJobStatus,
  handleLogUsage,
} from '../controllers/ai.controller.js';

const router = Router();

router.post('/profile', handleLearningProfile);
router.post('/analytics', handleAnalyticsRequest);
router.post('/generate-quiz', handleGenerateQuiz);
router.post('/process-job', handleProcessJob);
router.get('/job-status/:jobId', handleJobStatus);
router.post('/log-usage', handleLogUsage);

export default router;
