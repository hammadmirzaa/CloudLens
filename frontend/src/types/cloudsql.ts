export interface SqlInstance {
  name: string;
  databaseVersion: string;
  region: string;
  status: 'RUNNABLE' | 'SUSPENDED' | 'MAINTENANCE';
  storageUsedGb: number;
  storageCapacityGb: number;
  activeConnections: number;
  tier: string;
}
