import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FiBookmark, FiMapPin, FiBriefcase, FiClock, FiDollarSign, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const SavedJobs = () => {
  const { user } = useSelector((state) => state.auth);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users/saved-jobs');
      setSavedJobs(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await api.put(`/users/saved-jobs/${jobId}`);
      setSavedJobs(prev => prev.filter(job => job._id !== jobId));
      toast.success('Job removed from saved list');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove job');
    }
  };

  const formatSalary = (salary) => {
    if (!salary || !salary.min) return 'Salary not specified';
    
    const formatNumber = (num) => {
      if (num >= 1000) {
        return `$${(num / 1000).toFixed(0)}k`;
      }
      return `$${num}`;
    };

    if (salary.max) {
      return `${formatNumber(salary.min)} - ${formatNumber(salary.max)}`;
    }
    return `${formatNumber(salary.min)}+`;
  };

  const formatDate = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Saved Jobs</h1>
            <p className="text-muted-foreground">
              {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
            </p>
          </div>
        </div>
        
        {savedJobs.length === 0 ? (
          <Card glass className="p-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <FiBookmark size={40} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No Saved Jobs</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              You haven't saved any jobs yet. Bookmark jobs you're interested in to view them here later.
            </p>
            <Link to="/jobs">
              <Button variant="primary">Browse Jobs</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card glass className="p-6 border-border/50 hover:border-primary/30 transition-all group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Company Logo */}
                        {job.company?.logo?.url ? (
                          <img
                            src={job.company.logo.url}
                            alt={job.company.name}
                            className="w-16 h-16 rounded-lg object-cover border border-border"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl font-bold text-muted-foreground">
                            {job.company?.name?.charAt(0) || 'C'}
                          </div>
                        )}

                        <div className="flex-1">
                          <Link to={`/jobs/${job._id}`}>
                            <h3 className="text-xl font-bold text-foreground mb-1 hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground mb-3">
                            {job.company?.name || 'Company Name'}
                          </p>

                          {/* Job Details */}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1.5">
                              <FiMapPin size={16} />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FiBriefcase size={16} />
                              <span className="capitalize">{job.employmentType}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FiClock size={16} />
                              <span className="capitalize">{job.experienceLevel}</span>
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1.5">
                                <FiDollarSign size={16} />
                                <span>{formatSalary(job.salary)}</span>
                              </div>
                            )}
                          </div>

                          {/* Skills */}
                          {job.skills && job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {job.skills.slice(0, 5).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 5 && (
                                <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                                  +{job.skills.length - 5} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Link to={`/jobs/${job._id}`}>
                        <Button variant="primary" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnsaveJob(job._id)}
                        className="text-red-500 border-red-500 hover:bg-red-500/10"
                      >
                        <FiTrash2 className="mr-2" size={16} />
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Posted Date */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Posted {formatDate(job.createdAt)}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
