import { useCallback, useMemo, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading, CtaBanner } from '../components/ui/Bits';
import { PlaceholderImage } from '../components/ui/PlaceholderImage';
import { ProductOrderModal } from '../components/forms/ProductOrderModal';
import type { Product } from '../types/content';

type Category = 'vegetable' | 'equipment';

const TABS: { key: Category; label: string; eyebrow: string; heading: string; body: string; emptyText: string }[] = [
  {
    key: 'vegetable',
    label: 'Fresh Vegetables',
    eyebrow: 'From Our Greenhouses',
    heading: 'Fresh vegetables, sold in kilogram',
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

function ProductCard({ product, onOrder }: { product: Product; onOrder: (product: Product) => void }) {
  return (
    <article className="product-card">
      {/* rounded-none: the card itself clips the image to its 12px corners. */}
      <PlaceholderImage imageKey={product.imageKey} alt={product.name} ratio="aspect-[4/3]" rounded="rounded-none" />
      <div className="flex flex-1 flex-col p-4">
        {/* Name and description each reserve a fixed two-line slot (and clamp
            to it), so every card is exactly the same height regardless of
            how much text a product has. */}
        <h3 className="line-clamp-2 min-h-[2.75rem] text-base leading-snug">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm text-ink-500">{product.description}</p>

        <p className="stat-figure mt-auto pt-4 text-lg">
          {product.price || <span className="text-sm font-semibold text-ink-500">Contact for pricing</span>}
          {product.price && product.unit && <span className="ml-1 text-sm font-normal text-ink-500">/ {product.unit}</span>}
        </p>

        {/* Stretched button: its ::after covers the whole card, so clicking
            anywhere on the card opens the order panel. */}
        <button
          type="button"
          onClick={() => onOrder(product)}
          aria-label={`Order ${product.name}`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          Order now
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h9M8 3.5 12.5 8 8 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </article>
  );
}

export default function Products() {
  const { content } = useContent();
  const [activeTab, setActiveTab] = useState<Category>('vegetable');
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const closeOrder = useCallback(() => setOrderProduct(null), []);

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
        description="Browse fresh vegetables sold in kilogram and screen house equipment supplied by Vera AgriTech."
        path="/products"
      />
      <PageHero
        eyebrow="Our Products"
        heading="Vegetables & Screen House Equipment"
        body="Everything Vera AgriTech grows and supplies, in one place — fresh produce sold by kilogram, and the equipment behind every screen house we build."
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
            <div className="product-grid mt-10">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} onOrder={setOrderProduct} />
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-10 max-w-lg rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50 p-8 text-center">
              <p className="text-sm text-brand-800">{tab.emptyText}</p>
            </div>
          )}
        </div>
      </section>

      {orderProduct && <ProductOrderModal product={orderProduct} onClose={closeOrder} />}

      <CtaBanner
        heading="Looking for a custom order or a screen house quote?"
        body="Tell us what you need and our team will get back to you with pricing and availability."
        ctaLabel="Get Started"
        ctaPath="/get-started"
      />
    </>
  );
}
