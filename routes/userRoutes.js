import express from 'express';
import {
  getUserProfile,
  updateProfile,
  uploadAvatar,
  uploadResume,
  toggleSaveJob,
  getSavedJobs,
  getDashboardStats
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/saved-jobs', protect, authorize('seeker'), getSavedJobs);
router.put('/saved-jobs/:jobId', protect, authorize('seeker'), toggleSaveJob);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.put('/resume', protect, authorize('seeker'), upload.single('resume'), uploadResume);
router.get('/:id', getUserProfile);

export default router;
