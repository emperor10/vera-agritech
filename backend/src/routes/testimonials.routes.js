const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.get('/admin/testimonials', requireAuth, async (_req, res) => {
  res.json(await db.prepare('SELECT * FROM testimonials ORDER BY sort_order ASC').all());
});

router.post(
  '/admin/testimonials',
  requireAuth,
  [body('name').isString().trim().notEmpty(), body('quote').isString().trim().notEmpty()],
  validate,
  async (req, res) => {
    const { name, location = '', quote, imageKey = '', sortOrder = 0, isPublished = 1 } = req.body;
    const info = await db
      .prepare('INSERT INTO testimonials (name, location, quote, image_key, sort_order, is_published) VALUES (?, ?, ?, ?, ?, ?)')
      .run(name, location, quote, imageKey, sortOrder, isPublished ? 1 : 0);
    res.status(201).json({ id: info.lastInsertRowid });
  }
);

router.put(
  '/admin/testimonials/:id',
  requireAuth,
  [body('name').isString().trim().notEmpty(), body('quote').isString().trim().notEmpty()],
  validate,
  async (req, res) => {
    const { name, location = '', quote, imageKey = '', sortOrder = 0, isPublished = 1 } = req.body;
    await db.prepare(
      'UPDATE testimonials SET name=?, location=?, quote=?, image_key=?, sort_order=?, is_published=? WHERE id=?'
    ).run(name, location, quote, imageKey, sortOrder, isPublished ? 1 : 0, req.params.id);
    res.json({ success: true });
  }
);

router.delete('/admin/testimonials/:id', requireAuth, async (req, res) => {
  await db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
