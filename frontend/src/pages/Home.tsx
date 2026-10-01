import { Link } from 'react-router-dom';
import { useContent, usePage } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PlaceholderImage } from '../components/ui/PlaceholderImage';
import { SectionHeading, StatCard, CtaBanner } from '../components/ui/Bits';
import { TestimonialCard } from '../components/ui/TestimonialCard';
import { HeroCarousel } from '../components/ui/HeroCarousel';
import { Reveal } from '../components/ui/Reveal';

const STAT_ICONS = [
  // leaf — screen houses installed
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21c6-1.5 9-6 9-12 0-1.8-.3-3.2-.7-4.3-2.4 3.6-5.4 5.4-9 6-3.6-.6-6.6-2.4-9-6C1.9 5.8 1.6 7.2 1.6 9c0 6 3 10.5 9 12z" fill="currentColor" />
  </svg>,
  // people — farmers trained
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="9" cy="8" r="3" fill="currentColor" />
    <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="17" cy="9" r="2.4" fill="currentColor" opacity="0.6" />
    <path d="M16 14.3c2.9.4 5 2.5 5 5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
  </svg>,
  // gear — equipment installations
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <path
      d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4M17.7 17.7l-1.4-1.4M7.7 7.7 6.3 6.3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>,
  // heart — client satisfaction
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 20.5s-7.5-4.6-9.5-9C1.2 8.4 2.6 5 6 5c2 0 3.3 1.1 4 2.2C10.7 6.1 12 5 14 5c3.4 0 4.8 3.4 3.5 6.5-2 4.4-9.5 9-9.5 9Z"
      fill="currentColor"
    />
  </svg>,
];

export default function Home() {
  const home = usePage('home');
  const { content } = useContent();

  return (
    <>
      <Seo title={home.seoTitle} description={home.seoDescription} path="/" />

      <HeroCarousel
        slides={home.hero.slides}
        heading={home.hero.heading}
        subheading={home.hero.subheading}
        body={home.hero.body}
        ctaPrimary={home.hero.ctaPrimary}
        ctaSecondary={home.hero.ctaSecondary}
      />

      {/* Floating impact stats bar — overlaps the bottom edge of the hero. */}
      <div className="container-page relative z-10 -mt-10 sm:-mt-12">
        <Reveal>
          <div className="rounded-3xl border border-brand-100 bg-brand-50/90 p-5 shadow-soft backdrop-blur sm:p-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
              {home.stats.slice(0, 4).map((stat: any, i: number) => (
                <StatCard key={stat.label} value={stat.value} label={stat.label} icon={STAT_ICONS[i]} variant="light" />
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Our Partners — admin-managed brand logos (Admin → Partners). Hidden
          entirely until at least one partner is published, so the homepage
          never shows an empty row of placeholder boxes. */}
      {content.partners.length > 0 && (
        <section className="section-py">
          <div className="container-page">
            <Reveal>
              <SectionHeading eyebrow="Trusted By" heading="Our Partners" center />
            </Reveal>
            <div className="mt-10 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-5">
              {content.partners.map((partner, i) => {
                const logo = (
                  <PlaceholderImage
                    imageKey={partner.imageKey}
                    alt={partner.name}
                    ratio="aspect-[3/2]"
                    className="grayscale transition-all duration-300 hover:grayscale-0"
                  />
                );
                return (
                  <Reveal key={partner.id} delay={i * 60}>
                    {partner.websiteUrl ? (
                      <a href={partner.websiteUrl} target="_blank" rel="noreferrer" aria-label={partner.name}>
                        {logo}
                      </a>
                    ) : (
                      logo
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      <section className="section-py">
        <div className="container-page">
          <Reveal>
            <SectionHeading eyebrow={home.about.eyebrow} heading={home.about.heading} center />
            <p className="mx-auto mt-2 max-w-2xl text-center text-lg font-semibold text-gold-600">{home.about.mission}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {home.about.pillars.map((p: any, i: number) => (
              <Reveal key={p.title} delay={i * 100}>
                <div className="card h-full">
                  <h3 className="text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm text-ink-500">{p.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge / Innovation */}
      <section className="section-py bg-brand-50">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="card">
            <p className="eyebrow">{home.challenge.eyebrow}</p>
            <h2 className="mt-2 text-2xl">{home.challenge.heading}</h2>
            <p className="mt-3 text-ink-500">{home.challenge.body}</p>
          </div>
          <div className="card border-brand-200 bg-white">
            <p className="eyebrow">{home.innovation.eyebrow}</p>
            <h2 className="mt-2 text-2xl">{home.innovation.heading}</h2>
            <p className="mt-3 text-ink-500">{home.innovation.body}</p>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="section-py">
        <div className="container-page">
          <SectionHeading eyebrow={home.comparison.eyebrow} heading={home.comparison.heading} center />
          <div className="mt-10 overflow-x-auto rounded-2xl border border-ink-100">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-brand-950 text-left text-white">
                  <th className="px-5 py-3 font-semibold">Metric</th>
                  <th className="px-5 py-3 font-semibold">Traditional Farming</th>
                  <th className="px-5 py-3 font-semibold">Vera AgriTech</th>
                </tr>
              </thead>
              <tbody>
                {home.comparison.rows.map((row: any, i: number) => (
                  <tr key={row.metric} className={i % 2 ? 'bg-brand-50/60' : 'bg-white'}>
                    <td className="px-5 py-3 font-semibold text-brand-950">{row.metric}</td>
                    <td className="px-5 py-3 text-ink-500">{row.traditional}</td>
                    <td className="px-5 py-3 font-medium text-brand-700">{row.vera}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Solutions preview */}
      <section className="section-py bg-brand-950 text-white">
        <div className="container-page">
          <SectionHeading eyebrow={home.solutionsPreview.eyebrow} heading={home.solutionsPreview.heading} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {home.solutionsPreview.items.map((item: any, i: number) => (
              <Reveal key={item.title} delay={i * 100} className="h-full">
                <Link
                  to={item.path}
                  className="card-arrow-parent block h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 ease-out hover:-translate-y-[5px] hover:border-white/20 hover:bg-white/10"
                >
                  <h3 className="text-lg text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-brand-200">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-300">
                    Learn more
                    <svg className="card-arrow h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h9M8 3.5 12.5 8 8 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-py bg-brand-50">
        <div className="container-page">
          <Reveal>
            <SectionHeading eyebrow="Testimonials" heading="What our farmers say" center />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 100} className="h-full">
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        heading={home.ctaBanner.heading}
        body={home.ctaBanner.body}
        ctaLabel={home.ctaBanner.cta.label}
        ctaPath={home.ctaBanner.cta.path}
      />
    </>
  );
}
