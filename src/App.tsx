import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { P2P } from './pages/P2P';
import { V0 } from './pages/V0';
import { Layout } from './components';
import { useAccount, useConnect } from 'wagmi';
import { config } from './connectors/wagmi-connectors';
import { useEffect } from 'react';
import { CTA, Flex } from '@interlay/ui';

function App() {
  const { connect } = useConnect({ connector: config.connectors[0] });
  const { address } = useAccount();

  const isAccountConnected = !!address;

  /** PROMPT WALLET CONNECTION */
  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <Layout>
      <Flex justifyContent='flex-end' marginBottom='spacing2'>
        <CTA disabled={isAccountConnected} onClick={() => connect()}>
          {isAccountConnected ? `${address.slice(0, 4)}...${address.slice(address.length - 4)}` : 'Connect wallet'}
        </CTA>
      </Flex>{' '}
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
