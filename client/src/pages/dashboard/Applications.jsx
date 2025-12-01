import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ResumeViewerModal from '../../components/modals/ResumeViewerModal';
import { 
  FiBriefcase, FiCalendar, FiClock, FiMapPin, FiEye, 
  FiCheckCircle, FiXCircle, FiAward, FiFileText
} from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeToView, setResumeToView] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const { data } = await api.get('/applications/my-applications', { params });
      setApplications(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to load applications');
      setLoading(false);
    }
  };

  const handleViewResume = (application) => {
    setResumeToView({
      url: application.resume.url,
      candidateName: 'Your'
    });
    setShowResumeModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: FiClock, label: 'Pending' },
      reviewing: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: FiEye, label: 'Reviewing' },
      shortlisted: { bg: 'bg-purple-500/10', text: 'text-purple-500', icon: FiAward, label: 'Shortlisted' },
      'interview-scheduled': { bg: 'bg-teal-500/10', text: 'text-teal-500', icon: FiCalendar, label: 'Interview Scheduled' },
      accepted: { bg: 'bg-green-500/10', text: 'text-green-500', icon: FiCheckCircle, label: 'Accepted' },
      rejected: { bg: 'bg-red-500/10', text: 'text-red-500', icon: FiXCircle, label: 'Rejected' },
      withdrawn: { bg: 'bg-gray-500/10', text: 'text-gray-500', icon: FiXCircle, label: 'Withdrawn' }
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="mr-1" size={14} />
        {badge.label}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-display font-bold text-foreground">My Applications</h1>
          
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filter === 'shortlisted' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('shortlisted')}
            >
              Shortlisted
            </Button>
            <Button
              variant={filter === 'interview-scheduled' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('interview-scheduled')}
            >
              Interview
            </Button>
            <Button
              variant={filter === 'accepted' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('accepted')}
            >
              Accepted
            </Button>
            <Button
              variant={filter === 'rejected' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('rejected')}
            >
              Rejected
            </Button>
          </div>
        </div>

        {loading ? (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </Card>
        ) : applications.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {applications.map((application) => (
              <Card key={application._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 
                          className="text-xl font-semibold text-foreground hover:text-primary cursor-pointer"
                          onClick={() => navigate(`/jobs/${application.job._id}`)}
                        >
                          {application.job.title}
                        </h3>
                        <p className="text-muted-foreground">{application.job.company?.name}</p>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FiMapPin size={16} />
                        <span>{application.job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiBriefcase size={16} />
                        <span className="capitalize">{application.job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCalendar size={16} />
                        <span>Applied {formatDate(application.createdAt)}</span>
                      </div>
                    </div>

                    {/* Cover Letter Preview */}
                    {application.coverLetter && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          <span className="font-medium">Cover Letter:</span> {application.coverLetter}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/jobs/${application.job._id}`)}
                      >
                        <FiEye className="mr-2" /> View Job
                      </Button>

                      {application.resume?.url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewResume(application)}
                        >
                          <FiFileText className="mr-2" /> View Resume
                        </Button>
                      )}

                      {application.status === 'interview-scheduled' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate('/dashboard/interviews')}
                          className="border-teal-500 text-teal-500 hover:bg-teal-500/10"
                        >
                          <FiCalendar className="mr-2" /> View Interview
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Status Timeline */}
                  {application.statusHistory && application.statusHistory.length > 0 && (
                    <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
                      <h4 className="text-sm font-semibold text-foreground mb-3">Status History</h4>
                      <div className="space-y-2">
                        {application.statusHistory.slice(-3).reverse().map((history, index) => (
                          <div key={index} className="text-xs">
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-2 h-2 rounded-full ${
                                history.status === 'accepted' ? 'bg-green-500' :
                                history.status === 'rejected' ? 'bg-red-500' :
                                history.status === 'interview-scheduled' ? 'bg-teal-500' :
                                history.status === 'shortlisted' ? 'bg-purple-500' :
                                'bg-blue-500'
                              }`}></div>
                              <span className="font-medium capitalize">{history.status.replace('-', ' ')}</span>
                            </div>
                            <p className="text-muted-foreground ml-4">
                              {formatDate(history.changedAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <FiBriefcase size={40} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              {filter !== 'all' ? `No ${filter} Applications` : 'No Applications Yet'}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {filter !== 'all' 
                ? `You don't have any ${filter} applications.`
                : "You haven't applied to any jobs yet. Start browsing jobs to find your next opportunity."}
            </p>
            {filter === 'all' && (
              <Button onClick={() => navigate('/jobs')}>
                Browse Jobs
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* Resume Viewer Modal */}
      {showResumeModal && resumeToView && (
        <ResumeViewerModal
          isOpen={showResumeModal}
          onClose={() => {
            setShowResumeModal(false);
            setResumeToView(null);
          }}
          resumeUrl={resumeToView.url}
          candidateName={resumeToView.candidateName}
        />
      )}
    </div>
  );
};

export default Applications;
