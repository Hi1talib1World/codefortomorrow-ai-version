import { v4 as uuidv4 } from 'uuid';
import { enqueueTask } from '../services/taskQueue.js';
import { publishAnalyticsEvent, publishTokenUsageEvent } from '../services/pubsubClient.js';
import { AIEngine } from '../services/aiEngine.js';

export const handleLearningProfile = async (req, res) => {
  try {
    const { studentId, context } = req.body;

    if (!studentId || !context) {
      return res.status(400).json({ message: 'studentId and context are required.' });
    }

    const profile = await AIEngine.generateLearningProfile(context);

    return res.json({ studentId, profile, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Learning profile error:', error);
    return res.status(500).json({ message: 'Unable to generate learning profile.' });
  }
};

export const handleAnalyticsRequest = async (req, res) => {
  try {
    const requestId = uuidv4();
    const { teacherId, classData, metadata } = req.body;

    if (!teacherId || !Array.isArray(classData)) {
      return res.status(400).json({ message: 'teacherId and classData are required.' });
    }

    const event = {
      requestId,
      teacherId,
      classData,
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
    };

    await publishAnalyticsEvent('ai-analytics-events', event);
    await enqueueTask('analytics-report', event);

    return res.status(202).json({ requestId, status: 'accepted', message: 'Analytics event queued and published.' });
  } catch (error) {
    console.error('Analytics request error:', error);
    return res.status(500).json({ message: 'Failed to enqueue analytics event.' });
  }
};

export const handleGenerateQuiz = async (req, res) => {
  try {
    const requestId = uuidv4();
    const { prompt, fileData } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'prompt is required.' });
    }

    await enqueueTask('generate-quiz', { requestId, prompt, fileData, createdAt: new Date().toISOString() });

    return res.status(202).json({ requestId, status: 'queued', message: 'Quiz generation task has been queued.' });
  } catch (error) {
    console.error('Quiz queue error:', error);
    return res.status(500).json({ message: 'Failed to queue quiz generation.' });
  }
};

export const handleAnalyticsStatus = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { getAnalyticsResult } = await import('../services/pubsubClient.js');

    const result = getAnalyticsResult(requestId);
    if (!result) {
      return res.status(404).json({ message: 'Analytics result not found. Processing may still be underway.' });
    }

    return res.json({ requestId, result });
  } catch (error) {
    console.error('Analytics status error:', error);
    return res.status(500).json({ message: 'Unable to fetch analytics status.' });
  }
};

export const handleLogUsage = async (req, res) => {
  try {
    const { userId, usage } = req.body;

    if (!userId || !usage) {
      return res.status(400).json({ message: 'userId and usage details are required.' });
    }

    const event = {
      userId,
      usage,
      type: 'token-usage',
      recordedAt: new Date().toISOString(),
    };

    await publishTokenUsageEvent('ai-token-usage-events', event);

    return res.json({ status: 'logged' });
  } catch (error) {
    console.error('Token usage error:', error);
    return res.status(500).json({ message: 'Failed to log token usage.' });
  }
};
