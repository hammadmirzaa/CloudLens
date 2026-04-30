import React, { useState } from 'react';
import { useBuilds } from '../hooks/useCICD';
import { 
  GitBranch, Search, Filter, CheckCircle2, XCircle, Clock, X, ExternalLink, RefreshCw, Box
} from 'lucide-react';

const CICD: React.FC = () => {
  const { data: builds, isLoading, isError, isFetching, refetch } = useBuilds(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredBuilds = builds?.filter(build => {
    const matchesSearch = build.triggerName.toLowerCase().includes(search.toLowerCase()) || 
                          build.branch.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || build.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <GitBranch className="text-blue-400" />
            CI/CD Pipelines
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Monitor Cloud Build executions and deployments.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin text-blue-400' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by trigger name or branch..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILURE">Failure</option>
            <option value="WORKING">Working</option>
            <option value="QUEUED">Queued</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Builds List */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-slate-800/50 rounded-lg w-full"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center border-t border-slate-800/50">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">Error Loading Builds</h3>
            <p className="text-slate-400">Could not fetch CI/CD data.</p>
          </div>
        ) : filteredBuilds.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center border-t border-slate-800/50">
            <Box className="w-16 h-16 text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">No builds found</h3>
            <p className="text-slate-400">Adjust your search or filter criteria.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-800/60">
            {filteredBuilds.map((build) => (
              <li key={build.id} className="p-5 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <StatusBadge status={build.status} />
                    <h3 className="text-lg font-semibold text-white truncate">{build.triggerName}</h3>
                    <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{build.id}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-2">
                    <span className="flex items-center gap-1.5"><GitBranch size={14} className="text-slate-500" /> {build.branch}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-500" /> {new Date(build.startTime).toLocaleString()}</span>
                    <span>Duration: <strong className="text-slate-300 font-medium">{build.duration}</strong></span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 md:min-w-[300px]">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">Steps</span>
                      <span className="text-slate-300">{build.stepsCompleted} / {build.totalSteps}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          build.status === 'SUCCESS' ? 'bg-emerald-500' : 
                          build.status === 'FAILURE' ? 'bg-red-500' : 
                          build.status === 'CANCELLED' ? 'bg-amber-500' : 'bg-blue-500'
                        } ${build.status === 'WORKING' ? 'animate-pulse' : ''}`} 
                        style={{ width: `${(build.stepsCompleted / build.totalSteps) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <a 
                    href={build.logUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-shrink-0 px-4 py-2 bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700 hover:border-blue-500 flex items-center gap-2"
                  >
                    View Logs <ExternalLink size={14} />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'SUCCESS':
      return <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 size={16} /></span>;
    case 'FAILURE':
      return <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"><XCircle size={16} /></span>;
    case 'WORKING':
      return <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"><RefreshCw size={16} className="animate-spin" /></span>;
    case 'CANCELLED':
      return <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"><X size={16} /></span>;
    default:
      return <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20"><Clock size={16} /></span>;
  }
};

export default CICD;
