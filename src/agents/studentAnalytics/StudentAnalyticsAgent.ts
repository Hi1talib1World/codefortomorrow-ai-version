import { Job } from 'bullmq';
import { getStudentProgress, getSkillState, updateSkillState, updateStudentProgress, createFeedbackPacket } from '../models/studentModels';
import { invokeGemini } from '../services/geminiService';
import { publishEvent } from '../services/eventBus';

/**
 * Student Analytics & Evaluation Agent
 * Handles events: learning_event_received, code_submission_received, assessment_completed, quiz_completed, sync_batch_processed
 */
export async function processStudentAnalysis(job: Job) {
  const { event_type, student_id, school_id, payload, timestamp } = job.data;
  // 1. Load current progress & skill state
  const progress = await getStudentProgress(student_id);
  const skillState = await getSkillState(student_id);

  // 2. Build prompt for Gemini
  const prompt = `Analyze the following student event and update their skill state.
Event Type: ${event_type}
Payload: ${JSON.stringify(payload)}
Current Skill State: ${JSON.stringify(skillState)}
Current Progress: ${JSON.stringify(progress)}
Return a JSON with fields: weakness, confidence, next_hint, recommended_mission, estimated_difficulty, updatedSkillState, updatedProgress`;

  const analysis = await invokeGemini(prompt);
  const result = JSON.parse(analysis);

  // 3. Persist updates
  await updateSkillState(student_id, result.updatedSkillState);
  await updateStudentProgress(student_id, result.updatedProgress);
  await createFeedbackPacket(student_id, result);

  // 4. Publish events
  await publishEvent('student_analysis_completed', { student_id, result });
  if (result.weakness) {
    await publishEvent('skill_gap_detected', { student_id, weakness: result.weakness });
  }

  return { events: ['student_analysis_completed', result.weakness ? 'skill_gap_detected' : null].filter(Boolean) };
}
