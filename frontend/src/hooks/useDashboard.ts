import { useQuery } from '@tanstack/react-query';
import { fetchDashboardOverview } from '../api/dashboard';
import type { DashboardOverview } from '../types/dashboard';

export const useDashboardOverview = () => {
  return useQuery<DashboardOverview, Error>({
    queryKey: ['dashboardOverview'],
    queryFn: fetchDashboardOverview,
  });
};
