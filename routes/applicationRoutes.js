import express from 'express';
import {
  createApplication,
  getApplications,
  getMyApplications,
  getApplication,
  updateApplicationStatus,
  withdrawApplication,
  rateApplication
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate, applicationValidation } from '../middleware/validation.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, authorize('seeker'), validate(applicationValidation), createApplication);
router.post('/:jobId/apply', protect, authorize('seeker'), upload.single('resume'), createApplication);
router.get('/', protect, authorize('recruiter', 'admin'), getApplications);
router.get('/my-applications', protect, authorize('seeker'), getMyApplications);
router.get('/:id', protect, getApplication);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.put('/:id/withdraw', protect, authorize('seeker'), withdrawApplication);
router.put('/:id/rate', protect, authorize('recruiter', 'admin'), rateApplication);

export default router;
