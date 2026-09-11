import { useContent, usePage } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { CtaBanner } from '../components/ui/Bits';
import { PlaceholderImage } from '../components/ui/PlaceholderImage';

export default function Projects() {
  const page = usePage('projects');
  const { content } = useContent();

  return (
    <>
      <Seo title={page.seoTitle} description={page.seoDescription} path="/projects" />
      <PageHero eyebrow={page.hero.eyebrow} heading={page.hero.heading} body={page.hero.body} />

      <section className="section-py">
        <div className="container-page space-y-10">
          {content.caseStudies.map((cs) => (
            <div key={cs.id} className="grid gap-8 rounded-3xl border border-ink-100 p-6 lg:grid-cols-2 lg:p-8">
              <PlaceholderImage imageKey={cs.imageKey} alt={cs.title} />
              <div>
                <h2 className="text-2xl">{cs.title}</h2>
                <p className="mt-2 text-ink-500">{cs.summary}</p>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  {cs.stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-brand-50 p-3">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-brand-700">{stat.label}</dt>
                      <dd className="stat-figure mt-1 text-sm">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ))}
          <p className="text-center text-sm text-ink-400">{page.note}</p>
        </div>
      </section>

      <CtaBanner
        heading="Want results like these on your own site?"
        body="Schedule a site visit or request a case study PDF to see the full details."
        ctaLabel="Contact Us"
        ctaPath="/contact"
      />
    </>
  );
}
