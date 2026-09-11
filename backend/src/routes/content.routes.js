const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { safeJsonParse } = require('../db/helpers');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

const now = () => new Date().toISOString();

function loadImages() {
  const rows = db.prepare('SELECT key, url, alt_text FROM images').all();
  const map = {};
  for (const row of rows) {
    map[row.key] = { url: row.url, altText: row.alt_text };
  }
  return map;
}

function loadPages() {
  const rows = db.prepare('SELECT page, value FROM content_blocks').all();
  const pages = {};
  for (const row of rows) {
    pages[row.page] = safeJsonParse(row.value, null);
  }
  return pages;
}

// Public: single bundle used by the frontend on first load.
router.get('/', (_req, res) => {
  const pages = loadPages();
  const settingsRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('site');
  const faqs = db
    .prepare('SELECT id, question, answer FROM faqs WHERE is_published = 1 ORDER BY sort_order ASC')
    .all();
  const packages = db
    .prepare(
      'SELECT id, name, area, best_for AS bestFor, cost_range AS costRange, turnover_range AS turnoverRange, includes_json, popular, sort_order AS sortOrder FROM packages WHERE is_published = 1 ORDER BY sort_order ASC'
    )
    .all()
    .map((p) => ({ ...p, includes: safeJsonParse(p.includes_json, []), popular: !!p.popular, includes_json: undefined }));
  const crops = db
    .prepare('SELECT id, name, note, image_key AS imageKey FROM crops WHERE is_published = 1 ORDER BY sort_order ASC')
    .all();
  const testimonials = db
    .prepare(
      'SELECT id, name, location, quote, image_key AS imageKey FROM testimonials WHERE is_published = 1 ORDER BY sort_order ASC'
    )
    .all();
  const caseStudies = db
    .prepare(
      'SELECT id, title, summary, stats_json, image_key AS imageKey FROM case_studies WHERE is_published = 1 ORDER BY sort_order ASC'
    )
    .all()
    .map((c) => ({ ...c, stats: safeJsonParse(c.stats_json, []), stats_json: undefined }));
  const blogPosts = db
    .prepare(
      "SELECT id, title, slug, excerpt, cover_image_key AS coverImageKey, published_at AS publishedAt FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC"
    )
    .all();

  res.json({
    pages,
    settings: safeJsonParse(settingsRow?.value, {}),
    faqs,
    packages,
    crops,
    testimonials,
    caseStudies,
    blogPosts,
    images: loadImages(),
  });
});

router.get('/:page', (req, res) => {
  const row = db.prepare('SELECT value, updated_at FROM content_blocks WHERE page = ?').get(req.params.page);
  if (!row) return res.status(404).json({ error: 'Page content not found.' });
  res.json({ page: req.params.page, value: safeJsonParse(row.value, {}), updatedAt: row.updated_at });
});

// Admin: list all editable page keys.
router.get('/admin/pages', requireAuth, (_req, res) => {
  const rows = db.prepare('SELECT page, updated_at FROM content_blocks ORDER BY page ASC').all();
  res.json(rows);
});

router.put(
  '/admin/:page',
  requireAuth,
  [body('value').custom((v) => typeof v === 'object' && v !== null)],
  validate,
  (req, res) => {
    const { page } = req.params;
    const value = JSON.stringify(req.body.value);
    const result = db
      .prepare('UPDATE content_blocks SET value = ?, updated_at = ? WHERE page = ?')
      .run(value, now(), page);

    if (result.changes === 0) {
      db.prepare('INSERT INTO content_blocks (page, value, updated_at) VALUES (?, ?, ?)').run(page, value, now());
    }

    db.prepare('INSERT INTO audit_log (admin_email, action, entity, entity_id) VALUES (?, ?, ?, ?)').run(
      req.admin.email,
      'update_content',
      'content_blocks',
      page
    );

    return res.json({ success: true });
  }
);

module.exports = router;
