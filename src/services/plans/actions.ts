import { apiRequest } from '../apiClient';

export type Plan = {
  id: string;
  name?: string;
  [key: string]: unknown;
};

type PlansApiResponse = unknown;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizePlansResponse(res: PlansApiResponse): Plan[] {
  if (Array.isArray(res)) {
    return res as Plan[];
  }

  if (isRecord(res)) {
    const maybeArray = res.data;
    if (Array.isArray(maybeArray)) {
      return maybeArray as Plan[];
    }
  }

  return [];
}

export async function getPlans() {
  const res = await apiRequest<PlansApiResponse>('/api/v1/plans');
  return normalizePlansResponse(res);
}
