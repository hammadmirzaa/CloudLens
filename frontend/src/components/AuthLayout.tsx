import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CloudCog } from 'lucide-react';
import authBg from '../assets/auth-bg.png';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-900 overflow-hidden">
      {/* Left side: Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 xl:p-24 bg-white dark:bg-slate-950 relative z-10 transition-colors duration-300">
        
        {/* Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-2.5">
          <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <CloudCog size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">CloudLens</span>
        </div>

        {/* Dynamic Route Content (Login/Signup) */}
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Outlet />
        </div>

        <div className="absolute bottom-8 text-center w-full max-w-md">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} CloudLens Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side: Image Container */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900">
        <img 
          src={authBg} 
          alt="CloudLens Abstract Background" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-slate-950/20"></div>
      </div>
    </div>
  );
};

export default AuthLayout;
