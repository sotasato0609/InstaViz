import admin from 'firebase-admin';
import logger from '../utils/logger';

/**
 * Firebase Admin SDK 初期化
 * 環境変数が設定されていない場合は開発モードとして動作
 */
const initializeFirebase = (): void => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (projectId && privateKey && clientEmail) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey: privateKey.replace(/\\n/g, '\n'),
        clientEmail,
      }),
    });
    logger.info('Firebase Admin SDK 初期化完了');
  } else {
    logger.warn('Firebase認証情報が未設定です。開発モードで動作します。');
    // 開発時はFirebase未設定でも起動できるようにする
    try {
      admin.initializeApp({
        projectId: 'instaviz-dev',
      });
    } catch {
      // 既に初期化済みの場合は無視
    }
  }
};

initializeFirebase();

export default admin;
