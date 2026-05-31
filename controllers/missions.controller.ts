import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import Progress from '../models/progress.model';
import SkillState from '../models/skillState.model';
import ApiError from '../utils/ApiError';

/** Helper to check database connectivity status */
const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc    Get student progress (StudentProgress collection equivalent)
 * @route   GET /api/progress/:userId
 * @access  Private
 */
export const getStudentProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (!isDbConnected()) {
      console.warn("⚠️ MongoDB offline. Returning mock user progress details.");
      return res.json({
        xp: 320,
        streak: 4,
        completedLessons: {
          block_coding: [1, 2],
          python: [1]
        },
        scores: { "1": 95, "2": 85 },
        badgesEarned: { block_coding: ['bc_badge1'] },
        lastLessonCompletedDate: new Date().toISOString()
      });
    }

    const user = await User.findById(userId).populate('progress');
    if (!user) {
      throw new ApiError(404, 'Student not found');
    }

    if (!user.progress) {
      throw new ApiError(404, 'Progress record not found for student');
    }

    res.json(user.progress);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get skill states (SkillState collection)
 * @route   GET /api/skills/:userId
 * @access  Private
 */
export const getSkillStates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (!isDbConnected()) {
      console.warn("⚠️ MongoDB offline. Returning mock skill states.");
      return res.json([
        { skill_id: 'variables', proficiency: 0.85, successes: 8, attempts: 10, trend: 'improving', confidence: 0.9, updated_at: new Date() },
        { skill_id: 'conditionals', proficiency: 0.70, successes: 5, attempts: 8, trend: 'stable', confidence: 0.8, updated_at: new Date() },
        { skill_id: 'loops', proficiency: 0.45, successes: 3, attempts: 7, trend: 'improving', confidence: 0.6, updated_at: new Date() },
        { skill_id: 'arrays', proficiency: 0.15, successes: 1, attempts: 4, trend: 'stable', confidence: 0.4, updated_at: new Date() },
        { skill_id: 'functions', proficiency: 0.0, successes: 0, attempts: 0, trend: 'stable', confidence: 0.0, updated_at: new Date() },
        { skill_id: 'objects', proficiency: 0.0, successes: 0, attempts: 0, trend: 'stable', confidence: 0.0, updated_at: new Date() }
      ]);
    }

    const skillStates = await SkillState.find({ student_id: userId });
    res.json(skillStates);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get missions list with calculated progress
 * @route   GET /api/missions/:userId
 * @access  Private
 */
