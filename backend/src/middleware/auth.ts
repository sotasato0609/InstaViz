import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';
import pool from '../config/database';
import logger from '../utils/logger';
import { RowDataPacket } from 'mysql2';

// リクエストにユーザー情報を付与する型拡張
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        role: 'admin' | 'member';
      };
    }
  }
}

/**
 * Firebase認証ミドルウェア
 * Authorizationヘッダーの Bearer {firebaseIdToken} を検証し、
 * DBのusersテーブルと照合してrole情報を付与する
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: '認証トークンが必要です',
      });
      return;
    }

    const token = authHeader.split('Bearer ')[1];

    // 開発モード: Firebase認証情報が未設定の場合はトークン検証をスキップ
    const isDevMode = !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL;

    let uid: string;
    let email: string;

    if (isDevMode) {
      // 開発モードではトークンをそのままUIDとして使用
      logger.warn('開発モード: Firebase認証をスキップします');
      uid = token;
      email = 'dev@instaviz.local';
    } else {
      // Firebaseトークン検証
      const decodedToken = await admin.auth().verifyIdToken(token);
      uid = decodedToken.uid;
      email = decodedToken.email || '';
    }

    // DBからユーザー情報を取得
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE firebase_uid = ? AND is_active = TRUE',
      [uid]
    );

    let role: 'admin' | 'member' = 'member';

    if (rows.length > 0) {
      role = rows[0].role as 'admin' | 'member';
    } else {
      // 初回ログイン時: ユーザーを自動登録
      await pool.execute(
        'INSERT INTO users (firebase_uid, email, display_name, role) VALUES (?, ?, ?, ?)',
        [uid, email, email.split('@')[0], 'member']
      );
      logger.info('新規ユーザーを登録しました', { uid, email });
    }

    req.user = { uid, email, role };
    next();
  } catch (error) {
    logger.error('認証エラー', { error });
    res.status(401).json({
      success: false,
      error: '認証に失敗しました',
    });
  }
};
