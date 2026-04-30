import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { Mail, Lock, User, ArrowRight, Loader2, Building } from 'lucide-react';

const Signup: React.FC = () => {
  usePageTitle('Sign Up - CloudLens');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login(email, name);
      addToast('Account created successfully! Welcome to CloudLens.', 'success');
      navigate('/');
    }, 2000);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create an account</h1>
        <p className="text-slate-500 dark:text-slate-400">Start monitoring your GCP infrastructure today.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                placeholder="Full Name"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Building size={18} />
              </div>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                placeholder="Company (Optional)"
              />
            </div>
          </div>

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
              placeholder="Work Email"
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
              minLength={8}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              placeholder="Create a strong password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !email || !password || !name}
          className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-slate-950 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 overflow-hidden mt-2"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
          {/* Subtle shine effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
      
      <p className="mt-8 text-xs text-center text-slate-500 dark:text-slate-500">
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </p>
    </>
  );
};

export default Signup;
