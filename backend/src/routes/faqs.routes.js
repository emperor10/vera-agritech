const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.get('/admin/faqs', requireAuth, (_req, res) => {
  res.json(db.prepare('SELECT * FROM faqs ORDER BY sort_order ASC').all());
});

router.post(
  '/admin/faqs',
  requireAuth,
  [body('question').isString().trim().notEmpty(), body('answer').isString().trim().notEmpty()],
  validate,
  (req, res) => {
    const { question, answer, sortOrder = 0, isPublished = 1 } = req.body;
    const info = db
      .prepare('INSERT INTO faqs (question, answer, sort_order, is_published) VALUES (?, ?, ?, ?)')
      .run(question, answer, sortOrder, isPublished ? 1 : 0);
    res.status(201).json({ id: info.lastInsertRowid });
  }
);

router.put(
  '/admin/faqs/:id',
  requireAuth,
  [body('question').isString().trim().notEmpty(), body('answer').isString().trim().notEmpty()],
  validate,
  (req, res) => {
    const { question, answer, sortOrder = 0, isPublished = 1 } = req.body;
    db.prepare('UPDATE faqs SET question = ?, answer = ?, sort_order = ?, is_published = ? WHERE id = ?').run(
      question,
      answer,
      sortOrder,
      isPublished ? 1 : 0,
      req.params.id
    );
    res.json({ success: true });
  }
);

router.delete('/admin/faqs/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM faqs WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