export const getMissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    let skillStatesList: any[] = [];
    let successEventsCountMap: Record<string, number> = {};
    let aiJobsCount = 0;

    if (!isDbConnected()) {
      // Offline/Mock simulation
      skillStatesList = [
        { skill_id: 'variables', proficiency: 0.85, successes: 8, attempts: 10, trend: 'improving', confidence: 0.9, failures: 2 },
        { skill_id: 'conditionals', proficiency: 0.70, successes: 5, attempts: 8, trend: 'stable', confidence: 0.8, failures: 3 },
        { skill_id: 'loops', proficiency: 0.45, successes: 3, attempts: 7, trend: 'improving', confidence: 0.6, failures: 4 },
        { skill_id: 'arrays', proficiency: 0.15, successes: 1, attempts: 4, trend: 'stable', confidence: 0.4, failures: 3 },
        { skill_id: 'functions', proficiency: 0.0, successes: 0, attempts: 0, trend: 'stable', confidence: 0.0, failures: 0 },
        { skill_id: 'objects', proficiency: 0.0, successes: 0, attempts: 0, trend: 'stable', confidence: 0.0, failures: 0 }
      ];
      successEventsCountMap = {
        variables: 8,
        conditionals: 5,
        loops: 3,
        arrays: 1,
        functions: 0,
        objects: 0
      };
      aiJobsCount = 1;
    } else {
      // Online DB queries
      skillStatesList = await SkillState.find({ student_id: userId }).lean();

      // Count successful LearningEvents for this student
      const learningEvents = await mongoose.connection.db.collection('learning_events').find({
        student_id: userId,
        outcome: 'success'
      }).toArray();

      learningEvents.forEach((event: any) => {
        const skill = event.skill_id;
        successEventsCountMap[skill] = (successEventsCountMap[skill] || 0) + 1;
      });

      // Count completed AI Jobs for this student
      aiJobsCount = await mongoose.connection.db.collection('ai_jobs').countDocuments({
        'payload.student_id': userId,
        status: 'DONE'
      });
    }

    // Convert list to a lookup map
    const skillStateMap = skillStatesList.reduce((acc, state) => {
      acc[state.skill_id] = state;
      return acc;
    }, {} as Record<string, any>);

    // Define core mission items matching skills
    const missionDefinitions = [
      { id: 'variables', title: 'Variables', skill: 'variables', difficulty: 'easy', prerequisite: null },
      { id: 'conditionals', title: 'Conditionals', skill: 'conditionals', difficulty: 'easy', prerequisite: null },
      { id: 'loops', title: 'Loops', skill: 'loops', difficulty: 'medium', prerequisite: { skill: 'variables', minProgress: 40 } },
      { id: 'arrays', title: 'Arrays', skill: 'arrays', difficulty: 'medium', prerequisite: { skill: 'variables', minProgress: 40 } },
      { id: 'functions', title: 'Functions', skill: 'functions', difficulty: 'hard', prerequisite: { skill: 'loops', minProgress: 50 } },
      { id: 'objects', title: 'Objects', skill: 'objects', difficulty: 'hard', prerequisite: { skill: 'loops', minProgress: 50 } },
    ];

    // Compute progress & details for each mission first (without locked overrides to assess dependencies correctly)
    const computedMissionsMap = missionDefinitions.reduce((acc, definition) => {
      const state = skillStateMap[definition.skill] || {
        proficiency: 0.0,
        successes: 0,
        attempts: 0,
        failures: 0,
        trend: 'stable',
        confidence: 0
      };

      const successes = state.successes || 0;
      const attempts = state.attempts || 0;
      const failures = state.failures || 0;
      const trend = state.trend || 'stable';
      const confidence = state.confidence || 0;

      const learningEventSuccesses = successEventsCountMap[definition.skill] || 0;
      const totalSuccesses = Math.max(successes, learningEventSuccesses);

      // completion_ratio incorporates both successful learning events and completed AI evaluation jobs
      const successWeight = totalSuccesses + (aiJobsCount * 0.5);
      const completion_ratio = attempts > 0 ? Math.min(1.0, successWeight / 5) : 0.0;

      // Formula: progress = (proficiency * 70) + (completion_ratio * 30)
      const calculatedProgress = (state.proficiency * 70) + (completion_ratio * 30);
      const progress = Math.round(Math.max(0, Math.min(100, calculatedProgress)));

      acc[definition.id] = {
        mission_id: definition.id,
        title: definition.title,
        skill: definition.skill,
        progress,
        difficulty: definition.difficulty,
        // temporary status to check prerequisites in next pass
        tempStatus: progress >= 90 ? 'completed' : (progress > 0 || attempts > 0 ? 'in-progress' : 'in-progress'),
        attempts,
        successes: totalSuccesses,
        failures,
        trend,
        confidence,
        prerequisite: definition.prerequisite
      };

      return acc;
    }, {} as Record<string, any>);

    // Second pass: Apply locked overrides based on prerequisite progress
    const finalMissionsList = missionDefinitions.map((definition) => {
      const mission = computedMissionsMap[definition.id];
      let status = mission.tempStatus;

      if (definition.prerequisite) {
        const prereqMission = computedMissionsMap[definition.prerequisite.skill];
        if (!prereqMission || prereqMission.progress < definition.prerequisite.minProgress) {
          status = 'locked';
        }
      }

      // Cleanup temporary keys and return clean shape
      return {
        mission_id: mission.mission_id,
        title: mission.title,
        skill: mission.skill,
        progress: status === 'locked' ? 0 : mission.progress,
        status,
        difficulty: mission.difficulty,
        // include sub-stats for detail modal display
        telemetry: {
          attempts: mission.attempts,
          successes: mission.successes,
          failures: mission.failures,
          trend: mission.trend,
          confidence: Math.round(mission.confidence * 100),
          prerequisiteText: definition.prerequisite 
            ? `Requires ${definition.prerequisite.skill.charAt(0).toUpperCase() + definition.prerequisite.skill.slice(1)} progress >= ${definition.prerequisite.minProgress}%` 
            : null
        }
      };
    });

    res.json(finalMissionsList);
  } catch (error) {
    next(error);
  }
};
