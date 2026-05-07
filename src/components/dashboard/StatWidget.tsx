import type { StatWidgetData } from '../../types/dashboard';

function WidgetIcon({ name }: { name: StatWidgetData['icon'] }) {
  switch (name) {
    case 'tasks':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    case 'done':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'progress':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'overdue':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

const ICON_BG: Record<StatWidgetData['icon'], string> = {
  tasks:    'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  done:     'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
  progress: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
  overdue:  'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
};

interface StatWidgetProps {
  data: StatWidgetData;
}

export default function StatWidget({ data }: StatWidgetProps) {
  const isPositive = data.change >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm flex items-start gap-4">
      <div className={`p-3 rounded-xl flex-shrink-0 ${ICON_BG[data.icon]}`}>
        <WidgetIcon name={data.icon} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate">{data.label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">{data.value}</p>
        <div className="flex items-center gap-1 mt-1">
          <span
            aria-label={isPositive ? 'increase' : 'decrease'}
            className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={isPositive ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'}
              />
            </svg>
            {Math.abs(data.change)}%
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{data.changeLabel}</span>
        </div>
      </div>
    </div>
  );
}
