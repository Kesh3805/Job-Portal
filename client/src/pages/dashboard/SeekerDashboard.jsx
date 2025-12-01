import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FiBriefcase, FiBookmark, FiUser, FiArrowRight } from 'react-icons/fi';
import api from '../../utils/api';

const SeekerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    applications: 0,
    savedJobs: 0,
    profileCompletion: 70
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's applications
      const { data: appsData } = await api.get('/applications/my-applications');
      setRecentApplications(appsData.data.slice(0, 3));
      setStats(prev => ({ ...prev, applications: appsData.data.length }));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your job search today.</p>
          </div>
          <Link to="/jobs">
            <Button>Find New Jobs</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card glass className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Applications</h3>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <FiBriefcase size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stats.applications}</div>
            <p className="text-sm text-muted-foreground">Active applications</p>
          </Card>

          <Card glass className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Saved Jobs</h3>
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <FiBookmark size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stats.savedJobs}</div>
            <p className="text-sm text-muted-foreground">Jobs saved for later</p>
          </Card>

          <Card glass className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Profile Status</h3>
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <FiUser size={20} />
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.profileCompletion}%` }}></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground font-medium">{stats.profileCompletion}% Complete</span>
              <Link to="/dashboard/profile" className="text-primary hover:underline">Complete Profile</Link>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 border-border/50">
            <h3 className="font-display text-xl font-bold text-foreground mb-6">Recent Activity</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div key={app._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <FiBriefcase />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Applied to {app.job?.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {app.job?.company?.name} • {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      app.status === 'accepted' ? 'bg-green-500/10 text-green-500' :
                      app.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
                <Link to="/dashboard/applications" className="block text-center">
                  <Button variant="outline" className="w-full">View All Applications</Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No applications yet</p>
                <Link to="/jobs">
                  <Button size="sm">Start Applying</Button>
                </Link>
              </div>
            )}
          </Card>

          <Card className="p-6 border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/jobs">
                <Button variant="outline" className="w-full justify-start">
                  <FiBriefcase className="mr-2" /> Browse All Jobs
                </Button>
              </Link>
              <Link to="/dashboard/applications">
                <Button variant="outline" className="w-full justify-start">
                  <FiBriefcase className="mr-2" /> View My Applications
                </Button>
              </Link>
              <Link to="/dashboard/saved-jobs">
                <Button variant="outline" className="w-full justify-start">
                  <FiBookmark className="mr-2" /> Saved Jobs
                </Button>
              </Link>
              <Link to="/dashboard/profile">
                <Button variant="outline" className="w-full justify-start">
                  <FiUser className="mr-2" /> Edit Profile
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
