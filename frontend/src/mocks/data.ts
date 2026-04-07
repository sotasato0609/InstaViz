/**
 * 開発用モックデータ
 * バックエンドAPI実装後にAPI呼び出しへ差し替え予定
 */

import type { Account, KpiSummary, DailyMetric, Post, Period } from '../types';

// === アカウント ===
export const mockAccount: Account = {
  id: 1,
  igUserId: '17841400000000001',
  igUsername: 'school21_jp',
  displayName: 'スクール21【公式】',
  isActive: true,
  createdAt: '2024-01-15T00:00:00Z',
};

// === KPIサマリー（期間別） ===
export const mockKpiByPeriod: Record<Period, KpiSummary> = {
  '7d': {
    followers: { current: 12450, previous: 12320, change: 130, changeRate: 1.06 },
    reach: { current: 45200, previous: 41800, change: 3400, changeRate: 8.13 },
    impressions: { current: 68500, previous: 63200, change: 5300, changeRate: 8.39 },
    profileViews: { current: 1820, previous: 1650, change: 170, changeRate: 10.30 },
    hpClicks: { current: 245, previous: 210, change: 35, changeRate: 16.67 },
    engagementRate: { current: 4.2, previous: 3.8, change: 0.4, changeRate: 10.53 },
  },
  '30d': {
    followers: { current: 12450, previous: 11900, change: 550, changeRate: 4.62 },
    reach: { current: 185000, previous: 168000, change: 17000, changeRate: 10.12 },
    impressions: { current: 278000, previous: 252000, change: 26000, changeRate: 10.32 },
    profileViews: { current: 7200, previous: 6800, change: 400, changeRate: 5.88 },
    hpClicks: { current: 980, previous: 850, change: 130, changeRate: 15.29 },
    engagementRate: { current: 4.1, previous: 3.9, change: 0.2, changeRate: 5.13 },
  },
  '90d': {
    followers: { current: 12450, previous: 10800, change: 1650, changeRate: 15.28 },
    reach: { current: 520000, previous: 480000, change: 40000, changeRate: 8.33 },
    impressions: { current: 790000, previous: 720000, change: 70000, changeRate: 9.72 },
    profileViews: { current: 21000, previous: 19500, change: 1500, changeRate: 7.69 },
    hpClicks: { current: 2800, previous: 2400, change: 400, changeRate: 16.67 },
    engagementRate: { current: 4.0, previous: 3.7, change: 0.3, changeRate: 8.11 },
  },
  '1y': {
    followers: { current: 12450, previous: 6200, change: 6250, changeRate: 100.81 },
    reach: { current: 2100000, previous: 1500000, change: 600000, changeRate: 40.0 },
    impressions: { current: 3200000, previous: 2300000, change: 900000, changeRate: 39.13 },
    profileViews: { current: 85000, previous: 62000, change: 23000, changeRate: 37.10 },
    hpClicks: { current: 11200, previous: 7800, change: 3400, changeRate: 43.59 },
    engagementRate: { current: 3.9, previous: 3.2, change: 0.7, changeRate: 21.88 },
  },
};

// === 日次指標（30日分） ===
const generateDailyMetrics = (days: number): DailyMetric[] => {
  const metrics: DailyMetric[] = [];
  const baseDate = new Date();
  const baseFollowers = 12450;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // リアルっぽいデータを生成
    const dayOfWeek = date.getDay();
    const weekdayBonus = (dayOfWeek >= 1 && dayOfWeek <= 5) ? 1.1 : 0.85;
    const randomFactor = 0.8 + Math.random() * 0.4;

    metrics.push({
      date: dateStr,
      followers: Math.round(baseFollowers - (i * 18) + (Math.random() * 10)),
      reach: Math.round(6500 * weekdayBonus * randomFactor),
      impressions: Math.round(9800 * weekdayBonus * randomFactor),
      profileViews: Math.round(260 * weekdayBonus * randomFactor),
      hpClicks: Math.round(35 * weekdayBonus * randomFactor),
      engagementRate: Number((3.5 + Math.random() * 1.5).toFixed(2)),
    });
  }

  return metrics;
};

export const mockDailyMetrics: Record<Period, DailyMetric[]> = {
  '7d': generateDailyMetrics(7),
  '30d': generateDailyMetrics(30),
  '90d': generateDailyMetrics(90),
  '1y': generateDailyMetrics(365),
};

// === 投稿一覧 ===
const sampleCaptions = [
  '🎓 春期講習のお知らせ！\n新学期に向けて、基礎から応用まで徹底的にサポートします。\n#スクール21 #春期講習 #学習塾',
  '📊 2024年度 合格実績速報！\n今年も多くの生徒さんが志望校に合格しました！🎉\n#合格実績 #受験 #スクール21',
  '👩‍🏫 新しい先生が加わりました！\n数学担当の田中先生です。分かりやすい授業が評判です！\n#新任講師 #数学',
  '📝 定期テスト対策講座 開講中！\n中間テストに向けて、各教科のポイントを押さえた特別授業を実施中。\n#定期テスト #テスト対策',
  '🏫 教室リニューアルしました！\nより快適な学習環境で、集中して勉強できます。\n#教室リニューアル #学習環境',
  '🎯 夏期講習 早期申込スタート！\n6月中のお申し込みで入会金無料キャンペーン実施中！\n#夏期講習 #キャンペーン',
  '📖 英検対策コース新設！\n小学生から高校生まで、レベル別にしっかり対策します。\n#英検 #英語学習',
  '🌟 生徒インタビュー vol.12\n偏差値を15アップさせたAさんの勉強法を紹介！\n#勉強法 #偏差値アップ',
  '📅 冬期講習のご案内\n年末年始も休まず開講！受験直前の追い込みをサポート。\n#冬期講習 #受験対策',
  '🎉 おかげさまでフォロワー1万人突破！\nいつも応援ありがとうございます！\n#フォロワー1万人 #感謝',
  '💡 自習室の利用時間を拡大しました！\n平日は22時まで、土日は20時まで利用可能に。\n#自習室 #学習サポート',
  '🏆 全国模試で教室平均偏差値58達成！\n生徒たちの努力が実を結びました！\n#模試 #偏差値',
];

const mediaTypes: Array<'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'REEL'> = [
  'IMAGE', 'IMAGE', 'CAROUSEL_ALBUM', 'REEL', 'IMAGE', 'VIDEO',
  'IMAGE', 'REEL', 'IMAGE', 'CAROUSEL_ALBUM', 'IMAGE', 'IMAGE',
];

export const mockPosts: Post[] = sampleCaptions.map((caption, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (i * 3 + Math.floor(Math.random() * 2)));

  return {
    id: i + 1,
    igMediaId: `media_${String(i + 1).padStart(6, '0')}`,
    mediaType: mediaTypes[i],
    thumbnailUrl: `https://picsum.photos/seed/instaviz${i + 1}/400/400`,
    caption,
    postedAt: date.toISOString(),
    metrics: {
      likes: Math.round(150 + Math.random() * 350),
      comments: Math.round(10 + Math.random() * 40),
      saves: Math.round(20 + Math.random() * 80),
      reach: Math.round(5000 + Math.random() * 8000),
      impressions: Math.round(8000 + Math.random() * 12000),
      engagementRate: Number((2.5 + Math.random() * 4).toFixed(2)),
    },
  };
});
