import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../apiClient';
import {
  getAdminDashboard,
  listAdminContributionPayments,
  approveContributionPayment,
  rejectContributionPayment,
  getAdminUserDetail,
  getAdminDeposits,
  approveDeposit,
  rejectDeposit,
  type ApproveDepositRequest,
  type RejectDepositRequest,
  getAdminUsers,
  getAdminUserFullData,
  updateTransferAccount,
  getTransferAccount,
  type UpdateTransferAccountRequest,
  type TransferAccount,
  getAdminAllLoans,
  getAdminAllDeposits,
  getAdminRepayments,
  approveRepayment,
  rejectRepayment,
  type ApproveRepaymentRequest,
  type RejectRepaymentRequest,
  approveLoan,
  disburseLoan,
  rejectLoan,
  type ApproveLoanRequest,
  type DisburseLoanRequest,
  type RejectLoanRequest,
  getAdminWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  markWithdrawalAsPaid,
  type ApproveWithdrawalRequest,
  type RejectWithdrawalRequest,
  type MarkWithdrawalAsPaidRequest,
  type AdminWithdrawalsResponse,
  getAdminPlans,
  createAdminPlan,
  type CreateAdminPlanRequest,
  type AdminPlansResponse,
  type AdminPlan
} from './actions';

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: ({ signal }) => getAdminDashboard(signal),
    staleTime: 1000 * 60 * 5
  });
}

export function useAdminContributionPaymentsQuery(params: { status: 'PENDING' | 'APPROVED' | 'REJECTED' }) {
  return useQuery({
    queryKey: ['admin', 'contribution-payments', params.status],
    queryFn: ({ signal }) => listAdminContributionPayments({ ...params, signal }),
    staleTime: 1000 * 60 * 2
  });
}

export function useApproveContributionPaymentMutation() {
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, ApiError, { contributionPaymentId: string; note?: string }>({
    mutationFn: approveContributionPayment,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'contribution-payments'] });
      await qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    }
  });
}

export function useRejectContributionPaymentMutation() {
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, ApiError, { contributionPaymentId: string; note?: string }>({
    mutationFn: rejectContributionPayment,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'contribution-payments'] });
      await qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    }
  });
}

export function useAdminUserDetailQuery(userId: string) {
  return useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: ({ signal }) => getAdminUserDetail(userId, signal),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5
  });
}

export function useAdminDepositsQuery(params: { status: 'PENDING' | 'APPROVED' }) {
  return useQuery({
    queryKey: ['admin', 'deposits', params.status],
    queryFn: ({ signal }) => getAdminDeposits({ ...params, signal }),
    staleTime: 1000 * 60 * 2
  });
}

export function useApproveDepositMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ depositId, data }: { depositId: string; data?: ApproveDepositRequest }) => 
      approveDeposit(depositId, data),
    onSuccess: () => {
      // Invalidate admin deposit lists so UI reflects new status
      queryClient.invalidateQueries({ queryKey: ['admin', 'deposits'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    }
  });
}

export function useRejectDepositMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ depositId, data }: { depositId: string; data?: RejectDepositRequest }) => 
      rejectDeposit(depositId, data),
    onSuccess: () => {
      // Invalidate admin deposit lists so UI reflects new status
      queryClient.invalidateQueries({ queryKey: ['admin', 'deposits'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    }
  });
}

export function useAdminUsersQuery(params: { q?: string; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: ({ signal }) => getAdminUsers({ ...params, signal }),
  });
}

export function useAdminUserFullDataQuery(userId: string) {
  return useQuery({
    queryKey: ['admin', 'users', userId, 'full-data'],
    queryFn: ({ signal }) => getAdminUserFullData(userId, signal),
    enabled: !!userId,
  });
}

export function useUpdateTransferAccountMutation() {
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, ApiError, UpdateTransferAccountRequest>({
    mutationFn: updateTransferAccount,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      await qc.invalidateQueries({ queryKey: ['transferAccount'] });
    },
  });
}

