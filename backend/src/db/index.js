const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');
const env = require('../config/env');

// If we're using a local file database (local dev), make sure its folder exists.
if (env.databaseUrl.startsWith('file:')) {
  const filePath = env.databaseUrl.slice('file:'.length);
  fs.mkdirSync(path.dirname(path.resolve(env.rootDir, filePath)), { recursive: true });
}

const client = createClient({
  url: env.databaseUrl,
  authToken: env.databaseAuthToken,
});

// Best-effort: not every libSQL backend (e.g. a remote Turso database)
// supports every pragma the same way a local SQLite file does, so this
// never blocks startup if a pragma is rejected.
async function applyPragmas() {
  for (const pragma of ['PRAGMA journal_mode = WAL', 'PRAGMA foreign_keys = ON']) {
    try {
      await client.execute(pragma);
    } catch {
      // Non-fatal — safe to ignore on backends that don't support it.
    }
  }
}
const ready = applyPragmas();

// Turns a single positional/named-args call (matching how this codebase
// already calls db.prepare(sql).get/all/run(...), i.e. exactly like
// better-sqlite3) into the { sql, args } shape @libsql/client expects.
function normalizeArgs(args) {
  if (args.length === 1 && args[0] !== null && typeof args[0] === 'object' && !Array.isArray(args[0])) {
    return args[0]; // named params object, paired with @name/:name in the SQL
  }
  return args; // positional array, paired with ? placeholders in the SQL
}

// BigInt (used by libSQL for rowid/changes) can't be JSON.stringify'd
// directly, so every shim result converts it to a plain Number up front.
function toRow(row) {
  if (!row) return row;
  const plain = {};
  for (const key of Object.keys(row)) {
    const value = row[key];
    plain[key] = typeof value === 'bigint' ? Number(value) : value;
  }
  return plain;
}

// A drop-in-shaped replacement for better-sqlite3's synchronous
// db.prepare(sql).get/all/run(...) API, backed by the async libSQL client.
// Every call site in this codebase already awaits these (routes are async),
// so the only behavioural difference is that these return Promises.
function prepare(sql) {
  return {
    async get(...args) {
      await ready;
      const rs = await client.execute({ sql, args: normalizeArgs(args) });
      return toRow(rs.rows[0]);
    },
    async all(...args) {
      await ready;
      const rs = await client.execute({ sql, args: normalizeArgs(args) });
      return rs.rows.map(toRow);
    },
    async run(...args) {
      await ready;
      const rs = await client.execute({ sql, args: normalizeArgs(args) });
      return {
        lastInsertRowid: rs.lastInsertRowid === undefined ? undefined : Number(rs.lastInsertRowid),
        changes: rs.rowsAffected,
      };
    },
  };
}

// Runs several statements as a single all-or-nothing transaction. Unlike
// better-sqlite3's db.transaction(fn), this takes an array of { sql, args }
// statement descriptors up front (libSQL batches can't run arbitrary JS
// in between statements) — see db/seed.js for the usage pattern.
async function batch(statements) {
  await ready;
  if (statements.length === 0) return;
  await client.batch(
    statements.map((s) => ({ sql: s.sql, args: normalizeArgs(s.args || []) })),
    'write'
  );
}

// Runs multiple ;-separated DDL statements in one go (used by migrate.js).
async function execMultiple(sql) {
  await ready;
  await client.executeMultiple(sql);
}

module.exports = { prepare, batch, execMultiple, ready, raw: client };
