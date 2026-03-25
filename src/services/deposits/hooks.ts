import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDeposit, type CreateDepositRequest } from '../deposits/actions';

export function useCreateDepositMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDeposit,
    onSuccess: () => {
      // Invalidate dashboard summary to refresh wallet balance
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
    }
  });
}
