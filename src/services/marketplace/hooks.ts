
// src/services/marketplace/hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../apiClient';
import {
  createProduct,
  getMyProducts,
  extendProduct,
  getPublicProducts,
  getPublicProduct,
  getMarketplaceSettings,
  getMarketplaceCategories,
  getAdminProducts,
  approveProductAdmin,
  rejectProductAdmin,
  getAdminMarketplaceSettings,
  updateAdminMarketplaceSettings,
  listAdminProducts,
  approveProduct,
  rejectProduct,
  type Product,
  type CreateProductFormData,
  type ExtendProductFormData,
  type MarketplaceSettings,
  type CreateProductResponse,
  type ExtendProductResponse,
  type ProductsResponse,
  type CategoriesResponse
} from './actions';

// User Product Management
export function useCreateProductMutation() {
  const qc = useQueryClient();
  return useMutation<CreateProductResponse, ApiError, CreateProductFormData>({
    mutationFn: createProduct,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['marketplace', 'my-products'] });
      await qc.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });
}

export function useMyProductsQuery() {
  return useQuery<ProductsResponse, ApiError>({
    queryKey: ['marketplace', 'my-products'],
    queryFn: ({ signal }) => getMyProducts(signal),
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        // Don't retry for authentication errors, 404s, or 400s
        if (error.status === 401 || error.status === 404 || error.status === 400) return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useMarketplaceCategoriesQuery() {
  return useQuery<CategoriesResponse, ApiError>({
    queryKey: ['marketplace', 'categories'],
    queryFn: ({ signal }) => getMarketplaceCategories(signal),
    staleTime: 1000 * 60 * 60, // 1 hour - categories don't change often
    refetchOnWindowFocus: false,
  });
}

export function useExtendProductMutation() {
  const qc = useQueryClient();
  return useMutation<ExtendProductResponse, ApiError, { productId: string; data: ExtendProductFormData }>({
    mutationFn: ({ productId, data }) => extendProduct(productId, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['marketplace', 'my-products'] });
      await qc.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });
}

// Public Product Browsing
export function usePublicProductsQuery() {
  return useQuery<ProductsResponse, ApiError>({
    queryKey: ['marketplace', 'public-products'],
    queryFn: ({ signal }) => getPublicProducts(signal),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function usePublicProductQuery(productId: string) {
  return useQuery<{ product: Product }, ApiError>({
    queryKey: ['marketplace', 'public-product', productId],
    queryFn: ({ signal }) => getPublicProduct(productId, signal),
    enabled: !!productId,
  });
}

// Settings
export function useMarketplaceSettingsQuery() {
  return useQuery<MarketplaceSettings, ApiError>({
    queryKey: ['marketplace', 'settings'],
    queryFn: ({ signal }) => getMarketplaceSettings(signal),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Admin Functions
export function useAdminMarketplaceProductsQuery() {
  return useQuery<ProductsResponse, ApiError>({
    queryKey: ['admin', 'marketplace', 'products'],
    queryFn: ({ signal }) => getAdminProducts(signal),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useApproveProductAdminMutation() {
  const qc = useQueryClient();
  return useMutation<{ product: Product }, ApiError, string>({
    mutationFn: approveProductAdmin,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'marketplace', 'products'] });
      await qc.invalidateQueries({ queryKey: ['marketplace', 'public-products'] });
    },
  });
}

export function useRejectProductAdminMutation() {
  const qc = useQueryClient();
  return useMutation<{ product: Product }, ApiError, string>({
    mutationFn: rejectProductAdmin,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'marketplace', 'products'] });
      await qc.invalidateQueries({ queryKey: ['marketplace', 'public-products'] });
    },
  });
}

export function useAdminMarketplaceSettingsQuery() {
  return useQuery<MarketplaceSettings, ApiError>({
    queryKey: ['admin', 'marketplace', 'settings'],
    queryFn: ({ signal }) => getAdminMarketplaceSettings(signal),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useUpdateAdminMarketplaceSettingsMutation() {
  const qc = useQueryClient();
  return useMutation<MarketplaceSettings, ApiError, { dailyListingFeeNaira: string }>({
    mutationFn: updateAdminMarketplaceSettings,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'marketplace', 'settings'] });
      await qc.invalidateQueries({ queryKey: ['marketplace', 'settings'] });
    },
  });
}

// Legacy hooks for backward compatibility
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
