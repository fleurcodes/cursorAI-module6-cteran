import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import TaskCard from '../components/dashboard/TaskCard';
import StatWidget from '../components/dashboard/StatWidget';
import type { Task, StatWidgetData } from '../types/dashboard';

const STATS: StatWidgetData[] = [
  { id: 's1', label: 'Total Tasks',    value: 24, change: 12,  changeLabel: 'vs last week', icon: 'tasks' },
  { id: 's2', label: 'Completed',      value: 14, change: 8,   changeLabel: 'vs last week', icon: 'done' },
  { id: 's3', label: 'In Progress',    value: 7,  change: -3,  changeLabel: 'vs last week', icon: 'progress' },
  { id: 's4', label: 'Overdue',        value: 3,  change: -15, changeLabel: 'vs last week', icon: 'overdue' },
];

const TASKS: Task[] = [
  {
    id: 't1',
    title: 'Design system update',
    description: 'Revamp the component library with new tokens and accessibility improvements.',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Alice Kim',
    dueDate: 'Apr 30',
    tags: ['design', 'a11y'],
  },
  {
    id: 't2',
    title: 'API integration for payments',
    description: 'Connect the checkout flow to the new Stripe v3 endpoints.',
    priority: 'critical',
    status: 'todo',
    assignee: 'Bob Chen',
    dueDate: 'May 2',
    tags: ['backend', 'payments'],
  },
  {
    id: 't3',
    title: 'Write unit tests for auth module',
    description: 'Achieve 90 % coverage on the authentication utilities.',
    priority: 'medium',
    status: 'review',
    assignee: 'Carol Wu',
    dueDate: 'May 5',
    tags: ['testing'],
  },
  {
    id: 't4',
    title: 'Onboarding email sequence',
    description: 'Create and schedule the 3-part welcome email series in Mailchimp.',
    priority: 'low',
    status: 'done',
    assignee: 'Dan Park',
    dueDate: 'Apr 28',
    tags: ['marketing'],
  },
  {
    id: 't5',
    title: 'Performance audit',
    description: 'Run Lighthouse on all public pages and address scores below 90.',
    priority: 'medium',
    status: 'todo',
    assignee: 'Alice Kim',
    dueDate: 'May 7',
    tags: ['performance'],
  },
  {
    id: 't6',
    title: 'Mobile nav bug fix',
    description: 'Fix the hamburger menu not closing on route change on iOS Safari.',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Bob Chen',
    dueDate: 'May 1',
    tags: ['bug', 'mobile'],
  },
];

interface DashboardProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Dashboard({ searchQuery, onSearchChange }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 flex flex-col">
      {/* Top navbar (shared with the rest of the app) */}
      <Navbar searchQuery={searchQuery} onSearchChange={onSearchChange} />

      {/* Below navbar: sidebar + main area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main column */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} title='Dashboard'/>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {/* Stats row */}
            <section aria-label="Statistics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {STATS.map((stat) => (
                <StatWidget key={stat.id} data={stat} />
              ))}
            </section>

            {/* Task cards */}
            <section aria-label="Tasks">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">All Tasks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {TASKS.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
