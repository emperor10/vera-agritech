import { usePage } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading, Pill, CtaBanner } from '../components/ui/Bits';

export default function Investors() {
  const page = usePage('investors');

  return (
    <>
      <Seo title={page.seoTitle} description={page.seoDescription} path="/investors" />
      <PageHero eyebrow={page.hero.eyebrow} heading={page.hero.heading} body={page.hero.body} />

      <section className="section-py">
        <div className="container-page">
          <SectionHeading eyebrow="Scalability Blueprint" heading="Our Scalability Blueprint" center />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {page.blueprint.map((item: any) => (
              <div key={item.title} className="card">
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-py bg-brand-50">
        <div className="container-page grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Target Stakeholder Ecosystem</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-700">
              {page.stakeholders.map((s: string) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-500">SDG Alignment</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {page.sdgAlignment.map((s: string) => (
                <Pill key={s}>{s}</Pill>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner heading="Partner with Vera AgriTech" body={page.cta} ctaLabel="Contact Us" ctaPath="/contact" />
    </>
  );
}
