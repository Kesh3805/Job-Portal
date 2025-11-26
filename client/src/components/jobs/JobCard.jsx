import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiClock, FiDollarSign } from 'react-icons/fi';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

const JobCard = ({ job }) => {
  return (
    <Card glass className="hover:shadow-glow transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-xl bg-white/5 p-2 border border-white/10 flex items-center justify-center overflow-hidden">
            {job.company?.logo?.url ? (
              <img
                src={job.company.logo.url}
                alt={job.company.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-primary">{job.company?.name?.charAt(0)}</span>
            )}
          </div>
          <div>
            <Link to={`/jobs/${job._id}`} className="text-xl font-display font-bold text-foreground hover:text-primary transition-colors">
              {job.title}
            </Link>
            <p className="text-muted-foreground">{job.company?.name}</p>
          </div>
        </div>
        <Badge variant={job.status === 'active' ? 'success' : 'warning'}>
          {job.status}
        </Badge>
      </div>

      <p className="text-muted-foreground mb-6 line-clamp-2">{job.description}</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center text-muted-foreground text-sm">
          <FiMapPin className="mr-2 text-primary" />
          {job.location}
        </div>
        <div className="flex items-center text-muted-foreground text-sm">
          <FiBriefcase className="mr-2 text-primary" />
          {job.employmentType}
        </div>
        <div className="flex items-center text-muted-foreground text-sm">
          <FiClock className="mr-2 text-primary" />
          {job.experienceLevel}
        </div>
        {job.salary?.min && (
          <div className="flex items-center text-muted-foreground text-sm">
            <FiDollarSign className="mr-2 text-primary" />
            {job.salary.min} - {job.salary.max} / {job.salary.period}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {job.skills?.slice(0, 4).map((skill, index) => (
          <Badge key={index} variant="outline" className="bg-primary/5 border-primary/20 text-primary">
            {skill}
          </Badge>
        ))}
        {job.skills?.length > 4 && (
          <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
            +{job.skills.length - 4} more
          </Badge>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        <span className="text-sm text-muted-foreground">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <Link to={`/jobs/${job._id}`}>
          <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default JobCard;
