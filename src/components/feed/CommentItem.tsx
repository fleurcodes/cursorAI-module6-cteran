import type { Comment } from './types';
import UserAvatar from './UserAvatar';

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
}

function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.floor(diffHours / 24)}d`;
}

export default function CommentItem({ comment, onLike }: CommentItemProps) {
  return (
    <div className="flex gap-2 items-start group">
      <UserAvatar author={comment.author} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 dark:bg-gray-700/60 rounded-2xl px-3 py-2">
          <span className="font-semibold text-xs text-gray-900 dark:text-gray-100 mr-1.5">
            {comment.author.name}
          </span>
          <span className="text-xs text-gray-700 dark:text-gray-300 break-words">
            {comment.content}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 pl-1">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatRelativeTime(comment.createdAt)}
          </span>
          <button
            type="button"
            onClick={() => onLike(comment.id)}
            aria-label={comment.likedByCurrentUser ? 'Unlike comment' : 'Like comment'}
            className={`flex items-center gap-1 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded
              ${comment.likedByCurrentUser
                ? 'text-rose-500'
                : 'text-gray-400 dark:text-gray-500 hover:text-rose-500'
              }`}
          >
            <svg className="w-3.5 h-3.5" fill={comment.likedByCurrentUser ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
