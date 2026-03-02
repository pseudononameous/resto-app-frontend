import { Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { useLocalSettings } from './useLocalSettings';

type PayoutSchedule = 'daily' | 'weekly' | 'monthly';

export default function PayoutsSettingsTab() {
  const [settings, setSettings] = useLocalSettings('resto-settings-payouts', {
    bankName: '',
    accountName: '',
    accountNumber: '',
    schedule: 'daily' as PayoutSchedule,
  });

  return (
    <Paper p="lg" withBorder radius="md">
      <Stack gap="md">
        <Title order={4}>Payout details</Title>
        <Text size="sm" c="dimmed">
          Configure where your settlement payouts are sent. Coordinate with your payment provider
          before changing bank details.
        </Text>
        <TextInput
          label="Bank name"
          value={settings.bankName}
          onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
        />
        <TextInput
          label="Account holder name"
          value={settings.accountName}
          onChange={(e) => setSettings({ ...settings, accountName: e.target.value })}
        />
        <TextInput
          label="Account number / IBAN"
          value={settings.accountNumber}
          onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
        />
        <TextInput
          label="Payout schedule"
          placeholder="daily | weekly | monthly"
          value={settings.schedule}
          onChange={(e) =>
            setSettings({
              ...settings,
              schedule: e.target.value as PayoutSchedule,
            })
          }
        />
      </Stack>
    </Paper>
  );
}

