import { InterlayUIProvider } from '@interlay/system';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import App from './App';
import { config } from './connectors/wagmi-connectors';
import './index.css';
import '@interlay/theme/dist/bob.css';
import { CSSReset } from '@interlay/ui';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <InterlayUIProvider>
        <CSSReset />
        <App />
      </InterlayUIProvider>
    </WagmiConfig>
  </React.StrictMode>
);
