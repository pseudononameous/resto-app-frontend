import { Box, Card, Container, Group, SimpleGrid, Stack, Text, ThemeIcon, Title, Button } from '@mantine/core';
import { IconDevices, IconDeviceMobile, IconWorldWww, IconUsers, IconPlug, IconPrinter } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import PageHeader from '@components/ui/PageHeader';

const SHOP_ITEMS = [
  {
    id: 'order-kiosk',
    icon: IconDevices,
    title: 'Order Kiosk',
    description: 'Tablet or standing kiosk for in-store self-service ordering. Optimized for quick service environments.',
    ctaLabel: 'View kiosk demo',
    to: '/dashboard/kiosk',
  },
  {
    id: 'order-app',
    icon: IconDeviceMobile,
    title: 'Order App',
    description: 'Mobile-first ordering experience that mirrors your kiosk and web themes for a unified brand.',
    ctaLabel: 'See app flows',
    to: '/dashboard/orders',
  },
  {
    id: 'order-web',
    icon: IconWorldWww,
    title: 'Order Web',
    description: 'Hosted web ordering site that connects directly to your menu, inventory, and delivery channels.',
    ctaLabel: 'Open sample site',
    to: '/dashboard/menu-items',
  },
  {
    id: 'partner-services',
    icon: IconUsers,
    title: 'Partner Services',
    description: 'Implementation, menu digitization, and multi-location rollout help from certified partners.',
    ctaLabel: 'Browse partner services',
    to: '/dashboard/customers',
  },
  {
    id: 'integrations',
    icon: IconPlug,
    title: 'Integrations (Apps)',
    description: 'Connect to delivery aggregators, accounting tools, and marketing platforms in a few clicks.',
    ctaLabel: 'Manage integrations',
    to: '/dashboard/settings',
  },
  {
    id: 'hardware',
    icon: IconPrinter,
    title: 'Hardware',
    description: 'Recommended tablets, printers, and accessories tested to work well with OrderOp kiosks and kitchen.',
    ctaLabel: 'View hardware guide',
    to: '/dashboard/kitchen-tickets',
  },
];

export default function ShopPage() {
  return (
    <Stack gap="lg">
      <PageHeader
        title="Shop"
        subtitle="Explore ordering channels, partner services, integrations, and hardware that work with OrderOp."
      />
      <Container size="lg" px={0}>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {SHOP_ITEMS.map((item) => (
            <Card key={item.id} withBorder radius="md" shadow="sm">
              <Stack gap="sm">
                <Group gap="sm">
                  <ThemeIcon size={40} radius="md" color="orange" variant="light">
                    <item.icon size={22} />
                  </ThemeIcon>
                  <Title order={4}>{item.title}</Title>
                </Group>
                <Text size="sm" c="dimmed">
                  {item.description}
                </Text>
                <Box mt="xs">
                  <Button
                    component={Link}
                    to={item.to}
                    variant="light"
                    color="orange"
                    size="sm"
                  >
                    {item.ctaLabel}
                  </Button>
                </Box>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Stack>
  );
}

