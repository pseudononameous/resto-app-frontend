import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { orderOpPublicApi } from '@services/api';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4';

const EXTRACTION_STEPS = [
  'Extracting your layout and structure…',
  'Discovering navigation patterns across your pages…',
  'Scraping content and data from the internet…',
  'Detecting sections, hero areas, and calls-to-action…',
  'Creating CSV file of your source data…',
  'Cleaning and normalizing CSV columns…',
  'Merging duplicate rows and resolving conflicts…',
  'Classifying items into collections and categories…',
  'Detecting pricing, variants, and availability…',
  'Mapping data fields into OrderOp schemas…',
  'Importing CSV into the OrderOp workspace…',
  'Linking content to menu, catalog, and location models…',
  'Generating responsive layout grids for your website…',
  'Composing hero, section, and footer components…',
  'Optimizing typography, spacing, and visual rhythm…',
  'Applying glass and depth treatments to surfaces…',
  'Assembling interactions and state flows…',
  'Running accessibility and responsiveness passes…',
  'Building a preview-ready version of your website…',
  'Preparing design-ready assets for OrderOp…',
  'Finalizing deployment bundle for your website…',
];

const OrderOpAiPage: FC = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [activeSteps, setActiveSteps] = useState<string[]>(EXTRACTION_STEPS);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isExtracting) return;

    const stepsCount = activeSteps.length;
    if (stepsCount === 0) return;

    setCurrentStepIndex(0);

    const stepInterval = window.setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev == null) return 0;
        if (prev >= stepsCount - 1) return prev;
        return prev + 1;
      });
    }, 1600);

    return () => {
      window.clearInterval(stepInterval);
    };
  }, [isExtracting, activeSteps.length]);

  const handlePreviewClick = async () => {
    if (!websiteUrl.trim()) return;

    // Create a restaurant record from this website URL (no auth required)
    try {
      await orderOpPublicApi.createRestaurantFromWebsite({ website_url: websiteUrl.trim() });
    } catch (e) {
      // Non-blocking: log and continue the UX animation
      console.error('Failed to create restaurant from website', e);
    }

    // Shuffle steps so order sometimes changes
    const shuffled = [...EXTRACTION_STEPS].sort(() => Math.random() - 0.5);
    setActiveSteps(shuffled);
    setIsFinished(false);
    setIsExtracting(true);

    // Simulate extraction time, then show completion state.
    window.setTimeout(() => {
      setIsExtracting(false);
      setIsFinished(true);
    }, 16000);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        color: 'rgba(255,255,255,0.9)',
        backgroundColor: 'hsl(0 0% 3%)',
        fontFamily: "'Onest', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        src={VIDEO_URL}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle warm overlay for contrast + gentle orange globe tint */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(circle at 20% 10%, rgba(251,146,60,0.18), transparent 55%), radial-gradient(circle at 80% 90%, rgba(24,24,27,0.9), rgba(0,0,0,0.96))',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <main
          style={{
            display: 'flex',
            flexDirection: 'row',
            minHeight: '100vh',
            padding: '1.25rem',
            gap: '1rem',
          }}
        >
          {/* Left panel */}
          <section
            style={{
              width: '100%',
              maxWidth: '56rem',
              flex: 1,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '1.5rem',
              padding: '1.25rem',
            }}
          >
            <div
              className="liquid-glass-strong"
              style={{
                position: 'absolute',
                inset: '1rem',
                borderRadius: '1.5rem',
              }}
            />
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '1.75rem',
                gap: '1.5rem',
              }}
            >
              {/* Center hero */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '1.75rem',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  maxWidth: '36rem',
                }}
              >
                <h1
                  style={{
                    fontWeight: 500,
                    fontSize: 'clamp(2.6rem, 4vw, 3.6rem)',
                    lineHeight: 1.05,
                    letterSpacing: '-0.05em',
                    color: 'hsl(0 0% 100%)',
                    maxWidth: '32rem',
                  }}
                >
                  Affordable intelligence to revolutionize{' '}
                  <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.85)' }}>F&amp;B, retail</span> and{' '}
                  <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.85)' }}>delivery</span>.
                </h1>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.6)',
                    maxWidth: '30rem',
                  }}
                >
                  OrderOp AI is the glass-like command center that lets operators own their entire digital experience —
                  from QR ordering and kiosks to loyalty, payments, inventory, and analytics.
                </p>

                {/* Simple website link capture */}
                <form
                  style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '0.6rem',
                    maxWidth: '30rem',
                  }}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div
                    className="liquid-glass"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '999px',
                    }}
                  >
                    <input
                      type="url"
                      placeholder="Paste your website link here"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '0.82rem',
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="liquid-glass-strong ooai-hover-scale"
                    onClick={handlePreviewClick}
                    style={{
                      padding: '0.55rem 0.9rem',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      color: 'rgba(255,255,255,0.9)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Preview
                  </button>
                </form>
                {isExtracting && currentStepIndex != null && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.86)',
                    }}
                  >
                    {activeSteps.map((step, index) => {
                      if (index > currentStepIndex) return null;
                      const isCurrent = index === currentStepIndex;
                      const isDone = index < currentStepIndex;
                      return (
                        <div
                          key={step}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            opacity: isDone ? 0.7 : 1,
                          }}
                        >
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '999px',
                              background: isDone
                                ? 'rgba(34,197,94,0.9)'
                                : 'radial-gradient(circle at 30% 30%, rgba(251,146,60,0.9), rgba(15,15,15,1))',
                              boxShadow: isCurrent
                                ? '0 0 12px rgba(251,146,60,0.6)'
                                : undefined,
                            }}
                          />
                          <span style={{ color: isCurrent ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.8)' }}>
                            {step}
                            {isCurrent && ' ▌'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom quote removed */}
            </div>
          </section>

          {/* Right panel — completion state */}
          <aside
            style={{
              width: '34rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
            }}
          >
            {isFinished && (
              <div
                className="liquid-glass-strong"
                style={{
                  width: '100%',
                  maxWidth: '30rem',
                  padding: '1.4rem 1.8rem',
                  borderRadius: '1.75rem',
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.8rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Website preview
                </div>
                <div
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    marginBottom: '0.4rem',
                  }}
                >
                  Your website is ready.
                </div>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.7)',
                    marginBottom: '0.9rem',
                  }}
                >
                  Click below to see your website in action with extracted data, layout, and components wired up.
                </p>
                <button
                  type="button"
                  className="liquid-glass ooai-hover-scale"
                  style={{
                    padding: '0.65rem 1.1rem',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.95)',
                  }}
                >
                  <span>See website in action</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
};

export default OrderOpAiPage;

