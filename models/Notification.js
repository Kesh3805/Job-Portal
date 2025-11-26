import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'application-received',
      'application-status-changed',
      'interview-scheduled',
      'interview-reminder',
      'new-message',
      'job-approved',
      'job-rejected',
      'profile-viewed',
      'new-job-match',
      'job-expiring',
      'system'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  relatedApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  relatedInterview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  },
  link: String,
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date
}, {
  timestamps: true
});

// Index for efficient querying
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
