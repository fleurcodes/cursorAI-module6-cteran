import { useEffect, useRef, useState } from 'react';
import type { Post } from './types';
import UserAvatar from './UserAvatar';
import { CURRENT_USER } from './types';

interface PostHeaderProps {
  post: Post;
  onDelete: (postId: string) => void;
  onReport: (postId: string) => void;
}

function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return 'just now';
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} d ago`;
  return new Date(isoString).toLocaleDateString();
}

export default function PostHeader({ post, onDelete, onReport }: PostHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isOwnPost = post.author.id === CURRENT_USER.id;

  // Close when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setConfirmDelete(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMenuOpen(false);
      setConfirmDelete(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div className="flex items-start gap-3">
      <UserAvatar author={post.author} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug">
            {post.author.name}
          </span>
          <span className="text-gray-400 dark:text-gray-500 text-xs">{post.author.username}</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {formatRelativeTime(post.createdAt)}
        </p>
      </div>

      {/* Options menu */}
      <div className="relative flex-shrink-0">
        <button
          ref={buttonRef}
          type="button"
          aria-label="Post options"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => { setMenuOpen((v) => !v); setConfirmDelete(false); }}
          className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            role="menu"
            onKeyDown={handleKeyDown}
            className="absolute right-0 top-8 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 py-1 overflow-hidden"
          >
            {isOwnPost ? (
              confirmDelete ? (
                <div className="px-3 py-2">
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 font-medium">Are you sure?</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => { onDelete(post.id); setMenuOpen(false); setConfirmDelete(false); }}
                      className="flex-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg px-2 py-1 font-medium transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg px-2 py-1 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Delete post
                </button>
              )
            ) : (
              <button
                type="button"
                role="menuitem"
                onClick={() => { onReport(post.id); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                Report post
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
