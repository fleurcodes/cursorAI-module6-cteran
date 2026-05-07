import type { ChartData } from './types';
import ChartPlaceholder from './ChartPlaceholder';

const LEGEND_COLORS: Record<string, string> = {
  line: '#6366f1',
  bar0: '#6366f1',
  bar1: '#8b5cf6',
  bar2: '#a78bfa',
  pie0: '#6366f1',
  pie1: '#10b981',
  pie2: '#f59e0b',
};

interface ChartCardProps {
  data: ChartData;
}

export default function ChartCard({ data }: ChartCardProps) {
  return (
    <article
      className="rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 p-5"
      aria-label={`Chart: ${data.title}`}
    >
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">{data.title}</h3>

      {/* Chart area with fixed aspect ratio placeholder */}
      <div className="relative mb-4">
        <ChartPlaceholder data={data} />
      </div>

      {/* Mock legend */}
      <div className="flex flex-wrap gap-3" aria-label="Chart legend" role="list">
        {data.type === 'pie' ? (
          // Pie legend is embedded inside ChartPlaceholder
          null
        ) : data.type === 'line' ? (
          <div className="flex items-center gap-1.5" role="listitem">
            <span
              className="w-6 h-1.5 rounded-full inline-block"
              style={{ backgroundColor: LEGEND_COLORS['line'] }}
              aria-hidden="true"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">{data.title}</span>
          </div>
        ) : (
          data.data.slice(0, 3).map((point, i) => (
            <div key={point.label} className="flex items-center gap-1.5" role="listitem">
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block"
                style={{ backgroundColor: LEGEND_COLORS[`bar${i}`] ?? '#6366f1' }}
                aria-hidden="true"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">{point.label}</span>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
