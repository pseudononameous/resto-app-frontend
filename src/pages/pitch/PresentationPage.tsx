import {
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
  Transition,
  ThemeIcon,
  SimpleGrid,
} from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChefHat,
  IconCloudOff,
  IconBulb,
  IconRocket,
  IconNetwork,
  IconShieldCheck,
  IconLayoutDashboard,
  IconBuildingStore,
  IconSparkles,
  IconHeart,
  IconMoodSmile,
  IconPlayerPlay,
  IconTargetArrow,
  IconCoffee,
  IconTools,
  IconTrendingUp,
  IconCheck,
  type TablerIcon,
} from '@tabler/icons-react';

const CANVAS = '#050509';
const TEXT_MAIN = '#f9fafb';
const TEXT_MUTED = '#9ca3af';
const ACCENT_SOFT = '#fb923c';
const ACCENT_GRADIENT = 'linear-gradient(135deg, #fb923c 0%, #ea580c 50%, #c2410c 100%)';
const BORDER = 'rgba(255,255,255,0.08)';
const CARD_BG = 'rgba(255,255,255,0.04)';
const FONT_FAMILY = "'Onest', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// Hero image - restaurant / order operations vibe (Unsplash, free to use)
const HERO_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80';
// Live demo URL (replace with your actual Google Drive link)
const DEMO_URL = 'https://drive.google.com/your-demo-link';

type SlideContent = string | string[];

interface Slide {
  title?: string;
  content: SlideContent;
  icon?: TablerIcon;
  image?: boolean; // use hero image as background for this slide
}

const SLIDES: Slide[] = [
  {
    title: 'The Restaurant Problem Nobody Talks About',
    content: [
      'Orders come from everywhere.',
      'POS',
      'Delivery Apps',
      'Mobile Orders',
      'QR Menus',
      'Phone Orders',
      'But none of them truly work together.',
    ],
    icon: IconCloudOff,
    image: true,
  },
  {
    title: 'The Hidden Chaos of Restaurant Operations',
    content: [
      'Multiple ordering channels',
      'Disconnected systems',
      'Lost customer data',
      'High commission fees',
      'Operational friction',
    ],
    icon: IconCloudOff,
  },
  {
    title: "The Problem Isn't Ordering. It's **Order Operations.**",
    content: [],
    icon: IconBulb,
  },
  {
    title: 'Introducing OrderOp',
    content: ['Order Operations Platform', 'Unifying restaurant ordering into one ecosystem.'],
    icon: IconRocket,
    image: true,
  },
  {
    title: 'OrderOp Ecosystem',
    content: [
      'Center Hub',
      'Connected Systems',
      'POS',
      'Kitchen Display',
      'Mobile Ordering',
      'QR Ordering',
      'Kiosk',
      'Marketing & Loyalty',
      'Analytics',
    ],
    icon: IconNetwork,
  },
  {
    title: 'Why This Matters',
    content: [
      'Restaurants regain control of:',
      'Customer Data',
      'Operations',
      'Marketing',
      'Revenue',
    ],
    icon: IconShieldCheck,
  },
  {
    title: 'The Platform',
    content: [
      'Core Systems',
      'Central Hub',
      'Themes & Settings',
      'Menu & Catalog Management',
      'Analytics',
      'Operational Tools',
      'POS',
      'Kitchen App',
    ],
    icon: IconLayoutDashboard,
  },
  {
    title: 'Business Systems',
    content: [
      'Administrative Platforms',
      'Super Admin Platform',
      'Partner & Sales Portal',
      'Merchant Dashboard',
    ],
    icon: IconBuildingStore,
  },
  {
    title: 'Where the Magic Happens',
    content: [
      'Customer Facing Systems',
      'Kiosk Ordering',
      'QR Ordering',
      'Mobile App',
      'Marketing & Loyalty',
    ],
    icon: IconSparkles,
  },
  {
    title: 'Why Restaurants Want This',
    content: [
      'Direct Customer Ownership',
      'Lower Costs',
      'Push Notifications',
      'Loyalty Programs',
      'Promotions',
      'Customer Engagement',
    ],
    icon: IconHeart,
  },
  {
    title: 'User Experience',
    content: ['Fast', 'Simple', 'Beautiful', 'Frictionless'],
    icon: IconMoodSmile,
  },
  {
    title: 'Live Demo',
    content: [],
    icon: IconPlayerPlay,
  },
  {
    title: 'Target Market',
    content: [
      'Ideal Businesses',
      'Coffee Shops',
      'Fast Casual Restaurants',
      'Quick Service Restaurants',
      'Concept Restaurants',
      'Best Fit',
      'Frequent repeat orders',
      'Low-to-medium SKU catalogs',
    ],
    icon: IconTargetArrow,
  },
  {
    title: 'Example Concepts',
    content: [
      'Example Brand Concepts',
      'FitEats',
      'Coffee Brands',
      'Sushi Concepts',
      'B2B Food Services',
      'Hook & Anchor',
      'CBD Concepts',
    ],
    icon: IconCoffee,
  },
  {
    title: "What We're Building",
    content: [
      'Platform Features',
      'Unified Ordering',
      'Customer Engagement',
      'Marketing Tools',
      'Operational Analytics',
    ],
    icon: IconTools,
  },
  {
    title: 'Go To Market',
    content: [
      'Sales Strategy',
      'Direct Merchant Sales',
      'Partner Networks',
      'Enterprise Partnerships',
    ],
    icon: IconTrendingUp,
  },
  {
    title: 'OrderOp',
    content: ['The Future of Restaurant Order Operations'],
    icon: IconChefHat,
    image: true,
  },
];

