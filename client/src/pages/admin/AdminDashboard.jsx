import React from 'react';
import Card from '../../components/common/Card';
import { FiUsers, FiBriefcase, FiActivity, FiSettings } from 'react-icons/fi';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card glass className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Total Users</h3>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <FiUsers size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">1,234</div>
            <p className="text-sm text-muted-foreground">+12% from last month</p>
          </Card>

          <Card glass className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Total Jobs</h3>
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <FiBriefcase size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">567</div>
            <p className="text-sm text-muted-foreground">+5% from last month</p>
          </Card>

          <Card glass className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Active Sessions</h3>
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <FiActivity size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">89</div>
            <p className="text-sm text-muted-foreground">Currently online</p>
          </Card>

          <Card glass className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">System Status</h3>
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                <FiSettings size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">Healthy</div>
            <p className="text-sm text-muted-foreground">All systems operational</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card glass className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Recent Registrations</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      U{i}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">User {i}</p>
                      <p className="text-xs text-muted-foreground">user{i}@example.com</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
              ))}
            </div>
          </Card>

          <Card glass className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Recent Jobs</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                      J{i}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Job Position {i}</p>
                      <p className="text-xs text-muted-foreground">Company {i}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500">Active</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
