import { Router, Request, Response } from 'express';
import pool from '../config/database';
import logger from '../utils/logger';

const router = Router();

/**
 * GET /api/health
 * ヘルスチェックエンドポイント
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  let dbStatus = 'disconnected';

  try {
    const connection = await pool.getConnection();
    connection.release();
    dbStatus = 'connected';
  } catch {
    logger.warn('ヘルスチェック: DB接続なし');
  }

  res.json({
    success: true,
    data: {
      status: 'ok',
      database: dbStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

export default router;
