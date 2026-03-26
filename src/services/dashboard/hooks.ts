import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../apiClient';
import { getDashboardSummary } from './actions';

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: ({ signal }) => getDashboardSummary(signal),
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        // Don't retry for authentication errors or 404s
        if (error.status === 401 || error.status === 404) return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
