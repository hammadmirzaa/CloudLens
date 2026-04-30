import React from 'react';
import { useBillingSummary, useBillingByService, useBillingDailySpend, useBillingSkus } from '../hooks/useBilling';
import { CreditCard, TrendingUp, TrendingDown, AlertTriangle, PieChart, CalendarDays, DollarSign } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, Area, AreaChart
} from 'recharts';

const BUDGET_LIMIT = Number(import.meta.env.VITE_BUDGET_ALERT_THRESHOLD) || 5000;

const Billing: React.FC = () => {
  const { data: summary, isLoading: loadSum } = useBillingSummary();
  const { data: services, isLoading: loadSvc } = useBillingByService();
  const { data: daily, isLoading: loadDaily } = useBillingDailySpend();
  const { data: skus, isLoading: loadSkus } = useBillingSkus();

  const isOverBudget = summary ? summary.projectedMonthEnd > BUDGET_LIMIT : false;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="text-emerald-400" />
            Billing & Cost Management
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Monitor your GCP spending across services and projects.</p>
        </div>
      </div>

      {/* Budget Alert Banner */}
      {isOverBudget && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start sm:items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertTriangle className="text-red-400 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <h4 className="text-red-400 font-medium text-sm">Budget Alert: Projected spend exceeds threshold</h4>
            <p className="text-red-400/80 text-xs mt-0.5">Your projected end-of-month spend (${summary?.projectedMonthEnd.toLocaleString()}) is higher than your configured budget limit (${BUDGET_LIMIT.toLocaleString()}).</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
          <h3 className="text-slate-400 text-sm font-medium mb-4 flex items-center gap-2">
            <DollarSign size={16} /> Current Month Total
          </h3>
          {loadSum ? (
            <div className="h-10 bg-slate-800/50 rounded w-1/2 animate-pulse"></div>
          ) : (
            <div className="text-4xl font-bold text-white tracking-tight">
              ${summary?.currentMonthTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
          <h3 className="text-slate-400 text-sm font-medium mb-4 flex items-center gap-2">
            <CalendarDays size={16} /> Projected Month End
          </h3>
          {loadSum ? (
            <div className="h-10 bg-slate-800/50 rounded w-1/2 animate-pulse"></div>
          ) : (
            <div className="text-4xl font-bold text-white tracking-tight">
              ${summary?.projectedMonthEnd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
          <h3 className="text-slate-400 text-sm font-medium mb-4">vs Last Month</h3>
          {loadSum ? (
            <div className="h-10 bg-slate-800/50 rounded w-1/2 animate-pulse"></div>
          ) : (
            <div className="flex items-end gap-3">
              <div className={`text-4xl font-bold tracking-tight ${summary && summary.vsLastMonthPercent > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {summary && summary.vsLastMonthPercent > 0 ? '+' : ''}{summary?.vsLastMonthPercent}%
              </div>
              <div className={`mb-1 pb-1 flex items-center ${summary && summary.vsLastMonthPercent > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {summary && summary.vsLastMonthPercent > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost by Service Bar Chart */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <PieChart size={18} className="text-blue-400" />
            Cost by Service (Last 30 Days)
          </h3>
          <div className="flex-1 w-full min-h-[300px]">
            {loadSvc ? (
              <div className="w-full h-full bg-slate-800/30 animate-pulse rounded-lg"></div>
            ) : services ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={services} margin={{ top: 5, right: 20, bottom: 5, left: -20 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickMargin={12} tickFormatter={(v) => `$${v}`} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="service" stroke="#64748b" tick={{ fill: '#cbd5e1', fontSize: 11 }} width={120} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                  />
                  <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={24}>
                    {services.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        {/* Daily Spend Line Chart */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" />
            Daily Spend (Last 30 Days)
          </h3>
          <div className="flex-1 w-full min-h-[300px]">
            {loadDaily ? (
              <div className="w-full h-full bg-slate-800/30 animate-pulse rounded-lg"></div>
            ) : daily ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={daily} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} tickMargin={12} minTickGap={20} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} tickMargin={12} tickFormatter={(v) => `$${v}`} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#34d399' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spend']}
                    cursor={{ stroke: '#334155', strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" activeDot={{ r: 4, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>
      </div>

      {/* SKU Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            Top Cost Drivers by SKU
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-950/40 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Service</th>
                <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">SKU</th>
                <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider text-right">Cost</th>
                <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loadSkus ? (
                [1,2,3].map(i => (
                  <tr key={i}>
                    <td colSpan={4} className="px-6 py-4"><div className="h-6 bg-slate-800/50 rounded animate-pulse w-full"></div></td>
                  </tr>
                ))
              ) : skus ? (
                skus.map((sku) => (
                  <tr key={sku.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200">{sku.service}</td>
                    <td className="px-6 py-4 text-slate-400">{sku.sku}</td>
                    <td className="px-6 py-4 text-right text-slate-200 font-medium">${sku.cost.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden max-w-[150px]">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${sku.percentOfTotal}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-400 w-8">{sku.percentOfTotal.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No SKU data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;
