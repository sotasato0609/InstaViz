import express from 'express';
import cors from 'cors';
import logger from './utils/logger';
import { testConnection } from './config/database';
import './config/firebase';
import healthRouter from './routes/health';
import authRouter from './routes/auth';

const app = express();
const PORT = process.env.PORT || 4000;

// ミドルウェア
app.use(cors({
  origin: ['http://localhost:5173', 'http://frontend:5173'],
  credentials: true,
}));
app.use(express.json());

// ルーティング
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);

// エラーハンドリング
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('未処理エラー', { error: err.message, stack: err.stack });
  res.status(500).json({
    success: false,
    error: '内部サーバーエラーが発生しました',
  });
});

// サーバー起動
const startServer = async (): Promise<void> => {
  try {
    // DB接続テスト
    await testConnection();

    app.listen(PORT, () => {
      logger.info(`InstaViz API サーバー起動: ポート ${PORT}`);
    });
  } catch (error) {
    logger.error('サーバー起動に失敗しました', { error });
    process.exit(1);
  }
};

startServer();
