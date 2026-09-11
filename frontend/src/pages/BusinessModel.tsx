import { useContent, usePage } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading, Pill, CtaBanner } from '../components/ui/Bits';
import { PackageCard } from '../components/ui/PackageCard';

export default function BusinessModel() {
  const veraModel = usePage('theVeraModel');
  const greenhouses = usePage('greenhouses');
  const scaleUp = usePage('scaleUp');
  const financing = usePage('financing');
  const { content } = useContent();

  return (
    <>
      <Seo
        title="CityHarvest Business Model"
        description="Vera AgriTech's Urban Screen House & Hydroponics Enterprise Model for Nigeria."
        path="/business-model"
      />
      <PageHero
        eyebrow="Enterprise Framework"
        heading="CityHarvest Business Model"
        body="Building a network of low-cost urban screen houses and hydroponic systems that empower individuals and communities to produce high-value vegetables, create jobs, and strengthen food security in our cities."
      />

      <section className="section-py">
        <div className="container-page">
          <SectionHeading eyebrow="The Four-Pillar System" heading="One integrated model" center />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {veraModel.pillars.map((p: any) => (
              <div key={p.title} className="card">
                <h3 className="text-lg">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{p.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {greenhouses.targetLocations.map((loc: string) => (
              <Pill key={loc}>{loc}</Pill>
            ))}
          </div>
        </div>
      </section>

      <section className="section-py bg-brand-50">
        <div className="container-page">
          <SectionHeading eyebrow="Investment" heading="Screen House Packages" center />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {content.packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-py">
        <div className="container-page">
          <SectionHeading eyebrow="Financing" heading="Pay-As-You-Grow Model" center />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="card">
              <h3 className="text-lg">{financing.affordableEntry.title}</h3>
              <p className="mt-2 text-sm text-ink-500">{financing.affordableEntry.description}</p>
            </div>
            <div className="card">
              <h3 className="text-lg">{financing.productionLinkedRepayment.title}</h3>
              <p className="mt-2 text-sm text-ink-500">{financing.productionLinkedRepayment.description}</p>
            </div>
            <div className="card">
              <h3 className="text-lg">{financing.cropHedgedRepayment.title}</h3>
              <p className="mt-2 text-sm text-ink-500">{financing.cropHedgedRepayment.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-py bg-brand-950 text-white">
        <div className="container-page">
          <SectionHeading eyebrow="Expansion Plan" heading={scaleUp.heading} />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {scaleUp.phases.map((phase: any) => (
              <div key={phase.phase} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <h3 className="text-base text-white">{phase.phase}</h3>
                <p className="mt-2 text-sm text-brand-200">{phase.description}</p>
                <p className="mt-3 text-lg font-bold text-gold-300">{phase.target}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        heading="Affordable. Profitable. Scalable."
        body="Together, we can build greener cities, generate stable urban jobs, and build a food-secure Nigeria."
        ctaLabel="Partner With Us"
        ctaPath="/contact"
      />
    </>
  );
}
