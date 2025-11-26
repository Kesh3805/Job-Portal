import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FiBell, FiCheck } from 'react-icons/fi';

const Notifications = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Notifications</h1>
          <Button variant="ghost" size="sm">
            <FiCheck className="mr-2" /> Mark all as read
          </Button>
        </div>

        <Card glass className="p-12 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <FiBell size={40} />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">No New Notifications</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            You're all caught up! We'll notify you when there are updates to your applications or jobs.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
