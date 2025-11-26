import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FiMessageSquare, FiSearch } from 'react-icons/fi';
import Input from '../../components/common/Input';

const Messages = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 h-[calc(100vh-140px)]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-display font-bold text-foreground">Messages</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Sidebar List */}
          <Card glass className="col-span-1 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-border/50">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-muted-foreground" />
                <Input className="pl-10" placeholder="Search messages..." />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {/* Empty State for List */}
              <div className="text-center py-8 text-muted-foreground">
                <p>No conversations yet</p>
              </div>
            </div>
          </Card>

          {/* Chat Area */}
          <Card glass className="col-span-1 lg:col-span-2 flex flex-col h-full justify-center items-center text-center p-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
              <FiMessageSquare size={40} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Select a Conversation</h2>
            <p className="text-muted-foreground max-w-md">
              Choose a conversation from the list to start chatting with recruiters or candidates.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
