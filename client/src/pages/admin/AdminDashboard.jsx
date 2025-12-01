import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FiUsers, FiBriefcase, FiActivity, FiSettings, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import api from '../../utils/api';

const AdminDashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    pendingJobs: 0,
    activeUsers: 0
  });
  const [pendingJobs, setPendingJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, jobsRes, analyticsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/jobs'),
        api.get('/admin/analytics').catch(() => ({ data: {} }))
      ]);

      const allUsers = usersRes.data.data || [];
      const allJobs = jobsRes.data.data || [];
      
      setUsers(allUsers.slice(0, 5));
      setPendingJobs(allJobs.filter(job => !job.isApproved).slice(0, 5));
      
      setStats({
        totalUsers: allUsers.length,
        totalJobs: allJobs.length,
        pendingJobs: allJobs.filter(job => !job.isApproved).length,
        activeUsers: allUsers.filter(u => u.isActive).length
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      setLoading(false);
    }
  };

  const handleApproveJob = async (jobId) => {
    try {
      await api.put(`/admin/jobs/${jobId}/approve`);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to approve job:', error);
    }
  };

  const handleToggleUserActive = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-active`);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage platform users, jobs, and settings</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/analytics">
              <Button variant="outline">
                <FiActivity className="mr-2" /> Analytics
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="outline">
                <FiUsers className="mr-2" /> Users
              </Button>
            </Link>
            <Link to="/admin/jobs">
              <Button variant="outline">
                <FiBriefcase className="mr-2" /> Jobs
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button variant="outline">
                <FiSettings className="mr-2" /> Settings
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card glass className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Total Users</h3>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <FiUsers size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stats.totalUsers}</div>
            <p className="text-sm text-muted-foreground">{stats.activeUsers} active</p>
          </Card>

          <Card glass className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Total Jobs</h3>
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <FiBriefcase size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stats.totalJobs}</div>
            <p className="text-sm text-muted-foreground">{stats.pendingJobs} pending approval</p>
          </Card>

          <Card glass className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Pending Reviews</h3>
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                <FiActivity size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stats.pendingJobs}</div>
            <p className="text-sm text-muted-foreground">Jobs awaiting approval</p>
          </Card>

          <Card glass className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">System Status</h3>
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <FiSettings size={20} />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-500 mb-1">Healthy</div>
            <p className="text-sm text-muted-foreground">All systems operational</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card glass className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-foreground">Pending Job Approvals</h3>
              <Link to="/admin/jobs?isApproved=false">
                <span className="text-sm text-primary hover:underline">{stats.pendingJobs} pending</span>
              </Link>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : pendingJobs.length > 0 ? (
              <div className="space-y-4">
                {pendingJobs.map((job) => (
                  <div key={job._id} className="p-4 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {job.company?.name} • {job.location}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500">
                        Pending
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        onClick={() => handleApproveJob(job._id)}
                        className="flex-1"
                      >
                        <FiCheckCircle className="mr-1" /> Approve
                      </Button>
                      <Link to={`/jobs/${job._id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending job approvals</p>
              </div>
            )}
          </Card>

          <Card glass className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-foreground">Recent Users</h3>
              <Link to="/admin/users">
                <span className="text-sm text-primary hover:underline">{stats.totalUsers} total</span>
              </Link>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.role === 'admin' ? 'bg-red-500/10 text-red-500' :
                        user.role === 'recruiter' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {user.role}
                      </span>
                      <Button
                        size="sm"
                        variant={user.isActive ? "outline" : "default"}
                        onClick={() => handleToggleUserActive(user._id)}
                      >
                        {user.isActive ? <FiXCircle size={14} /> : <FiCheckCircle size={14} />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
