import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { ApiError } from '../apiClient';
import {
  listLoanApplicationsAdmin,
  approveLoanAdmin,
  disburseLoanAdmin,
  rejectLoanAdmin,
  type ListLoanApplicationsParams,
  type ApproveLoanRequest,
  type DisburseLoanRequest
} from './adminActions';

export function useAdminLoanApplicationsInfiniteQuery(params: Omit<ListLoanApplicationsParams, 'cursor'>) {
  return useInfiniteQuery({
    queryKey: ['adminLoanApplications', params],
    queryFn: ({ pageParam, signal }) =>
      listLoanApplicationsAdmin({ ...params, cursor: pageParam as string | undefined, signal }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useApproveLoanMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveLoanRequest }) =>
      approveLoanAdmin(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminLoanApplications'] });
    },
  });
}

export function useDisburseLoanMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DisburseLoanRequest }) =>
      disburseLoanAdmin(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminLoanApplications'] });
    },
  });
}

export function useRejectLoanMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { note?: string } }) =>
      rejectLoanAdmin(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminLoanApplications'] });
    },
  });
}
