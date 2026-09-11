import { useContent, usePage } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading, Pill, CtaBanner } from '../components/ui/Bits';
import { PackageCard } from '../components/ui/PackageCard';
import { PlaceholderImage } from '../components/ui/PlaceholderImage';

export default function Greenhouses() {
  const page = usePage('greenhouses');
  const { content } = useContent();

  return (
    <>
      <Seo title={page.seoTitle} description={page.seoDescription} path="/solutions/greenhouses" />
      <PageHero eyebrow={page.hero.eyebrow} heading={page.hero.heading} body={page.hero.body} />

      <section className="section-py">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl">What's included</h2>
            <ul className="mt-5 space-y-3">
              {page.included.map((item: string) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-700">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4L8.3 11.6l6.3-6.3a1 1 0 0 1 1.4 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Target Locations</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {page.targetLocations.map((loc: string) => (
                  <Pill key={loc}>{loc}</Pill>
                ))}
              </div>
            </div>
          </div>
          <PlaceholderImage imageKey="greenhouse-structure" alt="Screen house structure" />
        </div>
      </section>

      <section className="section-py bg-brand-50">
        <div className="container-page">
          <SectionHeading eyebrow="Hydroponic Advantage" heading="Why controlled-environment growing wins" center />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {page.hydroponicAdvantage.map((a: any) => (
              <div key={a.title} className="card">
                <h3 className="text-base">{a.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-py">
        <div className="container-page">
          <SectionHeading eyebrow="Packages" heading="Screen House Packages" body={page.packagesIntro} center />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {content.packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-py bg-brand-950 text-white">
        <div className="container-page">
          <SectionHeading eyebrow="Suitable Crops" heading="What grows well in a Vera screen house" />
          <div className="mt-8 flex flex-wrap gap-2">
            {page.suitableCrops.map((crop: string) => (
              <span key={crop} className="rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15">
                {crop}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        heading="Ready to see the full production journey?"
        body="From choosing a package to your first harvest — see exactly how it works."
        ctaLabel="How It Works"
        ctaPath="/solutions/how-it-works"
      />
    </>
  );
}
