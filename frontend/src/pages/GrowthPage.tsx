import { useState } from 'react';
import Layout from '../components/Layout';
import PeriodSelector from '../components/PeriodSelector';
import FollowerGrowthChart from '../components/charts/FollowerGrowthChart';
import MetricsChart from '../components/charts/MetricsChart';
import { mockKpiByPeriod, mockDailyMetrics } from '../mocks/data';
import type { Period } from '../types';

/**
 * フォロワー推移ページ
 * 大きなフォロワー推移グラフ + サマリー + 関連メトリクスグラフ
 */
const GrowthPage = () => {
  const [period, setPeriod] = useState<Period>('30d');
  const kpi = mockKpiByPeriod[period];
  const metrics = mockDailyMetrics[period];

  // フォロワー推移の統計
  const followers = metrics.map((m) => m.followers);
  const maxFollowers = Math.max(...followers);
  const minFollowers = Math.min(...followers);
  const avgGrowthPerDay = metrics.length > 1
    ? ((followers[followers.length - 1] - followers[0]) / (metrics.length - 1)).toFixed(1)
    : '0';

  return (
    <Layout title="フォロワー推移">
      {/* 期間セレクター */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-sm text-[#6B7080]">
          フォロワー数の推移と成長分析
        </p>
        <PeriodSelector selected={period} onChange={setPeriod} />
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <SummaryCard
          label="現在のフォロワー"
          value={kpi.followers.current.toLocaleString()}
          sub="人"
        />
        <SummaryCard
          label="期間中の増減"
          value={`${kpi.followers.change >= 0 ? '+' : ''}${kpi.followers.change.toLocaleString()}`}
          sub={`${kpi.followers.change >= 0 ? '+' : ''}${kpi.followers.changeRate.toFixed(1)}%`}
          positive={kpi.followers.change >= 0}
        />
        <SummaryCard
          label="1日平均増加"
          value={`+${avgGrowthPerDay}`}
          sub="人/日"
        />
        <SummaryCard
          label="期間中の最高/最低"
          value={`${maxFollowers.toLocaleString()} / ${minFollowers.toLocaleString()}`}
          sub="人"
        />
      </div>

      {/* メインのフォロワー推移グラフ */}
      <div className="mb-6">
        <FollowerGrowthChart data={metrics} height={450} />
      </div>

      {/* 関連メトリクス */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <MetricsChart
          data={metrics}
          metrics={['profileViews', 'hpClicks']}
        />
        <MetricsChart
          data={metrics}
          metrics={['engagementRate']}
        />
      </div>
    </Layout>
  );
};

/** サマリーカード */
const SummaryCard = ({
  label,
  value,
  sub,
  positive,
}: {
  label: string;
  value: string;
  sub: string;
  positive?: boolean;
}) => (
  <div className="bg-white rounded-lg border border-[#DDE1EC] p-4">
    <p className="text-xs text-[#6B7080] mb-1">{label}</p>
    <p className="text-xl font-bold text-[#111111]">{value}</p>
    <p
      className={`text-sm ${
        positive !== undefined
          ? positive
            ? 'text-emerald-600'
            : 'text-red-500'
          : 'text-[#6B7080]'
      }`}
    >
      {sub}
    </p>
  </div>
);

export default GrowthPage;
