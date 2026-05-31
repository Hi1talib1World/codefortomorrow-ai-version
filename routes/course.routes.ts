import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { createCourse, getMyCourses, updateCourse, deleteCourse } from '../controllers/course.controller';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', createCourse);
router.get('/me', getMyCourses);
router.patch('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
