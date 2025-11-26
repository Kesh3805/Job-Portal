import express from 'express';
import {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  markAsRead
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/conversation', protect, getOrCreateConversation);
router.get('/conversations', protect, getConversations);
router.post('/', protect, sendMessage);
router.get('/:conversationId', protect, getMessages);
router.put('/:conversationId/read', protect, markAsRead);

export default router;
