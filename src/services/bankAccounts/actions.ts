import { apiRequest } from '../apiClient';

export type BankAccountPayload = {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  isDefault?: boolean;
};

export type BankAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateBankAccountResponse = {
  bankAccount: BankAccount;
};

export type UpdateBankAccountResponse = {
  bankAccount: BankAccount;
};

export async function createBankAccount(payload: Required<Pick<BankAccountPayload, 'bankName' | 'accountName' | 'accountNumber'>> & Pick<BankAccountPayload, 'isDefault'>) {
  return apiRequest<CreateBankAccountResponse>('/api/v1/bank-accounts', {
    method: 'POST',
    body: payload as unknown as Record<string, unknown>
  });
}

export async function updateBankAccount(bankAccountId: string, payload: BankAccountPayload) {
  return apiRequest<UpdateBankAccountResponse>(`/api/v1/bank-accounts/${bankAccountId}` as string, {
    method: 'PUT',
    body: payload as unknown as Record<string, unknown>
  });
}
