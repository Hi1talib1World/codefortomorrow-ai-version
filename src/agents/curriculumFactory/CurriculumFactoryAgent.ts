import { Job } from 'bullmq';
import { getAggregatedSkillGaps, saveCurriculumPatch } from '../models/curriculumModels';
import { invokeGemini } from '../services/geminiService';
import { publishEvent } from '../services/eventBus';

/**
 * Curriculum Factory Agent
 * Handles triggers: skill_gap_detected, curriculum_review_requested, regional_learning_gap_detected
 */
export async function processCurriculumGeneration(job: Job) {
  const { trigger, data } = job.data; // data contains aggregated analytics

  // 1. Retrieve aggregated skill gaps (could be provided as data)
  const gaps = data?.skillGaps || (await getAggregatedSkillGaps());

  // 2. Build Gemini prompt to generate curriculum patches
  const prompt = `Based on the following skill gaps, produce a curriculum patch for each target skill.
Skill Gaps: ${JSON.stringify(gaps)}
Create JSON objects with fields: patch_id, target_skill, patch_type, content_markdown, difficulty, expected_outcome.
Return an array of such objects.`;

  const response = await invokeGemini(prompt);
  const patches = JSON.parse(response);

  // 3. Persist patches
  for (const patch of patches) {
    await saveCurriculumPatch(patch);
    await publishEvent('curriculum_patch_created', patch);
    await publishEvent('new_mission_available', { missionId: patch.patch_id, skill: patch.target_skill });
  }

  return { events: ['curriculum_patch_created', 'new_mission_available'] };
}
