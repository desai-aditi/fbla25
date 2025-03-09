// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Select } from 'antd';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !grade || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const success = await register(name, grade, email, password);
    if (success) {
      navigate('/portfolio');
    } else {
      setError('Registration failed. Email may already be in use.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Graphic */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[var(--color-darkgreen)] to-[var(--color-cerulean)] items-center justify-center p-12">
        <div className="text-[var(--color-white)] text-center max-w-lg">
          <h2 className="text-5xl font-bold mb-8" style={{ fontFamily: 'Fraunces' }}>Begin Your Journey</h2>
          <p className="text-xl leading-relaxed opacity-90" style={{ fontFamily: 'Libre Franklin' }}>
            Join our community of forward-thinking individuals. Start your path to financial mastery with sophisticated tools and insights.
          </p>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-12 bg-[var(--color-offwhite)]">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--color-night)] mb-3" style={{ fontFamily: 'Fraunces' }}>Create Account</h1>
            <p className="text-[var(--color-cerulean)] text-lg" style={{ fontFamily: 'Libre Franklin' }}>Begin your financial journey today</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[var(--color-night)] text-sm font-medium mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-pistachio)] bg-white transition-all duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-[var(--color-night)] text-sm font-medium mb-2" htmlFor="grade">
                Grade Level
              </label>
              <Select
                id="grade"
                className="w-full h-[46px]"
                placeholder="Select your grade"
                value={grade || undefined}
                onChange={(value) => setGrade(value)}
                options={[
                  { value: '9', label: '9th Grade' },
                  { value: '10', label: '10th Grade' },
                  { value: '11', label: '11th Grade' },
                  { value: '12', label: '12th Grade' },
                ]}
                status={!grade && error ? 'error' : undefined}
                style={{ fontFamily: 'Libre Franklin' }}
              />
            </div>
            
            <div>
              <label className="block text-[var(--color-night)] text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-pistachio)] bg-white transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-[var(--color-night)] text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-pistachio)] bg-white transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>
            
            <div>
              <label className="block text-[var(--color-night)] text-sm font-medium mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-pistachio)] bg-white transition-all duration-200"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[var(--color-darkgreen)] hover:bg-[var(--color-pistachio)] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Create Account
            </button>
          </form>
          
          <div className="text-center pt-4">
            <p className="text-[var(--color-night)]">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[var(--color-darkgreen)] hover:text-[var(--color-pistachio)] transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;