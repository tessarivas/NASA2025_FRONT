import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../../services/api';
import GradientText from '../GradientText';

export default function SignInForm({ onToggleToSignUp, onCancel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      const token = data.access_token || data.token;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        navigate('/dashboard', { replace: true });
      } else {
        setError('Error: No authentication token received');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      setError(error.message || 'Login error. Please check your credentials.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto">
      {/* Container with card styling */}
      <div className="bg-royal-blue/10 backdrop-blur-md border border-royal-blue/20 rounded-2xl p-8 w-full shadow-2xl">
        {/* Title */}
        <div className="text-5xl mb-4 text-center" style={{ fontFamily: 'Zen Dots' }}>
          <GradientText
            colors={["#E26B40", "#FF7A33", "#FF4F11", "#D63A12", "#A6210A"]}
            animationSpeed={4.5}
            showBorder={false}
            showBackground={false}
          >
            Sign In
          </GradientText>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {error && (
            <div className="bg-hot-pink/20 border border-hot-pink text-white px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-white mb-2"
              style={{ fontFamily: 'Space Mono, monospace' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-royal-blue/20 text-white placeholder-white/50 border border-royal-blue/30 focus:outline-none focus:ring-2 focus:ring-blue backdrop-blur-sm transition-all duration-300"
              style={{ fontFamily: 'Space Mono, monospace' }}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-white mb-2"
              style={{ fontFamily: 'Space Mono, monospace' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-royal-blue/20 text-white placeholder-white/50 border border-royal-blue/30 focus:outline-none focus:ring-2 focus:ring-blue backdrop-blur-sm transition-all duration-300"
              style={{ fontFamily: 'Space Mono, monospace' }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 cursor-pointer px-4 bg-royal-blue/20 hover:bg-royal-blue/30 text-blue border border-royal-blue/30 hover:border-blue/50 font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Toggle options */}
        <div className="text-center mt-6 space-y-2">
          <p 
            className="text-white/70 text-sm"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            Don't have an account?{' '}
            <button 
              onClick={onToggleToSignUp}
              className="text-blue cursor-pointer hover:text-orange font-semibold transition-colors duration-300"
            >
              Sign Up
            </button>
          </p>
          <button 
            onClick={onCancel}
            className="text-white/50 cursor-pointer hover:text-white/70 text-sm transition-colors duration-300"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            Back to explore
          </button>
        </div>
      </div>
    </div>
  );
}