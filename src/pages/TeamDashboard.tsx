import { useState, useCallback } from 'react';
import Navbar from '../components/layout/Navbar';
import ProjectOverview from '../components/TeamDashboard/ProjectOverview';
import TeamMembers from '../components/TeamDashboard/TeamMembers';
import ProgressChart from '../components/TeamDashboard/ProgressChart';
import ActivityFeed from '../components/TeamDashboard/ActivityFeed';
import QuickActions from '../components/TeamDashboard/QuickActions';
import ProjectCard from '../components/TeamDashboard/ProjectCard';
import {
  CreateTaskModal,
  AddMemberModal,
  ReportModal,
  ScheduleMeetingModal,
} from '../components/TeamDashboard/DashboardModals';
import type { TeamMember, MemberRole } from '../components/types/team';
import type { Project } from '../components/types/project';
import type { Activity } from '../components/types/activity';

// ── Seed data ──────────────────────────────────────────────────────────────

const INITIAL_MEMBERS: TeamMember[] = [
  { id: 'm1', name: 'Alice Chen', role: 'manager', avatarUrl: '', status: 'online', email: 'alice@example.com', tasksCompleted: 24, tasksInProgress: 3 },
  { id: 'm2', name: 'Bob Garcia', role: 'developer', avatarUrl: '', status: 'online', email: 'bob@example.com', tasksCompleted: 18, tasksInProgress: 5 },
  { id: 'm3', name: 'Clara Lee', role: 'designer', avatarUrl: '', status: 'away', email: 'clara@example.com', tasksCompleted: 12, tasksInProgress: 2 },
  { id: 'm4', name: 'David Kim', role: 'developer', avatarUrl: '', status: 'offline', email: 'david@example.com', tasksCompleted: 9, tasksInProgress: 1 },
  { id: 'm5', name: 'Eva Patel', role: 'qa', avatarUrl: '', status: 'online', email: 'eva@example.com', tasksCompleted: 31, tasksInProgress: 4 },
  { id: 'm6', name: 'Frank Ramos', role: 'admin', avatarUrl: '', status: 'away', email: 'frank@example.com', tasksCompleted: 7, tasksInProgress: 0 },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'ShopUI Redesign',
    description: 'Revamp the product catalogue, checkout flow, and dashboard with a modern component system.',
    status: 'on-track',
    progress: 68,
    totalTasks: 50,
    completedTasks: 34,
    inProgressTasks: 11,
    overdueTasks: 2,
    startDate: 'Mar 1, 2026',
    endDate: 'Jun 15, 2026',
    milestones: [
      { id: 'ms1', title: 'Design System Complete', dueDate: 'Apr 1, 2026', status: 'completed' },
      { id: 'ms2', title: 'Frontend Alpha', dueDate: 'May 15, 2026', status: 'in-progress' },
      { id: 'ms3', title: 'Beta Launch', dueDate: 'Jun 1, 2026', status: 'upcoming' },
      { id: 'ms4', title: 'Production Release', dueDate: 'Jun 15, 2026', status: 'upcoming' },
    ],
    teamMemberIds: ['m1', 'm2', 'm3', 'm5'],
  },
  {
    id: 'p2',
    name: 'Analytics Platform',
    description: 'Build real-time analytics dashboards and reporting tools for business intelligence.',
    status: 'at-risk',
    progress: 42,
    totalTasks: 38,
    completedTasks: 16,
    inProgressTasks: 8,
    overdueTasks: 5,
    startDate: 'Feb 10, 2026',
    endDate: 'May 30, 2026',
    milestones: [
      { id: 'ms5', title: 'Data Pipeline', dueDate: 'Mar 20, 2026', status: 'completed' },
      { id: 'ms6', title: 'Chart Library Integration', dueDate: 'Apr 30, 2026', status: 'in-progress' },
      { id: 'ms7', title: 'Dashboard MVP', dueDate: 'May 30, 2026', status: 'upcoming' },
    ],
    teamMemberIds: ['m2', 'm4', 'm5'],
  },
  {
    id: 'p3',
    name: 'Mobile App',
    description: 'Native iOS & Android companion app for the ShopUI ecosystem.',
    status: 'delayed',
    progress: 15,
    totalTasks: 60,
    completedTasks: 9,
    inProgressTasks: 6,
    overdueTasks: 8,
    startDate: 'Apr 1, 2026',
    endDate: 'Aug 31, 2026',
    milestones: [
      { id: 'ms8', title: 'Architecture Planning', dueDate: 'Apr 20, 2026', status: 'completed' },
      { id: 'ms9', title: 'Core Features', dueDate: 'Jun 30, 2026', status: 'upcoming' },
      { id: 'ms10', title: 'App Store Submission', dueDate: 'Aug 31, 2026', status: 'upcoming' },
    ],
    teamMemberIds: ['m1', 'm3', 'm6'],
  },
];

