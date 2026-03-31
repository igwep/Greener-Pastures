// src/services/marketplace/actions.ts
import { apiRequest } from '../apiClient';
import type { 
  Product, 
  CreateProductResponse, 
  ExtendProductResponse, 
  ProductsResponse, 
  MarketplaceSettings,
  CreateProductFormData,
  AdminCreateProductFormData,
  UpdateProductFormData,
  ExtendProductFormData,
  CategoriesResponse
} from '../../schemas/marketplace';

// User Product Management
export async function createProduct(data: CreateProductFormData) {
  return apiRequest<CreateProductResponse>('/api/v1/marketplace/products', {
    method: 'POST',
    body: data,
  });
}

export async function getMyProducts(signal?: AbortSignal) {
  return apiRequest<ProductsResponse>('/api/v1/marketplace/products/me', { signal });
}

export async function updateProduct(productId: string, data: UpdateProductFormData) {
  return apiRequest<CreateProductResponse>(`/api/v1/marketplace/products/${productId}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteProduct(productId: string) {
  return apiRequest<void>(`/api/v1/marketplace/products/${productId}`, {
    method: 'DELETE',
  });
}

export async function toggleProductActive(productId: string) {
  return apiRequest<Product>(`/api/v1/marketplace/products/${productId}/active`, {
    method: 'PATCH',
  });
}

export async function extendProduct(productId: string, data: ExtendProductFormData) {
  return apiRequest<ExtendProductResponse>(`/api/v1/marketplace/products/${productId}/extend`, {
    method: 'POST',
    body: data,
  });
}

// Public Product Browsing
export type GetPublicProductsParams = {
  limit?: number;
  categoryId?: string;
  cursor?: string;
  signal?: AbortSignal;
};

export async function getPublicProducts(params?: GetPublicProductsParams) {
  const { limit = 50, categoryId, cursor, signal } = params || {};
  const queryParams = new URLSearchParams();
  
  if (limit) queryParams.append('limit', limit.toString());
  if (categoryId) queryParams.append('categoryId', categoryId);
  if (cursor) queryParams.append('cursor', cursor);
  
  const query = queryParams.toString();
  const path = `/api/v1/marketplace/products${query ? `?${query}` : ''}`;
  
  return apiRequest<ProductsResponse>(path, { signal });
}

export async function getPublicProduct(productId: string, signal?: AbortSignal) {
  return apiRequest<{ product: Product }>(`/api/v1/marketplace/products/${productId}`, { signal });
}

// Settings
export async function getMarketplaceSettings(signal?: AbortSignal) {
  return apiRequest<MarketplaceSettings>('/api/v1/marketplace/settings', { signal });
}

export async function getMarketplaceCategories(signal?: AbortSignal): Promise<CategoriesResponse> {
  return apiRequest<CategoriesResponse>('/api/v1/marketplace/categories', { signal });
}

// Admin Functions
export async function getAdminProducts(signal?: AbortSignal) {
  return apiRequest<ProductsResponse>('/api/v1/marketplace/admin/products', { signal });
}

export type AdminCreateProductRequest = AdminCreateProductFormData;

export async function createAdminProduct(data: AdminCreateProductRequest) {
  return apiRequest<{ product: Product }>('/api/v1/marketplace/admin/products', {
    method: 'POST',
    body: data,
  });
}

export type AdminProductStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'REJECTED';

export type ListAdminProductsParams = {
  status?: AdminProductStatus;
  limit?: number;
  cursor?: string;
  signal?: AbortSignal;
};

export async function approveProductAdmin(productId: string) {
  return apiRequest<{ product: Product }>(`/api/v1/marketplace/admin/products/${productId}/approve`, {
    method: 'POST',
  });
}

export async function rejectProductAdmin(productId: string) {
  return apiRequest<{ product: Product }>(`/api/v1/marketplace/admin/products/${productId}/reject`, {
    method: 'POST',
  });
}

export async function suspendProductAdmin(productId: string) {
  return apiRequest<{ product: Product }>(`/api/v1/marketplace/admin/products/${productId}/suspend`, {
    method: 'POST',
  });
}

export async function getAdminMarketplaceSettings(signal?: AbortSignal) {
  return apiRequest<MarketplaceSettings>('/api/v1/marketplace/admin/settings', { signal });
}

export async function updateAdminMarketplaceSettings(data: { dailyListingFeeNaira: string }) {
  return apiRequest<MarketplaceSettings>('/api/v1/marketplace/admin/settings', {
    method: 'PUT',
    body: data,
  });
}

// Legacy functions for backward compatibility
export async function listAdminProducts(params: ListAdminProductsParams) {
  const query = new URLSearchParams();
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.cursor) query.append('cursor', params.cursor);
  if (params.status) query.append('status', params.status);

  return apiRequest<ProductsResponse>(`/api/v1/marketplace/admin/products?${query.toString()}`, {
    signal: params.signal,
  });
}

export async function approveProduct(productId: string) {
  return apiRequest<{ success: boolean }>(`/api/v1/marketplace/admin/products/${productId}/approve`, {
    method: 'POST',
  });
}

export async function rejectProduct(productId: string) {
  return apiRequest<{ success: boolean }>(`/api/v1/marketplace/admin/products/${productId}/reject`, {
    method: 'POST',
  });
}

// Re-export types
export type { 
  Product, 
  ProductsResponse as ListProductsResponse,
  CreateProductFormData,
  ExtendProductFormData,
  MarketplaceSettings,
  CreateProductResponse,
  ExtendProductResponse,
  ProductsResponse,
  CategoriesResponse
} from '../../schemas/marketplace';
