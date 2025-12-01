import React, { useEffect, useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiPlus, FiUsers, FiEye, FiEdit, FiTrash2, FiCheckCircle, FiClock } from 'react-icons/fi';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') {
        params.status = filter;
      }
      const { data } = await api.get('/jobs/my-jobs', { params });
      setJobs(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs');
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to delete job');
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
            <h1 className="text-3xl font-display font-bold text-foreground">My Jobs</h1>
            <p className="text-muted-foreground">{jobs.length} total jobs posted</p>
          </div>
          <Link to="/dashboard/post-job">
            <Button className="shadow-glow">
              <FiPlus className="mr-2" /> Post New Job
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['all', 'active', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-background border border-border text-foreground hover:bg-muted'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-6">
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
                          {job.isApproved ? (
                            <><FiCheckCircle className="inline mr-1" size={12} /> Approved</>
                          ) : (
                            <><FiClock className="inline mr-1" size={12} /> Pending Approval</>
                          )}
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
                      <span className="flex items-center">
                        <FiUsers className="mr-1" />
                        {job.applicationsCount || 0} Applications
                      </span>
                      <span className="flex items-center">
                        <FiEye className="mr-1" />
                        {job.views || 0} Views
                      </span>
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/dashboard/jobs/${job._id}/applications`}>
                        <Button size="sm">
                          <FiUsers className="mr-2" /> View Applications ({job.applicationsCount || 0})
                        </Button>
                      </Link>
                      <Link to={`/jobs/${job._id}`} target="_blank">
                        <Button size="sm" variant="outline">
                          <FiEye className="mr-2" /> View Job
                        </Button>
                      </Link>
                      <Link to={`/dashboard/edit-job/${job._id}`}>
                        <Button size="sm" variant="outline">
                          <FiEdit className="mr-2" /> Edit
                        </Button>
                      </Link>
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
              </Card>
            ))}
          </div>
        ) : (
          <Card glass className="p-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <FiBriefcase size={40} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No Jobs Posted</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              You haven't posted any jobs yet. Create your first job listing to start finding candidates.
            </p>
            <Link to="/dashboard/post-job">
              <Button variant="outline">Post a Job</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
