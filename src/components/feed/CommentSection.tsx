import { useState } from 'react';
import type { Post } from './types';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';

interface CommentSectionProps {
  post: Post;
  onLikeComment: (postId: string, commentId: string) => void;
  onAddComment: (postId: string, content: string) => void;
}

const INITIAL_VISIBLE = 3;

export default function CommentSection({ post, onLikeComment, onAddComment }: CommentSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleComments = showAll ? post.comments : post.comments.slice(0, INITIAL_VISIBLE);
  const hiddenCount = post.comments.length - INITIAL_VISIBLE;

  return (
    <div
      className="mt-3 border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2"
      aria-live="polite"
      aria-label="Comments"
    >
      {post.comments.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">
          Be the first to comment.
        </p>
      ) : (
        <>
          {visibleComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={(commentId) => onLikeComment(post.id, commentId)}
            />
          ))}

          {!showAll && hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded pl-1"
            >
              View all {post.comments.length} comments
            </button>
          )}

          {showAll && post.comments.length > INITIAL_VISIBLE && (
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded pl-1"
            >
              Show less
            </button>
          )}
        </>
      )}

      <CommentInput postId={post.id} onSubmit={onAddComment} />
    </div>
  );
}
