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

// Function to generate companies
function generateCompanies() {
  const companyNames = [
    'TechCorp', 'InnovateSoft', 'CloudScale', 'DataDrive', 'CyberSafe', 'HealthPlus', 'EduTech', 'FinanceHub',
    'RetailPro', 'LogisticsMaster', 'MediaWave', 'GreenEnergy', 'AutoTech', 'BioMed', 'AeroSpace',
    'FoodieNetwork', 'TravelEase', 'RealtyGroup', 'FashionFirst', 'SportsPro', 'EntertainCo', 'MusicHub',
    'GameStudio', 'SocialConnect', 'AdTech', 'MarketGenius', 'SalesPro', 'ConsultCorp', 'LegalEagle',
    'ArchDesign', 'BuildMaster', 'ManufactureX', 'ChemLab', 'PharmaTech', 'VetCare', 'AgriGrow',
    'FisheryPro', 'MiningCorp', 'TextilePro', 'PaperMill', 'PrintMedia', 'PackagingPro', 'WasteManage',
    'WaterWorks', 'PowerGrid', 'TelecomPlus', 'BroadcastNet', 'CableCo', 'SatelliteLink', 'WirelessHub',
    'InternetPro', 'CloudNet', 'DataCenter', 'ServerFarm', 'HostingPlus', 'DomainKing', 'WebDesignPro',
    'AppDevelopers', 'SoftwareSolutions', 'CodeFactory', 'DevShop', 'ProgrammersCo', 'TechHub',
    'InnovationLab', 'StartupIncubator', 'VentureCapital', 'InvestmentGroup', 'BankingCorp', 'CreditUnion',
    'InsuranceGroup', 'ReInsurePro', 'AssetManagement', 'WealthAdvisors', 'TaxConsultants', 'AuditFirm',
    'AccountingPro', 'BookkeepingCo', 'PayrollMasters', 'HRSolutions', 'RecruitmentPro', 'TalentFinders',
    'StaffingAgency', 'OutsourceCo', 'FreelanceHub', 'GigEconomy', 'RemoteWorkPro', 'CoWorkingSpace',
    'OfficeSolutions', 'FacilityManage', 'PropertyManage', 'LandlordPro', 'TenantServices', 'HomeCare'
  ];

  const suffixes = ['Inc', 'LLC', 'Corp', 'Group', 'Solutions', 'Systems', 'Technologies', 'Enterprises', 'Partners', 'Associates'];
  const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Consulting', 'Marketing', 'Engineering', 'Other'];
  const sizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
    'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco',
    'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Portland',
    'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno',
    'Sacramento', 'Kansas City', 'Mesa', 'Atlanta', 'Omaha', 'Colorado Springs', 'Raleigh', 'Miami',
    'Virginia Beach', 'Oakland', 'Minneapolis', 'Tulsa', 'Arlington', 'Tampa', 'New Orleans'
  ];
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA', 'TX', 'FL', 'TX', 'OH', 'NC', 'CA',
    'IN', 'WA', 'CO', 'DC', 'MA', 'TX', 'TN', 'MI', 'OR', 'NV', 'TN', 'KY', 'MD', 'WI', 'NM', 'AZ', 'CA',
    'CA', 'MO', 'AZ', 'GA', 'NE', 'CO', 'NC', 'FL', 'VA', 'CA', 'MN', 'OK', 'TX', 'FL', 'LA'];

  const companies = [];
  for (let i = 0; i < 100; i++) {
    const cityIndex = i % cities.length;
    companies.push({
      name: `${companyNames[i % companyNames.length]} ${suffixes[i % suffixes.length]}`,
      description: `Professional services in ${industries[i % industries.length].toLowerCase()}`,
      website: `https://${companyNames[i % companyNames.length].toLowerCase()}.example.com`,
      industry: industries[i % industries.length],
      size: sizes[i % sizes.length],
      location: {
        address: `${100 + i} Business St`,
        city: cities[cityIndex],
        state: states[cityIndex],
        country: 'USA'
      },
      foundedYear: 2000 + (i % 24)
    });
  }
  return companies;
}

