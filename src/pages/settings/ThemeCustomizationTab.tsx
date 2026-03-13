import { Card, Grid, Stack, Text, Title, ColorInput, SegmentedControl, Switch, TextInput, Select } from '@mantine/core';

export default function ThemeCustomizationTab() {
  return (
    <Stack gap="lg">
      <Title order={3}>Theme Customization</Title>
      <Text size="sm" c="dimmed">
        Global theme settings apply across App, Web, and Kiosk. Channel-specific options let you tweak
        layout and menu behavior per surface.
      </Text>

      {/* Global, Shopify-style theme properties */}
      <Card withBorder radius="md" shadow="sm">
        <Stack gap="sm">
          <Title order={5}>Global Theme (All channels)</Title>
          <Text size="xs" c="dimmed">
            Configure your brand once — logo, tagline, primary and background colors, and typography are
            shared across every ordering surface.
          </Text>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Logo URL" placeholder="https://…" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Tagline" placeholder="e.g. Healthy meals, faster" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <ColorInput label="Primary color" defaultValue="#f97316" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <ColorInput label="Background color" defaultValue="#050509" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Typography"
                placeholder="Choose font"
                data={[
                  { label: 'System / Sans-serif', value: 'system' },
                  { label: 'Rounded (Shopify-style)', value: 'rounded' },
                  { label: 'Editorial', value: 'editorial' },
                ]}
                defaultValue="system"
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="md" shadow="sm">
            <Stack gap="sm">
              <Title order={5}>App</Title>
              <Text size="xs" c="dimmed">
                Mobile-first layout used by staff or customers on phones and tablets.
              </Text>
              <SegmentedControl
                fullWidth
                data={[
                  { label: 'Compact layout', value: 'compact' },
                  { label: 'Comfortable layout', value: 'comfortable' },
                ]}
                defaultValue="comfortable"
              />
              <SegmentedControl
                fullWidth
                label="Menu style"
                data={[
                  { label: 'Categories on top', value: 'top-categories' },
                  { label: 'Drawer menu', value: 'drawer' },
                ]}
                defaultValue="top-categories"
              />
              <Switch label="Show background imagery" defaultChecked />
              <Switch label="Show badges for featured items" defaultChecked />
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="md" shadow="sm">
            <Stack gap="sm">
              <Title order={5}>Web</Title>
              <Text size="xs" c="dimmed">
                Public ordering site for customers on desktop and mobile browsers.
              </Text>
              <SegmentedControl
                fullWidth
                label="Menu style"
                data={[
                  { label: 'Grid', value: 'grid' },
                  { label: 'List', value: 'list' },
                ]}
                defaultValue="grid"
              />
              <Switch label="Show hero banner on homepage" defaultChecked />
              <Switch label="Enable sticky cart summary" defaultChecked />
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="md" shadow="sm">
            <Stack gap="sm">
              <Title order={5}>Kiosk</Title>
              <Text size="xs" c="dimmed">
                In-store self-service kiosk used for walk-up ordering.
              </Text>
              <SegmentedControl
                fullWidth
                label="Menu style"
                data={[
                  { label: 'Hero image first', value: 'hero' },
                  { label: 'Category-first', value: 'categories' },
                ]}
                defaultValue="categories"
              />
              <Switch label="Show upsell suggestions" defaultChecked />
              <Switch label="Large touch targets" defaultChecked />
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

