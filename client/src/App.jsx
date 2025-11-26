import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './store/store';
import { getMe } from './features/auth/authSlice';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Jobs from './pages/jobs/Jobs';
import JobDetails from './pages/jobs/JobDetails';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/dashboard/Profile';
import Applications from './pages/dashboard/Applications';
import SavedJobs from './pages/dashboard/SavedJobs';
import MyJobs from './pages/dashboard/recruiter/MyJobs';
import PostJob from './pages/dashboard/recruiter/PostJob';
import CompanyProfile from './pages/dashboard/recruiter/CompanyProfile';
import Messages from './pages/dashboard/Messages';
import Notifications from './pages/dashboard/Notifications';
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// App Content Component
function AppContent() {
  const dispatch = useDispatch();
  const { initialized, loading } = useSelector((state) => state.auth);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (token && !initialized) {
      dispatch(getMe());
    } else if (!token && !initialized) {
      dispatch({ type: 'auth/setInitialized' });
    }
  }, [dispatch, token, initialized]);

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/applications"
              element={
                <ProtectedRoute allowedRoles={['seeker']}>
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/saved-jobs"
              element={
                <ProtectedRoute allowedRoles={['seeker']}>
                  <SavedJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/my-jobs"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <MyJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/post-job"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/company"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <CompanyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
