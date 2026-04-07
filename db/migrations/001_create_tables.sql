-- InstaViz DBマイグレーション
-- P0: 初期テーブル作成

-- アカウント管理
CREATE TABLE IF NOT EXISTS accounts (
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
CREATE TABLE IF NOT EXISTS account_daily_metrics (
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
CREATE TABLE IF NOT EXISTS posts (
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
CREATE TABLE IF NOT EXISTS post_metrics (
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
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  display_name VARCHAR(200),
  role ENUM('admin','member') DEFAULT 'member',
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AIモデル設定（BYOK）
CREATE TABLE IF NOT EXISTS ai_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider ENUM('gemini_flash','groq','openai','anthropic','google') DEFAULT 'gemini_flash',
  model_name VARCHAR(100),
  api_key_enc TEXT,                     -- AES-256暗号化、NULLの場合はデフォルト無料モデル
  is_active BOOLEAN DEFAULT TRUE,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- AIレポート
CREATE TABLE IF NOT EXISTS ai_reports (
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
