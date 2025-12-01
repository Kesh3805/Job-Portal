import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FiBriefcase, FiUsers, FiEye, FiPlus } from 'react-icons/fi';
import api from '../../utils/api';

const RecruiterDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch recruiter's jobs
      const { data: jobsData } = await api.get('/jobs/my-jobs');
      const jobs = jobsData.data || [];
      setRecentJobs(jobs.slice(0, 5));
      
      const activeJobs = jobs.filter(job => job.status === 'active').length;
      setStats({
        totalJobs: jobs.length,
        activeJobs: activeJobs,
        totalApplications: jobs.reduce((sum, job) => sum + (job.applicationsCount || 0), 0),
        pendingApplications: 0
      });
      
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
            <h1 className="font-display text-3xl font-bold text-foreground">Recruiter Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}! Manage your job postings and applications.</p>
          </div>
          <Link to="/dashboard/post-job">
            <Button>
              <FiPlus className="mr-2" /> Post New Job
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card glass className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Total Jobs</h3>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <FiBriefcase size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stats.totalJobs}</div>
            <p className="text-sm text-muted-foreground">All job postings</p>
          </Card>

          <Card glass className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Active Jobs</h3>
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <FiBriefcase size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stats.activeJobs}</div>
            <p className="text-sm text-muted-foreground">Currently open</p>
          </Card>

          <Card glass className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Applications</h3>
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <FiUsers size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stats.totalApplications}</div>
            <p className="text-sm text-muted-foreground">Total received</p>
          </Card>

          <Card glass className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Views</h3>
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                <FiEye size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">-</div>
            <p className="text-sm text-muted-foreground">Job views</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-6 border-border/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold text-foreground">My Job Postings</h3>
              <Link to="/dashboard/my-jobs">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job._id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors border border-border/50">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold shrink-0">
                        {job.title?.charAt(0) || 'J'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {job.location} • {job.jobType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Link to={`/dashboard/jobs/${job._id}/applications`} className="text-right hover:text-primary transition-colors">
                        <p className="text-sm font-medium text-foreground hover:text-primary">{job.applicationsCount || 0} Applications</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          job.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                        }`}>
                          {job.isApproved ? (job.status === 'active' ? 'Active' : 'Closed') : 'Pending Approval'}
                        </span>
                      </Link>
                      <Link to={`/jobs/${job._id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <FiBriefcase size={32} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">No job postings yet</p>
                <Link to="/dashboard/post-job">
                  <Button>Post Your First Job</Button>
                </Link>
              </div>
            )}
          </Card>

          <Card className="p-6 border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/dashboard/post-job">
                <Button className="w-full justify-start">
                  <FiPlus className="mr-2" /> Post New Job
                </Button>
              </Link>
              <Link to="/dashboard/my-jobs">
                <Button variant="outline" className="w-full justify-start">
                  <FiBriefcase className="mr-2" /> Manage Jobs
                </Button>
              </Link>
              <Link to="/dashboard/company">
                <Button variant="outline" className="w-full justify-start">
                  <FiUsers className="mr-2" /> Company Profile
                </Button>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-background/50 rounded-lg border border-border/50">
              <h4 className="font-semibold text-foreground mb-2">💡 Tip</h4>
              <p className="text-sm text-muted-foreground">
                Complete your company profile to attract more qualified candidates to your job postings.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
