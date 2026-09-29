import { useMemo, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading, CtaBanner } from '../components/ui/Bits';
import { PlaceholderImage } from '../components/ui/PlaceholderImage';
import type { Product } from '../types/content';

type Category = 'vegetable' | 'equipment';

const TABS: { key: Category; label: string; eyebrow: string; heading: string; body: string; emptyText: string }[] = [
  {
    key: 'vegetable',
    label: 'Fresh Vegetables',
    eyebrow: 'From Our Greenhouses',
    heading: 'Fresh vegetables, sold by the kilogram',
    body: 'Produce grown in Vera AgriTech screen houses, priced and sold by weight (kg) for consistent, transparent ordering.',
    emptyText: 'Vegetable listings are being added — check back soon, or contact us for current availability.',
  },
  {
    key: 'equipment',
    label: 'Screen House Equipment',
    eyebrow: 'Build Your Own Screen House',
    heading: 'Screen house equipment we supply',
    body: 'Structures, netting, irrigation, and the other equipment Vera AgriTech installs and sells for building or upgrading a screen house.',
    emptyText: 'Equipment listings are being added — check back soon, or contact us for current availability.',
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card flex flex-col">
      <PlaceholderImage imageKey={product.imageKey} alt={product.name} ratio="aspect-[4/3]" className="mb-4" />
      <h3 className="text-lg">{product.name}</h3>
      {product.description && <p className="mt-2 text-sm text-ink-500">{product.description}</p>}

      {product.specs?.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {product.specs.map((spec) => (
            <li key={spec} className="flex items-start gap-2 text-sm text-ink-700">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true">
                <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {spec}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <p className="stat-figure text-xl">
          {product.price || 'Contact for pricing'}
          {product.price && product.unit && <span className="ml-1 text-sm font-normal text-ink-500">/ {product.unit}</span>}
        </p>
      </div>
    </div>
  );
}

export default function Products() {
  const { content } = useContent();
  const [activeTab, setActiveTab] = useState<Category>('vegetable');

  const grouped = useMemo(() => {
    const groups: Record<Category, Product[]> = { vegetable: [], equipment: [] };
    for (const product of content.products || []) {
      if (product.category === 'vegetable' || product.category === 'equipment') {
        groups[product.category].push(product);
      }
    }
    return groups;
  }, [content.products]);

  const tab = TABS.find((t) => t.key === activeTab)!;
  const items = grouped[activeTab];

  return (
    <>
      <Seo
        title="Products — Vegetables & Screen House Equipment"
        description="Browse fresh vegetables sold by the kilogram and screen house equipment supplied by Vera AgriTech."
        path="/products"
      />
      <PageHero
        eyebrow="Our Products"
        heading="Vegetables & Screen House Equipment"
        body="Everything Vera AgriTech grows and supplies, in one place — fresh produce sold by the kilogram, and the equipment behind every screen house we build."
      />

      <section className="section-py">
        <div className="container-page">
          {/* Category switch */}
          <div className="mx-auto flex w-fit gap-1 rounded-full border border-ink-100 bg-white p-1 shadow-card" role="tablist" aria-label="Product category">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={activeTab === t.key}
                onClick={() => setActiveTab(t.key)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                  activeTab === t.key ? 'bg-brand-900 text-white' : 'text-ink-700 hover:bg-brand-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-12">
            <SectionHeading eyebrow={tab.eyebrow} heading={tab.heading} body={tab.body} center />
          </div>

          {items.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-10 max-w-lg rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50 p-8 text-center">
              <p className="text-sm text-brand-800">{tab.emptyText}</p>
            </div>
          )}
        </div>
      </section>

      <CtaBanner
        heading="Looking for a custom order or a screen house quote?"
        body="Tell us what you need and our team will get back to you with pricing and availability."
        ctaLabel="Get Started"
        ctaPath="/get-started"
      />
    </>
  );
}