const sampleCompanies = generateCompanies();

// Function to generate jobs
function generateJobs(numJobs, companies) {
  const jobTitles = [
    'Software Engineer', 'Senior Developer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
    'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer', 'Product Manager', 'Project Manager',
    'UX Designer', 'UI Designer', 'Graphic Designer', 'Marketing Manager', 'Sales Executive',
    'Business Analyst', 'Data Analyst', 'QA Engineer', 'Test Engineer', 'Cybersecurity Analyst',
    'Network Engineer', 'System Administrator', 'Database Administrator', 'Cloud Architect', 'Solutions Architect',
    'Mobile Developer', 'iOS Developer', 'Android Developer', 'Game Developer', 'Web Developer',
    'Content Writer', 'Technical Writer', 'Copywriter', 'SEO Specialist', 'Digital Marketing Manager',
    'Social Media Manager', 'Brand Manager', 'Product Designer', 'Industrial Designer', 'Mechanical Engineer',
    'Electrical Engineer', 'Civil Engineer', 'Chemical Engineer', 'Biomedical Engineer', 'Aerospace Engineer',
    'Accountant', 'Financial Analyst', 'Investment Banker', 'Tax Consultant', 'Auditor',
    'HR Manager', 'Recruiter', 'Training Specialist', 'Compensation Analyst', 'Employee Relations Manager',
    'Operations Manager', 'Supply Chain Manager', 'Logistics Coordinator', 'Procurement Specialist', 'Warehouse Manager',
    'Customer Service Representative', 'Customer Success Manager', 'Support Engineer', 'Account Manager', 'Sales Manager',
    'Registered Nurse', 'Physical Therapist', 'Medical Assistant', 'Pharmacist', 'Laboratory Technician',
    'Teacher', 'Professor', 'Instructional Designer', 'Academic Advisor', 'School Counselor',
    'Lawyer', 'Paralegal', 'Legal Assistant', 'Compliance Officer', 'Contract Manager',
    'Chef', 'Restaurant Manager', 'Sous Chef', 'Bartender', 'Server',
    'Retail Manager', 'Store Manager', 'Sales Associate', 'Cashier', 'Merchandiser',
    'Real Estate Agent', 'Property Manager', 'Leasing Consultant', 'Appraiser', 'Mortgage Broker',
    'Construction Manager', 'Architect', 'Interior Designer', 'Carpenter', 'Electrician',
    'Journalist', 'Editor', 'Videographer', 'Photographer', 'Producer',
    'Research Scientist', 'Lab Manager', 'Clinical Research Coordinator', 'Statistician', 'Epidemiologist'
  ];

  const categories = ['Technology', 'Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'HR', 'Healthcare', 'Customer Service', 'Other'];
  const experienceLevels = ['entry', 'mid', 'senior'];
  const employmentTypes = ['full-time', 'part-time', 'contract', 'internship'];
  const locationTypes = ['remote', 'onsite', 'hybrid'];
  
  const skillSets = {
    Technology: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'Git', 'TypeScript'],
    Engineering: ['CAD', 'AutoCAD', 'SolidWorks', 'MATLAB', 'Python', 'Project Management', 'Quality Assurance', 'Testing'],
    Design: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Sketch', 'InDesign', 'UI/UX', 'Prototyping'],
    Marketing: ['SEO', 'SEM', 'Google Analytics', 'Social Media', 'Content Marketing', 'Email Marketing', 'CRM'],
    Sales: ['Salesforce', 'CRM', 'Lead Generation', 'Negotiation', 'Cold Calling', 'B2B Sales', 'Account Management'],
    Finance: ['Excel', 'Financial Modeling', 'QuickBooks', 'GAAP', 'Tax Preparation', 'Forecasting', 'Budgeting'],
    HR: ['Recruitment', 'HRIS', 'Employee Relations', 'Benefits', 'Compliance', 'Performance Management'],
    Healthcare: ['Patient Care', 'EMR', 'HIPAA', 'Medical Procedures', 'Clinical Skills', 'Healthcare Management'],
    'Customer Service': ['Customer Support', 'Communication', 'Problem Solving', 'CRM', 'Conflict Resolution'],
    Other: ['Communication', 'Leadership', 'Project Management', 'Problem Solving', 'Team Collaboration']
  };

  const cities = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA',
    'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
    'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC', 'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA',
    'Denver, CO', 'Washington, DC', 'Boston, MA', 'Nashville, TN', 'Detroit, MI', 'Portland, OR',
    'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD', 'Milwaukee, WI', 'Atlanta, GA',
    'Miami, FL', 'Remote', 'Tampa, FL', 'Minneapolis, MN', 'Orlando, FL', 'Sacramento, CA', 'Kansas City, MO'
  ];

  const jobs = [];
  
  for (let i = 0; i < numJobs; i++) {
    const title = jobTitles[i % jobTitles.length];
    const category = categories[i % categories.length];
    const experienceLevel = experienceLevels[i % experienceLevels.length];
    const employmentType = employmentTypes[i % employmentTypes.length];
    const locationType = locationTypes[i % locationTypes.length];
    const location = cities[i % cities.length];
    
    const baseSalary = experienceLevel === 'entry' ? 50000 : experienceLevel === 'mid' ? 80000 : 120000;
    const salaryVariation = Math.floor(Math.random() * 20000);
    
    const skills = skillSets[category] || skillSets.Other;
    const selectedSkills = skills.slice(0, 5 + (i % 3));
    
    jobs.push({
      title: `${title} ${i > 99 ? `(${Math.floor(i / 100)})` : ''}`,
      description: `We are seeking a talented ${title} to join our growing team. This is an excellent opportunity to work on exciting projects and advance your career.`,
      company: null, // Will be set during seeding
      location: location,
      locationType: locationType,
      employmentType: employmentType,
      category: category,
      experienceLevel: experienceLevel,
      salary: {
        min: baseSalary + salaryVariation,
        max: baseSalary + salaryVariation + 30000 + (Math.floor(Math.random() * 20000)),
        currency: 'USD',
        period: employmentType === 'part-time' ? 'hourly' : 'yearly'
      },
      skills: selectedSkills,
      requirements: [
        `${experienceLevel === 'entry' ? '0-2' : experienceLevel === 'mid' ? '3-5' : '5+'} years of relevant experience`,
        `Strong knowledge of ${selectedSkills[0]} and ${selectedSkills[1]}`,
        `Excellent communication and teamwork skills`,
        `Bachelor's degree in relevant field or equivalent experience`
      ],
      responsibilities: [
        `Develop and maintain ${category.toLowerCase()} solutions`,
        `Collaborate with cross-functional teams`,
        `Participate in code/design reviews`,
        `Contribute to project planning and execution`,
        `Stay updated with industry trends and best practices`
      ],
      benefits: ['Health Insurance', '401k', employmentType === 'full-time' ? 'Paid Time Off' : 'Flexible Hours', 'Professional Development'],
      applicationDeadline: new Date(Date.now() + (30 + (i % 60)) * 24 * 60 * 60 * 1000),
      status: 'active',
      isApproved: true
    });
  }
  
  return jobs;
}

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

    // Generate 1200 jobs
    console.log('Generating jobs...');
    const generatedJobs = generateJobs(1200, companies);
    
    // Add sample jobs to the beginning
    const allJobs = [...sampleJobs, ...generatedJobs];
    
    // Create jobs in batches for better performance
    console.log('Creating jobs in database...');
    const batchSize = 100;
    let createdCount = 0;
    
    for (let i = 0; i < allJobs.length; i += batchSize) {
      const batch = allJobs.slice(i, i + batchSize);
      const jobsToCreate = batch.map(jobData => ({
        ...jobData,
        postedBy: recruiter._id,
        company: companies[Math.floor(Math.random() * companies.length)]._id
      }));
      
      await Job.insertMany(jobsToCreate);
      createdCount += jobsToCreate.length;
      console.log(`Created ${createdCount}/${allJobs.length} jobs...`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`\nCreated:`);
    console.log(`- ${companies.length} companies`);
    console.log(`- ${createdCount} jobs`);
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
