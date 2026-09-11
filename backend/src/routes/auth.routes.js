const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const db = require('../db');
const env = require('../config/env');
const { validate } = require('../middleware/validate');
const { loginLimiter } = require('../middleware/rateLimiters');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
    body('password').isString().isLength({ min: 1 }).withMessage('Password is required.'),
  ],
  validate,
  (req, res) => {
    const { email, password } = req.body;
    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email.toLowerCase());

    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { sub: admin.id, email: admin.email, name: admin.name },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    db.prepare('UPDATE admins SET last_login_at = datetime(\'now\') WHERE id = ?').run(admin.id);

    return res.json({
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    });
  }
);

router.get('/me', requireAuth, (req, res) => {
  const admin = db.prepare('SELECT id, name, email, last_login_at FROM admins WHERE id = ?').get(req.admin.sub);
  if (!admin) return res.status(404).json({ error: 'Admin not found.' });
  return res.json(admin);
});

router.post(
  '/change-password',
  requireAuth,
  [
    body('currentPassword').isString().notEmpty(),
    body('newPassword').isString().isLength({ min: 8 }).withMessage('New password must be at least 8 characters.'),
  ],
  validate,
  (req, res) => {
    const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.admin.sub);
    if (!admin) return res.status(404).json({ error: 'Admin not found.' });

    if (!bcrypt.compareSync(req.body.currentPassword, admin.password_hash)) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const hash = bcrypt.hashSync(req.body.newPassword, 12);
    db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(hash, admin.id);
    return res.json({ success: true });
  }
);

module.exports = router;
