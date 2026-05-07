import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BOARD_VERSION,
  COLUMN_COLORS,
  DEFAULT_COLUMNS,
  DEFAULT_TASKS,
  EMPTY_FILTER,
  STORAGE_KEY,
  VERSION_KEY,
  type BoardState,
  type Column,
  type FilterState,
  type Task,
} from './types';
import BoardHeader from './BoardHeader';
import BoardFilters from './BoardFilters';
import BoardColumn from './BoardColumn';
import TaskModal from './TaskModal';
import { useToast } from '../ui/ToastProvider';

// ─── Storage helpers ────────────────────────────────────────────────────────

function loadState(): BoardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { columns: DEFAULT_COLUMNS, tasks: DEFAULT_TASKS };

    const version = localStorage.getItem(VERSION_KEY);
    if (version !== BOARD_VERSION) {
      console.warn('[KanbanBoard] Version mismatch — using defaults');
      return { columns: DEFAULT_COLUMNS, tasks: DEFAULT_TASKS };
    }

    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !Array.isArray((parsed as BoardState).columns) ||
      !Array.isArray((parsed as BoardState).tasks)
    ) {
      throw new Error('Invalid shape');
    }
    return parsed as BoardState;
  } catch {
    console.warn('[KanbanBoard] Failed to load state — using defaults');
    return { columns: DEFAULT_COLUMNS, tasks: DEFAULT_TASKS };
  }
}

