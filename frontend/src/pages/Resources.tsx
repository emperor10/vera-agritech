import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useContent } from '../context/ContentContext';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { PlaceholderImage } from '../components/ui/PlaceholderImage';
import { api, apiErrorMessage } from '../lib/api';

const schema = z.object({ email: z.string().email('Please enter a valid email address.') });
type FormValues = z.infer<typeof schema>;

function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      await api.post('/leads', {
        name: 'Newsletter subscriber',
        email: values.email,
        interest: 'Newsletter subscription',
        sourcePage: 'resources-newsletter',
      });
      setStatus('success');
      setMsg('You are subscribed. Thank you!');
      reset();
    } catch (err) {
      setStatus('error');
      setMsg(apiErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-3 sm:flex-row" noValidate>
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input id="newsletter-email" type="email" placeholder="you@example.com" className="input mt-0" {...register('email')} />
        {errors.email && <p className="mt-1 text-xs text-red-200">{errors.email.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary shrink-0">
        {isSubmitting ? 'Subscribing…' : 'Subscribe'}
      </button>
      {status === 'success' && <p className="text-sm text-brand-100 sm:hidden">{msg}</p>}
      {status === 'error' && <p className="text-sm text-red-200">{msg}</p>}
    </form>
  );
}

export default function Resources() {
  const { content } = useContent();
  const posts = content.blogPosts;

  return (
    <>
      <Seo
        title="Insights & Publications"
        description="Professional agronomic updates, greenhouse structural designs, and sustainable crop production tutorials from Vera AgriTech."
        path="/resources"
      />
      <PageHero
        eyebrow="Vera AgriTech Insights & Publications"
        heading="Technical Guides & Field Notes"
        body="Stay up to date with professional controlled-environment agriculture developments in West Africa."
      >
        <div className="mt-8 max-w-xl rounded-2xl bg-white/10 p-6 ring-1 ring-white/15">
          <h2 className="text-lg text-white">Subscribe to Technical Updates</h2>
          <p className="mt-1 text-sm text-brand-100">
            Get agronomic research papers, greenhouse case studies, and waitlist alerts delivered straight to your
            inbox.
          </p>
          <NewsletterForm />
        </div>
      </PageHero>

      <section className="section-py">
        <div className="container-page">
          {posts.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50 p-10 text-center">
              <p className="font-semibold text-brand-800">No articles published yet</p>
              <p className="mt-2 text-sm text-brand-700">
                New agronomic guides and case studies will appear here as soon as the Vera AgriTech team publishes
                them from the admin panel.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} to={`/resources/${post.slug}`} className="card flex h-full flex-col">
                  <PlaceholderImage imageKey={post.coverImageKey} alt={post.title} className="mb-4" />
                  <h3 className="text-lg">{post.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink-500">{post.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700">
                    Read article
                    <svg className="card-arrow h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h9M8 3.5 12.5 8 8 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
