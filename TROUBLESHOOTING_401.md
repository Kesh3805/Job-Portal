# 401 Unauthorized Error - Troubleshooting Guide

## Error Description
```
Failed to load resource: the server responded with a status of 401 (Unauthorized)
:3000/api/jobs/my-jobs
RecruiterDashboard.jsx: Failed to fetch dashboard data: AxiosError
```

## Root Cause
The 401 error indicates that the API requests are being made **without a valid authentication token**. This happens when:

1. ✅ **User is not logged in** (most common)
2. ✅ **JWT access token has expired** (expires after 15 minutes)
3. User account has been deactivated by admin
4. Token is invalid or corrupted

## Quick Fix Solutions

### Solution 1: Log In Again (Recommended)
The simplest solution is to log in again:

1. Navigate to: http://localhost:3000/login
2. Use your credentials:
   - **Recruiter**: `recruiter@example.com` / `Password123!`
   - **Admin**: `admin@jobportal.com` / `Admin123!`
   - **Seeker**: Use any seeker account
3. After successful login, navigate to your dashboard

### Solution 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to "Application" or "Storage" tab
3. Check "Local Storage" → http://localhost:3000
4. Look for:
   - `accessToken` - Should be present
   - `refreshToken` - Should be present
5. If missing, you need to log in again

### Solution 3: Clear Storage and Re-login
If tokens are corrupted:

```javascript
// Open browser console (F12) and run:
localStorage.clear();
// Then refresh page and log in again
```

### Solution 4: Check Account Status
If you're an admin, check if the account is active:

1. Log in as admin
2. Go to "Manage Users"
3. Find the user account
4. Check if status is "Active" (green)
5. If inactive, click toggle to activate

## Technical Details

### JWT Token Lifecycle
- **Access Token**: Expires after 15 minutes
- **Refresh Token**: Expires after 7 days
- Tokens are stored in `localStorage`
- Backend automatically tries to refresh expired tokens

### How Authentication Works

```
1. User logs in → Server returns accessToken + refreshToken
2. Client stores both tokens in localStorage
3. Every API request includes: Authorization: Bearer <accessToken>
4. If accessToken expired (401):
   - Client automatically tries to refresh using refreshToken
   - If refresh succeeds: New accessToken is used
   - If refresh fails: User is redirected to login
```

### Protected Routes
The following routes require authentication:
- `/api/jobs/my-jobs` (Recruiter only)
- `/api/admin/*` (Admin only)
- `/dashboard/*` (All authenticated users)
- `/api/auth/me` (All authenticated users)

## Verification Steps

### Check if Token Exists
```javascript
// In browser console:
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));
```

### Check Token Validity
```javascript
// Decode JWT (without verification)
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const token = localStorage.getItem('accessToken');
if (token) {
  const decoded = parseJwt(token);
  console.log('Token payload:', decoded);
  console.log('Expires at:', new Date(decoded.exp * 1000));
  console.log('Is expired:', Date.now() > decoded.exp * 1000);
}
```

### Test Authentication Manually
```bash
# Get a token by logging in
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"recruiter@example.com","password":"Password123!"}'

# Use the token in subsequent requests
curl http://localhost:5000/api/jobs/my-jobs \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## Prevention Tips

### For Development
1. **Keep Backend Running**: Ensure the backend server is always running
2. **Don't Clear Storage**: Avoid clearing browser storage frequently
3. **Stay Active**: Access tokens expire after 15 minutes of inactivity
4. **Use Remember Me**: Enable "Remember Me" on login (if implemented)

### For Production
1. Increase token expiration time if needed
2. Implement "Remember Me" functionality
3. Show user-friendly session expired message
4. Auto-redirect to login with return URL

## Code Fixes (If Needed)

### If Auto-Refresh is Not Working

Check `client/src/utils/api.js`:
```javascript
// Response interceptor should handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken
        });

        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### Extend Token Expiration (Backend)

Edit `.env` file:
```
JWT_EXPIRE=30m  # Change from 15m to 30m for longer sessions
JWT_REFRESH_EXPIRE=30d  # Change from 7d to 30d
```

Then restart the backend server.

## Common Scenarios

### Scenario 1: Just Started Development
**Problem**: Opened the app, immediately got 401 errors
**Solution**: You need to log in first. Navigate to `/login`

### Scenario 2: Was Working, Then Stopped
**Problem**: Was using the app, left for 15+ minutes, came back to 401 errors
**Solution**: Your access token expired. Log in again or wait for auto-refresh

### Scenario 3: Backend Restarted
**Problem**: Restarted backend server, now getting 401 errors
**Solution**: Tokens might be invalid. Clear localStorage and log in again

### Scenario 4: Multiple Tabs
**Problem**: Logged out in one tab, other tabs show 401 errors
**Solution**: Refresh all tabs or log in again in the affected tab

## Still Having Issues?

### Debug Checklist
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000
- [ ] MongoDB is connected
- [ ] No CORS errors in console
- [ ] Proxy configuration is correct in vite.config.js
- [ ] User account exists in database
- [ ] User account is active (not deactivated)
- [ ] Email/password are correct
- [ ] JWT_SECRET is set in .env file

### Check Backend Logs
Look for these messages:
```
✅ GOOD: "Server running on port 5000"
✅ GOOD: "MongoDB Connected"
❌ BAD: "JWT_SECRET is not defined"
❌ BAD: "MongoDB connection failed"
```

### Check Browser Network Tab
1. Open DevTools (F12)
2. Go to "Network" tab
3. Look for failed requests
4. Check request headers:
   - Should include: `Authorization: Bearer <token>`
   - If missing: Token not being sent
5. Check response:
   - 401 with "Token is not valid": Token expired or invalid
   - 401 with "Not authorized": No token sent
   - 401 with "User not found": User deleted from database

## Summary

**Most Common Fix**: Simply log in again at http://localhost:3000/login

The 401 error is expected behavior when:
- User is not authenticated
- Token has expired (15 min)
- Account is deactivated

This is a security feature, not a bug! 🔒

---

**Quick Action**: Go to http://localhost:3000/login and log in with your credentials.
