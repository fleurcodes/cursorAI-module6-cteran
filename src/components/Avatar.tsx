interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-12 h-12 text-lg',
  md: 'w-20 h-20 text-2xl',
  lg: 'w-28 h-28 text-4xl',
};

export default function Avatar({ src, alt, size = 'lg' }: AvatarProps) {
  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden ring-4 ring-white shadow-md flex-shrink-0`}
      role="img"
      aria-label={alt}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
