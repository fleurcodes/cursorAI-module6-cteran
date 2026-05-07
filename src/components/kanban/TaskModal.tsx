import { useEffect, useId, useRef, useState } from 'react';
import type { Assignee, Column, Priority, Task } from './types';
import { TEAM_MEMBERS } from '../../constants/teamMembers';

interface TaskModalProps {
  mode: 'create' | 'edit';
  task?: Task;
  defaultColumnId: string;
  columns: Column[];
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onClose: () => void;
}

const PRIORITY_OPTIONS: Priority[] = ['low', 'medium', 'high', 'critical'];

function initials(name: string): string {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

const BG_COLORS = ['bg-indigo-500','bg-pink-500','bg-teal-500','bg-amber-500','bg-rose-500','bg-violet-500'];
function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h += id.charCodeAt(i);
  return BG_COLORS[h % BG_COLORS.length];
}

export default function TaskModal({
  mode,
  task,
  defaultColumnId,
  columns,
  onSave,
  onDelete,
  onClose,
}: TaskModalProps) {
  const titleId = useId();
  const titleErrId = useId();
  const descErrId = useId();

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium');
  const [assignees, setAssignees] = useState<Assignee[]>(task?.assignees ?? []);
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');
  const [tags, setTags] = useState((task?.tags ?? []).join(', '));
  const [columnId, setColumnId] = useState(task?.columnId ?? defaultColumnId);
  const [dirty, setDirty] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLInputElement>(null);

  // Mark dirty
  useEffect(() => {
    if (mode === 'create' && (title || description || dueDate || tags)) setDirty(true);
    if (mode === 'edit') setDirty(true);
  }, [title, description, priority, assignees, dueDate, tags, columnId, mode]);

  // Focus trap
  useEffect(() => {
    firstFocusRef.current?.focus();
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button,input,select,textarea,[tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled'));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { handleClose(); return; }
      if (e.key !== 'Tab') return;
      const els = focusable();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    dialog.addEventListener('keydown', handleKeyDown);
    return () => dialog.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    if (dirty && mode === 'create' && title.trim() === '' && !description && !dueDate) {
      onClose();
      return;
    }
    if (dirty) {
      setShowUnsaved(true);
      return;
    }
    onClose();
  };

  const toggleAssignee = (id: string) => {
    const member = TEAM_MEMBERS.find((m) => m.id === id);
    if (!member) return;
    setAssignees((prev) =>
      prev.find((a) => a.id === id)
        ? prev.filter((a) => a.id !== id)
        : [...prev, { id: member.id, name: member.name, avatarUrl: member.avatarUrl }],
    );
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const saved: Task = {
      id: task?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      assignees,
      dueDate: dueDate || undefined,
      columnId,
      createdAt: task?.createdAt ?? new Date().toISOString(),
      order: task?.order ?? 0,
      tags: parsedTags.length > 0 ? parsedTags : undefined,
    };
    onSave(saved);
  };

  const isValid = title.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transition-all duration-200"
        style={{ animation: 'modalIn 200ms ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 id={titleId} className="text-base font-bold text-gray-800 dark:text-gray-100">
            {mode === 'create' ? 'Create Task' : 'Edit Task'}
          </h2>
          <div className="flex items-center gap-2">
            {mode === 'edit' && onDelete && task && (
              <button
                onClick={() => onDelete(task.id)}
                className="px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Delete
              </button>
            )}
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Unsaved warning */}
          {showUnsaved && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 p-3 flex items-center justify-between gap-3">
              <span className="text-sm text-amber-800 dark:text-amber-300">Discard unsaved changes?</span>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-2.5 py-1 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  Discard
                </button>
                <button
                  onClick={() => setShowUnsaved(false)}
                  className="px-2.5 py-1 text-xs font-semibold border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  Keep editing
                </button>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor={`${titleId}-input`} className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Title <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              ref={firstFocusRef}
              id={`${titleId}-input`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="Task title…"
              aria-required="true"
              aria-describedby={!isValid && title.length > 0 ? titleErrId : undefined}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            />
            <div className="flex justify-between mt-0.5">
              {!isValid && title.length > 0 ? (
                <span id={titleErrId} role="alert" className="text-xs text-red-500">Title is required</span>
              ) : (
                <span />
              )}
              <span className={`text-xs ml-auto ${title.length >= 110 ? 'text-amber-500' : 'text-gray-400'}`}>
                {title.length}/120
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor={`${titleId}-desc`} className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id={`${titleId}-desc`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Optional description…"
              aria-describedby={description.length >= 490 ? descErrId : undefined}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 resize-none"
            />
            <div className="flex justify-end mt-0.5">
              <span id={descErrId} className={`text-xs ${description.length >= 490 ? 'text-amber-500' : 'text-gray-400'}`}>
                {description.length}/500
              </span>
            </div>
          </div>

          {/* Priority & Column */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${titleId}-priority`} className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                id={`${titleId}-priority`}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${titleId}-column`} className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Column
              </label>
              <select
                id={`${titleId}-column`}
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {columns.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor={`${titleId}-due`} className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              id={`${titleId}-due`}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor={`${titleId}-tags`} className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
            </label>
            <input
              id={`${titleId}-tags`}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="design, frontend, bug…"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            />
          </div>

          {/* Assignees */}
          <div>
            <fieldset>
              <legend className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                Assignees
              </legend>
              <div className="flex flex-wrap gap-2" role="group">
                {TEAM_MEMBERS.map((m) => {
                  const selected = assignees.some((a) => a.id === m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleAssignee(m.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        selected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${colorFor(m.id)}`}>
                        {initials(m.name)}
                      </div>
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            aria-disabled={!isValid}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {mode === 'create' ? 'Create Task' : 'Save Changes'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(-8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  );
}
