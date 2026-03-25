import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getAuthMe,
  loginAdmin,
  loginUser,
  registerUser,
  type AuthMeResponse,
  type LoginRequest,
  type LoginResponse,
  type AdminLoginResponse,
  type RegisterRequest,
  type RegisterResponse
} from './actions';
import { ApiError } from '../apiClient';

export function useRegisterMutation() {
  return useMutation<RegisterResponse, ApiError, RegisterRequest>({
    mutationFn: registerUser
  });
}

export function useLoginMutation() {
  return useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: loginUser
  });
}

export function useAdminLoginMutation() {
  return useMutation<AdminLoginResponse, ApiError, LoginRequest>({
    mutationFn: loginAdmin
  });
}

export function useAuthMeQuery() {
  return useQuery<AuthMeResponse, ApiError>({
    queryKey: ['auth', 'me'],
    queryFn: ({ signal }) => getAuthMe(signal),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 401) return false;
      return failureCount < 2;
    }
  });
}
