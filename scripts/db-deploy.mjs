#!/usr/bin/env node
/**
 * Resilient database deployment for Vercel builds and CI.
 *
 * Strategy:
 *   1. If DATABASE_URL is missing -> log a warning and exit 0 (build must not fail on preview envs).
 *   2. Try `prisma migrate deploy` (uses prisma/migrations history, incl. 000_init baseline).
 *   3. If migrate deploy fails (e.g. no migration history on the target, drift) ->
 *      fall back to `prisma db push --accept-data-loss` so the schema still lands.
 *   4. Only exits non-zero when DB_DEPLOY_STRICT=true, otherwise warns and lets the build continue.
 *
 * Usage:
 *   node scripts/db-deploy.mjs            # deploy (migrate -> push fallback)
 *   DB_DEPLOY_STRICT=true node scripts/db-deploy.mjs   # fail hard on error (CI)
 *   node scripts/db-deploy.mjs --push-only              # skip migrations, only db push
 *   node scripts/db-deploy.mjs --migrate-only           # skip fallback, only migrate deploy
 */
import { execSync } from 'node:child_process';

const args = new Set(process.argv.slice(2));
const strict = process.env.DB_DEPLOY_STRICT === 'true';
const pushOnly = args.has('--push-only');
const migrateOnly = args.has('--migrate-only');

function run(cmd, label) {
  console.log(`\n[db-deploy] ${label}: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function failOrWarn(message) {
  if (strict) {
    console.error(`[db-deploy] ERROR: ${message}`);
    process.exit(1);
  }
  console.warn(`[db-deploy] WARNING: ${message} Continuing build without failing.`);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  failOrWarn('DATABASE_URL is not set. Skipping database deployment.');
  process.exit(0);
}

try {
  if (!pushOnly) {
    try {
      run('npx prisma migrate deploy', 'Applying Prisma migrations');
      console.log('\n[db-deploy] Migrations applied successfully.');
      process.exit(0);
    } catch (migrateError) {
      console.warn(`[db-deploy] 'prisma migrate deploy' failed: ${migrateError.message}`);
      if (migrateOnly) throw migrateError;
      console.log('[db-deploy] Falling back to `prisma db push`...');
    }
  }
  run('npx prisma db push --accept-data-loss', 'Pushing schema directly (fallback)');
  console.log('\n[db-deploy] Schema pushed successfully (fallback path).');
} catch (error) {
  failOrWarn(`Database deployment failed: ${error.message}`);
}
