import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FiTrendingUp, FiUsers, FiBriefcase, FiActivity, FiDownload, FiCalendar } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    userStats: {
      total: 0,
      seekers: 0,
      recruiters: 0,
      activeToday: 0,
      newThisMonth: 0,
      growthRate: 0
    },
    jobStats: {
      total: 0,
      active: 0,
      pending: 0,
      closed: 0,
      avgApplications: 0,
      topCategories: []
    },
    applicationStats: {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      conversionRate: 0
    },
    companyStats: {
      total: 0,
      verified: 0,
      pending: 0
    }
  });
  const [timeRange, setTimeRange] = useState('month'); // week, month, year, all
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/analytics', {
        params: { range: timeRange }
      });
      setAnalytics(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics');
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      toast.info('Generating report...');
      const { data } = await api.get('/admin/reports/export', {
        params: { range: timeRange },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-report-${timeRange}-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Detailed platform insights and statistics</p>
          </div>
          <div className="flex gap-3">
            <select
              className="px-4 py-2 bg-background border border-border rounded-lg text-foreground"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
            <Button onClick={exportReport}>
              <FiDownload className="mr-2" /> Export Report
            </Button>
            <Link to="/admin/dashboard">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
        </div>

        {/* User Analytics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <FiUsers className="text-primary" /> User Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Users</span>
                <FiUsers className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.userStats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">
                +{analytics.userStats.growthRate}% growth
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Job Seekers</span>
                <FiUsers className="text-green-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.userStats.seekers}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {((analytics.userStats.seekers / analytics.userStats.total) * 100).toFixed(1)}% of total
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Recruiters</span>
                <FiUsers className="text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.userStats.recruiters}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {((analytics.userStats.recruiters / analytics.userStats.total) * 100).toFixed(1)}% of total
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Today</span>
                <FiActivity className="text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.userStats.activeToday}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {((analytics.userStats.activeToday / analytics.userStats.total) * 100).toFixed(1)}% engagement
              </p>
            </Card>
          </div>
        </div>

        {/* Job Analytics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <FiBriefcase className="text-primary" /> Job Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Jobs</span>
                <FiBriefcase className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.jobStats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">
                All job postings
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Jobs</span>
                <FiBriefcase className="text-green-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.jobStats.active}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Currently accepting applications
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Pending Approval</span>
                <FiBriefcase className="text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.jobStats.pending}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting review
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg Applications</span>
                <FiTrendingUp className="text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.jobStats.avgApplications}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Per job posting
              </p>
            </Card>
          </div>
        </div>

        {/* Application Analytics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <FiActivity className="text-primary" /> Application Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Applications</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.applicationStats.total}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <p className="text-3xl font-bold text-orange-500">{analytics.applicationStats.pending}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Accepted</span>
              </div>
              <p className="text-3xl font-bold text-green-500">{analytics.applicationStats.accepted}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Rejected</span>
              </div>
              <p className="text-3xl font-bold text-red-500">{analytics.applicationStats.rejected}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Success Rate</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.applicationStats.conversionRate}%</p>
            </Card>
          </div>
        </div>

        {/* Top Job Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Top Job Categories</h2>
          <Card className="p-6">
            {analytics.jobStats.topCategories && analytics.jobStats.topCategories.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Distribution by Category</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analytics.jobStats.topCategories}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Pie Chart */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Category Breakdown</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={analytics.jobStats.topCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.jobStats.topCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No category data available</p>
            )}
          </Card>
        </div>

        {/* Application Status Breakdown */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Application Status Breakdown</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart for Application Status */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Status Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Pending', value: analytics.applicationStats.pending },
                        { name: 'Accepted', value: analytics.applicationStats.accepted },
                        { name: 'Rejected', value: analytics.applicationStats.rejected }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#f59e0b" />
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Bar Chart for Application Stats */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Application Metrics</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: 'Pending', count: analytics.applicationStats.pending, fill: '#f59e0b' },
                    { name: 'Accepted', count: analytics.applicationStats.accepted, fill: '#10b981' },
                    { name: 'Rejected', count: analytics.applicationStats.rejected, fill: '#ef4444' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]}>
                      {[
                        { name: 'Pending', count: analytics.applicationStats.pending, fill: '#f59e0b' },
                        { name: 'Accepted', count: analytics.applicationStats.accepted, fill: '#10b981' },
                        { name: 'Rejected', count: analytics.applicationStats.rejected, fill: '#ef4444' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* Company Analytics */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Company Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Companies</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics.companyStats.total}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Verified</span>
              </div>
              <p className="text-3xl font-bold text-green-500">{analytics.companyStats.verified}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Pending Verification</span>
              </div>
              <p className="text-3xl font-bold text-orange-500">{analytics.companyStats.pending}</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
