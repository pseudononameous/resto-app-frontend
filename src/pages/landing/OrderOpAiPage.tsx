import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { orderOpAiApi, orderOpPublicApi } from '@services/api';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4';

const sleep = (ms: number) => new Promise((r) => window.setTimeout(r, ms));
const randomBetween = (min: number, max: number) =>
  Math.floor(min + Math.random() * (max - min + 1));

const formatList = (items: unknown, max = 12) => {
  if (!Array.isArray(items) || items.length === 0) return '—';
  const trimmed = items.filter(Boolean).map(String);
  if (trimmed.length === 0) return '—';
  const shown = trimmed.slice(0, max).join(', ');
  return trimmed.length > max ? `${shown} +${trimmed.length - max} more` : shown;
};

const OrderOpAiPage: FC = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<
    | 'idle'
    | 'collecting'
    | 'got_data'
    | 'ready'
    | 'saving'
    | 'details'
    | 'next_extracting_menu'
    | 'next_building_website'
    | 'next_importing_data'
    | 'next_all_done'
    | 'error'
  >('idle');
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [typedText, setTypedText] = useState('');
  const [typingTarget, setTypingTarget] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const patchPromiseRef = useRef<Promise<void> | null>(null);
  const restaurantIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== 'details') return;
    if (!typingTarget) return;

    let isCancelled = false;
    let idx = 0;
    setTypedText('');

    const tick = () => {
      if (isCancelled) return;
      if (idx >= typingTarget.length) return;
      setTypedText((prev) => prev + typingTarget[idx]);
      idx += 1;
      window.setTimeout(tick, 10);
    };

    window.setTimeout(tick, 200);
    return () => {
      isCancelled = true;
    };
  }, [phase, typingTarget]);

  const handlePreviewClick = async () => {
    if (!websiteUrl.trim()) return;

    const url = websiteUrl.trim();

    setIsRunning(true);
    setPhase('idle');
    setRestaurantId(null);
    restaurantIdRef.current = null;
    patchPromiseRef.current = null;
    setTypingTarget('');
    setTypedText('');
    setErrorMessage(null);

    try {
      // 1) Create restaurant (public)
      const createdRes = await orderOpPublicApi.createRestaurantFromWebsite({
        website_url: url,
      });
      const createdId = Number(createdRes.data?.restaurant_id);
      if (!Number.isFinite(createdId)) {
        throw new Error('Invalid restaurant_id returned');
      }
      setRestaurantId(createdId);
      restaurantIdRef.current = createdId;

      // 2) Immediately start ingest+patch in background
      const patchPromise = (async () => {
        const ingestRes = await orderOpAiApi.ingest({ website_url: url });
        const profile = ingestRes.data?.data?.profile ?? {};
        await orderOpPublicApi.updateRestaurantProfileFromJson(createdId, {
          output: profile,
        });
      })();
      patchPromiseRef.current = patchPromise;

      // 3) UX timers (time-based, not step randomizers)
      setPhase('collecting');
      await sleep(randomBetween(10_000, 15_000));

      setPhase('got_data');
      await sleep(randomBetween(5_000, 10_000));

      // 4) After timers, let user proceed (no auto-fetch)
      setPhase('ready');
    } catch (e) {
      console.error('Failed to preview website with OrderOp AI', e);
      setErrorMessage(e instanceof Error ? e.message : 'Failed to run OrderOp AI.');
      setPhase('error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleProceed = async () => {
    const rid = restaurantIdRef.current;
    if (!rid) return;
    setPhase('saving');
    setErrorMessage(null);
    try {
      // If the AI/PATCH step fails (often 503 when OpenAI isn't configured),
      // still allow the user to fetch whatever is already saved.
      if (patchPromiseRef.current) {
        try {
          await patchPromiseRef.current;
        } catch (e) {
          console.warn('AI ingest/patch failed; continuing to fetch restaurant anyway', e);
        }
      }
      const getRes = await orderOpPublicApi.getRestaurant(rid);
      const payload = (getRes.data ?? {}) as any;
      const d = (payload.data ?? {}) as Record<string, any>;

      const summaryLines: string[] = [];
      summaryLines.push(`Here’s what I learned about your business:`);
      summaryLines.push('');
      summaryLines.push(`Name: ${d.restaurant_name ?? d.name ?? '—'}`);
      summaryLines.push(`Website: ${d.website_url ?? '—'}`);
      summaryLines.push(`Cuisine type: ${d.cuisine_type ?? '—'}`);
      summaryLines.push(`Location: ${d.location ?? '—'}`);
      summaryLines.push(`Brand style: ${d.brand_style ?? '—'}`);
      summaryLines.push(`Price range: ${d.price_range ?? '—'}`);
      summaryLines.push(`Service style: ${d.service_style ?? '—'}`);
      summaryLines.push(`Plating style: ${d.plating_style ?? '—'}`);
      summaryLines.push('');
      summaryLines.push(`Common ingredients: ${formatList(d.common_ingredients)}`);
      summaryLines.push(`Common proteins: ${formatList(d.common_proteins)}`);
      summaryLines.push(`Menu categories: ${formatList(d.menu_categories)}`);
      summaryLines.push(`Signature dishes: ${formatList(d.signature_dishes)}`);
      summaryLines.push(`Dietary styles / allergens: ${formatList(d.known_allergens_or_dietary_styles)}`);
      summaryLines.push(`Sources: ${formatList(d.source_urls)}`);

      const textToType = summaryLines.join('\n');
      // Make state update order deterministic for typing effect.
      setTypedText('');
      setTypingTarget(textToType);
      setPhase('details');
    } catch (e) {
      console.error('Failed to fetch restaurant after AI run', e);
      setErrorMessage(e instanceof Error ? e.message : 'Failed to fetch restaurant data.');
      setPhase('error');
    }
  };

  const handleProceedNext = async () => {
    setErrorMessage(null);
    setPhase('next_extracting_menu');
    await sleep(randomBetween(10_000, 50_000));

    setPhase('next_building_website');
    await sleep(randomBetween(10_000, 15_000));

    setPhase('next_importing_data');
    await sleep(randomBetween(10_000, 15_000));

    setPhase('next_all_done');
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
                    {isRunning ? 'Working…' : 'Create'}
                  </button>
                </form>
              </div>

              {/* Bottom quote removed */}
            </div>
          </section>

          {/* Right panel — show AI output text when ready */}
          <aside
            style={{
              width: '40rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
            }}
          >
            {(phase === 'collecting' ||
              phase === 'got_data' ||
              phase === 'ready' ||
              phase === 'saving' ||
              phase === 'details' ||
              phase === 'next_extracting_menu' ||
              phase === 'next_building_website' ||
              phase === 'next_importing_data' ||
              phase === 'next_all_done' ||
              phase === 'error') && (
              <div
                className="liquid-glass-strong"
                style={{
                  width: '100%',
                  maxWidth: '40rem',
                  maxHeight: 'calc(100vh - 5rem)',
                  overflow: 'auto',
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
                  OrderOp AI
                </div>

                {phase === 'collecting' && (
                  <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)' }}>
                    Collecting details of your business…
                  </div>
                )}
                {phase === 'got_data' && (
                  <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)' }}>
                    All right we got your data
                  </div>
                )}
                {phase === 'saving' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)' }}>
                      Saving to database…
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>
                      Fetching your business details…
                    </div>
                  </div>
                )}
                {phase === 'next_extracting_menu' && (
                  <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)' }}>
                    Extracting menu information of your business…
                  </div>
                )}
                {phase === 'next_building_website' && (
                  <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)' }}>
                    Building your website…
                  </div>
                )}
                {phase === 'next_importing_data' && (
                  <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)' }}>
                    Importing data…
                  </div>
                )}
                {phase === 'ready' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)' }}>
                      All right we got your data
                    </div>
                    <button
                      type="button"
                      className="liquid-glass ooai-hover-scale"
                      onClick={handleProceed}
                      style={{
                        alignSelf: 'flex-start',
                        padding: '0.55rem 0.9rem',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        color: 'rgba(255,255,255,0.92)',
                        whiteSpace: 'nowrap',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Proceed
                    </button>
                  </div>
                )}
                {phase === 'error' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)' }}>
                      Something went wrong.
                    </div>
                    <div
                      style={{
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.75)',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {errorMessage ?? 'Unknown error.'}
                    </div>
                    <button
                      type="button"
                      className="liquid-glass ooai-hover-scale"
                      onClick={handleProceed}
                      disabled={restaurantId == null}
                      style={{
                        alignSelf: 'flex-start',
                        padding: '0.55rem 0.9rem',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        color: 'rgba(255,255,255,0.92)',
                        whiteSpace: 'nowrap',
                        border: 'none',
                        cursor: restaurantId == null ? 'not-allowed' : 'pointer',
                        opacity: restaurantId == null ? 0.6 : 1,
                      }}
                    >
                      Try fetch again
                    </button>
                  </div>
                )}
                {phase === 'details' && (
                  <div>
                    <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)', marginBottom: '0.6rem' }}>
                      This is your business details
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        fontSize: '0.78rem',
                        color: 'rgba(255,255,255,0.9)',
                        overflow: 'visible',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.55,
                      }}
                    >
                      {typedText}
                    </pre>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
                      <button
                        type="button"
                        className="liquid-glass ooai-hover-scale"
                        onClick={handleProceedNext}
                        style={{
                          padding: '0.7rem 1.05rem',
                          borderRadius: '999px',
                          fontSize: '0.82rem',
                          color: 'rgba(255,255,255,0.92)',
                          whiteSpace: 'nowrap',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Proceed next
                      </button>
                    </div>
                  </div>
                )}
                {phase === 'next_all_done' && (
                  <div style={{ display: 'grid', placeItems: 'center', minHeight: '16rem' }}>
                    <style>{`
                      @keyframes ooaiPulse {
                        0% { transform: scale(1); box-shadow: 0 0 0 rgba(251,146,60,0.0); }
                        50% { transform: scale(1.04); box-shadow: 0 0 24px rgba(251,146,60,0.35); }
                        100% { transform: scale(1); box-shadow: 0 0 0 rgba(251,146,60,0.0); }
                      }
                    `}</style>
                    <button
                      type="button"
                      className="liquid-glass-strong"
                      onClick={() => {
                        if (restaurantId) window.location.href = `/orderop/menu/${restaurantId}`;
                      }}
                      style={{
                        padding: '1.1rem 1.6rem',
                        borderRadius: '999px',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.95)',
                        border: 'none',
                        cursor: restaurantId ? 'pointer' : 'not-allowed',
                        opacity: restaurantId ? 1 : 0.6,
                        animation: 'ooaiPulse 1.4s ease-in-out infinite',
                      }}
                    >
                      All Done! Proceed to your website
                    </button>
                  </div>
                )}
              </div>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
};

export default OrderOpAiPage;

