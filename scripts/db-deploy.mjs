#!/usr/bin/env node
/**
 * Resilient database deployment for Vercel builds and CI.
 *
 * Strategy:
 *   1. If DATABASE_URL is missing -> log a warning and exit 0 (build must not fail on preview envs).
 *   2. Ensure DIRECT_URL is resolvable: schema.prisma declares `directUrl = env("DIRECT_URL")`,
 *      so migrate/db push use the direct (session-capable) endpoint while the runtime Prisma
 *      Client uses DATABASE_URL. If a deployment defines no separate direct endpoint, we fall
 *      back to DIRECT_URL=DATABASE_URL for the child process only (valid when there is no pooler).
 *   3. Try `prisma migrate deploy` (uses prisma/migrations history, incl. 000_init baseline).
 *   4. If migrate deploy fails (e.g. no migration history on the target, drift) ->
 *      fall back to `prisma db push --accept-data-loss` so the schema still lands.
 *   5. Only exits non-zero when DB_DEPLOY_STRICT=true, otherwise warns and lets the build continue.
 *
 * Usage:
 *   node scripts/db-deploy.mjs            # deploy (migrate -> push fallback)
 *   DB_DEPLOY_STRICT=true node scripts/db-deploy.mjs   # fail hard on error (CI)
 *   node scripts/db-deploy.mjs --push-only              # skip migrations, only db push
 *   node scripts/db-deploy.mjs --migrate-only           # skip fallback, only migrate deploy
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Load repo-root .env if present, without overriding vars already set by the
 * build/CI environment (dotenv semantics). Without this, running the script
 * locally with vars only in .env silently skips deployment, while Vercel —
 * which injects env vars into the process — deploys.
 */
function loadDotEnv() {
  const file = fileURLToPath(new URL('../.env', import.meta.url));
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match) continue; // comments, blanks, exports
    let value = match[2];
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
      (value.startsWith("'") && value.endsWith("'") && value.length > 1)
    ) {
      value = value.slice(1, -1);
    }
    if (!(match[1] in process.env)) process.env[match[1]] = value;
  }
}

loadDotEnv();

const args = new Set(process.argv.slice(2));
const strict = process.env.DB_DEPLOY_STRICT === 'true';
const pushOnly = args.has('--push-only');
const migrateOnly = args.has('--migrate-only');

function run(cmd, label) {
  console.log(`\n[db-deploy] ${label}: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: childEnv });
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

// Migrations resolve DIRECT_URL via schema.prisma `directUrl`. Only fall back
// to DATABASE_URL when no direct endpoint is configured (e.g. unpooled local
// Postgres) so a DATABASE_URL-only deployment still migrates.
const childEnv = { ...process.env };
if (!childEnv.DIRECT_URL) {
  childEnv.DIRECT_URL = databaseUrl;
  console.log(
    '[db-deploy] DIRECT_URL not set — using DATABASE_URL for migrations (no separate direct endpoint configured).'
  );
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
