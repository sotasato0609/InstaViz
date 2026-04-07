import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * 認証ガードコンポーネント
 * 未ログイン時は /login へリダイレクト
 */
const RouteGuard = ({ children }: RouteGuardProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6F9]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#CC0022] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6B7080]">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
