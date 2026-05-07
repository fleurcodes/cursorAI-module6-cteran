import { useState } from 'react';
import type { User } from '../types/user';
import Avatar from './Avatar';
import StatItem from './StatItem';

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  const [following, setFollowing] = useState(user.isFollowing ?? false);
  const [followerCount, setFollowerCount] = useState(user.stats.followers);

  function handleFollow() {
    setFollowing((prev) => {
      const next = !prev;
      setFollowerCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  }

  return (
    <article
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden max-w-sm w-full transition-colors duration-300"
      aria-label={`Profile of ${user.name}`}
    >
      {/* Cover banner */}
      <div className="h-24 bg-gradient-to-r from-purple-500 to-indigo-500" aria-hidden="true" />

      {/* Avatar — overlaps cover */}
      <div className="-mt-12 px-6 flex items-end justify-between">
        <Avatar src={user.avatarUrl} alt={user.name} size="lg" />

        {user.isOwnProfile ? (
          <button
            type="button"
            className="mb-1 px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Edit your profile"
          >
            Edit Profile
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFollow}
            className={`mb-1 px-5 py-1.5 rounded-full text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              following
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
            aria-pressed={following}
            aria-label={following ? `Unfollow ${user.name}` : `Follow ${user.name}`}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-6 pt-3 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{user.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>

        {user.bio && (
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{user.bio}</p>
        )}

        {/* Stats */}
        <div
          className="mt-4 flex justify-around border-t border-gray-100 dark:border-gray-700 pt-4"
          role="list"
          aria-label="Profile statistics"
        >
          <div role="listitem">
            <StatItem label="Posts" value={user.stats.posts} />
          </div>
          <div role="listitem">
            <StatItem label="Followers" value={followerCount} />
          </div>
          <div role="listitem">
            <StatItem label="Following" value={user.stats.following} />
          </div>
        </div>

        {/* Action buttons */}
        {!user.isOwnProfile && (
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleFollow}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                following
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
              aria-pressed={following}
            >
              {following ? 'Following' : 'Follow'}
            </button>
            <button
              type="button"
              className="flex-1 py-2 rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label={`Send message to ${user.name}`}
            >
              Message
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
