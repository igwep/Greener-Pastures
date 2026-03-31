import { apiRequest } from '../apiClient';
import type { Category, CategoriesResponse } from '../../schemas/marketplace';

export type CreateCategoryRequest = {
  name: string;
  description?: string;
  isActive?: boolean;
};

export type UpdateCategoryRequest = {
  name?: string;
  description?: string;
  isActive?: boolean;
};

export type CreateOrUpdateCategoryResponse = {
  category: Category;
};

export async function adminListCategories(params?: { includeInactive?: boolean; signal?: AbortSignal }) {
  const search = new URLSearchParams();
  if (params?.includeInactive) search.set('includeInactive', 'true');
  const qs = search.toString();
  const path = `/api/v1/marketplace/categories${qs ? `?${qs}` : ''}`;
  return apiRequest<CategoriesResponse>(path, { signal: params?.signal });
}

export async function adminCreateCategory(payload: CreateCategoryRequest) {
  return apiRequest<CreateOrUpdateCategoryResponse>('/api/v1/marketplace/categories', {
    method: 'POST',
    body: payload,
  });
}

export async function adminUpdateCategory(categoryId: string, payload: UpdateCategoryRequest) {
  return apiRequest<CreateOrUpdateCategoryResponse>(`/api/v1/marketplace/categories/${categoryId}`, {
    method: 'PUT',
    body: payload,
  });
}

export async function adminDeleteCategory(categoryId: string) {
  return apiRequest<{ message: string }>(`/api/v1/marketplace/categories/${categoryId}`, {
    method: 'DELETE',
  });
}

