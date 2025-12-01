/**
 * Rate Limiting Middleware
 * Prevents brute force attacks and API abuse
 */

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from '../config/redis.js';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  // store: new RedisStore({ client: redis }) // Use Redis in production
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration rate limiter
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registrations per hour
  message: 'Too many accounts created from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset rate limiter
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 reset requests per hour
  message: 'Too many password reset requests, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

// Job application rate limiter
export const applicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit to 20 applications per hour
  message: 'Too many job applications, please try again later',
  keyGenerator: (req) => req.user?.id || req.ip, // Use user ID if authenticated
  standardHeaders: true,
  legacyHeaders: false,
});

// Message sending rate limiter
export const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit to 30 messages per minute
  message: 'Too many messages sent, please slow down',
  keyGenerator: (req) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiter
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 uploads per 15 minutes
  message: 'Too many file uploads, please try again later',
  keyGenerator: (req) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin actions rate limiter
export const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // Limit to 50 admin actions per minute
  message: 'Too many admin actions, please slow down',
  keyGenerator: (req) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  apiLimiter,
  authLimiter,
  registerLimiter,
  passwordResetLimiter,
  applicationLimiter,
  messageLimiter,
  uploadLimiter,
  adminLimiter
};
