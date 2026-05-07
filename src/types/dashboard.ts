export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
  tags: string[];
}

export interface StatWidgetData {
  id: string;
  label: string;
  value: number | string;
  change: number;
  changeLabel: string;
  icon: 'tasks' | 'done' | 'progress' | 'overdue';
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

export interface SidebarItem {
  label: string;
  href: string;
  icon: 'dashboard' | 'analytics' | 'kanban' | 'social' | 'settings';
  exact?: boolean;
}
