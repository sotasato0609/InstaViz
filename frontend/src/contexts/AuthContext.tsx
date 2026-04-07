import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import apiClient from '../api/client';

interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
  role: 'admin' | 'member';
}

interface AuthContextType {
  /** Firebase User オブジェクト */
  firebaseUser: User | null;
  /** バックエンドから取得したユーザー情報（role含む） */
  authUser: AuthUser | null;
  /** 認証状態の読み込み中フラグ */
  loading: boolean;
  /** ログアウト処理 */
  logout: () => Promise<void>;
  /** バックエンドにトークン検証を行い、ユーザー情報を取得 */
  verifyToken: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 認証コンテキストプロバイダー
 * Firebase Auth状態 + バックエンドのrole情報を一括管理
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * バックエンドの /api/auth/verify を呼び、ユーザー情報を取得・同期する
   */
  const verifyToken = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const response = await apiClient.post('/api/auth/verify');
      if (response.data.success) {
        const userData: AuthUser = {
          uid: response.data.data.uid,
          email: response.data.data.email,
          displayName: auth.currentUser?.displayName || null,
          role: response.data.data.role,
        };
        setAuthUser(userData);
        return userData;
      }
      return null;
    } catch {
      // 認証検証に失敗した場合はnullを返す（エラーはインターセプターが処理）
      setAuthUser(null);
      return null;
    }
  }, []);

  /**
   * ログアウト処理
   */
  const logout = useCallback(async () => {
    await signOut(auth);
    setAuthUser(null);
  }, []);

  // Firebase Auth状態変更の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        // ログイン中ならバックエンドで検証してrole情報を取得
        await verifyToken();
      } else {
        setAuthUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [verifyToken]);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        authUser,
        loading,
        logout,
        verifyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// useAuthContext フックは hooks/useAuthContext.ts に分離
export { AuthContext };
export type { AuthContextType, AuthUser };
