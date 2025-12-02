import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../features/jobs/jobSlice';
import JobCard from '../../components/jobs/JobCard';
import Button from '../../components/common/Button';
import { FiFilter, FiX, FiSearch, FiMapPin, FiDollarSign, FiBriefcase, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Jobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    employmentType: '',
    experienceLevel: '',
    salaryMin: '',
    category: '',
    limit: 100, // Show up to 100 jobs
  });

  useEffect(() => {
    dispatch(fetchJobs(filters));
  }, [dispatch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    dispatch(fetchJobs(filters));
  };

  const clearFilters = () => {
    const clearedFilters = {
      keyword: '',
      location: '',
      employmentType: '',
      experienceLevel: '',
      salaryMin: '',
      category: '',
      limit: 100,
    };
    setFilters(clearedFilters);
    dispatch(fetchJobs(clearedFilters));
  };

  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Executive'];
  const salaryRanges = [
    { label: 'Any', value: '' },
    { label: '$30k+', value: '30000' },
    { label: '$50k+', value: '50000' },
    { label: '$75k+', value: '75000' },
    { label: '$100k+', value: '100000' },
    { label: '$150k+', value: '150000' },
  ];
  const categories = [
    'Technology', 'Design', 'Marketing', 'Sales', 'Finance', 
    'Healthcare', 'Engineering', 'HR', 'Customer Service', 'Other'
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 animate-float delay-200"></div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">Find Your Next Role</h1>
            <p className="text-muted-foreground">Explore thousands of job opportunities across all industries.</p>
          </div>
          <Button 
            variant="outline" 
            className="glass hover-lift"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <div className="glass p-6 rounded-2xl space-y-6">
                {/* Search and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Job title or keywords"
                      value={filters.keyword}
                      onChange={(e) => handleFilterChange('keyword', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-background/50 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="City, state, or remote"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-background/50 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-background/50 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <FiBriefcase className="inline mr-2" />
                    Employment Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {employmentTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => handleFilterChange('employmentType', filters.employmentType === type ? '' : type)}
                        className={`px-4 py-2 rounded-lg border transition-all hover-scale ${
                          filters.employmentType === type
                            ? 'bg-primary text-white border-primary'
                            : 'bg-background/50 border-border hover:border-primary/50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <FiClock className="inline mr-2" />
                    Experience Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {experienceLevels.map(level => (
                      <button
                        key={level}
                        onClick={() => handleFilterChange('experienceLevel', filters.experienceLevel === level ? '' : level)}
                        className={`px-4 py-2 rounded-lg border transition-all hover-scale ${
                          filters.experienceLevel === level
                            ? 'bg-primary text-white border-primary'
                            : 'bg-background/50 border-border hover:border-primary/50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    <FiDollarSign className="inline mr-2" />
                    Minimum Salary
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {salaryRanges.map(range => (
                      <button
                        key={range.label}
                        onClick={() => handleFilterChange('salaryMin', range.value)}
                        className={`px-4 py-2 rounded-lg border transition-all hover-scale ${
                          filters.salaryMin === range.value
                            ? 'bg-primary text-white border-primary'
                            : 'bg-background/50 border-border hover:border-primary/50'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button onClick={applyFilters} className="flex-1 hover-lift">
                    Apply Filters
                  </Button>
                  <Button onClick={clearFilters} variant="outline" className="hover-lift">
                    <FiX className="mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${jobs.length} jobs found`}
          </p>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : jobs.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {jobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="glass p-12 rounded-2xl inline-block">
              <FiSearch className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-2xl font-bold text-foreground mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search criteria</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
