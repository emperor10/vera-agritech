import { usePage } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading, CtaBanner } from '../components/ui/Bits';

export default function Financing() {
  const page = usePage('financing');

  return (
    <>
      <Seo title={page.seoTitle} description={page.seoDescription} path="/financing" />
      <PageHero eyebrow={page.hero.eyebrow} heading={page.hero.heading} body={page.hero.body} />

      <section className="section-py">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          <div className="card">
            <h3 className="text-lg">{page.affordableEntry.title}</h3>
            <p className="mt-2 text-sm text-ink-500">{page.affordableEntry.description}</p>
            <p className="mt-3 rounded-xl bg-brand-50 p-3 text-xs font-medium text-brand-800">
              {page.affordableEntry.example}
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg">{page.productionLinkedRepayment.title}</h3>
            <p className="mt-2 text-sm text-ink-500">{page.productionLinkedRepayment.description}</p>
            <p className="mt-3 rounded-xl bg-brand-50 p-3 text-xs font-medium text-brand-800">
              {page.productionLinkedRepayment.example}
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg">{page.cropHedgedRepayment.title}</h3>
            <p className="mt-2 text-sm text-ink-500">{page.cropHedgedRepayment.description}</p>
            <ul className="mt-3 space-y-1 text-xs text-ink-700">
              {page.cropHedgedRepayment.agreements.map((a: string) => (
                <li key={a}>• {a}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-py bg-brand-950 text-white">
        <div className="container-page">
          <SectionHeading eyebrow="Protecting Everyone" heading="Triple Security Model" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {page.tripleSecurity.map((layer: any, i: number) => (
              <div key={layer.title} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-brand-950">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base text-white">{layer.title}</h3>
                <p className="mt-2 text-sm text-brand-200">{layer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-py">
        <div className="container-page">
          <div className="card mx-auto max-w-2xl text-center">
            <h3 className="text-lg">{page.additionalProtection.title}</h3>
            <p className="mt-2 text-sm text-ink-500">{page.additionalProtection.description}</p>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-ink-400">{page.disclaimer}</p>
        </div>
      </section>

      <CtaBanner
        heading="Explore the numbers for your farm"
        body="Once Vera-approved assumptions are finalised, our calculator will let you explore indicative production and repayment outcomes."
        ctaLabel="Visit the Calculator"
        ctaPath="/calculator"
      />
    </>
  );
}
