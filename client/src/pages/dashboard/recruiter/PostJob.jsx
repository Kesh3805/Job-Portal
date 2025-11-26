import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createJob } from '../../../features/jobs/jobSlice';
import { toast } from 'react-toastify';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Badge from '../../../components/common/Badge';
import { FiPlus, FiX, FiBriefcase, FiDollarSign, FiList, FiCheckCircle, FiCalendar } from 'react-icons/fi';

const PostJob = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    locationType: 'onsite',
    employmentType: 'full-time',
    category: 'Technology',
    experienceLevel: 'mid',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    salaryPeriod: 'yearly',
    skills: [],
    requirements: [],
    responsibilities: [],
    benefits: [],
    openings: 1,
    applicationDeadline: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addItem = (field, value, setValue) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setValue('');
    }
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const jobData = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      locationType: formData.locationType,
      employmentType: formData.employmentType,
      category: formData.category,
      experienceLevel: formData.experienceLevel,
      salary: formData.salaryMin ? {
        min: parseInt(formData.salaryMin),
        max: parseInt(formData.salaryMax),
        currency: formData.salaryCurrency,
        period: formData.salaryPeriod
      } : undefined,
      skills: formData.skills,
      requirements: formData.requirements,
      responsibilities: formData.responsibilities,
      benefits: formData.benefits,
      openings: parseInt(formData.openings),
      applicationDeadline: formData.applicationDeadline || undefined
    };

    try {
      await dispatch(createJob(jobData)).unwrap();
      toast.success('Job posted successfully!');
      navigate('/dashboard/my-jobs');
    } catch (error) {
      toast.error(error.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Post a New Job</h1>
            <p className="text-muted-foreground">Create a new job listing to find the perfect candidate.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card glass className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <FiBriefcase size={24} />
                </div>
                <h2 className="text-xl font-display font-bold text-foreground">Basic Information</h2>
              </div>
              
              <div className="space-y-6">
                <Input
                  label="Job Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Frontend Developer"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Job Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className="w-full bg-background/50 border border-input rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                    placeholder="Describe the role, team, and what makes this opportunity great..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. New York, NY"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Location Type <span className="text-destructive">*</span>
                    </label>
                    <select 
                      name="locationType" 
                      value={formData.locationType} 
                      onChange={handleChange} 
                      className="w-full bg-background/50 border border-input rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    >
                      <option value="onsite">On-site</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Employment Type <span className="text-destructive">*</span>
                    </label>
                    <select 
                      name="employmentType" 
                      value={formData.employmentType} 
                      onChange={handleChange} 
                      className="w-full bg-background/50 border border-input rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Category <span className="text-destructive">*</span>
                    </label>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange} 
                      className="w-full bg-background/50 border border-input rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    >
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Design">Design</option>
                      <option value="Engineering">Engineering</option>
                      <option value="HR">HR</option>
                      <option value="Customer Service">Customer Service</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Experience Level <span className="text-destructive">*</span>
                    </label>
                    <select 
                      name="experienceLevel" 
                      value={formData.experienceLevel} 
                      onChange={handleChange} 
                      className="w-full bg-background/50 border border-input rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    >
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="lead">Lead</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>

                  <Input
                    label="Number of Openings"
                    type="number"
                    name="openings"
                    value={formData.openings}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              </div>
            </Card>

            {/* Salary */}
            <Card glass className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <FiDollarSign size={24} />
                </div>
                <h2 className="text-xl font-display font-bold text-foreground">Salary Information (Optional)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Input
                  label="Minimum"
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  placeholder="50000"
                />
                <Input
                  label="Maximum"
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  placeholder="80000"
                />
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Currency</label>
                  <select 
                    name="salaryCurrency" 
                    value={formData.salaryCurrency} 
                    onChange={handleChange} 
                    className="w-full bg-background/50 border border-input rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Period</label>
                  <select 
                    name="salaryPeriod" 
                    value={formData.salaryPeriod} 
                    onChange={handleChange} 
                    className="w-full bg-background/50 border border-input rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Skills */}
            <Card glass className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <FiList size={24} />
                </div>
                <h2 className="text-xl font-display font-bold text-foreground">Required Skills</h2>
              </div>

              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('skills', newSkill, setNewSkill))}
                    placeholder="e.g. React, Node.js, Python..."
                  />
                </div>
                <Button type="button" onClick={() => addItem('skills', newSkill, setNewSkill)} className="h-[50px]">
                  <FiPlus />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10 border-primary/20 text-primary pl-3 pr-1 py-1 flex items-center gap-2">
                    {skill}
                    <button type="button" onClick={() => removeItem('skills', index)} className="hover:bg-primary/20 rounded-full p-1 transition-colors">
                      <FiX size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Requirements */}
            <Card glass className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <FiCheckCircle size={24} />
                </div>
                <h2 className="text-xl font-display font-bold text-foreground">Requirements</h2>
              </div>

              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('requirements', newRequirement, setNewRequirement))}
                    placeholder="e.g. 5+ years of experience in..."
                  />
                </div>
                <Button type="button" onClick={() => addItem('requirements', newRequirement, setNewRequirement)} className="h-[50px]">
                  <FiPlus />
                </Button>
              </div>
              <ul className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 group">
                    <span className="flex-1 text-muted-foreground">{req}</span>
                    <button type="button" onClick={() => removeItem('requirements', index)} className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                      <FiX size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Responsibilities */}
            <Card glass className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <FiList size={24} />
                </div>
                <h2 className="text-xl font-display font-bold text-foreground">Responsibilities</h2>
              </div>

              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <Input
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('responsibilities', newResponsibility, setNewResponsibility))}
                    placeholder="e.g. Design and develop scalable applications..."
                  />
                </div>
                <Button type="button" onClick={() => addItem('responsibilities', newResponsibility, setNewResponsibility)} className="h-[50px]">
                  <FiPlus />
                </Button>
              </div>
              <ul className="space-y-2">
                {formData.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 group">
                    <span className="flex-1 text-muted-foreground">{resp}</span>
                    <button type="button" onClick={() => removeItem('responsibilities', index)} className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                      <FiX size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Benefits */}
            <Card glass className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <FiCheckCircle size={24} />
                </div>
                <h2 className="text-xl font-display font-bold text-foreground">Benefits</h2>
              </div>

              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('benefits', newBenefit, setNewBenefit))}
                    placeholder="e.g. Health Insurance, Remote Work..."
                  />
                </div>
                <Button type="button" onClick={() => addItem('benefits', newBenefit, setNewBenefit)} className="h-[50px]">
                  <FiPlus />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.benefits.map((benefit, index) => (
                  <Badge key={index} variant="success" className="bg-green-500/10 border-green-500/20 text-green-400 pl-3 pr-1 py-1 flex items-center gap-2">
                    {benefit}
                    <button type="button" onClick={() => removeItem('benefits', index)} className="hover:bg-green-500/20 rounded-full p-1 transition-colors">
                      <FiX size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Application Deadline */}
            <Card glass className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <FiCalendar size={24} />
                </div>
                <h2 className="text-xl font-display font-bold text-foreground">Application Deadline (Optional)</h2>
              </div>

              <Input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="shadow-glow">
                {loading ? 'Posting...' : 'Post Job'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
