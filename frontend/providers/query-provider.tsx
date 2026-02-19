'use client';

import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchInterval: false,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes default stale time
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  }));

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
}

