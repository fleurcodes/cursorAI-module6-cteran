import type { FiltersState, SelectOption } from './types';
import DateRangePicker from './DateRangePicker';
import SelectFilter from './SelectFilter';

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports' },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

interface FiltersBarProps {
  filters: FiltersState;
  onChange: (updated: Partial<FiltersState>) => void;
  onReset: () => void;
  isLoading: boolean;
}

export default function FiltersBar({ filters, onChange, onReset, isLoading }: FiltersBarProps) {
  return (
    <section
      aria-label="Analytics filters"
      className="rounded-2xl bg-white dark:bg-gray-800 shadow-md p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-end gap-4">
        {/* Date range */}
        <DateRangePicker
          startDate={filters.startDate}
          endDate={filters.endDate}
          onStartDateChange={(v) => onChange({ startDate: v })}
          onEndDateChange={(v) => onChange({ endDate: v })}
        />

        {/* Category */}
        <SelectFilter
          id="analytics-category"
          label="Category"
          value={filters.category}
          options={CATEGORY_OPTIONS}
          onChange={(v) => onChange({ category: v })}
        />

        {/* Status */}
        <SelectFilter
          id="analytics-status"
          label="Status"
          value={filters.status}
          options={STATUS_OPTIONS}
          onChange={(v) => onChange({ status: v as FiltersState['status'] })}
        />

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="mt-auto px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Reset all filters"
        >
          Reset Filters
        </button>
      </div>
    </section>
  );
}
