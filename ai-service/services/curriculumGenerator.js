import mongoose from 'mongoose';
import { EventEmitter } from 'events';
import './analyticsEngine.js';

const CurriculumPatchSchema = new mongoose.Schema(
  {
    patch_id: { type: String, required: true, unique: true, index: true },
    region: { type: String, required: true, index: true },
    school_id: { type: String, default: null, index: true },
    target_skill: { type: String, required: true, index: true },
    patch_type: {
      type: String,
      required: true,
      enum: ['remediation', 'reinforcement', 'enrichment'],
    },
    content_markdown: { type: String, required: true },
    difficulty_level: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard'],
    },
    trigger_reason: { type: String, required: true },
    expected_learning_outcome: { type: String, required: true },
    source_signal: { type: String, required: true },
    related_cluster_id: { type: String, default: null },
    signal_count: { type: Number, required: true, default: 0 },
    created_at: { type: Date, required: true, default: () => new Date() },
    updated_at: { type: Date, required: true, default: () => new Date() },
    history: {
      type: [
        {
          revision_at: Date,
          patch_type: String,
          difficulty_level: String,
          trigger_reason: String,
          expected_learning_outcome: String,
        },
      ],
      default: [],
    },
  },
  { collection: 'curriculum_patches' }
);

CurriculumPatchSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: new Date() });
  next();
});

CurriculumPatchSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

const CurriculumPatch = mongoose.models.CurriculumPatch || mongoose.model('CurriculumPatch', CurriculumPatchSchema);
const curriculumEvents = new EventEmitter();

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function buildPatchId(region, schoolId, skillId, patchType) {
  const normalizedSchool = schoolId ? schoolId : 'region';
  return `${region}:${normalizedSchool}:${skillId}:${patchType}`.replace(/\s+/g, '-').toLowerCase();
}

function buildClusterKey(region, skillId) {
  return `${region}:${skillId}`;
}

function selectPatchType(averageProficiency, clusterGap, signalCount) {
  if (clusterGap >= 0.55 || averageProficiency < 0.4) {
    return 'remediation';
  }
  if (clusterGap >= 0.30 || (averageProficiency < 0.7 && signalCount >= 3)) {
    return 'reinforcement';
  }
  return 'enrichment';
}

function selectDifficulty(patchType, averageProficiency) {
  if (patchType === 'remediation') {
    return 'easy';
  }
  if (patchType === 'reinforcement') {
    return averageProficiency < 0.55 ? 'easy' : 'medium';
  }
  return averageProficiency < 0.75 ? 'medium' : 'hard';
}

function formatOfflineMarkdown({ region, school_id, target_skill, patch_type, difficulty_level, trigger_reason, outcome, contextExamples }) {
  return `# Curriculum Patch: ${target_skill}\n\n` +
    `**Region:** ${region}  \n` +
    `**School:** ${school_id || 'All schools in region'}  \n` +
    `**Patch type:** ${patch_type}  \n` +
    `**Difficulty:** ${difficulty_level}  \n` +
    `**Trigger:** ${trigger_reason}  \n` +
    `**Expected outcome:** ${outcome}  \n\n` +
    `## Goal\n` +
    `Help students strengthen ${target_skill} with examples and exercises that work in low-resource, rural classrooms.\n\n` +
    `## Key idea\n` +
    `${contextExamples.explanation}\n\n` +
    `## Practice steps\n` +
    `1. ${contextExamples.step1}\n` +
    `2. ${contextExamples.step2}\n` +
    `3. ${contextExamples.step3}\n\n` +
    `## Local example\n` +
    `${contextExamples.localExample}\n\n` +
    `## Teacher note\n` +
    `Use everyday materials, keep text short, and repeat the main idea in class discussion. Avoid technology-heavy resources and focus on very clear, concrete tasks.\n`;
}

function buildLocalExample(region, target_skill) {
  const fallback = `A simple example from local daily life to connect the idea to what students already know.`;
  const examples = {
    counting: `Count baskets of fruit or seeds to practice number patterns.`,
    measurement: `Use a water container and stick to compare lengths and volumes.`,
    reading: `Read a short story about a neighborhood market and discuss the meaning of each sentence.`,
    writing: `Write a short note that describes a common village activity in clear sentences.`,
    multiplication: `Use groups of farm tools or seeds to show how repeated addition becomes multiplication.`,
    fractions: `Divide a flatbread or a bundle of sticks into equal parts to show fractions.`,
    geography: `Draw a simple map of the local area and label roads, rivers, and nearby landmarks.`,
  };

  const key = target_skill.toLowerCase();
  return examples[key] || fallback;
}

