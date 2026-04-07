import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextType } from '../contexts/AuthContext';

/**
 * 認証コンテキストフック
 * AuthProvider内でのみ使用可能
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext は AuthProvider 内で使用してください');
  }
  return context;
};
