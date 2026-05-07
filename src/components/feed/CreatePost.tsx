import { useRef, useState } from 'react';
import type { NewPostDraft } from './types';
import { CURRENT_USER } from './types';
import UserAvatar from './UserAvatar';

interface CreatePostProps {
  onSubmit: (draft: NewPostDraft) => Promise<void>;
}

const MAX_CHARS = 280;
const WARN_AT = 260;

export default function CreatePost({ onSubmit }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEmpty = !content.trim() && !mediaPreviewUrl;
  const charsLeft = MAX_CHARS - content.length;
  const isOverWarn = content.length >= WARN_AT;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMediaPreviewUrl(url);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ content: content.trim(), mediaPreviewUrl });
      setContent('');
      setMediaPreviewUrl(undefined);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-md p-4 sticky top-20 z-10">
      <form onSubmit={handleSubmit} aria-label="Create a new post">
        <div className="flex gap-3">
          <UserAvatar author={CURRENT_USER} size="md" />

          <div className="flex-1 min-w-0 space-y-3">
            {/* Textarea */}
            <div>
              <label htmlFor="create-post-textarea" className="sr-only">
                What's on your mind?
              </label>
              <textarea
                id="create-post-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                maxLength={MAX_CHARS}
                rows={content.length > 80 ? 4 : 2}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150"
              />
              {content.length > 0 && (
                <p
                  className={`text-xs mt-1 text-right font-medium ${isOverWarn ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {charsLeft} characters remaining
                </p>
              )}
            </div>

            {/* Image preview */}
            {mediaPreviewUrl && (
              <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={mediaPreviewUrl}
                  alt="Attached image preview"
                  className="w-full max-h-64 object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove attached image"
                  onClick={() => setMediaPreviewUrl(undefined)}
                  className="absolute top-2 right-2 bg-gray-900/60 hover:bg-gray-900/80 text-white rounded-full p-1 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Action row */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                aria-label="Attach image"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
                aria-hidden="true"
                tabIndex={-1}
              />

              <button
                type="submit"
                disabled={isEmpty || submitting}
                aria-disabled={isEmpty || submitting}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 min-w-[72px] justify-center"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Posting…</span>
                  </>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
