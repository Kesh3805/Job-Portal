import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updatePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate, registerValidation, loginValidation } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/refresh', refreshToken);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/update-password', protect, updatePassword);

export default router;
