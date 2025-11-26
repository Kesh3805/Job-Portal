import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
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
  interviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 60 // in minutes
  },
  type: {
    type: String,
    enum: ['phone', 'video', 'in-person', 'technical', 'hr'],
    default: 'video'
  },
  status: {
    type: String,
    enum: ['scheduled', 'rescheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  meetingLink: String,
  location: String,
  notes: String,
  agenda: String,
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    strengths: [String],
    improvements: [String],
    recommendation: {
      type: String,
      enum: ['strongly-recommend', 'recommend', 'neutral', 'not-recommend', 'strongly-not-recommend']
    }
  },
  reminder: {
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  },
  rescheduledFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  },
  rescheduledReason: String
}, {
  timestamps: true
});

// Index for efficient querying
interviewSchema.index({ applicant: 1, scheduledDate: 1 });
interviewSchema.index({ interviewer: 1, scheduledDate: 1 });
interviewSchema.index({ job: 1 });

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
