# 🚀 MERN Stack Job Portal

A full-featured job portal built with MongoDB, Express.js, React.js, and Node.js (MERN Stack). This application provides comprehensive functionality for job seekers, recruiters, and administrators.

## ✨ Features

### 👥 User Roles

#### Job Seeker
- ✅ Create and update profile
- ✅ Upload resume and portfolio
- ✅ Search and apply for jobs with advanced filters
- ✅ Save/favorite jobs
- ✅ Track application status
- ✅ Real-time notifications
- ✅ Chat with employers
- ✅ AI-powered job recommendations
- ✅ Resume parser for quick profile setup

#### Employer/Recruiter
- ✅ Create company profile
- ✅ Post, edit, and delete job listings
- ✅ Manage applicants (view resumes, shortlist, reject)
- ✅ Schedule interviews with notifications
- ✅ View job analytics (views, applications, conversion rates)
- ✅ Real-time messaging with candidates
- ✅ Application tracking dashboard

#### Admin
- ✅ Manage all users and companies
- ✅ Approve or reject job postings
- ✅ Platform analytics dashboard
- ✅ User management (activate/deactivate)

### 🔐 Authentication & Security
- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt
- Email verification
- Password reset functionality
- Role-based access control

### 💬 Real-time Features
- Socket.io powered messaging system
- Real-time notifications
- Typing indicators
- Message read receipts
- Online user status

### 📊 Advanced Features
- AI-based job matching using TF-IDF algorithm
- Resume parser with NLP
- Job analytics and statistics
- Interview scheduler with calendar integration
- Email notifications (Nodemailer)
- File upload handling (Multer + optional Cloudinary)

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File upload
- **Natural** - NLP for job matching
- **Compromise** - Resume parsing

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icons
- **React Toastify** - Notifications
- **Recharts** - Data visualization
- **Socket.io Client** - Real-time features

## 📁 Project Structure

```
Job Portal/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── email.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   ├── userController.js
│   │   ├── companyController.js
│   │   ├── messageController.js
│   │   ├── notificationController.js
│   │   ├── interviewController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── Company.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   └── Interview.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── userRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── adminRoutes.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── utils/
│   │   ├── jwtUtils.js
│   │   ├── jobMatcher.js
│   │   └── resumeParser.js
│   ├── uploads/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── jobs/
│   │   │       └── JobCard.jsx
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   └── authSlice.js
│   │   │   └── jobs/
│   │   │       └── jobSlice.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   ├── jobs/
│   │   │   │   ├── Jobs.jsx
│   │   │   │   └── JobDetails.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Applications.jsx
│   │   │   │   ├── SavedJobs.jsx
│   │   │   │   ├── Messages.jsx
│   │   │   │   ├── Notifications.jsx
│   │   │   │   └── recruiter/
│   │   │   │       ├── MyJobs.jsx
│   │   │   │       ├── PostJob.jsx
│   │   │   │       └── CompanyProfile.jsx
│   │   │   └── admin/
│   │   │       └── AdminDashboard.jsx
│   │   ├── store/
│   │   │   └── store.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd "Job Portal"
```

2. **Setup Backend**
```bash
# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Update .env with your configurations
# - MongoDB URI
# - JWT secrets
# - Email credentials (Gmail/SMTP)
# - Cloudinary credentials (optional)
```

3. **Setup Frontend**
```bash
cd client
npm install
```

### Running the Application

1. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

2. **Start Backend Server**
```bash
# From root directory
npm run dev
# Server runs on http://localhost:5000
```

3. **Start Frontend Development Server**
```bash
# From client directory
cd client
npm run dev
# Client runs on http://localhost:3000
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/job-portal

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=JobPortal <noreply@jobportal.com>

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Job Endpoints
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Recruiter)
- `PUT /api/jobs/:id` - Update job (Recruiter)
- `DELETE /api/jobs/:id` - Delete job (Recruiter)
- `GET /api/jobs/recommended` - Get recommended jobs (Seeker)
- `GET /api/jobs/:id/stats` - Get job statistics (Recruiter)

### Application Endpoints
- `POST /api/applications` - Apply for job (Seeker)
- `GET /api/applications` - Get applications (Recruiter)
- `GET /api/applications/my-applications` - Get user applications (Seeker)
- `PUT /api/applications/:id/status` - Update application status (Recruiter)
- `PUT /api/applications/:id/withdraw` - Withdraw application (Seeker)

### User Endpoints
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/avatar` - Upload avatar
- `PUT /api/users/resume` - Upload resume (Seeker)
- `PUT /api/users/saved-jobs/:jobId` - Save/unsave job (Seeker)
- `GET /api/users/dashboard-stats` - Get dashboard stats

### Company Endpoints
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company details
- `POST /api/companies` - Create company (Recruiter)
- `PUT /api/companies/:id` - Update company (Recruiter)
- `PUT /api/companies/:id/logo` - Upload company logo (Recruiter)

### Message Endpoints
- `POST /api/messages/conversation` - Create/get conversation
- `GET /api/messages/conversations` - Get all conversations
- `POST /api/messages` - Send message
- `GET /api/messages/:conversationId` - Get messages
- `PUT /api/messages/:conversationId/read` - Mark as read

### Notification Endpoints
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Interview Endpoints
- `POST /api/interviews` - Schedule interview (Recruiter)
- `GET /api/interviews` - Get interviews
- `PUT /api/interviews/:id` - Update interview (Recruiter)
- `PUT /api/interviews/:id/feedback` - Add feedback (Recruiter)

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/toggle-active` - Toggle user status
- `GET /api/admin/jobs` - Get all jobs
- `PUT /api/admin/jobs/:id/approve` - Approve/reject job
- `GET /api/admin/analytics` - Get platform analytics

## 🎨 Features to Implement Further

While the core structure is complete, you can enhance these areas:

1. **Advanced Search & Filters**
   - Location-based search with maps
   - Salary range filters
   - Company size filters
   - Advanced skill matching

2. **Enhanced Job Matching**
   - Machine learning recommendations
   - Collaborative filtering
   - Skill gap analysis

3. **Video Interviews**
   - WebRTC integration
   - Video call scheduling
   - Recording capabilities

4. **Payment Integration**
   - Premium job posts
   - Featured listings
   - Stripe/PayPal integration

5. **Analytics Dashboard**
   - Advanced charts with Recharts
   - Export functionality
   - Custom date ranges

6. **Mobile App**
   - React Native version
   - Push notifications

## 🧪 Testing

```bash
# Backend tests
npm test

# Frontend tests
cd client
npm test
```

## 📦 Deployment

### Backend (Heroku/Railway/Render)
```bash
# Build
npm install --production

# Start
npm start
```

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist folder
```

### Database (MongoDB Atlas)
- Create cluster on MongoDB Atlas
- Update MONGODB_URI in .env
- Whitelist IP addresses

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built with ❤️ using MERN Stack

## 📧 Support

For support, email support@jobportal.com or open an issue in the repository.

---

**Note**: Remember to keep your `.env` file secure and never commit it to version control!
