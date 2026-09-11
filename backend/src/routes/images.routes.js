const fs = require('fs');
const path = require('path');
const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const env = require('../config/env');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.get('/admin/images', requireAuth, (_req, res) => {
  res.json(db.prepare('SELECT * FROM images ORDER BY key ASC').all());
});

// Upload a file and attach it to a registered image key (creates the key if new).
router.post('/admin/images/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  const key = (req.body.key || req.file.filename).toString();
  const altText = req.body.altText || '';
  const url = `${env.appUrl.replace(/\/$/, '')}/uploads/${req.file.filename}`;

  const existing = db.prepare('SELECT id FROM images WHERE key = ?').get(key);
  if (existing) {
    db.prepare("UPDATE images SET url=?, alt_text=?, original_name=?, updated_at=datetime('now') WHERE key=?").run(
      url,
      altText,
      req.file.originalname,
      key
    );
  } else {
    db.prepare(
      "INSERT INTO images (key, url, alt_text, original_name, updated_at) VALUES (?, ?, ?, ?, datetime('now'))"
    ).run(key, url, altText, req.file.originalname);
  }

  res.status(201).json({ key, url, altText });
});

router.put(
  '/admin/images/:key',
  requireAuth,
  [body('altText').optional().isString()],
  validate,
  (req, res) => {
    const { altText, url } = req.body;
    const existing = db.prepare('SELECT id FROM images WHERE key = ?').get(req.params.key);
    if (!existing) {
      db.prepare("INSERT INTO images (key, url, alt_text, updated_at) VALUES (?, ?, ?, datetime('now'))").run(
        req.params.key,
        url || null,
        altText || ''
      );
      return res.status(201).json({ success: true });
    }
    db.prepare("UPDATE images SET alt_text = COALESCE(?, alt_text), url = COALESCE(?, url), updated_at=datetime('now') WHERE key = ?").run(
      altText,
      url,
      req.params.key
    );
    return res.json({ success: true });
  }
);

// Delete a registered image key entirely (both the database row and, if it
// was an uploaded file rather than an external URL, the file on disk).
// Pages that still reference this key will simply fall back to showing the
// "Image placeholder" state again — deleting a key never breaks a page.
router.delete('/admin/images/:key', requireAuth, (req, res) => {
  const row = db.prepare('SELECT url FROM images WHERE key = ?').get(req.params.key);

  db.prepare('DELETE FROM images WHERE key = ?').run(req.params.key);

  if (row?.url) {
    try {
      const uploadsBase = `${env.appUrl.replace(/\/$/, '')}/uploads/`;
      if (row.url.startsWith(uploadsBase)) {
        const filename = row.url.slice(uploadsBase.length);
        const filePath = path.join(env.uploadsDir, filename);
        if (filePath.startsWith(env.uploadsDir) && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch {
      // Non-fatal: the database row is already gone, which is what matters
      // for the site — an orphaned file on disk can be cleaned up later.
    }
  }

  res.json({ success: true });
});

module.exports = router;
