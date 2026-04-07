import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

/**
 * POST /api/auth/verify
 * Firebaseトークン検証エンドポイント
 * 認証ミドルウェアを通過したらユーザー情報を返す
 */
router.post('/verify', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('認証検証成功', { uid: req.user?.uid });

    res.json({
      success: true,
      data: {
        uid: req.user?.uid,
        email: req.user?.email,
        role: req.user?.role,
      },
    });
  } catch (error) {
    logger.error('認証検証エラー', { error });
    res.status(500).json({
      success: false,
      error: '内部エラーが発生しました',
    });
  }
});

export default router;
