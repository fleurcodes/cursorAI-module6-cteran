import { useEffect, useRef, useState } from 'react';
import type { NavLink, NavbarProps } from '../../types/navigation';
import { isActive } from '../../utils/activeLink';
import MobileMenu from './MobileMenu';
import UserDropdown from './UserDropdown';
import DarkModeToggle from '../dashboard/DarkModeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const PUBLIC_LINKS: NavLink[] = [
  { label: 'Home', href: '/', exact: true },
  { label: 'Products', href: '/products' },
];

const AUTH_LINKS: NavLink[] = [
  { label: 'Feed', href: '/feed' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Kanban', href: '/kanban' },
  { label: 'Team', href: '/team' },
  { label: 'Settings', href: '/settings' },
];

export default function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const { totalCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  const navLinks = isAuthenticated ? [...PUBLIC_LINKS, ...AUTH_LINKS] : PUBLIC_LINKS;

  // Re-render when the hash changes so active links update immediately
  const [, tick] = useState(0);
  useEffect(() => {
    const onHash = () => tick((n) => n + 1);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Sync input when the parent resets the query (e.g., from the in-page search)
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Add shadow once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Debounce search with a ref-based timer
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange(value);
      // Navigate to Products page when a query is typed
      if (value.trim()) {
        window.location.hash = '#/products';
      }
    }, 300);
  };

  return (
    <header
      className={`sticky top-0 z-30 bg-white dark:bg-gray-900 transition-shadow duration-300 ${
        scrolled ? 'shadow-md dark:shadow-gray-800/50' : 'border-b border-gray-100 dark:border-gray-700'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Logo ───────────────────────────────────────────────── */}
          <a
            href="#/"
            className="flex items-center gap-2 flex-shrink-0 text-primary font-bold text-xl tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <svg
              className="w-7 h-7"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16 2L2 9l14 7 14-7-14-7z" />
              <path d="M2 23l14 7 14-7" />
              <path d="M2 16l14 7 14-7" />
            </svg>
            ShopUI
          </a>

          {/* ── Desktop nav links ───────────────────────────────────── */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href, link.exact);
              return (
                <a
                  key={link.href}
                  href={`#${link.href}`}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    active
                      ? 'text-primary font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-primary'
                      : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* ── Search bar ─────────────────────────────────────────── */}
          <div className="flex-1 max-w-xs hidden sm:block">
            <label htmlFor="nav-search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <input
                id="nav-search"
                type="search"
                value={inputValue}
                onChange={handleSearchInput}
                placeholder="Search…"
                className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* ── Right side: dark mode toggle + cart + user avatar + hamburger ─ */}
          <div className="flex items-center gap-3">
            <DarkModeToggle />

            {/* Cart icon with live badge */}
            <a
              href="#/cart"
              aria-label={`Shopping cart${totalCount > 0 ? `, ${totalCount} item${totalCount !== 1 ? 's' : ''}` : ''}`}
              className="relative p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-150"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] px-0.5 flex items-center justify-center bg-rose-500 text-white text-[0.6rem] font-bold rounded-full pointer-events-none"
                  aria-hidden="true"
                >
                  {totalCount > 99 ? '99+' : totalCount}
                </span>
              )}
            </a>

            <UserDropdown />

            <button
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-150"
            >
              {mobileOpen ? (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <MobileMenu
        links={navLinks}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
