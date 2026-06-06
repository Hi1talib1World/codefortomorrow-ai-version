import { Request, Response } from 'express';
import Activity from '../models/Activity';

/**
 * @desc    Create a new classroom activity
 * @route   POST /api/activities
 * @access  Private (Teacher only)
 */
export const createActivity = async (req: Request, res: Response) => {
  try {
    const { title, description, targetGrade, duration, materials, steps, isPublic } = req.body;
    
    if (req.user?.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create activities.' });
    }

    const activity = await Activity.create({
      title,
      description,
      targetGrade,
      duration,
      materials,
      steps,
      isPublic,
      teacher: req.user._id,
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * @desc    Get all activities created by the teacher
 * @route   GET /api/activities/teacher
 * @access  Private (Teacher only)
 */
export const getTeacherActivities = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can access this.' });
    }

    const activities = await Activity.find({ teacher: req.user._id }).sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * @desc    Get a single activity by ID
 * @route   GET /api/activities/:id
 * @access  Private
 */
export const getActivityById = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('teacher', 'name profilePictureUrl');
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * @desc    Delete an activity
 * @route   DELETE /api/activities/:id
 * @access  Private (Teacher only)
 */
export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }

    if (activity.teacher.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this activity.' });
    }

    await activity.deleteOne();
    res.json({ message: 'Activity deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
