import type { SqlInstance } from '../types/cloudsql';

export const fetchSqlInstances = async (): Promise<SqlInstance[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    { name: 'prod-main-db', databaseVersion: 'POSTGRES_14', region: 'us-central1', status: 'RUNNABLE', storageUsedGb: 450, storageCapacityGb: 1000, activeConnections: 342, tier: 'db-custom-8-32768' },
    { name: 'prod-replica-1', databaseVersion: 'POSTGRES_14', region: 'us-east4', status: 'RUNNABLE', storageUsedGb: 450, storageCapacityGb: 1000, activeConnections: 12, tier: 'db-custom-8-32768' },
    { name: 'analytics-warehouse', databaseVersion: 'POSTGRES_13', region: 'us-central1', status: 'MAINTENANCE', storageUsedGb: 890, storageCapacityGb: 1000, activeConnections: 0, tier: 'db-custom-16-65536' },
    { name: 'dev-db-1', databaseVersion: 'MYSQL_8_0', region: 'us-west1', status: 'SUSPENDED', storageUsedGb: 15, storageCapacityGb: 100, activeConnections: 0, tier: 'db-n1-standard-2' },
  ];
};
