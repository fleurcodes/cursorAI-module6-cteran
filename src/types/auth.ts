export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  bio: string;
  avatarUrl: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}
