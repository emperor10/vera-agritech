const express = require('express');
const { body } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { upload } = require('../middleware/upload');
const imageStorage = require('../lib/imageStorage');

const router = express.Router();

router.get('/admin/images', requireAuth, async (_req, res) => {
  res.json(await db.prepare('SELECT * FROM images ORDER BY key ASC').all());
});

// Upload a file (to local disk or Cloudinary, depending on IMAGE_STORAGE —
// see lib/imageStorage.js) and attach it to a registered image key
// (creates the key if new).
router.post('/admin/images/upload', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const key = (req.body.key || `upload-${Date.now()}`).toString();
    const altText = req.body.altText || '';

    const { url, ref } = await imageStorage.saveUpload(req.file, key);

    const existing = await db.prepare('SELECT id, cloudinary_public_id FROM images WHERE key = ?').get(key);
    if (existing) {
      // Clean up whatever was previously stored for this key (an old local
      // file, or an old Cloudinary asset) now that it's been replaced.
      if (existing.cloudinary_public_id && existing.cloudinary_public_id !== ref) {
        await imageStorage.removeUpload(existing.cloudinary_public_id);
      }
      await db
        .prepare(
          "UPDATE images SET url=?, alt_text=?, original_name=?, cloudinary_public_id=?, updated_at=datetime('now') WHERE key=?"
        )
        .run(url, altText, req.file.originalname, ref, key);
    } else {
      await db
        .prepare(
          "INSERT INTO images (key, url, alt_text, original_name, cloudinary_public_id, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'))"
        )
        .run(key, url, altText, req.file.originalname, ref);
    }

    res.status(201).json({ key, url, altText });
  } catch (err) {
    next(err);
  }
});

router.put(
  '/admin/images/:key',
  requireAuth,
  [body('altText').optional().isString()],
  validate,
  async (req, res) => {
    const { altText, url } = req.body;
    const existing = await db.prepare('SELECT id FROM images WHERE key = ?').get(req.params.key);
    if (!existing) {
      await db.prepare("INSERT INTO images (key, url, alt_text, updated_at) VALUES (?, ?, ?, datetime('now'))").run(
        req.params.key,
        url || null,
        altText || ''
      );
      return res.status(201).json({ success: true });
    }
    await db.prepare("UPDATE images SET alt_text = COALESCE(?, alt_text), url = COALESCE(?, url), updated_at=datetime('now') WHERE key = ?").run(
      altText,
      url,
      req.params.key
    );
    return res.json({ success: true });
  }
);

// Delete a registered image key entirely (both the database row and, if it
// was an uploaded file rather than an external URL, the underlying asset —
// on local disk or Cloudinary, whichever IMAGE_STORAGE is active). Pages
// that still reference this key will simply fall back to showing the
// "Image placeholder" state again — deleting a key never breaks a page.
router.delete('/admin/images/:key', requireAuth, async (req, res) => {
  const row = await db.prepare('SELECT cloudinary_public_id FROM images WHERE key = ?').get(req.params.key);

  await db.prepare('DELETE FROM images WHERE key = ?').run(req.params.key);

  if (row?.cloudinary_public_id) {
    await imageStorage.removeUpload(row.cloudinary_public_id);
  }

  res.json({ success: true });
});

module.exports = router;
