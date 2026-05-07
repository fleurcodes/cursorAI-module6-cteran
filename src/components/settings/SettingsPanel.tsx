import { useCallback, useEffect, useState } from 'react';
import type {
  SettingsState,
  SettingsTab,
  ProfileSettings,
  NotificationSettings,
  PrivacySettings,
  AppearanceSettings,
} from '../../types/settings';
import { DEFAULT_SETTINGS, SETTINGS_TABS } from '../../types/settings';
import SettingsTabs from './SettingsTabs';
import ProfileSettingsPanel from './ProfileSettings';
import NotificationSettingsPanel from './NotificationSettings';
import PrivacySettingsPanel from './PrivacySettings';
import AppearanceSettingsPanel from './AppearanceSettings';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthUser } from '../../types/auth';

const STORAGE_KEY = 'app-settings';

function loadSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as SettingsState;
    }
  } catch {
    // Ignore parse errors; fall back to defaults
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: SettingsState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function isDirty(current: SettingsState, saved: SettingsState): boolean {
  return JSON.stringify(current) !== JSON.stringify(saved);
}

function mergeAuthProfile(base: SettingsState, user: AuthUser | null): SettingsState {
  if (!user) return base;
  return {
    ...base,
    profile: {
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl ?? base.profile.avatarUrl,
    },
  };
}

export default function SettingsPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const getInitialSettings = () => mergeAuthProfile(loadSettings(), user);

  const [savedSettings, setSavedSettings] = useState<SettingsState>(getInitialSettings);
  const [currentSettings, setCurrentSettings] = useState<SettingsState>(getInitialSettings);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const hasChanges = isDirty(currentSettings, savedSettings);

  // Update a top-level settings slice
  const updateProfile = useCallback((profile: ProfileSettings) => {
    setCurrentSettings((prev) => ({ ...prev, profile }));
  }, []);

  const updateNotifications = useCallback((notifications: NotificationSettings) => {
    setCurrentSettings((prev) => ({ ...prev, notifications }));
  }, []);

  const updatePrivacy = useCallback((privacy: PrivacySettings) => {
    setCurrentSettings((prev) => ({ ...prev, privacy }));
  }, []);

  const updateAppearance = useCallback((appearance: AppearanceSettings) => {
    setCurrentSettings((prev) => ({ ...prev, appearance }));
  }, []);

  // Persist on save
  const handleSave = async () => {
    if (!hasChanges || saving) return;
    setSaving(true);
    setSaveSuccess(false);
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    saveSettings(currentSettings);
    setSavedSettings(currentSettings);
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Reset to last persisted state
  const handleReset = () => {
    setCurrentSettings(savedSettings);
  };

  // Re-apply theme from stored settings on mount, merging auth profile if present
  useEffect(() => {
    const merged = mergeAuthProfile(loadSettings(), user);
    setCurrentSettings(merged);
    setSavedSettings(merged);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account preferences and appearance.
        </p>
      </div>

      {/* Tab navigation */}
      <SettingsTabs
        tabs={SETTINGS_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab panels */}
      <div className="min-h-[420px]">
        {activeTab === 'profile' && (
          <ProfileSettingsPanel
            data={currentSettings.profile}
            onChange={updateProfile}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationSettingsPanel
            data={currentSettings.notifications}
            onChange={updateNotifications}
          />
        )}
        {activeTab === 'privacy' && (
          <PrivacySettingsPanel
            data={currentSettings.privacy}
            onChange={updatePrivacy}
          />
        )}
        {activeTab === 'appearance' && (
          <AppearanceSettingsPanel
            data={currentSettings.appearance}
            onChange={updateAppearance}
          />
        )}
      </div>

      {/* Action bar */}
      <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl bg-white dark:bg-gray-900 shadow-md px-6 py-4">
        <div className="flex items-center gap-2 min-h-[1.5rem]">
          {saveSuccess && (
            <span
              role="status"
              className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 animate-pulse"
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Settings saved!
            </span>
          )}
          {hasChanges && !saveSuccess && (
            <span className="text-sm text-amber-600 dark:text-amber-400">
              You have unsaved changes.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges || saving}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            aria-busy={saving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          >
            {saving ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving…
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
