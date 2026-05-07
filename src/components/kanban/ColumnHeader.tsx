import { useEffect, useRef, useState } from 'react';
import type { Column, Task } from './types';

interface ColumnHeaderProps {
  column: Column;
  taskCount: number;
  onAddTask: () => void;
  onRename: (newTitle: string) => void;
  onDelete: () => void;
  canDelete: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

export default function ColumnHeader({
  column,
  taskCount,
  onAddTask,
  onRename,
  onDelete,
  canDelete,
  onDragStart,
  onDragEnd,
}: ColumnHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(column.title);
  const [showDeleteTooltip, setShowDeleteTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAtLimit = column.taskLimit !== undefined && taskCount >= column.taskLimit;

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== column.title) onRename(trimmed);
    else setValue(column.title);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { setValue(column.title); setEditing(false); }
  };

  const badgeClass = isAtLimit
    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 animate-pulse'
    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400';

  return (
    <div
      className="flex items-center justify-between px-3 py-2.5 rounded-t-xl"
      style={{ borderBottom: `3px solid ${column.color ?? '#6366f1'}` }}
    >
      {/* Drag handle for column */}
      <button
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        aria-label={`Drag column: ${column.title}`}
        className="mr-1.5 cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-400 focus-visible:outline-none"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      {/* Title / inline edit */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            maxLength={40}
            aria-label="Rename column"
            className="w-full text-sm font-semibold bg-transparent border-b border-indigo-400 outline-none text-gray-800 dark:text-gray-100"
          />
        ) : (
          <span
            className="text-sm font-semibold text-gray-800 dark:text-gray-100 cursor-pointer truncate block"
            onDoubleClick={() => setEditing(true)}
            title="Double-click to rename"
          >
            {column.title}
          </span>
        )}
      </div>

      {/* Task count badge */}
      <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>
        {column.taskLimit !== undefined ? `${taskCount}/${column.taskLimit}` : taskCount}
      </span>

      {/* Add task button */}
      <button
        onClick={onAddTask}
        disabled={isAtLimit}
        aria-label={`Add task to ${column.title}`}
        title={isAtLimit ? 'WIP limit reached' : 'Add task'}
        className="ml-1.5 p-1 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Delete column */}
      <div className="relative ml-0.5">
        <button
          onClick={() => {
            if (canDelete) onDelete();
            else setShowDeleteTooltip(true);
          }}
          onMouseLeave={() => setShowDeleteTooltip(false)}
          aria-label={`Delete column ${column.title}`}
          className="p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-gray-600 dark:hover:text-red-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        {showDeleteTooltip && (
          <div className="absolute top-full right-0 mt-1 w-40 bg-gray-900 text-white text-xs rounded-lg p-2 z-20 pointer-events-none shadow-lg">
            Remove all tasks before deleting this column.
          </div>
        )}
      </div>
    </div>
  );
}
