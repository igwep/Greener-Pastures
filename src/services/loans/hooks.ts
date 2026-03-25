import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../apiClient';
import {
  applyForLoan,
  getLoanTypes,
  getMyLoans,
  getLoanRepayments,
  repayLoan,
  type ApplyLoanRequest,
  type RepayLoanRequest,
  type MyLoansResponse,
  type LoanTypesResponse,
  type LoanRepaymentsResponse,
  type LoanType
} from './actions';

export function useLoanTypesQuery() {
  return useQuery<LoanTypesResponse, ApiError>({
    queryKey: ['loanTypes'],
    queryFn: ({ signal }) => getLoanTypes(signal)
  });
}

export function useMyLoansQuery() {
  return useQuery<MyLoansResponse, ApiError>({
    queryKey: ['myLoans'],
    queryFn: ({ signal }) => getMyLoans(signal)
  });
}

export function useLoanRepaymentsQuery() {
  return useQuery<LoanRepaymentsResponse, ApiError>({
    queryKey: ['loanRepayments'],
    queryFn: ({ signal }) => getLoanRepayments(signal)
  });
}

export function useApplyLoanMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: applyForLoan,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myLoans'] });
      qc.invalidateQueries({ queryKey: ['dashboardSummary'] });
    }
  });
}

export function useRepayLoanMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repayLoan,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myLoans'] });
      qc.invalidateQueries({ queryKey: ['dashboardSummary'] });
    }
  });
}
