import mongoose from 'mongoose';
import './jobStore.js';

const SkillStateSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, index: true },
    school_id: { type: String, required: true, index: true },
    region: { type: String, required: true, index: true },
    skill_id: { type: String, required: true, index: true },
    proficiency: { type: Number, required: true, min: 0, max: 1, default: 0 },
    trend: {
      type: String,
      required: true,
      enum: ['improving', 'stable', 'declining'],
      default: 'stable',
    },
    confidence: { type: Number, required: true, min: 0, max: 1, default: 0 },
    attempts: { type: Number, required: true, default: 0 },
    successes: { type: Number, required: true, default: 0 },
    failures: { type: Number, required: true, default: 0 },
    last_attempt_at: { type: Date, default: null },
    error_patterns: { type: [String], default: [] },
    weakness_signals: {
      type: [
        {
          pattern: String,
          count: Number,
          reason: String,
          detected_at: Date,
        },
      ],
      default: [],
    },
    history: {
      type: [
        {
          recorded_at: Date,
          proficiency: Number,
          trend: String,
          confidence: Number,
        },
      ],
      default: [],
    },
    updated_at: { type: Date, required: true, default: () => new Date() },
  },
  { collection: 'skill_states' }
);

const LearningEventSchema = new mongoose.Schema(
  {
    event_id: { type: String, required: true, unique: true, index: true },
    student_id: { type: String, required: true, index: true },
    school_id: { type: String, required: true, index: true },
    region: { type: String, required: true, index: true },
    skill_id: { type: String, required: true, index: true },
    event_type: {
      type: String,
      required: true,
      enum: ['submission', 'quiz', 'assessment', 'feedback'],
    },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    raw_score: { type: Number, default: null },
    error_codes: { type: [String], default: [] },
    received_at: { type: Date, required: true, default: () => new Date() },
    processed_at: { type: Date, default: null },
    outcome: { type: String, enum: ['success', 'failure', 'partial'], required: true },
  },
  { collection: 'learning_events' }
);

const AnalyticsClusterSchema = new mongoose.Schema(
  {
    cluster_id: { type: String, required: true, unique: true, index: true },
    school_id: { type: String, index: true },
    region: { type: String, required: true, index: true },
    skill_id: { type: String, required: true, index: true },
    average_proficiency: { type: Number, required: true, min: 0, max: 1 },
    gap_score: { type: Number, required: true, min: 0, max: 1 },
    affected_students: { type: Number, required: true },
    common_weaknesses: { type: [String], default: [] },
    trigger_signals: { type: [String], default: [] },
    created_at: { type: Date, required: true, default: () => new Date() },
    updated_at: { type: Date, required: true, default: () => new Date() },
  },
  { collection: 'analytics_clusters' }
);

const SkillState = mongoose.models.SkillState || mongoose.model('SkillState', SkillStateSchema);
const LearningEvent = mongoose.models.LearningEvent || mongoose.model('LearningEvent', LearningEventSchema);
const AnalyticsCluster = mongoose.models.AnalyticsCluster || mongoose.model('AnalyticsCluster', AnalyticsClusterSchema);
const AIJob = mongoose.models.AIJob;

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function deterministicAverage(arr) {
  if (!arr.length) return 0;
  return arr.reduce((sum, value) => sum + value, 0) / arr.length;
}

function computeProficiency(metrics) {
  const successRate = metrics.successRate;
  const timeScore = metrics.avgTime !== null ? clamp(1 - metrics.avgTime / (metrics.timeThreshold || 60), 0, 1) : 0.5;
  const errorPenalty = clamp(metrics.uniqueErrors / 10, 0, 0.3);

  return clamp(0.15 + successRate * 0.6 + timeScore * 0.2 - errorPenalty);
}

function computeTrend(previousProficiency, currentProficiency) {
  const delta = currentProficiency - previousProficiency;
  if (delta >= 0.08) return 'improving';
  if (delta <= -0.08) return 'declining';
  return 'stable';
}

function computeConfidence(metrics) {
  const attemptScore = clamp(Math.min(metrics.attempts, 12) / 12, 0, 1);
  const successScore = metrics.successRate;
  const errorScore = clamp(1 - metrics.uniqueErrors / 5, 0, 1);
  return clamp(0.25 + attemptScore * 0.4 + successScore * 0.25 + errorScore * 0.1);
}

