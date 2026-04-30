import { useQuery } from '@tanstack/react-query';
import { fetchComputeInstances, fetchComputeMetrics } from '../api/compute';
import type { VmInstance, VmMetrics } from '../types/compute';

export const useComputeInstances = () => {
  return useQuery<VmInstance[], Error>({
    queryKey: ['computeInstances'],
    queryFn: fetchComputeInstances,
  });
};

export const useComputeMetrics = (name: string | null) => {
  return useQuery<VmMetrics, Error>({
    queryKey: ['computeMetrics', name],
    queryFn: () => fetchComputeMetrics(name!),
    enabled: !!name,
  });
};
