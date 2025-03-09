// src/pages/LoginPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/portfolio');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Graphic */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[var(--color-darkgreen)] to-[var(--color-cerulean)] items-center justify-center p-12">
        <div className="text-[var(--color-white)] text-center max-w-lg">
          <h2 className="text-5xl font-bold mb-8" style={{ fontFamily: 'Fraunces' }}>Welcome Back</h2>
          <p className="text-xl leading-relaxed opacity-90" style={{ fontFamily: 'Libre Franklin' }}>
            Your financial journey continues here. Track your progress, make informed decisions, and achieve your goals with precision and clarity.
          </p>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-12 bg-[var(--color-offwhite)]">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--color-night)] mb-3" style={{ fontFamily: 'Fraunces' }}>Sign In</h1>
            <p className="text-[var(--color-cerulean)] text-lg" style={{ fontFamily: 'Libre Franklin' }}>Welcome back to your financial dashboard</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[var(--color-darkgreen)] hover:bg-[var(--color-pistachio)] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign In
            </button>
          </form>
          
          <div className="text-center pt-4">
            <p className="text-[var(--color-night)]">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-[var(--color-darkgreen)] hover:text-[var(--color-pistachio)] transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;