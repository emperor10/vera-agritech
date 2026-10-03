import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { RequireAdmin } from './pages/admin/RequireAdmin';
import Home from './pages/Home';
import TheVeraModel from './pages/TheVeraModel';
import Greenhouses from './pages/Greenhouses';
import HowItWorks from './pages/HowItWorks';
import CropsProduction from './pages/CropsProduction';
import Products from './pages/Products';
import Financing from './pages/Financing';
import MarketAccess from './pages/MarketAccess';
import TrainingSupport from './pages/TrainingSupport';
import Consulting from './pages/Consulting';
import Calculator from './pages/Calculator';
import AboutVera from './pages/AboutVera';
import BusinessModel from './pages/BusinessModel';
import Projects from './pages/Projects';
import Investors from './pages/Investors';
import Resources from './pages/Resources';
import BlogPost from './pages/BlogPost';
import Faqs from './pages/Faqs';
import Contact from './pages/Contact';
import GetStarted from './pages/GetStarted';
import Outgrower from './pages/Outgrower';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

// The entire admin panel is code-split into its own chunk — public visitors
// (the overwhelming majority of traffic) never download this bundle.
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminContentEditor = lazy(() => import('./pages/admin/AdminContentEditor'));
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'));
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'));
const AdminFaqs = lazy(() => import('./pages/admin/AdminFaqs'));
const AdminPackages = lazy(() => import('./pages/admin/AdminPackages'));
const AdminCrops = lazy(() => import('./pages/admin/AdminCrops'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminPartners = lazy(() => import('./pages/admin/AdminPartners'));
const AdminOutgrowerApplications = lazy(() => import('./pages/admin/AdminOutgrowerApplications'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminCaseStudies = lazy(() => import('./pages/admin/AdminCaseStudies'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function AdminFallback() {
  return <div className="flex min-h-screen items-center justify-center text-ink-400">Loading admin panel…</div>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="the-vera-model" element={<TheVeraModel />} />
        <Route path="solutions/greenhouses" element={<Greenhouses />} />
        <Route path="solutions/how-it-works" element={<HowItWorks />} />
        <Route path="solutions/crops-and-production" element={<CropsProduction />} />
        <Route path="products" element={<Products />} />
        <Route path="financing" element={<Financing />} />
        <Route path="solutions/market-access" element={<MarketAccess />} />
        <Route path="training-support" element={<TrainingSupport />} />
        <Route path="consulting" element={<Consulting />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="about" element={<AboutVera />} />
        <Route path="business-model" element={<BusinessModel />} />
        <Route path="projects" element={<Projects />} />
        <Route path="investors" element={<Investors />} />
        <Route path="resources" element={<Resources />} />
        <Route path="resources/:slug" element={<BlogPost />} />
        <Route path="faqs" element={<Faqs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="get-started" element={<GetStarted />} />
        <Route path="outgrower" element={<Outgrower />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="admin"
        element={
          <RequireAdmin>
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          </RequireAdmin>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="content/:page" element={<AdminContentEditor />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="faqs" element={<AdminFaqs />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="crops" element={<AdminCrops />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="partners" element={<AdminPartners />} />
        <Route path="outgrower-applications" element={<AdminOutgrowerApplications />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="case-studies" element={<AdminCaseStudies />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
