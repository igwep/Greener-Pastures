import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  createWithdrawalRequest,
  getUserWithdrawals,
  type WithdrawalRequest,
  type CreateWithdrawalResponse,
  type UserWithdrawal
} from './actions';
import { ApiError } from '../apiClient';

export function useCreateWithdrawalMutation() {
  return useMutation<CreateWithdrawalResponse, ApiError, WithdrawalRequest>({
    mutationFn: createWithdrawalRequest,
  });
}

export function useUserWithdrawalsQuery() {
  return useQuery<{ withdrawals: UserWithdrawal[] }, ApiError>({
    queryKey: ['withdrawals', 'user'],
    queryFn: ({ signal }) => getUserWithdrawals(signal),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
