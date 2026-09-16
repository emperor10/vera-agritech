const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.get('/admin/crops', requireAuth, async (_req, res) => {
  res.json(await db.prepare('SELECT * FROM crops ORDER BY sort_order ASC').all());
});

router.post('/admin/crops', requireAuth, [body('name').isString().trim().notEmpty()], validate, async (req, res) => {
  const { name, note = '', imageKey = '', sortOrder = 0, isPublished = 1 } = req.body;
  const info = await db
    .prepare('INSERT INTO crops (name, note, image_key, sort_order, is_published) VALUES (?, ?, ?, ?, ?)')
    .run(name, note, imageKey, sortOrder, isPublished ? 1 : 0);
  res.status(201).json({ id: info.lastInsertRowid });
});

router.put('/admin/crops/:id', requireAuth, [body('name').isString().trim().notEmpty()], validate, async (req, res) => {
  const { name, note = '', imageKey = '', sortOrder = 0, isPublished = 1 } = req.body;
  await db.prepare('UPDATE crops SET name=?, note=?, image_key=?, sort_order=?, is_published=? WHERE id=?').run(
    name,
    note,
    imageKey,
    sortOrder,
    isPublished ? 1 : 0,
    req.params.id
  );
  res.json({ success: true });
});

router.delete('/admin/crops/:id', requireAuth, async (req, res) => {
  await db.prepare('DELETE FROM crops WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