const WEEKLY_DATA_BY_PROJECT: Record<string, number[]> = {
  p1: [5, 8, 6, 9, 7, 3, 2],
  p2: [3, 4, 5, 3, 6, 2, 1],
  p3: [1, 2, 1, 3, 2, 1, 0],
};

function nowMinus(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'a1', type: 'task_completed', userId: 'm2', userName: 'Bob Garcia', userAvatarUrl: '', description: 'Completed "Product card hover animation"', timestamp: nowMinus(8), projectId: 'p1', projectName: 'ShopUI Redesign' },
  { id: 'a2', type: 'milestone_reached', userId: 'm1', userName: 'Alice Chen', userAvatarUrl: '', description: 'Milestone "Design System Complete" reached', timestamp: nowMinus(35), projectId: 'p1', projectName: 'ShopUI Redesign' },
  { id: 'a3', type: 'comment', userId: 'm5', userName: 'Eva Patel', userAvatarUrl: '', description: 'Left a comment on "Checkout page validation"', timestamp: nowMinus(62), projectId: 'p1', projectName: 'ShopUI Redesign' },
  { id: 'a4', type: 'task_created', userId: 'm4', userName: 'David Kim', userAvatarUrl: '', description: 'Created task "Set up Kafka consumer"', timestamp: nowMinus(120), projectId: 'p2', projectName: 'Analytics Platform' },
  { id: 'a5', type: 'meeting_scheduled', userId: 'm1', userName: 'Alice Chen', userAvatarUrl: '', description: 'Scheduled sprint planning for May 9', timestamp: nowMinus(180), projectId: 'p1', projectName: 'ShopUI Redesign' },
  { id: 'a6', type: 'file_uploaded', userId: 'm3', userName: 'Clara Lee', userAvatarUrl: '', description: 'Uploaded "mobile-wireframes-v3.fig"', timestamp: nowMinus(240), projectId: 'p3', projectName: 'Mobile App' },
  { id: 'a7', type: 'member_added', userId: 'm6', userName: 'Frank Ramos', userAvatarUrl: '', description: 'Added Eva Patel to Analytics Platform', timestamp: nowMinus(360), projectId: 'p2', projectName: 'Analytics Platform' },
];

// ── Component ──────────────────────────────────────────────────────────────

type ActiveModal = 'create-task' | 'add-member' | 'report' | 'schedule-meeting' | null;

