import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Check if email is configured
const isEmailConfigured = process.env.EMAIL_USER && 
  process.env.EMAIL_PASSWORD && 
  process.env.EMAIL_USER !== 'your-email@gmail.com';

let transporter = null;

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
} else {
  console.warn('⚠️  Email is not configured. Email sending will be skipped.');
}

export const sendEmail = async (to, subject, html) => {
  if (!isEmailConfigured) {
    console.log(`📧 Email skipped (not configured): ${subject} to ${to}`);
    return { skipped: true };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.messageId);
    return info;
  } catch (error) {
    console.error('Email send error:', error.message);
    // Don't throw - just log and continue
    return { error: error.message };
  }
};

export const sendVerificationEmail = async (email, token, name) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Job Portal, ${name}!</h2>
      <p>Please verify your email address by clicking the button below:</p>
      <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Verify Email
      </a>
      <p>Or copy and paste this link into your browser:</p>
      <p>${verifyUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    </div>
  `;
  
  await sendEmail(email, 'Verify Your Email - Job Portal', html);
};

export const sendPasswordResetEmail = async (email, token, name) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>You requested to reset your password. Click the button below to reset it:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Reset Password
      </a>
      <p>Or copy and paste this link into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
  
  await sendEmail(email, 'Password Reset - Job Portal', html);
};

export const sendApplicationNotification = async (email, jobTitle, applicantName, companyName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Job Application Received</h2>
      <p>You have received a new application for the position:</p>
      <h3>${jobTitle}</h3>
      <p><strong>Applicant:</strong> ${applicantName}</p>
      <p><strong>Company:</strong> ${companyName}</p>
      <p>Login to your dashboard to review the application.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        View Applications
      </a>
    </div>
  `;
  
  await sendEmail(email, `New Application: ${jobTitle}`, html);
};

export const sendInterviewScheduledEmail = async (email, jobTitle, interviewDate, interviewTime, meetingLink) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Interview Scheduled</h2>
      <p>Your interview has been scheduled for:</p>
      <h3>${jobTitle}</h3>
      <p><strong>Date:</strong> ${interviewDate}</p>
      <p><strong>Time:</strong> ${interviewTime}</p>
      ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
      <p>Please make sure to be available at the scheduled time.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        View Details
      </a>
    </div>
  `;
  
  await sendEmail(email, `Interview Scheduled: ${jobTitle}`, html);
};

export default transporter;
