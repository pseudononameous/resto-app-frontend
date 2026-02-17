import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import theme from './Theme';
import router from './routes/Router';
import PageLoading from './components/loader/PageLoading';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'response' in error) {
          const status = (error as { response?: { status?: number } }).response?.status;
          if (status === 401 || status === 403) return false;
        }
        return failureCount < 3;
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<PageLoading />}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
      <Notifications position="top-right" />
    </MantineProvider>
  </StrictMode>
);
