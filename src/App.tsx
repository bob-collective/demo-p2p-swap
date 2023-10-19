import { createWeb3Modal } from '@web3modal/wagmi/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createConfig } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { Layout } from './components';
import { L2_CHAIN_CONFIG, L2_METADATA, L2_PROJECT_ID, config, publicClient } from './connectors/wagmi-connectors';
import { P2P } from './pages/P2P';
import { V0 } from './pages/V0';
import './utils/yup.custom';

import { InjectedConnector } from 'wagmi/connectors/injected';
const chains = [L2_CHAIN_CONFIG];

const wagmiConfig = createConfig({
  autoConnect: true,

  connectors: [
    new WalletConnectConnector({
      chains,
      options: { projectId: L2_PROJECT_ID, showQrModal: false, metadata: L2_METADATA }
    }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }) // new InjectedConnector({ chains, options: { shimDisconnect: true } })
  ],
  publicClient
});

// const wagmiConfig = createConfig({ chains: [, projectId: L2_PROJECT_ID, metadata: L2_METADATA });

createWeb3Modal({
  defaultChain: L2_CHAIN_CONFIG,
  wagmiConfig: wagmiConfig,
  projectId: L2_PROJECT_ID,
  chains: config.chains
});

function App() {
  return (
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route element={<P2P />} path='/' />
          <Route element={<V0 />} path='v0/' />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
