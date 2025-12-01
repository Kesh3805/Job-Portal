import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiClock, FiDollarSign, FiTarget, FiCheckCircle } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const RecommendedJobs = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/jobs/recommendations');
      setRecommendations(data.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getMatchBgColor = (score) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-orange-500/20 border-orange-500/30';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Recommended Jobs for You
          </h1>
          <p className="text-muted-foreground">
            AI-powered job matches based on your profile, skills, and experience
          </p>
        </div>

        {recommendations.length === 0 ? (
          <Card glass className="text-center py-12">
            <FiTarget className="mx-auto text-6xl text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No Recommendations Yet</h3>
            <p className="text-muted-foreground mb-6">
              Complete your profile with skills and experience to get personalized job recommendations
            </p>
            <Link to="/profile">
              <Button>Complete Your Profile</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {recommendations.map((item) => (
              <Card key={item.job._id} glass className="hover:shadow-glow transition-all duration-300 group">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Job Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-xl bg-white/5 p-2 border border-white/10 flex items-center justify-center overflow-hidden">
                          {item.job.company?.logo?.url ? (
                            <img
                              src={item.job.company.logo.url}
                              alt={item.job.company.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-primary">
                              {item.job.company?.name?.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <Link
                            to={`/jobs/${item.job._id}`}
                            className="text-xl font-display font-bold text-foreground hover:text-primary transition-colors"
                          >
                            {item.job.title}
                          </Link>
                          <p className="text-muted-foreground">{item.job.company?.name}</p>
                        </div>
                      </div>
                      <Badge variant={item.job.status === 'active' ? 'success' : 'warning'}>
                        {item.job.status}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-6 line-clamp-2">
                      {item.job.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <FiMapPin className="mr-2 text-primary" />
                        {item.job.location}
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <FiBriefcase className="mr-2 text-primary" />
                        {item.job.employmentType}
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <FiClock className="mr-2 text-primary" />
                        {item.job.experienceLevel}
                      </div>
                      {item.job.salary?.min && (
                        <div className="flex items-center text-muted-foreground text-sm">
                          <FiDollarSign className="mr-2 text-primary" />
                          {item.job.salary.min} - {item.job.salary.max} / {item.job.salary.period}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.job.skills?.slice(0, 5).map((skill, index) => {
                        const isMatched = item.matchedSkills?.includes(skill);
                        return (
                          <Badge
                            key={index}
                            variant="outline"
                            className={
                              isMatched
                                ? 'bg-primary/10 border-primary/30 text-primary'
                                : 'bg-muted/50 text-muted-foreground'
                            }
                          >
                            {isMatched && <FiCheckCircle className="mr-1 inline" />}
                            {skill}
                          </Badge>
                        );
                      })}
                      {item.job.skills?.length > 5 && (
                        <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                          +{item.job.skills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="lg:w-64 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-white/10">
                    <div className="relative w-32 h-32 mb-4">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-white/10"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - item.matchScore / 100)}`}
                          className={getMatchColor(item.matchScore)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-3xl font-bold ${getMatchColor(item.matchScore)}`}>
                          {item.matchScore}%
                        </span>
                      </div>
                    </div>

                    <div className="text-center mb-4">
                      <h4 className="text-lg font-bold text-foreground mb-1">Match Score</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.matchScore >= 80
                          ? 'Excellent Match!'
                          : item.matchScore >= 60
                          ? 'Good Match'
                          : 'Potential Match'}
                      </p>
                    </div>

                    {item.matchedSkills && item.matchedSkills.length > 0 && (
                      <div className={`w-full p-3 rounded-lg border ${getMatchBgColor(item.matchScore)}`}>
                        <p className="text-xs text-muted-foreground mb-2">Matched Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.matchedSkills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {item.matchedSkills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.matchedSkills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <Link to={`/jobs/${item.job._id}`} className="w-full mt-4">
                      <Button className="w-full" variant="primary">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
                  <span className="text-sm text-muted-foreground">
                    Posted {new Date(item.job.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.job.applicationsCount > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {item.job.applicationsCount} applicants
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedJobs;
