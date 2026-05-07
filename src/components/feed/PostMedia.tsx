interface PostMediaProps {
  mediaUrl: string;
  altText?: string;
}

export default function PostMedia({ mediaUrl, altText = 'Post image' }: PostMediaProps) {
  return (
    <div className="rounded-xl overflow-hidden aspect-video bg-gray-100 dark:bg-gray-700 mt-3">
      <img
        src={mediaUrl}
        alt={altText}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
