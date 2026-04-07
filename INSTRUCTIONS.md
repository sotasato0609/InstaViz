# InstaViz — Cline 指示書

## リポジトリ

```
https://github.com/sotasato0609/InstaViz.git
```

ブランチ戦略：
- `main` … 本番リリース用
- `develop` … 開発統合ブランチ
- `feature/xxx` … 機能単位の作業ブランチ（例: `feature/p0-auth`）

---

## プロジェクト概要

スクール21（@school21_jp）のInstagramアカウントの運用データを自動取得・可視化するWebダッシュボード。
担当者がブラウザから閲覧・分析・AI改善提案を受け取れる社内ツール。

---

## 技術スタック

| レイヤー | 技術 | バージョン目安 |
|---|---|---|
| フロントエンド | React + TypeScript | React 18 |
| UIコンポーネント | Tailwind CSS | v3 |
| グラフ | Recharts | 最新安定版 |
| バックエンド | Node.js + Express | Node 20 LTS |
| 言語（BE） | TypeScript | v5 |
| DB | MySQL（ローカル開発はDocker） | 8.0 |
| 認証 | Firebase Authentication | 最新 |
| インフラ | Google Cloud Run | — |
| DB（本番） | Cloud SQL（MySQL 8.0） | — |
| スケジューラー | Cloud Scheduler | — |
| コンテナ | Docker / docker-compose | — |

---

## ディレクトリ構成

```
instaviz/
├── frontend/                  # React TypeScript
│   ├── src/
│   │   ├── components/        # 共通コンポーネント
│   │   ├── pages/             # 画面単位
│   │   ├── hooks/             # カスタムフック
│   │   ├── api/               # APIクライアント
│   │   ├── types/             # 型定義
│   │   └── utils/             # ユーティリティ
│   ├── Dockerfile
│   └── package.json
├── backend/                   # Node.js Express TypeScript
│   ├── src/
│   │   ├── routes/            # ルーティング
│   │   ├── controllers/       # コントローラー
│   │   ├── services/          # ビジネスロジック
│   │   ├── models/            # DBモデル（クエリ）
│   │   ├── middleware/        # 認証など
│   │   ├── jobs/              # バッチ処理
│   │   └── utils/             # ユーティリティ
│   ├── Dockerfile
│   └── package.json
├── db/
│   └── migrations/            # SQLマイグレーションファイル
├── docker-compose.yml
├── .env.example
└── INSTRUCTIONS.md            # この指示書
```

---

## データベーススキーマ

```sql
-- アカウント管理
CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ig_user_id VARCHAR(50) NOT NULL UNIQUE,
  ig_username VARCHAR(100) NOT NULL,
  display_name VARCHAR(200),
  fb_page_id VARCHAR(50),
  access_token_enc TEXT NOT NULL,       -- AES-256暗号化
  token_expires_at DATETIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- アカウント日次指標
CREATE TABLE account_daily_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  date DATE NOT NULL,
  followers INT,
  reach INT,
  impressions INT,
  profile_views INT,
  hp_clicks INT,
  engagement_rate DECIMAL(5,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_account_date (account_id, date),
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- 投稿マスター
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  ig_media_id VARCHAR(100) NOT NULL UNIQUE,
  media_type ENUM('IMAGE','VIDEO','CAROUSEL_ALBUM','REEL'),
  thumbnail_url TEXT,
  caption TEXT,
  posted_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- 投稿指標
CREATE TABLE post_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  fetched_at DATETIME NOT NULL,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  saves INT DEFAULT 0,
  reach INT DEFAULT 0,
  impressions INT DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- ユーザー管理
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  display_name VARCHAR(200),
  role ENUM('admin','member') DEFAULT 'member',
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AIモデル設定（BYOK）
CREATE TABLE ai_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider ENUM('gemini_flash','groq','openai','anthropic','google') DEFAULT 'gemini_flash',
  model_name VARCHAR(100),
  api_key_enc TEXT,                     -- AES-256暗号化、NULLの場合はデフォルト無料モデル
  is_active BOOLEAN DEFAULT TRUE,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- AIレポート
CREATE TABLE ai_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  report_month DATE NOT NULL,           -- その月の1日
  summary_text TEXT,
  score ENUM('A','B+','B','C+','C','D'),
  insights_json JSON,
  suggestions_json JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);
```

---

## APIエンドポイント設計

