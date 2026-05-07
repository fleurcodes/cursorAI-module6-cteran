import { useRef, useState } from 'react';
import { COLUMN_COLORS } from './types';

interface BoardHeaderProps {
  onAddColumn: (title: string, color: string) => void;
  onResetBoard: () => void;
  filterCount: number;
  filtersVisible: boolean;
  onToggleFilters: () => void;
}

export default function BoardHeader({
  onAddColumn,
  onResetBoard,
  filterCount,
  filtersVisible,
  onToggleFilters,
}: BoardHeaderProps) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startAdding = () => {
    setAdding(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commit = () => {
    const t = title.trim();
    if (t) {
      const color = COLUMN_COLORS[Math.floor(Math.random() * COLUMN_COLORS.length)];
      onAddColumn(t, color);
    }
    setTitle('');
    setAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { setTitle(''); setAdding(false); }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">Project Board</h1>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Filter toggle */}
        <button
          onClick={onToggleFilters}
          aria-pressed={filtersVisible}
          className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters
          {filterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </button>

        {/* Add column */}
        {adding ? (
          <div className="flex items-center gap-1.5">
            <label htmlFor="new-column-input" className="sr-only">New column title</label>
            <input
              id="new-column-input"
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={commit}
              onKeyDown={handleKeyDown}
              maxLength={40}
              placeholder="Column title…"
              className="px-2 py-1.5 text-sm rounded-lg border border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36"
            />
            <button
              onClick={commit}
              aria-label="Confirm add column"
              className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={() => { setTitle(''); setAdding(false); }}
              aria-label="Cancel"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={startAdding}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Column
          </button>
        )}

        {/* Reset board */}
        {confirmReset ? (
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-red-500 font-medium">Reset board?</span>
            <button
              onClick={() => { onResetBoard(); setConfirmReset(false); }}
              className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
