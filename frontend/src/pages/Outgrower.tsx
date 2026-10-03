import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading, StepNumberList } from '../components/ui/Bits';
import { Reveal } from '../components/ui/Reveal';
import { OutgrowerApplyForm } from '../components/forms/OutgrowerApplyForm';

const PROGRAMME_STEPS = [
  { title: '01. You provide land', description: 'You bring suitable agricultural land and are ready to participate in production.' },
  { title: '02. Vera assesses the farm', description: 'Our technical team evaluates water, site conditions and commercial fit.' },
  { title: '03. Production system is deployed', description: 'Approved infrastructure and inputs are deployed to qualifying farms.' },
  { title: '04. Farming & technical support', description: 'Agronomic guidance, production planning and farm monitoring throughout the cycle.' },
  { title: '05. Harvest & quality control', description: 'Produce is harvested under agreed quality-control procedures.' },
  { title: '06. Offtake purchases produce', description: 'Qualifying produce is purchased through the agreed offtake structure.' },
  { title: '07. Proceeds are settled', description: 'Commercial proceeds are settled according to the partnership agreement.' },
  { title: '08. Shared returns', description: 'Farmer and Vera share agreed returns under that same agreement.' },
];

const FARMER_PROVIDES = [
  'Suitable agricultural land',
  'Evidence of legitimate land access / tenure',
  'Commitment to the agreed production cycle',
  "Access to the farm for Vera's technical team",
  'Compliance with agreed production standards',
  'Participation in farm management and monitoring',
  'Delivery of qualifying produce according to the partnership agreement',
];

const VERA_PROVIDES = [
  'Screenhouse / production infrastructure',
  'Production inputs',
  'Irrigation and related farming systems, where applicable',
  'Agronomic and technical support',
  'Production planning and farm monitoring',
  'Quality-control procedures',
  'Market / offtake coordination',
  'Post-harvest and aggregation support, where applicable',
];

const QUALIFY = [
  { title: 'Land', body: 'You must have access to suitable agricultural land available for the proposed production programme.' },
  { title: 'Land documentation', body: 'Applicants should be able to demonstrate legitimate ownership, leasehold or other recognized rights to use the land.' },
  { title: 'Location', body: 'Your farm must be within an area that can be practically supported and commercially serviced by Vera AgriTech.' },
  { title: 'Water & site conditions', body: 'The farm will be assessed for water availability, accessibility, soil and site conditions, and suitability for the proposed production system.' },
  { title: 'Commitment', body: 'Outgrowers must be willing to follow agreed production standards and participate throughout the production cycle.' },
  { title: 'Assessment', body: 'Every application is subject to technical, commercial and operational assessment before acceptance.' },
];

const FAQS = [
  {
    q: 'Do I need to already be farming to apply?',
    a: 'No. We assess every application on its own merits, including your land and your willingness to participate in the production cycle. Prior farming experience is helpful but not a strict requirement.',
  },
  {
    q: 'What exactly does Vera provide, and what do I provide?',
    a: 'In outline: you provide suitable land, legitimate access to it, and participation in production; Vera provides, subject to assessment, production infrastructure, inputs, technical support, production planning and market/offtake coordination. The exact scope for your farm is set out in the partnership agreement.',
  },
  {
    q: 'Is there a guaranteed financial return?',
    a: 'No. Vera AgriTech and participating outgrowers operate under a defined commercial agreement covering costs, offtake and the distribution of proceeds. The objective is a sustainable commercial return for both parties, not a fixed or guaranteed figure.',
  },
  {
    q: 'How long does assessment take?',
    a: 'It depends on your location and farm. After you apply, our team reviews your application, schedules a farm and land assessment, and carries out a technical and commercial evaluation before any partnership discussion begins.',
  },
  {
    q: 'Do I need to upload land documents or photos right away?',
    a: "Not at this stage. Submit your application with the information you have now — our team will request supporting documents and farm photos during the assessment stage.",
  },
];

