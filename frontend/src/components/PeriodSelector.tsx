import type { Period } from '../types';
import { PERIOD_LABELS } from '../types';

interface PeriodSelectorProps {
  selected: Period;
  onChange: (period: Period) => void;
}

/**
 * 期間切替セレクター
 * 7日 / 30日 / 90日 / 1年
 */
const PeriodSelector = ({ selected, onChange }: PeriodSelectorProps) => {
  const periods: Period[] = ['7d', '30d', '90d', '1y'];

  return (
    <div className="flex gap-1 bg-[#F5F6F9] rounded-lg p-1 flex-shrink-0">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={`px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            selected === period
              ? 'bg-white text-[#1B2860] shadow-sm'
              : 'text-[#6B7080] hover:text-[#111111]'
          }`}
        >
          {PERIOD_LABELS[period]}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;
