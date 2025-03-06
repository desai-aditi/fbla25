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
      <div className="hidden md:flex md:w-1/2 bg-[var(--color-darkgreen)] items-center justify-center">
        <div className="text-[var(--color-white)] text-center">
          <h2 className="text-4xl font-bold mb-6">Welcome to Fiscus</h2>
          <p className="text-xl max-w-md px-8 leading-relaxed">
            Your journey to financial literacy starts here. Track your finances, make smarter decisions, and achieve your goals.
          </p>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[var(--color-offwhite)]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-darkgreen)] mb-2">Log In</h1>
            <p className="text-[var(--color-darkgreen)] opacity-80">Welcome back! Please enter your details</p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[var(--color-darkgreen)] text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-pistachio)] bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-[var(--color-darkgreen)] text-sm font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-pistachio)] bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[var(--color-darkgreen)] hover:bg-[var(--color-darkgreen)]/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-pistachio)] focus:ring-offset-2"
            >
              Log In
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[var(--color-darkgreen)]">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-[var(--color-darkgreen)] hover:text-[var(--color-pistachio)] transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;