function renderTitleWithBold(title: string) {
  const parts = title.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <Text key={i} component="span" inherit c={ACCENT_SOFT} fw={800}>
        {part}
      </Text>
    ) : (
      part
    )
  );
}

const HEADING_LINES = [
  'Core Systems', 'Operational Tools', 'Administrative Platforms', 'Customer Facing Systems',
  'Ideal Businesses', 'Best Fit', 'Example Brand Concepts', 'Platform Features', 'Sales Strategy',
  'Restaurants regain control of:', 'Center Hub', 'Connected Systems',
];

function SlideContent({ content, animate }: { content: SlideContent; animate?: boolean }) {
  if (typeof content === 'string') {
    return (
      <Text
        size="xl"
        c={TEXT_MUTED}
        ta="center"
        maw={720}
        mx="auto"
        style={{
          lineHeight: 1.7,
          fontFamily: FONT_FAMILY,
          animation: animate ? 'slideInUp 0.6s ease-out forwards' : undefined,
        }}
      >
        {content}
      </Text>
    );
  }
  if (content.length === 0) return null;
  return (
    <Stack gap="sm" maw={680} mx="auto" align="center">
      {content.map((line, i) => {
        const isHeading = line.endsWith(':') || HEADING_LINES.includes(line);
        return (
          <Text
            key={i}
            size={isHeading ? 'xl' : 'lg'}
            fw={isHeading ? 700 : 400}
            c={isHeading ? ACCENT_SOFT : TEXT_MUTED}
            ta="center"
            style={{
              lineHeight: 1.6,
              fontFamily: FONT_FAMILY,
              animation: animate ? `slideInUp 0.5s ease-out ${i * 0.06}s forwards` : undefined,
              opacity: animate ? 0 : 1,
            }}
          >
            {line.replace(/\*\*(.*?)\*\*/g, '$1')}
          </Text>
        );
      })}
    </Stack>
  );
}

