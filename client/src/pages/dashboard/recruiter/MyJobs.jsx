import React from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiPlus } from 'react-icons/fi';

const MyJobs = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">My Jobs</h1>
          <Link to="/dashboard/post-job">
            <Button className="shadow-glow">
              <FiPlus className="mr-2" /> Post New Job
            </Button>
          </Link>
        </div>
        
        <Card glass className="p-12 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <FiBriefcase size={40} />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">No Jobs Posted</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            You haven't posted any jobs yet. Create your first job listing to start finding candidates.
          </p>
          <Link to="/dashboard/post-job">
            <Button variant="outline">Post a Job</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default MyJobs;