export default function TeamDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('p1');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [weeklyData, setWeeklyData] = useState<Record<string, number[]>>(WEEKLY_DATA_BY_PROJECT);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? projects[0];
  const closeModal = useCallback(() => setActiveModal(null), []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCompleteTask = useCallback(() => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== selectedProjectId) return p;
        const newCompleted = p.completedTasks + 1;
        const newInProgress = Math.max(0, p.inProgressTasks - 1);
        const newProgress = Math.round((newCompleted / p.totalTasks) * 100);
        return { ...p, completedTasks: newCompleted, inProgressTasks: newInProgress, progress: newProgress };
      })
    );
    // Increment today's slot (index 6) in the weekly bar chart
    setWeeklyData((prev) => {
      const current = prev[selectedProjectId] ?? [0, 0, 0, 0, 0, 0, 0];
      const updated = [...current];
      updated[6] = updated[6] + 1;
      return { ...prev, [selectedProjectId]: updated };
    });
    const newActivity: Activity = {
      id: `a-${Date.now()}`,
      type: 'task_completed',
      userId: 'm1',
      userName: 'You',
      userAvatarUrl: '',
      description: 'Marked a task as complete',
      timestamp: new Date().toISOString(),
      projectId: selectedProjectId,
      projectName: selectedProject.name,
    };
    setActivities((prev) => [newActivity, ...prev]);
  }, [selectedProjectId, selectedProject.name]);

  const handleTaskSubmit = useCallback(
    (title: string, assigneeId: string, _priority: string) => {
      const assignee = members.find((m) => m.id === assigneeId);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProjectId
            ? { ...p, totalTasks: p.totalTasks + 1, inProgressTasks: p.inProgressTasks + 1 }
            : p
        )
      );
      const newActivity: Activity = {
        id: `a-${Date.now()}`,
        type: 'task_created',
        userId: assigneeId,
        userName: assignee?.name ?? 'You',
        userAvatarUrl: '',
        description: `Created task "${title}"`,
        timestamp: new Date().toISOString(),
        projectId: selectedProjectId,
        projectName: selectedProject.name,
      };
      setActivities((prev) => [newActivity, ...prev]);
      closeModal();
    },
    [members, selectedProjectId, selectedProject.name, closeModal]
  );

  const handleMemberSubmit = useCallback(
    (name: string, email: string, role: MemberRole) => {
      const newMember: TeamMember = {
        id: `m-${Date.now()}`,
        name,
        role,
        avatarUrl: '',
        status: 'online',
        email,
        tasksCompleted: 0,
        tasksInProgress: 0,
      };
      setMembers((prev) => [...prev, newMember]);
      const newActivity: Activity = {
        id: `a-${Date.now()}`,
        type: 'member_added',
        userId: newMember.id,
        userName: 'You',
        userAvatarUrl: '',
        description: `Added ${name} to the team`,
        timestamp: new Date().toISOString(),
      };
      setActivities((prev) => [newActivity, ...prev]);
      closeModal();
    },
    [closeModal]
  );

  const handleMeetingSubmit = useCallback(
    (date: string, time: string, _agenda: string, attendeeIds: string[]) => {
      const attendeeNames = members
        .filter((m) => attendeeIds.includes(m.id))
        .map((m) => m.name.split(' ')[0])
        .join(', ');
      const newActivity: Activity = {
        id: `a-${Date.now()}`,
        type: 'meeting_scheduled',
        userId: 'm1',
        userName: 'You',
        userAvatarUrl: '',
        description: `Scheduled a meeting on ${date} at ${time} with ${attendeeNames}`,
        timestamp: new Date().toISOString(),
        projectId: selectedProjectId,
        projectName: selectedProject.name,
      };
      setActivities((prev) => [newActivity, ...prev]);
      closeModal();
    },
    [members, selectedProjectId, selectedProject.name, closeModal]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Site-wide navigation */}
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Page sub-header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {members.filter((m) => m.status === 'online').length} of {members.length} members online
            </p>
          </div>
          <div className="flex items-center gap-2">
            {members.slice(0, 6).map((m) => (
              <div key={m.id} className="relative flex-shrink-0" title={`${m.name} — ${m.status}`}>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold ring-2 ring-white dark:ring-gray-900">
                  {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-gray-900 ${
                    m.status === 'online' ? 'bg-green-400' : m.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Project selector */}
        <section className="mb-6" aria-label="Project selector">
          <h2 className="sr-only">Select project</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isSelected={project.id === selectedProjectId}
                onClick={() => setSelectedProjectId(project.id)}
              />
            ))}
          </div>
        </section>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column: Overview + Chart */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ProjectOverview project={selectedProject} onCompleteTask={handleCompleteTask} />
            <ProgressChart
              project={selectedProject}
              weeklyData={weeklyData[selectedProjectId] ?? [0, 0, 0, 0, 0, 0, 0]}
            />
          </div>

          {/* Right column: Quick Actions + Team + Feed */}
          <div className="flex flex-col gap-6">
            <QuickActions
              onCreateTask={() => setActiveModal('create-task')}
              onAddMember={() => setActiveModal('add-member')}
              onGenerateReport={() => setActiveModal('report')}
              onScheduleMeeting={() => setActiveModal('schedule-meeting')}
            />
            <TeamMembers members={members} onAddMember={() => setActiveModal('add-member')} />
            <ActivityFeed activities={activities} maxVisible={10} />
          </div>

        </div>
      </main>

      {/* Modals */}
      {activeModal === 'create-task' && (
        <CreateTaskModal
          members={members}
          projectName={selectedProject.name}
          onClose={closeModal}
          onSubmit={handleTaskSubmit}
        />
      )}
      {activeModal === 'add-member' && (
        <AddMemberModal onClose={closeModal} onSubmit={handleMemberSubmit} />
      )}
      {activeModal === 'report' && (
        <ReportModal
          report={{
            name: selectedProject.name,
            status: selectedProject.status,
            progress: selectedProject.progress,
            totalTasks: selectedProject.totalTasks,
            completedTasks: selectedProject.completedTasks,
            inProgressTasks: selectedProject.inProgressTasks,
            overdueTasks: selectedProject.overdueTasks,
            startDate: selectedProject.startDate,
            endDate: selectedProject.endDate,
          }}
          onClose={closeModal}
        />
      )}
      {activeModal === 'schedule-meeting' && (
        <ScheduleMeetingModal
          members={members}
          projectName={selectedProject.name}
          onClose={closeModal}
          onSubmit={handleMeetingSubmit}
        />
      )}
    </div>
  );
}
