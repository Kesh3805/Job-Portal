import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { FiBell, FiMail, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import Button from '../common/Button';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            JobPortal
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/jobs" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Find Jobs
            </Link>
            {isAuthenticated && user?.role === 'recruiter' && (
              <Link to="/dashboard/post-job" className="text-muted-foreground hover:text-primary font-medium transition-colors">
                Post Job
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard/notifications" className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
                  <FiBell size={20} />
                  <span className="absolute top-1 right-1 bg-destructive text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-background">
                    3
                  </span>
                </Link>
                <Link to="/dashboard/messages" className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
                  <FiMail size={20} />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1 rounded-full border border-transparent hover:border-border transition-all">
                    {user?.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-background"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold ring-2 ring-background">
                        {user?.name?.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground hidden lg:block">{user?.name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-glow py-2 hidden group-hover:block animate-fade-in">
                    <div className="px-4 py-2 border-b border-border mb-2">
                      <p className="text-sm font-bold text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                      <FiUser className="inline mr-2" />
                      Dashboard
                    </Link>
                    <Link to="/dashboard/profile" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                      <FiUser className="inline mr-2" />
                      Profile
                    </Link>
                    <div className="border-t border-border my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <FiLogOut className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="shadow-glow">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
