import { Worker, QueueScheduler } from 'bullmq';
import IORedis from 'ioredis';
import { AIEngine } from '../services/aiEngine.js';

const redisUrl = process.env.REDIS_URL;

export function startAiWorkers() {
  if (!redisUrl) {
    console.warn('REDIS_URL is not set. BullMQ workers will not start.');
    return;
  }

  const connection = new IORedis(redisUrl);
  const queueName = process.env.BULL_QUEUE_NAME || 'ai-jobs';
  const scheduler = new QueueScheduler(queueName, { connection });

  const worker = new Worker(
    queueName,
    async (job) => {
      console.log(`Processing job ${job.id} type=${job.name}`);

      switch (job.name) {
        case 'generate-quiz':
          return AIEngine.generateQuiz(job.data);
        case 'analytics-report':
          return AIEngine.generateTeacherSummary(job.data.classData);
        default:
          throw new Error(`Unsupported job type: ${job.name}`);
      }
    },
    { connection }
  );

  worker.on('completed', (job) => {
    console.log(`BullMQ job completed: ${job.id} (${job.name})`);
  });

  worker.on('failed', (job, err) => {
    console.error(`BullMQ job failed: ${job?.id} (${job?.name})`, err);
  });

  console.log('AI BullMQ workers started.');
}
