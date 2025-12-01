import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const unlockAccount = async () => {
  try {
    // Use MONGODB_URI from .env (fallback to MONGO_URI for compatibility)
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.log('❌ MongoDB URI not found in .env file');
      console.log('Please set MONGODB_URI in your .env file');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get email from command line argument
    const email = process.argv[2];
    
    if (!email) {
      console.log('\n📋 Unlocking all locked accounts...\n');
      
      // Find all locked accounts
      const lockedUsers = await User.find({
        $or: [
          { lockUntil: { $gt: Date.now() } },
          { failedLoginAttempts: { $gt: 0 } }
        ]
      });
      
      if (lockedUsers.length === 0) {
        console.log('✅ No locked accounts found');
        process.exit(0);
      }
      
      console.log(`Found ${lockedUsers.length} account(s) with locks or failed attempts:\n`);
      
      for (const user of lockedUsers) {
        await user.resetFailedLogins();
        console.log(`✅ Unlocked: ${user.email} (Role: ${user.role})`);
      }
      
      console.log('\n✅ All accounts unlocked successfully');
      process.exit(0);
    }

    // Unlock specific user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      process.exit(1);
    }

    if (!user.isLocked() && user.failedLoginAttempts === 0) {
      console.log(`✅ Account is not locked: ${email}`);
      process.exit(0);
    }

    await user.resetFailedLogins();
    
    console.log(`✅ Account unlocked successfully: ${email}`);
    console.log(`Role: ${user.role}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

unlockAccount();
