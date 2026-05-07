export interface UserStats {
  posts: number;
  followers: number;
  following: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  stats: UserStats;
  isFollowing?: boolean;
  isOwnProfile?: boolean;
}
