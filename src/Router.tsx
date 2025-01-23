import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePages';

const Router = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Layout>
  );
};

export default Router;
