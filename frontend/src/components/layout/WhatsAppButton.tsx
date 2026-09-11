import { useContent } from '../../context/ContentContext';

export function WhatsAppButton() {
  const { content } = useContent();
  const s = content.settings;
  if (!s?.whatsapp) return null;

  const url = `https://wa.me/${s.whatsapp}?text=${encodeURIComponent(s.whatsappMessage || 'Hello Vera AgriTech')}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat with Vera AgriTech on WhatsApp"
      className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex h-14 items-center gap-0 overflow-hidden rounded-full bg-[#25D366] px-[0.875rem] text-white shadow-soft transition-all duration-300 ease-out hover:gap-2 hover:pr-5 hover:shadow-[0_14px_34px_-10px_rgba(37,211,102,0.55)]"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.4-1.36a9.87 9.87 0 0 0 4.64 1.16h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2Zm5.7 14.02c-.24.68-1.4 1.32-1.94 1.4-.5.08-1.12.11-1.8-.11-.42-.13-.96-.3-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.35 1.46.29.15.46.13.63-.08.17-.21.72-.84.91-1.13.19-.29.38-.24.64-.14.26.1 1.65.78 1.94.92.29.14.48.21.55.33.07.12.07.68-.17 1.36Z" />
      </svg>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 ease-out group-hover:max-w-[9rem] group-hover:opacity-100">
        Chat with Vera
      </span>
    </a>
  );
}
