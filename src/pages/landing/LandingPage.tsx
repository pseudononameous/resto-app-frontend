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
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
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
  IconChefHat,
  IconArrowRight,
  IconBuildingStore,
  IconMapPin,
  IconAlertTriangle,
  IconCoin,
  IconCheck,
} from '@tabler/icons-react';

const CANVAS = '#050509';
const TEXT_MAIN = '#f9fafb';
const TEXT_MUTED = '#9ca3af';
const ACCENT_SOFT = '#fb923c';
const BORDER = 'rgba(255,255,255,0.08)';
const CARD_BG = 'rgba(255,255,255,0.04)';

const NAV_LINKS = ['Product', 'Ecosystem', 'Pricing', 'Investors'];

const STATS = [
  { value: '660000', display: '660K+', label: 'US Restaurants', suffix: '+', isK: true },
  { value: '120', display: '$120B', label: 'Digital Orders / Year', prefix: '$', suffix: 'B' },
  { value: '90', display: '90%+', label: 'Labor Cost Reduction', suffix: '%+' },
  { value: '500', display: '<500ms', label: 'Response Time', prefix: '<', suffix: 'ms' },
];

const INTEGRATIONS = ['DoorDash', 'Uber Eats', 'Grubhub', 'Postmates', 'Stripe', 'Shopify'];

const FEATURES = [
  {
    icon: <IconQrcode size={20} />,
    title: 'QR Code Ordering',
    description: 'Customers scan, browse, and order from their phones — no app download needed.',
  },
  {
    icon: <IconDeviceTablet size={20} />,
    title: 'Kiosk Integration',
    description: 'Self-service stations for fast-casual environments. Reduce wait times instantly.',
  },
  {
    icon: <IconCreditCard size={20} />,
    title: 'Integrated Payments',
    description: 'Built-in merchant processing with better economics. No third-party payment fees.',
  },
  {
    icon: <IconGift size={20} />,
    title: 'Loyalty Programs',
    description: 'Native rewards system without third-party fees. Own your customer relationships.',
  },
  {
    icon: <IconChartBar size={20} />,
    title: 'Analytics Dashboard',
    description: 'Real-time insights and customer data ownership. Full visibility across every location.',
  },
  {
    icon: <IconMenu2 size={20} />,
    title: 'Dynamic Menus',
    description: 'Update prices and items instantly — no printing costs, no reprinting delays.',
  },
];

const PLATFORM_FEATURES = [
  { icon: <IconGift size={18} />, title: 'Rewards Program', description: 'Native loyalty to drive repeat visits' },
  { icon: <IconTruck size={18} />, title: 'Delivery Sync', description: 'Sync menus to DoorDash, Grubhub, Uber Eats' },
  { icon: <IconCreditCard size={18} />, title: 'Payment Gateways', description: 'Multiple payment options seamlessly' },
  { icon: <IconShoppingCart size={18} />, title: 'Gift Cards', description: 'Digital gift card management & tracking' },
  { icon: <IconBellRinging size={18} />, title: 'Push Notifications', description: 'New marketing channel for promos' },
  { icon: <IconRefresh size={18} />, title: 'Order Sync', description: 'Unified delivery management across platforms' },
];

const USE_CASES = [
  {
    stat: '90% labor reduction',
    statColor: '#fb923c',
    icon: <IconBuildingStore size={22} />,
    title: 'Fast-Casual Chains',
    description: 'High order volume, standardized menus, and limited server dependency. The perfect starting point.',
    cta: 'Explore templates',
  },
  {
    stat: '30% fees eliminated',
    statColor: '#fb923c',
    icon: <IconTruck size={22} />,
    title: 'Delivery & Ordering',
    description: 'Sync menus across all platforms. Own the customer relationship without the commission.',
    cta: 'Explore templates',
  },
  {
    stat: '3x table turns',
    statColor: '#fb923c',
    icon: <IconMapPin size={22} />,
    title: 'Multi-Location Ops',
    description: 'Centralized data and control across every branch. One dashboard, zero fragmentation.',
    cta: 'Explore templates',
  },
  {
    stat: '100% data ownership',
    statColor: '#fb923c',
    icon: <IconAlertTriangle size={22} />,
    title: 'Ghost Kitchens',
    description: 'Digital-native operators get the full stack — ordering, payments, loyalty — from day one.',
    cta: 'Explore templates',
  },
];

