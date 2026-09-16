const env = require('./src/config/env');
const migrate = require('./src/db/migrate');

async function main() {
  // Ensure the schema exists (idempotent). Normally `npm run setup` has
  // already been run once before the app starts — this guard simply
  // prevents a crash if that step was ever forgotten.
  await migrate();

  const app = require('./src/app');

  app.listen(env.port, () => {
    console.log(`Vera AgriTech API listening on port ${env.port} [${env.nodeEnv}]`);
    console.log(`CORS allowed origins: ${env.corsOrigin.join(', ')}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
