const path = require('path');
require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const rootDir = path.resolve(__dirname, '..', '..');

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  appUrl: process.env.APP_URL || 'http://localhost:4000',
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  jwtSecret: required('JWT_SECRET', 'dev-only-insecure-secret-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  defaultAdmin: {
    name: process.env.DEFAULT_ADMIN_NAME || 'Vera AgriTech Admin',
    email: (process.env.DEFAULT_ADMIN_EMAIL || 'admin@veraagritech.com').toLowerCase(),
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'ChangeMe123!',
  },
  // Database connection (libSQL). Two supported shapes:
  //  - Local file, for local development — no network, no account needed:
  //      DATABASE_URL=file:./data/vera.sqlite3
  //  - Remote Turso database, for deployed environments (e.g. Render):
  //      DATABASE_URL=libsql://<your-db-name>-<your-org>.turso.io
  //      DATABASE_AUTH_TOKEN=<token from `turso db tokens create`>
  // DATABASE_AUTH_TOKEN is not needed (and ignored) for a local file: URL.
  databaseUrl: (() => {
    const raw = process.env.DATABASE_URL || './data/vera.sqlite3';
    if (/^(libsql|https?|wss?|file):/.test(raw)) return raw;
    // Plain path given (old-style DATABASE_FILE value) — treat as a local file.
    const abs = path.isAbsolute(raw) ? raw : path.join(rootDir, raw);
    return `file:${abs}`;
  })(),
  databaseAuthToken: process.env.DATABASE_AUTH_TOKEN || undefined,

  // Where uploaded images live. Two supported drivers:
  //  - 'local'      — saved to disk under uploadsDir, served at /uploads.
  //                   Only safe on a host with a real persistent disk (e.g.
  //                   HostAfrica). Wiped on restart on hosts like Render's
  //                   free tier — do not use IMAGE_STORAGE=local there.
  //  - 'cloudinary' — uploaded to a free Cloudinary account, so images
  //                   survive restarts/redeploys even on an ephemeral
  //                   filesystem.
  // Defaults to 'cloudinary' if Cloudinary credentials are present, else
  // 'local' — but it's best to set IMAGE_STORAGE explicitly in production.
  imageStorage: process.env.IMAGE_STORAGE || (process.env.CLOUDINARY_CLOUD_NAME ? 'cloudinary' : 'local'),

  uploadsDir: path.isAbsolute(process.env.UPLOADS_DIR || '')
    ? process.env.UPLOADS_DIR
    : path.join(rootDir, process.env.UPLOADS_DIR || './uploads'),

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    // Images are grouped under this folder in your Cloudinary media library.
    folder: process.env.CLOUDINARY_FOLDER || 'vera-agritech',
  },

  rootDir,
  loginRateLimitMax: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '10', 10),
  formRateLimitMax: parseInt(process.env.FORM_RATE_LIMIT_MAX || '20', 10),
};
