import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import api from '../../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold text-foreground tracking-tight">
            Forgot Password
          </h2>
          <p className="mt-2 text-muted-foreground">
            Enter your email to reset your password
          </p>
        </div>

        <Card glass className="p-8 shadow-glow border-white/10">
          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email address"
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                type="submit"
                isLoading={loading}
                className="w-full shadow-glow hover:shadow-glow-lg"
                size="lg"
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Check your email</h3>
              <p className="text-muted-foreground">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="w-full mt-4"
              >
                Try another email
              </Button>
            </div>
          )}

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

export default ForgotPassword;
