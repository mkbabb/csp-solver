#!/usr/bin/env node
// T4-W2 — the golden bloat guard (FAM-15 / EVIDENCE-POLICY B1).
//
// A committed-screenshot golden system is exactly how a PNG estate balloons — the
// tranche opened at 70 MB of hoarded full-viewport captures (EVIDENCE-POLICY.md).
// This gate makes the small-crop discipline a *gate*, not a convention: it greps
// the committed goldens dir, sums bytes, and FAILS if any single image breaches the
// per-image ceiling. A golden that can't clear the ceiling is capturing too much
// frame (recrop to the asserted surface) — never raise the cap.
//
// Ceiling = 150 KB/image (EVIDENCE-POLICY per-image cap). Goldens are small crops of
// one asserted surface (a cell, the logo, the toggle crest, a grid corner) at DPR2,
// which clear this with room. Run: `node scripts/check-golden-bytes.mjs`.

import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const FRONTEND_ROOT = fileURLToPath(new URL('..', import.meta.url));
const GOLDENS_DIR = join(FRONTEND_ROOT, 'e2e', 'goldens');
const PER_IMAGE_CEILING = 150 * 1024; // 150 KB — EVIDENCE-POLICY per-image cap.

/** Recursively collect every *.png under a dir (goldens may be nested per-platform). */
function collectPngs(dir) {
  let out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return out; // dir absent → no goldens yet
    throw err;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(collectPngs(p));
    else if (e.isFile() && e.name.endsWith('.png')) out.push(p);
  }
  return out;
}

const pngs = collectPngs(GOLDENS_DIR).sort();

if (pngs.length === 0) {
  // No goldens is not a pass to celebrate — flag it so a wiped/gitignored goldens
  // dir doesn't read as a green bloat-guard. Exit 0 (nothing to police) but say so.
  console.log(
    `[golden-bytes] no *.png under ${relative(FRONTEND_ROOT, GOLDENS_DIR)} — nothing to police.\n` +
      `  (Capture with: npm run test:golden:update)`,
  );
  process.exit(0);
}

let totalBytes = 0;
const breaches = [];
const rows = [];
for (const p of pngs) {
  const bytes = statSync(p).size;
  totalBytes += bytes;
  const rel = relative(FRONTEND_ROOT, p);
  const kb = (bytes / 1024).toFixed(1);
  rows.push(`  ${bytes > PER_IMAGE_CEILING ? 'FAIL' : 'ok  '}  ${kb.padStart(7)} KB  ${rel}`);
  if (bytes > PER_IMAGE_CEILING) breaches.push({ rel, bytes });
}

console.log(
  `[golden-bytes] ${pngs.length} golden(s), ${(totalBytes / 1024).toFixed(1)} KB total; ` +
    `per-image ceiling ${(PER_IMAGE_CEILING / 1024).toFixed(0)} KB`,
);
for (const r of rows) console.log(r);

if (breaches.length > 0) {
  console.error(
    `\n[golden-bytes] FAIL — ${breaches.length} golden(s) exceed the ${(
      PER_IMAGE_CEILING / 1024
    ).toFixed(0)} KB per-image ceiling:`,
  );
  for (const b of breaches) {
    console.error(`  ${(b.bytes / 1024).toFixed(1)} KB  ${b.rel}`);
  }
  console.error(
    `\nRecrop to the asserted surface (a cell/logo/toggle/grid-corner), do NOT raise the cap.`,
  );
  process.exit(1);
}

console.log(`[golden-bytes] PASS — every golden within the per-image ceiling.`);
process.exit(0);
