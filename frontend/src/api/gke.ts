import type { GkeCluster } from '../types/gke';

export const fetchGkeClusters = async (): Promise<GkeCluster[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    { name: 'prod-cluster-us-east', location: 'us-east4', status: 'RUNNING', nodeCount: 12, totalCpu: 48, totalMemory: 192, cpuUsagePercent: 65, memoryUsagePercent: 78, kubernetesVersion: '1.27.3-gke.100' },
    { name: 'dev-cluster-central', location: 'us-central1-a', status: 'RUNNING', nodeCount: 3, totalCpu: 12, totalMemory: 48, cpuUsagePercent: 25, memoryUsagePercent: 42, kubernetesVersion: '1.28.1-gke.200' },
    { name: 'staging-cluster-europe', location: 'europe-west1', status: 'PROVISIONING', nodeCount: 5, totalCpu: 20, totalMemory: 80, cpuUsagePercent: 0, memoryUsagePercent: 0, kubernetesVersion: '1.28.1-gke.200' },
    { name: 'data-proc-cluster', location: 'us-west1', status: 'ERROR', nodeCount: 8, totalCpu: 32, totalMemory: 128, cpuUsagePercent: 95, memoryUsagePercent: 98, kubernetesVersion: '1.26.5-gke.1200' },
  ];
};
