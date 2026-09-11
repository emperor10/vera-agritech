import { usePage } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading, CtaBanner } from '../components/ui/Bits';
import { PlaceholderImage } from '../components/ui/PlaceholderImage';

export default function AboutVera() {
  const page = usePage('aboutVera');

  return (
    <>
      <Seo title={page.seoTitle} description={page.seoDescription} path="/about" />
      <PageHero eyebrow={page.hero.eyebrow} heading={page.hero.heading} body={page.hero.body} />

      <section className="section-py">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <PlaceholderImage
            imageKey={page.founder.imageKey}
            alt={page.founder.imageAlt}
            ratio="aspect-[4/5]"
            objectPosition="object-top"
          />
          <div>
            <SectionHeading eyebrow="Founder" heading={page.founder.name} />
            <p className="mt-4 text-ink-500">{page.founder.bio}</p>
            <p className="mt-3 text-sm font-semibold text-brand-700">{page.founder.credentials}</p>
          </div>
        </div>
      </section>

      <section className="section-py bg-brand-50">
        <div className="container-page grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-500">SDG Alignment</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {page.sdgAlignment.map((sdg: any) => (
                <span key={sdg.code} className="badge">
                  {sdg.code} — {sdg.title}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Strategic Collaborators</h3>
            <p className="mt-4 text-ink-700">{page.collaborators.join(' · ')}</p>
          </div>
        </div>
      </section>

      <CtaBanner
        heading="Learn how our model works"
        body="Discover the four pillars that connect infrastructure, training, inputs and market access."
        ctaLabel="The Vera Model"
        ctaPath="/the-vera-model"
      />
    </>
  );
}
