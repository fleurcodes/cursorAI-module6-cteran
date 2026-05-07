import { useEffect, useRef } from 'react';

interface InfiniteScrollTriggerProps {
  onIntersect: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function InfiniteScrollTrigger({ onIntersect, hasMore, isLoading }: InfiniteScrollTriggerProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onIntersect]);

  if (!hasMore) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm font-medium select-none">
        You're all caught up 🎉
      </div>
    );
  }

  return <div ref={sentinelRef} className="h-4" aria-hidden="true" />;
}
