import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

/**
 * ダッシュボードページ（プレースホルダー）
 * P1で本格実装予定
 */
const DashboardPage = () => {
  const { authUser, firebaseUser, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F6F9]">
      {/* ヘッダー */}
      <header className="bg-white border-b border-[#DDE1EC] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1B2860]">
            Insta<span className="text-[#CC0022]">Viz</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#6B7080]">
              {authUser?.email || firebaseUser?.email}
            </span>
            {authUser?.role === 'admin' && (
              <span className="text-xs bg-[#1B2860] text-white px-2 py-0.5 rounded">
                Admin
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-[#CC0022] hover:underline"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-[#DDE1EC] p-8 text-center">
          <h2 className="text-2xl font-bold text-[#1B2860] mb-4">
            ダッシュボード
          </h2>
          <p className="text-[#6B7080] mb-2">
            ログイン成功！🎉
          </p>
          <p className="text-[#6B7080] mb-4">
            ダッシュボードの本格実装はP1フェーズで行います。
          </p>
          {authUser && (
            <div className="mt-4 p-4 bg-[#F5F6F9] rounded-lg text-left inline-block">
              <p className="text-sm text-[#6B7080]">
                <strong>UID:</strong> {authUser.uid}
              </p>
              <p className="text-sm text-[#6B7080]">
                <strong>Email:</strong> {authUser.email}
              </p>
              <p className="text-sm text-[#6B7080]">
                <strong>Role:</strong> {authUser.role}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
