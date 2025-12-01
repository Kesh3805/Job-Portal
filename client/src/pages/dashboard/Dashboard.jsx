import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import SeekerDashboard from './SeekerDashboard';
import RecruiterDashboard from './RecruiterDashboard';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Route to role-specific dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user?.role === 'recruiter') {
    return <RecruiterDashboard />;
  }

  // Default to seeker dashboard
  return <SeekerDashboard />;
};

export default Dashboard;