function saveState(state: BoardState): void {
  localStorage.setItem(VERSION_KEY, BOARD_VERSION);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ─── Active filter count ─────────────────────────────────────────────────────

function countActiveFilters(f: FilterState): number {
  let n = 0;
  if (f.search) n++;
  if (f.priorities.length > 0) n++;
  if (f.assigneeId) n++;
  if (f.overdueOnly) n++;
  return n;
}

// ─── Component ───────────────────────────────────────────────────────────────

type ModalState =
  | { open: false }
  | { open: true; mode: 'create'; defaultColumnId: string }
  | { open: true; mode: 'edit'; task: Task };

export default function KanbanBoard() {
  const { showToast } = useToast();
  const showToastOnMount = useRef(false);
  const [board, setBoard] = useState<BoardState>(() => {
    const s = loadState();
    return s;
  });

  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false });

  // DnD state
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  // Persist on every board change
  useEffect(() => {
    saveState(board);
  }, [board]);

  // ─── Column operations ─────────────────────────────────────────────────────

  const addColumn = useCallback((title: string, color: string) => {
    const id = crypto.randomUUID();
    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, { id, title, color }],
    }));
    showToast(`Column "${title}" added`, 'success');
  }, [showToast]);

  const renameColumn = useCallback((columnId: string, title: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((c) => c.id === columnId ? { ...c, title } : c),
    }));
  }, []);

  const deleteColumn = useCallback((columnId: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.filter((c) => c.id !== columnId),
    }));
    showToast('Column deleted', 'info');
  }, [showToast]);

  const resetBoard = useCallback(() => {
    const fresh: BoardState = { columns: DEFAULT_COLUMNS, tasks: DEFAULT_TASKS };
    setBoard(fresh);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VERSION_KEY);
    showToast('Board reset to defaults', 'info');
  }, [showToast]);

  // ─── Task operations ───────────────────────────────────────────────────────

  const saveTask = useCallback((task: Task) => {
    setBoard((prev) => {
      const exists = prev.tasks.some((t) => t.id === task.id);
      if (exists) {
        showToast('Task updated', 'success');
        return { ...prev, tasks: prev.tasks.map((t) => t.id === task.id ? task : t) };
      }
      // Calculate order: append at end of column
      const colTasks = prev.tasks.filter((t) => t.columnId === task.columnId);
      const order = colTasks.length > 0 ? Math.max(...colTasks.map((t) => t.order)) + 1 : 0;
      showToast('Task created', 'success');
      return { ...prev, tasks: [...prev.tasks, { ...task, order }] };
    });
    setModal({ open: false });
  }, [showToast]);

  const deleteTask = useCallback((taskId: string) => {
    setBoard((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== taskId) }));
    setModal({ open: false });
    showToast('Task deleted', 'info');
  }, [showToast]);

  const moveTask = useCallback((taskId: string, targetColumnId: string) => {
    setBoard((prev) => {
      const col = prev.columns.find((c) => c.id === targetColumnId);
      const colTasks = prev.tasks.filter((t) => t.columnId === targetColumnId);
      if (col?.taskLimit !== undefined && colTasks.length >= col.taskLimit) {
        showToast('Column is at WIP limit', 'warning');
        return prev;
      }
      const order = colTasks.length > 0 ? Math.max(...colTasks.map((t) => t.order)) + 1 : 0;
      return {
        ...prev,
        tasks: prev.tasks.map((t) => t.id === taskId ? { ...t, columnId: targetColumnId, order } : t),
      };
    });
  }, [showToast]);

  // ─── Drag & Drop ──────────────────────────────────────────────────────────

  const handleTaskDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingTaskId(taskId);
  }, []);

  const handleColumnDragStart = useCallback((e: React.DragEvent, columnId: string) => {
    e.dataTransfer.setData('columnId', columnId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingColumnId(columnId);
  }, []);

  const handleColumnDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumnId(columnId);
  }, []);

  const handleColumnDrop = useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    setDragOverColumnId(null);

    const taskId = e.dataTransfer.getData('taskId');
    const colId = e.dataTransfer.getData('columnId');

    if (taskId) {
      // Drop task into column
      setBoard((prev) => {
        const task = prev.tasks.find((t) => t.id === taskId);
        if (!task) return prev;
        const targetCol = prev.columns.find((c) => c.id === targetColumnId);
        const colTasks = prev.tasks.filter((t) => t.columnId === targetColumnId && t.id !== taskId);
        if (targetCol?.taskLimit !== undefined && colTasks.length >= targetCol.taskLimit) {
          showToast('Column is at WIP limit', 'warning');
          return prev;
        }
        const order = colTasks.length > 0 ? Math.max(...colTasks.map((t) => t.order)) + 1 : 0;
        return {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === taskId ? { ...t, columnId: targetColumnId, order } : t,
          ),
        };
      });
      setDraggingTaskId(null);
    } else if (colId && colId !== targetColumnId) {
      // Reorder columns
      setBoard((prev) => {
        const cols = [...prev.columns];
        const fromIdx = cols.findIndex((c) => c.id === colId);
        const toIdx = cols.findIndex((c) => c.id === targetColumnId);
        if (fromIdx === -1 || toIdx === -1) return prev;
        const [removed] = cols.splice(fromIdx, 1);
        cols.splice(toIdx, 0, removed);
        return { ...prev, columns: cols };
      });
      setDraggingColumnId(null);
    }
  }, [showToast]);

  // ─── Filter helpers ───────────────────────────────────────────────────────

  const activeFilterCount = countActiveFilters(filters);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      <BoardHeader
        onAddColumn={addColumn}
        onResetBoard={resetBoard}
        filterCount={activeFilterCount}
        filtersVisible={filtersVisible}
        onToggleFilters={() => setFiltersVisible((v) => !v)}
      />

      {filtersVisible && (
        <BoardFilters
          filters={filters}
          onChange={setFilters}
          activeCount={activeFilterCount}
          onClear={() => setFilters(EMPTY_FILTER)}
        />
      )}

      {/* Board columns */}
      <div
        className="flex-1 overflow-x-auto overflow-y-hidden"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex gap-4 p-4 h-full min-h-0" style={{ alignItems: 'flex-start' }}>
          {board.columns.map((col) => {
            const colTasks = board.tasks.filter((t) => t.columnId === col.id);
            return (
              <BoardColumn
                key={col.id}
                column={col}
                tasks={colTasks}
                allColumns={board.columns}
                filters={filters}
                onAddTask={(cid) => setModal({ open: true, mode: 'create', defaultColumnId: cid })}
                onEditTask={(task) => setModal({ open: true, mode: 'edit', task })}
                onRenameColumn={renameColumn}
                onDeleteColumn={deleteColumn}
                onMoveTask={moveTask}
                onTaskDragStart={handleTaskDragStart}
                onTaskDragEnd={() => setDraggingTaskId(null)}
                onColumnDragStart={handleColumnDragStart}
                onColumnDragEnd={() => setDraggingColumnId(null)}
                onColumnDragOver={handleColumnDragOver}
                onColumnDrop={handleColumnDrop}
                draggingTaskId={draggingTaskId}
                draggingColumnId={draggingColumnId}
                isDragOver={dragOverColumnId === col.id}
              />
            );
          })}
        </div>
      </div>

      {/* Task modal */}
      {modal.open && (
        <TaskModal
          mode={modal.mode}
          task={modal.mode === 'edit' ? modal.task : undefined}
          defaultColumnId={modal.mode === 'create' ? modal.defaultColumnId : modal.task.columnId}
          columns={board.columns}
          onSave={saveTask}
          onDelete={modal.mode === 'edit' ? deleteTask : undefined}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  );
}
