import { Request, Response } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import User from '../models/user.model';
import Progress from '../models/progress.model';
import SkillState from '../models/skillState.model';
import LearningEvent from '../models/learningEvent.model';

export const createLearningEvent = async (req: Request, res: Response) => {
  try {
    const {
      event_id,
      student_id,
      school_id,
      region,
      skill_id,
      event_type,
      payload,
      raw_score,
      error_codes,
      outcome,
    } = req.body;

    if (!student_id || !school_id || !region || !skill_id || !event_type || !outcome) {
      return res.status(400).json({ message: 'Missing required learning event fields.' });
    }

    if (req.user?.role === 'student' && req.user._id.toString() !== student_id) {
      return res.status(403).json({ message: 'Students may only create events for themselves.' });
    }

    const event = await LearningEvent.create({
      event_id: event_id || crypto.randomUUID(),
      student_id,
      school_id,
      region,
      skill_id,
      event_type,
      payload: payload || {},
      raw_score: typeof raw_score === 'number' ? raw_score : null,
      error_codes: Array.isArray(error_codes) ? error_codes : [],
      outcome,
      received_at: new Date(),
    });

    return res.status(201).json(event);
  } catch (error) {
    console.error('Learning event creation failed:', (error as Error).message);
    return res.status(500).json({ message: 'Unable to create learning event.' });
  }
};

export const getStudentProgress = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const user = await User.findById(studentId).populate('progress');

    if (!user) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    if (!user.progress) {
      return res.status(404).json({ message: 'Student progress not found.' });
    }

    return res.json({ student_id: studentId, progress: user.progress });
  } catch (error) {
    console.error('Get student progress failed:', (error as Error).message);
    return res.status(500).json({ message: 'Unable to fetch student progress.' });
  }
};

export const getSkillStates = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const skillId = req.query.skill_id as string | undefined;

    const filter: mongoose.FilterQuery<any> = { student_id: studentId };
    if (skillId) {
      filter.skill_id = skillId;
    }

    const skillStates = await SkillState.find(filter).lean();

    return res.json({ student_id: studentId, skillStates });
  } catch (error) {
    console.error('Get skill states failed:', (error as Error).message);
    return res.status(500).json({ message: 'Unable to fetch skill states.' });
  }
};
