import { useQuery } from '@tanstack/react-query';
import { fetchSqlInstances } from '../api/cloudsql';
import type { SqlInstance } from '../types/cloudsql';

export const useSqlInstances = () => {
  return useQuery<SqlInstance[], Error>({
    queryKey: ['sqlInstances'],
    queryFn: fetchSqlInstances,
  });
};
