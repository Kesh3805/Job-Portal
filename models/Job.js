import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  locationType: {
    type: String,
    enum: ['onsite', 'remote', 'hybrid'],
    default: 'onsite'
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    required: true
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    }
  },
  requirements: [String],
  responsibilities: [String],
  skills: [String],
  benefits: [String],
  category: {
    type: String,
    enum: ['Technology', 'Healthcare', 'Finance', 'Marketing', 'Sales', 'Design', 'Engineering', 'HR', 'Customer Service', 'Other']
  },
  openings: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'paused'],
    default: 'active'
  },
  expiresAt: Date,
  applicationDeadline: Date,
  views: {
    type: Number,
    default: 0
  },
  applicationCount: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date
}, {
  timestamps: true
});

// Index for search optimization
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ status: 1, isApproved: 1 });
jobSchema.index({ company: 1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
