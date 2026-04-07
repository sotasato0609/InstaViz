import type { KpiValue } from '../types';

interface KpiCardProps {
  label: string;
  value: KpiValue;
  format?: 'number' | 'percent';
  icon: string;
}

/**
 * KPI数値カード
 * 現在値 + 前期間比の増減を表示
 */
const KpiCard = ({ label, value, format = 'number', icon }: KpiCardProps) => {
  const isPositive = value.change >= 0;
  const changeColor = isPositive ? 'text-emerald-600' : 'text-red-500';
  const changeIcon = isPositive ? '↑' : '↓';

  const formatValue = (num: number): string => {
    if (format === 'percent') {
      return `${num.toFixed(1)}%`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  const formatChange = (num: number): string => {
    if (format === 'percent') {
      return `${Math.abs(num).toFixed(1)}%`;
    }
    if (Math.abs(num) >= 1_000) {
      return Math.abs(num).toLocaleString();
    }
    return Math.abs(num).toString();
  };

  return (
    <div className="bg-white rounded-lg border border-[#DDE1EC] p-3 md:p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <span className="text-xs md:text-sm text-[#6B7080] font-medium">{label}</span>
        <KpiIcon name={icon} />
      </div>
      <div className="mb-1 md:mb-2">
        <span className="text-lg md:text-2xl font-bold text-[#111111]">
          {formatValue(value.current)}
        </span>
      </div>
      <div className={`flex items-center gap-1 text-xs md:text-sm ${changeColor}`}>
        <span>{changeIcon}</span>
        <span className="font-medium">{formatChange(value.change)}</span>
        <span className="text-[#6B7080] ml-1 hidden sm:inline">
          ({isPositive ? '+' : '-'}{Math.abs(value.changeRate).toFixed(1)}%)
        </span>
      </div>
    </div>
  );
};

/**
 * KPIカード用アイコン
 */
const KpiIcon = ({ name }: { name: string }) => {
  const iconClass = 'w-8 h-8 p-1.5 rounded-lg';

  switch (name) {
    case 'followers':
      return (
        <div className={`${iconClass} bg-blue-50 text-blue-500`}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
      );
    case 'reach':
      return (
        <div className={`${iconClass} bg-emerald-50 text-emerald-500`}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      );
    case 'impressions':
      return (
        <div className={`${iconClass} bg-purple-50 text-purple-500`}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
      );
    case 'profileViews':
      return (
        <div className={`${iconClass} bg-orange-50 text-orange-500`}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
      );
    case 'hpClicks':
      return (
        <div className={`${iconClass} bg-rose-50 text-rose-500`}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
        </div>
      );
    case 'engagementRate':
      return (
        <div className={`${iconClass} bg-amber-50 text-amber-500`}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </div>
      );
    default:
      return <div className={iconClass} />;
  }
};

export default KpiCard;
