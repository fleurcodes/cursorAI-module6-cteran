import { useState } from 'react';
import type { Task } from './types';
import PriorityBadge from './PriorityBadge';
import AssigneeAvatar from './AssigneeAvatar';
import DueDateLabel from './DueDateLabel';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  /** Accessible fallback: list of column options to move task */
  columnOptions: Array<{ id: string; title: string }>;
  onMoveToColumn: (taskId: string, columnId: string) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDragStart,
  onDragEnd,
  isDragging,
  columnOptions,
  onMoveToColumn,
}: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEdit(task);
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      aria-grabbed={isDragging}
      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 cursor-pointer select-none transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
        isDragging ? 'opacity-50 shadow-lg scale-105' : ''
      }`}
      role="article"
      aria-label={`Task: ${task.title}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => onEdit(task)}
    >
      {/* Drag handle */}
      <div
        className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-grab active:cursor-grabbing text-gray-400"
        aria-hidden="true"
        onClick={(e) => e.stopPropagation()}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Accessible "Move to" menu */}
      <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Move task options"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-0.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-6 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-20"
          >
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              Move to…
            </div>
            {columnOptions
              .filter((c) => c.id !== task.columnId)
              .map((col) => (
                <button
                  key={col.id}
                  role="menuitem"
                  onClick={() => {
                    onMoveToColumn(task.id, col.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:bg-gray-100 dark:focus-visible:bg-gray-700"
                >
                  {col.title}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 pr-8 mb-2">
        {task.title}
      </p>

      {/* Priority badge */}
      <div className="mb-2">
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: assignees + due date */}
      <div className="flex items-center justify-between mt-1">
        <AssigneeAvatar assignees={task.assignees} />
        {task.dueDate && <DueDateLabel dueDate={task.dueDate} />}
      </div>
    </div>
  );
}
