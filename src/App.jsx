import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './hooks/useTheme';
import { PersistentStateProvider } from './hooks/usePersistentState';
import AppRoutes from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PersistentStateProvider>
          <AppRoutes />
        </PersistentStateProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
