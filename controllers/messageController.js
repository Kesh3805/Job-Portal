import { Message, Conversation } from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get or create conversation
// @route   POST /api/messages/conversation
// @access  Private
export const getOrCreateConversation = async (req, res, next) => {
  try {
    const { participantId, jobId, applicationId } = req.body;

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, participantId] }
    }).populate('participants', 'name avatar role')
      .populate('lastMessage');

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [req.user.id, participantId],
        job: jobId,
        application: applicationId,
        unreadCount: { [req.user.id]: 0, [participantId]: 0 }
      });

      conversation = await conversation.populate('participants', 'name avatar role');
    }

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    }).populate('participants', 'name avatar role')
      .populate('lastMessage')
      .sort('-updatedAt');

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages in conversation
// @route   GET /api/messages/:conversationId
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check authorization
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages.reverse()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content, receiverId } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      receiver: receiverId,
      content
    });

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.unreadCount.set(receiverId, (conversation.unreadCount.get(receiverId) || 0) + 1);
    await conversation.save();

    // Populate message
    await message.populate('sender', 'name avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(`conversation:${conversationId}`).emit('new-message', message);

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/:conversationId/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Update unread messages
    await Message.updateMany(
      { conversation: conversationId, receiver: req.user.id, isRead: false },
      { isRead: true, readAt: Date.now() }
    );

    // Reset unread count
    conversation.unreadCount.set(req.user.id, 0);
    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    next(error);
  }
};
