import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Company from '../models/Company.js';
import Notification from '../models/Notification.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;

    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password -refreshToken')
      .populate('company')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-active
// @access  Private (Admin)
export const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs (including unapproved)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
export const getAllJobs = async (req, res, next) => {
  try {
    const { isApproved, status, page = 1, limit = 20 } = req.query;

    const query = {};

    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .populate('company', 'name logo')
      .populate('postedBy', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject job
// @route   PUT /api/admin/jobs/:id/approve
// @access  Private (Admin)
export const approveJob = async (req, res, next) => {
  try {
    const { isApproved } = req.body;

    const job = await Job.findById(req.params.id).populate('postedBy');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    job.isApproved = isApproved;
    job.approvedBy = req.user.id;
    job.approvedAt = Date.now();
    await job.save();

    // Create notification
    await Notification.create({
      recipient: job.postedBy._id,
      sender: req.user.id,
      type: isApproved ? 'job-approved' : 'job-rejected',
      title: isApproved ? 'Job Approved' : 'Job Rejected',
      message: `Your job posting "${job.title}" has been ${isApproved ? 'approved' : 'rejected'}`,
      relatedJob: job._id,
      link: `/dashboard/jobs/${job._id}`
    });

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const seekers = await User.countDocuments({ role: 'seeker' });
    const recruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active', isApproved: true });
    const totalApplications = await Application.countDocuments();
    const totalCompanies = await Company.countDocuments();

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const recentJobs = await Job.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Applications by status
    const applicationStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          seekers,
          recruiters,
          recentRegistrations: recentUsers
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          recentPosts: recentJobs
        },
        applications: {
          total: totalApplications,
          byStatus: applicationStats
        },
        companies: {
          total: totalCompanies
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
