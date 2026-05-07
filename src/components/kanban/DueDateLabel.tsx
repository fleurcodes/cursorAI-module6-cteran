interface DueDateLabelProps {
  dueDate: string; // ISO 8601 date string
}

function isOverdue(dueDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
}

function formatDate(dueDate: string): string {
  const d = new Date(dueDate);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function DueDateLabel({ dueDate }: DueDateLabelProps) {
  const overdue = isOverdue(dueDate);

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        overdue
          ? 'text-red-600 dark:text-red-400'
          : 'text-gray-500 dark:text-gray-400'
      }`}
      aria-label={`Due ${formatDate(dueDate)}${overdue ? ' — overdue' : ''}`}
    >
      {overdue && (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      )}
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {formatDate(dueDate)}
    </span>
  );
}
