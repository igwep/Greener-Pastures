import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  createWithdrawalRequest,
  getUserWithdrawals,
  type WithdrawalRequest,
  type CreateWithdrawalResponse,
  type UserWithdrawal
} from './actions';
import { ApiError } from '../apiClient';

export function useCreateWithdrawalMutation() {
  const queryClient = useQueryClient();
  
  return useMutation<CreateWithdrawalResponse, ApiError, WithdrawalRequest>({
    mutationFn: createWithdrawalRequest,
    onSuccess: async () => {
      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['withdrawals', 'user'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });
}

export function useUserWithdrawalsQuery() {
  return useQuery<{ withdrawals: UserWithdrawal[] }, ApiError>({
    queryKey: ['withdrawals', 'user'],
    queryFn: ({ signal }) => getUserWithdrawals(signal),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
