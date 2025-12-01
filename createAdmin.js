import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    let admin = await User.findOne({ role: 'admin' });
    
    if (admin) {
      console.log('\n✅ Admin account already exists!');
      console.log(`\nAdmin credentials:`);
      console.log(`Email: ${admin.email}`);
      console.log(`Name: ${admin.name}`);
      console.log(`\nNote: If you forgot the password, you can reset it through the app.`);
    } else {
      console.log('No admin found. Creating admin account...');
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@jobportal.com',
        password: 'Admin123!',
        role: 'admin',
        isEmailVerified: true,
        isActive: true
      });
      
      console.log('\n✅ Admin account created successfully!');
      console.log(`\nAdmin credentials:`);
      console.log(`Email: admin@jobportal.com`);
      console.log(`Password: Admin123!`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();
