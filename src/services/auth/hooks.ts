import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getAuthMe,
  loginAdmin,
  loginUser,
  registerUser,
  updateProfile,
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

export function useUpdateProfileMutation() {
  return useMutation<AuthMeResponse, ApiError, {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  }>({
    mutationFn: async (variables) => {
      console.log('=== UPDATE PROFILE MUTATION START ===');
      console.log('📤 Variables sent to updateProfile:', variables);
      
      try {
        const result = await updateProfile(variables);
        console.log('✅ updateProfile API call successful:', result);
        return result;
      } catch (error) {
        console.error('❌ updateProfile API call failed:', error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      console.log('✅ Update profile mutation onSuccess:', data);
      // Invalidate auth me query to refresh user data
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for server to update
    },
    onError: (error) => {
      console.error('❌ Update profile mutation onError:', error);
      console.error('❌ Error details:', {
        status: error.status,
        message: error.message,
        payload: error.payload
      });
    },
  });
}
