import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'seeker'
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
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
      const { confirmPassword, ...registerData } = formData;
      await dispatch(register(registerData)).unwrap();
      toast.success('Registration successful! Please verify your email.');
      
      // Wait a bit for state to update before navigating
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
        setLoading(false);
      }, 100);
    } catch (error) {
      toast.error(error || 'Registration failed');
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
            Create Account
          </h2>
          <p className="mt-2 text-muted-foreground">
            Join thousands of professionals today
          </p>
        </div>

        <Card glass className="p-8 shadow-glow border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Full Name"
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />

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

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-foreground/80 mb-1.5">
                  I am a
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer transition-all text-foreground hover:border-primary/50"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="seeker">Job Seeker</option>
                    <option value="recruiter">Recruiter/Employer</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

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

              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full shadow-glow hover:shadow-glow-lg"
              size="lg"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign in instead
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
