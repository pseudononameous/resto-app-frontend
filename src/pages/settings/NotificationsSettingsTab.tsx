import { Paper, Stack, Switch, Text, Title } from '@mantine/core';
import { useLocalSettings } from './useLocalSettings';

export default function NotificationsSettingsTab() {
  const [settings, setSettings] = useLocalSettings('resto-settings-notifications', {
    emailOrders: true,
    emailReports: true,
    smsDeliveryUpdates: false,
    inAppKitchenAlerts: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <Paper p="lg" withBorder radius="md">
      <Stack gap="md">
        <Title order={4}>Notification channels</Title>
        <Text size="sm" c="dimmed">
          Choose which notifications you and your team receive.
        </Text>
        <Switch
          label="Email order confirmations"
          checked={settings.emailOrders}
          onChange={() => toggle('emailOrders')}
        />
        <Switch
          label="Email daily sales summary"
          checked={settings.emailReports}
          onChange={() => toggle('emailReports')}
        />
        <Switch
          label="SMS delivery status to customers"
          checked={settings.smsDeliveryUpdates}
          onChange={() => toggle('smsDeliveryUpdates')}
        />
        <Switch
          label="In-app kitchen ticket alerts"
          checked={settings.inAppKitchenAlerts}
          onChange={() => toggle('inAppKitchenAlerts')}
        />
      </Stack>
    </Paper>
  );
}

