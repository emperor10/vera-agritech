const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.get('/admin/partners', requireAuth, async (_req, res) => {
  res.json(await db.prepare('SELECT * FROM partners ORDER BY sort_order ASC').all());
});

router.post('/admin/partners', requireAuth, [body('name').isString().trim().notEmpty()], validate, async (req, res) => {
  const { name, imageKey = '', websiteUrl = '', sortOrder = 0, isPublished = 1 } = req.body;
  const info = await db
    .prepare('INSERT INTO partners (name, image_key, website_url, sort_order, is_published) VALUES (?, ?, ?, ?, ?)')
    .run(name, imageKey, websiteUrl, sortOrder, isPublished ? 1 : 0);
  res.status(201).json({ id: info.lastInsertRowid });
});

router.put('/admin/partners/:id', requireAuth, [body('name').isString().trim().notEmpty()], validate, async (req, res) => {
  const { name, imageKey = '', websiteUrl = '', sortOrder = 0, isPublished = 1 } = req.body;
  await db.prepare('UPDATE partners SET name=?, image_key=?, website_url=?, sort_order=?, is_published=? WHERE id=?').run(
    name,
    imageKey,
    websiteUrl,
    sortOrder,
    isPublished ? 1 : 0,
    req.params.id
  );
  res.json({ success: true });
});

router.delete('/admin/partners/:id', requireAuth, async (req, res) => {
  await db.prepare('DELETE FROM partners WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
