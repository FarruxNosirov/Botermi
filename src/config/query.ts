import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      gcTime: 5 * 60 * 1000, // 5 min
      staleTime: 1 * 60 * 1000, // 1 min
    },
    mutations: {
      retry: 0,
    },
  },
});
