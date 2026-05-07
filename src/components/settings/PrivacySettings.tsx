import type { PrivacySettings as PrivacySettingsType } from '../../types/settings';
import SettingsSection from './SettingsSection';
import ToggleSwitch from './ToggleSwitch';
import SelectDropdown from './SelectDropdown';

interface PrivacySettingsProps {
  data: PrivacySettingsType;
  onChange: (updated: PrivacySettingsType) => void;
}

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public – anyone can view your profile' },
  { value: 'private', label: 'Private – only you can view your profile' },
];

export default function PrivacySettings({ data, onChange }: PrivacySettingsProps) {
  return (
    <div
      id="tabpanel-privacy"
      role="tabpanel"
      aria-labelledby="tab-privacy"
      className="flex flex-col gap-6"
    >
      <SettingsSection
        title="Profile Visibility"
        description="Control who can see your profile information."
      >
        <SelectDropdown
          id="privacy-visibility"
          label="Profile Visibility"
          value={data.profileVisibility}
          options={VISIBILITY_OPTIONS}
          onChange={(value) =>
            onChange({
              ...data,
              profileVisibility: value as PrivacySettingsType['profileVisibility'],
            })
          }
        />
      </SettingsSection>

      <SettingsSection
        title="Data & Analytics"
        description="Manage how your data is used."
      >
        <ToggleSwitch
          id="privacy-data-sharing"
          label="Data Sharing"
          description="Allow anonymous usage data to be shared to improve the product."
          checked={data.dataSharing}
          onChange={(checked) => onChange({ ...data, dataSharing: checked })}
        />
      </SettingsSection>
    </div>
  );
}
