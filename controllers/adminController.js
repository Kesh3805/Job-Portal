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

// @desc    Get single user details
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
export const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken')
      .populate('company');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get additional stats
    const stats = {};
    
    if (user.role === 'seeker') {
      stats.applicationsCount = await Application.countDocuments({ applicant: user._id });
    } else if (user.role === 'recruiter') {
      stats.jobsPosted = await Job.countDocuments({ postedBy: user._id });
      stats.totalApplications = await Application.countDocuments({ 
        job: { $in: await Job.find({ postedBy: user._id }).distinct('_id') }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['seeker', 'recruiter', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent changing own role
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting own account
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Delete related data
    if (user.role === 'recruiter') {
      await Job.deleteMany({ postedBy: user._id });
      if (user.company) {
        await Company.findByIdAndDelete(user.company);
      }
    } else if (user.role === 'seeker') {
      await Application.deleteMany({ applicant: user._id });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Delete related applications
    await Application.deleteMany({ job: job._id });

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res, next) => {
  try {
    const { range = 'month' } = req.query;
    
    // Calculate date range
    let dateFilter = {};
    const now = new Date();
    
    switch(range) {
      case 'week':
        dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case 'month':
        dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case 'year':
        dateFilter = { createdAt: { $gte: new Date(now - 365 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = {};
    }

    // User Statistics
    const totalUsers = await User.countDocuments();
    const seekers = await User.countDocuments({ role: 'seeker' });
    const recruiters = await User.countDocuments({ role: 'recruiter' });
    const newUsers = await User.countDocuments(dateFilter);
    const previousPeriodUsers = await User.countDocuments({
      createdAt: { 
        $gte: new Date(now - (range === 'week' ? 14 : range === 'month' ? 60 : 730) * 24 * 60 * 60 * 1000),
        $lt: new Date(now - (range === 'week' ? 7 : range === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000)
      }
    });
    const growthRate = previousPeriodUsers > 0 
      ? ((newUsers - previousPeriodUsers) / previousPeriodUsers * 100).toFixed(1)
      : 0;

    // Active users (logged in today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = await User.countDocuments({
      lastLogin: { $gte: today }
    });

    // Job Statistics
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active', isApproved: true });
    const pendingJobs = await Job.countDocuments({ isApproved: false });
    const closedJobs = await Job.countDocuments({ status: 'closed' });

    // Average applications per job
    const jobsWithApps = await Job.aggregate([
      { $lookup: { from: 'applications', localField: '_id', foreignField: 'job', as: 'applications' } },
      { $project: { appCount: { $size: '$applications' } } },
      { $group: { _id: null, avgApps: { $avg: '$appCount' } } }
    ]);
    const avgApplications = jobsWithApps.length > 0 ? Math.round(jobsWithApps[0].avgApps) : 0;

    // Top job categories
    const topCategories = await Job.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]);

    // Application Statistics
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const acceptedApplications = await Application.countDocuments({ status: 'accepted' });
    const rejectedApplications = await Application.countDocuments({ status: 'rejected' });
    const conversionRate = totalApplications > 0
      ? ((acceptedApplications / totalApplications) * 100).toFixed(1)
      : 0;

    // Company Statistics
    const totalCompanies = await Company.countDocuments();
    const verifiedCompanies = await Company.countDocuments({ isVerified: true });
    const pendingCompanies = await Company.countDocuments({ isVerified: false });

    res.status(200).json({
      success: true,
      data: {
        userStats: {
          total: totalUsers,
          seekers,
          recruiters,
          activeToday,
          newThisMonth: newUsers,
          growthRate: parseFloat(growthRate)
        },
        jobStats: {
          total: totalJobs,
          active: activeJobs,
          pending: pendingJobs,
          closed: closedJobs,
          avgApplications,
          topCategories
        },
        applicationStats: {
          total: totalApplications,
          pending: pendingApplications,
          accepted: acceptedApplications,
          rejected: rejectedApplications,
          conversionRate: parseFloat(conversionRate)
        },
        companyStats: {
          total: totalCompanies,
          verified: verifiedCompanies,
          pending: pendingCompanies
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
export const getSettings = async (req, res, next) => {
  try {
    const settings = {
      general: {
        siteName: 'JobPortal',
        siteDescription: 'Connect with opportunities and build your career',
        supportEmail: 'support@jobportal.com',
        requireJobApproval: true,
        requireEmailVerification: true,
        allowPublicJobView: true
      },
      notifications: {
        emailNotifications: true,
        applicationNotifications: true,
        jobApprovalNotifications: true,
        weeklyDigest: false
      },
      security: {
        passwordMinLength: 6,
        sessionTimeout: 24,
        maxLoginAttempts: 5,
        requireStrongPassword: false,
        twoFactorAuth: false
      },
      fees: {
        jobPostingFee: 0,
        featuredJobFee: 49,
        resumeHighlightFee: 9,
        currency: 'USD'
      }
    };

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update platform settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
export const updateSettings = async (req, res, next) => {
  try {
    const settings = req.body;

    res.status(200).json({
      success: true,
      data: settings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export analytics report
// @route   GET /api/admin/reports/export
// @access  Private (Admin)
export const exportReport = async (req, res, next) => {
  try {
    const users = await User.find().select('name email role createdAt isActive');
    const jobs = await Job.find().select('title company status isApproved createdAt');

    let csv = 'Type,Name,Email,Status,Created At\n';
    
    users.forEach(user => {
      csv += `User,"${user.name}","${user.email}",${user.isActive ? 'Active' : 'Inactive'},"${user.createdAt}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="analytics-${Date.now()}.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
