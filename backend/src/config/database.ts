import mysql from 'mysql2/promise';
import logger from '../utils/logger';

// MySQL接続プール
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'instaviz',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * DB接続テスト
 */
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    logger.info('MySQL接続成功');
    connection.release();
  } catch (error) {
    logger.error('MySQL接続失敗', { error });
    throw error;
  }
};

export default pool;
