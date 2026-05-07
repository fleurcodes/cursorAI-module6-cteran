import { useEffect, useRef, useState } from 'react';
import type { Post, ReactionType } from './types';
import { REACTION_OPTIONS } from './types';

interface PostActionsProps {
  post: Post;
  onLike: (postId: string, reaction: ReactionType) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

function topReactions(post: Post): ReactionType[] {
  return [...post.reactionCounts]
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 2)
    .map((r) => r.type);
}

function totalReactions(post: Post): number {
  return post.reactionCounts.reduce((sum, r) => sum + r.count, 0);
}

export default function PostActions({ post, onLike, onComment, onShare }: PostActionsProps) {
  const [scaled, setScaled] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const likeButtonRef = useRef<HTMLButtonElement>(null);

  const top = topReactions(post);
  const total = totalReactions(post);

  // Close picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        pickerRef.current && !pickerRef.current.contains(e.target as Node) &&
        likeButtonRef.current && !likeButtonRef.current.contains(e.target as Node)
      ) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [pickerOpen]);

  const handleReactionSelect = (reaction: ReactionType) => {
    setPickerOpen(false);
    setScaled(true);
    onLike(post.id, reaction);
    setTimeout(() => setScaled(false), 300);
  };

  const handleLikeClick = () => {
    // If a reaction is already set, toggle it off by clicking the same
    const reaction = post.reactionType ?? '👍';
    handleReactionSelect(reaction);
  };

  const handleMouseEnter = () => setPickerOpen(true);
  const handleMouseLeave = () => {
    longPressRef.current && clearTimeout(longPressRef.current);
  };

  const handleTouchStart = () => {
    longPressRef.current = setTimeout(() => setPickerOpen(true), 400);
  };
  const handleTouchEnd = () => {
    if (longPressRef.current) clearTimeout(longPressRef.current);
  };

  return (
    <div className="flex items-center gap-1 pt-1">
      {/* Like / Reaction button */}
      <div className="relative flex-1">
        <button
          ref={likeButtonRef}
          type="button"
          aria-label={post.likedByCurrentUser ? 'Unlike post' : 'Like post'}
          onClick={handleLikeClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 w-full justify-center min-h-[44px]
            ${post.likedByCurrentUser
              ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-rose-500'
            }`}
        >
          <span
            className={`text-lg leading-none transition-transform duration-150 ${scaled ? 'scale-125' : 'scale-100'}`}
            aria-hidden="true"
          >
            {post.likedByCurrentUser && post.reactionType ? post.reactionType : '🤍'}
          </span>
          <span className="flex items-center gap-0.5 text-xs">
            {top.length > 0 && (
              <span aria-hidden="true">{top.join('')}</span>
            )}
            <span>{total > 0 ? total : ''}</span>
          </span>
        </button>

        {/* Reaction picker popover */}
        {pickerOpen && (
          <div
            ref={pickerRef}
            role="toolbar"
            aria-label="Reaction options"
            onMouseEnter={() => setPickerOpen(true)}
            onMouseLeave={() => setPickerOpen(false)}
            className="absolute bottom-full left-0 mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl px-2 py-1.5 flex gap-0.5 z-30"
          >
            {REACTION_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                aria-label={`React with ${emoji}`}
                onClick={() => handleReactionSelect(emoji)}
                className={`text-xl px-1.5 py-0.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-100 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                  ${post.reactionType === emoji ? 'bg-indigo-50 dark:bg-indigo-900/30 scale-110' : ''}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comment button */}
      <button
        type="button"
        aria-label={`Comment on post, ${post.commentCount} comments`}
        onClick={() => onComment(post.id)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex-1 justify-center min-h-[44px]
          ${post.isCommentsOpen
            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-indigo-600'
          }`}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="text-xs">{post.commentCount > 0 ? post.commentCount : ''}</span>
      </button>

      {/* Share button */}
      <button
        type="button"
        aria-label={`Share post, ${post.shareCount} shares`}
        onClick={() => onShare(post.id)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-sky-500 transition-colors duration-150 flex-1 justify-center min-h-[44px]"
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span className="text-xs">{post.shareCount > 0 ? post.shareCount : ''}</span>
      </button>
    </div>
  );
}
