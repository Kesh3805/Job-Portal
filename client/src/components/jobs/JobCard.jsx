import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiMapPin, FiBriefcase, FiClock, FiDollarSign, FiBookmark } from 'react-icons/fi';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const JobCard = ({ job }) => {
  const { user } = useSelector((state) => state.auth);
  const [isSaved, setIsSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);

  useEffect(() => {
    if (user && user.savedJobs) {
      setIsSaved(user.savedJobs.includes(job._id));
    }
  }, [user, job._id]);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info('Please login to save jobs');
      return;
    }

    if (user.role !== 'seeker') {
      toast.info('Only job seekers can save jobs');
      return;
    }

    try {
      setSavingJob(true);
      await api.put(`/users/saved-jobs/${job._id}`);
      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Job removed from saved list' : 'Job saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    } finally {
      setSavingJob(false);
    }
  };

  return (
    <Card className="relative group hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-primary/30">
      {/* Bookmark Button */}
      {user && user.role === 'seeker' && (
        <button
          onClick={handleToggleSave}
          disabled={savingJob}
          className={`absolute top-4 right-4 p-2 rounded-lg backdrop-blur-sm transition-all ${
            isSaved
              ? 'bg-primary text-white'
              : 'bg-secondary/80 hover:bg-primary hover:text-white'
          } ${savingJob ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isSaved ? 'Remove from saved jobs' : 'Save job'}
        >
          <FiBookmark size={16} className={isSaved ? 'fill-current' : ''} />
        </button>
      )}

      {/* Company Logo & Title */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 p-2.5 border border-border flex items-center justify-center flex-shrink-0">
          {job.company?.logo?.url ? (
            <img
              src={job.company.logo.url}
              alt={job.company.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-xl font-bold text-primary">{job.company?.name?.charAt(0) || 'J'}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <Link to={`/jobs/${job._id}`} className="text-lg font-bold text-foreground hover:text-primary transition-colors block mb-1 line-clamp-1">
            {job.title}
          </Link>
          <p className="text-sm text-muted-foreground">{job.company?.name || 'Company'}</p>
          <Badge variant={job.status === 'active' ? 'success' : 'secondary'} className="text-xs mt-1 capitalize">
            {job.status}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-foreground">
          <FiMapPin className="mr-2 text-primary" size={16} />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm text-foreground capitalize">
            <FiBriefcase className="mr-2 text-purple-500" size={16} />
            <span>{job.employmentType}</span>
          </div>
          <div className="flex items-center text-sm text-foreground capitalize">
            <FiClock className="mr-2 text-blue-500" size={16} />
            <span>{job.experienceLevel}</span>
          </div>
        </div>
        {job.salary?.min && (
          <div className="flex items-center text-sm text-green-600 font-semibold">
            <FiDollarSign className="mr-2" size={16} />
            <span>${job.salary.min >= 1000 ? `${(job.salary.min / 1000).toFixed(0)}k` : job.salary.min} - ${job.salary.max >= 1000 ? `${(job.salary.max / 1000).toFixed(0)}k` : job.salary.max} / {job.salary.period}</span>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.slice(0, 3).map((skill, index) => (
          <Badge key={index} variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
            {skill}
          </Badge>
        ))}
        {job.skills?.length > 3 && (
          <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground">
            +{job.skills.length - 3}
          </Badge>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <Link to={`/jobs/${job._id}`}>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default JobCard;
