import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;

    const query = { recipient: req.user.id };

    if (unread === 'true') {
      query.isRead = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await Notification.find(query)
      .populate('sender', 'name avatar')
      .populate('relatedJob', 'title')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user.id, 
      isRead: false 
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    notification.isRead = true;
    notification.readAt = Date.now();
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true, readAt: Date.now() }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    next(error);
  }
};
