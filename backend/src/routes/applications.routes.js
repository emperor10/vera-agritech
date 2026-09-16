const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { formLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

// Public: "Get Started / Apply" expression-of-interest form.
router.post(
  '/applications',
  formLimiter,
  [
    body('name').isString().trim().isLength({ min: 2, max: 120 }).withMessage('Please enter your full name.'),
    body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
    body('phone').isString().trim().isLength({ min: 6, max: 40 }).withMessage('Please enter a valid phone number.'),
    body('location').optional({ checkFalsy: true }).isString().trim().isLength({ max: 200 }),
    body('packageInterest').optional({ checkFalsy: true }).isString().trim().isLength({ max: 120 }),
    body('financingInterest').optional({ checkFalsy: true }).isString().trim().isLength({ max: 120 }),
    body('message').optional({ checkFalsy: true }).isString().trim().isLength({ max: 4000 }),
    body('company_website').optional().isString().isLength({ max: 0 }).withMessage('Spam detected.'),
  ],
  validate,
  async (req, res) => {
    const {
      name,
      email,
      phone,
      location = '',
      packageInterest = '',
      financingInterest = '',
      message = '',
    } = req.body;
    await db.prepare(
      'INSERT INTO applications (name, email, phone, location, package_interest, financing_interest, message) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(name, email, phone, location, packageInterest, financingInterest, message);
    res.status(201).json({
      success: true,
      message: 'Thank you for applying. A member of the Vera AgriTech team will contact you to continue your onboarding.',
    });
  }
);

router.get('/admin/applications', requireAuth, async (req, res) => {
  const status = req.query.status;
  const rows = status
    ? await db.prepare('SELECT * FROM applications WHERE status = ? ORDER BY created_at DESC').all(status)
    : await db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all();
  res.json(rows);
});

router.patch('/admin/applications/:id', requireAuth, [body('status').isString().notEmpty()], validate, async (req, res) => {
  await db.prepare('UPDATE applications SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
  res.json({ success: true });
});

router.delete('/admin/applications/:id', requireAuth, async (req, res) => {
  await db.prepare('DELETE FROM applications WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
