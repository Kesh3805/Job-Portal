# Quick Reference Guide - Admin Features

## 🚀 How to Access Admin Features

### Login as Admin
1. Navigate to http://localhost:5173/login
2. Use credentials:
   - **Email**: admin@jobportal.com
   - **Password**: Admin123!
3. You'll be redirected to `/admin/dashboard`

---

## 📋 Admin Dashboard Overview

### Main Dashboard (`/admin/dashboard`)
**Statistics Cards:**
- Total Users (with active count)
- Total Jobs (with pending approval count)
- Pending Reviews (jobs awaiting approval)
- System Status (health check)

**Quick Actions:**
- "Manage Users" button → `/admin/users`
- "Manage Jobs" button → `/admin/jobs`

**Widgets:**
- **Pending Job Approvals**: First 5 pending jobs with quick approve button
- **Recent Users**: Last 5 users with toggle active/inactive button

---

## 👥 User Management (`/admin/users`)

### Features Available:
1. **Search**: Type name or email to search
2. **Filter by Role**: 
   - All
   - Admin
   - Recruiter
   - Seeker
3. **Filter by Status**:
   - All
   - Active
   - Inactive
4. **Clear Filters**: Reset all filters at once

### Actions on Each User:
| Icon | Action | Description |
|------|--------|-------------|
| 🟢 Toggle | Activate/Deactivate | Enable or disable user account |
| ✏️ Edit | View Details | See user profile and statistics |
| 🗑️ Delete | Delete User | Remove user and all related data |

### Important Notes:
- Cannot delete yourself (admin account)
- Deleting a recruiter removes their company, jobs, and all applications
- Deleting a seeker removes their applications
- Confirmation required before deletion

---

## 💼 Job Management (`/admin/jobs`)

### Features Available:
1. **Search**: Type job title to search
2. **Filter by Approval**:
   - All
   - Approved (live jobs)
   - Pending (awaiting approval)
3. **Filter by Status**:
   - All Status
   - Active (accepting applications)
   - Closed (no longer accepting)
4. **Clear Filters**: Reset all filters

### Actions on Each Job:
| Button | Action | When Available |
|--------|--------|---------------|
| 👁️ View Job | Open job details | Always |
| ✅ Approve | Approve job posting | Only for pending jobs |
| ❌ Reject | Reject job posting | Only for pending jobs |
| 🗑️ Delete | Remove job permanently | Always |

### Job Information Displayed:
- Company logo and name
- Job title and location
- Employment type (Full-time, Part-time, etc.)
- Posted by (recruiter name)
- Posted date
- View count
- Approval status badge (Approved/Pending)
- Job status badge (Active/Closed)

### Important Notes:
- Deleting a job removes all applications
- Confirmation required before deletion
- Approved jobs appear in public job listings
- Pending jobs are only visible to recruiter and admin

---

## 🎯 Common Tasks

### Task 1: Approve a Pending Job
```
1. Go to Admin Dashboard
2. See pending count in statistics or widget
3. Click "Manage Jobs" or pending count
4. (Optional) Filter by "Pending" approval
5. Review job details
6. Click "Approve" button
7. Job is now live and visible to all users
```

### Task 2: Deactivate a User Account
```
1. Go to Admin Dashboard
2. Click "Manage Users"
3. Search or find the user
4. Click the toggle icon (turns from green to orange)
5. User cannot log in anymore
6. Click again to reactivate
```

### Task 3: Delete a Problematic Job
```
1. Go to Admin Jobs page (/admin/jobs)
2. Search for the job
3. Click "Delete" button
4. Confirm deletion
5. Job and all applications are removed
```

### Task 4: View User Statistics
```
1. Go to Admin Users page
2. Click the "Edit" icon (✏️) on any user
3. See their:
   - Profile information
   - Applications count (for seekers)
   - Jobs posted count (for recruiters)
   - Account status
   - Join date
```

