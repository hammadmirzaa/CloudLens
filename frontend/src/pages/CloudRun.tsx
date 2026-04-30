import React, { useState } from 'react';
import { useCloudRunServices, useCloudRunMetrics, useCloudRunLogs } from '../hooks/useCloudRun';
import { 
  Search, Filter, CloudCog, ExternalLink, Activity, AlertTriangle, 
  CheckCircle2, XCircle, Clock, X, Terminal, BarChart3 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const CloudRun: React.FC = () => {
  const { data: services, isLoading, isError } = useCloudRunServices();
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const filteredServices = services?.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter === 'All' || service.region === regionFilter;
    return matchesSearch && matchesRegion;
  }) || [];

  const uniqueRegions = ['All', ...Array.from(new Set(services?.map(s => s.region) || []))];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Cloud Run</h1>
          <p className="text-slate-400 mt-2 text-sm">Monitor serverless container applications.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search services..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
          >
            {uniqueRegions.map(region => (
              <option key={region} value={region}>{region === 'All' ? 'All Regions' : region}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Grid Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-slate-900 rounded-xl border border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center flex flex-col items-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-1">Error Loading Services</h3>
          <p className="text-slate-400">Could not fetch Cloud Run data.</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-16 text-center flex flex-col items-center">
          <CloudCog className="w-16 h-16 text-slate-700 mb-4" />
          <h3 className="text-lg font-medium text-white mb-1">No services found</h3>
          <p className="text-slate-400">Adjust your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div 
              key={service.name} 
              onClick={() => setSelectedService(service.name)}
              className="bg-slate-900 rounded-xl border border-slate-800 hover:border-blue-500/50 p-6 shadow-sm transition-all cursor-pointer group hover:shadow-blue-500/5 relative overflow-hidden"
            >
              {service.status === 'DOWN' && <div className="absolute top-0 right-0 w-full h-1 bg-red-500"></div>}
              {service.status === 'DEGRADED' && <div className="absolute top-0 right-0 w-full h-1 bg-amber-500"></div>}
              
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${service.status === 'DOWN' ? 'bg-red-500/10 text-red-400' : service.status === 'DEGRADED' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    <CloudCog size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg group-hover:text-blue-400 transition-colors">{service.name}</h3>
                    <p className="text-slate-400 text-xs">{service.region}</p>
                  </div>
                </div>
                <StatusBadge status={service.status} />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-5 p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs mb-1">Req/hr</span>
                  <span className="text-slate-200 font-medium">{service.requestCount.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs mb-1">Latency</span>
                  <span className="text-slate-200 font-medium">{service.avgLatency}ms</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs mb-1">Errors</span>
                  <span className={`font-medium ${service.errorRate > 5 ? 'text-red-400' : service.errorRate > 1 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {service.errorRate}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 truncate pr-4" title={service.latestRevision}>
                  Rev: <span className="text-slate-300">{service.latestRevision}</span>
                </span>
                <a 
                  href={service.consoleUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Console <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedService && (
        <ServiceModal serviceName={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'HEALTHY') {
    return <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"><CheckCircle2 size={12} /> Healthy</span>;
  }
  if (status === 'DOWN') {
    return <span className="flex items-center gap-1 text-red-400 text-xs font-medium bg-red-500/10 px-2 py-1 rounded border border-red-500/20"><XCircle size={12} /> Down</span>;
  }
  return <span className="flex items-center gap-1 text-amber-400 text-xs font-medium bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20"><AlertTriangle size={12} /> Degraded</span>;
};

const ServiceModal = ({ serviceName, onClose }: { serviceName: string, onClose: () => void }) => {
  const { data: metrics, isLoading: loadingMetrics } = useCloudRunMetrics(serviceName);
  const { data: logs, isLoading: loadingLogs } = useCloudRunLogs(serviceName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <CloudCog size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{serviceName}</h2>
              <p className="text-xs text-slate-400">Service Metrics & Logs</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Request Rate Chart */}
            <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <Activity size={16} className="text-blue-400" />
                Request Rate (Last 24h)
              </h3>
              <div className="h-[200px]">
                {loadingMetrics ? (
                  <div className="w-full h-full bg-slate-800/30 animate-pulse rounded-lg"></div>
                ) : metrics ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.requestRate}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} tickMargin={8} axisLine={false} tickLine={false} minTickGap={30} />
                      <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} tickMargin={8} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem', fontSize: '12px' }}
                        cursor={{ stroke: '#334155', strokeDasharray: '4 4' }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : null}
              </div>
            </div>

            {/* Latency Histogram */}
            <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-purple-400" />
                Latency Distribution
              </h3>
              <div className="h-[200px]">
                {loadingMetrics ? (
                  <div className="w-full h-full bg-slate-800/30 animate-pulse rounded-lg"></div>
                ) : metrics ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.latencyHistogram} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                      <XAxis type="number" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="bucket" type="category" stroke="#64748b" tick={{ fill: '#cbd5e1', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{ fill: '#1e293b' }}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem', fontSize: '12px' }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                        {metrics.latencyHistogram.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#8b5cf6" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : null}
              </div>
            </div>
          </div>

          {/* Logs Section */}
          <div className="bg-[#0c0c0c] rounded-xl border border-slate-800 overflow-hidden flex flex-col">
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Terminal size={14} className="text-slate-400" />
                Recent Logs
              </h3>
              <span className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded">Last 20 entries</span>
            </div>
            <div className="p-4 font-mono text-xs overflow-x-auto h-[250px] overflow-y-auto space-y-1.5">
              {loadingLogs ? (
                <div className="space-y-2 animate-pulse">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-slate-800/50 rounded w-full"></div>)}
                </div>
              ) : logs ? (
                logs.map(log => (
                  <div key={log.id} className="flex gap-4 hover:bg-slate-800/30 px-2 py-1 rounded group">
                    <span className="text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className={`whitespace-nowrap font-bold ${
                      log.severity === 'ERROR' ? 'text-red-400' : log.severity === 'WARNING' ? 'text-amber-400' : 'text-blue-400'
                    }`}>
                      [{log.severity}]
                    </span>
                    <span className="text-slate-300 flex-1">{log.message}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-500">No logs available.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudRun;
