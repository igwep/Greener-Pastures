import { apiRequest, ApiError } from '../apiClient';

export type WithdrawalRequest = {
  amountNaira: string;
  bankAccountId: string;
};

export type UserWithdrawal = {
  id: string;
  createdAt: string;
  amountNaira: string;
  status: "PENDING" | "APPROVED" | "PAID" | "REJECTED";
  bankAccountId: string;
};

export type CreateWithdrawalResponse = {
  withdrawal: UserWithdrawal;
};

export async function createWithdrawalRequest(data: WithdrawalRequest) {
  return apiRequest<CreateWithdrawalResponse>('/api/v1/withdrawals/request', {
    method: 'POST',
    body: data,
  });
}

export async function getUserWithdrawals(signal?: AbortSignal) {
  return apiRequest<{ withdrawals: UserWithdrawal[] }>('/api/v1/withdrawals/me', { signal });
}
