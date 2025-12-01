import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FiBriefcase, FiCheckCircle, FiXCircle, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    isApproved: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/jobs', { params: filters });
      setJobs(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs');
      setLoading(false);
    }
  };

  const handleApproveJob = async (jobId) => {
    try {
      await api.put(`/admin/jobs/${jobId}/approve`, { isApproved: true });
      toast.success('Job approved successfully');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to approve job');
    }
  };

  const handleRejectJob = async (jobId) => {
    try {
      await api.put(`/admin/jobs/${jobId}/approve`, { isApproved: false });
      toast.success('Job rejected');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to reject job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/admin/jobs/${jobId}`);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Job Management</h1>
            <p className="text-muted-foreground">Manage and approve job postings</p>
          </div>
          <Link to="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Search</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Approval Status</label>
              <select
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                value={filters.isApproved}
                onChange={(e) => setFilters({ ...filters, isApproved: e.target.value })}
              >
                <option value="">All</option>
                <option value="true">Approved</option>
                <option value="false">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Job Status</label>
              <select
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setFilters({ isApproved: '', status: '', search: '' })}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Jobs List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job._id} className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    {job.company?.logo ? (
                      <img
                        src={job.company.logo.url}
                        alt={job.company.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {job.title?.charAt(0) || 'J'}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">{job.title}</h3>
                          <p className="text-muted-foreground">
                            {job.company?.name} • {job.location} • {job.employmentType}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            job.isApproved 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {job.isApproved ? 'Approved' : 'Pending Review'}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            job.status === 'active' 
                              ? 'bg-blue-500/10 text-blue-500' 
                              : 'bg-gray-500/10 text-gray-500'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <span>Posted by: {job.postedBy?.name}</span>
                        <span>•</span>
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{job.views || 0} views</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link to={`/jobs/${job._id}`} target="_blank">
                          <Button size="sm" variant="outline">
                            <FiEye className="mr-2" /> View Job
                          </Button>
                        </Link>

                        {!job.isApproved && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveJob(job._id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <FiCheckCircle className="mr-2" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRejectJob(job._id)}
                              className="text-orange-500 border-orange-500 hover:bg-orange-500/10"
                            >
                              <FiXCircle className="mr-2" /> Reject
                            </Button>
                          </>
                        )}

                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteJob(job._id)}
                          className="text-red-500 border-red-500 hover:bg-red-500/10"
                        >
                          <FiTrash2 className="mr-2" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <FiBriefcase size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No jobs found</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
