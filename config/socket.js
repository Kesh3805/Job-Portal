/**
 * Socket.io Real-Time Communication System
 * Implements bidirectional chat with typing indicators, read receipts,
 * online status, and message persistence
 */

import { Server } from 'socket.io';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

// Store active users and their socket IDs
const activeUsers = new Map();

// Store typing users
const typingUsers = new Map();

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // User joins with their ID
    socket.on('user:join', async (userId) => {
      try {
        activeUsers.set(userId, socket.id);
        socket.userId = userId;
        
        // Update user's last seen
        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          lastSeen: new Date()
        });

        // Notify all users about online status
        io.emit('user:status', {
          userId,
          isOnline: true,
          lastSeen: new Date()
        });

        console.log(`👤 User ${userId} joined`);

        // Send list of online users
        const onlineUsers = Array.from(activeUsers.keys());
        socket.emit('users:online', onlineUsers);
      } catch (error) {
        console.error('Error in user:join:', error);
      }
    });

    // Join a conversation room
    socket.on('conversation:join', async (conversationId) => {
      try {
        socket.join(`conversation:${conversationId}`);
        console.log(`💬 User ${socket.userId} joined conversation ${conversationId}`);

        // Mark messages as read
        if (socket.userId) {
          await Message.updateMany(
            {
              conversation: conversationId,
              sender: { $ne: socket.userId },
              readBy: { $ne: socket.userId }
            },
            {
              $addToSet: { readBy: socket.userId }
            }
          );

          // Notify other participants
          socket.to(`conversation:${conversationId}`).emit('messages:read', {
            conversationId,
            userId: socket.userId
          });
        }
      } catch (error) {
        console.error('Error in conversation:join:', error);
      }
    });

    // Leave a conversation room
    socket.on('conversation:leave', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`👋 User ${socket.userId} left conversation ${conversationId}`);
    });

    // Send a message
    socket.on('message:send', async (data) => {
      try {
        const { conversationId, content, senderId } = data;

        // Create message in database
        const message = await Message.create({
          conversation: conversationId,
          sender: senderId,
          content,
          readBy: [senderId]
        });

        // Populate sender info
        await message.populate('sender', 'name avatar');

        // Update conversation's last message
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          updatedAt: new Date()
        });

        // Emit to all users in the conversation
        io.to(`conversation:${conversationId}`).emit('message:receive', {
          conversationId,
          message
        });

        // Stop typing indicator
        typingUsers.delete(`${conversationId}-${senderId}`);
        io.to(`conversation:${conversationId}`).emit('typing:stop', {
          conversationId,
          userId: senderId
        });

        console.log(`📨 Message sent in conversation ${conversationId}`);
      } catch (error) {
        console.error('Error in message:send:', error);
        socket.emit('message:error', {
          error: 'Failed to send message'
        });
      }
    });

    // Typing indicator
    socket.on('typing:start', (data) => {
      const { conversationId, userId } = data;
      const key = `${conversationId}-${userId}`;
      
      typingUsers.set(key, Date.now());
      
      socket.to(`conversation:${conversationId}`).emit('typing:start', {
        conversationId,
        userId
      });
    });

    socket.on('typing:stop', (data) => {
      const { conversationId, userId } = data;
      const key = `${conversationId}-${userId}`;
      
      typingUsers.delete(key);
      
      socket.to(`conversation:${conversationId}`).emit('typing:stop', {
        conversationId,
        userId
      });
    });

    // Mark messages as read
    socket.on('messages:mark-read', async (data) => {
      try {
        const { conversationId, userId } = data;

        await Message.updateMany(
          {
            conversation: conversationId,
            sender: { $ne: userId },
            readBy: { $ne: userId }
          },
          {
            $addToSet: { readBy: userId }
          }
        );

        // Notify other participants
        socket.to(`conversation:${conversationId}`).emit('messages:read', {
          conversationId,
          userId
        });
      } catch (error) {
        console.error('Error in messages:mark-read:', error);
      }
    });

    // Send notification
    socket.on('notification:send', async (data) => {
      try {
        const { userId, notification } = data;
        const userSocketId = activeUsers.get(userId);

        if (userSocketId) {
          io.to(userSocketId).emit('notification:receive', notification);
        }
      } catch (error) {
        console.error('Error in notification:send:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        if (socket.userId) {
          activeUsers.delete(socket.userId);
          
          // Clear typing indicators
          typingUsers.forEach((value, key) => {
            if (key.endsWith(`-${socket.userId}`)) {
              typingUsers.delete(key);
            }
          });

          // Update user's online status
          await User.findByIdAndUpdate(socket.userId, {
            isOnline: false,
            lastSeen: new Date()
          });

          // Notify all users about offline status
          io.emit('user:status', {
            userId: socket.userId,
            isOnline: false,
            lastSeen: new Date()
          });

          console.log(`❌ User ${socket.userId} disconnected`);
        } else {
          console.log(`❌ Socket ${socket.id} disconnected`);
        }
      } catch (error) {
        console.error('Error in disconnect:', error);
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Clean up stale typing indicators every 10 seconds
  setInterval(() => {
    const now = Date.now();
    const timeout = 10000; // 10 seconds

    typingUsers.forEach((timestamp, key) => {
      if (now - timestamp > timeout) {
        typingUsers.delete(key);
        const [conversationId, userId] = key.split('-');
        io.to(`conversation:${conversationId}`).emit('typing:stop', {
          conversationId,
          userId
        });
      }
    });
  }, 10000);

  return io;
};

export default initializeSocket;
