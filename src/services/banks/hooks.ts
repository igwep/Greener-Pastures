import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../apiClient';
import { getNigerianBanks, NigerianBanksResponse } from './actions';

export function useNigerianBanksQuery() {
  return useQuery<NigerianBanksResponse, ApiError>({
    queryKey: ['nigerianBanks'],
    queryFn: getNigerianBanks,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 3
  });
}