### Task 5: Change User Role
```
1. Go to Admin Users page
2. Find the user
3. Click "Edit" icon
4. Change role dropdown (Admin/Recruiter/Seeker)
5. Save changes
```

---

## 🔐 Security Features

### Rate Limiting
- Global: 500 requests per 15 minutes
- Auth endpoints: 100 requests per 15 minutes
- /me endpoint excluded from rate limiting

### Account Lockout
- 5 failed login attempts → Account locked for 1 hour
- Admin can unlock via toggle active/inactive

### Role-Based Access
- Admin routes protected with `allowedRoles={['admin']}`
- Unauthorized access redirects to dashboard
- JWT token required for all actions

---

## 📊 API Endpoints Reference

### User Management
```
GET    /admin/users                    - List all users
GET    /admin/users/:id                - Get user details
PUT    /admin/users/:id/toggle-active  - Toggle user active status
PUT    /admin/users/:id/role           - Update user role
DELETE /admin/users/:id                - Delete user
```

### Job Management
```
GET    /admin/jobs                     - List all jobs (supports filters)
PUT    /admin/jobs/:id/approve         - Approve/reject job
DELETE /admin/jobs/:id                 - Delete job
```

### Analytics
```
GET    /admin/analytics                - Get platform statistics
```

---

## 🎨 Visual Indicators

### Role Badges
- 🔴 **Admin**: Red badge
- 🔵 **Recruiter**: Blue badge
- 🟢 **Seeker**: Green badge

### Status Badges
- 🟢 **Active**: Green badge
- 🟠 **Inactive**: Orange badge

### Approval Status
- 🟢 **Approved**: Green badge
- 🟡 **Pending**: Yellow badge

### Job Status
- 🔵 **Active**: Blue badge
- ⚫ **Closed**: Gray badge

---

## 🐛 Troubleshooting

### Issue: Can't see admin routes
**Solution**: Make sure you're logged in with admin credentials and have the admin role in database.

### Issue: Actions not working
**Solution**: Check browser console for errors. Ensure backend server is running on port 5000.

### Issue: Users/Jobs not loading
**Solution**: 
1. Check MongoDB connection
2. Verify backend is running
3. Check network tab in browser DevTools
4. Ensure CORS is configured correctly

### Issue: Rate limit errors (429)
**Solution**: Wait 15 minutes or adjust rate limits in backend configuration.

### Issue: Can't delete user
**Solution**: 
- Cannot delete yourself (logged-in admin)
- Check if you have admin role
- Verify user exists in database

---

## 📱 Mobile Responsiveness

All admin pages are fully responsive:
- Tables adapt to smaller screens
- Action buttons remain accessible
- Filters stack vertically on mobile
- Cards resize appropriately
- Touch-friendly interface

---

## 💡 Tips & Best Practices

1. **Regular Monitoring**: Check pending jobs daily
2. **User Verification**: Verify recruiters before approving their first job
3. **Clean Up**: Regularly review and remove closed jobs
4. **Security**: Monitor failed login attempts
5. **Backup**: Keep regular database backups before bulk deletions
6. **Communication**: Consider adding email notifications for approvals/rejections

---

## 🔄 Workflow Recommendations

### Daily Tasks:
- [ ] Review pending job approvals
- [ ] Check new user registrations
- [ ] Monitor system health

### Weekly Tasks:
- [ ] Review user activity
- [ ] Clean up inactive accounts
- [ ] Analyze job posting trends

### Monthly Tasks:
- [ ] Export analytics data
- [ ] Review security logs
- [ ] Update platform policies

---

## 📞 Need Help?

1. Check the browser console (F12) for error messages
2. Review the backend logs
3. Verify MongoDB connection
4. Check API response in Network tab
5. Ensure JWT token is valid

---

**Pro Tip**: Use the search and filter features extensively to quickly find what you need. The filters work together, so you can search for "john" + filter by "recruiter" + filter by "inactive" to find all inactive recruiters named John.
