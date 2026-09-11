import { usePage } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading, StepNumberList, Pill, CtaBanner } from '../components/ui/Bits';

export default function MarketAccess() {
  const page = usePage('marketAccess');

  return (
    <>
      <Seo title={page.seoTitle} description={page.seoDescription} path="/solutions/market-access" />
      <PageHero eyebrow={page.hero.eyebrow} heading={page.hero.heading} body={page.hero.body} />

      <section className="section-py">
        <div className="container-page">
          <SectionHeading eyebrow="Offtake Partners" heading="Who buys the produce" center />
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {page.buyers.map((b: string) => (
              <Pill key={b}>{b}</Pill>
            ))}
          </div>
        </div>
      </section>

      <section className="section-py bg-brand-50">
        <div className="container-page">
          <SectionHeading eyebrow="The Process" heading="From harvest to revenue" center />
          <div className="mt-10">
            <StepNumberList items={page.process.map((step: string) => ({ title: step, description: '' }))} />
          </div>
        </div>
      </section>

      <CtaBanner
        heading="See how financing and offtake connect"
        body="Our Pay-As-You-Grow model links your harvest sales directly to repayment."
        ctaLabel="Explore Financing"
        ctaPath="/financing"
      />
    </>
  );
}
