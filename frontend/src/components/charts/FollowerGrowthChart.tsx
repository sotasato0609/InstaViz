import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { DailyMetric } from '../../types';

interface FollowerGrowthChartProps {
  data: DailyMetric[];
  height?: number;
}

/**
 * フォロワー推移グラフ（エリアチャート）
 */
const FollowerGrowthChart = ({ data, height = 400 }: FollowerGrowthChartProps) => {
  const chartData = data.map((d) => ({
    ...d,
    dateLabel: formatDateLabel(d.date),
  }));

  // X軸のtick間隔を調整
  const tickInterval = data.length > 60
    ? Math.floor(data.length / 12)
    : data.length > 14
      ? Math.floor(data.length / 7)
      : 0;

  // フォロワー数の最小・最大を取得してY軸の範囲を設定
  const followers = data.map((d) => d.followers);
  const minFollowers = Math.min(...followers);
  const maxFollowers = Math.max(...followers);
  const padding = Math.ceil((maxFollowers - minFollowers) * 0.1) || 100;

  return (
    <div className="bg-white rounded-lg border border-[#DDE1EC] p-3 md:p-5">
      <h3 className="text-sm md:text-base font-bold text-[#1B2860] mb-3 md:mb-4">フォロワー推移</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="followerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#CC0022" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#CC0022" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 12, fill: '#6B7080' }}
            interval={tickInterval}
            tickLine={false}
          />
          <YAxis
            domain={[minFollowers - padding, maxFollowers + padding]}
            tick={{ fontSize: 12, fill: '#6B7080' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => value.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #DDE1EC',
              borderRadius: '8px',
              fontSize: '13px',
            }}
            formatter={(value: unknown) => [
              `${Number(value).toLocaleString()} 人`,
              'フォロワー',
            ]}
            labelFormatter={(label: unknown) => `日付: ${String(label)}`}
          />
          <Area
            type="monotone"
            dataKey="followers"
            stroke="#CC0022"
            strokeWidth={2}
            fill="url(#followerGradient)"
            dot={data.length <= 30}
            activeDot={{ r: 5, fill: '#CC0022' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/** 日付を M/D 形式に変換 */
const formatDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export default FollowerGrowthChart;
