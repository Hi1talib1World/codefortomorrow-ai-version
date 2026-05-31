import { createAiJob, AIJobType, normalizePriority } from '../services/aiJobContract.js';
import { enqueueAiJob } from '../services/taskQueue.js';
import { publishAiJob, getJobStatus } from '../services/pubsubClient.js';
import { AIEngine } from '../services/aiEngine.js';

export const handleLearningProfile = async (req, res) => {
  try {
    const { studentId, context } = req.body;

    if (!studentId || !context) {
      return res.status(400).json({ message: 'studentId and context are required.' });
    }

    const job = createAiJob(
      AIJobType.STUDENT_ANALYSIS,
      { studentId, context },
      'api',
      normalizePriority(AIJobType.STUDENT_ANALYSIS)
    );

    await publishAiJob(process.env.PUBSUB_AI_JOB_TOPIC || 'ai-jobs-topic', job);
    await enqueueAiJob(job);

    return res.status(202).json({ job_id: job.job_id, status: job.status, message: 'Learning profile job created.' });
  } catch (error) {
    console.error('Learning profile error:', error);
    return res.status(500).json({ message: 'Unable to create learning profile job.' });
  }
};

export const handleAnalyticsRequest = async (req, res) => {
  try {
    const { teacherId, classData, metadata } = req.body;

    if (!teacherId || !Array.isArray(classData)) {
      return res.status(400).json({ message: 'teacherId and classData are required.' });
    }

    const job = createAiJob(
      AIJobType.STUDENT_ANALYSIS,
      { teacherId, classData, metadata: metadata || {} },
      'api',
      normalizePriority(AIJobType.STUDENT_ANALYSIS)
    );

    await publishAiJob(process.env.PUBSUB_AI_JOB_TOPIC || 'ai-jobs-topic', job);
    await enqueueAiJob(job);

    return res.status(202).json({ job_id: job.job_id, status: job.status, message: 'Analytics job created and queued.' });
  } catch (error) {
    console.error('Analytics request error:', error);
    return res.status(500).json({ message: 'Failed to create analytics job.' });
  }
};

export const handleGenerateQuiz = async (req, res) => {
  try {
    const { prompt, fileData } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'prompt is required.' });
    }

    const job = createAiJob(
      AIJobType.CURRICULUM_GENERATION,
      { prompt, fileData },
      'api',
      normalizePriority(AIJobType.CURRICULUM_GENERATION)
    );

    await publishAiJob(process.env.PUBSUB_AI_JOB_TOPIC || 'ai-jobs-topic', job);
    await enqueueAiJob(job);

    return res.status(202).json({ job_id: job.job_id, status: job.status, message: 'Curriculum generation job queued.' });
  } catch (error) {
    console.error('Quiz queue error:', error);
    return res.status(500).json({ message: 'Failed to queue curriculum generation job.' });
  }
};

export const handleProcessJob = async (req, res) => {
  try {
    const job = req.body;
    if (!job || !job.job_id || !job.type || !job.payload) {
      return res.status(400).json({ message: 'Invalid AI job payload.' });
    }

    await enqueueAiJob({ ...job, source: 'cloud-tasks' });
    return res.status(202).json({ job_id: job.job_id, status: 'accepted' });
  } catch (error) {
    console.error('Process job error:', error);
    return res.status(500).json({ message: 'Failed to enqueue AI job from Cloud Tasks.' });
  }
};

export const handleJobStatus = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = getJobStatus(jobId);
    if (!job) {
      return res.status(404).json({ message: 'AI job not found.' });
    }
    return res.json(job);
  } catch (error) {
    console.error('Job status error:', error);
    return res.status(500).json({ message: 'Unable to fetch AI job status.' });
  }
};
