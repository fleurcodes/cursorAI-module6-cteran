import { useCallback, useEffect, useRef, useState } from 'react';
import type { FeedState, NewPostDraft, ReactionType } from './types';
import {
  CURRENT_USER,
  generateMorePosts,
  generateSeedPosts,
} from './types';
import CreatePost from './CreatePost';
import PostCard, { PostCardSkeleton } from './PostCard';
import InfiniteScrollTrigger from './InfiniteScrollTrigger';
import { useToast } from '../ui/ToastProvider';

// ──────────────────────────────────────────────────────
//  localStorage helpers
// ──────────────────────────────────────────────────────
const STORAGE_KEY = 'social_feed_state';
const VERSION_KEY = 'social_feed_version';
const VERSION = '1';
const MAX_PAGES = 5;

function loadState(): FeedState | null {
  try {
    const version = localStorage.getItem(VERSION_KEY);
    if (version !== VERSION) return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !Array.isArray((parsed as Record<string, unknown>).posts)
    ) {
      return null;
    }
    return parsed as FeedState;
  } catch {
    return null;
  }
}

function saveState(state: FeedState): void {
  try {
    localStorage.setItem(VERSION_KEY, VERSION);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota or serialization error — silently ignore
  }
}

function buildInitialState(): FeedState {
  const persisted = loadState();
  if (persisted) return persisted;
  console.warn('[Feed] No valid persisted state found — loading seed data.');
  return {
    posts: generateSeedPosts(),
    page: 1,
    hasMore: true,
    isLoading: false,
  };
}

