import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../apiClient';
import { getPlans, selectPlan } from './actions';

export function usePlansQuery() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: getPlans
  });
}

export function useSelectPlanMutation() {
  const qc = useQueryClient();
  return useMutation<unknown, ApiError, { planId: string }>({
    mutationFn: ({ planId }) => selectPlan(planId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });
}

export type UsePlansQueryResult = ReturnType<typeof usePlansQuery>;
