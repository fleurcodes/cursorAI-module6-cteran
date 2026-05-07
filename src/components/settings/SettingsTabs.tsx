import type { SettingsTab, TabDefinition } from '../../types/settings';

interface SettingsTabsProps {
  tabs: TabDefinition[];
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export default function SettingsTabs({
  tabs,
  activeTab,
  onTabChange,
}: SettingsTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Settings sections"
      className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-700 pb-px mb-6 scrollbar-hide"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 ${
              isActive
                ? 'text-primary border-b-2 border-primary -mb-px bg-transparent'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b-2 border-transparent -mb-px'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
