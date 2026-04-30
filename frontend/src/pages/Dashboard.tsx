import React from 'react';
import { useDashboardOverview } from '../hooks/useDashboard';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { Server, CloudCog, AlertTriangle, DollarSign, Activity } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC = () => {
  const { data, isLoading, isError, error } = useDashboardOverview();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="text-red-500 w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Failed to load dashboard</h2>
        <p className="text-slate-400 max-w-md text-center">{error?.message || 'Please check your connection and try again.'}</p>
      </div>
    );
  }

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <div>
          <div className="h-8 bg-slate-800 rounded w-48 mb-2"></div>
          <div className="h-4 bg-slate-800 rounded w-64"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 h-32"></div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 h-[400px]"></div>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 h-[400px]"></div>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 h-64"></div>
      </div>
    );
  }

  // Handle data
  const stats = data?.stats || { totalVms: 0, cloudRunServices: 0, activeAlerts: 0, monthlyCost: 0 };
  const cpuUsage = data?.cpuUsage || [];
  const costByService = data?.costByService || [];
  const recentAlerts = data?.recentAlerts || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-400 mt-2 text-sm">Real-time metrics and status of your GCP infrastructure.</p>
      </div>
      
      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total VMs" 
          value={stats.totalVms} 
          icon={<Server size={22} className="text-blue-400" />} 
          trend="Active instances" 
        />
        <StatCard 
          title="Cloud Run Services" 
          value={stats.cloudRunServices} 
          icon={<CloudCog size={22} className="text-indigo-400" />} 
          trend="Deployed services"
        />
        <StatCard 
          title="Active Alerts" 
          value={stats.activeAlerts} 
          icon={<Activity size={22} className={stats.activeAlerts > 0 ? "text-amber-400" : "text-emerald-400"} />} 
          trend={stats.activeAlerts > 0 ? "Requires attention" : "All clear"}
          alert={stats.activeAlerts > 0}
        />
        <StatCard 
          title="Monthly Cost" 
          value={`$${stats.monthlyCost.toLocaleString()}`} 
          icon={<DollarSign size={22} className="text-emerald-400" />} 
          trend="Current billing cycle"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Usage Chart */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Activity size={18} className="text-blue-400" />
            CPU Usage (Last 24h)
          </h3>
          <div className="flex-1 w-full min-h-[300px]">
            {cpuUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cpuUsage} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} tickMargin={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} tickMargin={12} unit="%" axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#60a5fa' }}
                    cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#0f172a', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-lg bg-slate-900/50">
                <Activity size={32} className="text-slate-700 mb-3" />
                <span>No CPU usage data available</span>
              </div>
            )}
          </div>
        </div>

        {/* Cost by Service Chart */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <DollarSign size={18} className="text-emerald-400" />
            Cost per GCP Service
          </h3>
          <div className="flex-1 w-full min-h-[300px]">
            {costByService.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costByService} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="service" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} tickMargin={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} tickMargin={12} tickFormatter={(value) => `$${value}`} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value: number) => [`$${value}`, 'Cost']}
                  />
                  <Bar dataKey="cost" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    {costByService.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-lg bg-slate-900/50">
                <DollarSign size={32} className="text-slate-700 mb-3" />
                <span>No cost data available</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Alerts Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-400" />
            Recent Alerts
          </h3>
          {recentAlerts.length > 0 && (
            <span className="text-xs font-medium bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
              {recentAlerts.length} total
            </span>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/40 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wide text-xs uppercase">Severity</th>
                <th className="px-6 py-4 font-medium tracking-wide text-xs uppercase">Resource</th>
                <th className="px-6 py-4 font-medium tracking-wide text-xs uppercase">Message</th>
                <th className="px-6 py-4 font-medium tracking-wide text-xs uppercase text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 bg-slate-900/20">
              {recentAlerts.length > 0 ? (
                recentAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                        alert.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        alert.severity === 'Warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-200 whitespace-nowrap">{alert.resource}</td>
                    <td className="px-6 py-4 text-slate-400">{alert.message}</td>
                    <td className="px-6 py-4 text-right text-slate-500 whitespace-nowrap text-xs">{alert.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4">
                        <Activity className="text-emerald-500" size={24} />
                      </div>
                      <p className="text-base text-slate-300 font-medium">No active alerts</p>
                      <p className="text-sm mt-1 text-slate-500">All systems are operating normally.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  alert?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, alert }) => {
  return (
    <div className={`bg-slate-900 rounded-xl border ${alert ? 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'border-slate-800'} p-6 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors`}>
      {alert && <div className="absolute top-0 right-0 w-1 h-full bg-amber-500"></div>}
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <div className="p-2.5 bg-slate-800/80 rounded-lg group-hover:bg-slate-800 transition-colors border border-slate-700/50">{icon}</div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
          {trend}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
