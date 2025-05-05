'use client';

import type {PropsWithChildren} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
// import {ReactQueryStreamedHydration} from '@tanstack/react-query-next-experimental'; // Temporarily commented out due to 'Module not found' error.

const queryClient = new QueryClient();

export function AppProviders({children}: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration> */}
      {children} {/* Render children directly as a workaround */}
    </QueryClientProvider>
  );
}
