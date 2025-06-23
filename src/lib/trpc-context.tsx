import superjson from 'superjson';
import React, { useMemo } from 'react';
import { keepPreviousData, QueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { httpBatchLink, loggerLink } from '@trpc/client';

import { trpc } from './trpc';
import { config } from './config';

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'TRPC_QUERY_CACHE',
  // Optional: Serialize/deserialize functions
  serialize: (data: any) => JSON.stringify(data),
  deserialize: (data: any) => JSON.parse(data),
  // Optional: Filter which queries get persisted
  throttleTime: 1000, // Default: 1000ms
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable for mobile
      placeholderData: keepPreviousData,
      refetchOnMount: true,
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

export const TRPCProvider = ({ children }: { children: React.ReactNode }) => {
  const trpcClient = useMemo(() => {
    return trpc.createClient({
      links: [
        loggerLink({
          enabled: opts =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
          colorMode: 'ansi',
        }),
        httpBatchLink({
          transformer: superjson,
          // Use configuration for server URL
          url: __DEV__ ? config.trpc.developmentUrl : config.trpc.productionUrl,
        }),
      ],
    });
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        {children}
      </PersistQueryClientProvider>
    </trpc.Provider>
  );
};
