import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJob } from '../../features/jobs/jobSlice';
import { getMe } from '../../features/auth/authSlice';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { FiMapPin, FiBriefcase, FiClock, FiDollarSign, FiCalendar, FiUsers, FiArrowLeft, FiBookmark, FiCheck } from 'react-icons/fi';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentJob, loading } = useSelector((state) => state.jobs);
  
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchJob(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (user && user.savedJobs && currentJob) {
      setIsSaved(user.savedJobs.includes(currentJob._id));
    }
  }, [user, currentJob]);

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to apply for this job');
      navigate('/login');
      return;
    }

    setApplying(true);
    const formData = new FormData();
    formData.append('coverLetter', coverLetter);
    if (resume) {
      formData.append('resume', resume);
    }

    try {
      await api.post(`/applications/${id}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setCoverLetter('');
      setResume(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleToggleSaveJob = async () => {
    if (!user) {
      toast.error('Please login to save jobs');
      navigate('/login');
      return;
    }

    if (user.role !== 'seeker') {
      toast.info('Only job seekers can save jobs');
      return;
    }

    try {
      setSavingJob(true);
      await api.put(`/users/saved-jobs/${id}`);
      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Job removed from saved list' : 'Job saved successfully!');
      dispatch(getMe()); // Refresh user data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    } finally {
      setSavingJob(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <p className="text-foreground">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <FiArrowLeft className="mr-2" /> Back to Jobs
        </Button>

        <Card glass className="p-8 mb-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-2xl bg-white/5 p-4 border border-white/10 flex items-center justify-center overflow-hidden">
                {currentJob.company?.logo?.url ? (
                  <img
                    src={currentJob.company.logo.url}
                    alt={currentJob.company.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-4xl font-bold text-primary">{currentJob.company?.name?.charAt(0)}</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{currentJob.title}</h1>
                <p className="text-xl text-primary mb-4">{currentJob.company?.name}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <FiMapPin className="text-primary" /> {currentJob.location}
                  </span>
                  <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <FiBriefcase className="text-primary" /> {currentJob.employmentType}
                  </span>
                  <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <FiMapPin className="text-primary" /> {currentJob.locationType}
                  </span>
                  <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <FiClock className="text-primary" /> {currentJob.experienceLevel}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              {user?.role === 'seeker' && (
                <Button 
                  variant="outline" 
                  onClick={handleToggleSaveJob} 
                  disabled={savingJob}
                  className={`flex-1 md:flex-none ${isSaved ? 'bg-primary/10 border-primary text-primary' : ''}`}
                >
                  <FiBookmark className={`mr-2 ${isSaved ? 'fill-current' : ''}`} /> 
                  {isSaved ? 'Saved' : 'Save Job'}
                </Button>
              )}
              {user?.role === 'seeker' && (
                <Button onClick={() => setShowApplyModal(true)} className="flex-1 md:flex-none shadow-glow">
                  Apply Now
                </Button>
              )}
            </div>
          </div>

          {/* Salary */}
          {currentJob.salary && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <FiDollarSign size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Salary Range</p>
                <p className="text-xl font-bold text-foreground">
                  {currentJob.salary.currency} {currentJob.salary.min?.toLocaleString()} - {currentJob.salary.max?.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/ {currentJob.salary.period}</span>
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">About the Role</h2>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{currentJob.description}</p>
              </div>

              {/* Requirements */}
              {currentJob.requirements && currentJob.requirements.length > 0 && (
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-4">Requirements</h2>
                  <ul className="space-y-3">
                    {currentJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Responsibilities */}
              {currentJob.responsibilities && currentJob.responsibilities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-4">Responsibilities</h2>
                  <ul className="space-y-3">
                    {currentJob.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {/* Skills */}
              {currentJob.skills && currentJob.skills.length > 0 && (
                <Card className="bg-white/5 border-white/10 p-6">
                  <h2 className="text-xl font-display font-bold text-foreground mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {currentJob.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Benefits */}
              {currentJob.benefits && currentJob.benefits.length > 0 && (
                <Card className="bg-white/5 border-white/10 p-6">
                  <h2 className="text-xl font-display font-bold text-foreground mb-4">Benefits</h2>
                  <div className="flex flex-wrap gap-2">
                    {currentJob.benefits.map((benefit, index) => (
                      <Badge key={index} variant="success" className="bg-green-500/10 border-green-500/20 text-green-400">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Additional Info */}
              <Card className="bg-white/5 border-white/10 p-6">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">Job Overview</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <span className="text-foreground font-medium">{currentJob.category}</span>
                  </div>
                  <div className="border-t border-white/10"></div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Openings</span>
                    <span className="text-foreground font-medium">{currentJob.openings || 1}</span>
                  </div>
                  <div className="border-t border-white/10"></div>
                  {currentJob.applicationDeadline && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Deadline</span>
                        <span className="text-foreground font-medium">{new Date(currentJob.applicationDeadline).toLocaleDateString()}</span>
                      </div>
                      <div className="border-t border-white/10"></div>
                    </>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Posted</span>
                    <span className="text-foreground font-medium">{new Date(currentJob.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card glass className="max-w-2xl w-full p-8 animate-scale-in border-primary/20 shadow-glow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Apply for {currentJob.title}</h2>
              <button onClick={() => setShowApplyModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleApply}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Cover Letter <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  rows="6"
                  className="w-full bg-background/50 border border-input rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  placeholder="Explain why you're a great fit for this position..."
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Resume (Optional - Upload or use profile resume)
                </label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-primary/50 transition-colors bg-white/5">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files[0])}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                      <FiCheck size={24} />
                    </div>
                    <span className="text-foreground font-medium">Click to upload resume</span>
                    <span className="text-xs text-muted-foreground">PDF, DOC, DOCX (Max 5MB)</span>
                    {resume && <span className="text-primary text-sm mt-2 font-medium">{resume.name}</span>}
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowApplyModal(false)}
                  disabled={applying}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={applying} className="shadow-glow">
                  {applying ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
