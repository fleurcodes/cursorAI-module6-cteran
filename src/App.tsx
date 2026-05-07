import { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar';
import ProductDemoPage from './pages/ProductDemoPage';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import KanbanPage from './pages/KanbanPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import './App.css';
import SocialFeed from './pages/SocialFeed';
import TeamDashboard from './pages/TeamDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import PrivateRoute from './components/auth/PrivateRoute';

type Route = '/' | '/products' | '/dashboard' | '/settings' | '/analytics' | '/kanban' | '/feed' | '/login' | '/register' | '/team' | '/cart' | '/checkout' | '/order-confirmation';

const VALID_ROUTES: Route[] = ['/', '/products', '/dashboard', '/settings', '/analytics', '/kanban', '/feed', '/login', '/register', '/team', '/cart', '/checkout', '/order-confirmation'];

function getRoute(hash: string): Route {
  // Strip query string before matching
  const path = (hash.replace(/^#/, '').split('?')[0]) || '/products';
  return VALID_ROUTES.includes(path as Route) ? (path as Route) : '/products';
}

function usePage(): Route {
  const [route, setRoute] = useState<Route>(() => getRoute(window.location.hash));

  useEffect(() => {
    const handler = () => setRoute(getRoute(window.location.hash));
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return route;
}

function AppRoutes() {
  const [searchQuery, setSearchQuery] = useState('');
  const route = usePage();
  const { isAuthenticated } = useAuth();

  // Redirect authenticated users away from /login and /register
  useEffect(() => {
    if (isAuthenticated && (route === '/login' || route === '/register')) {
      window.location.hash = '#/dashboard';
    }
  }, [isAuthenticated, route]);

  // Bare pages (no navbar)
  if (route === '/login') return <LoginPage />;
  if (route === '/register') return <RegistrationPage />;

  // Pages that render their own full layout
  if (route === '/dashboard') {
    return (
      <PrivateRoute route={route}>
        <Dashboard searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PrivateRoute>
    );
  }
  if (route === '/settings') {
    return (
      <PrivateRoute route={route}>
        <SettingsPage searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PrivateRoute>
    );
  }
  if (route === '/analytics') {
    return (
      <PrivateRoute route={route}>
        <AnalyticsPage searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PrivateRoute>
    );
  }
  if (route === '/kanban') {
    return (
      <PrivateRoute route={route}>
        <KanbanPage searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </PrivateRoute>
    );
  }
  if (route === '/team') {
    return <TeamDashboard />;
  }

  // Standard pages (with Navbar)
  const pageContent = (() => {
    switch (route) {
      case '/cart':
        return <CartPage />;
      case '/checkout':
        return <CheckoutPage />;
      case '/order-confirmation':
        return <OrderConfirmationPage />;
      case '/feed':
        return (
          <PrivateRoute route={route}>
            <SocialFeed />
          </PrivateRoute>
        );
      default:
        return <ProductDemoPage searchQuery={searchQuery} onSearchChange={setSearchQuery} />;
    }
  })();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main>{pageContent}</main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
