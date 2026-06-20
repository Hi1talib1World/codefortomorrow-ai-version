import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../../models/user.model';
import Progress from '../../models/progress.model';
import SkillState from '../../models/skillState.model';
import ApiError from '../../../utils/ApiError';
import { PATHS, LESSONS_BY_PATH } from '../../../constants';

/** Helper to check database connectivity status */
const isDbConnected = () => mongoose.connection.readyState === 1;

/** Get prerequisites for course paths to build roadmap dependencies */
const getPrerequisite = (pathId: string) => {
  if (pathId === 'block_coding' || pathId === 'math') {
    return null;
  }
  if (pathId === 'python' || pathId === 'javascript') {
    return { skill: 'block_coding', minProgress: 30 };
  }
  if (['web_dev', 'typescript', 'lua'].includes(pathId)) {
    return { skill: 'javascript', minProgress: 30 };
  }
  // All other programming paths require python or javascript progress
  return { skill: 'javascript', minProgress: 40 };
};

/** Map path IDs to difficulty labels */
const getDifficulty = (pathId: string) => {
  if (pathId === 'block_coding' || pathId === 'math') return 'easy';
  if (['python', 'javascript', 'web_dev', 'typescript', 'lua', 'sql'].includes(pathId)) return 'medium';
  return 'hard';
};

/**
 * @desc    Get student progress (StudentProgress collection equivalent)
 * @route   GET /api/progress/:userId
 * @access  Private
 */
export const getStudentProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (!isDbConnected()) {
      console.warn("️ MongoDB offline. Returning mock user progress details.");
      return res.json({
        xp: 0,
        streak: 0,
        completedLessons: {},
        scores: {},
        badgesEarned: {},
        lastLessonCompletedDate: null
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
      console.warn("️ MongoDB offline. Returning empty mock skill states.");
      // Return 0 progress mocks for existing courses
      const emptyMockStates = PATHS.map((path) => ({
        skill_id: path.id,
        proficiency: 0.0,
        successes: 0,
        attempts: 0,
        trend: 'stable',
        confidence: 0.0,
        updated_at: new Date()
      }));
      return res.json(emptyMockStates);
    }

    const skillStates = await SkillState.find({ student_id: userId } as any);
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
    let userProgress: any = null;

    if (!isDbConnected()) {
      // Offline/Mock simulation
      skillStatesList = PATHS.map((path) => ({
        skill_id: path.id,
        proficiency: 0.0,
        successes: 0,
        attempts: 0,
        trend: 'stable',
        confidence: 0.0,
        failures: 0
      }));
      aiJobsCount = 0;
    } else {
      // Online DB queries
      const user = await User.findById(userId).populate('progress');
      if (user && user.progress) {
        userProgress = user.progress;
      }

      skillStatesList = await SkillState.find({ student_id: userId } as any).lean();

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

    // Compute progress & details for each course first (without locked overrides to assess dependencies correctly)
    const computedMissionsMap = PATHS.reduce((acc, path) => {
      const state = skillStateMap[path.id] || {
        proficiency: 0.0,
        successes: 0,
        attempts: 0,
        failures: 0,
        trend: 'stable',
        confidence: 0
      };

      // Count lessons inside LESSONS_BY_PATH for this path
      const sections = LESSONS_BY_PATH[path.id] || [];
      let totalLessons = 0;
      sections.forEach((section: any) => {
        totalLessons += section.lessons ? section.lessons.length : 0;
      });

      // Get user's completed lessons count for this path
      let completedCount = 0;
      if (userProgress && userProgress.completedLessons) {
        const completedList = userProgress.completedLessons.get
          ? userProgress.completedLessons.get(path.id)
          : userProgress.completedLessons[path.id];
        completedCount = Array.isArray(completedList) ? completedList.length : 0;
      }

      const successes = state.successes || 0;
      const attempts = state.attempts || 0;
      const failures = state.failures || 0;
      const trend = state.trend || 'stable';
      const confidence = state.confidence || 0;

      const learningEventSuccesses = successEventsCountMap[path.id] || 0;
      const totalSuccesses = Math.max(successes, learningEventSuccesses);

      // completion_ratio incorporates actual completed lessons count
      const completion_ratio = totalLessons > 0 ? (completedCount / totalLessons) : 0.0;

      // proficiency score resolves first from skill states, falling back to local skillMastery map
      let proficiency = state.proficiency || 0.0;
      if (proficiency === 0.0 && userProgress && userProgress.skillMastery) {
        const masteryVal = userProgress.skillMastery.get
          ? userProgress.skillMastery.get(path.id)
          : userProgress.skillMastery[path.id];
        if (masteryVal) {
          proficiency = masteryVal / 100;
        }
      }

      // Formula: progress = (proficiency * 70) + (completion_ratio * 30)
      const calculatedProgress = (proficiency * 70) + (completion_ratio * 30);
      const progress = Math.round(Math.max(0, Math.min(100, calculatedProgress)));

      const prerequisite = getPrerequisite(path.id);

      acc[path.id] = {
        mission_id: path.id,
        title: path.titleKey,
        skill: path.id,
        progress,
        difficulty: getDifficulty(path.id),
        tempStatus: progress >= 90 ? 'completed' : (progress > 0 || attempts > 0 ? 'in-progress' : 'in-progress'),
        attempts,
        successes: totalSuccesses,
        failures,
        trend,
        confidence,
        prerequisite
      };

      return acc;
    }, {} as Record<string, any>);

    // Second pass: Apply locked overrides based on prerequisite progress
    const finalMissionsList = PATHS.map((path) => {
      const mission = computedMissionsMap[path.id];
      let status = mission.tempStatus;

      if (mission.prerequisite) {
        const prereqMission = computedMissionsMap[mission.prerequisite.skill];
        if (!prereqMission || prereqMission.progress < mission.prerequisite.minProgress) {
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
        telemetry: {
          attempts: mission.attempts,
          successes: mission.successes,
          failures: mission.failures,
          trend: mission.trend,
          confidence: Math.round(mission.confidence * 100),
          prerequisiteText: mission.prerequisite 
            ? `Requires ${mission.prerequisite.skill.charAt(0).toUpperCase() + mission.prerequisite.skill.slice(1).replace('_', ' ')} progress >= ${mission.prerequisite.minProgress}%` 
            : null
        }
      };
    });

    res.json(finalMissionsList);
  } catch (error) {
    next(error);
  }
};
