import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { FiCalendar, FiClock, FiVideo, FiMapPin, FiFileText } from 'react-icons/fi';

const ScheduleInterviewModal = ({ isOpen, onClose, application, onSuccess }) => {
  const [formData, setFormData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    type: 'video',
    meetingLink: '',
    location: '',
    agenda: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const interviewTypes = [
    { value: 'phone', label: 'Phone Interview', icon: '📞' },
    { value: 'video', label: 'Video Interview', icon: '🎥' },
    { value: 'in-person', label: 'In-Person', icon: '👤' },
    { value: 'technical', label: 'Technical Round', icon: '💻' },
    { value: 'hr', label: 'HR Round', icon: '💼' }
  ];

  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.scheduledDate || !formData.scheduledTime) {
      toast.error('Please select date and time');
      return;
    }

    if (formData.type === 'video' && !formData.meetingLink) {
      toast.error('Please provide meeting link for video interview');
      return;
    }

    if (formData.type === 'in-person' && !formData.location) {
      toast.error('Please provide location for in-person interview');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/interviews', {
        applicationId: application._id,
        ...formData
      });

      toast.success('Interview scheduled successfully!');
      onSuccess(data.data);
      onClose();
      
      // Reset form
      setFormData({
        scheduledDate: '',
        scheduledTime: '',
        duration: 60,
        type: 'video',
        meetingLink: '',
        location: '',
        agenda: '',
        notes: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Interview" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Candidate Info */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">Candidate Information</h3>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Name:</span> {application.applicant?.name}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Position:</span> {application.job?.title}
          </p>
        </div>

        {/* Interview Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Interview Type *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {interviewTypes.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                  formData.type === type.value
                    ? 'bg-primary text-white border-primary'
                    : 'bg-background border-border hover:border-primary'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-xs">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <FiCalendar className="inline mr-2" />
              Date *
            </label>
            <Input
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              min={getMinDate()}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <FiClock className="inline mr-2" />
              Time *
            </label>
            <Input
              type="time"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Duration
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {durationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Meeting Link (for video) */}
        {formData.type === 'video' && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <FiVideo className="inline mr-2" />
              Meeting Link * (Zoom, Google Meet, etc.)
            </label>
            <Input
              type="url"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={handleChange}
              placeholder="https://zoom.us/j/..."
              required
            />
          </div>
        )}

        {/* Location (for in-person) */}
        {formData.type === 'in-person' && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <FiMapPin className="inline mr-2" />
              Location *
            </label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Office address or venue"
              required
            />
          </div>
        )}

        {/* Agenda */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <FiFileText className="inline mr-2" />
            Agenda
          </label>
          <textarea
            name="agenda"
            value={formData.agenda}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Interview topics and objectives..."
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Internal Notes (not visible to candidate)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Internal notes or preparation reminders..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Scheduling...' : 'Schedule Interview'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleInterviewModal;
