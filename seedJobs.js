import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';
import User from './models/User.js';
import Company from './models/Company.js';

dotenv.config();

const sampleJobs = [
  {
    title: 'Senior Full Stack Developer',
    description: 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.',
    company: null, // Will be set after finding/creating company
    location: 'New York, NY',
    locationType: 'hybrid',
    employmentType: 'full-time',
    category: 'Technology',
    experienceLevel: 'senior',
    salary: {
      min: 120000,
      max: 160000,
      currency: 'USD',
      period: 'yearly'
    },
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'AWS'],
    requirements: [
      '5+ years of experience in full stack development',
      'Strong proficiency in React and Node.js',
      'Experience with cloud platforms (AWS/Azure)',
      'Excellent problem-solving skills',
      'Bachelor\'s degree in Computer Science or related field'
    ],
    responsibilities: [
      'Design and develop scalable web applications',
      'Collaborate with cross-functional teams',
      'Write clean, maintainable code',
      'Participate in code reviews',
      'Mentor junior developers'
    ],
    benefits: ['Health Insurance', '401k', 'Remote Work', 'Professional Development', 'Stock Options'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Frontend Developer',
    description: 'Join our creative team as a Frontend Developer. You will work on building beautiful and responsive user interfaces for our web applications.',
    company: null,
    location: 'San Francisco, CA',
    locationType: 'remote',
    employmentType: 'full-time',
    category: 'Technology',
    experienceLevel: 'mid',
    salary: {
      min: 90000,
      max: 130000,
      currency: 'USD',
      period: 'yearly'
    },
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Redux', 'Tailwind CSS', 'Git'],
    requirements: [
      '3+ years of frontend development experience',
      'Expert knowledge of React and modern JavaScript',
      'Strong understanding of responsive design',
      'Experience with state management (Redux/Context API)',
      'Portfolio of previous work'
    ],
    responsibilities: [
      'Develop new user-facing features',
      'Optimize applications for maximum speed',
      'Collaborate with designers and backend developers',
      'Ensure technical feasibility of UI/UX designs',
      'Build reusable code and libraries'
    ],
    benefits: ['Health Insurance', 'Remote Work', 'Flexible Hours', 'Learning Budget'],
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Backend Engineer',
    description: 'We are seeking a talented Backend Engineer to design and implement robust server-side applications and APIs.',
    company: null,
    location: 'Austin, TX',
    locationType: 'onsite',
    employmentType: 'full-time',
    category: 'Technology',
    experienceLevel: 'mid',
    salary: {
      min: 100000,
      max: 140000,
      currency: 'USD',
      period: 'yearly'
    },
    skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'REST API', 'GraphQL'],
    requirements: [
      '4+ years of backend development experience',
      'Proficiency in Node.js or Python',
      'Strong database design skills',
      'Experience with microservices architecture',
      'Knowledge of DevOps practices'
    ],
    responsibilities: [
      'Design and develop scalable APIs',
      'Optimize database queries and performance',
      'Implement security best practices',
      'Write comprehensive tests',
      'Deploy and maintain production systems'
    ],
    benefits: ['Health Insurance', '401k', 'Gym Membership', 'Catered Lunches'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Junior Web Developer',
    description: 'Great opportunity for a motivated Junior Developer to learn and grow in a supportive environment. You will work on real projects and receive mentorship from senior team members.',
    company: null,
    location: 'Boston, MA',
    locationType: 'hybrid',
    employmentType: 'full-time',
    category: 'Technology',
    experienceLevel: 'entry',
    salary: {
      min: 60000,
      max: 80000,
      currency: 'USD',
      period: 'yearly'
    },
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'SQL'],
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      'Basic knowledge of web technologies',
      'Understanding of version control (Git)',
      'Strong willingness to learn',
      'Good communication skills'
    ],
    responsibilities: [
      'Assist in developing web applications',
      'Write and maintain code under supervision',
      'Participate in team meetings and code reviews',
      'Learn new technologies and best practices',
      'Debug and fix issues'
    ],
    benefits: ['Health Insurance', 'Paid Training', 'Mentorship Program', 'Free Snacks'],
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'DevOps Engineer',
    description: 'Looking for a skilled DevOps Engineer to improve our infrastructure and deployment processes. You will work with cutting-edge cloud technologies.',
    company: null,
    location: 'Seattle, WA',
    locationType: 'remote',
    employmentType: 'full-time',
    category: 'Engineering',
    experienceLevel: 'senior',
    salary: {
      min: 130000,
      max: 170000,
      currency: 'USD',
      period: 'yearly'
    },
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'Python', 'CI/CD'],
    requirements: [
      '5+ years of DevOps experience',
      'Expert knowledge of AWS services',
      'Strong automation skills',
      'Experience with Infrastructure as Code',
      'Excellent troubleshooting abilities'
    ],
    responsibilities: [
      'Design and maintain CI/CD pipelines',
      'Manage cloud infrastructure',
      'Implement monitoring and alerting systems',
      'Optimize system performance and costs',
      'Ensure security compliance'
    ],
    benefits: ['Health Insurance', '401k', 'Remote Work', 'Unlimited PTO', 'Home Office Stipend'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Mobile App Developer (React Native)',
    description: 'Join our mobile team to build innovative cross-platform applications using React Native. Great opportunity to work on apps used by millions.',
    company: null,
    location: 'Los Angeles, CA',
    locationType: 'hybrid',
    employmentType: 'full-time',
    category: 'Technology',
    experienceLevel: 'mid',
    salary: {
      min: 95000,
      max: 135000,
      currency: 'USD',
      period: 'yearly'
    },
    skills: ['React Native', 'JavaScript', 'TypeScript', 'iOS', 'Android', 'Redux', 'Firebase'],
    requirements: [
      '3+ years of mobile development experience',
      'Strong React Native skills',
      'Experience publishing apps to App Store and Play Store',
      'Knowledge of mobile UI/UX best practices',
      'Understanding of RESTful APIs'
    ],
    responsibilities: [
      'Develop and maintain mobile applications',
      'Implement new features and improvements',
      'Optimize app performance',
      'Fix bugs and resolve issues',
      'Collaborate with designers and product managers'
    ],
    benefits: ['Health Insurance', 'Stock Options', 'Flexible Schedule', 'Team Outings'],
    applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'UI/UX Designer',
    description: 'We are looking for a creative UI/UX Designer to create amazing user experiences. You will work on designing intuitive interfaces for web and mobile applications.',
    company: null,
    location: 'Chicago, IL',
    locationType: 'remote',
    employmentType: 'full-time',
    category: 'Design',
    experienceLevel: 'mid',
    salary: {
      min: 85000,
      max: 115000,
      currency: 'USD',
      period: 'yearly'
    },
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Wireframing', 'HTML/CSS'],
    requirements: [
      '3+ years of UI/UX design experience',
      'Strong portfolio demonstrating design process',
      'Proficiency in design tools (Figma, Adobe XD)',
      'Understanding of user-centered design principles',
      'Experience conducting user research'
    ],
    responsibilities: [
      'Design user interfaces for web and mobile',
      'Create wireframes and prototypes',
      'Conduct user research and testing',
      'Collaborate with developers and stakeholders',
      'Maintain design systems and style guides'
    ],
    benefits: ['Health Insurance', 'Remote Work', 'Creative Freedom', 'Conference Budget'],
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Data Scientist',
    description: 'Exciting opportunity for a Data Scientist to work on machine learning projects and derive insights from large datasets.',
    company: null,
    location: 'San Jose, CA',
    locationType: 'onsite',
    employmentType: 'full-time',
    category: 'Technology',
    experienceLevel: 'senior',
    salary: {
      min: 140000,
      max: 180000,
      currency: 'USD',
      period: 'yearly'
    },
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL', 'R', 'Statistics', 'Data Visualization'],
    requirements: [
      'Master\'s or PhD in Data Science or related field',
      '5+ years of experience in data science',
      'Strong machine learning knowledge',
      'Proficiency in Python and SQL',
      'Experience with big data technologies'
    ],
    responsibilities: [
      'Build and deploy machine learning models',
      'Analyze large datasets to extract insights',
      'Collaborate with engineering and product teams',
      'Present findings to stakeholders',
      'Stay updated with latest ML techniques'
    ],
    benefits: ['Health Insurance', '401k', 'Stock Options', 'Research Time', 'Conference Attendance'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Product Manager',
    description: 'Lead product development for our flagship products. You will define product strategy and work closely with engineering and design teams.',
    company: null,
    location: 'New York, NY',
    locationType: 'hybrid',
    employmentType: 'full-time',
    category: 'Other',
    experienceLevel: 'senior',
    salary: {
      min: 135000,
      max: 175000,
      currency: 'USD',
      period: 'yearly'
    },
    skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Stories', 'Roadmapping', 'Stakeholder Management'],
    requirements: [
      '5+ years of product management experience',
      'Strong technical background',
      'Excellent communication skills',
      'Experience with agile methodologies',
      'Proven track record of successful product launches'
    ],
    responsibilities: [
      'Define product vision and strategy',
      'Create and manage product roadmap',
      'Gather and prioritize requirements',
      'Work with engineering and design teams',
      'Analyze metrics and user feedback'
    ],
    benefits: ['Health Insurance', '401k', 'Equity', 'Flexible Hours', 'Professional Development'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'QA Engineer',
    description: 'Join our quality team to ensure our products meet the highest standards. You will design test strategies and automate testing processes.',
    company: null,
    location: 'Denver, CO',
    locationType: 'hybrid',
    employmentType: 'full-time',
    category: 'Technology',
    experienceLevel: 'mid',
    salary: {
      min: 80000,
      max: 110000,
      currency: 'USD',
      period: 'yearly'
    },
    skills: ['Test Automation', 'Selenium', 'Jest', 'Cypress', 'API Testing', 'Bug Tracking', 'Agile'],
    requirements: [
      '3+ years of QA experience',
      'Experience with test automation tools',
      'Strong analytical skills',
      'Knowledge of software development lifecycle',
      'Excellent attention to detail'
    ],
    responsibilities: [
      'Design and execute test plans',
      'Automate testing processes',
      'Identify and document bugs',
      'Work with developers to resolve issues',
      'Improve testing methodologies'
    ],
    benefits: ['Health Insurance', '401k', 'Flexible Schedule', 'Learning Budget'],
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  // Additional 20+ jobs for better showcase
  {
    title: 'Marketing Manager',
    description: 'Lead marketing initiatives and campaigns to drive brand awareness and customer acquisition.',
    company: null,
    location: 'Los Angeles, CA',
    locationType: 'hybrid',
    employmentType: 'full-time',
    category: 'Marketing',
    experienceLevel: 'senior',
    salary: { min: 95000, max: 130000, currency: 'USD', period: 'yearly' },
    skills: ['Digital Marketing', 'SEO', 'SEM', 'Analytics', 'Content Strategy', 'Social Media'],
    requirements: ['5+ years marketing experience', 'Leadership skills', 'Data-driven approach'],
    responsibilities: ['Develop marketing strategies', 'Manage campaigns', 'Analyze performance'],
    benefits: ['Health Insurance', 'Bonus', 'Remote Fridays'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Sales Executive',
    description: 'Drive revenue growth by building relationships with enterprise clients.',
    company: null,
    location: 'Boston, MA',
    locationType: 'onsite',
    employmentType: 'full-time',
    category: 'Sales',
    experienceLevel: 'mid',
    salary: { min: 70000, max: 120000, currency: 'USD', period: 'yearly' },
    skills: ['B2B Sales', 'CRM', 'Negotiation', 'Salesforce', 'Cold Calling'],
    requirements: ['3+ years sales experience', 'Proven track record', 'Excellent communication'],
    responsibilities: ['Generate leads', 'Close deals', 'Maintain client relationships'],
    benefits: ['Commission', 'Health Insurance', 'Car Allowance'],
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Registered Nurse',
    description: 'Provide compassionate patient care in a modern hospital setting.',
    company: null,
    location: 'Houston, TX',
    locationType: 'onsite',
    employmentType: 'full-time',
    category: 'Healthcare',
    experienceLevel: 'mid',
    salary: { min: 65000, max: 85000, currency: 'USD', period: 'yearly' },
    skills: ['Patient Care', 'Medical Procedures', 'EMR', 'Critical Care', 'IV Therapy'],
    requirements: ['RN License', '2+ years experience', 'BLS certification'],
    responsibilities: ['Patient assessment', 'Administer medications', 'Coordinate care'],
    benefits: ['Health Insurance', 'Retirement Plan', 'Shift Differential'],
    applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Financial Analyst',
    description: 'Analyze financial data and provide insights to support business decisions.',
    company: null,
    location: 'Charlotte, NC',
    locationType: 'hybrid',
    employmentType: 'full-time',
    category: 'Finance',
    experienceLevel: 'mid',
    salary: { min: 75000, max: 100000, currency: 'USD', period: 'yearly' },
    skills: ['Excel', 'Financial Modeling', 'SQL', 'Tableau', 'Forecasting'],
    requirements: ['Bachelors in Finance', '3+ years experience', 'CFA preferred'],
    responsibilities: ['Financial analysis', 'Budget planning', 'Report generation'],
    benefits: ['401k Match', 'Health Insurance', 'Bonus'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'High School Math Teacher',
    description: 'Inspire students to excel in mathematics and develop critical thinking skills.',
    company: null,
    location: 'Philadelphia, PA',
    locationType: 'onsite',
    employmentType: 'full-time',
    category: 'Other',
    experienceLevel: 'mid',
    salary: { min: 55000, max: 70000, currency: 'USD', period: 'yearly' },
    skills: ['Curriculum Development', 'Classroom Management', 'Mathematics', 'Assessment'],
    requirements: ['Teaching certificate', 'Math degree', 'Classroom experience'],
    responsibilities: ['Teach math classes', 'Grade assignments', 'Parent communication'],
    benefits: ['Pension', 'Summer Break', 'Health Insurance'],
    applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Mechanical Engineer',
    description: 'Design and develop innovative mechanical systems for cutting-edge products.',
    company: null,
    location: 'Detroit, MI',
    locationType: 'onsite',
    employmentType: 'full-time',
    category: 'Engineering',
    experienceLevel: 'mid',
    salary: { min: 80000, max: 110000, currency: 'USD', period: 'yearly' },
    skills: ['CAD', 'SolidWorks', 'FEA', 'Manufacturing', 'GD&T'],
    requirements: ['BS in Mechanical Engineering', '4+ years experience', 'CAD proficiency'],
    responsibilities: ['Product design', 'Testing', 'Documentation'],
    benefits: ['Health Insurance', '401k', 'Relocation Assistance'],
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Customer Success Manager',
    description: 'Ensure customer satisfaction and drive product adoption.',
    company: null,
    location: 'Remote',
    locationType: 'remote',
    employmentType: 'full-time',
    category: 'Customer Service',
    experienceLevel: 'mid',
    salary: { min: 70000, max: 95000, currency: 'USD', period: 'yearly' },
    skills: ['Customer Success', 'Salesforce', 'Communication', 'Problem Solving'],
    requirements: ['3+ years customer success', 'SaaS experience', 'Excellent communication'],
    responsibilities: ['Onboard customers', 'Drive adoption', 'Resolve issues'],
    benefits: ['Remote Work', 'Health Insurance', 'Stock Options'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'HR Manager',
    description: 'Lead human resources initiatives including recruitment and employee development.',
    company: null,
    location: 'Dallas, TX',
    locationType: 'hybrid',
    employmentType: 'full-time',
    category: 'HR',
    experienceLevel: 'senior',
    salary: { min: 85000, max: 115000, currency: 'USD', period: 'yearly' },
    skills: ['Recruitment', 'Employee Relations', 'HRIS', 'Compliance', 'Benefits'],
    requirements: ['5+ years HR experience', 'SHRM certification preferred', 'Leadership skills'],
    responsibilities: ['Manage recruitment', 'Employee development', 'Policy implementation'],
    benefits: ['Health Insurance', '401k', 'Professional Development'],
    applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Content Writer',
    description: 'Create engaging content for blogs, social media, and marketing materials.',
    company: null,
    location: 'Remote',
    locationType: 'remote',
    employmentType: 'contract',
    category: 'Marketing',
    experienceLevel: 'entry',
    salary: { min: 45000, max: 65000, currency: 'USD', period: 'yearly' },
    skills: ['Content Writing', 'SEO', 'WordPress', 'Research', 'Editing'],
    requirements: ['Portfolio required', '1+ year writing experience', 'SEO knowledge'],
    responsibilities: ['Write blog posts', 'Create social content', 'Edit content'],
    benefits: ['Flexible Hours', 'Remote Work', 'Growth Opportunities'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Graphic Designer',
    description: 'Design stunning visuals for digital and print media.',
    company: null,
    location: 'Miami, FL',
    locationType: 'hybrid',
    employmentType: 'full-time',
    category: 'Design',
    experienceLevel: 'mid',
    salary: { min: 60000, max: 85000, currency: 'USD', period: 'yearly' },
    skills: ['Photoshop', 'Illustrator', 'InDesign', 'Branding', 'Typography'],
    requirements: ['Portfolio required', '3+ years design experience', 'Creative thinking'],
    responsibilities: ['Create designs', 'Brand materials', 'Collaborate with team'],
    benefits: ['Creative Environment', 'Health Insurance', 'Flex Time'],
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Operations Manager',
    description: 'Oversee daily operations and optimize business processes.',
    company: null,
    location: 'Phoenix, AZ',
    locationType: 'onsite',
    employmentType: 'full-time',
    category: 'Other',
    experienceLevel: 'senior',
    salary: { min: 90000, max: 125000, currency: 'USD', period: 'yearly' },
    skills: ['Process Optimization', 'Team Management', 'Budgeting', 'Lean Six Sigma'],
    requirements: ['5+ years operations experience', 'Leadership skills', 'Process improvement'],
    responsibilities: ['Manage operations', 'Improve efficiency', 'Lead teams'],
    benefits: ['Health Insurance', 'Bonus', '401k'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Cybersecurity Analyst',
    description: 'Protect systems and data from security threats.',
    company: null,
    location: 'Washington, DC',
    locationType: 'hybrid',
    employmentType: 'full-time',
    category: 'Technology',
    experienceLevel: 'mid',
    salary: { min: 95000, max: 130000, currency: 'USD', period: 'yearly' },
    skills: ['Network Security', 'SIEM', 'Penetration Testing', 'Compliance', 'Incident Response'],
    requirements: ['Security certifications', '3+ years experience', 'Threat analysis skills'],
    responsibilities: ['Monitor security', 'Incident response', 'Security assessments'],
    benefits: ['Security Clearance Sponsorship', 'Health Insurance', 'Training Budget'],
    applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Physical Therapist',
    description: 'Help patients recover mobility and manage pain through therapeutic exercises.',
    company: null,
    location: 'Portland, OR',
    locationType: 'onsite',
    employmentType: 'full-time',
    category: 'Healthcare',
    experienceLevel: 'mid',
    salary: { min: 75000, max: 95000, currency: 'USD', period: 'yearly' },
    skills: ['Physical Therapy', 'Rehabilitation', 'Patient Care', 'Treatment Planning'],
    requirements: ['PT License', 'DPT degree', '2+ years experience'],
    responsibilities: ['Patient assessment', 'Treatment plans', 'Track progress'],
    benefits: ['Health Insurance', 'CEU Reimbursement', 'Retirement Plan'],
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Business Analyst',
    description: 'Bridge gap between business needs and technology solutions.',
    company: null,
    location: 'Atlanta, GA',
    locationType: 'hybrid',
    employmentType: 'full-time',
    category: 'Technology',
    experienceLevel: 'mid',
    salary: { min: 80000, max: 105000, currency: 'USD', period: 'yearly' },
    skills: ['Requirements Gathering', 'SQL', 'Agile', 'Documentation', 'Stakeholder Management'],
    requirements: ['3+ years BA experience', 'Technical background', 'Analytical skills'],
    responsibilities: ['Gather requirements', 'Create documentation', 'Facilitate meetings'],
    benefits: ['Health Insurance', '401k', 'Professional Development'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Legal Counsel',
    description: 'Provide legal guidance on corporate matters and contracts.',
    company: null,
    location: 'New York, NY',
    locationType: 'onsite',
    employmentType: 'full-time',
    category: 'Other',
    experienceLevel: 'senior',
    salary: { min: 130000, max: 180000, currency: 'USD', period: 'yearly' },
    skills: ['Contract Law', 'Corporate Law', 'Compliance', 'Negotiation', 'Risk Management'],
    requirements: ['JD required', 'Bar admission', '5+ years experience'],
    responsibilities: ['Draft contracts', 'Legal research', 'Risk assessment'],
    benefits: ['Health Insurance', 'Bonus', 'Bar Dues Paid'],
    applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Social Media Manager',
    description: 'Manage social media presence and create engaging content.',
    company: null,
    location: 'Remote',
    locationType: 'remote',
    employmentType: 'full-time',
    category: 'Marketing',
    experienceLevel: 'entry',
    salary: { min: 50000, max: 70000, currency: 'USD', period: 'yearly' },
    skills: ['Social Media', 'Content Creation', 'Analytics', 'Canva', 'Community Management'],
    requirements: ['2+ years social media experience', 'Creative mindset', 'Analytics skills'],
    responsibilities: ['Create content', 'Manage accounts', 'Analyze metrics'],
    benefits: ['Remote Work', 'Flexible Hours', 'Growth Opportunities'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Accountant',
    description: 'Manage financial records and ensure compliance with accounting standards.',
    company: null,
    location: 'Tampa, FL',
    locationType: 'onsite',
    employmentType: 'full-time',
    category: 'Finance',
    experienceLevel: 'mid',
    salary: { min: 65000, max: 85000, currency: 'USD', period: 'yearly' },
    skills: ['QuickBooks', 'GAAP', 'Excel', 'Tax Preparation', 'Reconciliation'],
    requirements: ['CPA preferred', '3+ years accounting', 'Attention to detail'],
    responsibilities: ['Financial reporting', 'Reconciliations', 'Tax preparation'],
    benefits: ['Health Insurance', '401k', 'CPA Exam Support'],
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Cloud Architect',
    description: 'Design and implement scalable cloud infrastructure solutions.',
    company: null,
    location: 'Seattle, WA',
    locationType: 'hybrid',
    employmentType: 'full-time',
    category: 'Technology',
    experienceLevel: 'senior',
    salary: { min: 145000, max: 190000, currency: 'USD', period: 'yearly' },
    skills: ['AWS', 'Azure', 'Kubernetes', 'Terraform', 'Microservices', 'Security'],
    requirements: ['Cloud certifications', '7+ years experience', 'Architecture experience'],
    responsibilities: ['Design cloud solutions', 'Lead migrations', 'Optimize costs'],
    benefits: ['Health Insurance', 'Stock Options', 'Certification Budget'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Medical Assistant',
    description: 'Support healthcare providers in delivering excellent patient care.',
    company: null,
    location: 'San Antonio, TX',
    locationType: 'onsite',
    employmentType: 'part-time',
    category: 'Healthcare',
    experienceLevel: 'entry',
    salary: { min: 32000, max: 42000, currency: 'USD', period: 'yearly' },
    skills: ['Patient Care', 'Vital Signs', 'EMR', 'Scheduling', 'HIPAA'],
    requirements: ['MA certification', 'CPR certified', 'Patient care skills'],
    responsibilities: ['Patient intake', 'Vital signs', 'Schedule appointments'],
    benefits: ['Health Insurance', 'Paid Training', 'Flexible Schedule'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'Supply Chain Analyst',
    description: 'Optimize supply chain operations and analyze logistics data.',
    company: null,
    location: 'Minneapolis, MN',
    locationType: 'hybrid',
    employmentType: 'full-time',
    category: 'Other',
    experienceLevel: 'mid',
    salary: { min: 70000, max: 90000, currency: 'USD', period: 'yearly' },
    skills: ['Supply Chain', 'Excel', 'SAP', 'Forecasting', 'Data Analysis'],
    requirements: ['3+ years supply chain experience', 'Analytical skills', 'ERP systems'],
    responsibilities: ['Optimize logistics', 'Analyze data', 'Vendor management'],
    benefits: ['Health Insurance', '401k', 'Hybrid Work'],
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  },
  {
    title: 'UX Researcher',
    description: 'Conduct user research to inform product design decisions.',
    company: null,
    location: 'San Francisco, CA',
    locationType: 'remote',
    employmentType: 'full-time',
    category: 'Design',
    experienceLevel: 'mid',
    salary: { min: 95000, max: 125000, currency: 'USD', period: 'yearly' },
    skills: ['User Research', 'Usability Testing', 'Interviews', 'Surveys', 'Data Analysis'],
    requirements: ['3+ years UX research', 'Research methodologies', 'Communication skills'],
    responsibilities: ['Conduct research', 'Analyze findings', 'Present insights'],
    benefits: ['Remote Work', 'Health Insurance', 'Research Budget'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    isApproved: true
  }
];

const sampleCompanies = [
  {
    name: 'TechCorp Solutions',
    description: 'Leading provider of enterprise software solutions',
    website: 'https://techcorp.example.com',
    industry: 'Technology',
    size: '1000+',
    location: {
      address: '123 Tech Street',
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    foundedYear: 2010
  },
  {
    name: 'InnovateSoft',
    description: 'Innovative startup building next-generation web applications',
    website: 'https://innovatesoft.example.com',
    industry: 'Technology',
    size: '11-50',
    location: {
      address: '456 Innovation Ave',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA'
    },
    foundedYear: 2018
  },
  {
    name: 'CloudScale Inc',
    description: 'Cloud infrastructure and DevOps services company',
    website: 'https://cloudscale.example.com',
    industry: 'Cloud Services',
    size: '201-500',
    location: {
      address: '789 Cloud Lane',
      city: 'Seattle',
      state: 'WA',
      country: 'USA'
    },
    foundedYear: 2015
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find or create a recruiter user
    let recruiter = await User.findOne({ role: 'recruiter' });
    
    if (!recruiter) {
      console.log('No recruiter found. Creating a sample recruiter...');
      recruiter = await User.create({
        name: 'John Recruiter',
        email: 'recruiter@example.com',
        password: 'Password123!',
        role: 'recruiter',
        position: 'Senior Recruiter',
        isEmailVerified: true
      });
      console.log('Sample recruiter created');
    }

    // Create companies
    console.log('Creating companies...');
    const companies = [];
    for (const companyData of sampleCompanies) {
      const existingCompany = await Company.findOne({ name: companyData.name });
      if (!existingCompany) {
        const company = await Company.create({
          ...companyData,
          owner: recruiter._id
        });
        companies.push(company);
        console.log(`Created company: ${company.name}`);
      } else {
        companies.push(existingCompany);
        console.log(`Company already exists: ${existingCompany.name}`);
      }
    }

    // Update recruiter with first company
    if (companies.length > 0 && !recruiter.company) {
      recruiter.company = companies[0]._id;
      await recruiter.save();
    }

    // Clear existing jobs (optional - comment out if you want to keep existing jobs)
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Create jobs
    console.log('Creating jobs...');
    for (let i = 0; i < sampleJobs.length; i++) {
      const jobData = sampleJobs[i];
      jobData.postedBy = recruiter._id;
      jobData.company = companies[i % companies.length]._id; // Distribute jobs across companies
      
      const job = await Job.create(jobData);
      console.log(`Created job: ${job.title}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`\nCreated:`);
    console.log(`- ${companies.length} companies`);
    console.log(`- ${sampleJobs.length} jobs`);
    console.log(`\nRecruiter credentials:`);
    console.log(`Email: recruiter@example.com`);
    console.log(`Password: Password123!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
