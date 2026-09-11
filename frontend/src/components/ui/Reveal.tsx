import type { ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';
import { cn } from '../../lib/cn';

/**
 * Wraps content that should fade + shift up into place once as it scrolls
 * into view (section headings, card grids). Pass `delay` (ms) to stagger
 * siblings, e.g. delay={i * 100} when mapping a list of cards.
 * `prefers-reduced-motion` is handled globally in index.css (the
 * transition collapses to ~0ms there), so this component doesn't need its
 * own reduced-motion branch — content still becomes visible, just without
 * the animated shift.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li';
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref as any}
      className={cn('reveal', inView && 'is-visible', className)}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  );
}
