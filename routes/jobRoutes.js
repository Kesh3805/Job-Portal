import express from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobsByCompany,
  getRecommendedJobsForUser,
  getJobStats,
  getMyJobs
} from '../controllers/jobController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validate, jobValidation } from '../middleware/validation.js';

const router = express.Router();

router.get('/', optionalAuth, getJobs);
router.post('/', protect, authorize('recruiter', 'admin'), validate(jobValidation), createJob);
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), getMyJobs);
router.get('/recommended', protect, authorize('seeker'), getRecommendedJobsForUser);
router.get('/company/:companyId', getJobsByCompany);
router.get('/:id', getJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);
router.get('/:id/stats', protect, authorize('recruiter', 'admin'), getJobStats);

export default router;
