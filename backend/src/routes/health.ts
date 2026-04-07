import { Router, Request, Response } from 'express';
import pool from '../config/database';
import logger from '../utils/logger';

const router = Router();

/**
 * GET /api/health
 * ヘルスチェックエンドポイント
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    // DB接続チェック
    const connection = await pool.getConnection();
    connection.release();

    res.json({
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    });
  } catch (error) {
    logger.error('ヘルスチェック失敗', { error });
    res.status(503).json({
      success: false,
      error: 'サービスが利用できません',
    });
  }
});

export default router;
