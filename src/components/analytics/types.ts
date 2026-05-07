export interface KPIData {
  id: string;
  label: string;
  value: string | number;
  previousValue: string | number;
  change: number; // percentage change, positive = up, negative = down
  trend: 'up' | 'down' | 'neutral';
  unit?: string; // e.g. '$', '%', 'k'
  icon: 'sales' | 'users' | 'conversion' | 'revenue';
}

export interface FiltersState {
  startDate: string;
  endDate: string;
  category: string;
  status: 'active' | 'inactive' | 'all';
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: ChartDataPoint[];
  unit?: string;
}

export interface TableRow {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive';
  sales: number;
  revenue: number;
  growth: number;
  date: string;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: keyof TableRow | null;
  direction: SortDirection;
}

export interface SelectOption {
  value: string;
  label: string;
}
