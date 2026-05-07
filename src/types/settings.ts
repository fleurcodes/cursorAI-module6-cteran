export interface ProfileSettings {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklySummary: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  dataSharing: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  density: 'comfortable' | 'compact';
}

export interface SettingsState {
  profile: ProfileSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
}

export type SettingsTab = 'profile' | 'notifications' | 'privacy' | 'appearance';

export interface TabDefinition {
  id: SettingsTab;
  label: string;
}

export const SETTINGS_TABS: TabDefinition[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'appearance', label: 'Appearance' },
];

export const DEFAULT_SETTINGS: SettingsState = {
  profile: {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatarUrl: '',
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    weeklySummary: true,
  },
  privacy: {
    profileVisibility: 'public',
    dataSharing: false,
  },
  appearance: {
    theme: 'system',
    density: 'comfortable',
  },
};
