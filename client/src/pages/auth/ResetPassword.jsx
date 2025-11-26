import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import api from '../../utils/api';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.put(`/auth/resetpassword/${token}`, { password: formData.password });
      toast.success('Password reset successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold text-foreground tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-muted-foreground">
            Create a new strong password for your account
          </p>
        </div>

        <Card glass className="p-8 shadow-glow border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="New Password"
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />

            <Input
              label="Confirm New Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <Button
              type="submit"
              isLoading={loading}
              className="w-full shadow-glow hover:shadow-glow-lg"
              size="lg"
            >
              Reset Password
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
