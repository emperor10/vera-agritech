import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class lists safely. Plain string concatenation (or clsx
 * alone) can leave two conflicting utilities for the same CSS property
 * (e.g. `w-full` from a component's base classes next to a caller's
 * `w-11`) — which one wins then depends on Tailwind's internal stylesheet
 * order, not on which class appears "later" in the className string. That
 * caused the stretched/oversized testimonial avatar placeholder: the
 * avatar wrapper always got `w-full` from its base styles, and the
 * caller's `w-11` sometimes lost the cascade. `twMerge` resolves that by
 * dropping the earlier, conflicting utility, so the last one specified
 * always wins as expected.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
