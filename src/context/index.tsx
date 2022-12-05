import React, { ReactNode } from "react";
import { AppProvider } from "context/userContext";
import { QueryClient, QueryClientProvider } from "react-query";
export const AppProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return <QueryClientProvider client={queryClient}>
    <AppProvider>{children}</AppProvider>
  </QueryClientProvider>;
};