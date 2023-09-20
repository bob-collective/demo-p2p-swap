import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { P2P } from './pages/P2P';
import { V0 } from './pages/V0';
import { Layout } from './components';

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
