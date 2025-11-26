import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(login(formData)).unwrap();
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Login failed');
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
            Welcome Back
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sign in to access your professional dashboard
          </p>
        </div>

        <Card glass className="p-8 shadow-glow border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Email address"
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-input rounded cursor-pointer bg-background"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full shadow-glow hover:shadow-glow-lg"
              size="lg"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Create a new account
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
