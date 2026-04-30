import React, { useState, useMemo } from 'react';
import { useLogs } from '../hooks/useLogs';
import { usePageTitle } from '../hooks/usePageTitle';
import { Search, Terminal, Play, Pause, RefreshCw, Copy, Check } from 'lucide-react';

const Logs: React.FC = () => {
  usePageTitle('Logs Explorer - CloudLens');
  const [resource, setResource] = useState('All');
  const [severity, setSeverity] = useState('All');
  const [limit, setLimit] = useState(50);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading, isError, isFetching, refetch } = useLogs(resource, severity, limit, undefined, autoRefresh);

  const logs = data?.logs || [];

  const filteredLogs = useMemo(() => {
    if (!search) return logs;
    const lowerSearch = search.toLowerCase();
    return logs.filter(log => 
      log.message.toLowerCase().includes(lowerSearch) || 
      log.resource.toLowerCase().includes(lowerSearch) ||
      log.severity.toLowerCase().includes(lowerSearch)
    );
  }, [logs, search]);

  const handleCopy = (logString: string, id: string) => {
    navigator.clipboard.writeText(logString);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Terminal className="text-blue-500 dark:text-blue-400" />
            Logs Explorer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Real-time log ingestion and analysis.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              autoRefresh 
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20' 
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            {autoRefresh ? <Pause size={16} /> : <Play size={16} />}
            Auto-refresh {autoRefresh && '(10s)'}
          </button>
          
          <button 
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg border border-gray-200 dark:border-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={isFetching ? 'animate-spin text-blue-500 dark:text-blue-400' : ''} />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 shadow-sm flex flex-wrap gap-4 shrink-0">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Filter logs by text..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <select
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
            >
              <option value="All">All Resources</option>
              <option value="frontend-app">frontend-app</option>
              <option value="auth-service">auth-service</option>
              <option value="payment-api">payment-api</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
            >
              <option value="All">All Severities</option>
              <option value="DEBUG">DEBUG</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="ERROR">ERROR</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div className="relative hidden sm:block">
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
            >
              <option value={50}>50 lines</option>
              <option value={100}>100 lines</option>
              <option value={500}>500 lines</option>
            </select>
          </div>
        </div>
      </div>

      {/* Terminal View */}
      <div className="flex-1 bg-[#1e1e1e] dark:bg-[#0c0c0c] rounded-xl border border-gray-300 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col font-mono text-sm relative group">
        <div className="bg-gray-200 dark:bg-slate-800/80 px-4 py-2 flex items-center gap-2 border-b border-gray-300 dark:border-slate-700 shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="ml-4 text-slate-600 dark:text-slate-400 text-xs font-sans tracking-wider font-semibold">LOG VIEWER</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-[#1e1e1e] dark:bg-transparent">
          {isLoading && !isFetching ? (
            <div className="text-slate-400 dark:text-slate-500 animate-pulse">Loading logs...</div>
          ) : isError ? (
            <div className="text-red-400">Failed to load logs. Please try again.</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-slate-400 dark:text-slate-500 italic">No logs found matching criteria.</div>
          ) : (
            filteredLogs.map(log => (
              <div key={log.id} className="flex group/line hover:bg-white/10 dark:hover:bg-slate-800/50 py-1 px-2 rounded -mx-2 transition-colors relative pr-10">
                <div className="flex gap-3 w-full items-start">
                  <span className="text-slate-400 dark:text-slate-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  
                  <span className={`shrink-0 w-20 font-bold ${
                    log.severity === 'CRITICAL' ? 'text-purple-400 bg-purple-400/10 px-1 rounded' :
                    log.severity === 'ERROR' ? 'text-red-400' :
                    log.severity === 'WARNING' ? 'text-amber-400' :
                    log.severity === 'INFO' ? 'text-blue-400' : 'text-slate-400'
                  }`}>
                    [{log.severity}]
                  </span>
                  
                  <span className="text-emerald-400 shrink-0 w-32 truncate" title={log.resource}>
                    {log.resource}
                  </span>
                  
                  <span className="text-slate-300 break-words flex-1">
                    {search ? (
                      <HighlightText text={log.message} highlight={search} />
                    ) : log.message}
                  </span>
                </div>
                
                <button 
                  onClick={() => handleCopy(`[${new Date(log.timestamp).toISOString()}] [${log.severity}] [${log.resource}] ${log.message}`, log.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white bg-transparent hover:bg-white/20 dark:hover:bg-slate-700 rounded opacity-0 group-hover/line:opacity-100 transition-all"
                  title="Copy log"
                >
                  {copiedId === log.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            ))
          )}
          
          {data?.nextPageToken && !isLoading && (
            <div className="pt-4 pb-2 flex justify-center">
              <button 
                className="px-4 py-2 bg-white/10 hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-300 rounded text-xs border border-white/20 dark:border-slate-700 transition-colors font-sans"
              >
                Load More Logs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HighlightText = ({ text, highlight }: { text: string, highlight: string }) => {
  if (!highlight.trim()) return <>{text}</>;
  
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? <mark key={i} className="bg-yellow-500/50 text-yellow-100 rounded px-0.5">{part}</mark> : part
      )}
    </>
  );
};

export default Logs;
