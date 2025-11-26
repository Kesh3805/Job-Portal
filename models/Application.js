import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    url: String,
    publicId: String,
    fileName: String
  },
  coverLetter: String,
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'interview-scheduled', 'rejected', 'accepted', 'withdrawn'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  answers: [{
    question: String,
    answer: String
  }],
  notes: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  }
}, {
  timestamps: true
});

// Compound index to ensure one application per user per job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