const TIMELINE_MILESTONES = [
  {
    num: '01',
    title: 'MVP Completion',
    description: 'Core QR ordering, menu management, and admin dashboard',
    gmv: 0,
    day: 0,
  },
  {
    num: '02',
    title: 'Payment Rails',
    description: 'Connect merchant processing via Stripe Connect',
    gmv: 0,
    day: 15,
  },
  {
    num: '03',
    title: '5–10 Beta Merchants',
    description: 'Onboard pilot restaurants from letters of intent',
    gmv: 5000,
    day: 30,
  },
  {
    num: '04',
    title: 'First Live Transactions',
    description: 'Process real orders and payments through the platform',
    gmv: 15000,
    day: 45,
  },
  {
    num: '05',
    title: 'Kiosk Pilot Install',
    description: 'Deploy first tablet-based kiosk at 2–3 locations',
    gmv: 30000,
    day: 60,
  },
  {
    num: '06',
    title: '$50K+ Monthly GMV',
    description: 'Achieve target within 90 days — then raise Series A',
    gmv: 50000,
    day: 90,
  },
];

/* ─── Hooks ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

/* ─── FadeIn wrapper ─── */
function FadeIn({
  children,
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}) {
  const { ref, inView } = useInView();
  const translate =
    direction === 'up' ? 'translateY(32px)' :
      direction === 'left' ? 'translateX(-32px)' :
        direction === 'right' ? 'translateX(32px)' : 'none';
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : translate,
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Animated stat ─── */
function AnimatedStat({ stat }: { stat: typeof STATS[0] }) {
  const { ref, inView } = useInView();
  const numericTarget = parseInt(stat.value, 10);
  const count = useCountUp(numericTarget, 1800, inView);

  const formatCount = () => {
    if (stat.isK) return `${Math.round(count / 1000)}K`;
    return count.toString();
  };

  return (
    <div ref={ref}>
      <Title
        order={2}
        fw={800}
        c={TEXT_MAIN}
        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: -1 }}
      >
        {stat.prefix ?? ''}{formatCount()}{stat.suffix ?? ''}
      </Title>
      <Text size="sm" c={TEXT_MUTED} mt={4}>
        {stat.label}
      </Text>
    </div>
  );
}

/* ─── GMV Graph ─── */
function GmvGraph({ active }: { active: boolean }) {
  const points = TIMELINE_MILESTONES.map((m) => ({ x: m.day, y: m.gmv, title: m.title }));
  const maxY = 55000;
  const maxX = 90;
  const W = 500;
  const H = 180;
  const PAD = { top: 16, right: 24, bottom: 32, left: 56 };
  const gW = W - PAD.left - PAD.right;
  const gH = H - PAD.top - PAD.bottom;

  const toSvg = (x: number, y: number) => ({
    svgX: PAD.left + (x / maxX) * gW,
    svgY: PAD.top + gH - (y / maxY) * gH,
  });

  const pathData = points
    .map((p, i) => {
      const { svgX, svgY } = toSvg(p.x, p.y);
      return `${i === 0 ? 'M' : 'L'} ${svgX} ${svgY}`;
    })
    .join(' ');

  const areaData =
    pathData +
    ` L ${toSvg(maxX, 0).svgX} ${toSvg(maxX, 0).svgY} L ${toSvg(0, 0).svgX} ${toSvg(0, 0).svgY} Z`;

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1600, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(step);
    };
    const id = setTimeout(() => requestAnimationFrame(step), 300);
    return () => clearTimeout(id);
  }, [active]);

  const yLabels = [0, 10000, 25000, 50000];

  return (
    <Box
      style={{
        borderRadius: 16,
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        padding: '20px 16px 8px',
        overflow: 'hidden',
      }}
    >
      <Text size="xs" fw={600} c={ACCENT_SOFT} tt="uppercase" mb="xs" style={{ letterSpacing: 2 }}>
        GMV Trajectory — 90 Day Target
      </Text>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block' }}>
        <defs>
          <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
          </linearGradient>
          <clipPath id="revealClip">
            <rect
              x={PAD.left}
              y={0}
              width={gW * progress}
              height={H}
            />
          </clipPath>
        </defs>

        {/* Y grid lines */}
        {yLabels.map((val) => {
          const { svgY } = toSvg(0, val);
          return (
            <g key={val}>
              <line
                x1={PAD.left}
                y1={svgY}
                x2={PAD.left + gW}
                y2={svgY}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 6}
                y={svgY + 4}
                textAnchor="end"
                fontSize={9}
                fill="rgba(156,163,175,0.6)"
              >
                {val === 0 ? '$0' : val >= 1000 ? `$${val / 1000}K` : `$${val}`}
              </text>
            </g>
          );
        })}

        {/* X axis labels */}
        {[0, 30, 60, 90].map((day) => {
          const { svgX } = toSvg(day, 0);
          return (
            <text
              key={day}
              x={svgX}
              y={H - 4}
              textAnchor="middle"
              fontSize={9}
              fill="rgba(156,163,175,0.6)"
            >
              Day {day}
            </text>
          );
        })}

        {/* Area fill */}
        <path d={areaData} fill="url(#gmvGrad)" clipPath="url(#revealClip)" />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="#f97316"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath="url(#revealClip)"
        />

        {/* Dots */}
        {points.map((p) => {
          const { svgX, svgY } = toSvg(p.x, p.y);
          const dotProgress = p.x / maxX;
          const visible = progress >= dotProgress;
          return (
            <circle
              key={p.title}
              cx={svgX}
              cy={svgY}
              r={4}
              fill="#f97316"
              stroke="#050509"
              strokeWidth={2}
              opacity={visible ? 1 : 0}
              style={{ transition: 'opacity 0.3s' }}
            />
          );
        })}

        {/* $50K label */}
        {progress > 0.95 && (
          <g>
            <text
              x={toSvg(maxX, maxY).svgX - 4}
              y={toSvg(maxX, maxY).svgY - 10}
              textAnchor="end"
              fontSize={10}
              fill="#fb923c"
              fontWeight={700}
            >
              $50K+
            </text>
          </g>
        )}
      </svg>
    </Box>
  );
}

