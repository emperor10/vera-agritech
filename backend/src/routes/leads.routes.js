const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { formLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

// Public: contact / enquiry form submission.
router.post(
  '/leads',
  formLimiter,
  [
    body('name').isString().trim().isLength({ min: 2, max: 120 }).withMessage('Please enter your full name.'),
    body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
    body('phone').optional({ checkFalsy: true }).isString().trim().isLength({ max: 40 }),
    body('message').optional({ checkFalsy: true }).isString().trim().isLength({ max: 4000 }),
    body('interest').optional({ checkFalsy: true }).isString().trim().isLength({ max: 200 }),
    body('sourcePage').optional({ checkFalsy: true }).isString().trim().isLength({ max: 200 }),
    // Honeypot field — real users never fill this in.
    body('company_website').optional().isString().isLength({ max: 0 }).withMessage('Spam detected.'),
  ],
  validate,
  (req, res) => {
    const { name, email, phone = '', message = '', interest = '', sourcePage = '' } = req.body;
    db.prepare(
      'INSERT INTO leads (name, email, phone, message, source_page, interest) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(name, email, phone, message, sourcePage, interest);
    res.status(201).json({ success: true, message: 'Thank you — the Vera AgriTech team will be in touch shortly.' });
  }
);

router.get('/admin/leads', requireAuth, (req, res) => {
  const status = req.query.status;
  const rows = status
    ? db.prepare('SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC').all(status)
    : db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  res.json(rows);
});

router.patch('/admin/leads/:id', requireAuth, [body('status').isString().notEmpty()], validate, (req, res) => {
  db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
  res.json({ success: true });
});

router.delete('/admin/leads/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
