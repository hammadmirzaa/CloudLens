import type { DashboardOverview } from '../types/dashboard';

export const fetchDashboardOverview = async (): Promise<DashboardOverview> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    stats: {
      totalVms: 42,
      cloudRunServices: 18,
      activeAlerts: 2,
      monthlyCost: 4250.75,
    },
    cpuUsage: [
      { time: '00:00', usage: 35 },
      { time: '04:00', usage: 28 },
      { time: '08:00', usage: 65 },
      { time: '12:00', usage: 82 },
      { time: '16:00', usage: 78 },
      { time: '20:00', usage: 45 },
      { time: '23:59', usage: 32 },
    ],
    costByService: [
      { service: 'Compute Engine', cost: 1850 },
      { service: 'Cloud SQL', cost: 1200 },
      { service: 'GKE', cost: 850 },
      { service: 'Cloud Run', cost: 250 },
      { service: 'Cloud Storage', cost: 100 },
    ],
    recentAlerts: [
      {
        id: 'alert-1',
        severity: 'Critical',
        resource: 'instance-group-1',
        message: 'CPU utilization exceeds 90% for 10m',
        time: '10 mins ago'
      },
      {
        id: 'alert-2',
        severity: 'Warning',
        resource: 'sql-prod-db',
        message: 'Storage capacity at 85%',
        time: '1 hour ago'
      },
      {
        id: 'alert-3',
        severity: 'Info',
        resource: 'cloud-run-api',
        message: 'New revision deployed successfully',
        time: '3 hours ago'
      }
    ]
  };
};
