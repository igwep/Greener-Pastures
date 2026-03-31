import { apiRequest } from '../apiClient';

export type AdminDashboardResponse = {
  counts: {
    users: number;
    pendingDeposits: number;
    pendingWithdrawals: number;
    pendingContributionPayments: number;
    pendingProductListings: number;
  };
};

export async function getAdminDashboard(signal?: AbortSignal) {
  return apiRequest<AdminDashboardResponse>('/api/v1/admin/dashboard', { signal });
}

export type BankAccount = {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  isDefault: boolean;
};

export type AdminWithdrawal = {
  id: string;
  userId: string;
  amountNaira: string;
  status: "PENDING" | "APPROVED" | "PAID" | "REJECTED";
  createdAt: string;
  bankAccountId: string;
  bankAccount: BankAccount;
  user?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
};

export type AdminWithdrawalsResponse = {
  withdrawals: AdminWithdrawal[];
};

export async function getAdminWithdrawals(signal?: AbortSignal) {
  return apiRequest<AdminWithdrawalsResponse>('/api/v1/withdrawals/admin', { signal });
}

export type ApproveWithdrawalRequest = {
  amountNaira: string;
  note?: string;
};

export async function approveWithdrawal(withdrawalId: string, data: ApproveWithdrawalRequest) {
  return apiRequest(`/api/v1/withdrawals/admin/${withdrawalId}/approve`, {
    method: 'POST',
    body: data,
  });
}

export type RejectWithdrawalRequest = {
  note?: string;
};

export async function rejectWithdrawal(withdrawalId: string, data: RejectWithdrawalRequest) {
  return apiRequest(`/api/v1/withdrawals/admin/${withdrawalId}/reject`, {
    method: 'POST',
    body: data,
  });
}

export type MarkWithdrawalAsPaidRequest = {
  note?: string;
};

export async function markWithdrawalAsPaid(withdrawalId: string, data: MarkWithdrawalAsPaidRequest) {
  return apiRequest(`/api/v1/withdrawals/admin/${withdrawalId}/mark-paid`, {
    method: 'POST',
    body: data,
  });
}

export type AdminContributionPayment = {
  id: string;
  createdAt: string;
  status?: string;
  amountNaira?: string;
  dates?: string[];
  proofUrl?: string | null;
  transferReference?: string | null;
  user?: {
    id: string;
    email?: string | null;
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  };
  plan?: {
    id: string;
    name?: string | null;
  };
};

export type ListAdminContributionPaymentsResponse = {
  items: AdminContributionPayment[];
};

export async function listAdminContributionPayments(params: {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  signal?: AbortSignal;
}) {
  const query = new URLSearchParams({ status: params.status });
  return apiRequest<ListAdminContributionPaymentsResponse>(
    `/api/v1/payment-days/admin/contribution-payments?${query.toString()}`,
    { signal: params.signal }
  );
}

export async function approveContributionPayment(params: { contributionPaymentId: string; note?: string }) {
  return apiRequest<{ success: boolean }>(
    `/api/v1/payment-days/admin/contribution-payments/${params.contributionPaymentId}/approve`,
    {
      method: 'POST',
      body: { note: params.note }
    }
  );
}

export async function rejectContributionPayment(params: { contributionPaymentId: string; note?: string }) {
  return apiRequest<{ success: boolean }>(
    `/api/v1/payment-days/admin/contribution-payments/${params.contributionPaymentId}/reject`,
    {
      method: 'POST',
      body: { note: params.note }
    }
  );
}

export type AdminUserSummary = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mainBalanceNaira: string;
  loanBalanceNaira: string;
};

export type ListAdminUsersResponse = {
  users: AdminUserSummary[];
};

export async function getAdminUsers(params: { q?: string; limit?: number; signal?: AbortSignal }) {
  const query = new URLSearchParams();
  if (params.q) {
    query.set('q', params.q);
  }
  if (params.limit) {
    query.set('limit', params.limit.toString());
  }
  return apiRequest<ListAdminUsersResponse>(`/api/v1/admin/users?${query.toString()}`, {
    signal: params.signal,
  });
}

export type LedgerEntry = {
  [key: string]: any;
};

export type LoanApplication = {
  [key: string]: any;
};

export type Deposit = {
  [key: string]: any;
};

export type Withdrawal = {
  [key: string]: any;
};

export type AdminUserFullData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  mainBalanceNaira: string;
  loanBalanceNaira: string;
  planStartedAt: string;
  planExpiresAt: string;
  currentCyclePaidAmountNaira: string;
  currentCyclePaidDays: number;
  totalPaidAmountNaira: string;
  totalPaidDays: number;
  planContributionAmountNaira: string;
  selectedPlanId: string;
  selectedPlan: {
    id: string;
    name: string;
    contributionAmountNaira: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  wallet: { ledgerEntries: LedgerEntry[] };
  loanWallet: { ledgerEntries: LedgerEntry[] };
  loanApplications: LoanApplication[];
  deposits: Deposit[];
  withdrawals: Withdrawal[];
  bankAccounts: any[];
  contributionPayments: any[];
  loanRepayments: any[];
};

