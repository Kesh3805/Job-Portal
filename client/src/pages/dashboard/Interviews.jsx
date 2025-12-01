import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { 
  FiCalendar, FiClock, FiVideo, FiPhone, FiMapPin, 
  FiUser, FiBriefcase, FiFilter, FiSearch 
} from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const Interviews = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [statusFilter, setStatusFilter] = useState('all'); // all, scheduled, completed, cancelled
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, [filter, statusFilter]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter === 'upcoming') {
        params.upcoming = true;
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const { data } = await api.get('/interviews', { params });
      setInterviews(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
      toast.error('Failed to load interviews');
      setLoading(false);
    }
  };

  const getInterviewIcon = (type) => {
    const icons = {
      phone: <FiPhone className="text-blue-500" />,
      video: <FiVideo className="text-purple-500" />,
      'in-person': <FiMapPin className="text-green-500" />,
      technical: <FiBriefcase className="text-orange-500" />,
      hr: <FiUser className="text-pink-500" />
    };
    return icons[type] || <FiCalendar />;
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      rescheduled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'no-show': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };

    const labels = {
      scheduled: 'Scheduled',
      rescheduled: 'Rescheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
      'no-show': 'No Show'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const isUpcoming = (date, time) => {
    const interviewDateTime = new Date(`${date}T${time}`);
    return interviewDateTime > new Date();
  };

  const filteredInterviews = interviews.filter(interview => {
    const searchString = searchQuery.toLowerCase();
    const jobTitle = interview.job?.title?.toLowerCase() || '';
    const candidateName = user.role === 'recruiter' 
      ? interview.applicant?.name?.toLowerCase() || ''
      : interview.interviewer?.name?.toLowerCase() || '';
    
    return jobTitle.includes(searchString) || candidateName.includes(searchString);
  });

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-display font-bold text-foreground">
            {user.role === 'recruiter' ? 'Interview Schedule' : 'My Interviews'}
          </h1>
        </div>

        {/* Filters */}
        <Card className="mb-6 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by job title or name..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Time Filter */}
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                onClick={() => setFilter('all')}
                className="flex items-center gap-2"
              >
                <FiFilter size={16} />
                All
              </Button>
              <Button
                variant={filter === 'upcoming' ? 'primary' : 'outline'}
                onClick={() => setFilter('upcoming')}
                className="flex items-center gap-2"
              >
                <FiCalendar size={16} />
                Upcoming
              </Button>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="rescheduled">Rescheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </Card>

        {/* Interviews List */}
        {loading ? (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </Card>
        ) : filteredInterviews.length > 0 ? (
          <div className="space-y-4">
            {filteredInterviews.map((interview) => (
              <Card key={interview._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Date Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-primary/10 rounded-lg flex flex-col items-center justify-center text-primary">
                      <span className="text-2xl font-bold">
                        {new Date(interview.scheduledDate).getDate()}
                      </span>
                      <span className="text-xs uppercase">
                        {new Date(interview.scheduledDate).toLocaleString('en-US', { month: 'short' })}
                      </span>
                    </div>
                  </div>

                  {/* Interview Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {getInterviewIcon(interview.type)}
                          <h3 className="text-xl font-semibold text-foreground">
                            {interview.job?.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2">
                          <FiUser size={14} />
                          {user.role === 'recruiter' 
                            ? `Candidate: ${interview.applicant?.name}`
                            : `Interviewer: ${interview.interviewer?.name || 'TBD'}`
                          }
                        </p>
                      </div>
                      {getStatusBadge(interview.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FiCalendar />
                        <span className="text-sm">{formatDate(interview.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FiClock />
                        <span className="text-sm">{formatTime(interview.scheduledTime)} ({interview.duration} min)</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {getInterviewIcon(interview.type)}
                        <span className="text-sm capitalize">{interview.type.replace('-', ' ')}</span>
                      </div>
                    </div>

                    {/* Meeting Link or Location */}
                    {interview.meetingLink && (
                      <div className="mb-4">
                        <a 
                          href={interview.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm flex items-center gap-2"
                        >
                          <FiVideo />
                          Join Meeting
                        </a>
                      </div>
                    )}
                    {interview.location && (
                      <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
                        <FiMapPin />
                        {interview.location}
                      </div>
                    )}

                    {/* Agenda */}
                    {interview.agenda && (
                      <div className="mb-4">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">Agenda:</span> {interview.agenda}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 flex-wrap">
                      {isUpcoming(interview.scheduledDate, interview.scheduledTime) && interview.status === 'scheduled' && (
                        <>
                          {interview.meetingLink && (
                            <Button
                              size="sm"
                              onClick={() => window.open(interview.meetingLink, '_blank')}
                              className="flex items-center gap-2"
                            >
                              <FiVideo />
                              Join Interview
                            </Button>
                          )}
                        </>
                      )}
                      {interview.status === 'completed' && user.role === 'recruiter' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/dashboard/interviews/${interview._id}/feedback`)}
                        >
                          {interview.feedback ? 'View Feedback' : 'Add Feedback'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <FiCalendar size={40} />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">No Interviews Found</h2>
              <p className="text-muted-foreground max-w-md">
                {searchQuery 
                  ? 'No interviews match your search criteria.'
                  : filter === 'upcoming' 
                    ? 'You have no upcoming interviews scheduled.'
                    : 'No interviews have been scheduled yet.'
                }
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Interviews;
