export interface NavLink {
  label: string;
  path?: string;
  children?: NavLink[];
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  email: string;
  address: string;
  social: { facebook: string; instagram: string; twitter: string };
  footerTagline: string;
  founder: string;
  copyrightYear: string;
}

export interface ImageAsset {
  url: string | null;
  altText: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

export interface Package {
  id: number;
  name: string;
  area: string;
  bestFor: string;
  costRange: string;
  turnoverRange: string;
  includes: string[];
  popular: boolean;
  sortOrder: number;
}

export interface Crop {
  id: number;
  name: string;
  note: string;
  imageKey: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  quote: string;
  imageKey: string;
}

export interface CaseStudyStat {
  label: string;
  value: string;
}

export interface CaseStudy {
  id: number;
  title: string;
  summary: string;
  stats: CaseStudyStat[];
  imageKey: string;
}

export interface BlogPostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImageKey: string;
  publishedAt: string | null;
}

export interface ContentBundle {
  pages: Record<string, any>;
  settings: SiteSettings;
  faqs: Faq[];
  packages: Package[];
  crops: Crop[];
  testimonials: Testimonial[];
  caseStudies: CaseStudy[];
  blogPosts: BlogPostSummary[];
  images: Record<string, ImageAsset>;
}
