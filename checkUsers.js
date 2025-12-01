import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUsers = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find({}, 'name email role isActive isEmailVerified failedLoginAttempts lockUntil');
    
    console.log(`📋 Total users in database: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Email Verified: ${user.isEmailVerified}`);
      console.log(`   Failed Attempts: ${user.failedLoginAttempts || 0}`);
      console.log(`   Locked: ${user.lockUntil && user.lockUntil > Date.now() ? 'Yes' : 'No'}`);
      console.log('');
    });

    // Check specifically for admin
    const admin = await User.findOne({ email: 'admin@jobportal.com' });
    if (admin) {
      console.log('✅ Admin account exists');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.isActive}`);
      console.log(`   Email Verified: ${admin.isEmailVerified}`);
    } else {
      console.log('❌ Admin account NOT FOUND');
      console.log('\nCreating admin account now...\n');
      
      const newAdmin = await User.create({
        name: 'Admin',
        email: 'admin@jobportal.com',
        password: 'Admin123!',
        role: 'admin',
        isEmailVerified: true,
        isActive: true
      });
      
      console.log('✅ Admin account created successfully!');
      console.log(`   Email: ${newAdmin.email}`);
      console.log(`   Password: Admin123!`);
      console.log(`   Role: ${newAdmin.role}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkUsers();
