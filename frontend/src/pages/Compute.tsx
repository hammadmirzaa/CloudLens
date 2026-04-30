import React, { useState } from 'react';
import { useComputeInstances, useComputeMetrics } from '../hooks/useCompute';
import { 
  Search, Filter, Server, Activity, X, ChevronRight, AlertCircle, HardDrive
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const Compute: React.FC = () => {
  const { data: instances, isLoading, isError } = useComputeInstances();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedVm, setSelectedVm] = useState<string | null>(null);

  const filteredInstances = instances?.filter(instance => {
    const matchesSearch = instance.name.toLowerCase().includes(search.toLowerCase()) || 
                          instance.zone.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || instance.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Compute Engine</h1>
          <p className="text-slate-400 mt-2 text-sm">Manage and monitor your virtual machine instances.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or zone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
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
            <option value="RUNNING">Running</option>
            <option value="TERMINATED">Terminated</option>
            <option value="STAGING">Staging</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-slate-800/50 rounded w-full"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">Error Loading Instances</h3>
            <p className="text-slate-400">Could not fetch compute data. Please try again.</p>
          </div>
        ) : filteredInstances.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center border-t border-slate-800/50">
            <Server className="w-16 h-16 text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">No instances found</h3>
            <p className="text-slate-400">Adjust your search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-950/40 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Name</th>
                  <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Zone</th>
                  <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Type</th>
                  <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Status</th>
                  <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">CPU / RAM</th>
                  <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">IP Addresses</th>
                  <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredInstances.map((instance) => (
                  <tr key={instance.name} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-3">
                      <div className="p-1.5 bg-slate-800 rounded-md text-blue-400">
                        <Server size={16} />
                      </div>
                      {instance.name}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{instance.zone}</td>
                    <td className="px-6 py-4 text-slate-400">{instance.machineType}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={instance.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 w-24">
                        <div className="flex items-center gap-2">
                          <Activity size={12} className="text-slate-500" />
                          <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${instance.cpuPercent > 80 ? 'bg-red-500' : instance.cpuPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${instance.cpuPercent}%` }}></div>
                          </div>
                          <span className="text-xs text-slate-500 w-6 text-right">{instance.cpuPercent}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HardDrive size={12} className="text-slate-500" />
                          <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${instance.memoryPercent > 80 ? 'bg-red-500' : instance.memoryPercent > 50 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${instance.memoryPercent}%` }}></div>
                          </div>
                          <span className="text-xs text-slate-500 w-6 text-right">{instance.memoryPercent}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs">
                        <span className="text-slate-300">{instance.internalIp} <span className="text-slate-600">(Int)</span></span>
                        {instance.externalIp ? (
                          <span className="text-slate-400">{instance.externalIp} <span className="text-slate-600">(Ext)</span></span>
                        ) : (
                          <span className="text-slate-600 italic">No external IP</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedVm(instance.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 rounded text-xs font-medium transition-colors border border-slate-700 hover:border-blue-500"
                      >
                        <Activity size={14} />
                        Metrics
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Side Drawer for Metrics */}
      <MetricsDrawer vmName={selectedVm} onClose={() => setSelectedVm(null)} />
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'RUNNING') {
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>RUNNING</span>;
  }
  if (status === 'TERMINATED') {
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>TERMINATED</span>;
  }
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>STAGING</span>;
};

const MetricsDrawer = ({ vmName, onClose }: { vmName: string | null, onClose: () => void }) => {
  const { data, isLoading, isError } = useComputeMetrics(vmName);

  if (!vmName) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-slate-900 border-l border-slate-800 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Server size={20} className="text-blue-400" />
              {vmName}
            </h2>
            <p className="text-slate-400 text-sm mt-1">Real-time performance metrics</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {isLoading ? (
            <div className="space-y-8 animate-pulse">
              <div className="h-[250px] bg-slate-800/50 rounded-xl border border-slate-700"></div>
              <div className="h-[250px] bg-slate-800/50 rounded-xl border border-slate-700"></div>
            </div>
          ) : isError || !data ? (
            <div className="p-8 text-center bg-slate-800/30 rounded-xl border border-slate-700/50 border-dashed">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">Failed to load metrics</p>
            </div>
          ) : (
            <>
              {/* CPU Chart */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity size={16} className="text-blue-400" />
                  CPU Utilization (Last 1h)
                </h3>
                <div className="h-[250px] bg-slate-950/50 rounded-xl border border-slate-800 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.cpu}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} tickMargin={10} minTickGap={20} axisLine={false} tickLine={false} />
                      <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} tickMargin={10} unit="%" axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem', fontSize: '12px' }}
                        itemStyle={{ color: '#3b82f6' }}
                        cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Memory Chart */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <HardDrive size={16} className="text-indigo-400" />
                  Memory Utilization (Last 1h)
                </h3>
                <div className="h-[250px] bg-slate-950/50 rounded-xl border border-slate-800 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.memory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} tickMargin={10} minTickGap={20} axisLine={false} tickLine={false} />
                      <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} tickMargin={10} unit="%" axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem', fontSize: '12px' }}
                        itemStyle={{ color: '#6366f1' }}
                        cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#6366f1' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Compute;
