import type { RatingStarsProps } from '../../types/product';

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
} as const;

const textSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
} as const;

export default function RatingStars({
  rating,
  reviewCount,
  size = 'md',
}: RatingStarsProps) {
  const clampedRating = Math.min(5, Math.max(0, rating));
  const starSize = sizeMap[size];
  const textSize = textSizeMap[size];

  return (
    <div
      className="flex items-center gap-1.5"
      role="img"
      aria-label={`Rating: ${clampedRating.toFixed(1)} out of 5 stars${
        reviewCount !== undefined ? `, ${reviewCount} reviews` : ''
      }`}
    >
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => {
          const fill = Math.min(1, Math.max(0, clampedRating - i));
          // full, partial, or empty
          if (fill >= 1) {
            return (
              <svg
                key={i}
                className={`${starSize} text-amber-400 flex-shrink-0`}
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          }
          if (fill > 0) {
            const pct = Math.round(fill * 100);
            const gradId = `half-${i}`;
            return (
              <svg
                key={i}
                className={`${starSize} flex-shrink-0`}
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={gradId}>
                    <stop offset={`${pct}%`} stopColor="#fbbf24" />
                    <stop offset={`${pct}%`} stopColor="#d1d5db" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#${gradId})`}
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            );
          }
          return (
            <svg
              key={i}
              className={`${starSize} text-gray-300 flex-shrink-0`}
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>

      <span className={`font-semibold text-gray-700 ${textSize}`}>
        {clampedRating.toFixed(1)}
      </span>

      {reviewCount !== undefined && (
        <span className={`text-gray-400 ${textSize}`}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
