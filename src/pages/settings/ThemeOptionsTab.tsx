import { Card, SimpleGrid, Stack, Text, Title, Badge, Group, SegmentedControl } from '@mantine/core';

const SHOPIFY_THEMES = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Clean two-column layout inspired by Shopify’s default storefronts.',
    tags: ['All channels', 'Balanced'],
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Lightweight, typography-first layout optimized for fast kiosks.',
    tags: ['Kiosk', 'Speed'],
  },
  {
    id: 'editorial',
    label: 'Editorial',
    description: 'Storytelling-first layout for web ordering with richer imagery.',
    tags: ['Web', 'Branding'],
  },
];

export default function ThemeOptionsTab() {
  return (
    <Stack gap="lg">
      <Title order={3}>Theme Options</Title>
      <Text size="sm" c="dimmed">
        Choose a base theme for each channel. Themes control layout, typography, and component density
        across your kiosks, web ordering, and mobile app.
      </Text>

      <SegmentedControl
        fullWidth
        data={[
          { label: 'Unified (All channels)', value: 'unified' },
          { label: 'Per channel', value: 'per-channel' },
        ]}
        defaultValue="unified"
      />

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {SHOPIFY_THEMES.map((theme) => (
          <Card key={theme.id} withBorder radius="md" shadow="sm">
            <Stack gap="xs">
              <Group justify="space-between">
                <Title order={5}>{theme.label}</Title>
                <Badge color="orange" variant="light" size="sm">
                  Shopify-inspired
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">
                {theme.description}
              </Text>
              <Group gap={6} mt="xs">
                {theme.tags.map((tag) => (
                  <Badge key={tag} size="xs" variant="outline">
                    {tag}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

