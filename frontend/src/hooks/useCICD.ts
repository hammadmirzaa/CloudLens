import { useQuery } from '@tanstack/react-query';
import { fetchBuilds } from '../api/cicd';
import type { Build } from '../types/cicd';

export const useBuilds = (autoRefresh: boolean = true) => {
  return useQuery<Build[], Error>({
    queryKey: ['cicdBuilds'],
    queryFn: fetchBuilds,
    refetchInterval: autoRefresh ? 30000 : false, // Auto refresh every 30s
  });
};
