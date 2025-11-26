import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import { sendInterviewScheduledEmail } from '../config/email.js';
import { emitNotification } from '../socket/socketHandler.js';

// @desc    Schedule interview
// @route   POST /api/interviews
// @access  Private (Recruiter/Admin)
export const scheduleInterview = async (req, res, next) => {
  try {
    const { applicationId, scheduledDate, scheduledTime, duration, type, meetingLink, location, agenda } = req.body;

    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('applicant');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const interview = await Interview.create({
      application: applicationId,
      job: application.job._id,
      applicant: application.applicant._id,
      interviewer: req.user.id,
      scheduledDate,
      scheduledTime,
      duration,
      type,
      meetingLink,
      location,
      agenda
    });

    // Update application status
    application.status = 'interview-scheduled';
    application.interview = interview._id;
    await application.save();

    // Create notification
    const notification = await Notification.create({
      recipient: application.applicant._id,
      sender: req.user.id,
      type: 'interview-scheduled',
      title: 'Interview Scheduled',
      message: `Your interview for ${application.job.title} has been scheduled`,
      relatedJob: application.job._id,
      relatedApplication: applicationId,
      relatedInterview: interview._id,
      link: `/dashboard/interviews/${interview._id}`
    });

    // Emit socket notification
    const io = req.app.get('io');
    emitNotification(io, application.applicant._id.toString(), notification);

    // Send email
    try {
      await sendInterviewScheduledEmail(
        application.applicant.email,
        application.job.title,
        scheduledDate,
        scheduledTime,
        meetingLink
      );
    } catch (error) {
      console.error('Failed to send email:', error);
    }

    res.status(201).json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interviews
// @route   GET /api/interviews
// @access  Private
export const getInterviews = async (req, res, next) => {
  try {
    const { status, upcoming } = req.query;
    
    let query = {};

    if (req.user.role === 'seeker') {
      query.applicant = req.user.id;
    } else if (req.user.role === 'recruiter') {
      query.interviewer = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    if (upcoming === 'true') {
      query.scheduledDate = { $gte: new Date() };
      query.status = 'scheduled';
    }

    const interviews = await Interview.find(query)
      .populate('job', 'title company')
      .populate('applicant', 'name email avatar')
      .populate('interviewer', 'name email')
      .populate('application')
      .sort('scheduledDate');

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private (Recruiter/Admin)
export const updateInterview = async (req, res, next) => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.interviewer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    interview = await Interview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add interview feedback
// @route   PUT /api/interviews/:id/feedback
// @access  Private (Recruiter/Admin)
export const addFeedback = async (req, res, next) => {
  try {
    const { rating, comments, strengths, improvements, recommendation } = req.body;

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.interviewer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    interview.feedback = {
      rating,
      comments,
      strengths,
      improvements,
      recommendation
    };

    interview.status = 'completed';
    await interview.save();

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};
