import { usePage } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading, StatCard, CtaBanner } from '../components/ui/Bits';

export default function TrainingSupport() {
  const page = usePage('trainingSupport');

  return (
    <>
      <Seo title={page.seoTitle} description={page.seoDescription} path="/training-support" />
      <PageHero eyebrow={page.hero.eyebrow} heading={page.hero.heading} body={page.hero.body} />

      <section className="section-py">
        <div className="container-page">
          <SectionHeading eyebrow="Curriculum" heading="Training Levels" center />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {page.levels.map((level: any) => (
              <div key={level.level} className="card">
                <h3 className="text-base">{level.level}</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-ink-500">
                  {level.items.map((item: string) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-py bg-brand-50">
        <div className="container-page">
          <SectionHeading eyebrow="Academy Courses" heading="What you'll learn" center />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {page.courses.map((course: any) => (
              <div key={course.title} className="card">
                <h3 className="text-lg">{course.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-py bg-brand-950 text-white">
        <div className="container-page grid gap-8 sm:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            {page.metrics.map((m: any) => (
              <StatCard key={m.label} value={m.value} label={m.label} />
            ))}
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-200">Delivery Methods</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {page.deliveryMethods.map((method: string) => (
                <span key={method} className="rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        heading="Join the Vera Agribusiness Academy"
        body="Register your interest and our team will contact you with the next available cohort."
        ctaLabel="Get Started"
        ctaPath="/get-started"
      />
    </>
  );
}