function buildTriggerReason({ signalCount, clusterGap, recentPatchCount }) {
  if (recentPatchCount >= 2) {
    return 'Persistent weakness persists after prior support.';
  }
  if (clusterGap >= 0.55) {
    return 'Large regional learning gap detected.';
  }
  return 'Weakness signal confirmed by analytics across multiple students.';
}

function computeExpectedOutcome(target_skill, patchType) {
  if (patchType === 'remediation') {
    return `Students will demonstrate basic mastery of ${target_skill} through repeated guided practice.`;
  }
  if (patchType === 'reinforcement') {
    return `Students will strengthen ${target_skill} and build confidence through structured review.`;
  }
  return `Students will explore ${target_skill} with a richer example and practice challenge.`;
}

function groupSignals({ weaknessSignals, skillStates }) {
  const byRegionSchoolSkill = new Map();
  const aggregatedByRegionSkill = new Map();

  weaknessSignals.forEach((signal) => {
    const region = signal.region || 'unknown-region';
    const school = signal.school_id || null;
    const skill = signal.skill_id;
    const key = `${region}||${school || 'all'}||${skill}`;
    const bucket = byRegionSchoolSkill.get(key) || { region, school_id: school, target_skill: skill, signals: [], students: new Set() };
    bucket.signals.push(signal);
    bucket.students.add(signal.student_id);
    byRegionSchoolSkill.set(key, bucket);

    const clusterKey = `${region}||${skill}`;
    const clusterBucket = aggregatedByRegionSkill.get(clusterKey) || { region, target_skill: skill, signals: [], students: new Set() };
    clusterBucket.signals.push(signal);
    clusterBucket.students.add(signal.student_id);
    aggregatedByRegionSkill.set(clusterKey, clusterBucket);
  });

  return {
    byRegionSchoolSkill: Array.from(byRegionSchoolSkill.values()),
    byRegionSkill: Array.from(aggregatedByRegionSkill.values()),
  };
}

function summarizeSkillState(skillStates, region, schoolId, targetSkill) {
  const filtered = skillStates.filter((state) => {
    return state.skill_id === targetSkill && state.region === region && (schoolId ? state.school_id === schoolId : true);
  });

  if (!filtered.length) {
    return { averageProficiency: 0.0, averageConfidence: 0.0, totalStudents: 0 };
  }

  const averageProficiency = filtered.reduce((sum, state) => sum + (state.proficiency || 0), 0) / filtered.length;
  const averageConfidence = filtered.reduce((sum, state) => sum + (state.confidence || 0), 0) / filtered.length;

  return { averageProficiency, averageConfidence, totalStudents: filtered.length };
}

function findCluster(clusters, region, targetSkill) {
  const key = buildClusterKey(region, targetSkill);
  return clusters.find((cluster) => cluster.cluster_id === key || (cluster.region === region && cluster.skill_id === targetSkill));
}

function findRecentPatch(historicalPatches, region, schoolId, skill, patchType) {
  return historicalPatches.find((patch) => {
    const sameSchool = schoolId ? patch.school_id === schoolId : patch.school_id == null;
    return patch.region === region && sameSchool && patch.target_skill === skill && patch.patch_type === patchType;
  });
}

function shouldGeneratePatch({ signalBucket, cluster, summary, recentPatch }) {
  if (signalBucket.signals.length < 3 && summary.totalStudents < 5) {
    return false;
  }

  const clusterGap = cluster?.gap_score ?? 0;
  const requiresPatch = clusterGap >= 0.25 || summary.averageProficiency < 0.65;
  if (!requiresPatch) {
    return false;
  }

  if (recentPatch) {
    const gapStillHigh = clusterGap >= 0.35;
    const proficiencyStillLow = summary.averageProficiency < 0.65;
    return gapStillHigh || proficiencyStillLow;
  }

  return true;
}

