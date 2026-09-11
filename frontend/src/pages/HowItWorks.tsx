import { usePage } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { StepNumberList, CtaBanner } from '../components/ui/Bits';

export default function HowItWorks() {
  const page = usePage('howItWorks');

  return (
    <>
      <Seo title={page.seoTitle} description={page.seoDescription} path="/solutions/how-it-works" />
      <PageHero eyebrow={page.hero.eyebrow} heading={page.hero.heading} body={page.hero.body} />

      <section className="section-py">
        <div className="container-page">
          <StepNumberList items={page.steps} />
        </div>
      </section>

      <CtaBanner
        heading="Start your journey today"
        body="Tell us about your goals and location, and the Vera AgriTech team will help you choose the right first step."
        ctaLabel="Get Started"
        ctaPath="/get-started"
      />
    </>
  );
}
