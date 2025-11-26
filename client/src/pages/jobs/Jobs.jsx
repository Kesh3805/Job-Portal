import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../features/jobs/jobSlice';
import JobCard from '../../components/jobs/JobCard';
import Button from '../../components/common/Button';
import { FiFilter } from 'react-icons/fi';

const Jobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs({}));
  }, [dispatch]);

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">Find Your Next Role</h1>
            <p className="text-muted-foreground">Explore thousands of job opportunities.</p>
          </div>
          <Button variant="outline" className="glass">
            <FiFilter className="mr-2" />
            Filters
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
