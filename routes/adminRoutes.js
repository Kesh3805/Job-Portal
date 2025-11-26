import express from 'express';
import {
  getAllUsers,
  toggleUserActive,
  getAllJobs,
  approveJob,
  getAnalytics
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/toggle-active', toggleUserActive);
router.get('/jobs', getAllJobs);
router.put('/jobs/:id/approve', approveJob);
router.get('/analytics', getAnalytics);

export default router;
