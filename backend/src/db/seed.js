const bcrypt = require('bcryptjs');
const db = require('./index');
const migrate = require('./migrate');
const env = require('../config/env');
const content = require('../seed/content.json');

const now = () => new Date().toISOString();

async function seedAdmin() {
  const existing = await db.prepare('SELECT id FROM admins WHERE email = ?').get(env.defaultAdmin.email);
  if (existing) {
    console.log(`Admin already exists (${env.defaultAdmin.email}) — skipping.`);
    return;
  }
  const hash = bcrypt.hashSync(env.defaultAdmin.password, 12);
  await db.prepare('INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)').run(
    env.defaultAdmin.name,
    env.defaultAdmin.email,
    hash
  );
  console.log(`Created default admin: ${env.defaultAdmin.email} / (password from .env)`);
}

// Pages whose long-form copy is stored as a single JSON blob.
const PAGE_KEYS = [
  'navigation',
  'home',
  'theVeraModel',
  'greenhouses',
  'howItWorks',
  'cropsProduction',
  'financing',
  'marketAccess',
  'trainingSupport',
  'consulting',
  'aboutVera',
  'projects',
  'investors',
  'privacy',
  'scaleUp',
];

async function seedContentBlocks() {
  // Only insert if not already present, so a re-run of the seed never
  // clobbers edits already made from the admin panel.
  const sql = 'INSERT OR IGNORE INTO content_blocks (page, value, updated_at) VALUES (?, ?, ?)';
  const statements = PAGE_KEYS.filter((key) => content[key] !== undefined).map((key) => ({
    sql,
    args: [key, JSON.stringify(content[key]), now()],
  }));
  await db.batch(statements);
  console.log(`Seeded content_blocks for ${PAGE_KEYS.length} pages (existing rows preserved).`);
}

async function seedSettings() {
  await db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)').run(
    'site',
    JSON.stringify(content.settings || {})
  );
  console.log('Seeded site settings.');
}

async function seedFaqs() {
  const { c: count } = await db.prepare('SELECT COUNT(*) AS c FROM faqs').get();
  if (count > 0) {
    console.log('FAQs already seeded — skipping.');
    return;
  }
  const sql = 'INSERT INTO faqs (question, answer, sort_order, is_published) VALUES (?, ?, ?, 1)';
  const statements = (content.faqs || []).map((faq, i) => ({ sql, args: [faq.question, faq.answer, i] }));
  await db.batch(statements);
  console.log(`Seeded ${(content.faqs || []).length} FAQs.`);
}

async function seedPackages() {
  const { c: count } = await db.prepare('SELECT COUNT(*) AS c FROM packages').get();
  if (count > 0) {
    console.log('Packages already seeded — skipping.');
    return;
  }
  const sql = `
    INSERT INTO packages (name, area, best_for, cost_range, turnover_range, includes_json, popular, sort_order, is_published)
    VALUES (@name, @area, @bestFor, @costRange, @turnoverRange, @includesJson, @popular, @sortOrder, 1)
  `;
  const statements = (content.packages || []).map((pkg, i) => ({
    sql,
    args: {
      name: pkg.name,
      area: pkg.area,
      bestFor: pkg.bestFor,
      costRange: pkg.costRange,
      turnoverRange: pkg.turnoverRange,
      includesJson: JSON.stringify(pkg.includes || []),
      popular: pkg.popular ? 1 : 0,
      sortOrder: pkg.order ?? i,
    },
  }));
  await db.batch(statements);
  console.log(`Seeded ${(content.packages || []).length} packages.`);
}

async function seedCrops() {
  const { c: count } = await db.prepare('SELECT COUNT(*) AS c FROM crops').get();
  if (count > 0) {
    console.log('Crops already seeded — skipping.');
    return;
  }
  const sql = 'INSERT INTO crops (name, note, image_key, sort_order, is_published) VALUES (?, ?, ?, ?, 1)';
  const statements = (content.cropsProduction?.crops || []).map((crop, i) => ({
    sql,
    args: [crop.name, crop.note || '', crop.imageKey || '', i],
  }));
  await db.batch(statements);
  console.log('Seeded crops.');
}

async function seedTestimonials() {
  const { c: count } = await db.prepare('SELECT COUNT(*) AS c FROM testimonials').get();
  if (count > 0) {
    console.log('Testimonials already seeded — skipping.');
    return;
  }
  const sql =
    'INSERT INTO testimonials (name, location, quote, image_key, sort_order, is_published) VALUES (?, ?, ?, ?, ?, 1)';
  const statements = (content.home?.testimonials || []).map((t, i) => ({
    sql,
    args: [t.name, t.location, t.quote, t.imageKey || '', i],
  }));
  await db.batch(statements);
  console.log('Seeded testimonials.');
}

async function seedCaseStudies() {
  const { c: count } = await db.prepare('SELECT COUNT(*) AS c FROM case_studies').get();
  if (count > 0) {
    console.log('Case studies already seeded — skipping.');
    return;
  }
  const sql =
    'INSERT INTO case_studies (title, summary, stats_json, image_key, sort_order, is_published) VALUES (?, ?, ?, ?, ?, 1)';
  const statements = (content.projects?.caseStudies || []).map((cs, i) => ({
    sql,
    args: [cs.title, cs.summary, JSON.stringify(cs.stats || []), cs.imageKey || '', i],
  }));
  await db.batch(statements);
  console.log('Seeded case studies.');
}

async function seedImagePlaceholders() {
  const keys = new Set();
  const collect = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    if (typeof obj.imageKey === 'string') keys.add(obj.imageKey);
    for (const v of Object.values(obj)) {
      if (Array.isArray(v)) v.forEach(collect);
      else if (typeof v === 'object') collect(v);
    }
  };
  collect(content);
  // A few extras referenced directly in the frontend that aren't nested under
  // imageKey in the content JSON — i.e. hardcoded straight into a page's JSX
  // (e.g. Greenhouses.tsx uses imageKey="greenhouse-structure" literally) —
  // so the recursive walk above can never discover them. Every such
  // hardcoded key must be listed here explicitly or it will silently never
  // appear in the admin Media Library, however the rest of the code
  // references it correctly.
  ['home-hero-image', 'logo-mark', 'og-cover-image', 'greenhouse-structure'].forEach((k) => keys.add(k));

  const sql = 'INSERT OR IGNORE INTO images (key, url, alt_text, updated_at) VALUES (?, NULL, ?, ?)';
  const statements = [...keys].map((key) => ({ sql, args: [key, key.replace(/-/g, ' '), now()] }));
  await db.batch(statements);
  console.log(`Registered ${keys.size} image placeholders for the admin media library.`);
}

async function main() {
  await migrate();
  await seedAdmin();
  await seedSettings();
  await seedContentBlocks();
  await seedFaqs();
  await seedPackages();
  await seedCrops();
  await seedTestimonials();
  await seedCaseStudies();
  await seedImagePlaceholders();

  console.log('\nSeed complete.');
  console.log(`Login at the admin panel with: ${env.defaultAdmin.email}`);
  console.log('Remember to change this password immediately after first login.');
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}

module.exports = main;
