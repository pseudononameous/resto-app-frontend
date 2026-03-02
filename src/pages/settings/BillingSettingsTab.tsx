import { Button, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useLocalSettings } from './useLocalSettings';

export default function BillingSettingsTab() {
  const [settings] = useLocalSettings('resto-settings-billing', {
    plan: 'Starter',
    nextInvoiceDate: null as string | null,
  });

  return (
    <Paper p="lg" withBorder radius="md">
      <Stack gap="md">
        <Title order={4}>Billing overview</Title>
        <Text size="sm" c="dimmed">
          View your current subscription plan. Billing is managed externally today, so updates are
          handled by support.
        </Text>
        <Divider />
        <Group justify="space-between">
          <Text fw={500}>Current plan</Text>
          <Text>{settings.plan}</Text>
        </Group>
        <Group justify="space-between">
          <Text fw={500}>Next invoice</Text>
          <Text>{settings.nextInvoiceDate ?? 'Contact support for details'}</Text>
        </Group>
        <Button
          component={Link}
          to="mailto:support@example.com"
          variant="light"
          color="orange"
          radius="md"
        >
          Contact billing
        </Button>
      </Stack>
    </Paper>
  );
}

