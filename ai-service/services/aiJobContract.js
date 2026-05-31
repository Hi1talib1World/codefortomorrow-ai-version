import { v4 as uuidv4 } from 'uuid';

export const AIJobType = {
  STUDENT_ANALYSIS: 'student_analysis',
  CURRICULUM_GENERATION: 'curriculum_generation',
  SALES_PROPOSAL: 'sales_proposal',
};

export const AIJobStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  DONE: 'DONE',
  FAILED: 'FAILED',
};

export const AIJobPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export function createAiJob(type, payload, source = 'api', priority = AIJobPriority.MEDIUM) {
  const now = new Date().toISOString();

  return {
    job_id: uuidv4(),
    type,
    status: AIJobStatus.PENDING,
    priority,
    payload,
    created_at: now,
    updated_at: now,
    source,
  };
}

export function normalizePriority(type) {
  switch (type) {
    case AIJobType.SALES_PROPOSAL:
      return AIJobPriority.HIGH;
    case AIJobType.CURRICULUM_GENERATION:
      return AIJobPriority.MEDIUM;
    case AIJobType.STUDENT_ANALYSIS:
    default:
      return AIJobPriority.MEDIUM;
  }
}

export function validateAiJob(job) {
  if (!job || typeof job !== 'object') {
    throw new Error('Invalid AI job payload');
  }

  if (!job.job_id || typeof job.job_id !== 'string') {
    throw new Error('AI job must include a valid job_id');
  }

  if (!Object.values(AIJobType).includes(job.type)) {
    throw new Error(`AI job type must be one of ${Object.values(AIJobType).join(', ')}`);
  }

  if (!job.payload || typeof job.payload !== 'object') {
    throw new Error('AI job payload must be an object');
  }

  if (!Object.values(AIJobStatus).includes(job.status)) {
    throw new Error(`AI job status must be one of ${Object.values(AIJobStatus).join(', ')}`);
  }

  if (!Object.values(AIJobPriority).includes(job.priority)) {
    throw new Error(`AI job priority must be one of ${Object.values(AIJobPriority).join(', ')}`);
  }

  if (!job.source || typeof job.source !== 'string') {
    throw new Error('AI job must include a source');
  }

  return true;
}
