export type ApiErrorPayload = {
  error?: string;
  details?: Record<string, unknown>;
};

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(status: number, message: string, payload?: ApiErrorPayload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://greener-pastures-backend.onrender.com';

type Json = Record<string, unknown> | unknown[];
type Body = Json | FormData;

export async function apiRequest<TResponse>(
  path: string,
  options: {
    method?: string;
    body?: Body;
    headers?: Record<string, string>;
    signal?: AbortSignal;
  } = {}
): Promise<TResponse> {
  const { method = 'GET', body, headers, signal } = options;

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {})
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    signal
  });

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    let payload: ApiErrorPayload | undefined;
    if (isJson) {
      try {
        payload = (await res.json()) as ApiErrorPayload;
      } catch {
        payload = undefined;
      }
    }

    const message = payload?.error || `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, payload);
  }

  if (res.status === 204) {
    return undefined as TResponse;
  }

  if (isJson) {
    return (await res.json()) as TResponse;
  }

  return (await res.text()) as unknown as TResponse;
}
