const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { safeJsonParse } = require('../db/helpers');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.get('/admin/settings', requireAuth, async (_req, res) => {
  const row = await db.prepare('SELECT value FROM settings WHERE key = ?').get('site');
  res.json(safeJsonParse(row?.value, {}));
});

router.put(
  '/admin/settings',
  requireAuth,
  [body().custom((v) => typeof v === 'object' && v !== null)],
  validate,
  async (req, res) => {
    const value = JSON.stringify(req.body);
    const existing = await db.prepare('SELECT key FROM settings WHERE key = ?').get('site');
    if (existing) {
      await db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(value, 'site');
    } else {
      await db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('site', value);
    }
    res.json({ success: true });
  }
);

module.exports = router;
