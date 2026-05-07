import { useState } from 'react';
import type { Post, ReactionType } from './types';
import PostHeader from './PostHeader';
import PostMedia from './PostMedia';
import PostActions from './PostActions';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: Post;
  isNew?: boolean;
  onLike: (postId: string, reaction: ReactionType) => void;
  onToggleComments: (postId: string) => void;
  onShare: (postId: string) => void;
  onDelete: (postId: string) => void;
  onReport: (postId: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onAddComment: (postId: string, content: string) => void;
}

const LINE_CLAMP_CLASS = 'line-clamp-3';

export default function PostCard({
  post, isNew = false, onLike, onToggleComments, onShare,
  onDelete, onReport, onLikeComment, onAddComment,
}: PostCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Rough heuristic: if content > 200 chars, it may overflow 3 lines
  const isLong = post.content.length > 200;

  return (
    <article
      className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden
        ${isNew ? 'animate-slide-in' : ''}`}
      aria-label={`Post by ${post.author.name}`}
    >
      <div className="p-4">
        <PostHeader post={post} onDelete={onDelete} onReport={onReport} />

        <div className="mt-3">
          <p
            className={`text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap break-words
              ${isLong && !expanded ? LINE_CLAMP_CLASS : ''}`}
          >
            {post.content}
          </p>
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-1 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              {expanded ? 'See less' : 'See more'}
            </button>
          )}
        </div>

        {post.mediaUrl && (
          <PostMedia mediaUrl={post.mediaUrl} altText={`Image shared by ${post.author.name}`} />
        )}
      </div>

      <div className="px-4 pb-3">
        <hr className="border-gray-100 dark:border-gray-700 mb-1" />
        <PostActions
          post={post}
          onLike={onLike}
          onComment={onToggleComments}
          onShare={onShare}
        />
      </div>

      {/* Collapsible comments */}
      {post.isCommentsOpen && (
        <div className="px-4 pb-4">
          <CommentSection
            post={post}
            onLikeComment={onLikeComment}
            onAddComment={onAddComment}
          />
        </div>
      )}
    </article>
  );
}

// ──────────────────────────────────────────────────────
//  Skeleton card (for infinite scroll loading state)
// ──────────────────────────────────────────────────────
export function PostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-md p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3" />
          <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full w-1/5" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-4/6" />
      </div>
      <div className="mt-4 h-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="mt-4 flex gap-3">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1" />
      </div>
    </div>
  );
}
