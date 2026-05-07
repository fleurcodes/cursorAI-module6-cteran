import type { FilterState, Priority } from './types';
import { TEAM_MEMBERS } from '../../constants/teamMembers';

interface BoardFiltersProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  activeCount: number;
  onClear: () => void;
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'critical'];

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export default function BoardFilters({ filters, onChange, activeCount, onClear }: BoardFiltersProps) {
  const togglePriority = (p: Priority) => {
    const next = filters.priorities.includes(p)
      ? filters.priorities.filter((x) => x !== p)
      : [...filters.priorities, p];
    onChange({ ...filters, priorities: next });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      {/* Text search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <label htmlFor="kanban-search" className="sr-only">Search tasks</label>
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          id="kanban-search"
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search tasks…"
          className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Priority multi-select */}
      <div className="flex items-center gap-1" role="group" aria-label="Filter by priority">
        {PRIORITIES.map((p) => (
          <button
            key={p}
            onClick={() => togglePriority(p)}
            aria-pressed={filters.priorities.includes(p)}
            className={`px-2 py-1 rounded-full text-xs font-semibold border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              filters.priorities.includes(p)
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {PRIORITY_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Assignee filter */}
      <div>
        <label htmlFor="assignee-filter" className="sr-only">Filter by assignee</label>
        <select
          id="assignee-filter"
          value={filters.assigneeId}
          onChange={(e) => onChange({ ...filters, assigneeId: e.target.value })}
          className="text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All assignees</option>
          {TEAM_MEMBERS.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Overdue toggle */}
      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={filters.overdueOnly}
          onChange={(e) => onChange({ ...filters, overdueOnly: e.target.checked })}
          className="w-4 h-4 rounded accent-indigo-600 focus:ring-2 focus:ring-indigo-500"
        />
        Overdue only
      </label>

      {/* Clear filters */}
      {activeCount > 0 && (
        <button
          onClick={onClear}
          className="ml-auto flex items-center gap-1 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear filters
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 text-xs font-bold">
            {activeCount}
          </span>
        </button>
      )}
    </div>
  );
}
