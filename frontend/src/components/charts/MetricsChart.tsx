import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { DailyMetric } from '../../types';

interface MetricsChartProps {
  data: DailyMetric[];
  /** 表示する指標のキー一覧 */
  metrics?: Array<keyof Omit<DailyMetric, 'date'>>;
}

/** 指標ごとの表示設定 */
const METRIC_CONFIG: Record<string, { label: string; color: string }> = {
  reach: { label: 'リーチ', color: '#CC0022' },
  impressions: { label: 'インプレッション', color: '#1B2860' },
  profileViews: { label: 'プロフィール閲覧', color: '#E67E22' },
  hpClicks: { label: 'HP遷移', color: '#8E44AD' },
  engagementRate: { label: 'エンゲージメント率', color: '#27AE60' },
};

/**
 * 日次指標の折れ線グラフ
 */
const MetricsChart = ({
  data,
  metrics = ['reach', 'impressions'],
}: MetricsChartProps) => {
  // 日付を短縮形式に変換
  const chartData = data.map((d) => ({
    ...d,
    dateLabel: formatDateLabel(d.date),
  }));

  // X軸のtick間隔を調整（データが多い場合は間引く）
  const tickInterval = data.length > 60 ? Math.floor(data.length / 12) : data.length > 14 ? Math.floor(data.length / 7) : 0;

  return (
    <div className="bg-white rounded-lg border border-[#DDE1EC] p-3 md:p-5">
      <h3 className="text-sm md:text-base font-bold text-[#1B2860] mb-3 md:mb-4">日次指標推移</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 12, fill: '#6B7080' }}
            interval={tickInterval}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6B7080' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) =>
              value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value)
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #DDE1EC',
              borderRadius: '8px',
              fontSize: '13px',
            }}
            formatter={(value: unknown, name: unknown) => [
              Number(value).toLocaleString(),
              METRIC_CONFIG[String(name)]?.label || String(name),
            ]}
            labelFormatter={(label: unknown) => `日付: ${String(label)}`}
          />
          <Legend
            formatter={(value: string) => METRIC_CONFIG[value]?.label || value}
            wrapperStyle={{ fontSize: '13px' }}
          />
          {metrics.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={METRIC_CONFIG[key]?.color || '#999'}
              strokeWidth={2}
              dot={data.length <= 30}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/** 日付を M/D 形式に変換 */
const formatDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export default MetricsChart;