export async function createCurriculumPatch({ region, school_id, target_skill, patch_type, difficulty_level, trigger_reason, expected_learning_outcome, source_signal, signal_count, related_cluster_id }) {
  const patch_id = buildPatchId(region, school_id, target_skill, patch_type);
  const content_markdown = formatOfflineMarkdown({
    region,
    school_id,
    target_skill,
    patch_type,
    difficulty_level,
    trigger_reason,
    outcome: expected_learning_outcome,
    contextExamples: {
      explanation: `This patch uses familiar, real-life ideas to make ${target_skill} clear without relying on devices or expensive supplies.`,
      step1: `Introduce ${target_skill} with a simple example from everyday life in the classroom's local context.`,
      step2: `Let students work through a short, guided exercise that uses paper, chalk, or common objects.`,
      step3: `Review together and ask learners to explain the same idea in their own words with a local example.`,
      localExample: buildLocalExample(region, target_skill),
    },
  });

  const existingPatch = await CurriculumPatch.findOne({ patch_id }).lean();
  const patchDocument = {
    patch_id,
    region,
    school_id,
    target_skill,
    patch_type,
    difficulty_level,
    trigger_reason,
    expected_learning_outcome,
    content_markdown,
    source_signal,
    related_cluster_id,
    signal_count,
  };

  const updateDoc = { $set: patchDocument };
  if (existingPatch) {
    updateDoc.$push = {
      history: {
        revision_at: new Date(),
        patch_type,
        difficulty_level,
        trigger_reason,
        expected_learning_outcome,
      },
    };
  }

  const patch = await CurriculumPatch.findOneAndUpdate(
    { patch_id },
    updateDoc,
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  ).lean();

  curriculumEvents.emit('curriculum_patch_created', {
    patch,
    triggerSignal: source_signal,
    signalCount: signal_count,
  });

  return patch;
}

export async function generateCurriculumPatches({ skillStates = [], weaknessSignals = [], clusters = [], historicalPatches = [] }) {
  const patches = [];
  const grouped = groupSignals({ weaknessSignals, skillStates });
  const candidateBuckets = [...grouped.byRegionSchoolSkill, ...grouped.byRegionSkill];
  const seen = new Set();

  for (const bucket of candidateBuckets) {
    const region = bucket.region;
    const school_id = bucket.school_id;
    const target_skill = bucket.target_skill;
    const signalCount = bucket.signals.length;
    const summary = summarizeSkillState(skillStates, region, school_id, target_skill);
    const cluster = findCluster(clusters, region, target_skill);
    const recentPatch = findRecentPatch(historicalPatches, region, school_id, target_skill, selectPatchType(summary.averageProficiency, cluster?.gap_score ?? 0, signalCount));

    const uniqueKey = `${region}||${school_id || 'region'}||${target_skill}`;
    if (seen.has(uniqueKey)) {
      continue;
    }
    seen.add(uniqueKey);

    if (!shouldGeneratePatch({ signalBucket: bucket, cluster, summary, recentPatch })) {
      continue;
    }

    const patch_type = selectPatchType(summary.averageProficiency, cluster?.gap_score ?? 0, signalCount);
    const difficulty_level = selectDifficulty(patch_type, summary.averageProficiency);
    const trigger_reason = buildTriggerReason({ signalCount, clusterGap: cluster?.gap_score ?? 0, recentPatchCount: recentPatch ? 1 : 0 });
    const expected_learning_outcome = computeExpectedOutcome(target_skill, patch_type);
    const related_cluster_id = cluster?.cluster_id || null;
    const patch = await createCurriculumPatch({
      region,
      school_id,
      target_skill,
      patch_type,
      difficulty_level,
      trigger_reason,
      expected_learning_outcome,
      source_signal: bucket.signals[0]?.signal || 'weakness_pattern',
      signal_count: signalCount,
      related_cluster_id,
    });

    patches.push(patch);
  }

  return patches;
}

export async function queryCurriculumPatches(filter = {}) {
  return CurriculumPatch.find(filter).lean();
}

export async function queryPatchHistory({ region, school_id, target_skill }) {
  return CurriculumPatch.find({ region, school_id, target_skill }).sort({ updated_at: -1 }).lean();
}

export { curriculumEvents };
