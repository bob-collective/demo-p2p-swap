import { InterlayUIProvider } from '@interlay/system';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import App from './App';
import { config } from './connectors/wagmi-connectors';
import './index.css';
import '@interlay/theme/dist/bob.css';
import { CSSReset } from '@interlay/ui';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SatsWagmiConfig } from './lib/sats-wagmi';
import { ConnectWalletProvider } from './providers/ConnectWalletContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <SatsWagmiConfig>
          <ConnectWalletProvider>
            <InterlayUIProvider>
              <CSSReset />
              <App />
            </InterlayUIProvider>
          </ConnectWalletProvider>
        </SatsWagmiConfig>
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>
);
