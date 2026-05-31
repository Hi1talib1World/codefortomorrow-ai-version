import { AIJobStatus, validateAiJob } from './aiJobContract.js';
import { createJob, getJobById } from './jobStore.js';
import { publishAiJob } from './pubsubClient.js';
import { enqueueAiJob } from './taskQueue.js';

const AI_JOB_TOPIC = process.env.PUBSUB_AI_JOB_TOPIC || 'ai-jobs-topic';

export async function createAIJob(jobData) {
  validateAiJob(jobData);

  const existingJob = await getJobById(jobData.job_id);
  if (existingJob) {
    if ([AIJobStatus.PROCESSING, AIJobStatus.DONE].includes(existingJob.status)) {
      console.info(`Duplicate AI job suppressed: ${jobData.job_id} status=${existingJob.status}`);
      return existingJob;
    }

    console.info(`Existing AI job found: ${jobData.job_id} status=${existingJob.status}`);
    return existingJob;
  }

  const job = await createJob(jobData);
  console.info(`Created AI job ${job.job_id} type=${job.type} status=${job.status}`);

  await publishAiJob(AI_JOB_TOPIC, job);
  console.info(`Published AI job ${job.job_id} to Pub/Sub topic ${AI_JOB_TOPIC}`);

  await enqueueAiJob(job);
  console.info(`Enqueued AI job ${job.job_id} in queue backend`);

  return job;
}
