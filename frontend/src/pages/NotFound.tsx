import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ArrowLeft } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

const NotFound: React.FC = () => {
  usePageTitle('Page Not Found - CloudLens');

  return (
    <div className="flex-1 h-full min-h-[400px] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400 dark:text-slate-500">
        <Map size={48} />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">404</h1>
      <h2 className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-6">Page not found</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        The resource or page you are looking for doesn't exist, has been moved, or is currently unavailable.
      </p>
      <Link 
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
