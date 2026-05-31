import { CloudTasksClient } from '@google-cloud/tasks';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
const useBull = Boolean(redisUrl);
const QUEUE_NAME = process.env.BULL_QUEUE_NAME || 'ai-jobs';

let queue;

if (useBull) {
  const connection = new IORedis(redisUrl);
  queue = new Queue(QUEUE_NAME, { connection });
}

export async function enqueueAiJob(job) {
  if (useBull && queue) {
    const bullJob = await queue.add(QUEUE_NAME, job, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
      removeOnComplete: true,
      removeOnFail: false,
      priority: job.priority === 'high' ? 1 : job.priority === 'low' ? 10 : 5,
    });
    console.log(`Enqueued BullMQ AI job ${job.job_id} id=${bullJob.id}`);
    return bullJob.id;
  }

  const tasksClient = new CloudTasksClient();
  const queuePath = process.env.CLOUD_TASKS_QUEUE_PATH;
  const location = process.env.CLOUD_TASKS_LOCATION;
  const project = process.env.GCP_PROJECT_ID;
  const url = process.env.CLOUD_TASKS_TARGET_URL;

  if (!queuePath || !location || !project || !url) {
    throw new Error('Cloud Tasks is not configured correctly and Redis is unavailable.');
  }

  const parent = tasksClient.queuePath(project, location, queuePath);
  const task = {
    httpRequest: {
      httpMethod: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      body: Buffer.from(JSON.stringify(job)).toString('base64'),
    },
    scheduleTime: {
      seconds: Math.floor(Date.now() / 1000) + 5,
    },
  };

  const [response] = await tasksClient.createTask({ parent, task });
  console.log(`Created Cloud Task for AI job ${job.job_id}: ${response.name}`);
  return response.name;
}
