import { useContent } from '../../context/ContentContext';
import type { Partner } from '../../types/content';

// A short real partner list is repeated until it has at least this many
// logos in one "lap", so the marquee still reads as a continuous row (not
// just 2-3 logos awkwardly bouncing back and forth) while only a handful of
// partners have been published.
const MIN_LAP_ITEMS = 8;

// Admins often type a partner's address the way people say it ("www.acme.com"
// or "acme.com") rather than a full URL. Without a protocol the browser
// treats that as a relative path on our own site, so the click goes nowhere.
// Normalise to an absolute https URL, and only ever allow http(s) — never
// javascript:/data: etc. — since this value comes from the CMS.
function normalizeUrl(raw?: string): string | null {
  const value = (raw || '').trim();
  if (!value) return null;
  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value.replace(/^\/\//, '')}`;
  try {
    const url = new URL(withProtocol);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function PartnerLogo({ partner }: { partner: Partner }) {
  const { getImage } = useContent();
  const image = getImage(partner.imageKey, partner.name);
  const href = normalizeUrl(partner.websiteUrl);

  const card = (
    <div
      className={`flex h-20 w-36 shrink-0 items-center justify-center rounded-2xl bg-white p-4 shadow-card transition-shadow duration-200 sm:h-24 sm:w-44 ${
        href ? 'group-hover:shadow-soft group-focus-visible:shadow-soft' : ''
      }`}
    >
      {image.url ? (
        <img
          src={image.url}
          alt={image.altText || partner.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        // No logo uploaded yet for this key — show the partner's name
        // rather than a broken image, so the row still looks intentional.
        <span className="px-2 text-center text-xs font-semibold text-ink-300">{partner.name}</span>
      )}
    </div>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${partner.name} website`}
      title={`Visit ${partner.name}`}
      className="group flex cursor-pointer rounded-2xl transition-transform duration-200 ease-out hover:-translate-y-1 focus-visible:-translate-y-1"
    >
      {card}
    </a>
  ) : (
    card
  );
}

/**
 * Continuous right-to-left logo marquee for the homepage "Our Partners"
 * section. Renders two identical "laps" of logos back to back inside a
 * flex track sized to its content (w-max) and animates the track by
 * exactly -50% of its own width — i.e. the width of one lap — so the seam
 * between the end of lap one and the start of lap two is invisible and the
 * loop never visibly resets. Paused on hover/focus (see .partner-marquee in
 * index.css) so a visitor can read or click a logo, and frozen outright for
 * prefers-reduced-motion by the site-wide reduced-motion rule.
 */
export function PartnerMarquee({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  const lap: Partner[] = [];
  while (lap.length < MIN_LAP_ITEMS) {
    lap.push(...partners);
  }
  const track = [...lap, ...lap];

  // Slower for a longer lap so each logo stays on screen roughly the same
  // amount of time no matter how many partners are published.
  const durationSeconds = Math.max(18, lap.length * 3.5);

  return (
    // py-3: breathing room inside the clipped (overflow-hidden) marquee so the
    // hover lift + larger shadow on a linked logo isn't cut off at the edges.
    <div className="partner-marquee py-3">
      <ul className="partner-marquee-track" style={{ animationDuration: `${durationSeconds}s` }} aria-label="Our partners">
        {track.map((partner, i) => (
          <li key={`${partner.id}-${i}`} className="flex">
            <PartnerLogo partner={partner} />
          </li>
        ))}
      </ul>
    </div>
  );
}
