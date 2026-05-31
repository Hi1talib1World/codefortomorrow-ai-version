import { CloudTasksClient } from '@google-cloud/tasks';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
const useBull = Boolean(redisUrl);

let queue;

if (useBull) {
  const connection = new IORedis(redisUrl);
  queue = new Queue(process.env.BULL_QUEUE_NAME || 'ai-jobs', { connection });
}

export async function enqueueTask(jobName, payload) {
  if (useBull && queue) {
    const job = await queue.add(jobName, payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
      removeOnComplete: true,
      removeOnFail: false,
    });
    console.log(`Enqueued BullMQ job ${jobName} id=${job.id}`);
    return job.id;
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
      body: Buffer.from(JSON.stringify({ jobName, payload })).toString('base64'),
    },
    scheduleTime: {
      seconds: Date.now() / 1000 + 5,
    },
  };

  const [response] = await tasksClient.createTask({ parent, task });
  console.log(`Created Cloud Task ${response.name}`);
  return response.name;
}
