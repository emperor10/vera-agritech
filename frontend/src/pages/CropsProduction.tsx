import { useContent, usePage } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading, CtaBanner } from '../components/ui/Bits';
import { PlaceholderImage } from '../components/ui/PlaceholderImage';

export default function CropsProduction() {
  const page = usePage('cropsProduction');
  const { content } = useContent();

  return (
    <>
      <Seo title={page.seoTitle} description={page.seoDescription} path="/solutions/crops-and-production" />
      <PageHero eyebrow={page.hero.eyebrow} heading={page.hero.heading} body={page.hero.body} />

      <section className="section-py">
        <div className="container-page">
          <SectionHeading eyebrow="Crop Portfolio" heading="What you can grow with Vera AgriTech" center />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.crops.map((crop) => (
              <div key={crop.id} className="card">
                <PlaceholderImage imageKey={crop.imageKey} alt={crop.name} ratio="aspect-square" className="mb-4" />
                <h3 className="text-base">{crop.name}</h3>
                <p className="mt-1 text-sm text-ink-500">{crop.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-py bg-brand-50">
        <div className="container-page">
          <SectionHeading eyebrow="Crop Cycle Record" heading="What we track for every crop cycle" center />
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-ink-500">{page.note}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {page.cropCycleFields.map((field: string) => (
              <span key={field} className="badge">
                {field}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        heading="See how your harvest reaches the market"
        body="Learn how Vera AgriTech aggregates and sells produce to trusted buyers."
        ctaLabel="Market Access & Offtake"
        ctaPath="/solutions/market-access"
      />
    </>
  );
}
