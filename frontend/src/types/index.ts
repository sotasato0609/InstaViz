/**
 * InstaViz 共通型定義
 */

// === アカウント ===
export interface Account {
  id: number;
  igUserId: string;
  igUsername: string;
  displayName: string | null;
  isActive: boolean;
  createdAt: string;
}

// === KPIサマリー ===
export interface KpiSummary {
  followers: KpiValue;
  reach: KpiValue;
  impressions: KpiValue;
  profileViews: KpiValue;
  hpClicks: KpiValue;
  engagementRate: KpiValue;
}

export interface KpiValue {
  current: number;
  previous: number;
  change: number;       // 差分
  changeRate: number;    // 変化率（%）
}

// === 日次指標 ===
export interface DailyMetric {
  date: string;          // YYYY-MM-DD
  followers: number;
  reach: number;
  impressions: number;
  profileViews: number;
  hpClicks: number;
  engagementRate: number;
}

// === 投稿 ===
export type MediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'REEL';

export interface Post {
  id: number;
  igMediaId: string;
  mediaType: MediaType;
  thumbnailUrl: string;
  caption: string;
  postedAt: string;
  metrics: PostMetrics;
}

export interface PostMetrics {
  likes: number;
  comments: number;
  saves: number;
  reach: number;
  impressions: number;
  engagementRate: number;
}

// === 期間 ===
export type Period = '7d' | '30d' | '90d' | '1y';

export const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7日',
  '30d': '30日',
  '90d': '90日',
  '1y': '1年',
};

// === APIレスポンス ===
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// === ページネーション ===
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// === ソート ===
export type PostSortKey = 'postedAt' | 'engagementRate' | 'likes' | 'reach';
export type SortOrder = 'asc' | 'desc';
