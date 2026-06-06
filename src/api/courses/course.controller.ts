import { Request, Response, NextFunction } from 'express';
import Course from '../../models/course.model';
import mongoose from 'mongoose';
import ApiError from '../../../utils/ApiError';

/**
 * @desc    Create a new course (teacher only)
 * @route   POST /api/courses
 * @access  Private (teacher)
 */
export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'teacher') {
      throw new ApiError(403, 'Only teachers can create courses');
    }
    const { title, description, lessons } = req.body;
    const course = await Course.create({
      title,
      description,
      lessons: lessons || [],
      owner: user._id,
    });
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get courses owned by the current user
 * @route   GET /api/courses/me
 * @access  Private
 */
export const getMyCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, 'Unauthorized');
    }
    const courses = await Course.find({ owner: user._id });
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a course (owner only)
 * @route   PATCH /api/courses/:id
 * @access  Private
 */
export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid course ID');
    }
    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, 'Course not found');
    }
    if (course.owner.toString() !== user._id.toString()) {
      throw new ApiError(403, 'Not authorized to edit this course');
    }
    const updates = req.body;
    Object.assign(course, updates);
    await course.save();
    res.json(course);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a course (owner only)
 * @route   DELETE /api/courses/:id
 * @access  Private
 */
export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid course ID');
    }
    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, 'Course not found');
    }
    if (course.owner.toString() !== user._id.toString()) {
      throw new ApiError(403, 'Not authorized to delete this course');
    }
    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    next(error);
  }
};
