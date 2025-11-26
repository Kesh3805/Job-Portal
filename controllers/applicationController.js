import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendApplicationNotification } from '../config/email.js';
import { emitNotification } from '../socket/socketHandler.js';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId/apply
// @access  Private (Seeker)
export const createApplication = async (req, res, next) => {
  try {
    const jobId = req.params.jobId || req.body.job;
    const { coverLetter, answers } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
    }

    // Check if job exists
    const jobData = await Job.findById(jobId).populate('company').populate('postedBy');

    if (!jobData) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (jobData.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is not accepting applications'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Get user's resume
    const user = await User.findById(req.user.id);

    // Handle resume upload from request if provided
    let resumeData = user.resume;
    if (req.file) {
      resumeData = {
        url: `/uploads/resumes/${req.file.filename}`,
        publicId: req.file.filename,
        fileName: req.file.originalname
      };
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      resume: resumeData,
      coverLetter,
      answers
    });

    // Update job application count
    jobData.applicationCount += 1;
    await jobData.save({ validateBeforeSave: false });

    // Create notification for recruiter
    const notification = await Notification.create({
      recipient: jobData.postedBy._id,
      sender: req.user.id,
      type: 'application-received',
      title: 'New Application Received',
      message: `${req.user.name} applied for ${jobData.title}`,
      relatedJob: jobData._id,
      relatedApplication: application._id,
      link: `/dashboard/applications/${application._id}`
    });

    // Emit socket notification
    const io = req.app.get('io');
    emitNotification(io, jobData.postedBy._id.toString(), notification);

    // Send email notification
    try {
      await sendApplicationNotification(
        jobData.postedBy.email,
        jobData.title,
        req.user.name,
        jobData.company.name
      );
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (for recruiter/admin)
// @route   GET /api/applications
// @access  Private (Recruiter/Admin)
export const getApplications = async (req, res, next) => {
  try {
    const { job, status, page = 1, limit = 10 } = req.query;

    const query = {};

    // If recruiter, only show their job applications
    if (req.user.role === 'recruiter') {
      const jobs = await Job.find({ postedBy: req.user.id }).select('_id');
      query.job = { $in: jobs.map(j => j._id) };
    }

    if (job) {
      query.job = job;
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(query)
      .populate('job', 'title company location employmentType')
      .populate('applicant', 'name email avatar skills experience')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private (Seeker)
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'name logo'
        }
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
export const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant', 'name email phone avatar bio skills experience education portfolio')
      .populate('reviewedBy', 'name')
      .populate('interview');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    const job = await Job.findById(application.job._id);
    
    if (
      application.applicant._id.toString() !== req.user.id &&
      job.postedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter/Admin)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    const job = await Job.findById(application.job._id);
    
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update status
    const oldStatus = application.status;
    application.status = status;
    application.reviewedBy = req.user.id;
    application.reviewedAt = Date.now();

    if (notes) {
      application.notes = notes;
    }

    // Add to status history
    application.statusHistory.push({
      status,
      changedBy: req.user.id,
      changedAt: Date.now(),
      notes
    });

    await application.save();

    // Create notification for applicant
    const notification = await Notification.create({
      recipient: application.applicant._id,
      sender: req.user.id,
      type: 'application-status-changed',
      title: 'Application Status Updated',
      message: `Your application for ${application.job.title} has been ${status}`,
      relatedJob: application.job._id,
      relatedApplication: application._id,
      link: `/dashboard/applications/${application._id}`
    });

    // Emit socket notification
    const io = req.app.get('io');
    emitNotification(io, application.applicant._id.toString(), notification);

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application
// @route   PUT /api/applications/:id/withdraw
// @access  Private (Seeker)
export const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check ownership
    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      });
    }

    if (application.status === 'withdrawn') {
      return res.status(400).json({
        success: false,
        message: 'Application already withdrawn'
      });
    }

    application.status = 'withdrawn';
    application.statusHistory.push({
      status: 'withdrawn',
      changedBy: req.user.id,
      changedAt: Date.now()
    });

    await application.save();

    // Update job application count
    await Job.findByIdAndUpdate(application.job, {
      $inc: { applicationCount: -1 }
    });

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate application
// @route   PUT /api/applications/:id/rate
// @access  Private (Recruiter/Admin)
export const rateApplication = async (req, res, next) => {
  try {
    const { rating } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    const job = await Job.findById(application.job);
    
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this application'
      });
    }

    application.rating = rating;
    await application.save();

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};