// ──────────────────────────────────────────────────────
//  Feed component
// ──────────────────────────────────────────────────────
export default function Feed() {
  const { showToast } = useToast();
  const [feedState, setFeedState] = useState<FeedState>(buildInitialState);
  const [newPostIds, setNewPostIds] = useState<Set<string>>(new Set());
  const didInit = useRef(false);

  // Persist whenever state changes (skip the very first render to avoid re-saving seed)
  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      return;
    }
    saveState(feedState);
  }, [feedState]);

  // ── Create post ────────────────────────────────────
  const handleCreatePost = useCallback(
    async (draft: NewPostDraft): Promise<void> => {
      await new Promise<void>((resolve) => setTimeout(resolve, 500));

      const newPost = {
        id: crypto.randomUUID(),
        author: CURRENT_USER,
        content: draft.content,
        mediaUrl: draft.mediaPreviewUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        likedByCurrentUser: false,
        reactionType: null,
        reactionCounts: [],
        commentCount: 0,
        shareCount: 0,
        comments: [],
        isCommentsOpen: false,
      };

      setFeedState((prev) => ({
        ...prev,
        posts: [newPost, ...prev.posts],
      }));
      setNewPostIds((prev) => new Set(prev).add(newPost.id));
      // Remove animation marker after it completes
      setTimeout(() => {
        setNewPostIds((prev) => {
          const next = new Set(prev);
          next.delete(newPost.id);
          return next;
        });
      }, 400);

      showToast('Post created successfully!', 'success');
    },
    [showToast]
  );

  // ── Like / Reaction ────────────────────────────────
  const handleLike = useCallback((postId: string, reaction: ReactionType) => {
    setFeedState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => {
        if (p.id !== postId) return p;

        const wasLiked = p.likedByCurrentUser && p.reactionType === reaction;
        const newLikedByCurrentUser = !wasLiked;
        const newReactionType = wasLiked ? null : reaction;

        // Update reaction counts
        const updatedCounts = p.reactionCounts.map((rc) => {
          if (rc.type === reaction) {
            return { ...rc, count: wasLiked ? Math.max(0, rc.count - 1) : rc.count + 1 };
          }
          // If switching from old reaction, decrement it
          if (!wasLiked && p.reactionType && rc.type === p.reactionType) {
            return { ...rc, count: Math.max(0, rc.count - 1) };
          }
          return rc;
        });

        // Add new reaction to counts if not present
        if (!wasLiked && !updatedCounts.find((rc) => rc.type === reaction)) {
          updatedCounts.push({ type: reaction, count: 1 });
        }

        const likeCount = updatedCounts.reduce((sum, rc) => sum + rc.count, 0);

        return {
          ...p,
          likedByCurrentUser: newLikedByCurrentUser,
          reactionType: newReactionType,
          reactionCounts: updatedCounts,
          likeCount,
        };
      }),
    }));
  }, []);

  // ── Toggle comments ───────────────────────────────
  const handleToggleComments = useCallback((postId: string) => {
    setFeedState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) =>
        p.id === postId ? { ...p, isCommentsOpen: !p.isCommentsOpen } : p
      ),
    }));
  }, []);

  // ── Share ─────────────────────────────────────────
  const handleShare = useCallback(
    async (postId: string) => {
      const url = `https://app.local/posts/${postId}`;
      try {
        await navigator.clipboard.writeText(url);
        setFeedState((prev) => ({
          ...prev,
          posts: prev.posts.map((p) =>
            p.id === postId ? { ...p, shareCount: p.shareCount + 1 } : p
          ),
        }));
        showToast('Link copied!', 'success');
      } catch {
        showToast('Could not copy link.', 'error');
      }
    },
    [showToast]
  );

  // ── Delete post ───────────────────────────────────
  const handleDelete = useCallback(
    (postId: string) => {
      setFeedState((prev) => ({
        ...prev,
        posts: prev.posts.filter((p) => p.id !== postId),
      }));
      showToast('Post deleted', 'info');
    },
    [showToast]
  );

  // ── Report post ───────────────────────────────────
  const handleReport = useCallback((postId: string) => {
    console.log('[Feed] Post reported:', postId);
  }, []);

  // ── Like comment ──────────────────────────────────
  const handleLikeComment = useCallback((postId: string, commentId: string) => {
    setFeedState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: p.comments.map((c) => {
            if (c.id !== commentId) return c;
            const liked = !c.likedByCurrentUser;
            return {
              ...c,
              likedByCurrentUser: liked,
              likeCount: liked ? c.likeCount + 1 : Math.max(0, c.likeCount - 1),
            };
          }),
        };
      }),
    }));
  }, []);

  // ── Add comment ───────────────────────────────────
  const handleAddComment = useCallback((postId: string, content: string) => {
    const newComment = {
      id: crypto.randomUUID(),
      postId,
      author: CURRENT_USER,
      content,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      likedByCurrentUser: false,
    };
    setFeedState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [...p.comments, newComment],
          commentCount: p.commentCount + 1,
        };
      }),
    }));
  }, []);

  // ── Infinite scroll ───────────────────────────────
  const handleLoadMore = useCallback(async () => {
    if (feedState.isLoading || !feedState.hasMore) return;

    setFeedState((prev) => ({ ...prev, isLoading: true }));
    await new Promise<void>((resolve) => setTimeout(resolve, 1200));

    setFeedState((prev) => {
      const nextPage = prev.page + 1;
      const newPosts = generateMorePosts(nextPage);
      return {
        ...prev,
        posts: [...prev.posts, ...newPosts],
        page: nextPage,
        hasMore: nextPage < MAX_PAGES,
        isLoading: false,
      };
    });
  }, [feedState.isLoading, feedState.hasMore]);

  return (
    <div className="w-full max-w-2xl mx-auto sm:max-w-xl lg:max-w-2xl px-4 py-6 space-y-4">
      <CreatePost onSubmit={handleCreatePost} />

      {feedState.posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isNew={newPostIds.has(post.id)}
          onLike={handleLike}
          onToggleComments={handleToggleComments}
          onShare={handleShare}
          onDelete={handleDelete}
          onReport={handleReport}
          onLikeComment={handleLikeComment}
          onAddComment={handleAddComment}
        />
      ))}

      {feedState.isLoading && (
        <div className="space-y-4" aria-label="Loading more posts" aria-live="polite">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      )}

      <InfiniteScrollTrigger
        onIntersect={handleLoadMore}
        hasMore={feedState.hasMore}
        isLoading={feedState.isLoading}
      />
    </div>
  );
}
