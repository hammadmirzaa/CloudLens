export interface OverviewStats {
  totalVms: number;
  cloudRunServices: number;
  activeAlerts: number;
  monthlyCost: number;
}

export interface CpuUsageData {
  time: string;
  usage: number; // percentage 0-100
}

export interface CostData {
  service: string;
  cost: number;
}

export interface Alert {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info';
  resource: string;
  message: string;
  time: string;
}

export interface DashboardOverview {
  stats: OverviewStats;
  cpuUsage: CpuUsageData[];
  costByService: CostData[];
  recentAlerts: Alert[];
}
