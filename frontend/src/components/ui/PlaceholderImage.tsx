import { useContent } from '../../context/ContentContext';
import { cn } from '../../lib/cn';

interface PlaceholderImageProps {
  imageKey: string;
  alt?: string;
  className?: string;
  ratio?: string; // Tailwind aspect-ratio utility, e.g. "aspect-[4/3]"
  rounded?: string;
  // Tailwind object-position utility (e.g. "object-top") for the *cropped*
  // <img>. Cards using object-cover crop symmetrically around the CENTER by
  // default — fine for landscape shots, but a portrait crop (e.g. a 4:5
  // headshot box) will slice off the top of someone's head if the subject's
  // face sits in the upper part of the source photo. "object-top" anchors
  // the crop to the top of the image instead, which is the right default
  // for headshots. See PlaceholderImage usages for founder photos.
  objectPosition?: string;
}

/**
 * Renders an admin-managed image if one has been uploaded for `imageKey`,
 * otherwise renders a clearly-labelled placeholder so editors know exactly
 * what still needs to be filled in from the admin panel.
 */
export function PlaceholderImage({
  imageKey,
  alt,
  className = '',
  ratio = 'aspect-[4/3]',
  rounded = 'rounded-2xl',
  objectPosition = 'object-center',
}: PlaceholderImageProps) {
  const { getImage } = useContent();
  const image = getImage(imageKey, alt);

  if (image.url) {
    return (
      <div className={cn('card-media w-full', ratio, rounded, className)}>
        <img
          src={image.url}
          alt={image.altText || alt || ''}
          loading="lazy"
          className={cn('h-full w-full object-cover', objectPosition)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn('placeholder-box w-full flex-col p-4 text-center', ratio, rounded, className)}
      role="img"
      aria-label={`Placeholder image: ${alt || imageKey}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-8 w-8 opacity-70">
        <path
          d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="m4 16 5-5 3 3 4-5 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="8.5" cy="9" r="1.25" fill="currentColor" />
      </svg>
      <p className="text-xs font-semibold uppercase tracking-wide">Image placeholder</p>
      <p className="text-[11px] text-brand-700/80">{alt || 'To be added via Admin → Media Library'}</p>
    </div>
  );
}
