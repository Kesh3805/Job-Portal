import React from 'react';
import Card from '../../components/common/Card';
import { FiBookmark } from 'react-icons/fi';

const SavedJobs = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Saved Jobs</h1>
        
        <Card glass className="p-12 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <FiBookmark size={40} />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">No Saved Jobs</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            You haven't saved any jobs yet. Bookmark jobs you're interested in to view them here later.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SavedJobs;
