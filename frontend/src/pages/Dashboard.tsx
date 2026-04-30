import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your GCP infrastructure.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Placeholder metric cards */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-100 rounded w-1/3"></div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[400px]">
        {/* Placeholder chart area */}
        <div className="h-4 bg-gray-100 rounded w-1/4 mb-6"></div>
        <div className="h-64 bg-gray-50 rounded border border-dashed border-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Chart data will appear here</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
