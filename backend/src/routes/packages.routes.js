const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { safeJsonParse } = require('../db/helpers');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

function serialize(row) {
  return { ...row, includes: safeJsonParse(row.includes_json, []), includes_json: undefined };
}

router.get('/admin/packages', requireAuth, async (_req, res) => {
  const rows = await db.prepare('SELECT * FROM packages ORDER BY sort_order ASC').all();
  res.json(rows.map(serialize));
});

router.post(
  '/admin/packages',
  requireAuth,
  [body('name').isString().trim().notEmpty()],
  validate,
  async (req, res) => {
    const { name, area, bestFor, costRange, turnoverRange, includes = [], popular = false, sortOrder = 0, isPublished = 1 } = req.body;
    const info = await db
      .prepare(
        'INSERT INTO packages (name, area, best_for, cost_range, turnover_range, includes_json, popular, sort_order, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(name, area, bestFor, costRange, turnoverRange, JSON.stringify(includes), popular ? 1 : 0, sortOrder, isPublished ? 1 : 0);
    res.status(201).json({ id: info.lastInsertRowid });
  }
);

router.put(
  '/admin/packages/:id',
  requireAuth,
  [body('name').isString().trim().notEmpty()],
  validate,
  async (req, res) => {
    const { name, area, bestFor, costRange, turnoverRange, includes = [], popular = false, sortOrder = 0, isPublished = 1 } = req.body;
    await db.prepare(
      'UPDATE packages SET name=?, area=?, best_for=?, cost_range=?, turnover_range=?, includes_json=?, popular=?, sort_order=?, is_published=? WHERE id=?'
    ).run(name, area, bestFor, costRange, turnoverRange, JSON.stringify(includes), popular ? 1 : 0, sortOrder, isPublished ? 1 : 0, req.params.id);
    res.json({ success: true });
  }
);

router.delete('/admin/packages/:id', requireAuth, async (req, res) => {
  await db.prepare('DELETE FROM packages WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
