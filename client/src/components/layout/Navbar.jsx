import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { FiBell, FiMail, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../common/Button';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 backdrop-blur-xl shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-display font-bold text-foreground flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 hover-glow">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            JobPortal
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/jobs" className="text-muted-foreground hover:text-primary font-medium transition-colors relative group">
              <span>Find Jobs</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-primary font-medium transition-colors relative group">
              <span>Pricing</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {isAuthenticated && user?.role === 'recruiter' && (
              <Link to="/dashboard/post-job" className="text-muted-foreground hover:text-primary font-medium transition-colors relative group">
                <span>Post Job</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="text-muted-foreground hover:text-primary font-medium transition-colors relative group">
                <span>Admin Panel</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard/notifications" className="relative p-2 text-muted-foreground hover:text-primary transition-colors hover-scale">
                  <FiBell size={20} />
                  <span className="absolute top-1 right-1 bg-destructive text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                    3
                  </span>
                </Link>
                <Link to="/dashboard/messages" className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
                  <FiMail size={20} />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-secondary transition-all">
                    {user?.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground hidden lg:block">{user?.name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg py-2 hidden group-hover:block">
                    <div className="px-4 py-3 border-b border-border mb-2">
                      <p className="text-sm font-bold text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      <span className={`inline-block mt-1.5 text-xs px-2 py-1 rounded-full ${
                        user?.role === 'admin' ? 'bg-red-100 text-red-700' :
                        user?.role === 'recruiter' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {user?.role}
                      </span>
                    </div>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                      <FiUser className="inline mr-2" />
                      Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                        <FiUser className="inline mr-2" />
                        Admin Panel
                      </Link>
                    )}
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
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="shadow-lg">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
