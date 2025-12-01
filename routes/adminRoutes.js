import express from 'express';
import {
  getAllUsers,
  getUserDetails,
  toggleUserActive,
  updateUserRole,
  deleteUser,
  getAllJobs,
  approveJob,
  deleteJob,
  getAnalytics,
  getSettings,
  updateSettings,
  exportReport
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/toggle-active', toggleUserActive);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Job management
router.get('/jobs', getAllJobs);
router.put('/jobs/:id/approve', approveJob);
router.delete('/jobs/:id', deleteJob);

// Analytics
router.get('/analytics', getAnalytics);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Reports
router.get('/reports/export', exportReport);

export default router;
