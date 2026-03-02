import { Paper, Stack, Switch, Text, TextInput, Title } from '@mantine/core';
import { useLocalSettings } from './useLocalSettings';

export default function CourierLogisticsSettingsTab() {
  const [settings, setSettings] = useLocalSettings('resto-settings-courier', {
    ownRiders: true,
    thirdPartyCouriers: false,
    notes: '',
  });

  return (
    <Paper p="lg" withBorder radius="md">
      <Stack gap="md">
        <Title order={4}>Courier & logistics</Title>
        <Text size="sm" c="dimmed">
          Document how you fulfill deliveries so staff follow a consistent workflow.
        </Text>
        <Switch
          label="Use in-house riders"
          checked={settings.ownRiders}
          onChange={(e) => setSettings({ ...settings, ownRiders: e.currentTarget.checked })}
        />
        <Switch
          label="Use third-party couriers (Grab, Uber, etc.)"
          checked={settings.thirdPartyCouriers}
          onChange={(e) =>
            setSettings({ ...settings, thirdPartyCouriers: e.currentTarget.checked })
          }
        />
        <TextInput
          label="Logistics notes"
          placeholder="Pickup instructions, packaging rules, etc."
          value={settings.notes}
          onChange={(e) => setSettings({ ...settings, notes: e.target.value })}
        />
      </Stack>
    </Paper>
  );
}

