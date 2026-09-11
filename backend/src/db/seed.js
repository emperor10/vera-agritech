const bcrypt = require('bcryptjs');
const db = require('./index');
const env = require('../config/env');
const content = require('../seed/content.json');

require('./migrate');

const now = () => new Date().toISOString();

function seedAdmin() {
  const existing = db.prepare('SELECT id FROM admins WHERE email = ?').get(env.defaultAdmin.email);
  if (existing) {
    console.log(`Admin already exists (${env.defaultAdmin.email}) — skipping.`);
    return;
  }
  const hash = bcrypt.hashSync(env.defaultAdmin.password, 12);
  db.prepare('INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)').run(
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

function seedContentBlocks() {
  // Only insert if not already present, so a re-run of the seed never
  // clobbers edits already made from the admin panel.
  const insertIfMissing = db.prepare(`
    INSERT OR IGNORE INTO content_blocks (page, value, updated_at) VALUES (?, ?, ?)
  `);
  const tx = db.transaction(() => {
    for (const key of PAGE_KEYS) {
      if (content[key] === undefined) continue;
      insertIfMissing.run(key, JSON.stringify(content[key]), now());
    }
  });
  tx();
  console.log(`Seeded content_blocks for ${PAGE_KEYS.length} pages (existing rows preserved).`);
}

function seedSettings() {
  const insertIfMissing = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  insertIfMissing.run('site', JSON.stringify(content.settings || {}));
  console.log('Seeded site settings.');
}

function seedFaqs() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM faqs').get().c;
  if (count > 0) {
    console.log('FAQs already seeded — skipping.');
    return;
  }
  const insert = db.prepare(
    'INSERT INTO faqs (question, answer, sort_order, is_published) VALUES (?, ?, ?, 1)'
  );
  const tx = db.transaction(() => {
    (content.faqs || []).forEach((faq, i) => insert.run(faq.question, faq.answer, i));
  });
  tx();
  console.log(`Seeded ${(content.faqs || []).length} FAQs.`);
}

function seedPackages() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM packages').get().c;
  if (count > 0) {
    console.log('Packages already seeded — skipping.');
    return;
  }
  const insert = db.prepare(`
    INSERT INTO packages (name, area, best_for, cost_range, turnover_range, includes_json, popular, sort_order, is_published)
    VALUES (@name, @area, @bestFor, @costRange, @turnoverRange, @includesJson, @popular, @sortOrder, 1)
  `);
  const tx = db.transaction(() => {
    (content.packages || []).forEach((pkg, i) => {
      insert.run({
        name: pkg.name,
        area: pkg.area,
        bestFor: pkg.bestFor,
        costRange: pkg.costRange,
        turnoverRange: pkg.turnoverRange,
        includesJson: JSON.stringify(pkg.includes || []),
        popular: pkg.popular ? 1 : 0,
        sortOrder: pkg.order ?? i,
      });
    });
  });
  tx();
  console.log(`Seeded ${(content.packages || []).length} packages.`);
}

function seedCrops() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM crops').get().c;
  if (count > 0) {
    console.log('Crops already seeded — skipping.');
    return;
  }
  const insert = db.prepare(
    'INSERT INTO crops (name, note, image_key, sort_order, is_published) VALUES (?, ?, ?, ?, 1)'
  );
  const tx = db.transaction(() => {
    (content.cropsProduction?.crops || []).forEach((crop, i) => {
      insert.run(crop.name, crop.note || '', crop.imageKey || '', i);
    });
  });
  tx();
  console.log('Seeded crops.');
}

function seedTestimonials() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM testimonials').get().c;
  if (count > 0) {
    console.log('Testimonials already seeded — skipping.');
    return;
  }
  const insert = db.prepare(
    'INSERT INTO testimonials (name, location, quote, image_key, sort_order, is_published) VALUES (?, ?, ?, ?, ?, 1)'
  );
  const tx = db.transaction(() => {
    (content.home?.testimonials || []).forEach((t, i) => {
      insert.run(t.name, t.location, t.quote, t.imageKey || '', i);
    });
  });
  tx();
  console.log('Seeded testimonials.');
}

function seedCaseStudies() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM case_studies').get().c;
  if (count > 0) {
    console.log('Case studies already seeded — skipping.');
    return;
  }
  const insert = db.prepare(
    'INSERT INTO case_studies (title, summary, stats_json, image_key, sort_order, is_published) VALUES (?, ?, ?, ?, ?, 1)'
  );
  const tx = db.transaction(() => {
    (content.projects?.caseStudies || []).forEach((cs, i) => {
      insert.run(cs.title, cs.summary, JSON.stringify(cs.stats || []), cs.imageKey || '', i);
    });
  });
  tx();
  console.log('Seeded case studies.');
}

function seedImagePlaceholders() {
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

  const insertIfMissing = db.prepare(
    'INSERT OR IGNORE INTO images (key, url, alt_text, updated_at) VALUES (?, NULL, ?, ?)'
  );
  const tx = db.transaction(() => {
    for (const key of keys) {
      insertIfMissing.run(key, key.replace(/-/g, ' '), now());
    }
  });
  tx();
  console.log(`Registered ${keys.size} image placeholders for the admin media library.`);
}

seedAdmin();
seedSettings();
seedContentBlocks();
seedFaqs();
seedPackages();
seedCrops();
seedTestimonials();
seedCaseStudies();
seedImagePlaceholders();

console.log('\nSeed complete.');
console.log(`Login at the admin panel with: ${env.defaultAdmin.email}`);
console.log('Remember to change this password immediately after first login.');
