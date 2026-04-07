import { NavLink } from 'react-router-dom';
import { mockAccount } from '../mocks/data';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * サイドバーナビゲーション
 * デスクトップ: 固定表示
 * モバイル: オーバーレイドロワー
 */
const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navItems = [
    { to: '/dashboard', label: 'ダッシュボード', icon: 'chart-bar' },
    { to: '/growth', label: 'フォロワー推移', icon: 'trending-up' },
    { to: '/posts', label: '投稿一覧', icon: 'grid' },
  ];

  return (
    <>
      {/* モバイル: オーバーレイ背景 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* サイドバー本体 */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-60 bg-[#1B2860] text-white flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* ロゴ + モバイル閉じるボタン */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            Insta<span className="text-[#CC0022]">Viz</span>
          </h1>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-white/70 hover:text-white cursor-pointer"
            aria-label="メニューを閉じる"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* アカウント情報 */}
        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-xs text-white/50 mb-1">アカウント</p>
          <p className="text-sm font-medium truncate">@{mockAccount.igUsername}</p>
          <p className="text-xs text-white/60 truncate">{mockAccount.displayName}</p>
        </div>

        {/* ナビゲーション */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-white/70 hover:bg-white/8 hover:text-white'
                    }`
                  }
                >
                  <SidebarIcon name={item.icon} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* フッター */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/40">InstaViz v1.0</p>
        </div>
      </aside>
    </>
  );
};

/**
 * サイドバー用SVGアイコン
 */
const SidebarIcon = ({ name }: { name: string }) => {
  const iconClass = 'w-5 h-5 flex-shrink-0';

  switch (name) {
    case 'chart-bar':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      );
    case 'trending-up':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      );
    case 'grid':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      );
    default:
      return <span className={iconClass} />;
  }
};

export default Sidebar;
