import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../apiClient';
import { getDashboardSummary } from './actions';

export function useDashboardSummaryQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: ({ signal }) => getDashboardSummary(signal),
    enabled: enabled,
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        // Don't retry for authentication errors or 404s
        if (error.status === 401 || error.status === 404) return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes - cache for 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes - keep in cache for 30 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: false, // Don't refetch on mount if we have cached data
  });
}
