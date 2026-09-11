import { usePage } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading, CtaBanner } from '../components/ui/Bits';

export default function Consulting() {
  const page = usePage('consulting');

  return (
    <>
      <Seo title={page.seoTitle} description={page.seoDescription} path="/consulting" />
      <PageHero eyebrow={page.hero.eyebrow} heading={page.hero.heading} body={page.hero.body} />

      <section className="section-py">
        <div className="container-page">
          <SectionHeading eyebrow="Advisory Services" heading="Our Agribusiness Consultation Services" center />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {page.services.map((service: any) => (
              <div key={service.title} className="card">
                <h3 className="text-lg">{service.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner heading="Schedule a Consultation Call" body={page.cta} ctaLabel="Contact Us" ctaPath="/contact" />
    </>
  );
}
