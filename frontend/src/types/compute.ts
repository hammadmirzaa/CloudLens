export interface VmInstance {
  name: string;
  zone: string;
  machineType: string;
  status: 'RUNNING' | 'TERMINATED' | 'STAGING';
  cpuPercent: number;
  memoryPercent: number;
  internalIp: string;
  externalIp?: string;
}

export interface MetricPoint {
  time: string;
  value: number;
}

export interface VmMetrics {
  cpu: MetricPoint[];
  memory: MetricPoint[];
}
