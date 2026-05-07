interface StatItemProps {
  label: string;
  value: number;
}

function formatCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xl font-bold text-gray-900 dark:text-gray-100" aria-label={`${value} ${label}`}>
        {formatCount(value)}
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{label}</span>
    </div>
  );
}
