import { apiRequest } from '../apiClient';

export interface AdminLoanApplication {
  id: string;
  status: "PENDING" | "APPROVED" | "DISBURSED" | "REJECTED";
  requestedAmountNaira: string;
  approvedAmountNaira?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  loanType: {
    name: string;
  };
  reason?: string;
  formImagePath?: string;
  createdAt: string;
}

export interface ListLoanApplicationsResponse {
  applications: AdminLoanApplication[];
  nextCursor: string | null;
}

export interface ListLoanApplicationsParams {
  limit?: number;
  cursor?: string;
  status?: 'PENDING' | 'APPROVED' | 'DISBURSED' | 'REJECTED';
  signal?: AbortSignal;
}

export async function listLoanApplicationsAdmin(params: ListLoanApplicationsParams) {
  const query = new URLSearchParams();
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.cursor) query.append('cursor', params.cursor);
  if (params.status) query.append('status', params.status);

  return apiRequest<ListLoanApplicationsResponse>(`/api/v1/loans/admin/applications?${query.toString()}`, {
    signal: params.signal,
  });
}

export interface ApproveLoanRequest {
  amountNaira: number | string;
  note?: string;
}

export async function approveLoanAdmin(id: string, payload: ApproveLoanRequest) {
  return apiRequest<{ success: boolean }>(`/api/v1/loans/admin/applications/${id}/approve`, {
    method: 'POST',
    body: payload,
  });
}

export interface DisburseLoanRequest {
  note?: string;
}

export async function disburseLoanAdmin(id: string, payload: DisburseLoanRequest) {
  return apiRequest<{ success: boolean }>(`/api/v1/loans/admin/applications/${id}/disburse`, {
    method: 'POST',
    body: payload,
  });
}

export async function rejectLoanAdmin(id: string, payload: { note?: string }) {
  return apiRequest<{ success: boolean }>(`/api/v1/loans/admin/applications/${id}/reject`, {
    method: 'POST',
    body: payload,
  });
}
