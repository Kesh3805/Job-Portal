import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { 
  FiMessageSquare, FiSearch, FiSend, FiUser, FiMoreVertical,
  FiPaperclip, FiCheck, FiCheckCircle
} from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const Messages = () => {
  const { user } = useSelector((state) => state.auth);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Auto-select conversation if redirected from message button
  useEffect(() => {
    const openConversationId = localStorage.getItem('openConversationId');
    if (openConversationId && conversations.length > 0) {
      const conversation = conversations.find(conv => conv._id === openConversationId);
      if (conversation) {
        setSelectedConversation(conversation);
        localStorage.removeItem('openConversationId');
      }
    }
  }, [conversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      markAsRead(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/messages/conversations');
      console.log('Conversations:', data.data);
      console.log('Current user:', user);
      setConversations(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      toast.error('Failed to load conversations');
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const { data } = await api.get(`/messages/${conversationId}`);
      setMessages(data.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const markAsRead = async (conversationId) => {
    try {
      await api.put(`/messages/${conversationId}/read`);
      setConversations(prev => 
        prev.map(conv => 
          conv._id === conversationId 
            ? { ...conv, unreadCount: { ...conv.unreadCount, [user.id]: 0 } }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const currentUserId = user.id || user._id;
      const otherParticipant = selectedConversation.participants.find(p => {
        const participantId = p._id || p;
        return participantId !== currentUserId;
      });
      
      const { data } = await api.post('/messages', {
        conversationId: selectedConversation._id,
        content: newMessage,
        receiverId: otherParticipant._id || otherParticipant
      });

      setMessages(prev => [...prev, data.data]);
      setNewMessage('');
      fetchConversations();
      setSending(false);
    } catch (error) {
      toast.error('Failed to send message');
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherParticipant = (conversation) => {
    // Get current user ID (could be user.id or user._id depending on Redux state)
    const currentUserId = user.id || user._id;
    return conversation.participants.find(p => {
      const participantId = p._id || p;
      return participantId !== currentUserId;
    });
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = getOtherParticipant(conv);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-display font-bold text-foreground">Messages</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 220px)' }}>
          {/* Conversations List */}
          <Card className="col-span-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredConversations.length > 0 ? (
                <div className="divide-y divide-border">
                  {filteredConversations.map((conversation) => {
                    const otherParticipant = getOtherParticipant(conversation);
                    const unreadCount = conversation.unreadCount?.[user.id] || 0;

                    return (
                      <button
                        key={conversation._id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`w-full p-4 hover:bg-muted transition-colors text-left ${
                          selectedConversation?._id === conversation._id ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {otherParticipant?.avatar?.url ? (
                            <img
                              src={otherParticipant.avatar.url}
                              alt={otherParticipant.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {otherParticipant?.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-foreground truncate">
                                {otherParticipant?.name}
                              </h3>
                              {conversation.lastMessage && (
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(conversation.updatedAt)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessage?.content || 'Start a conversation'}
                              </p>
                              {unreadCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <FiMessageSquare size={48} className="text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No conversations found' : 'No conversations yet'}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="col-span-1 lg:col-span-2 flex flex-col overflow-hidden">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getOtherParticipant(selectedConversation)?.avatar?.url ? (
                      <img
                        src={getOtherParticipant(selectedConversation).avatar.url}
                        alt={getOtherParticipant(selectedConversation).name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {getOtherParticipant(selectedConversation)?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {getOtherParticipant(selectedConversation)?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {getOtherParticipant(selectedConversation)?.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length > 0 ? (
                    <>
                      {messages.map((message) => {
                        // Check if this message is from the current user
                        const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
                        const isOwn = senderId === user.id || senderId === user._id;
                        
                        return (
                          <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-end gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                              {!isOwn && (
                                typeof message.sender === 'object' && message.sender.avatar?.url ? (
                                  <img src={message.sender.avatar.url} alt={message.sender.name} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                    {typeof message.sender === 'object' && message.sender.name ? message.sender.name.charAt(0) : 'U'}
                                  </div>
                                )
                              )}
                              <div>
                                <div className={`px-4 py-2 rounded-2xl ${
                                  isOwn 
                                    ? 'bg-primary text-white rounded-br-none' 
                                    : 'bg-muted text-foreground rounded-bl-none'
                                }`}>
                                  <p className="text-sm break-words">{message.content}</p>
                                </div>
                                <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(message.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                  </span>
                                  {isOwn && (
                                    message.isRead 
                                      ? <FiCheckCircle size={12} className="text-white" /> 
                                      : <FiCheck size={12} className="text-white/70" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-center">
                      <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 bg-muted border-0 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sending}
                    />
                    <Button type="submit" disabled={!newMessage.trim() || sending} className="px-4">
                      <FiSend />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                  <FiMessageSquare size={40} />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Select a Conversation</h2>
                <p className="text-muted-foreground max-w-md">
                  Choose a conversation from the list to start chatting with {user.role === 'recruiter' ? 'candidates' : 'recruiters'}.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
