import React from 'react';
import Card from '../../components/common/Card';

const Applications = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">My Applications</h1>
        
        <Card glass className="p-12 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">No Applications Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            You haven't applied to any jobs yet. Start browsing jobs to find your next opportunity.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Applications;
