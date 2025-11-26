import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-white/10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-2xl font-display font-bold text-foreground flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              JobPortal
            </Link>
            <p className="text-sm text-muted-foreground">
              Connect with opportunities and build your career with the leading job portal.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"><FiFacebook size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"><FiTwitter size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"><FiLinkedin size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"><FiInstagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-display font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="text-muted-foreground hover:text-primary transition-colors">Browse Jobs</Link></li>
              <li><Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">Create Account</Link></li>
              <li><Link to="/dashboard/saved-jobs" className="text-muted-foreground hover:text-primary transition-colors">Saved Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-display font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard/post-job" className="text-muted-foreground hover:text-primary transition-colors">Post a Job</Link></li>
              <li><Link to="/dashboard/company" className="text-muted-foreground hover:text-primary transition-colors">Company Profile</Link></li>
              <li><Link to="/dashboard/my-jobs" className="text-muted-foreground hover:text-primary transition-colors">Manage Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-sm text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
