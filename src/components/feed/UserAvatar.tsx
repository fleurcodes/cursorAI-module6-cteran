import type { Author } from './types';

interface UserAvatarProps {
  author: Author;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

const FALLBACK_COLORS = [
  'bg-indigo-500',
  'bg-pink-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-sky-500',
  'bg-violet-500',
];

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export default function UserAvatar({ author, size = 'md', className = '' }: UserAvatarProps) {
  const sizeClass = SIZE_MAP[size];
  const initials = author.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  const color = FALLBACK_COLORS[hashCode(author.id) % FALLBACK_COLORS.length];

  return author.avatarUrl ? (
    <img
      src={author.avatarUrl}
      alt={`${author.name}'s avatar`}
      className={`${sizeClass} rounded-full object-cover flex-shrink-0 ${className}`}
    />
  ) : (
    <span
      aria-label={`${author.name}'s avatar`}
      className={`${sizeClass} ${color} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ${className}`}
    >
      {initials}
    </span>
  );
}
