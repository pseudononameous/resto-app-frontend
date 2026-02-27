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
} from '@mantine/core';
import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  IconChefHat,
  IconArrowLeft,
  IconQrcode,
  IconDeviceTablet,
  IconCreditCard,
  IconGift,
  IconChartBar,
  IconMenu2,
  IconTruck,
  IconShoppingCart,
  IconBellRinging,
  IconRefresh,
  IconLayoutDashboard,
  IconUsers,
  IconDatabase,
  IconCurrencyDollar,
  IconPlug,
  IconBuildingStore,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

const CANVAS = '#050509';
const TEXT_MAIN = '#f9fafb';
const TEXT_MUTED = '#9ca3af';
const ACCENT_SOFT = '#fb923c';
const BORDER = 'rgba(255,255,255,0.08)';
const CARD_BG = 'rgba(255,255,255,0.04)';

function SectionLabel({ children }: { children: string }) {
  return (
    <Text size="sm" fw={600} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }}>
      {children}
    </Text>
  );
}

function SectionTitle({ children, maw }: { children: React.ReactNode; maw?: number }) {
  return (
    <Title
      order={2}
      fw={800}
      c={TEXT_MAIN}
      style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: -1, maxWidth: maw ?? 680 }}
    >
      {children}
    </Title>
  );
}

function Divider() {
  return <Box style={{ borderTop: `1px solid ${BORDER}` }} />;
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <Box
      p="lg"
      ta="center"
      style={{ borderRadius: 16, background: CARD_BG, border: `1px solid ${BORDER}` }}
    >
      <Title order={2} fw={800} c={ACCENT_SOFT} style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', letterSpacing: -1 }}>
        {value}
      </Title>
      <Text size="sm" c={TEXT_MUTED} mt={4}>{label}</Text>
    </Box>
  );
}

function FeatureChip({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Box
      p="lg"
      style={{
        borderRadius: 16, background: CARD_BG, border: `1px solid ${BORDER}`,
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.45)'; }}
      onMouseLeave={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = BORDER; }}
    >
      <ThemeIcon size={40} radius="md" mb="sm" style={{ background: 'rgba(249,115,22,0.12)', color: ACCENT_SOFT }}>
        {icon}
      </ThemeIcon>
      <Text fw={700} c={TEXT_MAIN} mb={4}>{title}</Text>
      <Text size="sm" c={TEXT_MUTED}>{description}</Text>
    </Box>
  );
}

