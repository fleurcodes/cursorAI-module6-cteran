export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type ColumnId = string;

export interface Assignee {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  assignees: Assignee[];
  dueDate?: string; // ISO 8601
  columnId: ColumnId;
  createdAt: string;
  order: number;
  tags?: string[];
}

export interface Column {
  id: ColumnId;
  title: string;
  color?: string;
  taskLimit?: number;
}

export interface BoardState {
  columns: Column[];
  tasks: Task[];
}

export interface FilterState {
  search: string;
  priorities: Priority[];
  assigneeId: string;
  overdueOnly: boolean;
}

export const DEFAULT_COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', color: '#6366f1' },
  { id: 'in-progress', title: 'In Progress', color: '#f59e0b', taskLimit: 5 },
  { id: 'in-review', title: 'In Review', color: '#8b5cf6' },
  { id: 'done', title: 'Done', color: '#10b981' },
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design system color tokens',
    description: 'Define the full set of design tokens for light and dark modes.',
    priority: 'high',
    assignees: [{ id: 'u1', name: 'Alice Chen' }],
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday (overdue)
    columnId: 'todo',
    createdAt: new Date().toISOString(),
    order: 0,
    tags: ['design', 'tokens'],
  },
  {
    id: '2',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    priority: 'critical',
    assignees: [{ id: 'u2', name: 'Bob Smith' }, { id: 'u3', name: 'Carol White' }],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    columnId: 'in-progress',
    createdAt: new Date().toISOString(),
    order: 0,
    tags: ['devops'],
  },
  {
    id: '3',
    title: 'Write unit tests for auth module',
    priority: 'medium',
    assignees: [{ id: 'u1', name: 'Alice Chen' }],
    columnId: 'in-progress',
    createdAt: new Date().toISOString(),
    order: 1,
  },
  {
    id: '4',
    title: 'Code review: payment integration',
    description: 'Review and approve the Stripe payment integration PR.',
    priority: 'high',
    assignees: [{ id: 'u4', name: 'David Lee' }],
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    columnId: 'in-review',
    createdAt: new Date().toISOString(),
    order: 0,
    tags: ['payment', 'review'],
  },
  {
    id: '5',
    title: 'Update README documentation',
    priority: 'low',
    assignees: [],
    columnId: 'done',
    createdAt: new Date().toISOString(),
    order: 0,
    tags: ['docs'],
  },
  {
    id: '6',
    title: 'Fix mobile nav overflow bug',
    description: 'The hamburger menu overlaps content on iPhone SE.',
    priority: 'high',
    assignees: [{ id: 'u3', name: 'Carol White' }],
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    columnId: 'todo',
    createdAt: new Date().toISOString(),
    order: 1,
  },
];

export const STORAGE_KEY = 'kanban_board_state';
export const VERSION_KEY = 'kanban_board_version';
export const BOARD_VERSION = '1';

export const COLUMN_COLORS = [
  '#6366f1', '#f59e0b', '#8b5cf6', '#10b981',
  '#ef4444', '#3b82f6', '#ec4899', '#14b8a6',
];

export const EMPTY_FILTER: FilterState = {
  search: '',
  priorities: [],
  assigneeId: '',
  overdueOnly: false,
};
