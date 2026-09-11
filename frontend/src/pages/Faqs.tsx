import { useContent } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { FaqAccordion } from '../components/ui/FaqAccordion';
import { CtaBanner } from '../components/ui/Bits';

export default function Faqs() {
  const { content } = useContent();

  return (
    <>
      <Seo
        title="Frequently Asked Questions"
        description="Answers to common questions about Vera AgriTech's greenhouses, financing, crops and training."
        path="/faqs"
      />
      <PageHero
        eyebrow="FAQs"
        heading="Frequently Asked Questions"
        body="Answers to common questions about participation, financing, crops, production, market access and support."
      />

      <section className="section-py">
        <div className="container-page max-w-3xl">
          <FaqAccordion faqs={content.faqs} />
        </div>
      </section>

      <CtaBanner
        heading="Still have questions?"
        body="Our team is happy to talk through your specific situation."
        ctaLabel="Contact Us"
        ctaPath="/contact"
      />
    </>
  );
}
