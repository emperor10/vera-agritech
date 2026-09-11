import { useState } from 'react';
import type { Faq } from '../../types/content';

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);

  return (
    <div className="divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id}>
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${faq.id}`}
                onClick={() => setOpenId(isOpen ? null : faq.id)}
              >
                <span className="font-semibold text-brand-950">{faq.question}</span>
                <span
                  className={`shrink-0 rounded-full border border-ink-100 p-1 text-brand-700 transition-transform ${isOpen ? 'rotate-45' : ''}`}
                  aria-hidden="true"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            {isOpen && (
              <div id={`faq-panel-${faq.id}`} className="px-5 pb-5 text-sm leading-relaxed text-ink-500">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
