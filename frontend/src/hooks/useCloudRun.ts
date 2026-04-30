import { useQuery } from '@tanstack/react-query';
import { fetchCloudRunServices, fetchCloudRunMetrics, fetchCloudRunLogs } from '../api/cloudrun';
import type { CloudRunService, CloudRunMetrics, LogLine } from '../types/cloudrun';

export const useCloudRunServices = () => {
  return useQuery<CloudRunService[], Error>({
    queryKey: ['cloudrunServices'],
    queryFn: fetchCloudRunServices,
  });
};

export const useCloudRunMetrics = (name: string | null) => {
  return useQuery<CloudRunMetrics, Error>({
    queryKey: ['cloudrunMetrics', name],
    queryFn: () => fetchCloudRunMetrics(name!),
    enabled: !!name,
  });
};

export const useCloudRunLogs = (name: string | null) => {
  return useQuery<LogLine[], Error>({
    queryKey: ['cloudrunLogs', name],
    queryFn: () => fetchCloudRunLogs(name!),
    enabled: !!name,
  });
};

export const useCloudRunServiceDetails = (name: string) => {
  const metrics = useCloudRunMetrics(name);
  const logs = useCloudRunLogs(name);

  const isLoading = metrics.isLoading || logs.isLoading;
  const isError = metrics.isError || logs.isError;
  const data = metrics.data && logs.data ? {
    metrics: {
      requests: metrics.data.requestRate,
      latency: metrics.data.latencyHistogram
    },
    recentLogs: logs.data
  } : undefined;

  return { data, isLoading, isError };
};
