import express from 'express';
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller';
import { protect } from '../middleware/auth.middleware';
import { registerSseClient } from '../services/notification.service';

const router = express.Router();

// Apply auth middleware to protect all notification endpoints
router.use(protect);

router.get('/stream', (req, res) => {
  const userId = (req as any).user?._id;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  registerSseClient(userId.toString(), res);
});

router.route('/')
  .get(getNotifications)
  .post(createNotification);

router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
