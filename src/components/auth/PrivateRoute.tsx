import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const PROTECTED_ROUTES = ['/dashboard', '/settings', '/analytics', '/kanban', '/feed'];

/** Wrap protected pages. Redirects unauthenticated users to /login with a ?redirect= param. */
export default function PrivateRoute({ children, route }: { children: ReactNode; route: string }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated && PROTECTED_ROUTES.includes(route)) {
    const redirectParam = encodeURIComponent(route);
    window.location.hash = `#/login?redirect=${redirectParam}`;
    return null;
  }

  return <>{children}</>;
}
