import { useRef, useState } from 'react';
import { CURRENT_USER } from './types';
import UserAvatar from './UserAvatar';

interface CommentInputProps {
  postId: string;
  onSubmit: (postId: string, content: string) => void;
}

export default function CommentInput({ postId, onSubmit }: CommentInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(postId, trimmed);
    setValue('');
    // Restore focus
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 mt-3"
      aria-label="Write a comment"
    >
      <UserAvatar author={CURRENT_USER} size="sm" />
      <div className="flex-1 flex items-center gap-1 bg-gray-100 dark:bg-gray-700/60 rounded-full px-3 py-1.5">
        <label htmlFor={`comment-input-${postId}`} className="sr-only">
          Write a comment
        </label>
        <input
          ref={inputRef}
          id={`comment-input-${postId}`}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment…"
          maxLength={500}
          className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none min-w-0"
          aria-label="Comment text"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Send comment"
          className="p-1 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </form>
  );
}
