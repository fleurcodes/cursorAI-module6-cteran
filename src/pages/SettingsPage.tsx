import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/dashboard/Sidebar';
import SettingsPanel from '../components/settings/SettingsPanel';
import Header from '../components/dashboard/Header';

interface SettingsPageProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function SettingsPage({
  searchQuery,
  onSearchChange,
}: SettingsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 flex flex-col">
      <Navbar searchQuery={searchQuery} onSearchChange={onSearchChange} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} title='Settings'/>
          <main
            className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
            aria-label="Settings"
          >
            {/* Mobile sidebar toggle */}
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mb-4 p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <SettingsPanel />
          </main>
        </div>
      </div>
    </div>
  );
}
