import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function LocationsSettingsTab() {
  return (
    <Stack gap="lg">
      <Paper p="lg" withBorder radius="md">
        <Stack gap="md">
          <Title order={4}>Manage locations</Title>
          <Text size="sm" c="dimmed">
            Create and edit your restaurant locations. For full inventory configuration, use the
            dedicated pages.
          </Text>
          <Group gap="sm">
            <Button component={Link} to="/dashboard/stores" variant="light" radius="md">
              Open Stores manager
            </Button>
            <Button component={Link} to="/dashboard/delivery-zones" variant="light" radius="md">
              Open Delivery zones
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}

