import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import { getRecommendedJobs } from '../utils/jobMatcher.js';

// @desc    Get all jobs with filters and pagination
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      employmentType,
      experienceLevel,
      category,
      salaryMin,
      salaryMax,
      skills,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { status: 'active', isApproved: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (employmentType) {
      query.employmentType = employmentType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (category) {
      query.category = category;
    }

    if (salaryMin || salaryMax) {
      query['salary.min'] = {};
      if (salaryMin) query['salary.min'].$gte = parseInt(salaryMin);
      if (salaryMax) query['salary.max'] = { $lte: parseInt(salaryMax) };
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray };
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const jobs = await Job.find(query)
      .populate('company', 'name logo location')
      .populate('postedBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate({
        path: 'company',
        select: 'name description logo website industry size location'
      })
      .populate({
        path: 'postedBy',
        select: 'name email avatar'
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment view count
    job.views += 1;
    await job.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    next(error);
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Recruiter/Admin)
export const createJob = async (req, res, next) => {
  try {
    // Add user and company to req.body
    req.body.postedBy = req.user.id;
    
    if (!req.user.company) {
      return res.status(400).json({
        success: false,
        message: 'Please create a company profile first'
      });
    }

    req.body.company = req.user.company;

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter/Admin)
export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter/Admin)
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs by company
// @route   GET /api/jobs/company/:companyId
// @access  Public
export const getJobsByCompany = async (req, res, next) => {
  try {
    const jobs = await Job.find({ 
      company: req.params.companyId,
      status: 'active',
      isApproved: true
    }).populate('postedBy', 'name');

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended jobs for user
// @route   GET /api/jobs/recommended
// @access  Private (Seeker)
export const getRecommendedJobsForUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // Get all active jobs
    const jobs = await Job.find({ status: 'active', isApproved: true })
      .populate('company', 'name logo location');

    // Get recommendations
    const recommendations = await getRecommendedJobs(jobs, user, 30);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/:id/stats
// @access  Private (Recruiter/Admin)
export const getJobStats = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view job statistics'
      });
    }

    // Get application statistics
    const applications = await Application.find({ job: req.params.id });
    
    const stats = {
      views: job.views,
      totalApplications: applications.length,
      applicationsByStatus: {
        pending: applications.filter(a => a.status === 'pending').length,
        reviewing: applications.filter(a => a.status === 'reviewing').length,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length,
        'interview-scheduled': applications.filter(a => a.status === 'interview-scheduled').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
        accepted: applications.filter(a => a.status === 'accepted').length
      },
      conversionRate: job.views > 0 ? ((applications.length / job.views) * 100).toFixed(2) : 0
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
