import React from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { FiBriefcase, FiMapPin, FiGlobe, FiSave } from 'react-icons/fi';

const CompanyProfile = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Company Profile</h1>
        
        <form className="space-y-6">
          <Card glass className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <FiBriefcase className="mr-2 text-primary" /> Company Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company Name</label>
                <Input placeholder="e.g. TechCorp Inc." />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Website</label>
                <div className="relative">
                  <FiGlobe className="absolute left-3 top-3 text-muted-foreground" />
                  <Input className="pl-10" placeholder="https://example.com" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Tagline</label>
                <Input placeholder="e.g. Building the future of tech" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">About Company</label>
                <textarea 
                  className="w-full bg-background/50 border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[150px]"
                  placeholder="Tell us about your company culture, mission, and values..."
                ></textarea>
              </div>
            </div>
          </Card>

          <Card glass className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <FiMapPin className="mr-2 text-primary" /> Location & Contact
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Headquarters</label>
                <Input placeholder="e.g. San Francisco, CA" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company Size</label>
                <select className="w-full bg-background/50 border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>51-200 employees</option>
                  <option>201-500 employees</option>
                  <option>500+ employees</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button size="lg" className="shadow-glow">
              <FiSave className="mr-2" /> Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;
