/**
 * Directly resets (or creates) an admin account's password in the
 * database — a safety valve for when the admin login password stops
 * working and it's unclear why (forgotten a password set via the admin
 * panel's "Change Password" feature, or a mismatch between what's in
 * .env's DEFAULT_ADMIN_PASSWORD and what's actually stored in the
 * database).
 *
 * IMPORTANT GOTCHA this script exists to work around: DEFAULT_ADMIN_EMAIL /
 * DEFAULT_ADMIN_PASSWORD in .env are ONLY used the very first time the
 * database is seeded (db/seed.js's seedAdmin() skips creating an admin if
 * one already exists for that email). Editing .env after that first run
 * does NOT change the password already stored in the database — so typing
 * in whatever is currently in .env will not work if the account was
 * created earlier with a different password.
 *
 * Usage:
 *   node src/db/reset-admin-password.js <email> <newPassword>
 *   npm run db:reset-admin-password -- <email> <newPassword>
 *
 * Safe to run any time the server is stopped or running — it writes
 * directly to the database.
 */
const bcrypt = require('bcryptjs');
const db = require('./index');
const env = require('../config/env');

async function main() {
  const [, , emailArg, newPassword] = process.argv;
  const email = (emailArg || env.defaultAdmin.email).toLowerCase();

  if (!newPassword) {
    console.error('Usage: node src/db/reset-admin-password.js <email> <newPassword>');
    console.error(`Example: node src/db/reset-admin-password.js ${env.defaultAdmin.email} MyNewPassword123`);
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  const hash = bcrypt.hashSync(newPassword, 12);
  const existing = await db.prepare('SELECT id FROM admins WHERE email = ?').get(email);

  if (existing) {
    await db.prepare('UPDATE admins SET password_hash = ? WHERE email = ?').run(hash, email);
    console.log(`Password reset for existing admin: ${email}`);
  } else {
    await db.prepare('INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)').run(
      env.defaultAdmin.name,
      email,
      hash
    );
    console.log(`No admin existed for ${email} — created a new admin account with the given password.`);
  }

  console.log('You can log in immediately with the new password — no server restart needed.');
}

main().catch((err) => {
  console.error('Failed to reset admin password:', err);
  process.exit(1);
});
