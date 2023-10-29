// app/providers.jsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { SessionProvider } from 'next-auth/react';

export function Providers(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        <SessionProvider>{props.children}</SessionProvider>
      </ReactQueryStreamedHydration>
      {/*  {<ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
}
