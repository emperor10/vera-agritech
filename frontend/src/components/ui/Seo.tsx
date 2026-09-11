import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description?: string;
  path?: string;
}

const SITE_URL = 'https://veraagritech.com';

export function Seo({ title, description, path = '' }: SeoProps) {
  const fullTitle = title.includes('Vera AgriTech') ? title : `${title} | Vera AgriTech`;
  const canonical = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
