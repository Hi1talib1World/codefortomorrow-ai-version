import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validation.middleware.js';
import {
  handleLearningProfile,
  handleAnalyticsRequest,
  handleGenerateQuiz,
  handleProcessJob,
  handleJobStatus,
  handleLogUsage,
} from '../controllers/ai.controller.js';

const router = Router();

// Stricter rate limiter for AI operations
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many AI requests from this IP, please try again after 15 minutes',
      code: 'TOO_MANY_REQUESTS'
    }
  }
});

// Zod schemas
const profileSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  context: z.record(z.any()),
});

const analyticsSchema = z.object({
  teacherId: z.string().min(1, 'teacherId is required'),
  classData: z.array(z.record(z.any())),
  metadata: z.record(z.any()).optional(),
});

const generateQuizSchema = z.object({
  prompt: z.string().min(1, 'prompt is required'),
  fileData: z.object({
    data: z.string().min(1, 'fileData data is required'),
    mimeType: z.string().min(1, 'fileData mimeType is required'),
  }).optional(),
});

const processJobSchema = z.object({
  job_id: z.string().min(1, 'job_id is required'),
  type: z.enum(['student_analysis', 'curriculum_generation', 'sales_proposal']),
  payload: z.record(z.any()),
  source: z.string().min(1, 'source is required'),
  status: z.string().optional(),
  priority: z.string().optional(),
});

const logUsageSchema = z.object({
  tokens: z.number().optional(),
  model: z.string().optional(),
  userId: z.string().optional(),
}).passthrough();

// Apply AI rate limiter globally to all AI endpoints
router.use(aiLimiter);

router.post('/profile', validate(profileSchema), handleLearningProfile);
router.post('/analytics', validate(analyticsSchema), handleAnalyticsRequest);
router.post('/generate-quiz', validate(generateQuizSchema), handleGenerateQuiz);
router.post('/process-job', validate(processJobSchema), handleProcessJob);
router.get('/job-status/:jobId', handleJobStatus);
router.post('/log-usage', validate(logUsageSchema), handleLogUsage);

export default router;
