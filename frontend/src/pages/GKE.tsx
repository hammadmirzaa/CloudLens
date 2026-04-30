import React, { useState } from 'react';
import { useGkeClusters } from '../hooks/useGKE';
import { usePageTitle } from '../hooks/usePageTitle';
import { Container, Search, Filter, Cpu, HardDrive, AlertTriangle, CheckCircle2, RefreshCw, Layers } from 'lucide-react';

const GKE: React.FC = () => {
  usePageTitle('GKE - CloudLens');
  const { data: clusters, isLoading, isError } = useGkeClusters();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredClusters = clusters?.filter(cluster => {
    const matchesSearch = cluster.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || cluster.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Container className="text-blue-500 dark:text-blue-400" />
            Kubernetes Engine
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Manage GKE clusters, nodes, and workloads.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search clusters..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="RUNNING">Running</option>
            <option value="PROVISIONING">Provisioning</option>
            <option value="ERROR">Error</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-gray-100 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-12 text-center flex flex-col items-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Error Loading Clusters</h3>
          <p className="text-slate-500 dark:text-slate-400">Could not fetch GKE data.</p>
        </div>
      ) : filteredClusters.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-16 text-center flex flex-col items-center">
          <Container className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No clusters found</h3>
          <p className="text-slate-500 dark:text-slate-400">Adjust your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClusters.map(cluster => (
            <div key={cluster.name} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:border-blue-300 dark:hover:border-slate-700 transition-colors relative overflow-hidden group">
              {cluster.status === 'ERROR' && <div className="absolute top-0 right-0 w-1 h-full bg-red-500"></div>}
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg flex items-center gap-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Container size={18} className="text-blue-500" />
                    {cluster.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5"><Layers size={14} /> {cluster.nodeCount} nodes</span>
                    <span>•</span>
                    <span>{cluster.location}</span>
                    <span>•</span>
                    <span className="font-mono text-xs text-slate-400 dark:text-slate-500">v{cluster.kubernetesVersion}</span>
                  </div>
                </div>
                <StatusBadge status={cluster.status} />
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* CPU */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Cpu size={14} /> CPU ({cluster.totalCpu} cores)</span>
                    <span className="text-slate-900 dark:text-white font-medium">{cluster.cpuUsagePercent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-gray-200 dark:border-slate-800">
                    <div 
                      className={`h-full rounded-full ${cluster.cpuUsagePercent > 80 ? 'bg-red-500' : cluster.cpuUsagePercent > 50 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                      style={{ width: `${cluster.cpuUsagePercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Memory */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><HardDrive size={14} /> Memory ({cluster.totalMemory}GB)</span>
                    <span className="text-slate-900 dark:text-white font-medium">{cluster.memoryUsagePercent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-gray-200 dark:border-slate-800">
                    <div 
                      className={`h-full rounded-full ${cluster.memoryUsagePercent > 80 ? 'bg-red-500' : cluster.memoryUsagePercent > 50 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${cluster.memoryUsagePercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'RUNNING') {
    return <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20"><CheckCircle2 size={12} /> Running</span>;
  }
  if (status === 'ERROR') {
    return <span className="flex items-center gap-1.5 text-red-700 dark:text-red-400 text-xs font-medium bg-red-50 dark:bg-red-500/10 px-2.5 py-1 rounded-full border border-red-200 dark:border-red-500/20"><AlertTriangle size={12} /> Error</span>;
  }
  return <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 text-xs font-medium bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-500/20"><RefreshCw size={12} className="animate-spin" /> Provisioning</span>;
};

export default GKE;
