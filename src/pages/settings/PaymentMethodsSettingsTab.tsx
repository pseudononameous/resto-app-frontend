import { Paper, Stack, Switch, Text, TextInput, Title } from '@mantine/core';
import { useLocalSettings } from './useLocalSettings';

export default function PaymentMethodsSettingsTab() {
  const [settings, setSettings] = useLocalSettings('resto-settings-payments', {
    cash: true,
    card: true,
    wallet: false,
    notes: '',
  });

  return (
    <Paper p="lg" withBorder radius="md">
      <Stack gap="md">
        <Title order={4}>Accepted payment methods</Title>
        <Text size="sm" c="dimmed">
          Control which payment methods are available in your ordering flows.
        </Text>
        <Switch
          label="Cash"
          checked={settings.cash}
          onChange={(e) => setSettings({ ...settings, cash: e.currentTarget.checked })}
        />
        <Switch
          label="Credit / debit cards"
          checked={settings.card}
          onChange={(e) => setSettings({ ...settings, card: e.currentTarget.checked })}
        />
        <Switch
          label="Digital wallets (e.g. Apple Pay, Google Pay)"
          checked={settings.wallet}
          onChange={(e) => setSettings({ ...settings, wallet: e.currentTarget.checked })}
        />
        <TextInput
          label="Internal notes"
          placeholder="Card processor, settlement rules, etc."
          value={settings.notes}
          onChange={(e) => setSettings({ ...settings, notes: e.target.value })}
        />
      </Stack>
    </Paper>
  );
}

