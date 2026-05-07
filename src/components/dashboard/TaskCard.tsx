import type { Task, TaskPriority, TaskStatus } from '../../types/dashboard';

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; classes: string; dot: string }> = {
  low:      { label: 'Low',      classes: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',    dot: 'bg-green-500' },
  medium:   { label: 'Medium',   classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400', dot: 'bg-yellow-500' },
  high:     { label: 'High',     classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400', dot: 'bg-orange-500' },
  critical: { label: 'Critical', classes: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',           dot: 'bg-red-500' },
};

const STATUS_CONFIG: Record<TaskStatus, { label: string; classes: string }> = {
  'todo':        { label: 'To Do',       classes: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  'in-progress': { label: 'In Progress', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  'review':      { label: 'Review',      classes: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' },
  'done':        { label: 'Done',        classes: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
};

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const priority = PRIORITY_CONFIG[task.priority];
  const status = STATUS_CONFIG[task.status];

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
      {/* Top row: priority badge + status badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${priority.classes}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} aria-hidden="true" />
          {priority.label}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.classes}`}>
          {status.label}
        </span>
      </div>

      {/* Title & description */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{task.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.description}</p>
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: assignee + due date */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0" aria-hidden="true">
            {task.assignee.slice(0, 2).toUpperCase()}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[80px]">{task.assignee}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {task.dueDate}
        </div>
      </div>
    </article>
  );
}
