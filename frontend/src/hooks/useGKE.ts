import { useQuery } from '@tanstack/react-query';
import { fetchGkeClusters } from '../api/gke';
import type { GkeCluster } from '../types/gke';

export const useGkeClusters = () => {
  return useQuery<GkeCluster[], Error>({
    queryKey: ['gkeClusters'],
    queryFn: fetchGkeClusters,
  });
};
