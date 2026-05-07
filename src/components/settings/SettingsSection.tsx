import type { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-300 p-6">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}
