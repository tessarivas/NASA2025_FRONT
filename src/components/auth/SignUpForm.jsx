import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../../services/api';
import GradientText from '../GradientText';
import StarBorder from '../UI/starBorder.jsx';
import { ArrowLeft } from 'lucide-react';

export default function SignUpForm({ onToggleToSignIn, onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      setSuccess(true);
      setError('');
      // Just show success message for now, don't auto-login
      setTimeout(() => {
        // Switch to sign in form instead of navigating
        onToggleToSignIn();
      }, 2000);
    },
    onError: (error) => {
      console.error('Registration error:', error);
      setError(error.message || 'Error creating account');
      setSuccess(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    registerMutation.mutate({ name, email, password });
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
            Sign Up
          </GradientText>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {error && (
            <div className="bg-hot-pink/20 border border-hot-pink text-white px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green/20 border border-green text-white px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
              Account created successfully! Redirecting...
            </div>
          )}

          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-white mb-2"
              style={{ fontFamily: 'Space Mono, monospace' }}
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-royal-blue/20 text-white placeholder-white/50 border border-royal-blue/30 focus:outline-none focus:ring-2 focus:ring-blue backdrop-blur-sm transition-all duration-300"
              style={{ fontFamily: 'Space Mono, monospace' }}
              placeholder="Full name"
            />
          </div>

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
              placeholder="example@email.com"
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
              minLength={6}
              className="w-full px-4 py-3 rounded-lg bg-royal-blue/20 text-white placeholder-white/50 border border-royal-blue/30 focus:outline-none focus:ring-2 focus:ring-blue backdrop-blur-sm transition-all duration-300"
              style={{ fontFamily: 'Space Mono, monospace' }}
              placeholder="••••••••"
            />
          </div>

          <StarBorder
            as="button"
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full hover:scale-102 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            color="#FF6B35"
            backgroundColor="from-orange-500 to-orange-900"
            textColor="text-white"
            height="py-3"
            fontSize="text-sm"
            borderRadius="rounded-lg"
            borderColor="border-orange-500/50"
            speed="3s"
            onClick={handleSubmit}
          >
            <div className="flex items-center justify-center font-bold text-lg" style={{fontFamily: 'var(--font-space-mono)'}}>
              <span>{registerMutation.isPending ? 'Creating account...' : 'Create Account'}</span>
            </div>
          </StarBorder>
        </form>

        {/* Toggle options */}
        <div className="text-center mt-6 space-y-2">
          <p 
            className="text-white/70 text-sm"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            Already have an account?{' '}
            <button 
              onClick={onToggleToSignIn}
              className="text-blue hover:text-orange font-semibold transition-colors duration-300 cursor-pointer"
            >
              Sign In
            </button>
          </p>
          <button 
            onClick={onCancel}
            className="text-white/50 cursor-pointer hover:text-white/70 text-sm transition-colors duration-300"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            <ArrowLeft size={14} className="inline mb-0.5 mr-1" />
            Back to explore
          </button>
        </div>
      </div>
    </div>
  );
}