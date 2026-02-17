import {
  Box,
  Button,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Badge,
  Divider,
} from '@mantine/core';
import { IconChartBar, IconDevices, IconReceipt2, IconStore, IconUsers, IconChefHat } from '@tabler/icons-react';

// RestoApp brand-inspired palette
const EMERALD = '#059669';
const EMERALD_DARK = '#064e3b';
const AMBER = '#f59e0b';
const SLATE = '#020617';
const SLATE_SOFT = '#0f172a';
const OFF_WHITE = '#f9fafb';
const OFF_WHITE_ALT = '#f3f4f6';

export default function RestoLandingPage() {
  return (
    <Box
      style={{
        fontFamily: "'Onest', sans-serif",
        minHeight: '100vh',
        background: `radial-gradient(circle at top left, ${EMERALD}1a, transparent 55%), radial-gradient(circle at bottom right, ${AMBER}1a, transparent 55%), ${OFF_WHITE}`,
      }}
    >
      {/* Hero */}
      <Box
        component="section"
        py={96}
        px="md"
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle at 10% 0%, ${EMERALD}22 0, transparent 40%), radial-gradient(circle at 90% 100%, ${AMBER}22 0, transparent 40%)`,
          }}
        />
        <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 40, md: 64 }} align="center">
            <Stack gap="lg">
              <Badge
                size="lg"
                variant="filled"
                radius="xl"
                styles={{
                  root: {
                    background: `${SLATE_SOFT}dd`,
                    color: OFF_WHITE,
                    paddingInline: 16,
                  },
                }}
              >
                RestoApp Commerce Ecosystem
              </Badge>
              <Title
                order={1}
                style={{
                  fontWeight: 800,
                  fontSize: '3rem',
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  color: SLATE,
                }}
              >
                The Operating System for Modern Restaurants.
              </Title>
              <Text size="lg" c="dimmed" maw={520}>
                RestoApp unifies point-of-sale, kitchen operations, stock, purchasing, and analytics into one real-time
                commerce platform—built for multi-branch brands and fast-growing concepts.
              </Text>
              <Group gap="md" mt="sm" wrap="wrap">
                <Button
                  size="lg"
                  radius="xl"
                  styles={{
                    root: {
                      background: EMERALD,
                      color: 'white',
                    },
                  }}
                  component="a"
                  href="#book-demo"
                >
                  Book a live demo
                </Button>
                <Button
                  size="lg"
                  radius="xl"
                  variant="outline"
                  color="dark"
                  component="a"
                  href="#ecosystem"
                >
                  Explore the ecosystem
                </Button>
              </Group>
              <Group gap="md" mt="lg" wrap="wrap">
                <Stack gap={0} style={{ minWidth: 140 }}>
                  <Text fw={700} size="lg" c={SLATE}>
                    99.9%
                  </Text>
                  <Text size="xs" c="dimmed">
                    Uptime across branches
                  </Text>
                </Stack>
                <Stack gap={0} style={{ minWidth: 140 }}>
                  <Text fw={700} size="lg" c={SLATE}>
                    3x
                  </Text>
                  <Text size="xs" c="dimmed">
                    Faster inventory counts
                  </Text>
                </Stack>
                <Stack gap={0} style={{ minWidth: 140 }}>
                  <Text fw={700} size="lg" c={SLATE}>
                    1 source
                  </Text>
                  <Text size="xs" c="dimmed">
                    Of truth for sales & stock
                  </Text>
                </Stack>
              </Group>
            </Stack>

            <Box
              component="aside"
              p="lg"
              style={{
                borderRadius: 24,
                background: 'rgba(15,23,42,0.97)',
                border: '1px solid rgba(148,163,184,0.4)',
                boxShadow: '0 24px 80px rgba(15,23,42,0.55)',
              }}
            >
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Stack gap={2}>
                    <Text size="xs" fw={600} c={AMBER} tt="uppercase" style={{ letterSpacing: 2 }}>
                      Live Control Center
                    </Text>
                    <Text fw={700} c="white">
                      Tonight · 7:30 PM
                    </Text>
                    <Text size="xs" c="rgba(148,163,184,0.9)">
                      Multi-branch snapshot · Last 5 minutes
                    </Text>
                  </Stack>
                  <Badge
                    size="sm"
                    radius="sm"
                    styles={{
                      root: {
                        background: 'rgba(22,163,74,0.16)',
                        color: '#bbf7d0',
                        border: '1px solid rgba(22,163,74,0.5)',
                      },
                    }}
                  >
                    Online
                  </Badge>
                </Group>

                <SimpleGrid cols={2} spacing="sm">
                  <MetricCard label="Net sales" value="₱ 247,320" trend="+18.4%" />
                  <MetricCard label="Avg. ticket" value="₱ 612" trend="+7.1%" />
                  <MetricCard label="Orders in prep" value="23" trend="Kitchen load" tone="warning" />
                  <MetricCard label="Void / comp" value="0.6%" trend="-0.9 pts" tone="positive" />
                </SimpleGrid>

                <Divider my="xs" color="rgba(148,163,184,0.4)" />

                <SimpleGrid cols={3} spacing="sm">
                  <MiniPill label="Front of house" value="Stable" />
                  <MiniPill label="Inventory sync" value="On schedule" />
                  <MiniPill label="Suppliers" value="4 deliveries today" />
                </SimpleGrid>

                <Text size="xs" c="rgba(148,163,184,0.9)">
                  Every tap at the counter, every ticket in the kitchen, every SKU in stock—captured and reconciled in
                  real time by RestoApp.
                </Text>
              </Stack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Commerce ecosystem */}
      <Box id="ecosystem" component="section" py={80} px="md" style={{ background: OFF_WHITE_ALT }}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap={4} ta="center">
              <Text size="sm" fw={600} c={EMERALD_DARK} tt="uppercase" style={{ letterSpacing: 3 }}>
                Unified Commerce
              </Text>
              <Title order={2} fw={800} style={{ fontSize: 34, letterSpacing: '-0.03em', color: SLATE }}>
                One platform for every moment of service.
              </Title>
              <Text size="md" c="dimmed" maw={640} mx="auto">
                Replace patchwork systems with a single connected stack—from dining room to stock room to head office.
              </Text>
            </Stack>
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              <FeatureCard
                icon={IconDevices}
                title="Point-of-Sale & Channels"
                description="Table, counter, kiosk, and online orders all feed into one real-time engine. Offline-first, touch-optimized, built for rush hours."
                bullets={['Table & kiosk flows', 'Multi-channel menus', 'Offline continuity']}
              />
              <FeatureCard
                icon={IconChefHat}
                title="Kitchen & Production"
                description="Smart KDS, coursing, and routing keep tickets moving. Kitchen views adapt by role—grill, pantry, pastry, bar."
                bullets={['Multi-screen KDS', 'Prep & firing logic', 'Allergens & notes']}
              />
              <FeatureCard
                icon={IconReceipt2}
                title="Inventory & Costing"
                description="Recipe-level costing meets live stock. Map every sale back to ingredients and see variance before it hits your P&L."
                bullets={['Recipe & yield control', 'Auto stock deductions', 'Waste & variance alerts']}
              />
              <FeatureCard
                icon={IconStore}
                title="Purchasing & Suppliers"
                description="Centralized purchasing with branch-level controls. Suggested orders based on movement, par levels, and lead times."
                bullets={['Digital purchase orders', 'GRN & discrepancies', 'Multi-supplier catalogs']}
              />
              <FeatureCard
                icon={IconUsers}
                title="Multi-Branch Operations"
                description="Roll up performance by brand, region, or concept. Apply price changes, promos, and menu updates once—push everywhere."
                bullets={['Role-based workspaces', 'Brand & branch segmentation', 'Central menu governance']}
              />
              <FeatureCard
                icon={IconChartBar}
                title="Analytics & Insights"
                description="See the full picture in seconds. From sales mix to menu engineering to labor vs. revenue curves."
                bullets={['Real-time dashboards', 'Menu engineering views', 'Export to BI or accountant']}
              />
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* Who it's for */}
      <Box component="section" py={80} px="md">
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
            <PersonaCard
              label="For owners & founders"
              headline="Finally see the entire business on one screen."
              bullets={[
                'Trustworthy branch-level P&L inputs',
                'Real-time view of cash, comps, and promos',
                'Drill from brand view down to a single check',
              ]}
            />
            <PersonaCard
              label="For operations & finance"
              headline="Operational discipline without spreadsheets."
              bullets={[
                'Standardize recipes, yields, and BOMs',
                'Automate purchase cycles & forecast stock',
                'Get audit trails across changes and approvals',
              ]}
            />
            <PersonaCard
              label="For managers & crew"
              headline="Tools that feel fast, simple, and familiar."
              bullets={[
                'Training-light, shift-ready interfaces',
                'Smart prompts to reduce mistakes',
                'Built to survive real-world network conditions',
              ]}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Demo section */}
      <Box id="book-demo" component="section" py={88} px="md" style={{ background: SLATE }}>
        <Container size="md">
          <Box
            p="xl"
            style={{
              borderRadius: 24,
              background: `linear-gradient(135deg, ${EMERALD_DARK}, ${SLATE_SOFT})`,
              border: '1px solid rgba(148,163,184,0.5)',
              boxShadow: '0 24px 80px rgba(15,23,42,0.7)',
            }}
          >
            <Stack gap="lg" align="center" ta="center">
              <Text size="sm" fw={600} c="#bbf7d0" tt="uppercase" style={{ letterSpacing: 3 }}>
                See RestoApp in action
              </Text>
              <Title order={2} c="white" fw={800} style={{ letterSpacing: '-0.03em' }}>
                Schedule a working session with our team.
              </Title>
              <Text size="md" c="rgba(226,232,240,0.9)" maw={520}>
                In a 45-minute live session, we&apos;ll walk through your current stack and map how RestoApp can
                consolidate tools, reduce leakages, and prepare you for new locations.
              </Text>
              <Group gap="md" wrap="wrap" justify="center">
                <Button
                  size="lg"
                  radius="xl"
                  styles={{
                    root: {
                      background: AMBER,
                      color: SLATE,
                      fontWeight: 700,
                    },
                  }}
                  component="a"
                  href="mailto:hello@restoapp.local?subject=RestoApp%20Demo%20Request"
                >
                  Request a demo
                </Button>
                <Button
                  size="lg"
                  radius="xl"
                  variant="outline"
                  color="gray"
                  component="a"
                  href="/login"
                >
                  Sign in to console
                </Button>
              </Group>
              <Text size="xs" c="rgba(148,163,184,0.9)">
                No pressure. No hard sell. Just a clear roadmap for your restaurant commerce stack.
              </Text>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box py="lg" px="md" style={{ background: SLATE_SOFT, borderTop: '1px solid rgba(148,163,184,0.4)' }}>
        <Container size="xl">
          <Group justify="space-between" align="center" wrap="wrap">
            <Text size="sm" c="rgba(148,163,184,0.9)">
              © {new Date().getFullYear()} RestoApp Commerce Ecosystem. All rights reserved.
            </Text>
            <Group gap="md">
              <Text size="xs" c="rgba(148,163,184,0.9)">
                Powered by a modern stack and real-time data.
              </Text>
            </Group>
          </Group>
        </Container>
      </Box>
    </Box>
  );
}

function MetricCard({
  label,
  value,
  trend,
  tone,
}: {
  label: string;
  value: string;
  trend: string;
  tone?: 'positive' | 'warning';
}) {
  const trendColor = tone === 'warning' ? '#fbbf24' : tone === 'positive' ? '#4ade80' : 'rgba(148,163,184,0.9)';

  return (
    <Box
      p="sm"
      style={{
        borderRadius: 12,
        background: 'rgba(15,23,42,0.85)',
        border: '1px solid rgba(30,64,175,0.5)',
      }}
    >
      <Text size="xs" c="rgba(148,163,184,0.9)">
        {label}
      </Text>
      <Group justify="space-between" mt={4} align="flex-end">
        <Text fw={700} c="white">
          {value}
        </Text>
        <Text size="xs" fw={500} style={{ color: trendColor }}>
          {trend}
        </Text>
      </Group>
    </Box>
  );
}

function MiniPill({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      gap={2}
      p="xs"
      style={{
        borderRadius: 999,
        background: 'rgba(15,23,42,0.8)',
        border: '1px solid rgba(148,163,184,0.6)',
      }}
    >
      <Text size="xs" c="rgba(148,163,184,0.9)">
        {label}
      </Text>
      <Text size="xs" fw={600} c="#e5e7eb">
        {value}
      </Text>
    </Stack>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  bullets,
}: {
  icon: typeof IconDevices;
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <Box
      p="lg"
      style={{
        borderRadius: 18,
        background: 'white',
        border: '1px solid rgba(148,163,184,0.4)',
        boxShadow: '0 16px 40px rgba(15,23,42,0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <ThemeIcon
        size={40}
        radius="md"
        style={{
          background: 'rgba(22,163,74,0.12)',
          color: EMERALD_DARK,
        }}
      >
        <Icon size={22} />
      </ThemeIcon>
      <Stack gap={4}>
        <Text fw={700} c={SLATE}>
          {title}
        </Text>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      </Stack>
      <Stack gap={4} mt="xs">
        {bullets.map((b) => (
          <Group key={b} gap={6} align="flex-start">
            <Box
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                marginTop: 6,
                background: EMERALD,
              }}
            />
            <Text size="xs" c="dimmed">
              {b}
            </Text>
          </Group>
        ))}
      </Stack>
    </Box>
  );
}

function PersonaCard({
  label,
  headline,
  bullets,
}: {
  label: string;
  headline: string;
  bullets: string[];
}) {
  return (
    <Box
      p="lg"
      style={{
        borderRadius: 20,
        background: 'white',
        border: '1px solid rgba(209,213,219,0.9)',
        boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <Text size="xs" fw={600} c={EMERALD_DARK} tt="uppercase" style={{ letterSpacing: 2 }}>
        {label}
      </Text>
      <Text fw={700} c={SLATE}>
        {headline}
      </Text>
      <Stack gap={6} mt="xs">
        {bullets.map((b) => (
          <Group key={b} gap={6} align="flex-start">
            <Box
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                marginTop: 6,
                background: EMERALD,
              }}
            />
            <Text size="sm" c="dimmed">
              {b}
            </Text>
          </Group>
        ))}
      </Stack>
    </Box>
  );
}

