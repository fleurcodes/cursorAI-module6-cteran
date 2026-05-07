import type { ChartData } from './types';

// ─── Line Chart ──────────────────────────────────────────────────────────────

function LineChartPlaceholder({ data }: { data: ChartData }) {
  const values = data.data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const height = 160;
  const width = 100; // percentage-based
  const pointCount = values.length;

  // Build SVG polyline points
  const points = values
    .map((v, i) => {
      const x = (i / (pointCount - 1)) * width;
      const y = height - ((v - min) / range) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="w-full" aria-hidden="true">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-40"
        role="img"
        aria-label={`Line chart: ${data.title}`}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1="0"
            y1={height - t * (height - 20) - 10}
            x2={width}
            y2={height - t * (height - 20) - 10}
            stroke="currentColor"
            strokeWidth="0.3"
            className="text-gray-200 dark:text-gray-700"
          />
        ))}
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={COLORS[0]}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Fill area */}
        <polygon
          points={`0,${height} ${points} ${width},${height}`}
          fill={COLORS[0]}
          fillOpacity="0.1"
        />
        {/* Data points */}
        {values.map((v, i) => {
          const x = (i / (pointCount - 1)) * width;
          const y = height - ((v - min) / range) * (height - 20) - 10;
          return <circle key={i} cx={x} cy={y} r="1.2" fill={COLORS[0]} />;
        })}
      </svg>
    </div>
  );
}

// ─── Bar Chart ───────────────────────────────────────────────────────────────

function BarChartPlaceholder({ data }: { data: ChartData }) {
  const values = data.data.map((d) => d.value);
  const max = Math.max(...values);
  const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

  return (
    <div
      className="w-full h-40 flex items-end gap-1 px-1"
      role="img"
      aria-label={`Bar chart: ${data.title}`}
    >
      {data.data.map((point, i) => {
        const pct = max > 0 ? (point.value / max) * 100 : 0;
        return (
          <div key={point.label} className="flex-1 flex flex-col items-center gap-1" aria-hidden="true">
            <div
              className="w-full rounded-t-sm transition-all duration-500"
              style={{
                height: `${pct}%`,
                backgroundColor: COLORS[i % COLORS.length],
                minHeight: '4px',
              }}
              title={`${point.label}: ${point.value}`}
            />
            <span className="text-[8px] text-gray-400 dark:text-gray-500 truncate w-full text-center">
              {point.label.slice(0, 3)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Pie Chart ───────────────────────────────────────────────────────────────

function PieChartPlaceholder({ data }: { data: ChartData }) {
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  const total = data.data.reduce((sum, d) => sum + d.value, 0);
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = 55;

  let startAngle = -Math.PI / 2;
  const slices = data.data.map((point, i) => {
    const angle = (point.value / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    const slice = { pathD, color: COLORS[i % COLORS.length], label: point.label };
    startAngle = endAngle;
    return slice;
  });

  return (
    <div className="flex items-center gap-4" role="img" aria-label={`Pie chart: ${data.title}`}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-36 h-36 flex-shrink-0" aria-hidden="true">
        {slices.map((slice, i) => (
          <path key={i} d={slice.pathD} fill={slice.color} stroke="white" strokeWidth="1.5" />
        ))}
      </svg>
      <ul className="flex flex-col gap-1.5 text-xs" aria-hidden="true">
        {slices.map((slice, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
            <span className="text-gray-600 dark:text-gray-400">{slice.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Exports ─────────────────────────────────────────────────────────────────

interface ChartPlaceholderProps {
  data: ChartData;
}

export default function ChartPlaceholder({ data }: ChartPlaceholderProps) {
  switch (data.type) {
    case 'line':
      return <LineChartPlaceholder data={data} />;
    case 'bar':
      return <BarChartPlaceholder data={data} />;
    case 'pie':
      return <PieChartPlaceholder data={data} />;
  }
}
