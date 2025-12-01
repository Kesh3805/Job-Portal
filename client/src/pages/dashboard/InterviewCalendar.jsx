import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiCalendar, FiClock, FiMapPin, FiVideo, FiPhone, FiUsers, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const InterviewCalendar = () => {
  const { user } = useSelector((state) => state.auth);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchInterviews();
  }, [filter]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const params = filter === 'upcoming' ? { upcoming: true } : filter !== 'all' ? { status: filter } : {};
      const { data } = await api.get('/interviews', { params });
      setInterviews(data.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const getInterviewIcon = (type) => {
    switch (type) {
      case 'video':
        return <FiVideo className="text-blue-500" />;
      case 'phone':
        return <FiPhone className="text-green-500" />;
      case 'in-person':
        return <FiUsers className="text-purple-500" />;
      default:
        return <FiCalendar className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'rescheduled':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDateTime = (date, time) => {
    const dateObj = new Date(date);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return `${dateObj.toLocaleDateString('en-US', options)} at ${time}`;
  };

  const isUpcoming = (date) => {
    return new Date(date) > new Date();
  };

  const groupInterviewsByDate = () => {
    const grouped = {};
    interviews.forEach((interview) => {
      const dateKey = new Date(interview.scheduledDate).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(interview);
    });
    return grouped;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getInterviewsForDate = (date) => {
    if (!date) return [];
    const dateKey = date.toDateString();
    const grouped = groupInterviewsByDate();
    return grouped[dateKey] || [];
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">Interview Calendar</h1>
            <p className="text-muted-foreground">Manage and track your scheduled interviews</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'primary' : 'outline'}
              onClick={() => setFilter('upcoming')}
              size="sm"
            >
              Upcoming
            </Button>
            <Button
              variant={filter === 'completed' ? 'primary' : 'outline'}
              onClick={() => setFilter('completed')}
              size="sm"
            >
              Completed
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <Card glass className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevMonth}>
                  ←
                </Button>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  →
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day names */}
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {getDaysInMonth(currentMonth).map((date, index) => {
                const interviewsForDay = date ? getInterviewsForDate(date) : [];
                const isToday = date && date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className={`
                      min-h-[80px] p-2 rounded-lg border transition-all
                      ${date ? 'bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer' : 'bg-transparent border-transparent'}
                      ${isToday ? 'border-primary bg-primary/10' : ''}
                    `}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : 'text-foreground'}`}>
                          {date.getDate()}
                        </div>
                        {interviewsForDay.length > 0 && (
                          <div className="space-y-1">
                            {interviewsForDay.slice(0, 2).map((interview) => (
                              <div
                                key={interview._id}
                                className="text-xs px-2 py-1 rounded bg-primary/20 text-primary truncate"
                                title={interview.job?.title}
                                onClick={() => {
                                  setSelectedInterview(interview);
                                  setShowModal(true);
                                }}
                              >
                                {interview.scheduledTime}
                              </div>
                            ))}
                            {interviewsForDay.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{interviewsForDay.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Upcoming Interviews List */}
          <Card glass className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FiCalendar className="text-primary" />
              Upcoming Interviews
            </h2>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {interviews.filter(i => isUpcoming(i.scheduledDate)).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No upcoming interviews</p>
              ) : (
                interviews
                  .filter(i => isUpcoming(i.scheduledDate))
                  .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
                  .map((interview) => (
                    <div
                      key={interview._id}
                      className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedInterview(interview);
                        setShowModal(true);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getInterviewIcon(interview.type)}
                          <span className="font-medium text-foreground">
                            {interview.job?.title}
                          </span>
                        </div>
                        <Badge className={getStatusColor(interview.status)}>
                          {interview.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-primary" />
                          {formatDateTime(interview.scheduledDate, interview.scheduledTime)}
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock className="text-primary" />
                          {interview.duration} minutes
                        </div>
                        {interview.meetingLink && (
                          <div className="flex items-center gap-2">
                            <FiVideo className="text-primary" />
                            <span className="truncate">{interview.meetingLink}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </Card>
        </div>

        {/* Interview Details Modal */}
        {showModal && selectedInterview && (
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setSelectedInterview(null);
            }}
            title="Interview Details"
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Position</label>
                <p className="text-lg font-semibold text-foreground">{selectedInterview.job?.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Type</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getInterviewIcon(selectedInterview.type)}
                    <span className="capitalize text-foreground">{selectedInterview.type}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <Badge className={`mt-1 ${getStatusColor(selectedInterview.status)}`}>
                    {selectedInterview.status}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Date & Time</label>
                <p className="text-foreground mt-1">
                  {formatDateTime(selectedInterview.scheduledDate, selectedInterview.scheduledTime)}
                </p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Duration</label>
                <p className="text-foreground mt-1">{selectedInterview.duration} minutes</p>
              </div>

              {selectedInterview.meetingLink && (
                <div>
                  <label className="text-sm text-muted-foreground">Meeting Link</label>
                  <a
                    href={selectedInterview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline block mt-1"
                  >
                    {selectedInterview.meetingLink}
                  </a>
                </div>
              )}

              {selectedInterview.location && (
                <div>
                  <label className="text-sm text-muted-foreground">Location</label>
                  <p className="text-foreground mt-1">{selectedInterview.location}</p>
                </div>
              )}

              {selectedInterview.agenda && (
                <div>
                  <label className="text-sm text-muted-foreground">Agenda</label>
                  <p className="text-foreground mt-1">{selectedInterview.agenda}</p>
                </div>
              )}

              {user.role === 'seeker' && (
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      if (selectedInterview.meetingLink) {
                        window.open(selectedInterview.meetingLink, '_blank');
                      }
                    }}
                    disabled={!selectedInterview.meetingLink}
                  >
                    Join Interview
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedInterview(null);
                    }}
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default InterviewCalendar;
