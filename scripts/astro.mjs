import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

// Keep the demo self-contained: no CLI telemetry or user-level configuration writes.
process.env.ASTRO_TELEMETRY_DISABLED = '1';
const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 22 || (major === 22 && minor < 19)) {
  // Codex on this Windows workstation includes a current Node runtime. Reuse it
  // without changing the user's PATH or installing a second project dependency.
  let runtime;
  try {
    const candidate = readFileSync(join(process.cwd(), '.node-runtime'), 'utf8').trim();
    if (existsSync(candidate)) runtime = candidate;
  } catch {
    /* Outside Codex, use a current Node installation. */
  }
  if (!runtime) {
    console.error('Use Node.js 22.19+ or Node.js 24 LTS to run this project.');
    process.exit(1);
  }
  const result = spawnSync(runtime, [process.argv[1], ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: process.env,
  });
  process.exit(result.status ?? 1);
}
await import('../node_modules/astro/astro.js');
