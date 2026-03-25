
// src/services/marketplace/hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../apiClient';
import {
  listAdminProducts,
  approveProduct,
  rejectProduct,
  type Product,
} from './actions';

export function useAdminProductsQuery(params: { status: 'PENDING' | 'APPROVED' | 'REJECTED' }) {
  return useQuery({
    queryKey: ['admin', 'marketplace', 'products', params.status],
    queryFn: ({ signal }) => listAdminProducts({ ...params, signal }),
  });
}

export function useApproveProductMutation() {
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, ApiError, string>({
    mutationFn: approveProduct,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'marketplace', 'products'] });
    },
  });
}

export function useRejectProductMutation() {
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, ApiError, string>({
    mutationFn: rejectProduct,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'marketplace', 'products'] });
    },
  });
}
