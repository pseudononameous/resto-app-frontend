import { Paper, Stack, Switch, Text, TextInput, Title } from '@mantine/core';
import { useLocalSettings } from './useLocalSettings';

export default function IntegrationsSettingsTab() {
  const [integrations, setIntegrations] = useLocalSettings('resto-settings-integrations', {
    zapier: false,
    webhooks: false,
    posWebhookUrl: '',
  });

  return (
    <Stack gap="lg">
      <Paper p="lg" withBorder radius="md">
        <Stack gap="md">
          <Title order={4}>Third-party integrations</Title>
          <Text size="sm" c="dimmed">
            Toggle and configure integrations used by your restaurant.
          </Text>
          <Switch
            label="Enable Zapier automation"
            checked={integrations.zapier}
            onChange={(e) => setIntegrations({ ...integrations, zapier: e.currentTarget.checked })}
          />
          <Switch
            label="Enable order webhooks"
            checked={integrations.webhooks}
            onChange={(e) => setIntegrations({ ...integrations, webhooks: e.currentTarget.checked })}
          />
          {integrations.webhooks && (
            <TextInput
              label="Webhook URL"
              placeholder="https://example.com/webhooks/orders"
              value={integrations.posWebhookUrl}
              onChange={(e) =>
                setIntegrations({ ...integrations, posWebhookUrl: e.target.value })
              }
            />
          )}
        </Stack>
      </Paper>
      <Text size="xs" c="dimmed">
        Looking for advanced API docs? Open the Developer button in the header to see full API help.
      </Text>
    </Stack>
  );
}

