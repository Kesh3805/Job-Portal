import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Company from '../models/Company.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken -emailVerificationToken -passwordResetToken')
      .populate('company')
      .populate('savedJobs');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      bio: req.body.bio,
      skills: req.body.skills,
      experience: req.body.experience,
      education: req.body.education,
      portfolio: req.body.portfolio,
      position: req.body.position
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload avatar
// @route   PUT /api/users/avatar
// @access  Private
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const user = await User.findById(req.user.id);

    // Delete old avatar file if exists
    if (user.avatar?.publicId) {
      const oldFilePath = path.join(__dirname, '..', 'uploads', 'avatars', user.avatar.publicId);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Use local storage
    user.avatar = {
      url: `/uploads/avatars/${req.file.filename}`,
      publicId: req.file.filename
    };

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: user.avatar
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   PUT /api/users/resume
// @access  Private (Seeker)
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const user = await User.findById(req.user.id);

    // Delete old resume file if exists
    if (user.resume?.publicId) {
      const oldFilePath = path.join(__dirname, '..', 'uploads', 'resumes', user.resume.publicId);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    user.resume = {
      url: `/uploads/resumes/${req.file.filename}`,
      publicId: req.file.filename,
      fileName: req.file.originalname
    };

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: user.resume
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/unsave job
// @route   PUT /api/users/saved-jobs/:jobId
// @access  Private (Seeker)
export const toggleSaveJob = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const jobId = req.params.jobId;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Toggle save
    const index = user.savedJobs.indexOf(jobId);
    if (index > -1) {
      user.savedJobs.splice(index, 1);
      await user.save({ validateBeforeSave: false });
      
      return res.status(200).json({
        success: true,
        message: 'Job removed from saved jobs',
        saved: false
      });
    } else {
      user.savedJobs.push(jobId);
      await user.save({ validateBeforeSave: false });
      
      return res.status(200).json({
        success: true,
        message: 'Job saved successfully',
        saved: true
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved jobs
// @route   GET /api/users/saved-jobs
// @access  Private (Seeker)
export const getSavedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'savedJobs',
        populate: {
          path: 'company',
          select: 'name logo location'
        }
      });

    res.status(200).json({
      success: true,
      count: user.savedJobs.length,
      data: user.savedJobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard-stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = {};

    if (req.user.role === 'seeker') {
      const applications = await Application.find({ applicant: req.user.id });
      const savedJobs = await User.findById(req.user.id).select('savedJobs');

      stats.totalApplications = applications.length;
      stats.pendingApplications = applications.filter(a => a.status === 'pending').length;
      stats.shortlisted = applications.filter(a => a.status === 'shortlisted').length;
      stats.interviews = applications.filter(a => a.status === 'interview-scheduled').length;
      stats.savedJobs = savedJobs.savedJobs.length;
      stats.recentApplications = applications.slice(0, 5);
    } else if (req.user.role === 'recruiter') {
      const jobs = await Job.find({ postedBy: req.user.id });
      const jobIds = jobs.map(j => j._id);
      const applications = await Application.find({ job: { $in: jobIds } });

      stats.totalJobs = jobs.length;
      stats.activeJobs = jobs.filter(j => j.status === 'active').length;
      stats.totalApplications = applications.length;
      stats.newApplications = applications.filter(a => a.status === 'pending').length;
      stats.shortlisted = applications.filter(a => a.status === 'shortlisted').length;
      stats.totalViews = jobs.reduce((sum, job) => sum + job.views, 0);
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
