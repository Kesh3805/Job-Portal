import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await api.put('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Avatar uploaded successfully!');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await api.put('/users/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Resume uploaded successfully!');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
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
                <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
                  <a 
                    href={user.resume.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    View Current Resume
                  </a>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4 italic">No resume uploaded yet</p>
              )}
              
              <label className="block">
                <Button variant="outline" className="w-full" as="span">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  Upload New Resume
                </Button>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
              </label>
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
    </div>
    </div>
  );
};

export default Profile;
