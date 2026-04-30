import type { LogEntry, LogsResponse } from '../types/logs';

export const fetchLogs = async (
  resource: string, 
  severity: string, 
  limit: number, 
  _pageToken?: string
): Promise<LogsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  const generateLogs = (count: number) => {
    return Array.from({ length: count }, (_, _i) => {
      const r = Math.random();
      const randSev = r > 0.95 ? 'CRITICAL' : r > 0.85 ? 'ERROR' : r > 0.7 ? 'WARNING' : r > 0.5 ? 'DEBUG' : 'INFO';
      const actualSev = severity === 'All' ? randSev : severity;
      
      const resources = ['frontend-app', 'auth-service', 'payment-api', 'database-cluster', 'background-worker'];
      const actualResource = resource === 'All' ? resources[Math.floor(Math.random() * resources.length)] : resource;
      
      return {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
        severity: actualSev as LogEntry['severity'],
        resource: actualResource,
        message: `Sample log message for ${actualResource}. TraceID: ${Math.random().toString(36).substring(2, 10)}. Details provided in context payload.`,
      };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  return {
    logs: generateLogs(limit),
    nextPageToken: Math.random() > 0.1 ? `token-${Date.now()}` : null,
  };
};
