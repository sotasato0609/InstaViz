import { useState } from 'react';
import Layout from '../components/Layout';
import KpiCard from '../components/KpiCard';
import PeriodSelector from '../components/PeriodSelector';
import MetricsChart from '../components/charts/MetricsChart';
import FollowerGrowthChart from '../components/charts/FollowerGrowthChart';
import { mockKpiByPeriod, mockDailyMetrics } from '../mocks/data';
import type { Period } from '../types';

/**
 * ダッシュボードページ
 * KPIカード6枚 + 日次指標グラフ + フォロワー推移
 */
const DashboardPage = () => {
  const [period, setPeriod] = useState<Period>('30d');
  const kpi = mockKpiByPeriod[period];
  const metrics = mockDailyMetrics[period];

  return (
    <Layout title="ダッシュボード">
      {/* 期間セレクター */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-sm text-[#6B7080]">
          選択期間のパフォーマンス概要
        </p>
        <PeriodSelector selected={period} onChange={setPeriod} />
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
        <KpiCard label="フォロワー" value={kpi.followers} icon="followers" />
        <KpiCard label="リーチ" value={kpi.reach} icon="reach" />
        <KpiCard label="インプレッション" value={kpi.impressions} icon="impressions" />
        <KpiCard label="プロフィール閲覧" value={kpi.profileViews} icon="profileViews" />
        <KpiCard label="HP遷移" value={kpi.hpClicks} icon="hpClicks" />
        <KpiCard label="エンゲージメント率" value={kpi.engagementRate} format="percent" icon="engagementRate" />
      </div>

      {/* グラフエリア */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <MetricsChart
          data={metrics}
          metrics={['reach', 'impressions']}
        />
        <FollowerGrowthChart
          data={metrics}
          height={320}
        />
      </div>
    </Layout>
  );
};

export default DashboardPage;
