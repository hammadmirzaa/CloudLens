import React, { useState } from 'react';
import { useCloudRunServices, useCloudRunServiceDetails } from '../hooks/useCloudRun';
import { usePageTitle } from '../hooks/usePageTitle';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Search, Filter, CloudCog, Activity, ExternalLink, X, AlertTriangle, CheckCircle2, Clock, Terminal
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const CloudRun: React.FC = () => {
  usePageTitle('Cloud Run - CloudLens');
  const { data: services, isLoading, isError } = useCloudRunServices();
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const uniqueRegions = Array.from(new Set(services?.map(s => s.region) || []));

  const filteredServices = services?.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter === 'All' || service.region === regionFilter;
    return matchesSearch && matchesRegion;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CloudCog className="text-indigo-500 dark:text-indigo-400" />
            Cloud Run Services
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Monitor serverless container deployments and traffic.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search services..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
          >
            <option value="All">All Regions</option>
            {uniqueRegions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Grid Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-gray-100 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-12 text-center flex flex-col items-center shadow-sm">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Error Loading Services</h3>
          <p className="text-slate-500 dark:text-slate-400">Could not fetch Cloud Run data.</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-16 text-center flex flex-col items-center shadow-sm">
          <CloudCog className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No services found</h3>
          <p className="text-slate-500 dark:text-slate-400">Adjust your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div 
              key={service.name} 
              onClick={() => setSelectedService(service.name)}
              className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${
                service.status === 'HEALTHY' ? 'bg-emerald-500' : 
                service.status === 'DEGRADED' ? 'bg-amber-500' : 'bg-red-500'
              }`}></div>
              
              <div className="flex justify-between items-start mb-4 mt-2">
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg truncate pr-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{service.name}</h3>
                <StatusBadge status={service.status} />
              </div>
              
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
                <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded">{service.region}</span>
                <span>•</span>
                <span className="truncate" title={service.consoleUrl}>{service.consoleUrl.replace('https://', '')}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">Requests/sec</span>
                  <span className="text-slate-900 dark:text-white font-medium">{service.requestCount.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">Latency</span>
                  <span className={`font-medium ${service.avgLatency > 500 ? 'text-red-500' : service.avgLatency > 200 ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>{service.avgLatency}ms</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">Error Rate</span>
                  <span className={`font-medium ${service.errorRate > 5 ? 'text-red-500' : service.errorRate > 1 ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>{service.errorRate}%</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800/60 flex justify-between items-center text-xs text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-1.5"><Clock size={12} /> {service.latestRevision}</div>
                <div className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400" onClick={(e) => { e.stopPropagation(); window.open(service.consoleUrl, '_blank'); }}>
                  Open <ExternalLink size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedService && (
        <ServiceModal serviceName={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'HEALTHY') return <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20"><CheckCircle2 size={12} /> Healthy</span>;
  if (status === 'DEGRADED') return <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 text-xs font-medium bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/20"><AlertTriangle size={12} /> Degraded</span>;
  return <span className="flex items-center gap-1 text-red-700 dark:text-red-400 text-xs font-medium bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded border border-red-200 dark:border-red-500/20"><X size={12} /> Down</span>;
};

const ServiceModal = ({ serviceName, onClose }: { serviceName: string, onClose: () => void }) => {
  const { data, isLoading } = useCloudRunServiceDetails(serviceName);
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CloudCog className="text-indigo-500 dark:text-indigo-400" />
            {serviceName} Details
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-2 gap-6"><div className="h-64 bg-gray-100 dark:bg-slate-800/50 rounded-xl"></div><div className="h-64 bg-gray-100 dark:bg-slate-800/50 rounded-xl"></div></div>
              <div className="h-64 bg-gray-100 dark:bg-slate-800/50 rounded-xl"></div>
            </div>
          ) : data ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Requests Chart */}
                <div className="bg-gray-50 dark:bg-slate-950/50 rounded-xl border border-gray-200 dark:border-slate-800 p-5">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2">
                    <Activity size={16} /> Request Rate (24h)
                  </h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.metrics.requests}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} vertical={false} />
                        <XAxis dataKey="time" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} tick={{ fontSize: 11 }} tickMargin={10} axisLine={false} tickLine={false} />
                        <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} tick={{ fontSize: 11 }} tickMargin={10} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', borderColor: theme === 'dark' ? '#334155' : '#e2e8f0', color: theme === 'dark' ? '#f8fafc' : '#0f172a', borderRadius: '0.5rem' }}
                          cursor={{ stroke: theme === 'dark' ? '#334155' : '#e2e8f0', strokeDasharray: '4 4' }}
                        />
                        <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Latency Chart */}
                <div className="bg-gray-50 dark:bg-slate-950/50 rounded-xl border border-gray-200 dark:border-slate-800 p-5">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2">
                    <Clock size={16} /> Latency Distribution
                  </h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.metrics.latency} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} horizontal={false} />
                        <XAxis type="number" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="bucket" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f1f5f9' }}
                          contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', borderColor: theme === 'dark' ? '#334155' : '#e2e8f0', color: theme === 'dark' ? '#f8fafc' : '#0f172a', borderRadius: '0.5rem' }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {data.metrics.latency.map((_entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={index > 2 ? '#ef4444' : index > 1 ? '#f59e0b' : '#10b981'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Logs */}
              <div className="bg-[#0c0c0c] rounded-xl border border-gray-300 dark:border-slate-700 overflow-hidden shadow-lg">
                <div className="bg-gray-200 dark:bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-gray-300 dark:border-slate-700">
                  <Terminal size={14} className="text-slate-500 dark:text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400 text-xs font-mono font-medium">Recent Logs</span>
                </div>
                <div className="p-4 h-[300px] overflow-y-auto font-mono text-sm space-y-1.5">
                  {data.recentLogs.map((log: any) => (
                    <div key={log.id} className="flex gap-3 hover:bg-white/5 dark:hover:bg-white/5 py-0.5 rounded px-1 transition-colors">
                      <span className="text-slate-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      <span className={`shrink-0 w-16 ${log.severity === 'ERROR' ? 'text-red-400' : log.severity === 'WARNING' ? 'text-amber-400' : 'text-blue-400'}`}>[{log.severity}]</span>
                      <span className="text-slate-300 break-words">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CloudRun;