/* ─── Timeline ─── */
function Timeline() {
  const { ref, inView } = useInView(0.1);
  return (
    <div ref={ref}>
      <Stack gap={0}>
        {TIMELINE_MILESTONES.map((item, i) => {
          const isLast = i === TIMELINE_MILESTONES.length - 1;
          const delay = i * 120;
          return (
            <Box
              key={item.num}
              style={{
                display: 'flex',
                gap: 20,
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateX(-20px)',
                transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
              }}
            >
              {/* Spine */}
              <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
                <Box
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: isLast
                      ? 'linear-gradient(135deg, #fb923c, #ea580c)'
                      : i === 0
                        ? 'rgba(249,115,22,0.2)'
                        : 'rgba(249,115,22,0.1)',
                    border: `2px solid ${isLast ? 'transparent' : 'rgba(249,115,22,0.35)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: isLast ? '0 0 20px rgba(249,115,22,0.5)' : 'none',
                  }}
                >
                  {isLast ? (
                    <IconCheck size={18} color="#050509" />
                  ) : (
                    <Text size="xs" fw={800} c={ACCENT_SOFT}>
                      {i + 1}
                    </Text>
                  )}
                </Box>
                {!isLast && (
                  <Box
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 32,
                      background: 'linear-gradient(180deg, rgba(249,115,22,0.4) 0%, rgba(249,115,22,0.08) 100%)',
                      marginTop: 4,
                      marginBottom: 4,
                    }}
                  />
                )}
              </Box>

              {/* Content */}
              <Box pb={isLast ? 0 : 28} style={{ flex: 1 }}>
                <Group gap="sm" mb={4} align="center">
                  <Text size="xs" fw={700} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 2 }}>
                    {item.num}
                  </Text>
                  {item.gmv > 0 && (
                    <Box
                      px={8}
                      py={2}
                      style={{
                        borderRadius: 999,
                        background: 'rgba(249,115,22,0.1)',
                        border: '1px solid rgba(249,115,22,0.25)',
                      }}
                    >
                      <Text size="xs" fw={600} c={ACCENT_SOFT}>
                        Day {item.day}
                      </Text>
                    </Box>
                  )}
                </Group>
                <Text fw={700} c={TEXT_MAIN} mb={4}>
                  {item.title}
                </Text>
                <Text size="sm" c={TEXT_MUTED}>
                  {item.description}
                </Text>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </div>
  );
}

/* ─── Pulsing dot ─── */
function PulseDot() {
  return (
    <Box
      style={{
        position: 'relative',
        width: 10,
        height: 10,
        flexShrink: 0,
      }}
    >
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: '#fb923c',
          animation: 'pulse-ring 2s ease-out infinite',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          inset: 2,
          borderRadius: '50%',
          background: '#fb923c',
        }}
      />
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.8; }
          70% { transform: scale(2.4); opacity: 0; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}

/* ─── Main ─── */
export default function LandingPage() {
  return (
    <Box
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        background: CANVAS,
        color: TEXT_MAIN,
        minHeight: '100vh',
      }}
    >
      {/* ── Nav ── */}
      <Box
        component="header"
        py="md"
        px="xl"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(5,5,9,0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <Container size="xl">
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <ThemeIcon
                size={36}
                radius="md"
                style={{
                  background: 'linear-gradient(135deg, #ffb347 0%, #f97316 60%, #ea580c 100%)',
                  boxShadow: '0 0 20px rgba(249,115,22,0.4)',
                }}
              >
                <IconChefHat size={20} color="#050509" />
              </ThemeIcon>
              <Text fw={800} size="lg" c={TEXT_MAIN} style={{ letterSpacing: -0.5 }}>
                RestoApp
              </Text>
            </Group>

            <Group gap="xl" visibleFrom="md">
              {NAV_LINKS.map((link) => (
                <Text
                  key={link}
                  size="sm"
                  c={TEXT_MUTED}
                  style={{ cursor: 'pointer', transition: 'color 0.15s' }}
                  onMouseEnter={(e: MouseEvent<HTMLDivElement>) =>
                    (e.currentTarget.style.color = TEXT_MAIN)
                  }
                  onMouseLeave={(e: MouseEvent<HTMLDivElement>) =>
                    (e.currentTarget.style.color = TEXT_MUTED)
                  }
                >
                  {link}
                </Text>
              ))}
            </Group>

            <Group gap="sm">
              <Button
                component={Link}
                to="/login"
                variant="subtle"
                size="sm"
                style={{ color: TEXT_MUTED }}
              >
                Log in
              </Button>
              <Button
                component={Link}
                to="/register"
                size="sm"
                radius="md"
                style={{
                  background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
                  color: '#050509',
                  fontWeight: 700,
                }}
              >
                Book a Demo
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* ── Hero ── */}
      <Box
        py={100}
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: `radial-gradient(ellipse 70% 60% at 50% 40%, rgba(249,115,22,0.18) 0%, rgba(249,115,22,0.05) 50%, transparent 70%), ${CANVAS}`,
        }}
      >
        {/* floating ambient dots */}
        <Box style={{ position: 'absolute', top: 80, left: '15%', width: 4, height: 4, borderRadius: '50%', background: 'rgba(249,115,22,0.5)', boxShadow: '0 0 12px 4px rgba(249,115,22,0.3)', animation: 'float 4s ease-in-out infinite' }} />
        <Box style={{ position: 'absolute', top: 200, right: '12%', width: 3, height: 3, borderRadius: '50%', background: 'rgba(251,146,60,0.6)', boxShadow: '0 0 10px 3px rgba(251,146,60,0.25)', animation: 'float 5s ease-in-out infinite 1s' }} />
        <Box style={{ position: 'absolute', top: '60%', left: '8%', width: 2, height: 2, borderRadius: '50%', background: 'rgba(249,115,22,0.4)', animation: 'float 6s ease-in-out infinite 2s' }} />

        <Container size="lg">
          <Stack gap="xl" align="center" ta="center">
            {/* Badge */}
            <Box
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 999,
                background: 'rgba(249,115,22,0.12)',
                border: '1px solid rgba(249,115,22,0.35)',
                animation: 'fade-up 0.6s ease both',
              }}
            >
              <PulseDot />
              <Text size="sm" fw={600} c={ACCENT_SOFT}>
                Pre-Seed Fundraising · February 2026
              </Text>
              <Box style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(251,146,60,0.4)' }} />
            </Box>

            {/* Headline */}
            <Title
              order={1}
              fw={800}
              c={TEXT_MAIN}
              style={{
                fontSize: 'clamp(2.8rem, 7vw, 5rem)',
                lineHeight: 1.05,
                letterSpacing: -1.5,
                maxWidth: 800,
                animation: 'fade-up 0.7s ease 0.1s both',
              }}
            >
              Affordable technology to revolutionize F&amp;B, Retail and delivery.
            </Title>

            <Text
              size="lg"
              c={TEXT_MUTED}
              maw={540}
              style={{ animation: 'fade-up 0.7s ease 0.2s both' }}
            >
              RestoApp is the unified operating system that empowers restaurants to own their entire
              digital experience — from ordering to payment, loyalty to analytics.
            </Text>

            {/* Two CTA cards */}
            <SimpleGrid
              cols={{ base: 1, sm: 2 }}
              spacing="md"
              w="100%"
              maw={700}
              mt="md"
              style={{ animation: 'fade-up 0.7s ease 0.3s both' }}
            >
              <CtaCard
                icon={<IconBuildingStore size={22} />}
                title="I'm a Restaurant Owner"
                description="QR ordering, kiosk, loyalty, and payments in one platform. No hardware lock-in."
                ctaLabel="Quick start"
                to="/register"
              />
              <CtaCard
                icon={<IconCoin size={22} />}
                title="I'm an Investor"
                description="$52B TAM, software-first, and aligned economics. See the deck and live product."
                ctaLabel="View the pitch"
                to="/register"
              />
            </SimpleGrid>

            {/* Pill tags */}
            <Group gap="xs" justify="center" mt="xs" style={{ animation: 'fade-up 0.7s ease 0.4s both' }}>
              {[
                'Handle dine-in ordering',
                'Manage delivery channels',
                'Run loyalty programs',
                'Analyze customer data',
                'Manage multi-location',
                '+',
              ].map((tag) => (
                <Box
                  key={tag}
                  px="md"
                  py={6}
                  style={{
                    borderRadius: 999,
                    border: `1px solid ${BORDER}`,
                    background: CARD_BG,
                    transition: 'border-color 0.2s, background 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)';
                    e.currentTarget.style.background = 'rgba(249,115,22,0.06)';
                  }}
                  onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.borderColor = BORDER;
                    e.currentTarget.style.background = CARD_BG;
                  }}
                >
                  <Text size="xs" c={TEXT_MUTED}>
                    {tag}
                  </Text>
                </Box>
              ))}
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* ── Integration logos + Stats ── */}
      <Box
        py={72}
        style={{
          background: `linear-gradient(180deg, rgba(249,115,22,0.04) 0%, transparent 100%), ${CANVAS}`,
          borderTop: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <Container size="xl">
          <Stack gap="xl" align="center">
            <FadeIn>
              <Text size="sm" c={TEXT_MUTED} ta="center">
                Connects with the platforms restaurants already use
              </Text>
            </FadeIn>

            <FadeIn delay={100}>
              <Group gap={48} justify="center" wrap="wrap">
                {INTEGRATIONS.map((name, i) => (
                  <Text
                    key={name}
                    fw={700}
                    size="lg"
                    c="rgba(156,163,175,0.55)"
                    style={{
                      letterSpacing: -0.5,
                      userSelect: 'none',
                      transition: 'color 0.2s',
                      animationDelay: `${i * 80}ms`,
                    }}
                    onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.color = 'rgba(251,146,60,0.7)';
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.color = 'rgba(156,163,175,0.55)';
                    }}
                  >
                    {name}
                  </Text>
                ))}
              </Group>
            </FadeIn>

            <Box style={{ width: '100%', padding: '48px 0 0' }}>
              <Group
                justify="center"
                wrap="wrap"
                gap={0}
                style={{ width: '100%', borderTop: `1px solid ${BORDER}` }}
              >
                {STATS.map((stat, i) => (
                  <Box
                    key={stat.label}
                    px={48}
                    py={36}
                    ta="center"
                    style={{
                      flex: '1 1 180px',
                      borderRight: i < STATS.length - 1 ? `1px solid ${BORDER}` : 'none',
                    }}
                  >
                    <AnimatedStat stat={stat} />
                  </Box>
                ))}
              </Group>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* ── Everything you need ── */}
      <Box id="features" py={96}>
        <Container size="xl">
          <Stack gap={56}>
            <FadeIn>
              <Stack gap="md" align="center" ta="center">
                <Title
                  order={2}
                  fw={800}
                  c={TEXT_MAIN}
                  style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: -1, maxWidth: 640 }}
                >
                  Everything you need to build a production-ready restaurant OS
                </Title>
                <Text size="lg" c={TEXT_MUTED} maw={560}>
                  RestoApp abstracts the technical complexity so operators can focus on what matters —
                  running great restaurants and protecting their margins.
                </Text>
              </Stack>
            </FadeIn>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              {FEATURES.map((f, i) => (
                <FadeIn key={f.title} delay={i * 80} direction="up">
                  <FeatureCard icon={f.icon} title={f.title} description={f.description} />
                </FadeIn>
              ))}
            </SimpleGrid>

            <FadeIn delay={200}>
              <Group justify="center" gap="md" mt="sm">
                <Button
                  component={Link}
                  to="/register"
                  size="lg"
                  radius="md"
                  style={{
                    background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
                    color: '#050509',
                    fontWeight: 700,
                    paddingInline: 32,
                  }}
                >
                  Start Building Free
                </Button>
                <Button
                  component={Link}
                  to="/pitch-deck"
                  size="lg"
                  radius="md"
                  variant="outline"
                  style={{ borderColor: BORDER, color: TEXT_MUTED, paddingInline: 32 }}
                >
                  View Deck
                </Button>
              </Group>
            </FadeIn>
          </Stack>
        </Container>
      </Box>

      {/* ── Platform Features ── */}
      <Box
        py={96}
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.07) 0%, transparent 60%), ${CANVAS}`,
          borderTop: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <Container size="xl">
          <Stack gap={56}>
            <FadeIn>
              <Stack gap="md" align="center" ta="center">
                <Text size="sm" fw={600} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }}>
                  Platform Features
                </Text>
                <Title
                  order={2}
                  fw={800}
                  c={TEXT_MAIN}
                  style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', letterSpacing: -1, maxWidth: 600 }}
                >
                  Everything restaurants need in one unified platform
                </Title>
              </Stack>
            </FadeIn>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              {PLATFORM_FEATURES.map((f, i) => (
                <FadeIn key={f.title} delay={i * 70} direction="up">
                  <Box
                    p="lg"
                    style={{
                      borderRadius: 16,
                      background: CARD_BG,
                      border: `1px solid ${BORDER}`,
                      transition: 'border-color 0.2s, transform 0.2s',
                      height: '100%',
                    }}
                    onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.borderColor = BORDER;
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <Group gap="sm" mb="xs">
                      <ThemeIcon size={36} radius="md" style={{ background: 'rgba(249,115,22,0.12)', color: ACCENT_SOFT }}>
                        {f.icon}
                      </ThemeIcon>
                      <Text fw={600} c={TEXT_MAIN} size="sm">{f.title}</Text>
                    </Group>
                    <Text size="sm" c={TEXT_MUTED}>{f.description}</Text>
                  </Box>
                </FadeIn>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* ── Use Cases ── */}
      <Box id="use-cases" py={96}>
        <Container size="xl">
          <Stack gap={56}>
            <FadeIn>
              <Stack gap="md" align="center" ta="center">
                <Title
                  order={2}
                  fw={800}
                  c={TEXT_MAIN}
                  style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', letterSpacing: -1 }}
                >
                  Built for real restaurant problems
                </Title>
                <Text size="lg" c={TEXT_MUTED} maw={540}>
                  From fast-casual to ghost kitchens, see how operators use RestoApp to automate their
                  most important workflows.
                </Text>
              </Stack>
            </FadeIn>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {USE_CASES.map((uc, i) => (
                <FadeIn key={uc.title} delay={i * 100}>
                  <Box
                    p="xl"
                    style={{
                      borderRadius: 20,
                      background: CARD_BG,
                      border: `1px solid ${BORDER}`,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s, transform 0.2s',
                      cursor: 'pointer',
                      height: '100%',
                    }}
                    onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.borderColor = BORDER;
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <Group justify="space-between" mb="md">
                      <ThemeIcon size={44} radius="md" style={{ background: 'rgba(249,115,22,0.12)', color: ACCENT_SOFT }}>
                        {uc.icon}
                      </ThemeIcon>
                      <Text size="sm" fw={700} c={uc.statColor}>{uc.stat}</Text>
                    </Group>
                    <Title order={3} fw={700} c={TEXT_MAIN} mb="xs" size="h4">{uc.title}</Title>
                    <Text size="sm" c={TEXT_MUTED} mb="lg">{uc.description}</Text>
                    <Group gap={4} style={{ color: ACCENT_SOFT }}>
                      <Text size="sm" fw={600} c={ACCENT_SOFT}>{uc.cta}</Text>
                      <IconArrowRight size={14} />
                    </Group>
                  </Box>
                </FadeIn>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* ── Vision / Our Wedge ── */}
      <Box
        py={96}
        style={{
          borderTop: `1px solid ${BORDER}`,
          background: `radial-gradient(ellipse 50% 60% at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 65%), ${CANVAS}`,
        }}
      >
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={64}>
            <FadeIn direction="left">
              <Stack gap="xl" justify="center">
                <Text size="sm" fw={600} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }}>
                  Our Wedge Strategy
                </Text>
                <Title
                  order={2}
                  fw={800}
                  c={TEXT_MAIN}
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', letterSpacing: -0.8 }}
                >
                  We start with fast-casual, multi-location operators.
                </Title>
                <Text size="md" c={TEXT_MUTED}>
                  These operators are sophisticated enough to understand the value, but small enough to
                  move quickly. We're not trying to build the ocean on day one.
                </Text>
                <SimpleGrid cols={2} spacing="md">
                  {[
                    { num: '3–20', label: 'Locations per chain' },
                    { num: '$52B', label: 'Total addressable market' },
                    { num: '5%', label: 'Capture = $2.6B opportunity' },
                    { num: '660K', label: 'US restaurants' },
                  ].map((item) => (
                    <Box
                      key={item.label}
                      p="md"
                      style={{
                        borderRadius: 14,
                        background: CARD_BG,
                        border: `1px solid ${BORDER}`,
                        transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
                        e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)';
                      }}
                      onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
                        e.currentTarget.style.borderColor = BORDER;
                      }}
                    >
                      <Title order={3} fw={800} c={TEXT_MAIN} style={{ fontSize: '1.6rem' }}>
                        {item.num}
                      </Title>
                      <Text size="xs" c={TEXT_MUTED} mt={4}>{item.label}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Stack>
            </FadeIn>

            <FadeIn direction="right">
              <Stack gap="md" justify="center">
                <Text size="sm" fw={600} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }}>
                  The Shopify Parallel
                </Text>
                <Text size="md" c={TEXT_MUTED}>
                  Shopify captured 10% of e-commerce. If RestoApp captures just 5% of restaurant tech,
                  that&apos;s a $2.6B opportunity.
                </Text>
                <Stack gap="sm" mt="sm">
                  {[
                    { label: 'Prove unit economics', sub: '5–10 pilot restaurants' },
                    { label: 'Expand to QSR', sub: 'High-volume, simple menus' },
                    { label: 'Add Casual Dining', sub: 'More complex operations' },
                    { label: 'Ghost Kitchens & Franchises', sub: 'Digital-native operators' },
                  ].map((step, i) => (
                    <Group key={step.label} gap="md" align="flex-start">
                      <Box
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: i === 0 ? 'linear-gradient(135deg, #fb923c, #ea580c)' : 'rgba(249,115,22,0.12)',
                          border: `1px solid ${i === 0 ? 'transparent' : 'rgba(249,115,22,0.25)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        <Text size="xs" fw={700} c={i === 0 ? '#050509' : ACCENT_SOFT}>{i + 1}</Text>
                      </Box>
                      <Box>
                        <Text size="sm" fw={600} c={TEXT_MAIN}>{step.label}</Text>
                        <Text size="xs" c={TEXT_MUTED}>{step.sub}</Text>
                      </Box>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </FadeIn>
          </SimpleGrid>
        </Container>
      </Box>

      {/* ── $100K Ask — Timeline + Graph ── */}
      <Box py={96} style={{ borderTop: `1px solid ${BORDER}` }}>
        <Container size="xl">
          <Stack gap={56}>
            <FadeIn>
              <Stack gap="md" align="center" ta="center">
                <Text size="sm" fw={600} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }}>
                  The Ask
                </Text>
                <Title
                  order={2}
                  fw={800}
                  c={TEXT_MAIN}
                  style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', letterSpacing: -1, maxWidth: 600 }}
                >
                  What $100K unlocks
                </Title>
                <Text size="lg" c={TEXT_MUTED} maw={520}>
                  This capital funds critical de-risking to reach first revenue. We are raising $100K at
                  a $500K pre-seed valuation for 20% equity.
                </Text>

                {/* Equity breakdown pills */}
                <Group gap="md" mt="xs" justify="center">
                  {[
                    { label: 'Raise', value: '$100K' },
                    { label: 'Valuation', value: '$500K' },
                    { label: 'Equity', value: '20%' },
                    { label: 'Target GMV', value: '$50K/mo' },
                  ].map((pill) => (
                    <Box
                      key={pill.label}
                      px={20}
                      py={10}
                      style={{
                        borderRadius: 12,
                        background: 'rgba(249,115,22,0.08)',
                        border: '1px solid rgba(249,115,22,0.25)',
                        textAlign: 'center',
                      }}
                    >
                      <Text size="lg" fw={800} c={TEXT_MAIN}>{pill.value}</Text>
                      <Text size="xs" c={TEXT_MUTED}>{pill.label}</Text>
                    </Box>
                  ))}
                </Group>
              </Stack>
            </FadeIn>

            {/* Timeline + Graph side by side */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={40}>
              <FadeIn direction="left">
                <Timeline />
              </FadeIn>

              <FadeIn direction="right" delay={200}>
                <GraphSection />
              </FadeIn>
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* ── Final CTA ── */}
      <Box
        id="contact"
        py={96}
        style={{
          borderTop: `1px solid ${BORDER}`,
          background: `radial-gradient(ellipse 60% 80% at 50% 100%, rgba(249,115,22,0.14) 0%, transparent 60%), ${CANVAS}`,
        }}
      >
        <Container size="md">
          <FadeIn>
            <Stack gap="xl" align="center" ta="center">
              <Text size="sm" fw={600} c={ACCENT_SOFT} tt="uppercase" style={{ letterSpacing: 3 }}>
                Ready to ship your first restaurant?
              </Text>
              <Title
                order={2}
                fw={800}
                c={TEXT_MAIN}
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: -1, maxWidth: 560 }}
              >
                See RestoApp working with your data.
              </Title>
              <Text size="lg" c={TEXT_MUTED} maw={480}>
                A short call where we plug your real operations into a live workspace — no slides.
              </Text>
              <Group gap="md" mt="sm">
                <Button
                  component={Link}
                  to="/register"
                  size="xl"
                  radius="md"
                  style={{
                    background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
                    color: '#050509',
                    fontWeight: 700,
                    paddingInline: 40,
                    fontSize: '1rem',
                  }}
                >
                  Start Building Free
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  size="xl"
                  radius="md"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${BORDER}`,
                    color: TEXT_MUTED,
                    paddingInline: 40,
                    fontSize: '1rem',
                  }}
                >
                  Sign in
                </Button>
              </Group>
            </Stack>
          </FadeIn>
        </Container>
      </Box>

      {/* ── Footer ── */}
      <Box py={32} style={{ borderTop: `1px solid ${BORDER}` }}>
        <Container size="xl">
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <ThemeIcon size={28} radius="sm" style={{ background: 'linear-gradient(135deg, #fb923c, #ea580c)' }}>
                <IconChefHat size={16} color="#050509" />
              </ThemeIcon>
              <Text fw={700} size="sm" c={TEXT_MAIN}>RestoApp</Text>
            </Group>
            <Text size="xs" c={TEXT_MUTED}>
              © 2026 RestoApp · Affordable technology for F&B, retail, and delivery
            </Text>
          </Group>
        </Container>
      </Box>
    </Box>
  );
}

/* ─── Graph section wrapper (needs its own inView) ─── */
function GraphSection() {
  const { ref, inView } = useInView(0.2);
  return (
    <div ref={ref}>
      <Stack gap="lg">
        <GmvGraph active={inView} />

        {/* Funding allocation bar chart */}
        <Box
          style={{
            borderRadius: 16,
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            padding: '20px 20px 16px',
          }}
        >
          <Text size="xs" fw={600} c={ACCENT_SOFT} tt="uppercase" mb="md" style={{ letterSpacing: 2 }}>
            $100K Allocation
          </Text>
          <Stack gap={10}>
            {[
              { label: 'Engineering & MVP', pct: 40, color: '#f97316' },
              { label: 'Merchant Onboarding', pct: 25, color: '#fb923c' },
              { label: 'Payment Infrastructure', pct: 20, color: '#fdba74' },
              { label: 'Kiosk Hardware', pct: 10, color: 'rgba(249,115,22,0.5)' },
              { label: 'Operations & Legal', pct: 5, color: 'rgba(249,115,22,0.3)' },
            ].map((row, i) => (
              <Box key={row.label}>
                <Group justify="space-between" mb={4}>
                  <Text size="xs" c={TEXT_MUTED}>{row.label}</Text>
                  <Text size="xs" fw={700} c={TEXT_MAIN}>{row.pct}%</Text>
                </Group>
                <Box
                  style={{
                    height: 6,
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    style={{
                      height: '100%',
                      width: inView ? `${row.pct}%` : '0%',
                      background: row.color,
                      borderRadius: 999,
                      transition: `width 0.9s cubic-bezier(0.22,1,0.36,1) ${200 + i * 100}ms`,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Box
      p="xl"
      style={{
        borderRadius: 16,
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        transition: 'border-color 0.2s, transform 0.2s',
        height: '100%',
      }}
      onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.borderColor = 'rgba(249,115,22,0.45)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.borderColor = BORDER;
        e.currentTarget.style.transform = 'none';
      }}
    >
      <ThemeIcon size={44} radius="md" mb="md" style={{ background: 'rgba(249,115,22,0.12)', color: ACCENT_SOFT }}>
        {icon}
      </ThemeIcon>
      <Text fw={700} c={TEXT_MAIN} mb="xs">{title}</Text>
      <Text size="sm" c={TEXT_MUTED}>{description}</Text>
    </Box>
  );
}

function CtaCard({
  icon,
  title,
  description,
  ctaLabel,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  to: string;
}) {
  return (
    <Box
      p="xl"
      style={{
        borderRadius: 20,
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        textAlign: 'left',
        transition: 'border-color 0.2s, transform 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.borderColor = 'rgba(249,115,22,0.5)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.borderColor = BORDER;
        e.currentTarget.style.transform = 'none';
      }}
    >
      <ThemeIcon size={44} radius="md" mb="md" style={{ background: 'rgba(249,115,22,0.15)', color: ACCENT_SOFT }}>
        {icon}
      </ThemeIcon>
      <Text fw={700} c={TEXT_MAIN} size="md" mb="xs">{title}</Text>
      <Text size="sm" c={TEXT_MUTED} mb="lg">{description}</Text>
      <Link to={to} style={{ textDecoration: 'none' }}>
        <Group gap={6}>
          <Text size="sm" fw={600} c={ACCENT_SOFT}>{ctaLabel}</Text>
          <IconArrowRight size={14} color={ACCENT_SOFT} />
        </Group>
      </Link>
    </Box>
  );
}
