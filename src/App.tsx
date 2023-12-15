import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components';
import { P2P } from './pages/P2P';
import './utils/yup.custom';

function App() {
  return (
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route element={<P2P />} path='/' />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
