
// src/services/marketplace/actions.ts
import { apiRequest } from '../apiClient';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  user: {
    firstName: string;
    lastName: string;
  };
};

export type ListProductsResponse = {
  products: Product[];
};

export async function listAdminProducts(params: { status: 'PENDING' | 'APPROVED' | 'REJECTED'; signal?: AbortSignal }) {
  const query = new URLSearchParams({ status: params.status });
  return apiRequest<ListProductsResponse>(`/api/v1/marketplace/admin/products?${query.toString()}`, {
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
