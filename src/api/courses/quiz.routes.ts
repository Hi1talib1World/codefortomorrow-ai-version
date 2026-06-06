import express from 'express';
import { createQuiz, getTeacherQuizzes, getClassQuizzes, deleteQuiz } from './quiz.controller';
import { protect } from '../../../src/core/permissions/auth.middleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Teacher routes
router.post('/', createQuiz);
router.get('/teacher', getTeacherQuizzes);
router.delete('/:id', deleteQuiz);

// Student/Teacher routes
router.get('/class/:className', getClassQuizzes);

export default router;
