import type { CloudRunService, CloudRunMetrics, LogLine } from '../types/cloudrun';

export const fetchCloudRunServices = async (): Promise<CloudRunService[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));

  return [
    { name: 'frontend-service', region: 'us-central1', status: 'HEALTHY', requestCount: 15420, avgLatency: 45, errorRate: 0.1, latestRevision: 'frontend-service-00042-xyz', consoleUrl: '#' },
    { name: 'auth-api', region: 'us-east4', status: 'HEALTHY', requestCount: 8250, avgLatency: 120, errorRate: 0.5, latestRevision: 'auth-api-00105-abc', consoleUrl: '#' },
    { name: 'payment-gateway', region: 'europe-west1', status: 'DEGRADED', requestCount: 3100, avgLatency: 850, errorRate: 4.2, latestRevision: 'payment-gateway-00012-def', consoleUrl: '#' },
    { name: 'image-processor', region: 'us-west1', status: 'HEALTHY', requestCount: 420, avgLatency: 2100, errorRate: 0.0, latestRevision: 'image-processor-00088-ghi', consoleUrl: '#' },
    { name: 'legacy-bridge', region: 'us-central1', status: 'DOWN', requestCount: 0, avgLatency: 0, errorRate: 100, latestRevision: 'legacy-bridge-00005-jkl', consoleUrl: '#' },
  ];
};

export const fetchCloudRunMetrics = async (_name: string): Promise<CloudRunMetrics> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  const generateLineData = () => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${23 - i}h ago`,
      value: Math.floor(Math.random() * 500) + 50
    }));
  };

  return {
    requestRate: generateLineData(),
    latencyHistogram: [
      { bucket: '0-50ms', count: 1200 },
      { bucket: '50-100ms', count: 800 },
      { bucket: '100-200ms', count: 450 },
      { bucket: '200-500ms', count: 120 },
      { bucket: '500-1s', count: 45 },
      { bucket: '>1s', count: 12 },
    ]
  };
};

export const fetchCloudRunLogs = async (_name: string): Promise<LogLine[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  return Array.from({ length: 20 }, (_, i) => {
    const isError = Math.random() > 0.85;
    const isWarning = !isError && Math.random() > 0.7;
    return {
      id: `log-${i}`,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      severity: isError ? 'ERROR' : isWarning ? 'WARNING' : 'INFO',
      message: isError 
        ? `Connection timeout to upstream service for request ID ${Math.floor(Math.random()*10000)}` 
        : isWarning 
        ? `High memory usage detected (85%)` 
        : `Request processed successfully in ${Math.floor(Math.random() * 100)}ms`
    };
  });
};
