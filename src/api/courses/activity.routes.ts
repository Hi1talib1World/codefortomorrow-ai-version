import express from 'express';
import { createActivity, getTeacherActivities, getActivityById, deleteActivity } from '../controllers/activity.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Teacher routes
router.post('/', createActivity);
router.get('/teacher', getTeacherActivities);
router.delete('/:id', deleteActivity);

// General routes
router.get('/:id', getActivityById);

export default router;
