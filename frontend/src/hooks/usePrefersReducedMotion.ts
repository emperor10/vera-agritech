import { useEffect, useState } from 'react';

/** Mirrors the `prefers-reduced-motion` media query as React state, so
 * JS-driven motion (autoplay timers, the hero's Ken Burns zoom) can be
 * skipped outright — not just sped up via CSS — for anyone who has asked
 * their OS/browser to reduce motion. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
