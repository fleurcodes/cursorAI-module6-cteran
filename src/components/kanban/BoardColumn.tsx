import { useState } from 'react';
import type { Column, FilterState, Task } from './types';
import ColumnHeader from './ColumnHeader';
import TaskCard from './TaskCard';

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  allColumns: Column[];
  filters: FilterState;
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onRenameColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onMoveTask: (taskId: string, targetColumnId: string) => void;
  // DnD
  onTaskDragStart: (e: React.DragEvent, taskId: string) => void;
  onTaskDragEnd: () => void;
  onColumnDragStart: (e: React.DragEvent, columnId: string) => void;
  onColumnDragEnd: () => void;
  onColumnDragOver: (e: React.DragEvent, columnId: string) => void;
  onColumnDrop: (e: React.DragEvent, columnId: string) => void;
  draggingTaskId: string | null;
  draggingColumnId: string | null;
  isDragOver: boolean;
}

function applyFilter(tasks: Task[], filters: FilterState): Task[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return tasks.filter((t) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const inTitle = t.title.toLowerCase().includes(q);
      const inDesc = t.description?.toLowerCase().includes(q) ?? false;
      if (!inTitle && !inDesc) return false;
    }
    if (filters.priorities.length > 0 && !filters.priorities.includes(t.priority)) return false;
    if (filters.assigneeId && !t.assignees.some((a) => a.id === filters.assigneeId)) return false;
    if (filters.overdueOnly) {
      if (!t.dueDate) return false;
      if (new Date(t.dueDate) >= now) return false;
    }
    return true;
  });
}

export default function BoardColumn({
  column,
  tasks,
  allColumns,
  filters,
  onAddTask,
  onEditTask,
  onRenameColumn,
  onDeleteColumn,
  onMoveTask,
  onTaskDragStart,
  onTaskDragEnd,
  onColumnDragStart,
  onColumnDragEnd,
  onColumnDragOver,
  onColumnDrop,
  draggingTaskId,
  draggingColumnId,
  isDragOver,
}: BoardColumnProps) {
  const [taskDragOverIndex, setTaskDragOverIndex] = useState<number | null>(null);
  const filteredTasks = applyFilter(tasks, filters).sort((a, b) => a.order - b.order);

  const handleTaskDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setTaskDragOverIndex(index);
    onColumnDragOver(e, column.id);
  };

  const handleColumnDrop = (e: React.DragEvent) => {
    setTaskDragOverIndex(null);
    onColumnDrop(e, column.id);
  };

  const columnOptions = allColumns.map((c) => ({ id: c.id, title: c.title }));

  return (
    <div
      className={`flex flex-col w-[280px] min-w-[280px] max-w-[280px] rounded-2xl bg-gray-50 dark:bg-gray-900 border transition-colors duration-150 snap-start ${
        isDragOver && draggingTaskId
          ? 'border-dashed border-2 border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10'
          : 'border-gray-200 dark:border-gray-700'
      } ${draggingColumnId === column.id ? 'opacity-50' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        onColumnDragOver(e, column.id);
      }}
      onDrop={handleColumnDrop}
      aria-dropeffect="move"
    >
      <ColumnHeader
        column={column}
        taskCount={tasks.length}
        onAddTask={() => onAddTask(column.id)}
        onRename={(title) => onRenameColumn(column.id, title)}
        onDelete={() => onDeleteColumn(column.id)}
        canDelete={tasks.length === 0}
        onDragStart={(e) => onColumnDragStart(e, column.id)}
        onDragEnd={onColumnDragEnd}
      />

      {/* Task list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]">
        {filteredTasks.length === 0 ? (
          <div className="flex items-center justify-center h-16 text-sm text-gray-400 dark:text-gray-500 italic">
            {Object.values(filters).some((v) =>
              Array.isArray(v) ? v.length > 0 : Boolean(v)
            )
              ? 'No matching tasks'
              : 'Drop tasks here'}
          </div>
        ) : (
          filteredTasks.map((task, index) => (
            <div key={task.id}>
              {/* Drop indicator */}
              {isDragOver && draggingTaskId && taskDragOverIndex === index && (
                <div className="h-0.5 bg-indigo-500 rounded-full mx-1 mb-1" aria-hidden="true" />
              )}
              <div
                onDragOver={(e) => handleTaskDragOver(e, index)}
              >
                <TaskCard
                  task={task}
                  onEdit={onEditTask}
                  onDragStart={onTaskDragStart}
                  onDragEnd={() => { setTaskDragOverIndex(null); onTaskDragEnd(); }}
                  isDragging={draggingTaskId === task.id}
                  columnOptions={columnOptions}
                  onMoveToColumn={onMoveTask}
                />
              </div>
            </div>
          ))
        )}
        {/* Drop indicator at end */}
        {isDragOver && draggingTaskId && taskDragOverIndex === filteredTasks.length && (
          <div className="h-0.5 bg-indigo-500 rounded-full mx-1" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
