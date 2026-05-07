import { useState } from 'react';
import type { ProfileSettings as ProfileSettingsType } from '../../types/settings';
import SettingsSection from './SettingsSection';
import SettingsFormField from './SettingsFormField';

interface ProfileSettingsProps {
  data: ProfileSettingsType;
  onChange: (updated: ProfileSettingsType) => void;
}

function validateEmail(value: string): string {
  if (!value) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
  return '';
}

export default function ProfileSettings({ data, onChange }: ProfileSettingsProps) {
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (value: string) => {
    setEmailError(validateEmail(value));
    onChange({ ...data, email: value });
  };

  return (
    <div
      id="tabpanel-profile"
      role="tabpanel"
      aria-labelledby="tab-profile"
      className="flex flex-col gap-6"
    >
      <SettingsSection
        title="Personal Information"
        description="Update your name and contact details."
      >
        <SettingsFormField
          id="profile-name"
          label="Full Name"
          value={data.name}
          onChange={(value) => onChange({ ...data, name: value })}
          placeholder="Your full name"
        />
        <SettingsFormField
          id="profile-email"
          label="Email Address"
          type="email"
          value={data.email}
          onChange={handleEmailChange}
          placeholder="your@email.com"
          error={emailError}
        />
      </SettingsSection>

      <SettingsSection
        title="Avatar"
        description="Link to your profile picture."
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-primary select-none">
                {data.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <SettingsFormField
              id="profile-avatar"
              label="Avatar URL"
              type="url"
              value={data.avatarUrl ?? ''}
              onChange={(value) => onChange({ ...data, avatarUrl: value })}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
