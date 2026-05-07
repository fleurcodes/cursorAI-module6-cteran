interface LoadingSkeletonProps {
  variant: 'kpi' | 'chart' | 'table-row';
  count?: number;
}

function KPISkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-md p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-md p-5 animate-pulse">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4" />
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

export default function LoadingSkeleton({ variant, count = 1 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'kpi') {
    return (
      <>
        {items.map((i) => (
          <KPISkeleton key={i} />
        ))}
      </>
    );
  }

  if (variant === 'chart') {
    return (
      <>
        {items.map((i) => (
          <ChartSkeleton key={i} />
        ))}
      </>
    );
  }

  // table-row
  return (
    <>
      {items.map((i) => (
        <TableRowSkeleton key={i} />
      ))}
    </>
  );
}
