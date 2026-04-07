import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GrowthPage from './pages/GrowthPage';
import PostsPage from './pages/PostsPage';
import RouteGuard from './components/RouteGuard';

/**
 * アプリケーションルートコンポーネント
 */
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <RouteGuard>
                <DashboardPage />
              </RouteGuard>
            }
          />
          <Route
            path="/growth"
            element={
              <RouteGuard>
                <GrowthPage />
              </RouteGuard>
            }
          />
          <Route
            path="/posts"
            element={
              <RouteGuard>
                <PostsPage />
              </RouteGuard>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
