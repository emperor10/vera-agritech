import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Seo } from '../components/ui/Seo';
import { PageHero } from '../components/ui/PageHero';
import { PlaceholderImage } from '../components/ui/PlaceholderImage';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  cover_image_key: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api
      .get(`/blog/${slug}`)
      .then(({ data }) => setPost(data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="container-page section-py text-center">
        <h1 className="text-3xl">Article not found</h1>
        <p className="mt-3 text-ink-500">This article may have been unpublished or moved.</p>
        <Link to="/resources" className="btn-primary mt-6">
          Back to Insights & Blog
        </Link>
      </div>
    );
  }

  if (!post) {
    return <div className="container-page section-py text-center text-ink-400">Loading article…</div>;
  }

  return (
    <>
      <Seo title={post.title} description={post.excerpt} path={`/resources/${slug}`} />
      <PageHero eyebrow="Insights & Publications" heading={post.title} body={post.excerpt} />
      <article className="section-py">
        <div className="container-page max-w-3xl">
          <PlaceholderImage imageKey={post.cover_image_key} alt={post.title} className="mb-8" />
          <div className="prose prose-lg max-w-none whitespace-pre-line text-ink-700">{post.content}</div>
        </div>
      </article>
    </>
  );
}