function extractEventMetrics(events) {
  const sorted = [...events].sort((a, b) => new Date(a.received_at) - new Date(b.received_at));
  const attempts = sorted.length;
  const successes = sorted.filter((event) => event.outcome === 'success').length;
  const failures = sorted.filter((event) => event.outcome === 'failure').length;
  const successRate = attempts === 0 ? 0 : successes / attempts;
  const times = sorted
    .map((event) => {
      const t =
        event.payload?.time_to_solve ??
        event.payload?.duration_seconds ??
        (event.payload?.duration ?? 0);
      return typeof t === 'number' ? t : Number(t) || 0;
    })
    .filter((value) => value > 0);
  const avgTime = times.length ? deterministicAverage(times) : null;
  const errorCounts = sorted.reduce((acc, event) => {
    const codes = Array.isArray(event.error_codes) ? event.error_codes : [];
    codes.forEach((code) => {
      acc[code] = (acc[code] || 0) + 1;
    });
    return acc;
  }, {});
  const uniqueErrors = Object.keys(errorCounts).length;
  const commonErrors = Object.entries(errorCounts)
    .sort(([aKey, aCount], [bKey, bCount]) => bCount - aCount || aKey.localeCompare(bKey))
    .slice(0, 3)
    .map(([code]) => code);

  return {
    attempts,
    successes,
    failures,
    successRate,
    avgTime,
    uniqueErrors,
    commonErrors,
    errorCounts,
    lastAttemptAt: sorted.length ? new Date(sorted[sorted.length - 1].received_at) : null,
  };
}

function generateWeaknessSignals(metrics) {
  const signals = [];
  Object.entries(metrics.errorCounts).forEach(([pattern, count]) => {
    if (count >= 3) {
      signals.push({
        pattern,
        count,
        reason: 'Repeated error pattern detected',
        detected_at: new Date(),
      });
    }
  });

  if (metrics.successRate < 0.45 && metrics.attempts >= 3) {
    signals.push({
      pattern: 'low-success-rate',
      count: metrics.attempts,
      reason: 'Low success rate across attempts',
      detected_at: new Date(),
    });
  }

  return signals;
}

function computeClusterScore(skillStates) {
  const proficiencies = skillStates.map((state) => state.proficiency);
  const average = deterministicAverage(proficiencies);
  const gap = clamp(1 - average);
  return gap;
}

function buildClusterKey(region, skillId) {
  return `${region}:${skillId}`;
}

