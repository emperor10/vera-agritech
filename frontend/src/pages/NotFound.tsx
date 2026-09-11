import { Link } from 'react-router-dom';
import { Seo } from '../components/ui/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you're looking for could not be found." />
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 text-4xl">Page not found</h1>
        <p className="mt-3 max-w-md text-ink-500">The page you're looking for doesn't exist or may have moved.</p>
        <Link to="/" className="btn-primary mt-8">
          Back to Home
        </Link>
      </div>
    </>
  );
}
