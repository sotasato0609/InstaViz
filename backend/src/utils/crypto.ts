import crypto from 'crypto';
import logger from './logger';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * 暗号化キーを環境変数から取得
 */
const getEncryptionKey = (): Buffer => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY が環境変数に設定されていません');
  }
  return Buffer.from(key, 'hex');
};

/**
 * AES-256-CBCで暗号化する
 */
export const encrypt = (text: string): string => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    logger.error('暗号化に失敗しました', { error });
    throw new Error('暗号化に失敗しました');
  }
};

/**
 * AES-256-CBCで復号する
 */
export const decrypt = (encryptedText: string): string => {
  try {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    logger.error('復号に失敗しました', { error });
    throw new Error('復号に失敗しました');
  }
};
