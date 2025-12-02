const mongoose = require('mongoose');
const Job = require('../models/Job');
const Company = require('../models/Company');
const User = require('../models/User');
require('dotenv').config();

const jobsData = [
  // Development
  {
    title: 'Senior Full Stack Developer',
    description: 'We are looking for an experienced Full Stack Developer to join our innovative team. You will work on cutting-edge web applications using modern technologies.',
    category: 'Development',
    employmentType: 'full-time',
    location: 'San Francisco, CA',
    salary: { min: 120, max: 180, period: 'year' },
    experienceLevel: 'senior',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'],
    status: 'active',
  },
  {
    title: 'Frontend React Developer',
    description: 'Join our dynamic team to build beautiful, responsive user interfaces. Work with the latest React ecosystem and modern design patterns.',
    category: 'Development',
    employmentType: 'full-time',
    location: 'Remote',
    salary: { min: 90, max: 130, period: 'year' },
    experienceLevel: 'mid',
    skills: ['React', 'JavaScript', 'CSS', 'Redux', 'Git'],
    status: 'active',
  },
  {
    title: 'Backend Python Developer',
    description: 'Develop robust backend services and APIs using Python and Django. Work on scalable microservices architecture.',
    category: 'Development',
    employmentType: 'contract',
    location: 'New York, NY',
    salary: { min: 100, max: 140, period: 'year' },
    experienceLevel: 'senior',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'REST API'],
    status: 'active',
  },
  {
    title: 'Junior Software Engineer',
    description: 'Perfect opportunity for recent graduates to start their career. Learn from experienced mentors and work on real-world projects.',
    category: 'Development',
    employmentType: 'full-time',
    location: 'Austin, TX',
    salary: { min: 60, max: 80, period: 'year' },
    experienceLevel: 'entry',
    skills: ['JavaScript', 'HTML', 'CSS', 'Git', 'Agile'],
    status: 'active',
  },
  {
    title: 'Mobile App Developer (iOS)',
    description: 'Build native iOS applications using Swift. Create intuitive user experiences for millions of users.',
    category: 'Development',
    employmentType: 'full-time',
    location: 'Seattle, WA',
    salary: { min: 110, max: 160, period: 'year' },
    experienceLevel: 'mid',
    skills: ['Swift', 'iOS', 'Xcode', 'UIKit', 'SwiftUI'],
    status: 'active',
  },
  
  // Design
  {
    title: 'Senior UI/UX Designer',
    description: 'Lead design initiatives for our product suite. Create user-centered designs that delight and engage our customers.',
    category: 'Design',
    employmentType: 'full-time',
    location: 'Los Angeles, CA',
    salary: { min: 95, max: 135, period: 'year' },
    experienceLevel: 'senior',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
    status: 'active',
  },
  {
    title: 'Graphic Designer',
    description: 'Create stunning visual content for marketing campaigns, social media, and brand materials.',
    category: 'Design',
    employmentType: 'part-time',
    location: 'Remote',
    salary: { min: 50, max: 70, period: 'year' },
    experienceLevel: 'mid',
    skills: ['Photoshop', 'Illustrator', 'InDesign', 'Branding', 'Typography'],
    status: 'active',
  },
  {
    title: 'Product Designer',
    description: 'Shape the future of our products through thoughtful design. Collaborate with engineers and product managers.',
    category: 'Design',
    employmentType: 'full-time',
    location: 'Boston, MA',
    salary: { min: 100, max: 140, period: 'year' },
    experienceLevel: 'mid',
    skills: ['Figma', 'User Research', 'Wireframing', 'Design Systems', 'CSS'],
    status: 'active',
  },
  
  // Marketing
  {
    title: 'Digital Marketing Manager',
    description: 'Lead digital marketing strategies across multiple channels. Drive growth through data-driven campaigns.',
    category: 'Marketing',
    employmentType: 'full-time',
    location: 'Chicago, IL',
    salary: { min: 85, max: 120, period: 'year' },
    experienceLevel: 'senior',
    skills: ['SEO', 'Google Analytics', 'Content Strategy', 'Social Media', 'PPC'],
    status: 'active',
  },
  {
    title: 'Content Marketing Specialist',
    description: 'Create compelling content that drives engagement and conversions. Blog posts, whitepapers, and case studies.',
    category: 'Marketing',
    employmentType: 'full-time',
    location: 'Remote',
    salary: { min: 60, max: 85, period: 'year' },
    experienceLevel: 'mid',
    skills: ['Content Writing', 'SEO', 'WordPress', 'Analytics', 'Copywriting'],
    status: 'active',
  },
  {
    title: 'Social Media Manager',
    description: 'Manage and grow our social media presence. Create engaging content and build community.',
    category: 'Marketing',
    employmentType: 'full-time',
    location: 'Miami, FL',
    salary: { min: 55, max: 75, period: 'year' },
    experienceLevel: 'entry',
    skills: ['Social Media', 'Content Creation', 'Analytics', 'Canva', 'Scheduling Tools'],
    status: 'active',
  },
  
  // Sales
  {
    title: 'Enterprise Sales Executive',
    description: 'Drive revenue by selling our enterprise solutions to Fortune 500 companies. Build lasting relationships.',
    category: 'Sales',
    employmentType: 'full-time',
    location: 'New York, NY',
    salary: { min: 100, max: 200, period: 'year' },
    experienceLevel: 'senior',
    skills: ['B2B Sales', 'Salesforce', 'Negotiation', 'Cold Calling', 'Account Management'],
    status: 'active',
  },
  {
    title: 'Sales Development Representative',
    description: 'Generate and qualify leads for our sales team. First step to a successful sales career.',
    category: 'Sales',
    employmentType: 'full-time',
    location: 'San Diego, CA',
    salary: { min: 50, max: 70, period: 'year' },
    experienceLevel: 'entry',
    skills: ['Lead Generation', 'Cold Calling', 'Email Outreach', 'CRM', 'Communication'],
    status: 'active',
  },
  {
    title: 'Account Manager',
    description: 'Manage relationships with existing clients. Ensure satisfaction and identify upsell opportunities.',
    category: 'Sales',
    employmentType: 'full-time',
    location: 'Denver, CO',
    salary: { min: 70, max: 95, period: 'year' },
    experienceLevel: 'mid',
    skills: ['Account Management', 'Customer Success', 'Salesforce', 'Communication', 'Problem Solving'],
    status: 'active',
  },
  
  // Finance
  {
    title: 'Financial Analyst',
    description: 'Analyze financial data and provide insights to drive business decisions. Work with senior leadership.',
    category: 'Finance',
    employmentType: 'full-time',
    location: 'New York, NY',
    salary: { min: 75, max: 110, period: 'year' },
    experienceLevel: 'mid',
    skills: ['Excel', 'Financial Modeling', 'SQL', 'Tableau', 'Forecasting'],
    status: 'active',
  },
  {
    title: 'Senior Accountant',
    description: 'Manage accounting operations including month-end close, reconciliations, and financial reporting.',
    category: 'Finance',
    employmentType: 'full-time',
    location: 'Charlotte, NC',
    salary: { min: 70, max: 95, period: 'year' },
    experienceLevel: 'senior',
    skills: ['QuickBooks', 'GAAP', 'Excel', 'Reconciliation', 'Audit'],
    status: 'active',
  },
  {
    title: 'Investment Banking Analyst',
    description: 'Support deal execution including financial modeling, valuation analysis, and client presentations.',
    category: 'Finance',
    employmentType: 'full-time',
    location: 'New York, NY',
    salary: { min: 100, max: 150, period: 'year' },
    experienceLevel: 'entry',
    skills: ['Financial Modeling', 'Excel', 'PowerPoint', 'Valuation', 'M&A'],
    status: 'active',
  },
  
  // Healthcare
  {
    title: 'Registered Nurse (RN)',
    description: 'Provide patient care in a fast-paced hospital environment. Work with a supportive team.',
    category: 'Healthcare',
    employmentType: 'full-time',
    location: 'Houston, TX',
    salary: { min: 65, max: 85, period: 'year' },
    experienceLevel: 'mid',
    skills: ['Patient Care', 'IV Therapy', 'EMR', 'Critical Thinking', 'Communication'],
    status: 'active',
  },
  {
    title: 'Medical Assistant',
    description: 'Support physicians in providing excellent patient care. Administrative and clinical duties.',
    category: 'Healthcare',
    employmentType: 'full-time',
    location: 'Phoenix, AZ',
    salary: { min: 35, max: 45, period: 'year' },
    experienceLevel: 'entry',
    skills: ['Patient Care', 'Vital Signs', 'EMR', 'Scheduling', 'HIPAA'],
    status: 'active',
  },
  {
    title: 'Physical Therapist',
    description: 'Help patients recover mobility and manage pain through therapeutic exercises and treatments.',
    category: 'Healthcare',
    employmentType: 'full-time',
    location: 'Portland, OR',
    salary: { min: 75, max: 95, period: 'year' },
    experienceLevel: 'mid',
    skills: ['Physical Therapy', 'Rehabilitation', 'Patient Assessment', 'Treatment Planning', 'EMR'],
    status: 'active',
  },
  
  // Education
  {
    title: 'High School Math Teacher',
    description: 'Inspire students in mathematics. Create engaging lessons and foster a love of learning.',
    category: 'Education',
    employmentType: 'full-time',
    location: 'Philadelphia, PA',
    salary: { min: 50, max: 70, period: 'year' },
    experienceLevel: 'mid',
    skills: ['Curriculum Development', 'Classroom Management', 'Assessment', 'Math', 'Communication'],
    status: 'active',
  },
  {
    title: 'Instructional Designer',
    description: 'Design engaging online learning experiences. Work with subject matter experts to create courses.',
    category: 'Education',
    employmentType: 'remote',
    location: 'Remote',
    salary: { min: 65, max: 90, period: 'year' },
    experienceLevel: 'mid',
    skills: ['E-Learning', 'Articulate 360', 'LMS', 'Instructional Design', 'Video Editing'],
    status: 'active',
  },
  {
    title: 'Corporate Trainer',
    description: 'Deliver training programs to employees. Develop training materials and assess effectiveness.',
    category: 'Education',
    employmentType: 'full-time',
    location: 'Dallas, TX',
    salary: { min: 60, max: 80, period: 'year' },
    experienceLevel: 'mid',
    skills: ['Training Development', 'Public Speaking', 'PowerPoint', 'Assessment', 'Facilitation'],
    status: 'active',
  },
  
  // Engineering
  {
    title: 'Mechanical Engineer',
    description: 'Design and develop mechanical systems for cutting-edge products. Work on innovative projects.',
    category: 'Engineering',
    employmentType: 'full-time',
    location: 'Detroit, MI',
    salary: { min: 80, max: 110, period: 'year' },
    experienceLevel: 'mid',
    skills: ['CAD', 'SolidWorks', 'FEA', 'Manufacturing', 'Problem Solving'],
    status: 'active',
  },
  {
    title: 'Electrical Engineer',
    description: 'Design electrical systems and circuits. Test and troubleshoot electronic components.',
    category: 'Engineering',
    employmentType: 'full-time',
    location: 'San Jose, CA',
    salary: { min: 90, max: 130, period: 'year' },
    experienceLevel: 'senior',
    skills: ['Circuit Design', 'PCB', 'MATLAB', 'Testing', 'Troubleshooting'],
    status: 'active',
  },
  {
    title: 'Civil Engineer',
    description: 'Plan and oversee construction projects. Ensure structural integrity and safety compliance.',
    category: 'Engineering',
    employmentType: 'full-time',
    location: 'Atlanta, GA',
    salary: { min: 70, max: 95, period: 'year' },
    experienceLevel: 'mid',
    skills: ['AutoCAD', 'Project Management', 'Structural Analysis', 'Construction', 'Permitting'],
    status: 'active',
  },
  
  // Customer Service
  {
    title: 'Customer Support Specialist',
    description: 'Provide excellent support to customers via phone, email, and chat. Resolve issues efficiently.',
    category: 'Customer Service',
    employmentType: 'full-time',
    location: 'Remote',
    salary: { min: 40, max: 55, period: 'year' },
    experienceLevel: 'entry',
    skills: ['Customer Service', 'Zendesk', 'Communication', 'Problem Solving', 'Empathy'],
    status: 'active',
  },
  {
    title: 'Customer Success Manager',
    description: 'Ensure customer satisfaction and drive product adoption. Build strong relationships.',
    category: 'Customer Service',
    employmentType: 'full-time',
    location: 'San Francisco, CA',
    salary: { min: 70, max: 95, period: 'year' },
    experienceLevel: 'mid',
    skills: ['Customer Success', 'Salesforce', 'Analytics', 'Training', 'Relationship Building'],
    status: 'active',
  },
  
  // Data Science
  {
    title: 'Data Scientist',
    description: 'Analyze complex datasets and build predictive models. Drive business decisions with data insights.',
    category: 'Data Science',
    employmentType: 'full-time',
    location: 'Seattle, WA',
    salary: { min: 120, max: 170, period: 'year' },
    experienceLevel: 'senior',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
    status: 'active',
  },
  {
    title: 'Data Analyst',
    description: 'Transform data into actionable insights. Create dashboards and reports for stakeholders.',
    category: 'Data Science',
    employmentType: 'full-time',
    location: 'Chicago, IL',
    salary: { min: 70, max: 95, period: 'year' },
    experienceLevel: 'mid',
    skills: ['SQL', 'Tableau', 'Excel', 'Python', 'Data Visualization'],
    status: 'active',
  },
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Get first company and user (recruiter) from database
    const company = await Company.findOne();
    const recruiter = await User.findOne({ role: 'recruiter' });

    if (!company || !recruiter) {
      console.log('Please create at least one company and one recruiter user first');
      process.exit(1);
    }

    // Add company and postedBy to each job
    const jobsWithRefs = jobsData.map(job => ({
      ...job,
      company: company._id,
      postedBy: recruiter._id,
    }));

    // Insert jobs
    const createdJobs = await Job.insertMany(jobsWithRefs);
    console.log(`✅ Successfully seeded ${createdJobs.length} jobs`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
};

seedJobs();
