const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { safeJsonParse } = require('../db/helpers');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

function serialize(row) {
  return { ...row, specs: safeJsonParse(row.specs_json, []), specs_json: undefined };
}

const now = () => new Date().toISOString();

// --- Admin: full CRUD (all products, published or not) ---

router.get('/admin/products', requireAuth, async (_req, res) => {
  const rows = await db.prepare('SELECT * FROM products ORDER BY category ASC, sort_order ASC').all();
  res.json(rows.map(serialize));
});

router.post(
  '/admin/products',
  requireAuth,
  [
    body('name').isString().trim().notEmpty().withMessage('Name is required.'),
    body('category').isIn(['vegetable', 'equipment']).withMessage('Category must be "vegetable" or "equipment".'),
  ],
  validate,
  async (req, res) => {
    const {
      category,
      name,
      description = '',
      price = '',
      unit = 'kg',
      specs = [],
      imageKey = '',
      sortOrder = 0,
      isPublished = 1,
    } = req.body;
    const info = await db
      .prepare(
        'INSERT INTO products (category, name, description, price, unit, specs_json, image_key, sort_order, is_published, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(category, name, description, price, unit, JSON.stringify(specs), imageKey, sortOrder, isPublished ? 1 : 0, now());
    res.status(201).json({ id: info.lastInsertRowid });
  }
);

router.put(
  '/admin/products/:id',
  requireAuth,
  [
    body('name').isString().trim().notEmpty().withMessage('Name is required.'),
    body('category').isIn(['vegetable', 'equipment']).withMessage('Category must be "vegetable" or "equipment".'),
  ],
  validate,
  async (req, res) => {
    const {
      category,
      name,
      description = '',
      price = '',
      unit = 'kg',
      specs = [],
      imageKey = '',
      sortOrder = 0,
      isPublished = 1,
    } = req.body;
    await db
      .prepare(
        "UPDATE products SET category=?, name=?, description=?, price=?, unit=?, specs_json=?, image_key=?, sort_order=?, is_published=?, updated_at=? WHERE id=?"
      )
      .run(
        category,
        name,
        description,
        price,
        unit,
        JSON.stringify(specs),
        imageKey,
        sortOrder,
        isPublished ? 1 : 0,
        now(),
        req.params.id
      );
    res.json({ success: true });
  }
);

router.delete('/admin/products/:id', requireAuth, async (req, res) => {
  await db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- Public: published products only, grouped by nothing (frontend groups
// by category) — kept flat and simple to match the existing /content bundle
// shape used for packages/crops. ---

router.get('/products', async (_req, res) => {
  const rows = await db
    .prepare(
      'SELECT id, category, name, description, price, unit, specs_json, image_key AS imageKey, sort_order AS sortOrder FROM products WHERE is_published = 1 ORDER BY category ASC, sort_order ASC'
    )
    .all();
  res.json(rows.map(serialize));
});

module.exports = router;
