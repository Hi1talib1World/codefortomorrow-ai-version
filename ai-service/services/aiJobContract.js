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
