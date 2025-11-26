import { body, validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  };
};

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['seeker', 'recruiter']).withMessage('Invalid role')
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const jobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('employmentType').isIn(['full-time', 'part-time', 'contract', 'internship', 'temporary']).withMessage('Invalid employment type'),
  body('experienceLevel').isIn(['entry', 'mid', 'senior', 'lead', 'executive']).withMessage('Invalid experience level')
];

export const applicationValidation = [
  body('job').isMongoId().withMessage('Valid job ID is required'),
  body('coverLetter').optional().trim()
];

export const companyValidation = [
  body('name').trim().notEmpty().withMessage('Company name is required'),
  body('description').trim().notEmpty().withMessage('Company description is required')
];
