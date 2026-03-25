import { useQuery } from '@tanstack/react-query';
import { getPlans } from './actions';

export function usePlansQuery() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: getPlans
  });
}

export type UsePlansQueryResult = ReturnType<typeof usePlansQuery>;
