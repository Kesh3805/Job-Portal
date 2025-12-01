import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMe } from '../../features/auth/authSlice';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import ResumeViewerModal from '../../components/modals/ResumeViewerModal';
import { FiEye, FiDownload, FiTrash2, FiUpload } from 'react-icons/fi';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    skills: [],
    experience: [],
    education: [],
    portfolio: {
      github: '',
      linkedin: '',
      website: ''
    }
  });
  const [newSkill, setNewSkill] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        skills: user.skills || [],
        experience: user.experience || [],
        education: user.education || [],
        portfolio: user.portfolio || { github: '', linkedin: '', website: '' }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePortfolioChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      portfolio: { ...prev.portfolio, [name]: value }
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put('/users/profile', formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      e.target.value = '';
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploadingResume(true);
      const { data } = await api.put('/users/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Resume uploaded successfully!');
      dispatch(getMe());
      setUploadingResume(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
      setUploadingResume(false);
    }
    // Clear the input
    e.target.value = '';
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete your resume? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete('/users/resume');
      toast.success('Resume deleted successfully!');
      dispatch(getMe());
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete resume');
    }
  };

  const handleViewResume = () => {
    setShowResumeModal(true);
  };

  const handleDownloadResume = async () => {
    try {
      const response = await fetch(user.resume.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = user.resume.fileName || 'Resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download resume');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-display text-3xl font-bold mb-8 text-foreground">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card glass className="p-6 text-center border-border/50">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-muted border-4 border-background shadow-lg flex items-center justify-center overflow-hidden relative group">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-muted-foreground font-bold">{user?.name?.charAt(0)}</span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                <label className="cursor-pointer text-white text-sm font-medium">
                  Change
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
            <p className="text-muted-foreground mb-4">{user?.email}</p>
            <Badge variant="primary" className="px-3 py-1 text-sm capitalize">
              {user?.role}
            </Badge>
          </Card>

          {user?.role === 'seeker' && (
            <Card glass className="p-6 border-border/50">
              <h3 className="font-bold text-foreground mb-4 flex items-center justify-between">
                Resume
                {user?.resume?.url && <Badge variant="success">Uploaded</Badge>}
              </h3>
              
              {user?.resume?.url ? (
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-foreground font-medium mb-1">
                      {user.resume.fileName || 'Resume.pdf'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Current resume on file
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleViewResume}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <FiEye size={16} />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDownloadResume}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <FiDownload size={16} />
                      Download
                    </Button>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDeleteResume}
                    className="w-full flex items-center justify-center gap-2 text-red-500 border-red-500 hover:bg-red-500/10"
                  >
                    <FiTrash2 size={16} />
                    Delete Resume
                  </Button>
                  
                  <div className="pt-3 border-t border-border">
                    <label className="block">
                      <Button 
                        variant="primary" 
                        className="w-full" 
                        as="span"
                        disabled={uploadingResume}
                      >
                        <FiUpload className="mr-2" size={16} />
                        {uploadingResume ? 'Uploading...' : 'Replace Resume'}
                      </Button>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={handleResumeUpload} 
                        className="hidden"
                        disabled={uploadingResume}
                      />
                    </label>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      PDF or Word (Max 5MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-4 italic">No resume uploaded yet</p>
                  <label className="block">
                    <Button 
                      variant="primary" 
                      className="w-full" 
                      as="span"
                      disabled={uploadingResume}
                    >
                      <FiUpload className="mr-2" size={16} />
                      {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                    </Button>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleResumeUpload} 
                      className="hidden"
                      disabled={uploadingResume}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground text-center">
                    PDF or Word (Max 5MB)
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card glass className="p-6 border-border/50">
              <h2 className="text-xl font-bold mb-6 text-foreground border-b border-border pb-2">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Full Name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
                <Input 
                  label="Email" 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  disabled 
                  className="bg-muted text-muted-foreground"
                />
                <Input 
                  label="Phone" 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground/80 mb-1.5">Bio</label>
                  <textarea 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleChange} 
                    rows="4" 
                    className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground" 
                    placeholder="Tell us about yourself..." 
                  />
                </div>
              </div>
            </Card>

            {/* Skills */}
            {user?.role === 'seeker' && (
              <Card glass className="p-6 border-border/50">
                <h2 className="text-xl font-bold mb-6 text-foreground border-b border-border pb-2">Skills</h2>
                <div className="flex gap-3 mb-6">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill (e.g. React, Node.js)"
                    containerClassName="flex-1"
                  />
                  <Button onClick={addSkill} variant="secondary">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.length > 0 ? (
                    formData.skills.map((skill, index) => (
                      <Badge key={index} variant="primary" className="px-3 py-1.5 text-sm flex items-center gap-2">
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => removeSkill(skill)} 
                          className="hover:text-primary-900 focus:outline-none"
                        >
                          ×
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm italic">No skills added yet.</p>
                  )}
                </div>
              </Card>
            )}

            {/* Experience */}
            {user?.role === 'seeker' && (
              <Card glass className="p-6 border-border/50">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-2">
                  <h2 className="text-xl font-bold text-foreground">Experience</h2>
                  <Button onClick={addExperience} variant="outline" size="sm">+ Add Experience</Button>
                </div>
                <div className="space-y-6">
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="bg-muted/30 rounded-xl p-5 border border-border relative group">
                      <button 
                        type="button" 
                        onClick={() => removeExperience(index)} 
                        className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input
                          label="Job Title"
                          value={exp.title}
                          onChange={(e) => updateExperience(index, 'title', e.target.value)}
                          placeholder="e.g. Senior Developer"
                          className="bg-background"
                        />
                        <Input
                          label="Company"
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          placeholder="e.g. Tech Corp"
                          className="bg-background"
                        />
                        <Input
                          label="Start Date"
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                          className="bg-background"
                        />
                        <Input
                          label="End Date"
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-1.5">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                          rows="3"
                          placeholder="Describe your responsibilities and achievements..."
                        />
                      </div>
                    </div>
                  ))}
                  {formData.experience.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No experience added yet.</p>
                  )}
                </div>
              </Card>
            )}

            {/* Education */}
            {user?.role === 'seeker' && (
              <Card glass className="p-6 border-border/50">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-2">
                  <h2 className="text-xl font-bold text-foreground">Education</h2>
                  <Button onClick={addEducation} variant="outline" size="sm">+ Add Education</Button>
                </div>
                <div className="space-y-6">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="bg-muted/30 rounded-xl p-5 border border-border relative">
                      <button 
                        type="button" 
                        onClick={() => removeEducation(index)} 
                        className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input
                          label="Degree"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          placeholder="e.g. BS Computer Science"
                          className="bg-background"
                        />
                        <Input
                          label="Institution"
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          placeholder="e.g. University of Tech"
                          className="bg-background"
                        />
                        <Input
                          label="Start Date"
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                          className="bg-background"
                        />
                        <Input
                          label="End Date"
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-1.5">Description</label>
                        <textarea
                          value={edu.description}
                          onChange={(e) => updateEducation(index, 'description', e.target.value)}
                          className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                          rows="3"
                          placeholder="Additional details..."
                        />
                      </div>
                    </div>
                  ))}
                  {formData.education.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No education added yet.</p>
                  )}
                </div>
              </Card>
            )}

            {/* Portfolio */}
            {user?.role === 'seeker' && (
              <Card glass className="p-6 border-border/50">
                <h2 className="text-xl font-bold mb-6 text-foreground border-b border-border pb-2">Portfolio & Links</h2>
                <div className="space-y-4">
                  <Input 
                    label="GitHub Profile" 
                    type="url" 
                    name="github" 
                    value={formData.portfolio.github} 
                    onChange={handlePortfolioChange} 
                    placeholder="https://github.com/username" 
                  />
                  <Input 
                    label="LinkedIn Profile" 
                    type="url" 
                    name="linkedin" 
                    value={formData.portfolio.linkedin} 
                    onChange={handlePortfolioChange} 
                    placeholder="https://linkedin.com/in/username" 
                  />
                  <Input 
                    label="Personal Website" 
                    type="url" 
                    name="website" 
                    value={formData.portfolio.website} 
                    onChange={handlePortfolioChange} 
                    placeholder="https://yourwebsite.com" 
                  />
                </div>
              </Card>
            )}

            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={loading} size="lg" className="shadow-glow">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Resume Viewer Modal */}
      {showResumeModal && user?.resume?.url && (
        <ResumeViewerModal
          isOpen={showResumeModal}
          onClose={() => setShowResumeModal(false)}
          resumeUrl={user.resume.url}
          candidateName="Your"
        />
      )}
    </div>
    </div>
  );
};


export default Profile;
