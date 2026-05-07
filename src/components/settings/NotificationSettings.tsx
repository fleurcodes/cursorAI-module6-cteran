import type { NotificationSettings as NotificationSettingsType } from '../../types/settings';
import SettingsSection from './SettingsSection';
import ToggleSwitch from './ToggleSwitch';

interface NotificationSettingsProps {
  data: NotificationSettingsType;
  onChange: (updated: NotificationSettingsType) => void;
}

export default function NotificationSettings({
  data,
  onChange,
}: NotificationSettingsProps) {
  return (
    <div
      id="tabpanel-notifications"
      role="tabpanel"
      aria-labelledby="tab-notifications"
      className="flex flex-col gap-6"
    >
      <SettingsSection
        title="Notification Preferences"
        description="Choose how and when you want to be notified."
      >
        <ToggleSwitch
          id="notif-email"
          label="Email Notifications"
          description="Receive updates and alerts via email."
          checked={data.emailNotifications}
          onChange={(checked) =>
            onChange({ ...data, emailNotifications: checked })
          }
        />
        <div className="border-t border-gray-100 dark:border-gray-800" />
        <ToggleSwitch
          id="notif-push"
          label="Push Notifications"
          description="Receive real-time alerts in your browser."
          checked={data.pushNotifications}
          onChange={(checked) =>
            onChange({ ...data, pushNotifications: checked })
          }
        />
        <div className="border-t border-gray-100 dark:border-gray-800" />
        <ToggleSwitch
          id="notif-weekly"
          label="Weekly Summary"
          description="Get a weekly digest of your activity and stats."
          checked={data.weeklySummary}
          onChange={(checked) =>
            onChange({ ...data, weeklySummary: checked })
          }
        />
      </SettingsSection>
    </div>
  );
}
