import React, { useState } from 'react';
import { useSqlInstances } from '../hooks/useCloudSQL';
import { usePageTitle } from '../hooks/usePageTitle';
import { Database, Search, Filter, AlertTriangle, CheckCircle2, PauseCircle, Settings, HardDrive, Activity } from 'lucide-react';

const CloudSQL: React.FC = () => {
  usePageTitle('Cloud SQL - CloudLens');
  const { data: instances, isLoading, isError } = useSqlInstances();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInstances = instances?.filter(instance => {
    const matchesSearch = instance.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || instance.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Database className="text-blue-500 dark:text-blue-400" />
            Cloud SQL
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Manage relational databases (PostgreSQL, MySQL, SQL Server).</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search instances..." 
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
            <option value="RUNNABLE">Runnable</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-slate-800/50 rounded-lg w-full"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Error Loading Instances</h3>
            <p className="text-slate-500 dark:text-slate-400">Could not fetch Cloud SQL data.</p>
          </div>
        ) : filteredInstances.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center border-t border-gray-200 dark:border-slate-800/50">
            <Database className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No instances found</h3>
            <p className="text-slate-500 dark:text-slate-400">Adjust your search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 border-b border-gray-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Instance ID</th>
                  <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Version</th>
                  <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Location / Tier</th>
                  <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Status</th>
                  <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Storage Usage</th>
                  <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider text-right">Connections</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {filteredInstances.map((instance) => {
                  const storagePercent = (instance.storageUsedGb / instance.storageCapacityGb) * 100;
                  return (
                    <tr key={instance.name} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200 flex items-center gap-3">
                        <div className="p-1.5 bg-blue-50 dark:bg-slate-800 rounded-md text-blue-600 dark:text-blue-400">
                          <Database size={16} />
                        </div>
                        {instance.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        <span className="bg-gray-100 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 px-2 py-1 rounded text-xs">
                          {instance.databaseVersion}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-700 dark:text-slate-300">{instance.region}</span>
                          <span className="text-slate-500 text-xs">{instance.tier}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={instance.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 w-40">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><HardDrive size={12} /> {instance.storageUsedGb}GB</span>
                            <span className="text-slate-400 dark:text-slate-500">{instance.storageCapacityGb}GB</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${storagePercent > 85 ? 'bg-red-500' : storagePercent > 70 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                              style={{ width: `${storagePercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`inline-flex items-center gap-1.5 font-medium px-2 py-1 rounded ${instance.activeConnections > 0 ? "bg-emerald-50 dark:bg-slate-800/50 text-emerald-600 dark:text-emerald-400" : "bg-gray-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400"}`}>
                          <Activity size={14} />
                          {instance.activeConnections}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'RUNNABLE') {
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"><CheckCircle2 size={12} /> Runnable</span>;
  }
  if (status === 'SUSPENDED') {
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20"><PauseCircle size={12} /> Suspended</span>;
  }
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"><Settings size={12} className="animate-spin" /> Maintenance</span>;
};

export default CloudSQL;
