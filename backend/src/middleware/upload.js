const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const env = require('../config/env');

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']);
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

// With IMAGE_STORAGE=local, multer writes the file straight to disk (for a
// host with real persistent storage, e.g. HostAfrica). Otherwise the file is
// held in memory just long enough to stream it up to Cloudinary — nothing
// touches local disk, since that disk is wiped on every restart on hosts
// like Render's free tier. See lib/imageStorage.js for what happens next.
let storage;
if (env.imageStorage === 'local') {
  fs.mkdirSync(env.uploadsDir, { recursive: true });
  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, env.uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeExt = /^\.(jpe?g|png|webp|svg|gif)$/.test(ext) ? ext : '';
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safeExt}`);
    },
  });
} else {
  storage = multer.memoryStorage();
}

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error('Unsupported file type. Please upload a JPG, PNG, WebP, GIF or SVG image.'));
    }
    return cb(null, true);
  },
});

module.exports = { upload };
