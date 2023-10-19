import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components';
import { L2_CHAIN_CONFIG, L2_METADATA, L2_PROJECT_ID, config } from './connectors/wagmi-connectors';
import { P2P } from './pages/P2P';
import { V0 } from './pages/V0';
import './utils/yup.custom';
import { AddressProofing } from './pages/AddressProofing';

const wagmiConfig = defaultWagmiConfig({ chains: [L2_CHAIN_CONFIG], projectId: L2_PROJECT_ID, metadata: L2_METADATA });

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
          <Route element={<AddressProofing />} path='AddressProofing/' />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
