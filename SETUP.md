# 🚀 Quick Start Guide - Job Portal

## Step-by-Step Setup Instructions

### 1️⃣ Install Dependencies

**Backend:**
```powershell
cd "C:\Users\user\Desktop\Job Portal"
npm install
```

**Frontend:**
```powershell
cd "C:\Users\user\Desktop\Job Portal\client"
npm install
```

### 2️⃣ Setup Environment Variables

Create a `.env` file in the root directory:
```powershell
copy .env.example .env
```

Edit `.env` and add your configurations:
- MongoDB URI (local or Atlas)
- JWT secrets (generate random strings)
- Email credentials for Gmail/SMTP
- Optional: Cloudinary credentials

### 3️⃣ Start MongoDB

**Option A: Local MongoDB**
```powershell
mongod
```

**Option B: MongoDB Atlas**
- Create free cluster at mongodb.com/atlas
- Get connection string
- Update MONGODB_URI in .env

### 4️⃣ Run the Application

**Terminal 1 - Backend:**
```powershell
cd "C:\Users\user\Desktop\Job Portal"
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```powershell
cd "C:\Users\user\Desktop\Job Portal\client"
npm run dev
```
Frontend runs on: http://localhost:3000

### 5️⃣ Create Your First Admin User

**Option 1: Using Register Page**
1. Go to http://localhost:3000/register
2. Register as any role
3. Manually update role to 'admin' in MongoDB

**Option 2: MongoDB Compass/Shell**
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### 6️⃣ Test the Application

1. **Job Seeker Flow:**
   - Register as job seeker
   - Browse jobs
   - Apply for jobs
   - Track applications

2. **Recruiter Flow:**
   - Register as recruiter
   - Create company profile
   - Post jobs
   - Review applications

3. **Admin Flow:**
   - Login as admin
   - Approve jobs
   - Manage users
   - View analytics

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Google Account → Security → App Passwords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
3. Update .env:
   ```
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

## 🔧 Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution:**
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- For Atlas: Whitelist your IP address

### Issue: Port Already in Use
**Solution:**
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
```

### Issue: Module Not Found
**Solution:**
```powershell
# Delete node_modules and reinstall
rm -r node_modules
npm install
```

### Issue: CORS Error
**Solution:**
- Check FRONTEND_URL in backend .env
- Verify proxy in client/vite.config.js

## 📱 Default Test Accounts

Create these for testing:

**Admin:**
- Email: admin@jobportal.com
- Password: admin123
- Role: admin

**Recruiter:**
- Email: recruiter@company.com
- Password: recruiter123
- Role: recruiter

**Job Seeker:**
- Email: seeker@example.com
- Password: seeker123
- Role: seeker

## 🎯 Next Steps

1. ✅ Complete profile setup
2. ✅ Upload resume (seekers)
3. ✅ Create company profile (recruiters)
4. ✅ Post your first job
5. ✅ Apply for jobs
6. ✅ Test messaging system
7. ✅ Check notifications

## 🛠️ Development Tools

**Recommended:**
- MongoDB Compass (GUI for MongoDB)
- Postman (API testing)
- VS Code Extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - MongoDB for VS Code

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Socket.io Documentation](https://socket.io/)

## 🎉 Success!

Your Job Portal is now running! Open http://localhost:3000 in your browser.

---

**Need Help?** Check the main README.md for detailed documentation.
