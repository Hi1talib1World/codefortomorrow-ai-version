import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/admin.middleware';
import {
  listContent,
  getContent,
  createContent,
  updateContent,
  deleteContent,
  toggleStatus,
  uploadImage,
  getAnalytics,
} from '../controllers/admin.controller';

const router = express.Router();

// All routes below are protected by JWT + admin role + email allowlist
router.use(protect, adminOnly);

// ─── Content CRUD ─────────────────────────────────────────────────────────────
router.get('/content', listContent);
router.post('/content', createContent);
router.get('/content/:id', getContent);
router.put('/content/:id', updateContent);
router.delete('/content/:id', deleteContent);
router.patch('/content/:id/status', toggleStatus);

// ─── Image Upload ─────────────────────────────────────────────────────────────
router.post('/upload', uploadImage);

// ─── Analytics ────────────────────────────────────────────────────────────────
router.get('/analytics', getAnalytics);

export default router;
