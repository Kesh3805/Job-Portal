import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { 
  FiBell, FiCheck, FiCheckCircle, FiXCircle, FiCalendar, 
  FiMail, FiBriefcase, FiEye, FiTrash2, FiFilter, FiClock
} from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = filter === 'unread' ? { unread: true } : {};
      const { data } = await api.get('/notifications', { params });
      setNotifications(data.data);
      setUnreadCount(data.unreadCount);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true, readAt: new Date() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true, readAt: new Date() })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }

    // Navigate based on notification type
    if (notification.link) {
      navigate(notification.link);
    } else if (notification.relatedApplication) {
      navigate('/dashboard/applications');
    } else if (notification.relatedJob) {
      navigate(`/jobs/${notification.relatedJob._id}`);
    } else if (notification.relatedInterview) {
      navigate('/dashboard/interviews');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'application-status-changed': FiCheckCircle,
      'interview-scheduled': FiCalendar,
      'interview-reminder': FiClock,
      'new-message': FiMail,
      'job-approved': FiCheckCircle,
      'job-rejected': FiXCircle,
      'profile-viewed': FiEye,
      'new-job-match': FiBriefcase,
      'application-received': FiBell,
      'system': FiBell
    };
    return icons[type] || FiBell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      'application-status-changed': 'text-blue-500 bg-blue-500/10',
      'interview-scheduled': 'text-green-500 bg-green-500/10',
      'interview-reminder': 'text-yellow-500 bg-yellow-500/10',
      'new-message': 'text-purple-500 bg-purple-500/10',
      'job-approved': 'text-green-500 bg-green-500/10',
      'job-rejected': 'text-red-500 bg-red-500/10',
      'profile-viewed': 'text-teal-500 bg-teal-500/10',
      'new-job-match': 'text-orange-500 bg-orange-500/10',
      'application-received': 'text-blue-500 bg-blue-500/10',
      'system': 'text-gray-500 bg-gray-500/10'
    };
    return colors[type] || 'text-gray-500 bg-gray-500/10';
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              <FiBell className="mr-2" size={16} />
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
              >
                <FiCheck className="mr-2" size={16} />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </Card>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const colorClasses = getNotificationColor(notification.type);
              
              return (
                <Card
                  key={notification._id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    !notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses}`}>
                      <Icon size={24} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {notification.title}
                          {!notification.isRead && (
                            <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full"></span>
                          )}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>

                      {notification.relatedJob && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <FiBriefcase size={12} />
                          <span>{notification.relatedJob.title}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification._id);
                      }}
                      className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-red-500 flex-shrink-0"
                      title="Delete notification"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <FiBell size={40} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {filter === 'unread' 
                ? "You're all caught up! All notifications have been read."
                : "We'll notify you when there are updates to your applications, interviews, or jobs."}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;
