import { apiRequest } from '../apiClient';

export type RegisterRequest = {
  email?: string;
  phone?: string;
  password: string;
  firstName: string;
  lastName: string;
  selectedPlanId: string;
};

export type RegisterResponse = unknown;

export type LoginRequest = {
  email?: string;
  phone?: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: Record<string, unknown>;
};

export type AdminLoginResponse = {
  token: string;
  admin: Record<string, unknown>;
};

export type AuthMeBankAccount = {
  id?: string;
  bankName?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
} | null;

export type AuthMeResponse = {
  user?: {
    id?: string;
    email?: string;
    phone?: string | null;
    firstName?: string;
    lastName?: string;
    bankAccount?: AuthMeBankAccount;
    withdrawalAccount?: AuthMeBankAccount;
    bankAccounts?: Array<NonNullable<AuthMeBankAccount>>;
  };
  bankAccount?: AuthMeBankAccount;
  withdrawalAccount?: AuthMeBankAccount;
} & Record<string, unknown>;

export async function registerUser(payload: RegisterRequest) {
  return apiRequest<RegisterResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: payload
  });
}

export async function loginUser(payload: LoginRequest) {
  return apiRequest<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: payload
  });
}

export async function loginAdmin(payload: LoginRequest) {
  return apiRequest<AdminLoginResponse>('/api/v1/admin/auth/login', {
    method: 'POST',
    body: payload
  });
}

export async function getAuthMe(signal?: AbortSignal) {
  return apiRequest<AuthMeResponse>('/api/v1/auth/me', { signal });
}
