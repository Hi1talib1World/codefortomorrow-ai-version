
import { Router } from 'express';
import { 
  getLearningProfile, 
  getClassAnalytics, 
  logTokenUsage, 
  generateQuiz,
  chatWithAssistant,
  generateHint,
  getAIStatus,
  generatePersonalizedContent,
  generateToolContent
} from '../ai/ai.controller';
import { protect } from '../../../src/core/permissions/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for AI calls to prevent abuse and manage costs
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per window
  message: 'Too many AI requests from this IP, please try again after 15 minutes'
});

router.use(protect);
router.use(aiLimiter);

router.get('/status', getAIStatus);
router.get('/profile', getLearningProfile);
router.get('/analytics', getClassAnalytics);
router.post('/generate-quiz', generateQuiz);
router.post('/log-usage', logTokenUsage);
router.post('/chat', chatWithAssistant);
router.post('/generate-hint', generateHint);
router.post('/generate-personalized-content', generatePersonalizedContent);
router.post('/generate-tool-content', generateToolContent);

export default router;
