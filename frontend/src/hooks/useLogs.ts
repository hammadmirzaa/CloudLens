import { useQuery } from '@tanstack/react-query';
import { fetchLogs } from '../api/logs';
import type { LogsResponse } from '../types/logs';

export const useLogs = (resource: string, severity: string, limit: number, pageToken?: string, autoRefresh: boolean = false) => {
  return useQuery<LogsResponse, Error>({
    queryKey: ['logs', resource, severity, limit, pageToken],
    queryFn: () => fetchLogs(resource, severity, limit, pageToken),
    refetchInterval: autoRefresh ? 10000 : false,
  });
};
