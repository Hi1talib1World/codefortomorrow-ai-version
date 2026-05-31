import mongoose from 'mongoose';

const AIJobSchema = new mongoose.Schema(
  {
    job_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['student_analysis', 'curriculum_generation', 'sales_proposal'],
    },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'PROCESSING', 'DONE', 'FAILED'],
      default: 'PENDING',
    },
    priority: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: ['api', 'pubsub', 'cron'],
      default: 'api',
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    created_at: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    updated_at: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    collection: 'ai_jobs',
  }
);

AIJobSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: new Date() });
  next();
});

AIJobSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const AIJob = mongoose.models.AIJob || mongoose.model('AIJob', AIJobSchema);

export async function createJob(jobData) {
  const job = await AIJob.findOneAndUpdate(
    { job_id: jobData.job_id },
    {
      $setOnInsert: jobData,
      $set: { updated_at: new Date() },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  ).lean();

  return job;
}

export async function updateJob(jobId, updates) {
  const safeUpdates = { ...updates, updated_at: new Date() };
  const job = await AIJob.findOneAndUpdate(
    { job_id: jobId },
    { $set: safeUpdates },
    { new: true }
  ).lean();

  return job;
}

export async function getJobById(jobId) {
  return AIJob.findOne({ job_id: jobId }).lean();
}

export async function saveJob(jobData) {
  return createJob(jobData);
}
