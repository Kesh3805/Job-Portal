const users = new Map(); // userId -> socketId
const sockets = new Map(); // socketId -> userId

export const initializeSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User authentication
    socket.on('authenticate', (userId) => {
      users.set(userId, socket.id);
      sockets.set(socket.id, userId);
      console.log(`User ${userId} authenticated with socket ${socket.id}`);
      
      // Join user's personal room
      socket.join(`user:${userId}`);
    });

    // Join conversation room
    socket.on('join-conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave-conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`Socket ${socket.id} left conversation ${conversationId}`);
    });

    // Send message
    socket.on('send-message', (data) => {
      const { conversationId, message } = data;
      io.to(`conversation:${conversationId}`).emit('new-message', message);
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { conversationId, userId } = data;
      socket.to(`conversation:${conversationId}`).emit('user-typing', { userId });
    });

    // Stop typing indicator
    socket.on('stop-typing', (data) => {
      const { conversationId, userId } = data;
      socket.to(`conversation:${conversationId}`).emit('user-stop-typing', { userId });
    });

    // Mark message as read
    socket.on('message-read', (data) => {
      const { conversationId, messageId, userId } = data;
      io.to(`conversation:${conversationId}`).emit('message-read-update', { messageId, userId });
    });

    // Disconnect
    socket.on('disconnect', () => {
      const userId = sockets.get(socket.id);
      if (userId) {
        users.delete(userId);
        sockets.delete(socket.id);
        console.log(`User ${userId} disconnected`);
      }
    });
  });
};

// Helper functions to emit events from controllers
export const emitNotification = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('new-notification', notification);
};

export const emitApplicationUpdate = (io, userId, application) => {
  io.to(`user:${userId}`).emit('application-update', application);
};

export const emitJobUpdate = (io, userId, job) => {
  io.to(`user:${userId}`).emit('job-update', job);
};

export const getOnlineUsers = () => {
  return Array.from(users.keys());
};

export const isUserOnline = (userId) => {
  return users.has(userId);
};
