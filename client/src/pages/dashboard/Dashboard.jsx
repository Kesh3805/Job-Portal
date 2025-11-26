import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FiBriefcase, FiBookmark, FiUser, FiArrowRight } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your job search today.</p>
        </div>
        <Link to="/jobs">
          <Button>Find New Jobs</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card glass className="p-6 border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Applications</h3>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <FiBriefcase size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">12</div>
          <p className="text-sm text-muted-foreground">Active applications</p>
        </Card>

        <Card glass className="p-6 border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Saved Jobs</h3>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <FiBookmark size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">5</div>
          <p className="text-sm text-muted-foreground">Jobs saved for later</p>
        </Card>

        <Card glass className="p-6 border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Profile Status</h3>
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
              <FiUser size={20} />
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: '70%' }}></div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">70% Complete</span>
            <Link to="/dashboard/profile" className="text-primary hover:underline">Complete Profile</Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 border-border/50">
          <h3 className="font-display text-xl font-bold text-foreground mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FiBriefcase />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Applied to Senior Frontend Developer</p>
                  <p className="text-xs text-muted-foreground">Tech Corp • 2 days ago</p>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0">View</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
          <h3 className="font-display text-xl font-bold text-foreground mb-4">Recommended for you</h3>
          <p className="text-muted-foreground mb-6">Based on your profile and search history.</p>
          
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-xl border border-border/50 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-foreground">Product Designer</h4>
                  <p className="text-sm text-muted-foreground">Creative Studio • Remote</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-secondary/20 text-secondary-foreground rounded-full">New</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-foreground">$80k - $120k</span>
                <Button size="sm" variant="outline">Apply Now</Button>
              </div>
            </div>
          </div>
          
          <Link to="/jobs" className="inline-flex items-center text-primary hover:text-primary/80 font-medium mt-6">
            View all recommendations <FiArrowRight className="ml-2" />
          </Link>
        </Card>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
