import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

/**
 * ログインページ
 * Google OAuth + メール/パスワード認証
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Googleログイン
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch {
      setError('Googleログインに失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // メール/パスワードログイン
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('user-not-found') || err.message.includes('wrong-password')) {
          setError('メールアドレスまたはパスワードが正しくありません。');
        } else if (err.message.includes('email-already-in-use')) {
          setError('このメールアドレスは既に登録されています。');
        } else if (err.message.includes('weak-password')) {
          setError('パスワードは6文字以上で入力してください。');
        } else {
          setError('ログインに失敗しました。もう一度お試しください。');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6F9]">
      <div className="w-full max-w-md">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1B2860]">
            Insta<span className="text-[#CC0022]">Viz</span>
          </h1>
          <p className="text-[#6B7080] mt-2">Instagram分析ダッシュボード</p>
        </div>

        {/* ログインカード */}
        <div className="bg-white rounded-lg shadow-sm border border-[#DDE1EC] p-8">
          {/* エラーメッセージ */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[5px] text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Googleログインボタン */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-[#DDE1EC] rounded-[5px] px-4 py-3 text-[#111111] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Googleでログイン
          </button>

          {/* 区切り線 */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[#DDE1EC]"></div>
            <span className="px-4 text-sm text-[#6B7080]">または</span>
            <div className="flex-1 border-t border-[#DDE1EC]"></div>
          </div>

          {/* メール/パスワードフォーム */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#111111] mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 border border-[#DDE1EC] rounded-[5px] text-[#111111] placeholder-[#6B7080] focus:outline-none focus:border-[#CC0022] focus:ring-1 focus:ring-[#CC0022] transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#111111] mb-1">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full px-4 py-2.5 border border-[#DDE1EC] rounded-[5px] text-[#111111] placeholder-[#6B7080] focus:outline-none focus:border-[#CC0022] focus:ring-1 focus:ring-[#CC0022] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#CC0022] text-white rounded-[5px] px-4 py-2.5 font-medium hover:bg-[#aa001c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '処理中...' : isSignUp ? 'アカウント作成' : 'ログイン'}
            </button>
          </form>

          {/* 切り替えリンク */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-[#CC0022] hover:underline"
            >
              {isSignUp ? 'アカウントをお持ちの方はこちら' : 'アカウントを作成する'}
            </button>
          </div>
        </div>

        {/* フッター */}
        <p className="text-center text-xs text-[#6B7080] mt-6">
          © 2024 InstaViz - スクール21 社内ツール
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
