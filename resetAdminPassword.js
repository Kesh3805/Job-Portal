import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const resetAdminPassword = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    const admin = await User.findOne({ email: 'admin@jobportal.com' });
    
    if (!admin) {
      console.log('❌ Admin account not found');
      process.exit(1);
    }

    console.log('🔄 Resetting admin password...\n');
    
    // Set new password
    admin.password = 'Admin123!';
    
    // Reset failed attempts
    admin.failedLoginAttempts = 0;
    admin.lockUntil = undefined;
    
    // Ensure account is active and verified
    admin.isActive = true;
    admin.isEmailVerified = true;
    
    await admin.save();
    
    console.log('✅ Admin password reset successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('   Email: admin@jobportal.com');
    console.log('   Password: Admin123!');
    console.log('   Role: admin');
    console.log('   Active: true');
    console.log('   Email Verified: true');
    console.log('   Failed Attempts: 0');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetAdminPassword();
