/**
 * Email Verification Service
 * Implements cryptographically secure token generation
 * and email verification workflow
 */

import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

// Create email transporter (configure with your email service)
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Generate cryptographically secure verification token
 */
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Send verification email to user
 */
export const sendVerificationEmail = async (user, token) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'JobPortal'}" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: 'Verify Your Email Address',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${process.env.APP_NAME || 'JobPortal'}!</h1>
            </div>
            <div class="content">
              <h2>Hi ${user.name},</h2>
              <p>Thank you for registering with us. Please verify your email address to complete your registration and access all features.</p>
              <p>Click the button below to verify your email:</p>
              <center>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </center>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'JobPortal'}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verify email token and activate user account
 */
export const verifyEmailToken = async (token) => {
  try {
    // Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return {
        success: false,
        message: 'Invalid or expired verification token'
      };
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return {
      success: true,
      message: 'Email verified successfully',
      user
    };
  } catch (error) {
    console.error('Error verifying email token:', error);
    return {
      success: false,
      message: 'Email verification failed'
    };
  }
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.isEmailVerified) {
      return { success: false, message: 'Email already verified' };
    }

    // Generate new token
    const verificationToken = generateVerificationToken();
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    // Save hashed token to database
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send email
    await sendVerificationEmail(user, verificationToken);

    return {
      success: true,
      message: 'Verification email sent successfully'
    };
  } catch (error) {
    console.error('Error resending verification email:', error);
    return {
      success: false,
      message: 'Failed to resend verification email'
    };
  }
};

/**
 * Send welcome email after verification
 */
export const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();
    
    const dashboardUrl = `${process.env.CLIENT_URL}/dashboard`;
    
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'JobPortal'}" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: 'Welcome to JobPortal - Your Account is Ready!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .feature {
              background: white;
              padding: 15px;
              margin: 10px 0;
              border-left: 4px solid #667eea;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to ${process.env.APP_NAME || 'JobPortal'}!</h1>
            </div>
            <div class="content">
              <h2>Hi ${user.name},</h2>
              <p>Your email has been verified and your account is now active!</p>
              
              <h3>Get Started:</h3>
              <div class="feature">
                <strong>📝 Complete Your Profile</strong><br>
                Add your skills, experience, and education to get better job recommendations.
              </div>
              <div class="feature">
                <strong>🔍 Browse Jobs</strong><br>
                Explore thousands of job opportunities tailored to your profile.
              </div>
              <div class="feature">
                <strong>💼 Apply Easily</strong><br>
                One-click application with your saved resume.
              </div>
              <div class="feature">
                <strong>💬 Direct Communication</strong><br>
                Chat directly with recruiters about opportunities.
              </div>
              
              <center>
                <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
              </center>
              
              <p>Need help? Contact us at ${process.env.SUPPORT_EMAIL || 'support@jobportal.com'}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false };
  }
};

export default {
  generateVerificationToken,
  sendVerificationEmail,
  verifyEmailToken,
  resendVerificationEmail,
  sendWelcomeEmail
};
