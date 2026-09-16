/**
 * One-off migration for local dev databases created before the hero
 * carousel redesign.
 *
 * `npm run db:seed` intentionally never overwrites a content_blocks row
 * that already exists (INSERT OR IGNORE) — that's what protects any real
 * edits made from the admin panel from being clobbered by a re-seed. The
 * side effect: a database seeded before this redesign still has the old
 * "home" JSON shape (no `hero.slides` array), and the new frontend
 * HeroCarousel component was reading `home.hero.slides` unconditionally,
 * which crashed the whole page (blank/white screen) with no error
 * boundary to catch it.
 *
 * This script patches ONLY the `hero` key of the existing "home" row to
 * the new shape (heading/ctaPrimary/ctaSecondary/slides) and leaves every
 * other section of the home page (about, testimonials, stats, comparison,
 * etc.) exactly as it is in the database — so any admin-panel edits to
 * those sections are preserved.
 *
 * Safe to run more than once.
 */
const db = require('./index');
const content = require('../seed/content.json');

async function main() {
  const row = await db.prepare('SELECT value FROM content_blocks WHERE page = ?').get('home');

  if (!row) {
    console.error('No "home" content_blocks row found. Run `npm run setup` first, then re-run this script.');
    process.exit(1);
  }

  const current = JSON.parse(row.value);
  current.hero = content.home.hero;

  await db.prepare('UPDATE content_blocks SET value = ?, updated_at = ? WHERE page = ?').run(
    JSON.stringify(current),
    new Date().toISOString(),
    'home'
  );

  console.log('Updated the "home" page\'s hero section to the new carousel format (heading, CTAs, slides).');
  console.log('Every other section of the home page was left untouched.');
}

main().catch((err) => {
  console.error('Failed to update hero content:', err);
  process.exit(1);
});
