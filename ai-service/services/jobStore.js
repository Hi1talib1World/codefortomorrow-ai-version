const jobStore = new Map();

export function saveJob(job) {
  jobStore.set(job.job_id, { ...job });
}

export function updateJobStatus(jobId, status, result = null, error = null) {
  const job = jobStore.get(jobId);
  if (!job) return null;
  job.status = status;
  if (result !== null) job.result = result;
  if (error !== null) job.error = error;
  job.updated_at = new Date().toISOString();
  jobStore.set(jobId, job);
  return job;
}

export function getJob(jobId) {
  return jobStore.get(jobId);
}

export function getAllJobs() {
  return Array.from(jobStore.values());
}