export function useTransferAccountQuery() {
  return useQuery<{ transferAccount: TransferAccount }, ApiError>({
    queryKey: ['transferAccount'],
    queryFn: ({ signal }) => getTransferAccount(signal),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}

export function useAdminAllLoansQuery() {
  return useQuery({
    queryKey: ['admin', 'loans', 'all'],
    queryFn: ({ signal }) => getAdminAllLoans(signal),
    staleTime: 1000 * 60 * 5
  });
}

export function useAdminAllDepositsQuery() {
  return useQuery({
    queryKey: ['admin', 'deposits', 'all'],
    queryFn: ({ signal }) => getAdminAllDeposits(signal),
    staleTime: 1000 * 60 * 5
  });
}

export function useAdminRepaymentsQuery() {
  return useQuery({
    queryKey: ['admin', 'repayments'],
    queryFn: ({ signal }) => getAdminRepayments(signal),
    staleTime: 1000 * 60 * 5
  });
}

export function useApproveRepaymentMutation() {
  const qc = useQueryClient();
  return useMutation<any, ApiError, { repaymentId: string; data?: ApproveRepaymentRequest }>({
    mutationFn: ({ repaymentId, data }) => approveRepayment(repaymentId, data || {}),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'repayments'] });
    },
  });
}

export function useRejectRepaymentMutation() {
  const qc = useQueryClient();
  return useMutation<any, ApiError, { repaymentId: string; data?: RejectRepaymentRequest }>({
    mutationFn: ({ repaymentId, data }) => rejectRepayment(repaymentId, data || {}),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'repayments'] });
    },
  });
}

export function useApproveLoanMutation() {
  const qc = useQueryClient();
  return useMutation<any, ApiError, { loanApplicationId: string; data: ApproveLoanRequest }>({
    mutationFn: ({ loanApplicationId, data }) => approveLoan(loanApplicationId, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'loans'] });
      await qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useDisburseLoanMutation() {
  const qc = useQueryClient();
  return useMutation<any, ApiError, { loanApplicationId: string; data: DisburseLoanRequest }>({
    mutationFn: ({ loanApplicationId, data }) => disburseLoan(loanApplicationId, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'loans'] });
      await qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useRejectLoanMutation() {
  const qc = useQueryClient();
  return useMutation<any, ApiError, { loanApplicationId: string; data: RejectLoanRequest }>({
    mutationFn: ({ loanApplicationId, data }) => rejectLoan(loanApplicationId, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'loans'] });
      await qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useAdminWithdrawalsQuery() {
  return useQuery<AdminWithdrawalsResponse, ApiError>({
    queryKey: ['admin', 'withdrawals'],
    queryFn: ({ signal }) => getAdminWithdrawals(signal),
  });
}

export function useApproveWithdrawalMutation() {
  const qc = useQueryClient();
  return useMutation<any, ApiError, { withdrawalId: string; data: ApproveWithdrawalRequest }>({
    mutationFn: ({ withdrawalId, data }) => approveWithdrawal(withdrawalId, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
      await qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useRejectWithdrawalMutation() {
  const qc = useQueryClient();
  return useMutation<any, ApiError, { withdrawalId: string; data: RejectWithdrawalRequest }>({
    mutationFn: ({ withdrawalId, data }) => rejectWithdrawal(withdrawalId, data || {}),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
      await qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useMarkWithdrawalAsPaidMutation() {
  const qc = useQueryClient();
  return useMutation<any, ApiError, { withdrawalId: string; data: MarkWithdrawalAsPaidRequest }>({
    mutationFn: ({ withdrawalId, data }) => markWithdrawalAsPaid(withdrawalId, data || {}),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
      await qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

// Admin Plans
export function useAdminPlansQuery() {
  return useQuery<AdminPlansResponse, ApiError>({
    queryKey: ['admin', 'plans'],
    queryFn: ({ signal }) => getAdminPlans(signal),
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useCreateAdminPlanMutation() {
  const qc = useQueryClient();
  return useMutation<{ plan: AdminPlan }, ApiError, CreateAdminPlanRequest>({
    mutationFn: createAdminPlan,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'plans'] });
    },
  });
}
