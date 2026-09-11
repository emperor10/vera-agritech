import { useContent, usePage } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';

export default function Privacy() {
  const page = usePage('privacy');
  const { content } = useContent();
  const s = content.settings;

  return (
    <>
      <Seo title="Privacy Policy" description="Vera AgriTech Ltd's privacy policy." path="/privacy" />
      <PageHero
        eyebrow="Legal"
        heading="Privacy Policy"
        body={`Effective Date: ${page.effectiveDate} · Last Updated: ${page.lastUpdated}`}
      />

      <section className="section-py">
        <div className="container-page max-w-3xl space-y-8 text-ink-700">
          <section>
            <h2 className="text-xl text-brand-950">1. Introduction</h2>
            <p className="mt-2">
              {s.companyName} is a Nigerian agricultural technology company located in Ibadan, Oyo State. The
              organisation develops climate-smart food production systems — including screen houses, hydroponic
              equipment, soilless farming kits, drip irrigation and farm machinery — alongside training and
              consulting services. This policy explains how we handle personal data when you access our website,
              submit enquiries, register for training, communicate with us, or engage in a business relationship
              with us. We comply with the Nigeria Data Protection Act 2023, and apply GDPR protections for EEA
              visitors and UK GDPR for UK visitors.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-brand-950">2. Data Controller</h2>
            <p className="mt-2">
              {s.companyName}
              <br />
              {s.address}
              <br />
              Email: {s.email}
              <br />
              Phone / WhatsApp: {s.phone}
            </p>
            <p className="mt-2 text-sm text-ink-500">
              Until a Data Protection Officer is appointed, please reference "Privacy Enquiry" in the subject line of
              any privacy-related correspondence.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-brand-950">3. What We Collect</h2>
            <p className="mt-2">We collect information you provide directly (contact forms, training or advisory registrations, commercial transactions, and direct communications via email, phone, WhatsApp or social media), information collected automatically (IP address, approximate location, browser/device details, pages visited and cookies), and, occasionally, information from trusted third parties such as financial or development partners. We do not intentionally collect sensitive personal data, and we do not knowingly collect data from children under 18 without verifiable parental or guardian consent.</p>
          </section>

          <section>
            <h2 className="text-xl text-brand-950">4. How We Use Your Data</h2>
            <p className="mt-2">We process personal data to respond to enquiries, deliver our screen house, hydroponic and produce-offtake services, run training and advisory programmes, provide customer support, and — only with your consent — send marketing communications. We also use data for website analytics, fraud prevention, and to meet our legal and regulatory obligations.</p>
          </section>

          <section>
            <h2 className="text-xl text-brand-950">5. Data Sharing</h2>
            <p className="mt-2">We do not sell, rent or trade personal data. We share data only where necessary — with service providers (hosting, email, analytics), communication platforms (WhatsApp/Meta, Facebook, Instagram, X), financial institutions processing payments, strategic partners in joint programmes, professional advisers, and regulators or law enforcement where legally required.</p>
          </section>

          <section>
            <h2 className="text-xl text-brand-950">6. Cookies</h2>
            <p className="mt-2">We use strictly necessary, functional, and analytics/performance cookies. Marketing cookies may be used if deployed. You can control cookies through your browser settings; disabling some cookies may affect site functionality.</p>
          </section>

          <section>
            <h2 className="text-xl text-brand-950">7. Data Security & Retention</h2>
            <p className="mt-2">We use HTTPS/TLS, access controls, reputable hosting providers, and staff confidentiality practices to protect your data. Inactive enquiries are deleted or anonymised within 24 months; customer and contract records are retained for the relationship duration plus any period required by Nigerian tax and corporate law (typically 6 years).</p>
          </section>

          <section>
            <h2 className="text-xl text-brand-950">8. Your Rights</h2>
            <p className="mt-2">Subject to applicable law, you have the right to access, correct, or request erasure of your data; restrict or object to processing; receive your data in a portable format; withdraw consent at any time; and lodge a complaint with the Nigeria Data Protection Commission or your local supervisory authority. To exercise these rights, contact us at {s.email} with "Data Subject Request" in the subject line.</p>
          </section>

          <section>
            <h2 className="text-xl text-brand-950">9. Changes to This Policy</h2>
            <p className="mt-2">We may update this policy to reflect changes in our practices, technology, legal requirements, or services. The "Last Updated" date above will change accordingly, and significant updates will be given prominent notice on this website.</p>
          </section>

          <section>
            <h2 className="text-xl text-brand-950">10. Governing Law</h2>
            <p className="mt-2">This policy is governed by the laws of the Federal Republic of Nigeria, including the Nigeria Data Protection Act 2023, without prejudice to mandatory data protection rights in your country of residence.</p>
          </section>
        </div>
      </section>
    </>
  );
}
