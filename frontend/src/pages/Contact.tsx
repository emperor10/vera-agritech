import { useContent } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { ContactForm } from '../components/forms/ContactForm';

export default function Contact() {
  const { content } = useContent();
  const s = content.settings;

  return (
    <>
      <Seo
        title="Contact Us"
        description="Get in touch with the Vera AgriTech team in Ibadan, Oyo State, Nigeria."
        path="/contact"
      />
      <PageHero eyebrow="Contact" heading="Talk to Vera AgriTech" body="We'd love to hear about your goals and answer any questions." />

      <section className="section-py">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl">Send us a message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div>
            <h2 className="text-2xl">Our details</h2>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-ink-400">Address</dt>
                <dd className="mt-1 text-ink-700">{s.address}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-ink-400">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${s.email}`} className="text-brand-700 hover:underline">
                    {s.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-ink-400">Phone / WhatsApp</dt>
                <dd className="mt-1">
                  <a href={`tel:${s.phone?.replace(/\s/g, '')}`} className="text-brand-700 hover:underline">
                    {s.phone}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-8 overflow-hidden rounded-2xl border border-ink-100">
              <div className="placeholder-box aspect-[16/9] w-full flex-col rounded-none">
                <p className="text-sm font-semibold">Map placeholder</p>
                <p className="text-xs">Google Maps embed for the Ibadan office to be added via Admin → Settings</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
