import { NumberInput, Paper, Stack, Switch, Text, Title } from '@mantine/core';
import { useLocalSettings } from './useLocalSettings';

export default function TaxCenterSettingsTab() {
  const [settings, setSettings] = useLocalSettings('resto-settings-tax', {
    defaultRate: 10,
    inclusivePricing: false,
  });

  return (
    <Paper p="lg" withBorder radius="md">
      <Stack gap="md">
        <Title order={4}>Tax configuration</Title>
        <Text size="sm" c="dimmed">
          Basic tax settings used across menus and orders. For complex rules, coordinate with your
          accountant.
        </Text>
        <NumberInput
          label="Default tax rate (%)"
          value={settings.defaultRate}
          min={0}
          max={100}
          step={0.1}
          onChange={(value) =>
            setSettings({
              ...settings,
              defaultRate: typeof value === 'number' ? value : settings.defaultRate,
            })
          }
        />
        <Switch
          label="Prices include tax"
          checked={settings.inclusivePricing}
          onChange={(e) =>
            setSettings({ ...settings, inclusivePricing: e.currentTarget.checked })
          }
        />
      </Stack>
    </Paper>
  );
}

