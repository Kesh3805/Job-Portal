import express from 'express';
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  uploadLogo,
  getMyCompany
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { validate, companyValidation } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getCompanies);
router.post('/', protect, authorize('recruiter'), validate(companyValidation), createCompany);
router.get('/my-company', protect, authorize('recruiter'), getMyCompany);
router.get('/:id', getCompany);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateCompany);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteCompany);
router.put('/:id/logo', protect, authorize('recruiter', 'admin'), upload.single('logo'), uploadLogo);

export default router;
