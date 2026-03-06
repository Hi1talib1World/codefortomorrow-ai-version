import { Request, Response } from 'express';
import Quiz from '../models/Quiz';

/**
 * @desc    Create a new quiz
 * @route   POST /api/quizzes
 * @access  Private (Teacher only)
 */
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { title, description, questions, assignedClasses, dueDate } = req.body;
    
    // Check if the user is a teacher
    if (req.user?.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create quizzes.' });
    }

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      assignedClasses,
      dueDate,
      teacher: req.user._id,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * @desc    Get all quizzes created by the teacher
 * @route   GET /api/quizzes/teacher
 * @access  Private (Teacher only)
 */
export const getTeacherQuizzes = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can access this.' });
    }

    const quizzes = await Quiz.find({ teacher: req.user._id }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * @desc    Get all quizzes assigned to a class
 * @route   GET /api/quizzes/class/:className
 * @access  Private (Student/Teacher)
 */
export const getClassQuizzes = async (req: Request, res: Response) => {
  try {
    const { className } = req.params;
    const quizzes = await Quiz.find({ assignedClasses: className }).sort({ dueDate: 1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * @desc    Delete a quiz
 * @route   DELETE /api/quizzes/:id
 * @access  Private (Teacher only)
 */
export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Check if the user is the teacher who created the quiz
    if (quiz.teacher.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this quiz.' });
    }

    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
