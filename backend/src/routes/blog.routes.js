const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

router.get('/blog/:slug', (req, res) => {
  const post = db
    .prepare('SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1')
    .get(req.params.slug);
  if (!post) return res.status(404).json({ error: 'Article not found.' });
  res.json(post);
});

router.get('/admin/blog', requireAuth, (_req, res) => {
  res.json(db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all());
});

router.post(
  '/admin/blog',
  requireAuth,
  [body('title').isString().trim().notEmpty()],
  validate,
  (req, res) => {
    const { title, excerpt = '', content = '', coverImageKey = '', isPublished = 0 } = req.body;
    const slug = req.body.slug ? slugify(req.body.slug) : slugify(title);
    const publishedAt = isPublished ? new Date().toISOString() : null;
    const info = db
      .prepare(
        'INSERT INTO blog_posts (title, slug, excerpt, content, cover_image_key, is_published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )
      .run(title, slug, excerpt, content, coverImageKey, isPublished ? 1 : 0, publishedAt);
    res.status(201).json({ id: info.lastInsertRowid, slug });
  }
);

router.put(
  '/admin/blog/:id',
  requireAuth,
  [body('title').isString().trim().notEmpty()],
  validate,
  (req, res) => {
    const existing = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found.' });

    const { title, excerpt = '', content = '', coverImageKey = '', isPublished = 0 } = req.body;
    const slug = req.body.slug ? slugify(req.body.slug) : existing.slug;
    const publishedAt = isPublished && !existing.published_at ? new Date().toISOString() : existing.published_at;

    db.prepare(
      `UPDATE blog_posts SET title=?, slug=?, excerpt=?, content=?, cover_image_key=?, is_published=?, published_at=?, updated_at=datetime('now') WHERE id=?`
    ).run(title, slug, excerpt, content, coverImageKey, isPublished ? 1 : 0, publishedAt, req.params.id);
    res.json({ success: true });
  }
);

router.delete('/admin/blog/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM blog_posts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
