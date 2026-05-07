import { useEffect, useRef, useState } from 'react';
import type { Notification } from '../../types/dashboard';

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: '1', message: 'Task "Design mockups" is due today', time: '5m ago', read: false },
  { id: '2', message: 'Alice commented on "API integration"', time: '1h ago', read: false },
  { id: '3', message: 'Sprint planning starts in 30 minutes', time: '2h ago', read: true },
  { id: '4', message: '"Backend fixes" moved to In Review', time: '3h ago', read: true },
];

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export default function Header({ onMenuClick, title }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotifications((n) => n.map((item) => ({ ...item, read: true })));

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-2">

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            aria-haspopup="true"
            aria-expanded={notifOpen}
            onClick={() => { setNotifOpen((v) => !v); }}
            className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" aria-hidden="true" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  Notifications {unreadCount > 0 && <span className="ml-1 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">{unreadCount}</span>}
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-gray-700 max-h-72 overflow-y-auto" role="list">
                {notifications.map((n) => (
                  <li key={n.id} className={`flex gap-3 px-4 py-3 ${n.read ? '' : 'bg-primary/5 dark:bg-primary/10'}`}>
                    <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-primary'}`} aria-hidden="true" />
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{n.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
