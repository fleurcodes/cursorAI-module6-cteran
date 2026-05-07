import { ToastProvider } from '../components/ui/ToastProvider';
import Feed from '../components/feed/Feed';

export default function SocialFeed() {
  return (
    <ToastProvider>
      <main
        className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
        aria-label="Social Feed"
      >
        <Feed />
      </main>
    </ToastProvider>
  );
}
