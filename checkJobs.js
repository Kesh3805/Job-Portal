import mongoose from 'mongoose';
import Job from './models/Job.js';
import dotenv from 'dotenv';

dotenv.config();

const checkJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/job-portal');
    console.log('Connected to MongoDB');

    const totalJobs = await Job.countDocuments();
    const approvedJobs = await Job.countDocuments({ isApproved: true });
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const activeAndApprovedJobs = await Job.countDocuments({ status: 'active', isApproved: true });

    console.log('\n📊 Database Status:');
    console.log('Total jobs:', totalJobs);
    console.log('Approved jobs:', approvedJobs);
    console.log('Active jobs:', activeJobs);
    console.log('Active & Approved jobs:', activeAndApprovedJobs);

    // Show first 5 jobs
    const jobs = await Job.find().limit(5);
    console.log('\n📋 Sample Jobs:');
    jobs.forEach(job => {
      console.log(`- ${job.title} | Status: ${job.status} | Approved: ${job.isApproved}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkJobs();
