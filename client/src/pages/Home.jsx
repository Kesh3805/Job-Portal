import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiTrendingUp, FiBriefcase, FiUsers, FiMapPin, FiDollarSign, FiCheckCircle, FiArrowRight, FiClock, FiCode, FiLayers, FiCpu } from 'react-icons/fi';
import api from '../utils/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const Home = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState({ keyword: '', location: '' });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs?limit=4&sort=-createdAt');
        setFeaturedJobs(data.jobs || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${searchQuery.keyword}&location=${searchQuery.location}`);
  };

  const categories = [
    { name: 'Development', icon: <FiCode />, count: '1.2k+ Jobs', color: 'text-blue-500' },
    { name: 'Design', icon: <FiLayers />, count: '800+ Jobs', color: 'text-purple-500' },
    { name: 'Marketing', icon: <FiTrendingUp />, count: '500+ Jobs', color: 'text-green-500' },
    { name: 'Engineering', icon: <FiCpu />, count: '300+ Jobs', color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              The #1 Platform for Tech Talent
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight animate-slide-up">
              Find your next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradient-x">
                breakthrough
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
              Connect with forward-thinking companies and discover opportunities that define the future of technology.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="glass p-2 rounded-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-2 animate-slide-up delay-200 shadow-glow border-white/10">
              <div className="flex-1 flex items-center px-4 py-3 bg-background/50 rounded-xl focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-transparent focus-within:border-primary/20">
                <FiSearch className="text-muted-foreground mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="bg-transparent w-full focus:outline-none text-foreground placeholder:text-muted-foreground"
                  value={searchQuery.keyword}
                  onChange={(e) => setSearchQuery({ ...searchQuery, keyword: e.target.value })}
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-3 bg-background/50 rounded-xl focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-transparent focus-within:border-primary/20">
                <FiMapPin className="text-muted-foreground mr-3" size={20} />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  className="bg-transparent w-full focus:outline-none text-foreground placeholder:text-muted-foreground"
                  value={searchQuery.location}
                  onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })}
                />
              </div>
              <Button type="submit" size="lg" className="md:w-auto w-full h-auto py-3 px-8 text-lg shadow-glow hover:shadow-glow-lg">
                Search
              </Button>
            </form>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground animate-fade-in delay-300">
              <span>Trending:</span>
              {['Remote', 'AI Engineer', 'Product Design', 'Blockchain'].map((tag) => (
                <Link 
                  key={tag} 
                  to={`/jobs?keyword=${tag}`} 
                  className="px-3 py-1 rounded-full bg-secondary/50 hover:bg-secondary hover:text-secondary-foreground transition-colors border border-border"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Jobs', value: '50K+' },
              { label: 'Companies', value: '10K+' },
              { label: 'Job Seekers', value: '100K+' },
              { label: 'Hired', value: '25K+' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Explore by Category</h2>
              <p className="text-muted-foreground max-w-xl">Find the perfect role in your area of expertise. We have opportunities across all major industries.</p>
            </div>
            <Link to="/jobs">
              <Button variant="ghost" className="group">
                View all categories <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <Link key={index} to={`/jobs?category=${cat.name}`} className="group">
                <Card glass hover className="p-6 h-full border-border/50 bg-card/50">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-background border border-border shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <span className={`text-2xl ${cat.color}`}>{cat.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-muted-foreground text-sm">{cat.count}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Featured Opportunities</h2>
            <p className="text-muted-foreground">Hand-picked roles from top-tier companies</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-64 bg-card/50 rounded-2xl animate-pulse border border-border/50"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredJobs.map((job) => (
                <Link key={job._id} to={`/jobs/${job._id}`} className="group">
                  <Card hover className="p-6 h-full bg-card border-border/50 hover:border-primary/30">
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 rounded-xl bg-background flex items-center justify-center overflow-hidden flex-shrink-0 border border-border shadow-sm group-hover:shadow-md transition-all">
                        {job.company?.logo?.url ? (
                          <img src={job.company.logo.url} alt={job.company.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-muted-foreground">{job.company?.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-1 truncate">{job.title}</h3>
                            <p className="text-muted-foreground font-medium mb-3">{job.company?.name}</p>
                          </div>
                          <Badge variant={job.employmentType === 'full-time' ? 'primary' : 'secondary'} className="shrink-0">
                            {job.employmentType}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><FiMapPin className="text-primary/70" /> {job.location}</span>
                          <span className="flex items-center gap-1.5"><FiDollarSign className="text-primary/70" /> {job.salary?.min ? `$${job.salary.min.toLocaleString()}` : 'Competitive'}</span>
                          <span className="flex items-center gap-1.5"><FiClock className="text-primary/70" /> {job.experienceLevel}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="px-8">View All Jobs</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/90">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">Ready to shape the future?</h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">Join our community of professionals and take the next step towards your dream career today.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 border-none w-full sm:w-auto h-14 px-8 text-lg shadow-xl">
                Create Free Account
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto h-14 px-8 text-lg backdrop-blur-sm">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
