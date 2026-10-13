const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { formLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

const STATUSES = ['new', 'contacted', 'confirmed', 'fulfilled', 'cancelled'];

// Public: order request from the product detail panel on /products. This is an
// order *request* (no payment is taken online) — the team confirms price,
// availability and delivery with the customer, then moves it through the
// statuses in Admin → Product Orders. The product name/price/unit are
// snapshotted from the products table (never trusted from the client) so the
// order still reads correctly if the product is edited or removed later.
router.post(
  '/product-orders',
  formLimiter,
  [
    body('productId').isInt({ min: 1 }).withMessage('Please choose a product.'),
    body('quantity').isString().trim().isLength({ min: 1, max: 60 }).withMessage('Please enter the quantity you need.'),
    body('fullName').isString().trim().isLength({ min: 2, max: 120 }).withMessage('Please enter your full name.'),
    body('phone').isString().trim().isLength({ min: 6, max: 40 }).withMessage('Please enter a valid phone number.'),
    body('email')
      .optional({ checkFalsy: true })
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('deliveryLocation')
      .isString()
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('Please tell us where to deliver.'),
    body('notes').optional({ checkFalsy: true }).isString().trim().isLength({ max: 2000 }),
    // Honeypot field — real customers never fill this in.
    body('company_website').optional().isString().isLength({ max: 0 }).withMessage('Spam detected.'),
  ],
  validate,
  async (req, res) => {
    const { productId, quantity, fullName, phone, email = '', deliveryLocation, notes = '' } = req.body;

    const product = await db.prepare('SELECT * FROM products WHERE id = ? AND is_published = 1').get(productId);
    if (!product) {
      return res.status(404).json({ error: 'Sorry, that product is no longer available.' });
    }

    const info = await db
      .prepare(
        `INSERT INTO product_orders
          (product_id, product_name, product_category, unit_price, unit, quantity, full_name, phone, email,
           delivery_location, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        product.id,
        product.name,
        product.category,
        product.price || '',
        product.unit || '',
        quantity,
        fullName,
        phone,
        email,
        deliveryLocation,
        notes
      );

    // Reference derived from the row id — unique with no counter table, e.g.
    // the 12th order in 2026 becomes "VRA-ORD-2026-00012".
    const id = info.lastInsertRowid;
    const referenceNo = `VRA-ORD-${new Date().getFullYear()}-${String(id).padStart(5, '0')}`;
    await db.prepare('UPDATE product_orders SET reference_no = ? WHERE id = ?').run(referenceNo, id);

    res.status(201).json({
      success: true,
      referenceNo,
      message:
        'Thank you — your order request has been received. Our team will contact you shortly to confirm availability, pricing and delivery. Please keep your reference number.',
    });
  }
);

router.get('/admin/product-orders', requireAuth, async (req, res) => {
  const status = req.query.status;
  const rows = status
    ? await db.prepare('SELECT * FROM product_orders WHERE status = ? ORDER BY created_at DESC, id DESC').all(status)
    : await db.prepare('SELECT * FROM product_orders ORDER BY created_at DESC, id DESC').all();
  res.json(rows);
});

router.patch(
  '/admin/product-orders/:id',
  requireAuth,
  [body('status').isIn(STATUSES).withMessage('Invalid status.')],
  validate,
  async (req, res) => {
    await db.prepare('UPDATE product_orders SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
    res.json({ success: true });
  }
);

router.delete('/admin/product-orders/:id', requireAuth, async (req, res) => {
  await db.prepare('DELETE FROM product_orders WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
