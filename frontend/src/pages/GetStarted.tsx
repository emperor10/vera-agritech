import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { ApplyForm } from '../components/forms/ApplyForm';

export default function GetStarted() {
  return (
    <>
      <Seo
        title="Get Started"
        description="Apply to start your Vera AgriTech greenhouse journey — choose a package and begin onboarding."
        path="/get-started"
      />
      <PageHero
        eyebrow="Get Started"
        heading="Start your Vera AgriTech journey"
        body="Tell us a little about yourself and what you're looking for, and our team will guide you through the next steps."
      />

      <section className="section-py">
        <div className="container-page max-w-2xl">
          <div className="card">
            <ApplyForm />
          </div>
        </div>
      </section>
    </>
  );
}
