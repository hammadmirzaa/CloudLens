export interface CloudRunService {
  name: string;
  region: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  requestCount: number;
  avgLatency: number;
  errorRate: number;
  latestRevision: string;
  consoleUrl: string;
}

export interface MetricPoint {
  time: string;
  value: number;
}

export interface CloudRunMetrics {
  requestRate: MetricPoint[];
  latencyHistogram: { bucket: string; count: number }[];
}

export interface LogLine {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
}
