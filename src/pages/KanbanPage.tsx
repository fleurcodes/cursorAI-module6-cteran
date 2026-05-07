import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { ToastProvider } from '../components/ui/ToastProvider';

interface KanbanPageProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function KanbanPage({ searchQuery, onSearchChange }: KanbanPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 flex flex-col">
        <Navbar searchQuery={searchQuery} onSearchChange={onSearchChange} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onMenuClick={() => setSidebarOpen(true)} title="Kanban Board" />

            {/* Mobile sidebar toggle */}
            <div className="lg:hidden px-4 pt-3">
              <button
                type="button"
                aria-label="Open sidebar"
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <main className="flex-1 overflow-hidden" aria-label="Kanban Board">
              <KanbanBoard />
            </main>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