function SlideView({
  slide,
  index,
  total,
  onPrev,
  onNext,
  onGoToSlide,
}: {
  slide: Slide;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onGoToSlide: (i: number) => void;
}) {
  const isTitleOnly = !slide.content || (Array.isArray(slide.content) && slide.content.length === 0);
  const SlideIcon = slide.icon;
  const hasImage = slide.image;

  // Special layout for Live Demo slide
  if (slide.title === 'Live Demo') {
    return (
      <Box
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2rem 1rem 6rem',
        }}
      >
        <Container size="sm">
          <Stack
            gap="lg"
            align="center"
            ta="center"
            style={{ fontFamily: FONT_FAMILY, animation: 'slideInUp 0.5s ease-out forwards' }}
          >
            <ThemeIcon
              size={96}
              radius="xl"
              variant="gradient"
              gradient={{ from: '#fb923c', to: '#ea580c', deg: 135 }}
              style={{
                boxShadow: '0 0 40px rgba(251, 146, 60, 0.4)',
                border: '2px solid rgba(251, 146, 60, 0.4)',
              }}
            >
              <IconPlayerPlay size={48} stroke={2} />
            </ThemeIcon>
            <Title
              order={1}
              fw={800}
              c={TEXT_MAIN}
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                letterSpacing: -0.6,
              }}
            >
              Live Demo
            </Title>
            <Text
              size="lg"
              c={TEXT_MUTED}
              maw={520}
              style={{ lineHeight: 1.7, fontFamily: FONT_FAMILY }}
            >
              Play a real walkthrough of the OrderOp experience — from customer order to kitchen
              operations.
            </Text>
            <Group gap="md" mt="sm">
              <Button
                component="a"
                href={DEMO_URL}
                target="_blank"
                rel="noreferrer"
                size="lg"
                radius="md"
                style={{
                  background: ACCENT_GRADIENT,
                  color: '#050509',
                  fontFamily: FONT_FAMILY,
                  fontWeight: 700,
                  paddingInline: 32,
                }}
                leftSection={<IconPlayerPlay size={18} />}
              >
                Play live demo
              </Button>
              <Button
                component={Link}
                to="/pitch-deck"
                variant="outline"
                size="lg"
                radius="md"
                style={{
                  borderColor: BORDER,
                  color: TEXT_MUTED,
                  fontFamily: FONT_FAMILY,
                  paddingInline: 28,
                }}
              >
                View full deck
              </Button>
            </Group>
          </Stack>
        </Container>

        {/* Progress + navigation reused below */}
        <Box
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: BORDER,
            zIndex: 60,
          }}
        >
          <Box
            style={{
              height: '100%',
              width: `${((index + 1) / total) * 100}%`,
              background: ACCENT_GRADIENT,
              borderRadius: '0 2px 0 0',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </Box>

        <Group
          justify="space-between"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '1rem 1.5rem',
            background: 'rgba(5,5,9,0.94)',
            backdropFilter: 'blur(16px)',
            borderTop: `1px solid ${BORDER}`,
            zIndex: 50,
            fontFamily: FONT_FAMILY,
          }}
        >
          <Button
            variant="subtle"
            color="gray"
            leftSection={<IconChevronLeft size={18} />}
            onClick={onPrev}
            disabled={index === 0}
            style={{
              color: index === 0 ? TEXT_MUTED : TEXT_MAIN,
              fontFamily: FONT_FAMILY,
              fontWeight: 600,
            }}
          >
            Previous
          </Button>
          <Text size="sm" c={TEXT_MUTED} fw={500} style={{ fontFamily: FONT_FAMILY }}>
            {index + 1} / {total}
          </Text>
          <Button
            variant="subtle"
            color="gray"
            rightSection={<IconChevronRight size={18} />}
            onClick={onNext}
            disabled={index === total - 1}
            style={{
              color: index === total - 1 ? TEXT_MUTED : TEXT_MAIN,
              fontFamily: FONT_FAMILY,
              fontWeight: 600,
            }}
          >
            Next
          </Button>
        </Group>
      </Box>
    );
  }

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2rem 1rem 6rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background image for selected slides */}
      {hasImage && (
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          <Box
            component="img"
            src={HERO_IMAGE}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.18,
            }}
          />
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, ${CANVAS} 0%, transparent 40%, ${CANVAS} 100%)`,
              pointerEvents: 'none',
            }}
          />
        </Box>
      )}

      <Container size="md" style={{ position: 'relative', zIndex: 1 }}>
        <Stack gap="xl" align="center" ta="center">
          {/* Slide icon */}
          {SlideIcon && (
            <Box style={{ animation: 'iconPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}>
              <ThemeIcon
                size={80}
                radius="xl"
                variant="gradient"
                gradient={{ from: '#fb923c', to: '#ea580c', deg: 135 }}
                style={{
                  boxShadow: '0 0 40px rgba(251, 146, 60, 0.35)',
                  border: '2px solid rgba(251, 146, 60, 0.3)',
                }}
              >
                <SlideIcon size={40} stroke={2} />
              </ThemeIcon>
            </Box>
          )}

          {slide.title && (
            <Title
              order={1}
              fw={800}
              c={TEXT_MAIN}
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 'clamp(1.75rem, 4.5vw, 3rem)',
                letterSpacing: -0.5,
                maxWidth: 800,
                lineHeight: 1.2,
                animation: 'slideInUp 0.6s ease-out 0.1s forwards',
                textShadow: hasImage ? '0 2px 24px rgba(0,0,0,0.5)' : undefined,
              }}
            >
              {slide.title.includes('**') ? renderTitleWithBold(slide.title) : slide.title}
            </Title>
          )}

          {!isTitleOnly && (
            <Box style={{ marginTop: slide.title ? 4 : 0 }}>
              {/* Pill badges for short non-heading lists (e.g. Fast, Simple, Beautiful) */}
              {Array.isArray(slide.content) &&
              slide.content.length <= 6 &&
              slide.content.length >= 2 &&
              !(slide.content as string[]).some((line) => line.endsWith(':') || HEADING_LINES.includes(line)) ? (
                <SimpleGrid
                  cols={{ base: 2, xs: 4 }}
                  spacing="md"
                  style={{ animation: 'slideInUp 0.5s ease-out 0.2s forwards' }}
                >
                  {(slide.content as string[]).map((item, i) => (
                    <Box
                      key={i}
                      py="md"
                      px="lg"
                      style={{
                        borderRadius: 16,
                        background: CARD_BG,
                        border: `1px solid ${BORDER}`,
                        fontFamily: FONT_FAMILY,
                        fontWeight: 600,
                        color: TEXT_MAIN,
                        fontSize: '0.95rem',
                        animation: `slideInUp 0.5s ease-out ${0.15 + i * 0.06}s forwards`,
                        opacity: 0,
                      }}
                    >
                      <Group gap={8} justify="center">
                        <IconCheck size={16} color={ACCENT_SOFT} />
                        <Text size="sm" fw={600} style={{ fontFamily: FONT_FAMILY }}>
                          {item}
                        </Text>
                      </Group>
                    </Box>
                  ))}
                </SimpleGrid>
              ) : (
                <SlideContent content={slide.content} animate />
              )}
            </Box>
          )}
        </Stack>
      </Container>

      {/* Progress bar */}
      <Box
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: BORDER,
          zIndex: 60,
        }}
      >
        <Box
          style={{
            height: '100%',
            width: `${((index + 1) / total) * 100}%`,
            background: ACCENT_GRADIENT,
            borderRadius: '0 2px 0 0',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </Box>

      {/* Navigation */}
      <Group
        justify="space-between"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem 1.5rem',
          background: 'rgba(5,5,9,0.94)',
          backdropFilter: 'blur(16px)',
          borderTop: `1px solid ${BORDER}`,
          zIndex: 50,
          fontFamily: FONT_FAMILY,
        }}
      >
        <Button
          variant="subtle"
          color="gray"
          leftSection={<IconChevronLeft size={18} />}
          onClick={onPrev}
          disabled={index === 0}
          style={{
            color: index === 0 ? TEXT_MUTED : TEXT_MAIN,
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
          }}
        >
          Previous
        </Button>
        <Text size="sm" c={TEXT_MUTED} fw={500} style={{ fontFamily: FONT_FAMILY }}>
          {index + 1} / {total}
        </Text>
        <Button
          variant="subtle"
          color="gray"
          rightSection={<IconChevronRight size={18} />}
          onClick={onNext}
          disabled={index === total - 1}
          style={{
            color: index === total - 1 ? TEXT_MUTED : TEXT_MAIN,
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
          }}
        >
          Next
        </Button>
      </Group>

      {/* Dots */}
      <Group
        gap={8}
        justify="center"
        style={{
          position: 'fixed',
          bottom: 72,
          left: 0,
          right: 0,
          zIndex: 40,
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <Box
            key={i}
            onClick={() => onGoToSlide(i)}
            style={{
              width: i === index ? 28 : 10,
              height: 10,
              borderRadius: 5,
              background: i === index ? ACCENT_SOFT : BORDER,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: i === index ? '0 0 12px rgba(251, 146, 60, 0.4)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (i !== index) {
                e.currentTarget.style.background = 'rgba(251, 146, 60, 0.4)';
                e.currentTarget.style.transform = 'scale(1.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (i !== index) {
                e.currentTarget.style.background = BORDER;
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          />
        ))}
      </Group>
    </Box>
  );
}

const TRANSITION_DURATION = 380;

export default function PresentationPage() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [mounted, setMounted] = useState(true);

  const total = SLIDES.length;
  const go = useCallback(
    (delta: number) => {
      const next = Math.max(0, Math.min(total - 1, index + delta));
      if (next === index) return;
      setDirection(delta > 0 ? 'forward' : 'back');
      setMounted(false);
      setTimeout(() => {
        setIndex(next);
        setMounted(true);
      }, TRANSITION_DURATION);
    },
    [index, total]
  );

  const goToSlide = useCallback(
    (next: number) => {
      if (next === index || next < 0 || next >= total) return;
      setDirection(next > index ? 'forward' : 'back');
      setMounted(false);
      setTimeout(() => {
        setIndex(next);
        setMounted(true);
      }, TRANSITION_DURATION);
    },
    [index, total]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go]);

  const slide = SLIDES[index];

  return (
    <Box
      style={{
        fontFamily: FONT_FAMILY,
        background: CANVAS,
        color: TEXT_MAIN,
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Global keyframes for animations */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes iconPop {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      {/* Header */}
      <Box
        component="header"
        py="md"
        px="xl"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(5,5,9,0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${BORDER}`,
          fontFamily: FONT_FAMILY,
        }}
      >
        <Container size="xl">
          <Group justify="space-between">
            <Group gap="sm">
              <ThemeIcon
                size={38}
                radius="md"
                variant="gradient"
                gradient={{ from: '#fb923c', to: '#ea580c', deg: 135 }}
                style={{
                  boxShadow: '0 0 20px rgba(249,115,22,0.4)',
                  border: '1px solid rgba(251, 146, 60, 0.3)',
                }}
              >
                <IconChefHat size={20} color="#050509" />
              </ThemeIcon>
              <Text fw={800} size="lg" c={TEXT_MAIN} style={{ fontFamily: FONT_FAMILY, letterSpacing: -0.5 }}>
                OrderOp · Presentation
              </Text>
            </Group>
            <Group gap="xs">
              <Button
                component={Link}
                to="/"
                variant="subtle"
                size="sm"
                style={{ color: TEXT_MUTED, fontFamily: FONT_FAMILY }}
              >
                Back to home
              </Button>
              <Button
                component={Link}
                to="/pitch-deck"
                variant="subtle"
                size="sm"
                style={{ color: TEXT_MUTED, fontFamily: FONT_FAMILY }}
              >
                Pitch deck
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Slide with transition - smoother and longer */}
      <Transition
        mounted={mounted}
        transition={
          direction === 'forward'
            ? {
                in: { opacity: 1, transform: 'translateX(0) scale(1)' },
                out: { opacity: 0, transform: 'translateX(-36px) scale(0.98)' },
                transitionProperty: 'opacity, transform' as const,
              }
            : {
                in: { opacity: 1, transform: 'translateX(0) scale(1)' },
                out: { opacity: 0, transform: 'translateX(36px) scale(0.98)' },
                transitionProperty: 'opacity, transform' as const,
              }
        }
        duration={TRANSITION_DURATION}
        timingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
      >
        {(styles) => (
          <div style={styles}>
            <SlideView
              slide={slide}
              index={index}
              total={total}
              onPrev={() => go(-1)}
              onNext={() => go(1)}
              onGoToSlide={goToSlide}
            />
          </div>
        )}
      </Transition>
    </Box>
  );
}
