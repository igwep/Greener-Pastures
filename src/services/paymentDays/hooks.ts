import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../apiClient';
import { getPaymentDaysCalendar, payPaymentDays } from './actions';

export function usePaymentDaysCalendarQuery(params: { from?: string; to?: string }) {
  const { from, to } = params;

  return useQuery({
    queryKey: ['paymentDaysCalendar', from, to],
    enabled: Boolean(from && to),
    queryFn: ({ signal }) => {
      if (!from || !to) {
        return Promise.resolve({ days: [] });
      }
      return getPaymentDaysCalendar({ from, to, signal });
    },
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 401) return false;
      return failureCount < 2;
    }
  });
}

export function usePayPaymentDaysMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: payPaymentDays,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['paymentDaysCalendar'] });
      await qc.invalidateQueries({ queryKey: ['dashboardSummary'] });
    }
  });
}