export type GetAdminUserFullDataResponse = {
  user: AdminUserFullData;
};

export async function getAdminUserFullData(userId: string, signal?: AbortSignal) {
  return apiRequest<GetAdminUserFullDataResponse>(`/api/v1/admin/users/${userId}/full-data`, {
    signal,
  });
}

export type TransferAccount = {
  bankName: string;
  accountName: string;
  accountNumber: string;
};

export async function getTransferAccount(signal?: AbortSignal) {
  try {
    const result = await apiRequest<{ transferAccount: TransferAccount }>('/api/v1/transfer-account', { signal });
    console.log("=== GET TRANSFER ACCOUNT SUCCESS ===");
    console.log("Response:", result);
    console.log("=== END GET TRANSFER ACCOUNT SUCCESS ===");
    return result;
  } catch (error) {
    console.error("=== GET TRANSFER ACCOUNT ERROR ===");
    console.error("Error:", error);
    console.error("=== END GET TRANSFER ACCOUNT ERROR ===");
    throw error;
  }
}

export type UpdateTransferAccountRequest = {
  bankName: string;
  accountName: string;
  accountNumber: string;
};

export async function updateTransferAccount(payload: UpdateTransferAccountRequest) {
  console.log("=== UPDATE TRANSFER ACCOUNT DEBUG ===");
  console.log("Payload:", payload);
  console.log("=== END UPDATE TRANSFER ACCOUNT DEBUG ===");
  try {
    const result = await apiRequest<{ success: boolean }>('/api/v1/admin/transfer-account', {
      method: 'PUT',
      body: payload,
    });
    console.log("=== UPDATE TRANSFER ACCOUNT SUCCESS ===");
    console.log("Response:", result);
    console.log("=== END UPDATE TRANSFER ACCOUNT SUCCESS ===");
    return result;
  } catch (error) {
    console.error("=== UPDATE TRANSFER ACCOUNT ERROR ===");
    console.error("Error:", error);
    console.error("=== END UPDATE TRANSFER ACCOUNT ERROR ===");
    throw error;
  }
}

// Admin User Detail
export interface AdminUserDetail {
  planStartedAt?: string;
  planExpiresAt?: string;
  currentCyclePaidDays?: number;
  currentCyclePaidAmountNaira?: string;
  totalPaidDays?: number;
  totalPaidAmountNaira?: string;
}

export interface AdminUserDetailResponse {
  user: AdminUserDetail;
}

export async function getAdminUserDetail(userId: string, signal?: AbortSignal) {
  return apiRequest<AdminUserDetailResponse>(`/api/v1/admin/users/${userId}`, { signal });
}

