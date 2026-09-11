import { usePage } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading, CtaBanner } from '../components/ui/Bits';

export default function TheVeraModel() {
  const page = usePage('theVeraModel');

  return (
    <>
      <Seo title={page.seoTitle} description={page.seoDescription} path="/the-vera-model" />
      <PageHero eyebrow={page.hero.eyebrow} heading={page.hero.heading} body={page.hero.body} />

      <section className="section-py">
        <div className="container-page">
          <SectionHeading eyebrow="Four Connected Pillars" heading="How everything fits together" center />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {page.pillars.map((p: any, i: number) => (
              <div key={p.title} className="card">
                <span className="badge">Pillar {i + 1}</span>
                <h3 className="mt-3 text-lg">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-py bg-brand-950 text-white">
        <div className="container-page">
          <SectionHeading eyebrow="The Value Chain" heading="From customer to next production cycle" />
          <div className="mt-10 flex flex-wrap items-center gap-3">
            {page.valueChain.map((step: string, i: number) => (
              <div key={step} className="flex items-center gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15">
                  {step}
                </span>
                {i < page.valueChain.length - 1 && (
                  <span className="text-gold-400" aria-hidden="true">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-py">
        <div className="container-page">
          <SectionHeading eyebrow="Where We're Headed" heading="Moving from today toward tomorrow" center />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink-100 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Today</h3>
              <ul className="mt-4 space-y-2 text-sm text-ink-700">
                {page.todayVsTowards.today.map((item: string) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-700">Towards</h3>
              <ul className="mt-4 space-y-2 text-sm text-brand-900">
                {page.todayVsTowards.towards.map((item: string) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        heading="See the model in action"
        body="Explore our greenhouse packages and calculate what a Vera AgriTech farm could look like for you."
        ctaLabel="View Greenhouse Packages"
        ctaPath="/solutions/greenhouses"
      />
    </>
  );
}
