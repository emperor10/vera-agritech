import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlaceholderImage } from './PlaceholderImage';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { cn } from '../../lib/cn';

export interface HeroSlide {
  imageKey: string;
  imageAlt: string;
  eyebrow: string;
}

interface CtaLink {
  label: string;
  path: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  heading: string;
  subheading: string;
  body: string;
  ctaPrimary: CtaLink;
  ctaSecondary: CtaLink;
}

const DISPLAY_MS = 6200;
const CROSSFADE_MS = 1200;

/**
 * Full-bleed hero image carousel: crossfade + a slow "Ken Burns" zoom on
 * whichever slide is active, a stable headline (only the small eyebrow
 * changes per slide), a once-on-load staggered text entrance, and
 * click-through indicators + desktop-only prev/next arrows (mobile keeps
 * just the indicators, per the design brief).
 *
 * Autoplay and the zoom animation are both skipped entirely — not just
 * sped up — when the visitor has asked for reduced motion; the slide
 * stays on the first image rather than auto-advancing.
 */
export function HeroCarousel({ slides: rawSlides, heading, subheading, body, ctaPrimary, ctaSecondary }: HeroCarouselProps) {
  // Defensive guard: if the content source (older seeded DB row, a partial
  // CMS edit, etc.) doesn't yet have the `hero.slides` array in this shape,
  // fall back to a single empty slide instead of throwing during render.
  // An uncaught error here has no Error Boundary above it in this app, so
  // previously a missing/empty `slides` array would blank the entire page,
  // not just the hero — this guard is what prevents that class of bug.
  const slides = Array.isArray(rawSlides) && rawSlides.length > 0 ? rawSlides : [{ imageKey: 'home-hero-image', imageAlt: '', eyebrow: '' }];

  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, DISPLAY_MS);
    return () => clearInterval(id);
  }, [slides.length, cycle, reducedMotion]);

  function goTo(i: number) {
    setIndex(i);
    setCycle((c) => c + 1);
  }
  function next() {
    goTo((index + 1) % slides.length);
  }
  function prev() {
    goTo((index - 1 + slides.length) % slides.length);
  }

  const active = slides[Math.min(index, slides.length - 1)];

  return (
    <section
      className="relative overflow-hidden bg-brand-900 text-white"
      aria-roledescription="carousel"
      aria-label="Vera AgriTech highlights"
    >
      <div className="relative min-h-[600px] sm:min-h-[640px] lg:min-h-[680px]">
        {/* Slides */}
        {slides.map((slide, i) => (
          <div
            key={slide.imageKey}
            className="absolute inset-0"
            style={{
              opacity: i === index ? 1 : 0,
              transition: `opacity ${CROSSFADE_MS}ms ease-out`,
            }}
            aria-hidden={i !== index}
          >
            <div
              key={i === index ? `active-${cycle}` : 'idle'}
              className="h-full w-full"
              style={
                i === index && !reducedMotion
                  ? { animation: `hero-kenburns ${(DISPLAY_MS + CROSSFADE_MS) / 1000}s linear forwards` }
                  : undefined
              }
            >
              <PlaceholderImage
                imageKey={slide.imageKey}
                alt={slide.imageAlt}
                ratio="aspect-auto"
                rounded="rounded-none"
                className="h-full w-full"
              />
            </div>
          </div>
        ))}

        {/* Dark overlay for text legibility: stronger on the left where the
            copy sits, fading out toward the right so the photo still reads. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-950/92 via-brand-950/55 to-brand-900/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent" />

        {/* Copy */}
        <div className="container-page relative z-10 flex min-h-[600px] items-center py-16 sm:min-h-[640px] lg:min-h-[680px]">
          <div className="max-w-2xl">
            <p key={`eyebrow-${index}`} className="eyebrow animate-fade-up text-gold-300" style={{ animationDelay: '0.1s' }}>
              {active.eyebrow}
            </p>
            <h1
              className="mt-3 animate-fade-up text-4xl leading-tight text-white sm:text-5xl lg:text-6xl"
              style={{ animationDelay: '0.25s' }}
            >
              {heading}
            </h1>
            <p className="mt-4 animate-fade-up text-xl font-medium text-brand-100" style={{ animationDelay: '0.4s' }}>
              {subheading}
            </p>
            <p className="mt-4 max-w-xl animate-fade-up text-base text-brand-200" style={{ animationDelay: '0.4s' }}>
              {body}
            </p>
            <div className="mt-8 flex animate-fade-up flex-wrap gap-3" style={{ animationDelay: '0.55s' }}>
              <Link to={ctaPrimary.path} className="btn-primary">
                {ctaPrimary.label}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h9M8 3.5 12.5 8 8 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link to={ctaSecondary.path} className="btn-outline-light">
                {ctaSecondary.label}
              </Link>
            </div>
          </div>
        </div>

        {/* Prev/next — desktop only; mobile keeps just the indicators */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors duration-200 hover:bg-white/20 lg:flex"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors duration-200 hover:bg-white/20 lg:flex"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {/* Indicators */}
        {slides.length > 1 && (
          <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-3">
            <span className="text-xs font-semibold tabular-nums text-white/70">
              {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.imageKey}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300 ease-out',
                    i === index ? 'w-8 bg-gold-400' : 'w-3 bg-white/40 hover:bg-white/60'
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
