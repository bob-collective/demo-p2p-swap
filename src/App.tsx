import { createWeb3Modal } from '@web3modal/wagmi/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WagmiConfig, useConnect } from 'wagmi';
import { Layout } from './components';
import { L2_PROJECT_ID, L2_CHAIN_CONFIG, config } from './connectors/wagmi-connectors';
import { P2P } from './pages/P2P';
import { V0 } from './pages/V0';
import { useEffect } from 'react';

createWeb3Modal({
  defaultChain: L2_CHAIN_CONFIG,
  wagmiConfig: config,
  projectId: L2_PROJECT_ID,
  chains: config.chains
});

function App() {
  const { connect } = useConnect({ connector: config.connectors[0] });

  /** PROMPT WALLET CONNECTION */
  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <WagmiConfig config={config}>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route element={<P2P />} path='/' />
            <Route element={<V0 />} path='v0/' />
          </Routes>
        </BrowserRouter>
      </Layout>
    </WagmiConfig>
  );
}

export default App;
