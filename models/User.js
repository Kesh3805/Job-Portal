import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['seeker', 'recruiter', 'admin'],
    default: 'seeker'
  },
  avatar: {
    url: String,
    publicId: String
  },
  phone: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
  refreshToken: String,
  
  // Job Seeker specific fields
  bio: String,
  skills: [String],
  experience: [{
    title: String,
    company: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String
  }],
  education: [{
    degree: String,
    institution: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    current: Boolean
  }],
  resume: {
    url: String,
    publicId: String,
    fileName: String
  },
  portfolio: {
    github: String,
    linkedin: String,
    website: String,
    other: String
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  
  // Recruiter specific fields
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  position: String,
  
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return token;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  
  return token;
};

const User = mongoose.model('User', userSchema);

export default User;
