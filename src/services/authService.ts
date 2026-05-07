import type { AuthUser } from '../types/auth';
import { type MockUser, MOCK_USERS } from './mockUsers';

const SESSION_KEY = 'auth_user';
const LOCAL_KEY = 'auth_user_remember';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  username: string;
  bio: string;
}

function toAuthUser(user: MockUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
  };
}

/** Load persisted session from sessionStorage or localStorage. */
export function loadSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/** Validate credentials and persist session. Returns user on success, null on failure. */
export function login(email: string, password: string, remember: boolean): AuthUser | null {
  const found = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  );
  if (!found) return null;

  const authUser = toAuthUser(found);
  if (remember) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(authUser));
  } else {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
  }
  return authUser;
}

/** Register a new user, persist session, and return the new AuthUser. */
export function register(payload: RegisterPayload): AuthUser {
  const exists = MOCK_USERS.some(
    (u) => u.email.toLowerCase() === payload.email.trim().toLowerCase(),
  );
  if (exists) throw new Error('An account with this email already exists.');

  const newUser: MockUser = {
    id: String(Date.now()),
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    username: payload.username.trim(),
    bio: payload.bio.trim(),
    avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(payload.username)}`,
  };

  MOCK_USERS.push(newUser);

  const authUser = toAuthUser(newUser);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
  return authUser;
}

/** Clear all persisted auth data. */
export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LOCAL_KEY);
}