export async function processBatch({ learningEvents, aiJobResults = [] }) {
  if (!Array.isArray(learningEvents) || learningEvents.length === 0) {
    return { updatedSkillStates: [], clusters: [], signals: [] };
  }

  const studentSkillKey = (event) => `${event.student_id}:${event.skill_id}`;
  const eventsBySkill = learningEvents.reduce((group, event) => {
    const key = studentSkillKey(event);
    if (!group[key]) group[key] = [];
    group[key].push(event);
    return group;
  }, {});

  const skillStateKeys = Object.keys(eventsBySkill);
  const skillStateQueries = skillStateKeys.map((key) => {
    const [student_id, skill_id] = key.split(':');
    return { student_id, skill_id };
  });

  const existingStates = await SkillState.find({
    $or: skillStateQueries,
  }).lean();

  const stateMap = existingStates.reduce((map, state) => {
    map[`${state.student_id}:${state.skill_id}`] = state;
    return map;
  }, {});

  const updatedSkillStates = [];
  const signals = [];

  for (const [key, events] of Object.entries(eventsBySkill)) {
    const [student_id, skill_id] = key.split(':');
    const firstEvent = events[0];
    const baseState = stateMap[key] || {
      student_id,
      school_id: firstEvent.school_id,
      region: firstEvent.region,
      skill_id,
      proficiency: 0,
      trend: 'stable',
      confidence: 0,
      attempts: 0,
      successes: 0,
      failures: 0,
      last_attempt_at: null,
      error_patterns: [],
      weakness_signals: [],
      history: [],
    };

    const metrics = extractEventMetrics(events);
    const previousProficiency = baseState.proficiency;
    const proficiency = computeProficiency(metrics);
    const trend = computeTrend(previousProficiency, proficiency);
    const confidence = computeConfidence(metrics);
    const weaknessSignals = generateWeaknessSignals(metrics);

    const newSkillState = {
      ...baseState,
      school_id: firstEvent.school_id,
      region: firstEvent.region,
      proficiency,
      trend,
      confidence,
      attempts: baseState.attempts + metrics.attempts,
      successes: baseState.successes + metrics.successes,
      failures: baseState.failures + metrics.failures,
      last_attempt_at: metrics.lastAttemptAt || baseState.last_attempt_at,
      error_patterns: Array.from(new Set([...baseState.error_patterns, ...metrics.commonErrors])),
      weakness_signals: [...baseState.weakness_signals, ...weaknessSignals],
      history: [
        ...baseState.history.slice(-9),
        {
          recorded_at: new Date(),
          proficiency,
          trend,
          confidence,
        },
      ],
      updated_at: new Date(),
    };

    updatedSkillStates.push(newSkillState);

    if (weaknessSignals.length > 0) {
      signals.push(...weaknessSignals.map((signal) => ({
        type: 'skill_gap_detected',
        student_id,
        school_id: firstEvent.school_id,
        region: firstEvent.region,
        skill_id,
        signal,
      })));
    }
  }

  const savePromises = updatedSkillStates.map((state) =>
    SkillState.findOneAndUpdate(
      { student_id: state.student_id, skill_id: state.skill_id },
      { $set: state },
      { upsert: true, new: true }
    )
  );

  const savedStates = await Promise.all(savePromises);

  const clusters = await aggregateRegionalClusters(savedStates);

  return { updatedSkillStates: savedStates, clusters, signals };
}

export async function aggregateRegionalClusters(skillStates) {
  const grouped = skillStates.reduce((group, state) => {
    const clusterKey = buildClusterKey(state.region, state.skill_id);
    if (!group[clusterKey]) group[clusterKey] = [];
    group[clusterKey].push(state);
    return group;
  }, {});

  const clusters = [];
  const savedClusters = [];

  for (const [clusterKey, states] of Object.entries(grouped)) {
    const [region, skill_id] = clusterKey.split(':');
    const schoolIds = Array.from(new Set(states.map((state) => state.school_id))).sort();
    const gapScore = computeClusterScore(states);
    const affectedStudents = states.length;
    const commonWeaknesses = Array.from(
      states.reduce((acc, state) => {
        state.weakness_signals.forEach((signal) => acc.add(signal.pattern));
        return acc;
      }, new Set())
    ).sort();

    const trigger_signals = [];
    if (gapScore >= 0.4 && affectedStudents >= 3) {
      trigger_signals.push('curriculum_update_required');
    }

    const cluster = {
      cluster_id: clusterKey,
      school_id: schoolIds.length === 1 ? schoolIds[0] : null,
      region,
      skill_id,
      average_proficiency: clamp(deterministicAverage(states.map((state) => state.proficiency))),
      gap_score: gapScore,
      affected_students: affectedStudents,
      common_weaknesses: commonWeaknesses,
      trigger_signals,
      created_at: new Date(),
      updated_at: new Date(),
    };

    clusters.push(cluster);
    savedClusters.push(
      AnalyticsCluster.findOneAndUpdate(
        { cluster_id: cluster.cluster_id },
        { $set: cluster },
        { upsert: true, new: true }
      )
    );
  }

  return Promise.all(savedClusters);
}

export async function queryLearningEvents(filter = {}) {
  return LearningEvent.find(filter).lean();
}

export async function querySkillStates(filter = {}) {
  return SkillState.find(filter).lean();
}

export async function queryAiJobResults(filter = {}) {
  if (!AIJob) {
    throw new Error('AIJob model is not registered. Ensure jobStore is initialized earlier.');
  }
  return AIJob.find(filter).lean();
}

export async function generateSignals({ skillStates }) {
  return skillStates
    .flatMap((state) =>
      state.weakness_signals.map((signal) => ({
        type: 'skill_gap_detected',
        student_id: state.student_id,
        school_id: state.school_id,
        region: state.region,
        skill_id: state.skill_id,
        signal,
      }))
    )
    .filter(Boolean);
}
