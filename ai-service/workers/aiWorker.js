import { Worker, QueueScheduler } from 'bullmq';
import IORedis from 'ioredis';
import { AIEngine } from '../services/aiEngine.js';
import { AIJobStatus, AIJobType } from '../services/aiJobContract.js';
import { updateJobStatus } from '../services/jobStore.js';

const redisUrl = process.env.REDIS_URL;
const QUEUE_NAME = process.env.BULL_QUEUE_NAME || 'ai-jobs';

export function startAiWorkers() {
  if (!redisUrl) {
    console.warn('REDIS_URL is not set. BullMQ workers will not start.');
    return;
  }

  const connection = new IORedis(redisUrl);
  const scheduler = new QueueScheduler(QUEUE_NAME, { connection });

  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      const aiJob = job.data;
      console.log(`Processing AI job ${aiJob.job_id} type=${aiJob.type}`);
      updateJobStatus(aiJob.job_id, AIJobStatus.PROCESSING);

      try {
        let result;

        switch (aiJob.type) {
          case AIJobType.CURRICULUM_GENERATION:
            result = await AIEngine.generateQuiz(aiJob.payload);
            break;
          case AIJobType.STUDENT_ANALYSIS:
            result = await AIEngine.generateTeacherSummary(aiJob.payload.classData || []);
            break;
          case AIJobType.SALES_PROPOSAL:
            result = await AIEngine.generateSalesProposal(aiJob.payload);
            break;
          default:
            throw new Error(`Unsupported AI job type: ${aiJob.type}`);
        }

        updateJobStatus(aiJob.job_id, AIJobStatus.DONE, result);
        return result;
      } catch (error) {
        updateJobStatus(aiJob.job_id, AIJobStatus.FAILED, null, error.message);
        throw error;
      }
    },
    { connection }
  );

  worker.on('completed', (job) => {
    console.log(`BullMQ AI job completed: ${job.id}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`BullMQ AI job failed: ${job?.id}`, err);
  });

  console.log('AI BullMQ workers started.');
}
