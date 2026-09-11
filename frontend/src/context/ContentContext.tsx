import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../lib/api';
import type { ContentBundle, ImageAsset } from '../types/content';
import fallbackRaw from '../data/content.json';

// Build a ContentBundle-shaped fallback from the static seed JSON so the
// site always renders fully — with the exact cloned copy — even before the
// backend has been deployed or reached for the first time.
function buildFallback(): ContentBundle {
  const raw: any = fallbackRaw;
  const pages: Record<string, any> = {};
  [
    'navigation',
    'home',
    'theVeraModel',
    'greenhouses',
    'howItWorks',
    'cropsProduction',
    'financing',
    'marketAccess',
    'trainingSupport',
    'consulting',
    'aboutVera',
    'projects',
    'investors',
    'privacy',
    'scaleUp',
  ].forEach((key) => {
    if (raw[key]) pages[key] = raw[key];
  });

  return {
    pages,
    settings: raw.settings,
    faqs: (raw.faqs || []).map((f: any, i: number) => ({ id: i + 1, ...f })),
    packages: (raw.packages || []).map((p: any, i: number) => ({ id: i + 1, sortOrder: p.order ?? i, ...p })),
    crops: (raw.cropsProduction?.crops || []).map((c: any, i: number) => ({ id: i + 1, ...c })),
    testimonials: (raw.home?.testimonials || []).map((t: any, i: number) => ({ id: i + 1, ...t })),
    caseStudies: (raw.projects?.caseStudies || []).map((c: any, i: number) => ({ id: i + 1, ...c })),
    blogPosts: [],
    images: {},
  };
}

const FALLBACK_CONTENT = buildFallback();

interface ContentContextValue {
  content: ContentBundle;
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
  refresh: () => Promise<void>;
  getImage: (key: string, altFallback?: string) => ImageAsset;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentBundle>(FALLBACK_CONTENT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ContentBundle>('/content');
      setContent({
        ...FALLBACK_CONTENT,
        ...data,
        pages: { ...FALLBACK_CONTENT.pages, ...data.pages },
        settings: { ...FALLBACK_CONTENT.settings, ...data.settings },
      });
      setUsingFallback(false);
    } catch (err) {
      // Backend not reachable yet — keep showing the cloned static content
      // so the site is never blank for a visitor.
      setContent(FALLBACK_CONTENT);
      setUsingFallback(true);
      setError('Could not reach the content service — showing default site content.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getImage = useCallback(
    (key: string, altFallback = ''): ImageAsset => {
      return content.images[key] ?? { url: null, altText: altFallback };
    },
    [content.images]
  );

  const value = useMemo(
    () => ({ content, loading, error, usingFallback, refresh: load, getImage }),
    [content, loading, error, usingFallback, load, getImage]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within a ContentProvider');
  return ctx;
}

export function usePage<T = any>(pageKey: string): T {
  const { content } = useContent();
  return content.pages[pageKey] as T;
}
