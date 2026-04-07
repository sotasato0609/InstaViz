import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  /** admin専用ルートの場合はtrueを指定 */
  requireAdmin?: boolean;
}

/**
 * 認証ガードコンポーネント
 * 未ログイン時は /login へリダイレクト
 * requireAdmin=true の場合、admin以外は /dashboard へリダイレクト
 */
const RouteGuard = ({ children, requireAdmin = false }: RouteGuardProps) => {
  const { firebaseUser, authUser, loading } = useAuthContext();

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

  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  // admin専用ルートの権限チェック
  if (requireAdmin && authUser?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
