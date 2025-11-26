import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  attachments: [{
    url: String,
    publicId: String,
    fileName: String,
    fileType: String
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date
}, {
  timestamps: true
});

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  timestamps: true
});

// Index for finding conversations between two users
conversationSchema.index({ participants: 1 });

const Message = mongoose.model('Message', messageSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);

export { Message, Conversation };
