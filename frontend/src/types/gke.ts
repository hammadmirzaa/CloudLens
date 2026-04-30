export interface GkeCluster {
  name: string;
  location: string;
  status: 'RUNNING' | 'PROVISIONING' | 'ERROR';
  nodeCount: number;
  totalCpu: number; // cores
  totalMemory: number; // GB
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  kubernetesVersion: string;
}
