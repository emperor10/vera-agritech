const fs = require('fs');
const env = require('./src/config/env');

// Ensure the database exists (idempotent). On a fresh HostAfrica deployment
// this means `npm run setup` should already have been run once — this guard
// simply prevents a crash if it was forgotten, by running the migration.
require('./src/db/migrate');
if (!fs.existsSync(env.databaseFile)) {
  console.warn('Database file was not found even after migration attempt — check DATABASE_FILE path/permissions.');
}

const app = require('./src/app');

app.listen(env.port, () => {
  console.log(`Vera AgriTech API listening on port ${env.port} [${env.nodeEnv}]`);
  console.log(`CORS allowed origins: ${env.corsOrigin.join(', ')}`);
});
