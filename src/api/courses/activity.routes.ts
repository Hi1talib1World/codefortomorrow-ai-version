import express from 'express';
import { createActivity, getTeacherActivities, getActivityById, deleteActivity } from './activity.controller';
import { protect } from '../../../src/core/permissions/auth.middleware';

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
