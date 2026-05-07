import { useEffect } from 'react';
import type { AppearanceSettings as AppearanceSettingsType } from '../../types/settings';
import SettingsSection from './SettingsSection';
import SelectDropdown from './SelectDropdown';

interface AppearanceSettingsProps {
  data: AppearanceSettingsType;
  onChange: (updated: AppearanceSettingsType) => void;
}

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System default' },
];

const DENSITY_OPTIONS = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
];

function applyTheme(theme: AppearanceSettingsType['theme']): void {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', 'system');
  }
}

export default function AppearanceSettings({
  data,
  onChange,
}: AppearanceSettingsProps) {
  // Sync theme whenever the appearance data changes
  useEffect(() => {
    applyTheme(data.theme);
  }, [data.theme]);

  const handleThemeChange = (value: string) => {
    const theme = value as AppearanceSettingsType['theme'];
    onChange({ ...data, theme });
  };

  const handleDensityChange = (value: string) => {
    onChange({ ...data, density: value as AppearanceSettingsType['density'] });
  };

  return (
    <div
      id="tabpanel-appearance"
      role="tabpanel"
      aria-labelledby="tab-appearance"
      className="flex flex-col gap-6"
    >
      <SettingsSection
        title="Theme"
        description="Choose the color scheme for the interface."
      >
        <SelectDropdown
          id="appearance-theme"
          label="Color Theme"
          value={data.theme}
          options={THEME_OPTIONS}
          onChange={handleThemeChange}
          description="Selecting 'System default' follows your OS preference."
        />

        {/* Visual theme preview */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleThemeChange(opt.value)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                data.theme === opt.value
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              aria-pressed={data.theme === opt.value}
              aria-label={`Select ${opt.label} theme`}
            >
              <div
                className={`w-full h-8 rounded-md ${
                  opt.value === 'light'
                    ? 'bg-white border border-gray-200'
                    : opt.value === 'dark'
                    ? 'bg-gray-900 border border-gray-700'
                    : 'bg-gradient-to-r from-white to-gray-900 border border-gray-300'
                }`}
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Layout Density"
        description="Adjust the spacing and size of interface elements."
      >
        <SelectDropdown
          id="appearance-density"
          label="Density"
          value={data.density}
          options={DENSITY_OPTIONS}
          onChange={handleDensityChange}
        />
      </SettingsSection>
    </div>
  );
}
