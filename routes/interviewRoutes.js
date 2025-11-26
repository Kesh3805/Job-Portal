import express from 'express';
import {
  scheduleInterview,
  getInterviews,
  updateInterview,
  addFeedback
} from '../controllers/interviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('recruiter', 'admin'), scheduleInterview);
router.get('/', protect, getInterviews);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateInterview);
router.put('/:id/feedback', protect, authorize('recruiter', 'admin'), addFeedback);

export default router;
