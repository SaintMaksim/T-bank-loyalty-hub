import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import UserSelect from './pages/UserSelect';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserSelect />} />
          <Route path="/dashboard/:userId" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;