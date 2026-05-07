import { useState } from 'react';
import type { Assignee } from './types';

interface AssigneeAvatarProps {
  assignees: Assignee[];
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

const BG_COLORS = [
  'bg-indigo-500', 'bg-pink-500', 'bg-teal-500',
  'bg-amber-500', 'bg-rose-500', 'bg-violet-500',
];

function colorFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash += id.charCodeAt(i);
  return BG_COLORS[hash % BG_COLORS.length];
}

export default function AssigneeAvatar({ assignees }: AssigneeAvatarProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const visible = assignees.slice(0, 3);
  const overflow = assignees.length - 3;

  return (
    <div className="flex -space-x-2" role="group" aria-label="Assignees">
      {visible.map((a) => (
        <div
          key={a.id}
          className="relative"
          onMouseEnter={() => setTooltip(a.name)}
          onMouseLeave={() => setTooltip(null)}
        >
          {a.avatarUrl ? (
            <img
              src={a.avatarUrl}
              alt={a.name}
              className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover"
            />
          ) : (
            <div
              className={`w-6 h-6 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center text-[9px] font-bold text-white ${colorFor(a.id)}`}
              aria-label={a.name}
            >
              {initials(a.name)}
            </div>
          )}
          {tooltip === a.name && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-md bg-gray-900 text-white text-xs whitespace-nowrap z-10 pointer-events-none shadow-lg">
              {a.name}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          )}
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-[9px] font-bold text-gray-700 dark:text-gray-200">
          +{overflow}
        </div>
      )}
    </div>
  );
}
