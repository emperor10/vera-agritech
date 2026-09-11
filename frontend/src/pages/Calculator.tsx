import { useContent } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';

/**
 * PHASE 1 — ON HOLD BY DESIGN.
 *
 * Per the product rule "No Invented Commercial Claims" (see the Vera
 * AgriTech Product Design & Technical Architecture document, section 23)
 * and explicit direction for this phase, the calculator must not publish
 * ROI, yield, revenue or payback figures until Vera AgriTech supplies and
 * validates the underlying assumptions.
 *
 * The full input shape below mirrors the approved architecture
 * ("Calculator Architecture", section 15 of the same document) so that
 * wiring up the real calculation engine later is a backend change only —
 * no frontend rework required.
 */
export default function Calculator() {
  const { content } = useContent();

  return (
    <>
      <Seo
        title="Greenhouse Calculator"
        description="Explore indicative production and revenue outcomes for a Vera AgriTech greenhouse — coming soon."
        path="/calculator"
      />
      <PageHero
        eyebrow="Calculator"
        heading="Greenhouse Calculator"
        body="Explore what a Vera AgriTech screen house could produce for you — coming soon, once our commercial assumptions are finalised."
      />

      <section className="section-py">
        <div className="container-page">
          <div className="mx-auto max-w-3xl rounded-3xl border-2 border-dashed border-gold-400 bg-gold-100/40 p-8 text-center">
            <span className="badge bg-gold-500 text-white">Coming soon</span>
            <h2 className="mt-4 text-2xl">This calculator is on hold pending Vera-approved data</h2>
            <p className="mt-3 text-ink-600">
              To avoid publishing unverified ROI, yield or repayment figures, this tool will go live only once Vera
              AgriTech has supplied and validated the underlying production, pricing and financing assumptions. The
              input fields below show the calculator's planned scope.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-ink-100 bg-white p-8 opacity-60">
            <fieldset disabled className="grid gap-5 sm:grid-cols-2">
              <legend className="sr-only">Greenhouse calculator inputs (disabled preview)</legend>
              <div>
                <label className="form-label">Greenhouse size</label>
                <select className="input">
                  <option>100 m² — Starter Farmer</option>
                  <option>250 m² — Growth Farmer</option>
                  <option>500 m² — Commercial Farmer</option>
                </select>
              </div>
              <div>
                <label className="form-label">Package</label>
                <select className="input">
                  {content.packages.map((p) => (
                    <option key={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Crop</label>
                <select className="input">
                  {content.crops.slice(0, 5).map((c) => (
                    <option key={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Initial contribution</label>
                <input className="input" placeholder="e.g. 15%" />
              </div>
              <div>
                <label className="form-label">Financing period</label>
                <input className="input" placeholder="e.g. 12 months" />
              </div>
              <div>
                <label className="form-label">Production assumptions</label>
                <input className="input" placeholder="Set by Vera AgriTech" />
              </div>
            </fieldset>
            <button type="button" disabled className="btn-primary mt-6 w-full opacity-60">
              Calculate (available soon)
            </button>
            <p className="mt-4 text-center text-xs text-ink-400">
              Planned outputs: expected production, expected revenue, estimated repayment, estimated customer return
              and potential payback period — all based on assumptions supplied and approved by Vera AgriTech.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
