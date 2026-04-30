import type { VmInstance, VmMetrics } from '../types/compute';

export const fetchComputeInstances = async (): Promise<VmInstance[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  return [
    { name: 'web-server-prod-1', zone: 'us-central1-a', machineType: 'e2-standard-4', status: 'RUNNING', cpuPercent: 45, memoryPercent: 62, internalIp: '10.128.0.2', externalIp: '34.68.102.44' },
    { name: 'web-server-prod-2', zone: 'us-central1-b', machineType: 'e2-standard-4', status: 'RUNNING', cpuPercent: 38, memoryPercent: 55, internalIp: '10.128.0.3', externalIp: '35.224.18.99' },
    { name: 'db-replica-1', zone: 'us-east4-c', machineType: 'n2-highmem-8', status: 'RUNNING', cpuPercent: 78, memoryPercent: 88, internalIp: '10.130.0.10' },
    { name: 'batch-worker-pool-1', zone: 'europe-west1-b', machineType: 'c2-standard-16', status: 'TERMINATED', cpuPercent: 0, memoryPercent: 0, internalIp: '10.132.0.4' },
    { name: 'ml-training-node-1', zone: 'us-west1-a', machineType: 'a2-highgpu-1g', status: 'STAGING', cpuPercent: 12, memoryPercent: 5, internalIp: '10.134.0.8', externalIp: '34.120.55.21' },
    { name: 'api-gateway', zone: 'us-central1-a', machineType: 'e2-medium', status: 'RUNNING', cpuPercent: 22, memoryPercent: 40, internalIp: '10.128.0.5', externalIp: '35.230.144.11' },
  ];
};

export const fetchComputeMetrics = async (_name: string): Promise<VmMetrics> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  const generateData = (base: number) => {
    return Array.from({ length: 60 }, (_, i) => ({
      time: `${Math.floor(i / 60)}h ${i % 60}m ago`,
      value: Math.max(0, Math.min(100, base + Math.sin(i / 5) * 15 + Math.random() * 10 - 5))
    })).reverse();
  };

  return {
    cpu: generateData(40),
    memory: generateData(60),
  };
};
