import { useState, useCallback, useEffect } from 'react';
import type { FiltersState, KPIData, ChartData, TableRow } from './types';
import KPIGrid from './KPIGrid';
import ChartCard from './ChartCard';
import FiltersBar from './FiltersBar';
import DataTable from './DataTable';
import LoadingSkeleton from './LoadingSkeleton';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS: FiltersState = {
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  category: 'all',
  status: 'all',
};

const KPI_DATA: KPIData[] = [
  { id: 'kpi-sales', label: 'Total Sales', value: 18420, previousValue: 15300, change: 20.4, trend: 'up', unit: '', icon: 'sales' },
  { id: 'kpi-users', label: 'Active Users', value: 5240, previousValue: 4980, change: 5.2, trend: 'up', unit: '', icon: 'users' },
  { id: 'kpi-conversion', label: 'Conversion Rate', value: 3.8, previousValue: 4.1, change: -7.3, trend: 'down', unit: '%', icon: 'conversion' },
  { id: 'kpi-revenue', label: 'Revenue', value: 94500, previousValue: 88200, change: 7.1, trend: 'up', unit: '$', icon: 'revenue' },
];

const CHART_DATA: ChartData[] = [
  {
    id: 'chart-revenue-trend',
    title: 'Revenue Trend',
    type: 'line',
    data: [
      { label: 'Jan', value: 6200 },
      { label: 'Feb', value: 7100 },
      { label: 'Mar', value: 6800 },
      { label: 'Apr', value: 8400 },
      { label: 'May', value: 9100 },
      { label: 'Jun', value: 8700 },
      { label: 'Jul', value: 10200 },
      { label: 'Aug', value: 11500 },
      { label: 'Sep', value: 10800 },
      { label: 'Oct', value: 12100 },
      { label: 'Nov', value: 13400 },
      { label: 'Dec', value: 14900 },
    ],
    unit: '$',
  },
  {
    id: 'chart-sales-by-category',
    title: 'Sales by Category',
    type: 'bar',
    data: [
      { label: 'Electronics', value: 4800 },
      { label: 'Clothing', value: 3200 },
      { label: 'Home', value: 2700 },
      { label: 'Sports', value: 1900 },
      { label: 'Books', value: 1400 },
      { label: 'Other', value: 900 },
    ],
  },
  {
    id: 'chart-user-distribution',
    title: 'User Distribution',
    type: 'pie',
    data: [
      { label: 'New Users', value: 38 },
      { label: 'Returning', value: 47 },
      { label: 'Inactive', value: 15 },
    ],
  },
];

const TABLE_ROWS: TableRow[] = [
  { id: 'row-1', name: 'Pro Headphones X200', category: 'Electronics', status: 'active', sales: 1840, revenue: 183600, growth: 12.4, date: '2024-12-10' },
  { id: 'row-2', name: 'Running Shoes Elite', category: 'Sports', status: 'active', sales: 2310, revenue: 115500, growth: 8.7, date: '2024-12-09' },
  { id: 'row-3', name: 'Vintage Denim Jacket', category: 'Clothing', status: 'inactive', sales: 540, revenue: 43200, growth: -3.2, date: '2024-12-08' },
  { id: 'row-4', name: 'Smart Home Hub', category: 'Electronics', status: 'active', sales: 930, revenue: 139500, growth: 21.0, date: '2024-12-07' },
  { id: 'row-5', name: 'Yoga Mat Premium', category: 'Sports', status: 'active', sales: 1470, revenue: 58800, growth: 5.5, date: '2024-12-06' },
  { id: 'row-6', name: 'Linen Throw Blanket', category: 'Home', status: 'inactive', sales: 680, revenue: 27200, growth: -1.8, date: '2024-12-05' },
  { id: 'row-7', name: 'Mechanical Keyboard MK1', category: 'Electronics', status: 'active', sales: 750, revenue: 112500, growth: 16.3, date: '2024-12-04' },
  { id: 'row-8', name: 'Herbal Tea Collection', category: 'Home', status: 'active', sales: 2100, revenue: 42000, growth: 9.2, date: '2024-12-03' },
];

function filterRows(rows: TableRow[], filters: FiltersState): TableRow[] {
  return rows.filter((row) => {
    if (filters.category !== 'all') {
      const cat = filters.category.toLowerCase();
      if (row.category.toLowerCase() !== cat) return false;
    }
    if (filters.status !== 'all' && row.status !== filters.status) return false;
    if (filters.startDate && row.date < filters.startDate) return false;
    if (filters.endDate && row.date > filters.endDate) return false;
    return true;
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [tableRows, setTableRows] = useState<TableRow[]>([]);

  const reload = useCallback(async (nextFilters: FiltersState) => {
    setIsLoading(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    setTableRows(filterRows(TABLE_ROWS, nextFilters));
    setIsLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    reload(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilterChange(updated: Partial<FiltersState>) {
    const next = { ...filters, ...updated };
    setFilters(next);
    reload(next);
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    reload(DEFAULT_FILTERS);
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <header>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor performance metrics and trends across your business.
        </p>
      </header>

      {/* Filters */}
      <FiltersBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {/* KPI Cards */}
      <KPIGrid data={KPI_DATA} isLoading={isLoading} />

      {/* Charts grid */}
      <section aria-label="Charts" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-300" style={{ opacity: isLoading ? 0.6 : 1 }}>
        {isLoading ? (
          <LoadingSkeleton variant="chart" count={3} />
        ) : (
          CHART_DATA.map((chart) => <ChartCard key={chart.id} data={chart} />)
        )}
      </section>

      {/* Data table */}
      <DataTable rows={tableRows} isLoading={isLoading} />
    </div>
  );
}
