import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';

interface AnalyticsPageProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function AnalyticsPage({ searchQuery, onSearchChange }: AnalyticsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 flex flex-col">
      <Navbar searchQuery={searchQuery} onSearchChange={onSearchChange} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} title='Analytics'/>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" aria-label="Analytics dashboard">
            <AnalyticsDashboard />
          </main>
        </div>
      </div>
    </div>
  );
}
