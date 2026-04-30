import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  usePageTitle('Sign In - CloudLens');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login(email, email.split('@')[0]);
      addToast('Welcome back to CloudLens', 'success');
      navigate('/');
    }, 1500);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h1>
        <p className="text-slate-500 dark:text-slate-400">Enter your credentials to access your dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Mail size={18} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              placeholder="name@company.com"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Lock size={18} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-slate-600 dark:text-slate-400 cursor-pointer">
            <input type="checkbox" className="mr-2 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500/50 bg-gray-50 dark:bg-slate-900 w-4 h-4" />
            Remember me
          </label>
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-slate-950 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 overflow-hidden"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
          {/* Subtle shine effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