// Admin Pending Deposits
export interface AdminPendingDeposit {
  id: string;
  amountNaira?: string | number;
  transferReference?: string;
  proofImagePath?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPendingDepositUser {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  selectedPlanId?: string;
  pendingDepositsCount?: number;
  pendingDeposits?: AdminPendingDeposit[];
}

export interface AdminPendingDepositsResponse {
  users: AdminPendingDepositUser[];
  nextCursor?: string;
}

export async function getAdminDeposits(params: { status: 'PENDING' | 'APPROVED', signal?: AbortSignal }) {
  const query = new URLSearchParams({ status: params.status });
  return apiRequest<AdminPendingDepositsResponse>(`/api/v1/admin/deposits?${query.toString()}`, { signal: params.signal });
}

export type AdminAllLoansResponse = {
  loans: AdminAllLoan[];
};

export type AdminAllLoan = {
  id: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
  requestedAmountNaira: string;
  reason: string;
  formImagePath: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  loanType: {
    id: string;
    name: string;
    maxAmountNaira: string;
    minAmountNaira: string;
    interestBps: number;
    durationDays: number;
    isActive: boolean;
  };
  loanBalance: string | null;
};

export async function getAdminAllLoans(signal?: AbortSignal) {
  return apiRequest<AdminAllLoansResponse>('/api/v1/loans/admin/all', { signal });
}

export type ApproveLoanRequest = {
  amountNaira: string;
  note?: string;
};

export type ApproveLoanResponse = {
  loanApplication: {
    id: string;
    status: 'APPROVED';
    approvedAt: string;
  };
  loanBalance: {
    userId: string;
    amountNaira: string;
    createdAt: string;
    note?: string;
  };
  ledgerTxnId: string;
};

export async function approveLoan(loanApplicationId: string, data: ApproveLoanRequest, signal?: AbortSignal) {
  return apiRequest<ApproveLoanResponse>(`/api/v1/loans/admin/applications/${loanApplicationId}/approve`, {
    method: 'POST',
    body: data,
    signal,
  });
}

export type DisburseLoanRequest = {
  note?: string;
};

export type DisburseLoanResponse = {
  loanApplication: {
    id: string;
    status: 'DISBURSED';
  };
  ledgerTxnId: string;
};

export async function disburseLoan(loanApplicationId: string, data: DisburseLoanRequest, signal?: AbortSignal) {
  return apiRequest<DisburseLoanResponse>(`/api/v1/loans/admin/applications/${loanApplicationId}/disburse`, {
    method: 'POST',
    body: data,
    signal,
  });
}

export type RejectLoanRequest = {
  note?: string;
};

export type RejectLoanResponse = {
  loanApplication: {
    id: string;
    status: 'REJECTED';
  };
};

export async function rejectLoan(loanApplicationId: string, data: RejectLoanRequest, signal?: AbortSignal) {
  return apiRequest<RejectLoanResponse>(`/api/v1/loans/admin/applications/${loanApplicationId}/reject`, {
    method: 'POST',
    body: data,
    signal,
  });
}

export type AdminDeposit = {
  id: string;
  userId: string;
  amountNaira: string;
  expectedAmountNaira: string;
  paymentMethod: "BANK_TRANSFER" | "WALLET";
  status: "PENDING" | "APPROVED" | "REJECTED";
  transferReference: string | null;
  proofImagePath: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
};

export type AdminDepositsResponse = {
  deposits: AdminDeposit[];
};

export type AdminRepayment = {
  id: string;
  createdAt: string;
  amountNaira: string;
  status: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  proofImagePath: string | null;
  transferReference: string | null;
};

export type AdminRepaymentsResponse = {
  repayments: AdminRepayment[];
};

export type ApproveRepaymentRequest = {
  note?: string;
};

export type RejectRepaymentRequest = {
  note?: string;
};

export async function getAdminRepayments(signal?: AbortSignal) {
  return apiRequest<AdminRepaymentsResponse>('/api/v1/loans/admin/repayments', { signal });
}

export async function approveRepayment(repaymentId: string, data: ApproveRepaymentRequest, signal?: AbortSignal) {
  return apiRequest(`/api/v1/loans/admin/repayments/${repaymentId}/approve`, {
    method: 'POST',
    body: data,
    signal,
  });
}

export async function rejectRepayment(repaymentId: string, data: RejectRepaymentRequest, signal?: AbortSignal) {
  return apiRequest(`/api/v1/loans/admin/repayments/${repaymentId}/reject`, {
    method: 'POST',
    body: data,
    signal,
  });
}

export async function getAdminAllDeposits(signal?: AbortSignal) {
  return apiRequest<AdminDepositsResponse>('/api/v1/deposits/admin', { signal });
}

// Admin Deposit Actions
export interface ApproveDepositRequest {
  note?: string;
}

export interface RejectDepositRequest {
  note?: string;
}

export async function approveDeposit(depositId: string, data?: ApproveDepositRequest) {
  return apiRequest(`/api/v1/deposits/admin/${depositId}/approve`, {
    method: 'POST',
    body: (data || {}) as Record<string, unknown>
  });
}

export async function rejectDeposit(depositId: string, data?: RejectDepositRequest) {
  return apiRequest(`/api/v1/deposits/admin/${depositId}/reject`, {
    method: 'POST',
    body: (data || {}) as Record<string, unknown>
  });
}

// Admin Plans
export type AdminPlan = {
  id: string;
  name: string;
  contributionAmountNaira: string;
  isActive: boolean;
};

export type AdminPlansResponse = AdminPlan[];

export type CreateAdminPlanRequest = {
  name: string;
  contributionAmountNaira: string;
  isActive: boolean;
};

export async function getAdminPlans(signal?: AbortSignal) {
  try {
    const result = await apiRequest<AdminPlansResponse>('/api/v1/plans', { signal });
    console.log("=== GET ADMIN PLANS SUCCESS ===");
    console.log("Response:", result);
    console.log("=== END GET ADMIN PLANS SUCCESS ===");
    return result;
  } catch (error) {
    console.error("=== GET ADMIN PLANS ERROR ===");
    console.error("Error:", error);
    console.error("=== END GET ADMIN PLANS ERROR ===");
    throw error;
  }
}

export async function createAdminPlan(data: CreateAdminPlanRequest) {
  console.log("=== CREATE ADMIN PLAN DEBUG ===");
  console.log("Payload:", data);
  console.log("=== END CREATE ADMIN PLAN DEBUG ===");
  try {
    const result = await apiRequest<{ plan: AdminPlan }>('/api/v1/admin/plans', {
      method: 'POST',
      body: data,
    });
    console.log("=== CREATE ADMIN PLAN SUCCESS ===");
    console.log("Response:", result);
    console.log("=== END CREATE ADMIN PLAN SUCCESS ===");
    return result;
  } catch (error) {
    console.error("=== CREATE ADMIN PLAN ERROR ===");
    console.error("Error:", error);
    console.error("=== END CREATE ADMIN PLAN ERROR ===");
    throw error;
  }
}