export default function PitchDeckPage() {
  return (
    <Box style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: CANVAS, color: TEXT_MAIN, minHeight: '100vh' }}>

      {/* Nav */}
      <Box
        component="header" py="md" px="xl"
        style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(5,5,9,0.9)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${BORDER}` }}
      >
        <Container size="xl">
          <Group justify="space-between">
            <Group gap="xs">
              <ThemeIcon size={34} radius="md" style={{ background: 'linear-gradient(135deg,#fb923c,#ea580c)', boxShadow: '0 0 16px rgba(249,115,22,0.4)' }}>
                <IconChefHat size={18} color="#050509" />
              </ThemeIcon>
              <Text fw={800} size="lg" c={TEXT_MAIN}>RestoApp</Text>
            </Group>
            <Group gap="sm">
              <Button component={Link} to="/" leftSection={<IconArrowLeft size={14} />} variant="subtle" size="sm" style={{ color: TEXT_MUTED }}>
                Back to home
              </Button>
              <Button component={Link} to="/register" size="sm" radius="md" style={{ background: 'linear-gradient(135deg,#fb923c,#ea580c)', color: '#050509', fontWeight: 700 }}>
                Book a Demo
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* ── Cover ── */}
      <Box
        py={100}
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 40%, rgba(249,115,22,0.2) 0%, rgba(249,115,22,0.05) 50%, transparent 70%), ${CANVAS}`,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <Container size="md">
          <Stack gap="lg" align="center" ta="center">
            <Box style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.35)' }}>
              <Box style={{ width: 8, height: 8, borderRadius: '50%', background: '#fb923c', boxShadow: '0 0 8px rgba(251,146,60,0.8)' }} />
              <Text size="sm" fw={600} c={ACCENT_SOFT}>Pre-Seed Fundraising Deck · February 2026</Text>
            </Box>
            <Title order={1} fw={800} c={TEXT_MAIN} style={{ fontSize: 'clamp(3rem,8vw,5.5rem)', letterSpacing: -2, lineHeight: 1.0 }}>
              RestoApp
            </Title>
            <Text size="xl" c={TEXT_MUTED} maw={560} style={{ lineHeight: 1.6 }}>
              Affordable technology to revolutionize F&amp;B, Retail and delivery.
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" w="100%" maw={560} mt="md">
              <StatBadge value="90%+" label="Labor Cost Reduction" />
              <StatBadge value="100%" label="Data Ownership" />
              <StatBadge value="$0" label="Printing Costs" />
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* ── Our Vision ── */}
      <Box py={96}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm">
              <SectionLabel>Our Vision</SectionLabel>
              <SectionTitle>RestoApp is the unified operating system that empowers restaurants to own their entire digital experience.</SectionTitle>
              <Text size="lg" c={TEXT_MUTED} maw={640}>
                From ordering to payment, loyalty to analytics — all in one seamless platform.
              </Text>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              {[
                { value: '90%+', label: 'Labor Cost Reduction' },
                { value: '100%', label: 'Data Ownership' },
                { value: 'Zero', label: 'Printing Costs' },
              ].map((s) => <StatBadge key={s.label} value={s.value} label={s.label} />)}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── The Problem ── */}
      <Box py={96}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm">
              <SectionLabel>The Problem</SectionLabel>
              <SectionTitle>Restaurants are stuck in a fractured tech stack</SectionTitle>
              <Text size="lg" c={TEXT_MUTED} maw={600}>
                Restaurant must manage every tool separately — and each layer costs them.
              </Text>
            </Stack>

            {/* Fragmented stack */}
            <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }} spacing="md">
              {[
                { name: 'POS Systems', pain: 'Expensive, inflexible' },
                { name: 'Kiosks', pain: 'Separate vendor' },
                { name: 'Delivery Platforms', pain: '30% margin hit' },
                { name: 'Loyalty Programs', pain: 'Third-party fees' },
                { name: 'Payment Processing', pain: 'High fees' },
                { name: 'Online Ordering', pain: 'No integration' },
                { name: 'Inventory', pain: 'Siloed data' },
                { name: 'QR Ordering', pain: 'Separate system' },
              ].map((item) => (
                <Box key={item.name} p="md" style={{ borderRadius: 14, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <Text fw={600} c={TEXT_MAIN} size="sm">{item.name}</Text>
                  <Text size="xs" c="rgba(248,113,113,0.9)" mt={4}>{item.pain}</Text>
                </Box>
              ))}
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
              {[
                { title: 'Takes Margin', body: 'Every vendor extracts 2–30% in fees' },
                { title: 'Fragments Data', body: 'No single source of truth for analytics' },
                { title: 'Reduces Ownership', body: 'Customer relationships locked in silos' },
                { title: 'Adds Complexity', body: 'Staff trained on 5+ different systems' },
              ].map((c) => (
                <Box key={c.title} p="lg" style={{ borderRadius: 16, background: CARD_BG, border: `1px solid ${BORDER}` }}>
                  <Text fw={700} c={ACCENT_SOFT} mb="xs">{c.title}</Text>
                  <Text size="sm" c={TEXT_MUTED}>{c.body}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── Why Now ── */}
      <Box py={96} style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 65%), ${CANVAS}` }}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm">
              <SectionLabel>Why Now?</SectionLabel>
              <SectionTitle>The convergence layer between commerce, fintech, and F&amp;B operations</SectionTitle>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              {[
                { title: 'Restaurants Want Control', body: "Customer relationships shouldn't be owned by delivery platforms" },
                { title: 'Delivery Platforms Compress Margins', body: '30% commission is unsustainable for most operators' },
                { title: 'Shopify Normalized E-commerce', body: 'Restaurants expect similar unified commerce tools' },
                { title: 'Hardware is Cheaper Than Ever', body: 'Tablets and kiosks are now commoditized' },
                { title: 'Embedded Fintech Revolution', body: 'Payment rails transform SaaS margin structure' },
                { title: 'Multi-Location Needs Visibility', body: 'Operators need centralized data and control' },
              ].map((c) => (
                <Box key={c.title} p="lg"
                  style={{ borderRadius: 16, background: CARD_BG, border: `1px solid ${BORDER}`, transition: 'border-color 0.2s' }}
                  onMouseEnter={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'; }}
                  onMouseLeave={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = BORDER; }}
                >
                  <Text fw={700} c={TEXT_MAIN} mb="xs">{c.title}</Text>
                  <Text size="sm" c={TEXT_MUTED}>{c.body}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── The Solution ── */}
      <Box py={96}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm" align="center" ta="center">
              <SectionLabel>The Solution</SectionLabel>
              <SectionTitle maw={560}>RestoApp unifies the stack</SectionTitle>
              <Text size="lg" c={TEXT_MUTED}>One platform. Complete control. Zero fragmentation.</Text>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              <FeatureChip icon={<IconQrcode size={20} />} title="QR Code Ordering" description="Customers scan, browse, and order from their phones" />
              <FeatureChip icon={<IconDeviceTablet size={20} />} title="Kiosk Integration" description="Self-service stations for fast-casual environments" />
              <FeatureChip icon={<IconCreditCard size={20} />} title="Integrated Payments" description="Built-in merchant processing with better economics" />
              <FeatureChip icon={<IconGift size={20} />} title="Loyalty Programs" description="Native rewards system without third-party fees" />
              <FeatureChip icon={<IconChartBar size={20} />} title="Analytics Dashboard" description="Real-time insights and customer data ownership" />
              <FeatureChip icon={<IconMenu2 size={20} />} title="Dynamic Menus" description="Update prices and items instantly, no printing costs" />
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── Platform Features ── */}
      <Box py={96} style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 65%), ${CANVAS}` }}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm" align="center" ta="center">
              <SectionLabel>Platform Features</SectionLabel>
              <SectionTitle maw={560}>Everything restaurants need in one unified platform</SectionTitle>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
              {[
                { icon: <IconGift size={18} />, title: 'Rewards Program', desc: 'Native loyalty system to drive repeat visits' },
                { icon: <IconTruck size={18} />, title: 'Delivery Sync', desc: 'Sync menus to DoorDash, Grubhub, Uber Eats, Postmates' },
                { icon: <IconCreditCard size={18} />, title: 'Payment Gateways', desc: 'Multiple payment options integrated seamlessly' },
                { icon: <IconShoppingCart size={18} />, title: 'Gift Cards', desc: 'Digital gift card management and tracking' },
                { icon: <IconChartBar size={18} />, title: 'Inventory Control', desc: 'Real-time inventory tracking and management' },
                { icon: <IconCurrencyDollar size={18} />, title: 'No Tips Required', desc: 'But optional tipping available when desired' },
                { icon: <IconRefresh size={18} />, title: 'Shopify Sync', desc: 'Integrate with web systems and e-commerce' },
                { icon: <IconBellRinging size={18} />, title: 'Push Notifications', desc: 'New marketing channel for promos & updates' },
                { icon: <IconLayoutDashboard size={18} />, title: 'Order Sync', desc: 'Unified delivery order management across platforms' },
                { icon: <IconMenu2 size={18} />, title: 'Menu Clarity', desc: 'Instant updates, changes, promos & inventory' },
                { icon: <IconCurrencyDollar size={18} />, title: 'Promos & Discounts', desc: 'Dynamic pricing and promotional campaigns' },
                { icon: <IconDeviceTablet size={18} />, title: 'Multi-Platform', desc: 'Works on QR codes, kiosks, and web' },
              ].map((f) => (
                <Box key={f.title} p="md" style={{ borderRadius: 14, background: CARD_BG, border: `1px solid ${BORDER}`, transition: 'border-color 0.2s' }}
                  onMouseEnter={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'; }}
                  onMouseLeave={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = BORDER; }}
                >
                  <ThemeIcon size={34} radius="md" mb="sm" style={{ background: 'rgba(249,115,22,0.12)', color: ACCENT_SOFT }}>{f.icon}</ThemeIcon>
                  <Text fw={600} c={TEXT_MAIN} size="sm" mb={4}>{f.title}</Text>
                  <Text size="xs" c={TEXT_MUTED}>{f.desc}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── Operations Impact ── */}
      <Box py={96}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm">
              <SectionLabel>Operations Impact</SectionLabel>
              <SectionTitle>How RestoApp transforms day-to-day restaurant operations</SectionTitle>
            </Stack>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              {/* Traditional */}
              <Box p="xl" style={{ borderRadius: 20, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <Text fw={700} c="rgba(248,113,113,0.9)" mb="lg" size="lg">Traditional Restaurant</Text>
                <Stack gap="md">
                  {[
                    { title: 'High Staff Requirements', desc: 'Multiple servers, hosts, runners per shift' },
                    { title: 'Long Wait Times', desc: '15–30 min from order to table, frustrated customers' },
                    { title: 'Menu Update Nightmare', desc: "Expensive reprinting, outdated prices, 86'd items confusion" },
                    { title: 'No Customer Data', desc: 'Zero insights into preferences, visit frequency, or habits' },
                    { title: 'Delivery Platform Dependence', desc: '30% fees, fragmented orders, no customer relationship' },
                  ].map((item) => (
                    <Group key={item.title} gap="sm" align="flex-start">
                      <IconX size={16} color="rgba(248,113,113,0.8)" style={{ marginTop: 3, flexShrink: 0 }} />
                      <Box>
                        <Text size="sm" fw={600} c={TEXT_MAIN}>{item.title}</Text>
                        <Text size="xs" c={TEXT_MUTED}>{item.desc}</Text>
                      </Box>
                    </Group>
                  ))}
                </Stack>
              </Box>
              {/* With RestoApp */}
              <Box p="xl" style={{ borderRadius: 20, background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.3)' }}>
                <Text fw={700} c={ACCENT_SOFT} mb="lg" size="lg">With RestoApp</Text>
                <Stack gap="md">
                  {[
                    { title: 'Minimal Staff Needed', desc: '90% reduction in server roles, focus on food prep & experience' },
                    { title: 'Instant Service', desc: 'Order placed in 2 minutes, faster table turns, higher revenue' },
                    { title: 'Real-Time Menu Control', desc: 'Update prices, add promos, mark out-of-stock items instantly' },
                    { title: 'Rich Customer Insights', desc: 'Track preferences, build profiles, push targeted promotions' },
                    { title: 'Unified Delivery Management', desc: 'Sync with all platforms, single dashboard, lower overhead' },
                  ].map((item) => (
                    <Group key={item.title} gap="sm" align="flex-start">
                      <IconCheck size={16} color={ACCENT_SOFT} style={{ marginTop: 3, flexShrink: 0 }} />
                      <Box>
                        <Text size="sm" fw={600} c={TEXT_MAIN}>{item.title}</Text>
                        <Text size="xs" c={TEXT_MUTED}>{item.desc}</Text>
                      </Box>
                    </Group>
                  ))}
                </Stack>
              </Box>
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── Benefits ── */}
      <Box py={96} style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 65%), ${CANVAS}` }}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm" align="center" ta="center">
              <SectionLabel>Benefits &amp; Advantages</SectionLabel>
              <SectionTitle maw={600}>Measurable impact on restaurant operations and profitability</SectionTitle>
            </Stack>
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
              {[
                { value: '60%', label: 'Faster Order-to-Table' },
                { value: '$0', label: 'Menu Printing Costs' },
                { value: '24/7', label: 'Instant Menu Updates' },
                { value: '100%', label: 'Order Accuracy' },
              ].map((s) => <StatBadge key={s.label} value={s.value} label={s.label} />)}
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
              {[
                { title: 'Reduce Staffing Needs', desc: 'Up to 90% reduction in server requirements with self-service ordering' },
                { title: 'Lower Liability & Legal Risk', desc: 'Reduced staff interaction minimizes legal concerns and HR issues' },
                { title: 'Faster Table Turnover', desc: 'Instant ordering and payment = lower wait times, more customers served' },
                { title: 'Operational Cost Savings', desc: 'Zero printing costs, lower training expenses, reduced overhead' },
              ].map((c) => (
                <Box key={c.title} p="lg" style={{ borderRadius: 16, background: CARD_BG, border: `1px solid ${BORDER}` }}>
                  <Text fw={700} c={TEXT_MAIN} mb="xs">{c.title}</Text>
                  <Text size="sm" c={TEXT_MUTED}>{c.desc}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── Product Architecture ── */}
      <Box py={96}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm" align="center" ta="center">
              <SectionLabel>Product Architecture</SectionLabel>
              <SectionTitle maw={540}>Five layers, one unified platform</SectionTitle>
            </Stack>
            <Stack gap="sm" maw={720} mx="auto" w="100%">
              {[
                { icon: <IconUsers size={18} />, layer: 'Customer Experience Layer', items: 'QR Ordering · Kiosk Interface · Mobile Web App · Payment Flow' },
                { icon: <IconBuildingStore size={18} />, layer: 'Restaurant Management Layer', items: 'Menu Management · Table Management · Order Tracking · Staff Tools' },
                { icon: <IconDatabase size={18} />, layer: 'Data & Analytics Layer', items: 'Customer Profiles · Sales Analytics · Inventory Tracking · Performance Metrics' },
                { icon: <IconCreditCard size={18} />, layer: 'Commerce & Payment Layer', items: 'Merchant Processing · Loyalty Engine · Promo/Discount System · Tipping' },
                { icon: <IconPlug size={18} />, layer: 'Integration Layer (Future)', items: 'POS Integration · Delivery Platforms · Accounting · CRM Systems' },
              ].map((l, i) => (
                <Box key={l.layer} px="xl" py="md"
                  style={{
                    borderRadius: 14,
                    background: i === 0 ? 'rgba(249,115,22,0.12)' : CARD_BG,
                    border: `1px solid ${i === 0 ? 'rgba(249,115,22,0.4)' : BORDER}`,
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}
                >
                  <ThemeIcon size={36} radius="md" style={{ background: 'rgba(249,115,22,0.15)', color: ACCENT_SOFT, flexShrink: 0 }}>{l.icon}</ThemeIcon>
                  <Box>
                    <Text fw={700} c={TEXT_MAIN} size="sm">{l.layer}</Text>
                    <Text size="xs" c={TEXT_MUTED}>{l.items}</Text>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── Wedge Strategy ── */}
      <Box py={96} style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 65%), ${CANVAS}` }}>
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={64}>
            <Stack gap="xl" justify="center">
              <Stack gap="sm">
                <SectionLabel>Our Wedge Strategy</SectionLabel>
                <SectionTitle>We start with fast-casual, multi-location operators</SectionTitle>
                <Text size="md" c={TEXT_MUTED}>We're not trying to build the ocean on day one.</Text>
              </Stack>
              <Box p="xl" style={{ borderRadius: 20, background: CARD_BG, border: `1px solid ${BORDER}` }}>
                <Text fw={700} c={ACCENT_SOFT} mb="md">Fast-Casual Chains (3–20 locations)</Text>
                <Stack gap="sm">
                  {['High order volume', 'Standardized menus', 'Limited server dependency', 'Tech-forward mindset'].map((b) => (
                    <Group key={b} gap={8}>
                      <IconCheck size={14} color={ACCENT_SOFT} />
                      <Text size="sm" c={TEXT_MUTED}>{b}</Text>
                    </Group>
                  ))}
                </Stack>
              </Box>
              <Text size="sm" c={TEXT_MUTED} style={{ fontStyle: 'italic' }}>
                "These operators are sophisticated enough to understand the value, but small enough to move quickly."
              </Text>
            </Stack>
            <Stack gap="md" justify="center">
              <Text fw={700} c={TEXT_MAIN} mb="sm">Expansion Path</Text>
              {[
                { num: '1', title: 'Prove Unit Economics', sub: '5–10 pilot restaurants' },
                { num: '2', title: 'Expand to QSR', sub: 'High-volume, simple menus' },
                { num: '3', title: 'Add Casual Dining', sub: 'More complex operations' },
                { num: '4', title: 'Ghost Kitchens & Franchises', sub: 'Digital-native operators' },
              ].map((step, i) => (
                <Group key={step.num} gap="md" align="flex-start">
                  <Box style={{ width: 32, height: 32, borderRadius: '50%', background: i === 0 ? 'linear-gradient(135deg,#fb923c,#ea580c)' : 'rgba(249,115,22,0.12)', border: `1px solid ${i === 0 ? 'transparent' : 'rgba(249,115,22,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Text size="sm" fw={700} c={i === 0 ? '#050509' : ACCENT_SOFT}>{step.num}</Text>
                  </Box>
                  <Box>
                    <Text fw={600} c={TEXT_MAIN} size="sm">{step.title}</Text>
                    <Text size="xs" c={TEXT_MUTED}>{step.sub}</Text>
                  </Box>
                </Group>
              ))}
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>

      <Divider />

      {/* ── Market Opportunity ── */}
      <Box py={96}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm">
              <SectionLabel>Market Opportunity</SectionLabel>
              <SectionTitle>A $52B market ready for disruption</SectionTitle>
            </Stack>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={48}>
              <Stack gap="md">
                <Text fw={700} c={TEXT_MAIN}>Market Dynamics</Text>
                <Stack gap="sm">
                  {[
                    '660,000 restaurants in the US',
                    'Growing digital adoption post-COVID',
                    '70% want to reduce delivery fees',
                    'Direct ordering is increasingly priority',
                    '$120B in digital orders annually',
                    'Labor costs up 15% YoY — automation is economic necessity',
                  ].map((item) => (
                    <Group key={item} gap={8}>
                      <Box style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT_SOFT, flexShrink: 0, marginTop: 6 }} />
                      <Text size="sm" c={TEXT_MUTED}>{item}</Text>
                    </Group>
                  ))}
                </Stack>
              </Stack>
              <Stack gap="md">
                <SimpleGrid cols={1} spacing="sm">
                  {[
                    { label: 'TAM', value: '$52B', desc: 'Total US Restaurant Tech Market' },
                    { label: 'SAM', value: '$18B', desc: 'Fast-casual & QSR segments' },
                    { label: 'SOM', value: '$2.4B', desc: 'Multi-location operators' },
                  ].map((m) => (
                    <Box key={m.label} px="xl" py="md" style={{ borderRadius: 14, background: CARD_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Group gap="md">
                        <Text size="xs" fw={700} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 2, minWidth: 36 }}>{m.label}</Text>
                        <Text size="sm" c={TEXT_MUTED}>{m.desc}</Text>
                      </Group>
                      <Title order={3} fw={800} c={TEXT_MAIN} style={{ fontSize: '1.4rem' }}>{m.value}</Title>
                    </Box>
                  ))}
                </SimpleGrid>
                <Box p="lg" style={{ borderRadius: 16, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.3)' }}>
                  <Text fw={700} c={ACCENT_SOFT} mb="xs">The Shopify Parallel</Text>
                  <Text size="sm" c={TEXT_MUTED}>Shopify captured 10% of e-commerce. If RestoApp captures just 5% of restaurant tech, that's a <Text component="span" fw={700} c={TEXT_MAIN}>$2.6B opportunity</Text>.</Text>
                </Box>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── Competitive Landscape ── */}
      <Box py={96} style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 65%), ${CANVAS}` }}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm" align="center" ta="center">
              <SectionLabel>Competitive Landscape</SectionLabel>
              <SectionTitle maw={560}>"Why will this beat Toast or Square?"</SectionTitle>
              <Text size="lg" c={TEXT_MUTED}>We're not competing — we're complementing and unifying.</Text>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              {[
                { name: 'Toast / Square', color: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', textColor: 'rgba(248,113,113,0.9)', items: ['POS-centric thinking', 'Hardware lock-in', 'High upfront costs', 'Limited customization'], bad: true },
                { name: 'DoorDash', color: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', textColor: 'rgba(248,113,113,0.9)', items: ['You don\'t own customer data', '30% commission', 'Zero data sharing', 'Delivery-only'], bad: true },
                { name: 'RestoApp', color: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.4)', textColor: ACCENT_SOFT, items: ['Unification layer', 'Software-first', 'Low-cost SaaS', 'Fully modular'], bad: false },
              ].map((comp) => (
                <Box key={comp.name} p="xl" style={{ borderRadius: 20, background: comp.color, border: `1px solid ${comp.border}` }}>
                  <Text fw={800} c={comp.textColor} size="lg" mb="lg">{comp.name}</Text>
                  <Stack gap="sm">
                    {comp.items.map((item) => (
                      <Group key={item} gap={8}>
                        {comp.bad ? <IconX size={14} color="rgba(248,113,113,0.8)" /> : <IconCheck size={14} color={ACCENT_SOFT} />}
                        <Text size="sm" c={comp.bad ? TEXT_MUTED : TEXT_MAIN}>{item}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md" mt="sm">
              {[
                { title: 'Modular System', desc: 'Pick what you need — Flexibility' },
                { title: 'Multi-Channel', desc: 'QR, kiosk, online unified' },
                { title: 'Aligned Economics', desc: 'No upfront hardware' },
                { title: '100% Data Ownership', desc: 'Full customer insights' },
              ].map((d) => (
                <Box key={d.title} p="md" style={{ borderRadius: 14, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)' }}>
                  <Text fw={700} c={ACCENT_SOFT} size="sm" mb={4}>{d.title}</Text>
                  <Text size="xs" c={TEXT_MUTED}>{d.desc}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── Business Model ── */}
      <Box py={96}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm">
              <SectionLabel>Business Model</SectionLabel>
              <SectionTitle>Three revenue streams with strong unit economics</SectionTitle>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              {[
                { num: '1', title: 'SaaS Subscription', value: '$99–299/mo', desc: 'Per location. Tiered: Basic, Pro, Enterprise. 80% SaaS margin.' },
                { num: '2', title: 'Payment Processing', value: '0.5–1.0% GMV', desc: 'Embedded merchant services with better economics.' },
                { num: '3', title: 'Premium Add-Ons', value: '$50–150/mo', desc: 'Advanced analytics, loyalty upgrades, delivery (future).' },
              ].map((r) => (
                <Box key={r.num} p="xl" style={{ borderRadius: 20, background: CARD_BG, border: `1px solid ${BORDER}` }}>
                  <Text size="xs" fw={700} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }} mb="sm">{r.num}</Text>
                  <Text fw={700} c={TEXT_MAIN} size="lg" mb="xs">{r.title}</Text>
                  <Title order={3} fw={800} c={ACCENT_SOFT} mb="sm" style={{ fontSize: '1.6rem' }}>{r.value}</Title>
                  <Text size="sm" c={TEXT_MUTED}>{r.desc}</Text>
                </Box>
              ))}
            </SimpleGrid>
            <Box p="xl" style={{ borderRadius: 20, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.3)' }}>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                <Box>
                  <Text size="xs" c={TEXT_MUTED} tt="uppercase" style={{ letterSpacing: 2 }}>Avg Order</Text>
                  <Title order={3} fw={800} c={TEXT_MAIN} mt={4}>$25</Title>
                </Box>
                <Box>
                  <Text size="xs" c={TEXT_MUTED} tt="uppercase" style={{ letterSpacing: 2 }}>Orders/Day/Location</Text>
                  <Title order={3} fw={800} c={TEXT_MAIN} mt={4}>200</Title>
                </Box>
                <Box>
                  <Text size="xs" c={TEXT_MUTED} tt="uppercase" style={{ letterSpacing: 2 }}>Total Monthly (10 loc.)</Text>
                  <Title order={3} fw={800} c={ACCENT_SOFT} mt={4}>$5,790</Title>
                </Box>
                <Box>
                  <Text size="xs" c={TEXT_MUTED} tt="uppercase" style={{ letterSpacing: 2 }}>Annual per Customer</Text>
                  <Title order={3} fw={800} c={ACCENT_SOFT} mt={4}>$69,480</Title>
                </Box>
              </SimpleGrid>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── Market Validation ── */}
      <Box py={96} style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 65%), ${CANVAS}` }}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm" align="center" ta="center">
              <SectionLabel>Market Validation</SectionLabel>
              <SectionTitle maw={580}>We've validated the pain point through extensive operator research</SectionTitle>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <StatBadge value="40+" label="Operator Interviews" />
              <StatBadge value="85%" label="Margin Concern %" />
              <StatBadge value="12" label="Beta LOIs" />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {[
                { quote: '"We\'re bleeding money to DoorDash"', source: 'Multi-location fast-casual owner, 8 locations' },
                { quote: '"Our POS is 10 years old and can\'t do QR"', source: 'Regional burger chain, 15 locations' },
                { quote: '"I have 5 different systems that don\'t talk"', source: 'Pizza franchise operator, 12 locations' },
                { quote: '"Labor costs are killing us — we need automation"', source: 'Casual dining group, 6 locations' },
              ].map((q) => (
                <Box key={q.quote} p="xl" style={{ borderRadius: 16, background: CARD_BG, border: `1px solid ${BORDER}` }}>
                  <Text size="md" c={TEXT_MAIN} fw={500} mb="sm" style={{ fontStyle: 'italic' }}>{q.quote}</Text>
                  <Text size="sm" c={ACCENT_SOFT}>— {q.source}</Text>
                </Box>
              ))}
            </SimpleGrid>
            <Box p="lg" style={{ borderRadius: 16, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)' }}>
              <Text fw={700} c={ACCENT_SOFT} mb="xs">Advisory Board</Text>
              <Text size="sm" c={TEXT_MUTED}>3 restaurant operators with 50+ combined years experience guiding product development</Text>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── Roadmap ── */}
      <Box py={96}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm" align="center" ta="center">
              <SectionLabel>18-Month Roadmap</SectionLabel>
              <SectionTitle maw={500}>From MVP to Series A</SectionTitle>
            </Stack>
            <Stack gap="sm">
              {[
                { quarter: 'Q1 2026', title: 'MVP Development & Beta', desc: 'Core platform · Payment integration', target: '5–10 restaurants' },
                { quarter: 'Q2 2026', title: 'Kiosk & Loyalty', desc: 'Kiosk interface · Native loyalty', target: '25 restaurants' },
                { quarter: 'Q3 2026', title: 'Scale & Features', desc: 'Multi-location dashboard', target: '50+ restaurants' },
                { quarter: 'Q4 2026', title: 'Growth & Integration', desc: 'API platform · Series A prep', target: '100+ restaurants' },
                { quarter: 'Q1–Q2 2027', title: 'Delivery & Expansion', desc: 'Delivery integration · Full stack', target: '250+ restaurants' },
              ].map((row, i) => (
                <Box key={row.quarter} px="xl" py="lg"
                  style={{ borderRadius: 16, background: i === 0 ? 'rgba(249,115,22,0.1)' : CARD_BG, border: `1px solid ${i === 0 ? 'rgba(249,115,22,0.4)' : BORDER}`, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}
                >
                  <Text fw={700} c={ACCENT_SOFT} size="sm" style={{ minWidth: 80 }}>{row.quarter}</Text>
                  <Box style={{ flex: 1 }}>
                    <Text fw={700} c={TEXT_MAIN} size="sm">{row.title}</Text>
                    <Text size="xs" c={TEXT_MUTED}>{row.desc}</Text>
                  </Box>
                  <Box px="md" py={6} style={{ borderRadius: 999, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)' }}>
                    <Text size="xs" fw={600} c={ACCENT_SOFT}>{row.target}</Text>
                  </Box>
                </Box>
              ))}
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <StatBadge value="5x" label="Growth in Q2" />
              <StatBadge value="20x" label="By Q4 2026" />
              <StatBadge value="50x" label="18-mo Target" />
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── $100K Unlocks ── */}
      <Box py={96} style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 65%), ${CANVAS}` }}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm" align="center" ta="center">
              <SectionLabel>What $100K Unlocks</SectionLabel>
              <SectionTitle maw={560}>This capital funds critical de-risking to reach first revenue</SectionTitle>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
              {[
                { num: '01', title: 'MVP Completion', desc: 'Core QR ordering platform, menu management, and admin dashboard' },
                { num: '02', title: 'Payment Rails Integration', desc: 'Connect merchant processing via Stripe Connect or similar platform' },
                { num: '03', title: '5–10 Beta Merchants', desc: 'Onboard pilot restaurants from letters of intent' },
                { num: '04', title: 'First Live Transactions', desc: 'Process real orders and payments through the platform' },
                { num: '05', title: 'Kiosk Pilot Install', desc: 'Deploy first tablet-based kiosk at 2–3 locations' },
                { num: '06', title: 'Measurable GMV', desc: 'Track gross merchandise value through platform' },
                { num: '07', title: 'Basic Analytics Engine', desc: 'Build dashboard showing sales, top items, customer insights' },
              ].map((item) => (
                <Box key={item.num} p="xl" style={{ borderRadius: 16, background: CARD_BG, border: `1px solid ${BORDER}`, transition: 'border-color 0.2s' }}
                  onMouseEnter={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'; }}
                  onMouseLeave={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = BORDER; }}
                >
                  <Text size="xs" fw={700} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }} mb="sm">{item.num}</Text>
                  <Text fw={700} c={TEXT_MAIN} mb="xs">{item.title}</Text>
                  <Text size="sm" c={TEXT_MUTED}>{item.desc}</Text>
                </Box>
              ))}
            </SimpleGrid>
            <Box p="xl" style={{ borderRadius: 20, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.4)' }}>
              <Stack gap="xs" align="center" ta="center">
                <Text fw={700} c={ACCENT_SOFT}>Success Metric</Text>
                <Text size="lg" c={TEXT_MAIN} fw={600}>Achieve $50K+ monthly GMV across beta merchants within 90 days</Text>
                <Text size="sm" c={TEXT_MUTED}>This positions us to raise Series A with proven traction — Target $1–2M at 10–15 restaurants with consistent GMV</Text>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── Team ── */}
      <Box py={96}>
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="sm" align="center" ta="center">
              <SectionLabel>The Team</SectionLabel>
              <SectionTitle maw={560}>Why is this team uniquely positioned to win this market?</SectionTitle>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              {[
                { name: 'John', role: 'Co-Founder & CEO', bullets: ['Built digital systems across jewelry & e-commerce', 'Deep experience in merchant flows and payment systems', 'Experience raising capital and assembling teams', 'Founder-operator mindset with proven execution'] },
                { name: 'Noel', role: 'Co-Founder & CTO', bullets: ['Engineering leader with 10+ years building at scale', 'Built scalable commerce systems for high-volume retailers', 'Knows integrations deeply — payment, POS, APIs', 'Full-stack expertise in modern web architecture'] },
                { name: 'Mike', role: 'Co-Founder & CFO', bullets: ['Portfolio management background at major firm', 'Brings discipline and capital structure insight', 'Expert in financial modeling and unit economics', 'Strategic advisor on fundraising and growth'] },
              ].map((m) => (
                <Box key={m.name} p="xl" style={{ borderRadius: 20, background: CARD_BG, border: `1px solid ${BORDER}`, transition: 'border-color 0.2s' }}
                  onMouseEnter={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'; }}
                  onMouseLeave={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = BORDER; }}
                >
                  <Box mb="md" style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#fb923c,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text fw={800} c="#050509" size="xl">{m.name[0]}</Text>
                  </Box>
                  <Text fw={700} c={TEXT_MAIN} size="lg">{m.name}</Text>
                  <Text size="sm" c={ACCENT_SOFT} mb="md">{m.role}</Text>
                  <Stack gap={6}>
                    {m.bullets.map((b) => (
                      <Group key={b} gap={8} align="flex-start">
                        <IconCheck size={13} color={ACCENT_SOFT} style={{ marginTop: 3, flexShrink: 0 }} />
                        <Text size="sm" c={TEXT_MUTED} style={{ flex: 1 }}>{b}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>
            <Box p="xl" style={{ borderRadius: 20, background: CARD_BG, border: `1px solid ${BORDER}` }}>
              <Text fw={700} c={ACCENT_SOFT} mb="md">Advisory Board</Text>
              <Stack gap="sm">
                {[
                  'Former VP Operations, national fast-casual chain (500+ locations)',
                  'Restaurant tech consultant, 20+ years industry experience',
                  'Multi-unit franchise owner, 18 locations across 3 brands',
                ].map((a) => (
                  <Group key={a} gap={8}>
                    <Box style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT_SOFT, flexShrink: 0, marginTop: 6 }} />
                    <Text size="sm" c={TEXT_MUTED}>{a}</Text>
                  </Group>
                ))}
              </Stack>
            </Box>
            <Box p="xl" style={{ borderRadius: 16, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.3)' }}>
              <Text fw={700} c={ACCENT_SOFT} mb="xs">Why This Team Wins</Text>
              <Text size="sm" c={TEXT_MUTED}>We combine technical depth, commerce experience, and financial discipline. We've built payment systems before. We understand restaurant operations. We know how to build venture-scale businesses.</Text>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Divider />

      {/* ── The Ask ── */}
      <Box
        py={96}
        style={{ background: `radial-gradient(ellipse 60% 80% at 50% 100%, rgba(249,115,22,0.18) 0%, transparent 60%), ${CANVAS}` }}
      >
        <Container size="md">
          <Stack gap="xl" align="center" ta="center">
            <SectionLabel>The Ask</SectionLabel>
            <Title order={1} fw={800} c={TEXT_MAIN} style={{ fontSize: 'clamp(3rem,8vw,5rem)', letterSpacing: -2 }}>
              $100,000
            </Title>
            <Text size="xl" c={TEXT_MUTED}>Pre-Seed Round</Text>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" w="100%" maw={640}>
              <Box p="lg" style={{ borderRadius: 16, background: CARD_BG, border: `1px solid ${BORDER}` }}>
                <Text size="xs" c={TEXT_MUTED} tt="uppercase" style={{ letterSpacing: 2 }}>Stage</Text>
                <Text fw={700} c={TEXT_MAIN} mt={4}>Pre-Revenue / MVP</Text>
              </Box>
              <Box p="lg" style={{ borderRadius: 16, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.4)' }}>
                <Text size="xs" c={TEXT_MUTED} tt="uppercase" style={{ letterSpacing: 2 }}>Equity Offered</Text>
                <Title order={2} fw={800} c={ACCENT_SOFT} mt={4}>20%</Title>
              </Box>
              <Box p="lg" style={{ borderRadius: 16, background: CARD_BG, border: `1px solid ${BORDER}` }}>
                <Text size="xs" c={TEXT_MUTED} tt="uppercase" style={{ letterSpacing: 2 }}>Valuation</Text>
                <Text fw={700} c={TEXT_MAIN} mt={4}>$500,000</Text>
              </Box>
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" w="100%" maw={640}>
              <Box p="lg" style={{ borderRadius: 16, background: CARD_BG, border: `1px solid ${BORDER}` }}>
                <Text size="xs" c={TEXT_MUTED} tt="uppercase" style={{ letterSpacing: 2 }}>Timeline</Text>
                <Text fw={700} c={TEXT_MAIN} mt={4}>6–9 Months</Text>
              </Box>
              <Box p="lg" style={{ borderRadius: 16, background: CARD_BG, border: `1px solid ${BORDER}` }}>
                <Text size="xs" c={TEXT_MUTED} tt="uppercase" style={{ letterSpacing: 2 }}>Next Round Target</Text>
                <Text fw={700} c={TEXT_MAIN} mt={4}>Series A · $1–2M</Text>
              </Box>
            </SimpleGrid>
            <Stack gap="xs" maw={480}>
              <Text fw={700} c={ACCENT_SOFT}>What We're Underwriting</Text>
              {['Technical feasibility validated', 'Founder conviction & capability', 'Market inevitability (timing is right)', 'Asymmetric upside potential'].map((item) => (
                <Group key={item} gap={8} justify="center">
                  <IconCheck size={14} color={ACCENT_SOFT} />
                  <Text size="sm" c={TEXT_MUTED}>{item}</Text>
                </Group>
              ))}
            </Stack>
            <Group gap="md" mt="md">
              <Button component={Link} to="/register" size="xl" radius="md" style={{ background: 'linear-gradient(135deg,#fb923c,#ea580c)', color: '#050509', fontWeight: 700, paddingInline: 40 }}>
                Book a Demo
              </Button>
              <Button component={Link} to="/" size="xl" radius="md" variant="outline" style={{ borderColor: BORDER, color: TEXT_MUTED, paddingInline: 40 }}>
                Back to Home
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box py={32} style={{ borderTop: `1px solid ${BORDER}` }}>
        <Container size="xl">
          <Group justify="space-between">
            <Group gap="xs">
              <ThemeIcon size={28} radius="sm" style={{ background: 'linear-gradient(135deg,#fb923c,#ea580c)' }}>
                <IconChefHat size={16} color="#050509" />
              </ThemeIcon>
              <Text fw={700} size="sm" c={TEXT_MAIN}>RestoApp</Text>
            </Group>
            <Text size="xs" c={TEXT_MUTED}>© 2026 RestoApp · Pre-Seed Fundraising Deck · February 2026</Text>
          </Group>
        </Container>
      </Box>
    </Box>
  );
}