export default function Outgrower() {
  return (
    <>
      <Seo
        title="Become a Vera Outgrower"
        description="Partner with Vera AgriTech's Outgrower Partnership Programme — your land, our technology, shared growth."
        path="/outgrower"
      />

      <PageHero
        eyebrow="Vera Outgrower Partnership Programme"
        heading="Grow With Vera. Farm With Purpose."
        body="Vera AgriTech partners with independent farmers who have suitable agricultural land and are ready to participate in structured commercial production. Through our Outgrower Partnership Programme, Vera can deploy approved production infrastructure, inputs, technical expertise and market access to qualifying farms — while farmers contribute their land and participate in production."
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a href="#apply" className="btn-primary">
            Apply as an Outgrower
          </a>
          <a href="#how-it-works" className="btn-outline-light">
            How the Programme Works ↓
          </a>
        </div>
        <p className="mt-6 max-w-2xl text-sm text-brand-200">
          Participation is subject to land assessment, technical evaluation and execution of a mutually agreed
          partnership arrangement.
        </p>
      </PageHero>

      {/* How the programme works */}
      <section id="how-it-works" className="section-py scroll-mt-20">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              heading="How the Vera Outgrower Model Works"
              body="Your Land. Our Technology. Shared Growth."
              center
            />
          </Reveal>
          <div className="mt-10">
            <StepNumberList items={PROGRAMME_STEPS} />
          </div>
        </div>
      </section>

      {/* What each side brings */}
      <section className="section-py bg-brand-50">
        <div className="container-page">
          <Reveal>
            <SectionHeading eyebrow="The partnership" heading="You Bring the Land. We Build the Opportunity." center />
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal className="h-full">
              <div className="card h-full">
                <h3 className="text-lg">What the farmer provides</h3>
                <ul className="mt-4 space-y-3">
                  {FARMER_PROVIDES.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-ink-700">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={100} className="h-full">
              <div className="card h-full border-brand-200 bg-white">
                <h3 className="text-lg">What Vera provides</h3>
                <p className="mt-1 text-xs text-ink-400">Subject to assessment and the agreed programme structure.</p>
                <ul className="mt-4 space-y-3">
                  {VERA_PROVIDES.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-ink-700">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Shared value */}
      <section className="section-py">
        <div className="container-page">
          <Reveal>
            <SectionHeading eyebrow="Shared value" heading="A Partnership Built Around Shared Value" center />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Reveal className="h-full">
              <div className="card h-full text-center">
                <h3 className="text-base">Your land + participation</h3>
                <p className="mt-2 text-sm text-ink-500">
                  You contribute suitable land and participate in production throughout the cycle.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100} className="h-full">
              <div className="card h-full text-center border-brand-200">
                <h3 className="text-base">Vera's support</h3>
                <p className="mt-2 text-sm text-ink-500">
                  Infrastructure, inputs, technical support and market access, subject to programme assessment.
                </p>
              </div>
            </Reveal>
            <Reveal delay={200} className="h-full">
              <div className="card h-full text-center">
                <h3 className="text-base">Commercial return</h3>
                <p className="mt-2 text-sm text-ink-500">
                  Produce is marketed through the agreed offtake structure, with proceeds settled according to the
                  partnership agreement.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={300}>
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-ink-100 bg-ink-100/20 p-6 text-center">
              <p className="font-semibold text-brand-950">Shared success, clearly structured.</p>
              <p className="mt-2 text-sm text-ink-600">
                Vera AgriTech and participating outgrowers operate under a defined commercial agreement covering
                production responsibilities, infrastructure, input deployment, offtake, pricing/valuation, costs and
                the distribution of proceeds. The objective is to align both parties around productive farming,
                quality output and sustainable commercial returns.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Qualification requirements */}
      <section className="section-py bg-brand-950 text-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Eligibility"
            heading="Do You Have What It Takes to Become a Vera Outgrower?"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {QUALIFY.map((q, i) => (
              <Reveal key={q.title} delay={i * 80} className="h-full">
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-base text-white">{q.title}</h3>
                  <p className="mt-2 text-sm text-brand-200">{q.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-py">
        <div className="container-page max-w-3xl">
          <Reveal>
            <SectionHeading eyebrow="Questions" heading="Frequently asked questions" center />
          </Reveal>
          <div className="mt-10 space-y-3">
            {FAQS.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-ink-100 bg-white p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-brand-950">
                  {item.q}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-ink-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="section-py scroll-mt-20 bg-brand-50">
        <div className="container-page max-w-3xl">
          <Reveal>
            <SectionHeading
              eyebrow="Apply"
              heading="Apply as an Outgrower"
              body="Tell us about yourself and your land. It takes about five minutes — our team will follow up to continue your onboarding."
              center
            />
          </Reveal>
          <div className="card mt-10">
            <OutgrowerApplyForm />
          </div>
        </div>
      </section>
    </>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.12" />
      <path d="M6 10.5l2.5 2.5 5.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
