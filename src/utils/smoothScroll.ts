export interface SmoothScrollOptions {
  /** Pixel offset subtracted from the target position (for sticky headers). Default: 80 */
  offset?: number;
  /** Animation duration in milliseconds. Default: 500 */
  duration?: number;
}

type EasingFn = (t: number) => number;

const easeInOutCubic: EasingFn = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Smoothly scrolls the main window to the element with the given id.
 * Respects `prefers-reduced-motion` and cancels if the user scrolls manually.
 */
export function smoothScrollTo(
  targetId: string,
  { offset = 80, duration = 500 }: SmoothScrollOptions = {},
): void {
  const target = document.getElementById(targetId);
  if (!target) return;

  // Respect user motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Compute values upfront to avoid layout thrashing
  const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
  const startY = window.scrollY;
  const distance = targetTop - startY;

  if (prefersReduced) {
    window.scrollTo(0, targetTop);
    return;
  }

  let startTime: number | null = null;
  let frameId = 0;
  let cancelled = false;

  const cleanup = (): void => {
    window.removeEventListener('wheel', cancelOnUserScroll);
    window.removeEventListener('touchmove', cancelOnUserScroll);
  };

  const cancelOnUserScroll = (): void => {
    cancelled = true;
    cancelAnimationFrame(frameId);
    cleanup();
  };

  window.addEventListener('wheel', cancelOnUserScroll, { passive: true });
  window.addEventListener('touchmove', cancelOnUserScroll, { passive: true });

  const step = (ts: number): void => {
    if (cancelled) return;
    if (startTime === null) startTime = ts;

    const elapsed = ts - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));

    if (progress < 1) {
      frameId = requestAnimationFrame(step);
    } else {
      window.scrollTo(0, targetTop); // exact final position, no drift
      cleanup();
    }
  };

  frameId = requestAnimationFrame(step);
}

/**
 * Attaches a delegated click listener that triggers smooth scroll when the
 * user clicks any element carrying a `data-scroll="<targetId>"` attribute.
 *
 * @returns A cleanup function that removes the listener.
 *
 * @example
 * ```tsx
 * useEffect(() => initSmoothScroll({ offset: 80 }), []);
 * // HTML: <button data-scroll="section1">Go to section 1</button>
 * ```
 */
export function initSmoothScroll(options: SmoothScrollOptions = {}): () => void {
  const onClick = (e: MouseEvent): void => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-scroll]');
    if (!el) return;
    const id = el.dataset.scroll;
    if (!id) return;
    e.preventDefault();
    smoothScrollTo(id, options);
  };

  document.addEventListener('click', onClick);
  return (): void => document.removeEventListener('click', onClick);
}
