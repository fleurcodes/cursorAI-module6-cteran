import type { KPIData } from './types';

function KPIIcon({ type }: { type: KPIData['icon'] }) {
  switch (type) {
    case 'sales':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case 'users':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'conversion':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'revenue':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

const ICON_BG: Record<KPIData['icon'], string> = {
  sales: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  users: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
  conversion: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
  revenue: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
};

interface KPICardProps {
  data: KPIData;
}

export default function KPICard({ data }: KPICardProps) {
  const { label, value, change, trend, unit, icon } = data;
  const isPositive = trend === 'up';
  const isNeutral = trend === 'neutral';

  const trendClass = isNeutral
    ? 'text-gray-500 dark:text-gray-400'
    : isPositive
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400';

  const trendArrow = isNeutral ? '→' : isPositive ? '↑' : '↓';

  const formattedValue =
    unit === '$'
      ? `$${typeof value === 'number' ? value.toLocaleString() : value}`
      : unit === '%'
      ? `${value}%`
      : typeof value === 'number'
      ? value.toLocaleString()
      : value;

  return (
    <article
      className="rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 p-5"
      aria-label={`${label}: ${formattedValue}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full ${ICON_BG[icon]}`}>
          <KPIIcon type={icon} />
        </span>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{formattedValue}</p>
      <p className={`text-sm font-medium ${trendClass}`} aria-label={`${Math.abs(change)}% ${isPositive ? 'increase' : 'decrease'} from previous period`}>
        <span aria-hidden="true">{trendArrow}</span>{' '}
        {Math.abs(change)}% vs last period
      </p>
    </article>
  );
}
