import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { P2P } from './pages/P2P';
import { V0 } from './pages/V0';
import { Layout } from './components';
import { useConnect } from 'wagmi';
import { config } from './connectors/wagmi-connectors';
import { useEffect } from 'react';

function App() {
  const { connect } = useConnect({ connector: config.connectors[0] });
   
  /** PROMPT WALLET CONNECTION */
   useEffect(() => {
    connect();
  }, [connect]);

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
