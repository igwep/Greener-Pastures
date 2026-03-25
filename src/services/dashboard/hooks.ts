import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../apiClient';
import { getDashboardSummary } from './actions';

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: ({ signal }) => getDashboardSummary(signal),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 401) return false;
      return failureCount < 2;
    }
  });
}
