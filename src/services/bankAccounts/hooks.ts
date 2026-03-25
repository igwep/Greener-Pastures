import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../apiClient';
import {
  createBankAccount,
  updateBankAccount,
  type CreateBankAccountResponse,
  type UpdateBankAccountResponse,
  type BankAccountPayload
} from './actions';

export function useCreateBankAccountMutation() {
  const qc = useQueryClient();
  return useMutation<CreateBankAccountResponse, ApiError, Parameters<typeof createBankAccount>[0]>({
    mutationFn: createBankAccount,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    }
  });
}

export function useUpdateBankAccountMutation() {
  const qc = useQueryClient();
  return useMutation<UpdateBankAccountResponse, ApiError, { bankAccountId: string; payload: BankAccountPayload }>({
    mutationFn: ({ bankAccountId, payload }) => updateBankAccount(bankAccountId, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    }
  });
}