```
# 認証
POST   /api/auth/verify          # Firebaseトークン検証

# ダッシュボード
GET    /api/accounts             # アカウント一覧
GET    /api/accounts/:id/summary # KPIサマリー（period: 7d/30d/90d/1y）
GET    /api/accounts/:id/metrics # 日次指標（グラフ用）
GET    /api/accounts/:id/posts   # 投稿一覧（ページネーション）

# フォロワー推移
GET    /api/accounts/:id/growth  # フォロワー推移詳細

# AIレポート
GET    /api/accounts/:id/ai-report         # 最新レポート取得
POST   /api/accounts/:id/ai-report/generate # 手動生成

# 管理（Adminのみ）
POST   /api/admin/accounts              # アカウント追加
DELETE /api/admin/accounts/:id          # アカウント削除
GET    /api/admin/users                 # ユーザー一覧
POST   /api/admin/users                 # ユーザー招待
PUT    /api/admin/users/:id/role        # ロール変更
GET    /api/admin/ai-settings           # AIモデル設定取得
PUT    /api/admin/ai-settings           # AIモデル設定更新
POST   /api/admin/ai-settings/test      # 接続テスト
```

---

## 環境変数（.env）

```env
# DB
DB_HOST=localhost
DB_PORT=3306
DB_NAME=instaviz
DB_USER=root
DB_PASSWORD=password

# Firebase
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Instagram Graph API
META_APP_ID=
META_APP_SECRET=

# 暗号化
ENCRYPTION_KEY=          # 32バイトの16進数文字列

# AIデフォルト（無料）
GEMINI_API_KEY=          # Google AI Studio で取得（無料）

# フロントエンド
VITE_API_BASE_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
```

---

## デザイン仕様

```
メインカラー : #CC0022
ネイビー     : #1B2860
背景         : #F5F6F9
ボーダー     : #DDE1EC
テキスト     : #111111
ミュート     : #6B7080
```

- フォント: システムフォント（Helvetica Neue, Arial, sans-serif）
- 角丸: 8px（カード）、5px（ボタン・インプット）
- ボーダー: 0.5px solid #DDE1EC

---

## 認証ミドルウェア（バックエンド）

すべての `/api/*` エンドポイントに適用。
Authorizationヘッダーの `Bearer {firebaseIdToken}` を検証し、
DBのusersテーブルと照合してrole情報を付与する。

```typescript
// middleware/auth.ts のイメージ
req.user = { uid, email, role: 'admin' | 'member' }
```

---

## 暗号化ユーティリティ

access_tokenとapi_key_encの暗号化・復号は `utils/crypto.ts` に集約する。
アルゴリズム: AES-256-CBC、keyは環境変数 `ENCRYPTION_KEY` から取得。

---

## バッチ処理（jobs/）

| ファイル | 内容 |
|---|---|
| `dailyMetrics.ts` | アカウント日次指標取得（毎日02:00） |
| `postInsights.ts` | 投稿インサイト取得（毎日02:30） |
| `tokenRefresh.ts` | トークン自動更新（毎日03:00） |
| `historicalImport.ts` | 初回過去データ一括取得 |

ローカル開発ではHTTPエンドポイント `POST /api/jobs/:jobName` で手動実行できるようにする。

---

## コーディング規約

- TypeScript strict mode を使用
- async/await を使用（コールバック・Promiseチェーン不可）
- エラーハンドリングは try/catch + 専用エラークラス
- console.log は使用しない → winston または pino でログ管理
- APIレスポンスは `{ success: boolean, data?: any, error?: string }` で統一
- コメントは日本語でOK

---

## 開発の進め方（フェーズ）

現在は **P0（基盤構築）** から着手する。

### P0 チェックリスト
- [ ] docker-compose でMySQL + バックエンド + フロントエンドが起動する
- [ ] Firebase認証ミドルウェアが動作する
- [ ] DBマイグレーションが流せる
- [ ] `/api/auth/verify` が動作する
- [ ] フロントエンドのログイン画面が動作する（Google OAuth + メール/PW）
- [ ] ログイン後にダッシュボードへリダイレクトされる

P0完了後にP1（ダッシュボード画面）へ進む。

---

## 注意事項

- Meta Graph APIへの直接呼び出しはバックエンドのみで行う（フロントエンドから叩かない）
- access_tokenは必ず暗号化してDBに保存する（平文保存禁止）
- Cloud Run へのデプロイはP3以降に対応するため、今はローカル開発優先
- フロントエンドのポートは `5173`（Vite デフォルト）、バックエンドは `4000`
