import { useState } from 'react';
import type { TableRow, SortState } from './types';
import LoadingSkeleton from './LoadingSkeleton';

interface DataTableProps {
  rows: TableRow[];
  isLoading: boolean;
}

type Column = {
  key: keyof TableRow;
  label: string;
  align: 'left' | 'right';
  render?: (row: TableRow) => React.ReactNode;
};

const COLUMNS: Column[] = [
  { key: 'name', label: 'Name', align: 'left' },
  { key: 'category', label: 'Category', align: 'left' },
  {
    key: 'status',
    label: 'Status',
    align: 'left',
    render: (row) => (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'active'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
        }`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: 'sales',
    label: 'Sales',
    align: 'right',
    render: (row) => row.sales.toLocaleString(),
  },
  {
    key: 'revenue',
    label: 'Revenue',
    align: 'right',
    render: (row) => `$${row.revenue.toLocaleString()}`,
  },
  {
    key: 'growth',
    label: 'Growth',
    align: 'right',
    render: (row) => (
      <span className={row.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
        {row.growth >= 0 ? '+' : ''}{row.growth}%
      </span>
    ),
  },
  { key: 'date', label: 'Last Updated', align: 'left' },
];

function SortIcon({ direction }: { direction: 'asc' | 'desc' | null }) {
  if (direction === 'asc') {
    return (
      <svg className="w-3.5 h-3.5 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    );
  }
  if (direction === 'desc') {
    return (
      <svg className="w-3.5 h-3.5 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5 inline ml-1 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

function sortRows(rows: TableRow[], sort: SortState): TableRow[] {
  if (!sort.column || !sort.direction) return rows;
  return [...rows].sort((a, b) => {
    const aVal = a[sort.column!];
    const bVal = b[sort.column!];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    if (aStr < bStr) return sort.direction === 'asc' ? -1 : 1;
    if (aStr > bStr) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export default function DataTable({ rows, isLoading }: DataTableProps) {
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });

  function handleSort(col: keyof TableRow) {
    setSort((prev) => {
      if (prev.column !== col) return { column: col, direction: 'asc' };
      if (prev.direction === 'asc') return { column: col, direction: 'desc' };
      return { column: null, direction: null };
    });
  }

  const sorted = sortRows(rows, sort);

  return (
    <section aria-label="Data Table" className="rounded-2xl bg-white dark:bg-gray-800 shadow-md overflow-hidden transition-all duration-300">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Product Performance</h3>
      </div>

      {/* Horizontal scroll on small screens */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide cursor-pointer select-none hover:text-gray-800 dark:hover:text-gray-200 transition-colors ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                  onClick={() => handleSort(col.key)}
                  aria-sort={
                    sort.column === col.key
                      ? sort.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  {col.label}
                  <SortIcon direction={sort.column === col.key ? sort.direction : null} />
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {isLoading ? (
              <LoadingSkeleton variant="table-row" count={5} />
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                  No data available for the selected filters.
                </td>
              </tr>
            ) : (
              sorted.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap ${
                        col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(row) : String(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
