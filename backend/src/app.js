const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const env = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimiters');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const contentRoutes = require('./routes/content.routes');
const faqsRoutes = require('./routes/faqs.routes');
const packagesRoutes = require('./routes/packages.routes');
const cropsRoutes = require('./routes/crops.routes');
const testimonialsRoutes = require('./routes/testimonials.routes');
const caseStudiesRoutes = require('./routes/caseStudies.routes');
const blogRoutes = require('./routes/blog.routes');
const imagesRoutes = require('./routes/images.routes');
const productsRoutes = require('./routes/products.routes');
const partnersRoutes = require('./routes/partners.routes');
const leadsRoutes = require('./routes/leads.routes');
const applicationsRoutes = require('./routes/applications.routes');
const outgrowerRoutes = require('./routes/outgrower.routes');
const settingsRoutes = require('./routes/settings.routes');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: env.corsOrigin.includes('*') ? true : env.corsOrigin,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

// Only relevant when IMAGE_STORAGE=local (e.g. HostAfrica, which has real
// persistent disk) — serves admin-uploaded images straight from disk. When
// IMAGE_STORAGE=cloudinary this folder is unused and the route just 404s,
// which is harmless.
app.use('/uploads', express.static(env.uploadsDir, { maxAge: '7d' }));

app.use('/api', apiLimiter, healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api', faqsRoutes);
app.use('/api', packagesRoutes);
app.use('/api', cropsRoutes);
app.use('/api', testimonialsRoutes);
app.use('/api', caseStudiesRoutes);
app.use('/api', blogRoutes);
app.use('/api', imagesRoutes);
app.use('/api', productsRoutes);
app.use('/api', partnersRoutes);
app.use('/api', leadsRoutes);
app.use('/api', applicationsRoutes);
app.use('/api', outgrowerRoutes);
app.use('/api', settingsRoutes);

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

// Centralised error handler (also catches multer file-validation errors).
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Unexpected server error.' });
});

module.exports = app;
