import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

/**
 * ページヘッダー
 * ページタイトル + ユーザー情報 + ログアウト
 * モバイル: ハンバーガーメニューボタン表示
 */
const Header = ({ title, onMenuClick }: HeaderProps) => {
  const { authUser, firebaseUser, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayEmail = authUser?.email || firebaseUser?.email || '';

  return (
    <header className="bg-white border-b border-[#DDE1EC] px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between gap-3">
        {/* 左側: ハンバーガー + タイトル */}
        <div className="flex items-center gap-3 min-w-0">
          {/* モバイル: ハンバーガーメニューボタン */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1.5 -ml-1 text-[#6B7080] hover:text-[#111111] cursor-pointer"
            aria-label="メニューを開く"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <h2 className="text-lg md:text-xl font-bold text-[#1B2860] truncate">{title}</h2>
        </div>

        {/* 右側: ユーザー情報 */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <span className="hidden sm:inline text-sm text-[#6B7080] truncate max-w-[200px]">
            {displayEmail}
          </span>
          {authUser?.role === 'admin' && (
            <span className="text-xs bg-[#1B2860] text-white px-2 py-0.5 rounded">
              Admin
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-[#CC0022] hover:underline cursor-pointer whitespace-nowrap"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
