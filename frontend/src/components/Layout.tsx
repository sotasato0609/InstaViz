import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

/**
 * 共通レイアウト
 * サイドバー + ヘッダー + メインコンテンツエリア
 * モバイル: サイドバーはオーバーレイドロワー
 * デスクトップ: サイドバーは固定表示
 */
const Layout = ({ children, title }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="min-h-screen bg-[#F5F6F9]">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="lg:ml-60 min-h-screen flex flex-col">
        <Header title={title} onMenuClick={openSidebar} />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
