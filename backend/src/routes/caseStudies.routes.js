const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { safeJsonParse } = require('../db/helpers');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

function serialize(row) {
  return { ...row, stats: safeJsonParse(row.stats_json, []), stats_json: undefined };
}

router.get('/admin/case-studies', requireAuth, (_req, res) => {
  res.json(db.prepare('SELECT * FROM case_studies ORDER BY sort_order ASC').all().map(serialize));
});

router.post(
  '/admin/case-studies',
  requireAuth,
  [body('title').isString().trim().notEmpty()],
  validate,
  (req, res) => {
    const { title, summary = '', stats = [], imageKey = '', sortOrder = 0, isPublished = 1 } = req.body;
    const info = db
      .prepare('INSERT INTO case_studies (title, summary, stats_json, image_key, sort_order, is_published) VALUES (?, ?, ?, ?, ?, ?)')
      .run(title, summary, JSON.stringify(stats), imageKey, sortOrder, isPublished ? 1 : 0);
    res.status(201).json({ id: info.lastInsertRowid });
  }
);

router.put(
  '/admin/case-studies/:id',
  requireAuth,
  [body('title').isString().trim().notEmpty()],
  validate,
  (req, res) => {
    const { title, summary = '', stats = [], imageKey = '', sortOrder = 0, isPublished = 1 } = req.body;
    db.prepare(
      'UPDATE case_studies SET title=?, summary=?, stats_json=?, image_key=?, sort_order=?, is_published=? WHERE id=?'
    ).run(title, summary, JSON.stringify(stats), imageKey, sortOrder, isPublished ? 1 : 0, req.params.id);
    res.json({ success: true });
  }
);

router.delete('/admin/case-studies/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM case_studies WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
