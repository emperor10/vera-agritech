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
  databaseFile: path.isAbsolute(process.env.DATABASE_FILE || '')
    ? process.env.DATABASE_FILE
    : path.join(rootDir, process.env.DATABASE_FILE || './data/vera.sqlite3'),
  uploadsDir: path.isAbsolute(process.env.UPLOADS_DIR || '')
    ? process.env.UPLOADS_DIR
    : path.join(rootDir, process.env.UPLOADS_DIR || './uploads'),
  rootDir,
  loginRateLimitMax: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '10', 10),
  formRateLimitMax: parseInt(process.env.FORM_RATE_LIMIT_MAX || '20', 10),
};
