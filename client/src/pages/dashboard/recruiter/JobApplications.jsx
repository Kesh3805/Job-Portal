import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiFileText, 
  FiDownload, FiCheckCircle, FiXCircle, FiClock, FiEye,
  FiArrowLeft, FiBriefcase, FiAward, FiMessageSquare, FiVideo
} from 'react-icons/fi';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import ScheduleInterviewModal from '../../../components/modals/ScheduleInterviewModal';
import ResumeViewerModal from '../../../components/modals/ResumeViewerModal';

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeToView, setResumeToView] = useState(null);

  useEffect(() => {
    fetchData();
  }, [jobId, filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { job: jobId };
      if (filter !== 'all') {
        params.status = filter;
      }

      const [applicationsRes, jobRes] = await Promise.all([
        api.get('/applications', { params }),
        api.get(`/jobs/${jobId}`)
      ]);

      setApplications(applicationsRes.data.data);
      setJob(jobRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to load applications');
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setActionLoading(true);
      await api.put(`/applications/${applicationId}/status`, {
        status: newStatus
      });
      
      toast.success(`Application ${newStatus} successfully`);
      fetchData();
      setShowModal(false);
      setSelectedApplication(null);
      setActionLoading(false);
    } catch (error) {
      toast.error('Failed to update application status');
      setActionLoading(false);
    }
  };

  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleMessageCandidate = async (application) => {
    try {
      // Create or get conversation with the candidate
      const { data } = await api.post('/messages/conversation', {
        participantId: application.applicant._id
      });
      
      // Store conversation ID and navigate
      localStorage.setItem('openConversationId', data.data._id);
      navigate('/dashboard/messages');
      toast.success('Opening conversation...');
    } catch (error) {
      toast.error('Failed to open conversation');
    }
  };

  const handleScheduleInterview = (application) => {
    setSelectedApplication(application);
    setShowScheduleModal(true);
  };

  const handleInterviewScheduled = () => {
    fetchData();
    setShowScheduleModal(false);
    setSelectedApplication(null);
  };

  const handleViewResume = (application) => {
    setResumeToView({
      url: application.resume.url,
      candidateName: application.applicant.name
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

  const filteredApplications = applications;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          
          {job && (
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  Applications for {job.title}
                </h1>
                <p className="text-muted-foreground">
                  {applications.length} total applications
                </p>
              </div>
              <Link to={`/jobs/${jobId}`} target="_blank">
                <Button variant="outline" size="sm">
                  <FiEye className="mr-2" /> View Job
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'reviewing', 'shortlisted', 'interview-scheduled', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-background border border-border text-foreground hover:bg-muted'
              }`}
            >
              {status === 'all' ? 'All' : status === 'interview-scheduled' ? 'Interview' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'all' && ` (${applications.length})`}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {application.applicant.avatar?.url ? (
                      <img
                        src={application.applicant.avatar.url}
                        alt={application.applicant.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {application.applicant.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {application.applicant.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <FiMail className="mr-1" size={14} />
                            {application.applicant.email}
                          </span>
                          <span className="flex items-center">
                            <FiCalendar className="mr-1" size={14} />
                            Applied {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>

                    {/* Skills */}
                    {application.applicant.skills && application.applicant.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {application.applicant.skills.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-muted text-foreground text-xs rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                        {application.applicant.skills.length > 5 && (
                          <span className="px-2 py-1 text-muted-foreground text-xs">
                            +{application.applicant.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Experience */}
                    {application.applicant.experience && (
                      <p className="text-sm text-muted-foreground mb-3">
                        <FiBriefcase className="inline mr-1" size={14} />
                        {application.applicant.experience} years of experience
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => viewApplicationDetails(application)}
                      >
                        <FiEye className="mr-2" /> View Details
                      </Button>

                      {application.resume?.url && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewResume(application)}
                        >
                          <FiEye className="mr-2" /> View Resume
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMessageCandidate(application)}
                        className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
                      >
                        <FiMessageSquare className="mr-2" /> Message
                      </Button>

                      {application.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(application._id, 'shortlisted')}
                            className="bg-purple-500 hover:bg-purple-600"
                          >
                            <FiAward className="mr-2" /> Shortlist
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(application._id, 'rejected')}
                            className="text-red-500 border-red-500 hover:bg-red-500/10"
                          >
                            <FiXCircle className="mr-2" /> Reject
                          </Button>
                        </>
                      )}

                      {application.status === 'shortlisted' && (
                        <Button
                          size="sm"
                          onClick={() => handleScheduleInterview(application)}
                          className="bg-teal-500 hover:bg-teal-600"
                        >
                          <FiVideo className="mr-2" /> Schedule Interview
                        </Button>
                      )}

                      {application.status === 'interview-scheduled' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(application._id, 'accepted')}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <FiCheckCircle className="mr-2" /> Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(application._id, 'rejected')}
                            className="text-red-500 border-red-500 hover:bg-red-500/10"
                          >
                            <FiXCircle className="mr-2" /> Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <FiUser size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
            </p>
          </Card>
        )}
      </div>

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-background">
              <h2 className="text-2xl font-bold text-foreground">Application Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <FiXCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Applicant Info */}
              <div className="flex items-start gap-4">
                {selectedApplication.applicant.avatar?.url ? (
                  <img
                    src={selectedApplication.applicant.avatar.url}
                    alt={selectedApplication.applicant.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                    {selectedApplication.applicant.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {selectedApplication.applicant.name}
                  </h3>
                  <div className="space-y-1 text-muted-foreground">
                    <p className="flex items-center">
                      <FiMail className="mr-2" size={16} />
                      {selectedApplication.applicant.email}
                    </p>
                    {selectedApplication.applicant.phone && (
                      <p className="flex items-center">
                        <FiPhone className="mr-2" size={16} />
                        {selectedApplication.applicant.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Application Status
                </label>
                {getStatusBadge(selectedApplication.status)}
              </div>

              {/* Cover Letter */}
              {selectedApplication.coverLetter && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cover Letter
                  </label>
                  <div className="p-4 bg-muted rounded-lg text-foreground whitespace-pre-wrap">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}

              {/* Skills */}
              {selectedApplication.applicant.skills && selectedApplication.applicant.skills.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.applicant.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {selectedApplication.applicant.experience && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Years of Experience
                  </label>
                  <p className="text-foreground">{selectedApplication.applicant.experience} years</p>
                </div>
              )}

              {/* Resume */}
              {selectedApplication.resume?.url && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Resume
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewResume(selectedApplication)}
                    className="inline-flex items-center"
                  >
                    <FiEye className="mr-2" />
                    View Resume
                  </Button>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                {selectedApplication.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleStatusChange(selectedApplication._id, 'shortlisted')}
                      disabled={actionLoading}
                      className="flex-1 bg-purple-500 hover:bg-purple-600"
                    >
                      <FiAward className="mr-2" /> Shortlist
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(selectedApplication._id, 'rejected')}
                      disabled={actionLoading}
                      variant="outline"
                      className="flex-1 text-red-500 border-red-500 hover:bg-red-500/10"
                    >
                      <FiXCircle className="mr-2" /> Reject
                    </Button>
                  </>
                )}

                {selectedApplication.status === 'shortlisted' && (
                  <Button
                    onClick={() => handleStatusChange(selectedApplication._id, 'interview-scheduled')}
                    disabled={actionLoading}
                    className="flex-1 bg-teal-500 hover:bg-teal-600"
                  >
                    <FiCalendar className="mr-2" /> Schedule Interview
                  </Button>
                )}

                {selectedApplication.status === 'interview-scheduled' && (
                  <>
                    <Button
                      onClick={() => handleStatusChange(selectedApplication._id, 'accepted')}
                      disabled={actionLoading}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <FiCheckCircle className="mr-2" /> Accept
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(selectedApplication._id, 'rejected')}
                      disabled={actionLoading}
                      variant="outline"
                      className="flex-1 text-red-500 border-red-500 hover:bg-red-500/10"
                    >
                      <FiXCircle className="mr-2" /> Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && selectedApplication && (
        <ScheduleInterviewModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedApplication(null);
          }}
          application={selectedApplication}
          onSuccess={handleInterviewScheduled}
        />
      )}

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

export default JobApplications;
