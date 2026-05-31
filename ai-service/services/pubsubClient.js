import { PubSub } from '@google-cloud/pubsub';
import { enqueueAiJob } from './taskQueue.js';
import { AIJobStatus } from './aiJobContract.js';
import { saveJob, updateJobStatus, getJob } from './jobStore.js';

const projectId = process.env.GCP_PROJECT_ID;
const pubsub = new PubSub({ projectId });

export async function publishAiJob(topicName, job) {
  const topic = pubsub.topic(topicName);
  const dataBuffer = Buffer.from(JSON.stringify(job));
  await topic.publishMessage({ data: dataBuffer });
  saveJob(job);
  console.log(`Published AI job ${job.job_id} to ${topicName}`);
}

export async function startAiJobSubscriber() {
  const subscriptionName = process.env.PUBSUB_AI_JOB_SUBSCRIPTION;
  if (!subscriptionName) {
    console.warn('PUBSUB_AI_JOB_SUBSCRIPTION is not configured. AI job subscriber is disabled.');
    return;
  }

  const subscription = pubsub.subscription(subscriptionName);

  subscription.on('message', async (message) => {
    try {
      const job = JSON.parse(message.data.toString('utf8'));
      console.log(`Received AI job ${job.job_id} from Pub/Sub`);
      updateJobStatus(job.job_id, AIJobStatus.PENDING);
      await enqueueAiJob({ ...job, source: 'pubsub' });
      message.ack();
    } catch (error) {
      console.error('AI job subscriber error:', error);
      message.nack();
    }
  });

  subscription.on('error', (error) => {
    console.error('Pub/Sub subscription error:', error);
  });
}

export function getJobStatus(jobId) {
  return getJob(jobId);
}
