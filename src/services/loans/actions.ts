import { apiRequest } from '../apiClient';

export interface LoanType {
  id: string;
  name: string;
  interestBps: number;
  maxAmountNaira: string;
  minAmountNaira?: string;
  durationDays?: number;
  isActive?: boolean;
  description?: string;
}

export interface LoanTypesResponse {
  loanTypes: LoanType[];
}

export interface LoanApplication {
  id: string;
  status: "PENDING" | "APPROVED" | "DISBURSED" | "REJECTED";
  requestedAmountNaira: string;
  reason: string;
  formImagePath?: string;
  loanType: {
    name: string;
    interestBps: number;
  };
  createdAt: string;
}

export interface MyLoansResponse {
  loanApplications: LoanApplication[];
  loanBalance: {
    amountNaira: string;
  };
}

export interface ApplyLoanRequest {
  loanTypeId: string;
  requestedAmountNaira: number | string;
  reason: string;
  formUrl: string;
}

export interface RepayLoanRequest {
  amountNaira: number | string;
  transferReference?: string;
  proofUrl: string;
}

export interface LoanRepayment {
  id: string;
  createdAt: string;
  amountNaira: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  proofImagePath?: string;
  transferReference?: string;
  approvedAt?: string;
  rejectedAt?: string;
}

export interface LoanRepaymentsResponse {
  repayments: LoanRepayment[];
}

export async function getLoanTypes(signal?: AbortSignal) {
  return apiRequest<LoanTypesResponse>("/api/v1/loans/types", { signal });
}

export async function applyForLoan(payload: ApplyLoanRequest) {
  return apiRequest<{ success: boolean; loanApplication: LoanApplication }>('/api/v1/loans/apply', {
    method: 'POST',
    body: payload,
  });
}

export async function getMyLoans(signal?: AbortSignal) {
  return apiRequest<MyLoansResponse>('/api/v1/loans/me', { signal });
}

export async function getLoanRepayments(signal?: AbortSignal) {
  return apiRequest<LoanRepaymentsResponse>("/api/v1/loans/me/repayments", { signal });
}

export async function repayLoan(payload: RepayLoanRequest) {
  return apiRequest<{ success: boolean; repayment: LoanRepayment }>('/api/v1/loans/repay', {
    method: 'POST',
    body: payload,
  });
}
