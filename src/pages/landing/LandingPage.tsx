import {
  Box,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Spoiler,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import type { ReactNode, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  IconBolt,
  IconCash,
  IconChefHat,
  IconUsersGroup,
  IconCashRegister,
  IconReceipt2,
  IconShoppingCart,
  IconReportAnalytics,
  IconUsers,
} from '@tabler/icons-react';

// Dark, high-contrast palette inspired by the RestoApp hero visuals
const CANVAS = '#050509';
const CANVAS_SOFT = '#0b0b10';
const TEXT_MAIN = '#f9fafb';
const TEXT_MUTED = '#9ca3af';
const ACCENT_SOFT = '#ffb347';
const ACCENT = '#f97316';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1800&q=80&auto=format&fit=crop';

type Feature = {
  title: string;
  description: string;
  icon: ReactNode;
};

const CORE_FEATURES: Feature[] = [
  {
    title: 'Point of Sale & Channels',
    description: 'One place for dine‑in, delivery, pickup, and marketplace orders.',
    icon: <IconCashRegister size={20} />,
  },
  {
    title: 'Inventory & Recipes',
    description: 'Stock and COGS that update automatically with every sale.',
    icon: <IconChefHat size={20} />,
  },
  {
    title: 'Menu & Pricing',
    description: 'Edit menus once and push changes across every channel.',
    icon: <IconReceipt2 size={20} />,
  },
  {
    title: 'Purchasing & Suppliers',
    description: 'Smarter ordering with connected suppliers and approvals.',
    icon: <IconShoppingCart size={20} />,
  },
  {
    title: 'Reporting & Analytics',
    description: 'Clean, ready‑to‑use reports for every brand and branch.',
    icon: <IconReportAnalytics size={20} />,
  },
  {
    title: 'Multi‑branch Controls',
    description: 'Shared playbooks so every store runs the same system.',
    icon: <IconUsers size={20} />,
  },
];

export default function LandingPage() {
  return (
    <Box
      style={{
        fontFamily: "'Onest', -apple-system, BlinkMacSystemFont, sans-serif",
        background: CANVAS,
        color: TEXT_MAIN,
      }}
    >
      {/* Header */}
      <Box
        component="header"
        py="md"
        px="xl"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(5,5,9,0.96)',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(148,163,184,0.3)',
        }}
      >
        <Container size="xl">
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <ThemeIcon
                size={40}
                radius="md"
                style={{
                  background: 'radial-gradient(circle at 20% 0%, #ffb347, #ff6a3d 60%, #1f2937 100%)',
                  boxShadow: '0 0 24px rgba(255,106,61,0.4)',
                }}
              >
                <IconChefHat size={22} color="#111827" />
              </ThemeIcon>
              <Box>
                <Text fw={800} size="xl" c={TEXT_MAIN}>
                  RestoApp
                </Text>
                <Text size="xs" c={TEXT_MUTED}>
                  Affordable technology for F&amp;B, retail, and delivery
                </Text>
              </Box>
            </Group>
            <Group gap="lg" visibleFrom="sm">
              <Button
                component="a"
                href="#features"
                variant="subtle"
                radius="xl"
                style={{ color: TEXT_MUTED, fontWeight: 500 }}
              >
                Product
              </Button>
              <Button
                component="a"
                href="#ecosystem"
                variant="subtle"
                radius="xl"
                style={{ color: TEXT_MUTED, fontWeight: 500 }}
              >
                Ecosystem
              </Button>
              <Button
                component="a"
                href="#workflow"
                variant="subtle"
                radius="xl"
                style={{ color: TEXT_MUTED, fontWeight: 500 }}
              >
                How it works
              </Button>
              <Button
                component="a"
                href="#contact"
                variant="subtle"
                radius="xl"
                style={{ color: TEXT_MUTED, fontWeight: 500 }}
              >
                Talk to us
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="subtle"
                radius="xl"
                style={{ color: ACCENT_SOFT, fontWeight: 600 }}
              >
                Sign in
              </Button>
              <Button
                component={Link}
                to="/register"
                radius="xl"
                style={{
                  background:
                    'linear-gradient(135deg, #ffb347 0%, #ff6a3d 40%, #e54721 100%)',
                  color: '#050509',
                  fontWeight: 700,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.65)',
                }}
              >
                Book a demo
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Hero — gradient center with product preview */}
      <Box
        py={96}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(ellipse 80% 70% at 50% 45%, rgba(234,88,12,0.2) 0%, rgba(234,88,12,0.06) 55%, transparent 75%), ${CANVAS}`,
        }}
      >
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            <Stack gap="lg">
              <Text size="sm" fw={600} tt="uppercase" c={ACCENT_SOFT} style={{ letterSpacing: 4 }}>
                The RestoApp Commerce Ecosystem
              </Text>
              <Title
                order={1}
                fw={700}
                c={TEXT_MAIN}
                style={{ fontSize: 'clamp(2.6rem, 6vw, 3.8rem)', lineHeight: 1.05 }}
              >
                Run every sale, shift, and store.
              </Title>
              <TypingText
                size="md"
                color={TEXT_MUTED}
                text="Affordable technology to unify F&B, retail, and delivery — without enterprise complexity or cost."
              />
              <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm" maw={420}>
                <Group gap={4}>
                  <ThemeIcon size={26} radius="xl" color="orange" variant="light">
                    <IconBolt size={16} />
                  </ThemeIcon>
                  <Text size="sm" c={TEXT_MUTED}>Launch in days</Text>
                </Group>
                <Group gap={4}>
                  <ThemeIcon size={26} radius="xl" color="orange" variant="light">
                    <IconUsersGroup size={16} />
                  </ThemeIcon>
                  <Text size="sm" c={TEXT_MUTED}>Designed with operators</Text>
                </Group>
                <Group gap={4}>
                  <ThemeIcon size={26} radius="xl" color="orange" variant="light">
                    <IconCash size={16} />
                  </ThemeIcon>
                  <Text size="sm" c={TEXT_MUTED}>Protect every margin</Text>
                </Group>
              </SimpleGrid>
              <Group gap="sm" mt="md">
                <Button component={Link} to="/register" color="orange" size="md">
                  Start with a demo
                </Button>
                <Button component={Link} to="/login" variant="outline" color="gray" size="md">
                  Sign in
                </Button>
              </Group>
              <Group gap="xs" mt="sm">
                <Text size="xs" c={TEXT_MUTED}>
                  Pre-Seed Fundraising · February 2026 ·
                </Text>
                <Text size="xs" c={TEXT_MUTED} style={{ opacity: 0.8 }}>
                  Live product, not a slide deck
                </Text>
              </Group>
            </Stack>
            <Box
              className="landing-hero-preview"
              style={{
                position: 'relative',
                maxWidth: 480,
                marginInline: 'auto',
              }}
            >
              <Box
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${HERO_IMAGE})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: 'scale(1.02)',
                }}
              />
              <Box
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(15,118,110,0.75) 50%, rgba(15,23,42,0.85) 100%)',
                }}
              />
              <Stack
                gap="md"
                p="xl"
                style={{ position: 'relative', zIndex: 1, height: '100%', justifyContent: 'space-between' }}
              >
                <Box>
                  <Text size="xs" fw={600} tt="uppercase" c={ACCENT_SOFT} style={{ letterSpacing: 3 }}>
                    Live Control Tower
                  </Text>
                  <Title order={3} c="white" fw={800} mt={4}>
                    See your food business as one connected system.
                  </Title>
                  <Text size="sm" c="rgba(226,232,240,0.9)" mt="xs" maw={420}>
                    From ingredient-level costs to channel performance, RestoApp gives operators a
                    single pane of glass for decisions that protect margins every day.
                  </Text>
                </Box>
                <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm">
                  <Metric label="Inventory variance" value="↓ 18%" />
                  <Metric label="Time to consolidate reports" value="− 12 hrs / week" />
                  <Metric label="Menu changes across channels" value="< 5 min" />
                </SimpleGrid>
              </Stack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Core systems */}
      <Box
        id="features"
        py={90}
        style={{
          background:
            'radial-gradient(circle at 0% 0%, rgba(255,180,71,0.12), transparent 55%), radial-gradient(circle at 100% 100%, rgba(15,23,42,0.85), transparent 55%), #050509',
        }}
      >
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap={4} ta="center">
              <Text size="sm" fw={600} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }}>
                Core systems
              </Text>
              <Title order={2} size={38} fw={800} c={TEXT_MAIN}>
                One platform for every core restaurant system.
              </Title>
              <Text size="lg" c={TEXT_MUTED} maw={640} mx="auto">
                RestoApp connects the core systems of a modern restaurant into one calm, real‑time view.
              </Text>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {CORE_FEATURES.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* Ecosystem map */}
      <Box
        id="ecosystem"
        py={90}
        style={{
          background:
            'radial-gradient(circle at 0% 0%, rgba(255,180,71,0.12), transparent 55%), radial-gradient(circle at 100% 100%, rgba(15,23,42,0.85), transparent 55%), #050509',
        }}
      >
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            <Stack gap="md">
              <Text size="sm" fw={600} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }}>
                Ecosystem
              </Text>
              <Title order={2} size={34} fw={800} c={TEXT_MAIN}>
                One connected platform for brands, branches, and channels.
              </Title>
              <Text size="md" c={TEXT_MUTED} maw={560}>
                A single, trusted data model keeps your channels, teams, and tools in sync.
              </Text>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="sm">
                <PillBlock title="Channels" items={['POS', 'Delivery', 'Pickup & web']} />
                <PillBlock title="Operations" items={['Inventory', 'Recipes', 'Purchasing']} />
                <PillBlock title="Finance" items={['COGS', 'Store P&L', 'Consolidated view']} />
                <PillBlock title="Leadership" items={['Brand dashboards', 'Expansion readiness']} />
              </SimpleGrid>
            </Stack>
            <Box
              p="xl"
              style={{
                borderRadius: 24,
                background:
                  'radial-gradient(circle at top left, rgba(255,180,71,0.25), transparent 60%), rgba(15,23,42,0.98)',
                color: 'white',
                boxShadow: '0 28px 70px rgba(15,23,42,0.55)',
              }}
            >
              <Stack gap="md">
                <Text size="sm" fw={600} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }}>
                  Designed for scale
                </Text>
                <Title order={3} fw={800}>
                  Built to grow with every new branch.
                </Title>
                <Text size="sm" c="rgba(226,232,240,0.9)">
                  Start with a single concept, then roll out to more stores, brands, and cities without
                  changing platforms.
                </Text>
              </Stack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Our Vision */}
      <Box
        id="vision"
        py={90}
        style={{
          background:
            'radial-gradient(circle at 0% 0%, rgba(255,180,71,0.12), transparent 55%), radial-gradient(circle at 100% 100%, rgba(15,23,42,0.85), transparent 55%), #050509',
        }}
      >
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" className="landing-stagger">
            <Stack gap="md">
              <TypingText
                size="md"
                color={TEXT_MUTED}
                text="RestoApp empowers restaurants to own their entire digital experience — from ordering to payment, loyalty to analytics."
              />
              <Stack gap={4}>
                <Text size="md" fw={500} c={TEXT_MAIN}>
                  Run your restaurant from one platform:
                </Text>
                <Text size="sm" c={TEXT_MUTED}>
                  ✔ Orders · ✔ Payments · ✔ Inventory · ✔ Loyalty · ✔ Analytics
                </Text>
              </Stack>
              <SimpleGrid cols={{ base: 1, md: 4 }} spacing="lg">
                <StepCard
                  step="01"
                  title="Set up"
                  description="Create brands, branches, and core recipes."
                />
                <StepCard
                  step="02"
                  title="Connect"
                  description="Link POS, delivery, and key tools."
                />
                <StepCard
                  step="03"
                  title="Operate"
                  description="Run shifts with live stock and menus."
                />
                <StepCard
                  step="04"
                  title="Review"
                  description="See performance and adjust quickly."
                />
              </SimpleGrid>
            </Stack>
            <Stack gap="md">
              <Text size="sm" fw={600} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }}>
                Operator reality today
              </Text>
              <Text size="sm" c={TEXT_MUTED}>
                Every new vendor adds cost and complexity. Operators juggle disconnected tools, each with its
                own log-in, fees, and blind spots.
              </Text>
              <Stack gap={6}>
                {[
                  'Expensive POS that locks them into hardware',
                  '30%+ delivery fees eroding margins',
                  'Disconnected tools that do not talk to each other',
                  'Siloed data with zero customer visibility',
                  'Multiple logins and training for every system',
                ].map((item) => (
                  <Group key={item} gap={6}>
                    <Text size="sm" c="#f97373">
                      ❌
                    </Text>
                    <Text size="xs" c={TEXT_MUTED}>
                      {item}
                    </Text>
                  </Group>
                ))}
              </Stack>
              <Spoiler maxHeight={52} showLabel="Read full problem" hideLabel="Show less">
                <Text size="sm" c={TEXT_MUTED}>
                  Each vendor extracts 2–30% in fees and creates yet another data silo. There is no single
                  source of truth, and staff must be trained on five or more interfaces just to keep service
                  running.
                </Text>
              </Spoiler>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA / contact */}
      <Box
        id="contact"
        py={90}
        style={{
          background:
            'radial-gradient(circle at 0% 0%, rgba(255,180,71,0.12), transparent 55%), radial-gradient(circle at 100% 100%, rgba(15,23,42,0.85), transparent 55%), #050509',
        }}
      >
        <Container size="lg">
          <Box
            p="xl"
            style={{
              borderRadius: 24,
              background: CANVAS_SOFT,
              border: '1px solid rgba(148,163,184,0.3)',
            }}
          >
            <Stack gap="lg" align="center" ta="center">
              <Text size="sm" fw={600} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }}>
                Let&apos;s design your RestoApp rollout
              </Text>
              <Title order={2} c="white" fw={800}>
                See RestoApp working with your data.
              </Title>
              <Text size="md" c="rgba(226,232,240,0.9)" maw={520}>
                A short call where we plug your real world into a live workspace — no slides.
              </Text>
              <Group gap="md" mt="sm">
                <Button
                  component={Link}
                  to="/register"
                  size="lg"
                  radius="xl"
                  style={{
                    paddingInline: 24,
                    borderRadius: 999,
                    background:
                      'linear-gradient(135deg, #ffb347 0%, #ff6a3d 40%, #e54721 100%)',
                    color: '#050509',
                    fontWeight: 700,
                  }}
                >
                  Book a rollout session
                </Button>
                <Button component={Link} to="/login" size="lg" radius="xl" variant="outline" color="gray">
                  Already a customer? Sign in
                </Button>
              </Group>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Why Now */}
      <Box
        py={90}
        style={{
          background:
            'radial-gradient(circle at 0% 0%, rgba(255,180,71,0.12), transparent 55%), radial-gradient(circle at 100% 100%, rgba(15,23,42,0.85), transparent 55%), #050509',
        }}
      >
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap={4}>
              <Text size="sm" fw={600} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }}>
                Why now?
              </Text>
              <Title order={2} size={32} fw={800} c={TEXT_MAIN}>
                The convergence layer between commerce, fintech, and F&amp;B operations.
              </Title>
            </Stack>
            <SimpleGrid className="landing-stagger" cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {[
                "Restaurants want control — customer relationships shouldn't be owned by delivery platforms",
                'Delivery platforms compress margins — 30% commission is unsustainable',
                'Shopify normalized e-commerce — restaurants expect similar unified commerce tools',
                'Hardware is cheaper than ever — tablets and kiosks are commoditized',
                'Embedded fintech revolution — payment rails transform SaaS margin structure',
                'Multi-location needs visibility — operators need centralized data and control',
              ].map((item) => (
                <Card key={item.slice(0, 24)} className="landing-card" p="md">
                  <Text size="sm" c={TEXT_MUTED}>
                    {item}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* The Solution */}
      <Box
        id="solution"
        py={90}
        style={{
          background:
            'radial-gradient(circle at 0% 0%, rgba(255,180,71,0.12), transparent 55%), radial-gradient(circle at 100% 100%, rgba(15,23,42,0.85), transparent 55%), #050509',
        }}
      >
        <Container size="xl">
          <SectionHeader
            label="The Solution"
            title="RestoApp unifies the stack"
            description="One platform. Complete control. Zero fragmentation."
          />
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" className="landing-stagger">
            <Stack gap="md">
              <Stack gap={6}>
                {[
                  'Scan from phone — no hardware required',
                  'Order & pay in seconds at the table',
                  'Kitchen receives clean, accurate tickets',
                  'Operators see real-time sales & labor',
                  'Customers earn rewards automatically',
                ].map((item) => (
                  <Group key={item} gap={8}>
                    <Text size="sm" c={ACCENT}>
                      ✔
                    </Text>
                    <Text size="xs" c={TEXT_MUTED}>
                      {item}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Stack>
            <Stack gap="sm">
              <Text size="xs" fw={500} c={TEXT_MUTED}>
                How it flows
              </Text>
              <Group
                gap={8}
                align="center"
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: '#020617',
                  border: '1px solid rgba(148,163,184,0.35)',
                }}
              >
                {['Scan', 'Order', 'Pay', 'Kitchen', 'Analytics'].map((step, index, arr) => (
                  <Group key={step} gap={4}>
                    <Box
                      style={{
                        padding: '6px 10px',
                        borderRadius: 999,
                        background:
                          index === arr.length - 1
                            ? 'linear-gradient(135deg, rgba(34,197,94,0.9), rgba(22,163,74,0.95))'
                            : 'rgba(15,23,42,0.9)',
                        border: '1px solid rgba(148,163,184,0.5)',
                      }}
                    >
                      <Text size="xs" c={index === arr.length - 1 ? '#f9fafb' : TEXT_MUTED}>
                        {step}
                      </Text>
                    </Box>
                    {index < arr.length - 1 && (
                      <Text size="xs" c={TEXT_MUTED}>
                        →
                      </Text>
                    )}
                  </Group>
                ))}
              </Group>
              <Box mt="xl">
                <KioskDemo />
              </Box>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* End page wrapper */}
    </Box>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Box
      component="article"
      p="lg"
      style={{
        background:
          'radial-gradient(circle at 0% 0%, rgba(255,180,71,0.18), transparent 60%), #020617',
        borderRadius: 18,
        border: '1px solid rgba(148,163,184,0.5)',
        boxShadow: '0 18px 45px rgba(0,0,0,0.85)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 26px 70px rgba(0,0,0,0.95)';
        e.currentTarget.style.borderColor = 'rgba(255,106,61,0.9)';
      }}
      onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 18px 45px rgba(0,0,0,0.85)';
        e.currentTarget.style.borderColor = 'rgba(148,163,184,0.5)';
      }}
    >
      <Stack gap="sm">
        <ThemeIcon
          size={38}
          radius="md"
          style={{
            background: 'rgba(255,106,61,0.12)',
            color: ACCENT_SOFT,
            alignSelf: 'flex-start',
          }}
        >
          {feature.icon}
        </ThemeIcon>
        <Title order={4} size="h4" c={TEXT_MAIN}>
          {feature.title}
        </Title>
        <Text size="sm" c={TEXT_MUTED}>
          {feature.description}
        </Text>
      </Stack>
    </Box>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Box
      p="sm"
      style={{
        borderRadius: 12,
        background: 'rgba(15,23,42,0.9)',
        border: '1px solid rgba(148,163,184,0.6)',
      }}
    >
      <Text size="xs" c="rgba(148,163,184,0.9)">
        {label}
      </Text>
      <Text size="sm" fw={600} c={TEXT_MAIN}>
        {value}
      </Text>
    </Box>
  );
}

function PillBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <Stack
      gap={6}
      p="md"
      style={{
        borderRadius: 16,
        background: '#020617',
        border: '1px solid rgba(31,41,55,0.9)',
      }}
    >
      <Text size="xs" fw={600} tt="uppercase" c={ACCENT_SOFT} style={{ letterSpacing: 2 }}>
        {title}
      </Text>
      {items.map((item) => (
        <Text key={item} size="xs" c={TEXT_MUTED}>
          {item}
        </Text>
      ))}
    </Stack>
  );
}

function StepCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <Stack
      gap="sm"
      p="lg"
      style={{
        background: '#020617',
        borderRadius: 18,
        border: '1px solid rgba(31,41,55,0.9)',
      }}
    >
      <Text size="xs" fw={700} tt="uppercase" c={ACCENT_SOFT} style={{ letterSpacing: 3 }}>
        Step {step}
      </Text>
      <Text fw={700} c={TEXT_MAIN}>
        {title}
      </Text>
      <Text size="sm" c={TEXT_MUTED}>
        {description}
      </Text>
    </Stack>
  );
}

function TypingText({ text, size = 'sm', color }: { text: string; size?: string; color?: string }) {
  return (
    <Text size={size} c={color} style={{ maxWidth: 640 }}>
      {text}
    </Text>
  );
}

function SectionHeader({ label, title, description }: { label: string; title: string; description?: string }) {
  return (
    <Stack gap={4} mb="xl">
      <Text size="sm" fw={600} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }}>
        {label}
      </Text>
      <Title order={2} size={32} fw={800} c={TEXT_MAIN}>
        {title}
      </Title>
      {description && (
        <Text size="sm" c={TEXT_MUTED} maw={560}>
          {description}
        </Text>
      )}
    </Stack>
  );
}

function KioskDemo() {
  return (
    <Box
      p="lg"
      style={{
        borderRadius: 20,
        background:
          'radial-gradient(circle at 0% 0%, rgba(255,180,71,0.14), transparent 55%), #020617',
        border: '1px solid rgba(148,163,184,0.5)',
      }}
    >
      <Stack gap="xs">
        <Text size="xs" fw={600} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }}>
          Kiosk &amp; table ordering
        </Text>
        <Text size="sm" c={TEXT_MUTED}>
          Interactive demo placeholder — showcasing how guests scan, browse the menu, and pay
          without waiting for a terminal.
        </Text>
      </Stack>
    </Box>
  );
}

