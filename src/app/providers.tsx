'use client';

import { type PrivyClientConfig, PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

const config: PrivyClientConfig = {
    embeddedWallets: {
        ethereum: {
            createOnLogin: 'users-without-wallets',
        },
    },
};

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                refetchOnWindowFocus: false,
                gcTime: 5 * 60 * 1000, // 5 minutes
                retry: 1,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <PrivyProvider
                appId="cmbp3dj6t0098l70nklpgx4i2"
                clientId="client-WY6MC3d5SKAJj82fBQtzhKXRW9nqFuGL9A4v8H6W7DME9"
                config={config}
            >
                {children}
            </PrivyProvider>
        </QueryClientProvider>
    );
} 