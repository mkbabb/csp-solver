#!/usr/bin/env node
// NOT-A-LANE: it ran inside the e2e job's built-dist steps, and the browser-executing CI lanes were removed on the owner's ruling of 2026-08-03 — the golden estate is a local instrument now, this cap enforced beside it at mint time; see docs/tranches/2026-08-tranche-7/DISPOSITIONS.md (row O-12).
// T4-W2 — the golden bloat guard (FAM-15 / EVIDENCE-POLICY B1).
// T5-W1.13 — hardened per r3/goldens-estate: the guard now polices the failure modes
// that HAVE occurred, not only the one that never has.
//
// A committed-screenshot golden system is exactly how a PNG estate balloons — the
// tranche opened at 70 MB of hoarded full-viewport captures (EVIDENCE-POLICY.md). The
// original gate greps e2e/goldens, sums bytes, and fails on the per-image ceiling. Two
// holes made that a partial gate (r3/goldens-estate §2):
//
//   B1  it scanned ONE directory, so the four `-webkit-darwin` fossils that a webkit
//       project auto-wrote into `e2e/visual-golden.spec.ts-snapshots/` (242fad7b's
//       testIgnore window) were 31.5 KB of golden-shaped bytes the guard could not see;
//   B2  `totalBytes` was summed, printed, and compared to NOTHING — the estate ceiling
//       is the one EVIDENCE-POLICY number that had no enforcement, and a *total* is the
//       exact shape of the failure the gate was born for.
//
// T7-W6 — two more holes, both ablation-proven:
//
//   B4  a WIPED goldens dir exited 0. `allPngs.length === 0` printed "nothing to police"
//       and returned before the spec scan ever ran, so the estate's own disappearance —
//       four goldens asserted by two specs, zero baselines on disk — read as a green
//       bloat guard. The scan now happens FIRST and an asserted-but-absent estate is the
//       loudest red this file has.
//   B5  the ESTATE TOTAL was doing a count's job by arithmetic. `TOTAL_CEILING` was
//       derived from a "101,341 B" that is 92.5 KB today, so two more cell goldens fit
//       under the band the header calls a ruling — and every crop-tighten re-derives the
//       band downward, which IS the drift mechanism. The COUNT is now pinned at 8 (check
//       7); the byte band stays as a secondary control on what those 8 may weigh.
//
// Eight checks now, all evaluated before the verdict (a run reports every defect it finds,
// never just the first):
//
//   1  PER-IMAGE CEILING   ≤ 150 KB      — EVIDENCE-POLICY per-image cap (unchanged).
//   2  ESTATE TOTAL        ≤ 110 KB      — band derived in TOTAL_CEILING below.
//   3  FOSSILS             zero *.png under e2e/ outside e2e/goldens/.
//   4  DECODE + FLOOR      every golden parses (sig · chunk CRCs · IDAT inflates ·
//                          raw scanline length) and clears a 1 KB blank-capture floor.
//   5  PAIRING + ORPHANS   every golden is {darwin,linux}-complete and asserted by a
//                          spec; every asserted golden has both baselines on disk.
//   6  ENGINE COLLISION    playwright-golden.config.ts may not declare a second engine
//                          while snapshotPathTemplate lacks {projectName} — the precise
//                          mechanism that minted the fossils (r3/goldens-estate §3.6).
//   7  COUNT PIN           exactly GOLDEN_COUNT goldens on disk. A ninth is a ruling by
//                          construction; so is a vanished eighth.
//   8  ESTATE PRESENT      a spec asserting a golden with ZERO baselines on disk reds,
//                          rather than exiting 0 on "nothing to police".
//
// Run: `node scripts/check-golden-bytes.mjs` (npm run test:golden:bytes).
// GOLDEN_CHECK_ROOT=<dir> reroots the scan for CANARY runs only; the banner says so.

import { Buffer } from "node:buffer";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { crc32, inflateSync } from "node:zlib";
import process from "node:process";

const DEFAULT_ROOT = fileURLToPath(new URL("..", import.meta.url));
const CANARY_ROOT = process.env.GOLDEN_CHECK_ROOT;
const FRONTEND_ROOT = CANARY_ROOT ? resolve(CANARY_ROOT) : DEFAULT_ROOT;

const E2E_DIR = join(FRONTEND_ROOT, "e2e");
const GOLDENS_DIR = join(E2E_DIR, "goldens");
const GOLDEN_CONFIG = join(FRONTEND_ROOT, "playwright-golden.config.ts");

// Per-image cap — EVIDENCE-POLICY. Never raise it: a golden that can't clear 150 KB is
// capturing too much frame (recrop to the asserted surface).
const PER_IMAGE_CEILING = 150 * 1024;

// ESTATE TOTAL — 110 KB. Derived, not guessed (numbers re-derived 2026-08-01 at HEAD
// f38c5130 from `git log` on each golden):
//   · the estate has been eight files since birth 0ea30223 (2026-07-13): total 101,256 B
//     then, 101,341 B now — 85 B of movement (+0.08%) across FIVE reviewed re-mints;
//   · the worst per-file re-mint drift ever recorded is toggle-crest-dark-linux,
//     6,403 → 6,983 B = +9.06% (8c6af343);
//   · 101,341 × 1.0906 = 110,522 B — every one of the eight re-minted at once, at the
//     worst rate the campaign has ever produced. 110 KB = 112,640 B clears that with
//     2,118 B to spare (11.15% headroom over today's total).
// T7-W6 DEMOTION: this band is now the SECONDARY control. The estate's size is pinned by
// COUNT below, because the byte arithmetic above has to be re-derived at every reviewed
// crop-tighten — and a number that must be re-derived to stay true is a number that drifts.
// It still answers the question the count cannot: whether the eight are ballooning.
const TOTAL_CEILING = 110 * 1024;

// THE COUNT PIN (check 7). The estate has been eight files since birth 0ea30223
// (2026-07-13) — four goldens × {darwin,linux}. A ninth is a RULING, and a ruling lands
// with this constant bumped in the same commit (T2–T4 lesson: the ruling lands with its
// enforcing config). Under the byte band alone a ninth and tenth simply fit: the band was
// derived against a 101,341 B total that reads 92.5 KB today, so the drift left ~18 KB of
// unearned room. An exact equality has no room to leave.
const GOLDEN_COUNT = 8;

// Blank-capture floor. `statSync().size` alone passes a 0-byte or solid-transparent PNG
// (hole B3). A 110×110 DPR2 solid crop deflates to a few hundred bytes; the SMALLEST
// real golden is cell-light-linux at 3,898 B. 1 KB separates the two classes without
// pretending to be an ink decoder (that job belongs to wordmark-integrity).
const MIN_IMAGE_BYTES = 1024;

// The two platforms the campaign mints ({platform} in snapshotPathTemplate is
// process.platform; darwin = the dev host, linux = every CI runner).
const PLATFORMS = ["darwin", "linux"];

const rel = (p) => relative(FRONTEND_ROOT, p) || p;
const kb = (b) => `${(b / 1024).toFixed(1)} KB`;

/** Recursively collect every *.png under a dir. */
function collectPngs(dir) {
  let out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return out;
    throw err;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(collectPngs(p));
    else if (e.isFile() && e.name.endsWith(".png")) out.push(p);
  }
  return out;
}

/** Parse a PNG the whole way down: signature, every chunk CRC, IHDR, IDAT inflate, IEND.
 *  Throws with the reason on the first structural defect. Returns the geometry. */
function decodePng(buf) {
  const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buf.length < 8 || !buf.subarray(0, 8).equals(SIG))
    throw new Error("bad PNG signature");
  let off = 8;
  let ihdr = null;
  let iend = false;
  const idat = [];
  while (off + 8 <= buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const dataStart = off + 8;
    const dataEnd = dataStart + len;
    if (dataEnd + 4 > buf.length) {
      throw new Error(
        `truncated at chunk ${type} (declares ${len} B, ${buf.length - dataStart} B left)`,
      );
    }
    if (buf.readUInt32BE(dataEnd) !== crc32(buf.subarray(off + 4, dataEnd))) {
      throw new Error(`CRC mismatch in chunk ${type}`);
    }
    if (type === "IHDR") {
      if (len !== 13) throw new Error(`IHDR is ${len} B, expected 13`);
      ihdr = {
        width: buf.readUInt32BE(dataStart),
        height: buf.readUInt32BE(dataStart + 4),
        bitDepth: buf[dataStart + 8],
        colorType: buf[dataStart + 9],
        interlace: buf[dataStart + 12],
      };
    } else if (type === "IDAT") idat.push(buf.subarray(dataStart, dataEnd));
    else if (type === "IEND") iend = true;
    off = dataEnd + 4;
  }
  if (!ihdr) throw new Error("no IHDR chunk");
  if (!ihdr.width || !ihdr.height)
    throw new Error(`zero geometry ${ihdr.width}×${ihdr.height}`);
  if (idat.length === 0) throw new Error("no IDAT chunk (no pixel data)");
  if (!iend) throw new Error("no IEND chunk (file truncated)");
  if (off !== buf.length)
    throw new Error(`${buf.length - off} trailing byte(s) after IEND`);

  let raw;
  try {
    raw = inflateSync(Buffer.concat(idat));
  } catch (err) {
    throw new Error(`IDAT will not inflate: ${err.message}`, { cause: err });
  }
  // Non-interlaced: the raw stream is exactly height × (1 filter byte + scanline).
  if (ihdr.interlace === 0) {
    const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.colorType];
    if (channels === undefined) throw new Error(`unknown colorType ${ihdr.colorType}`);
    const stride = Math.ceil((ihdr.width * channels * ihdr.bitDepth) / 8);
    const expect = ihdr.height * (stride + 1);
    if (raw.length !== expect) {
      throw new Error(
        `inflated ${raw.length} B, expected ${expect} B (incomplete image)`,
      );
    }
  }
  return ihdr;
}

/** Golden filename → {base, platform}. Anything else is malformed. */
function parseGoldenName(file) {
  const m = /^(.+)-(darwin|linux|win32)\.png$/.exec(file);
  return m ? { base: m[1], platform: m[2] } : null;
}

// ── Scan ────────────────────────────────────────────────────────────
if (CANARY_ROOT) {
  console.log(`[golden-bytes] CANARY ROOT OVERRIDE — scanning ${FRONTEND_ROOT}`);
  console.log(
    "[golden-bytes] this run is NOT the gate; it exists to prove the gate bites.\n",
  );
}

const allPngs = collectPngs(E2E_DIR).sort();
const goldens = allPngs.filter((p) => p.startsWith(GOLDENS_DIR + "/"));
const fossils = allPngs.filter((p) => !p.startsWith(GOLDENS_DIR + "/"));

// The spec census runs BEFORE any early exit (T7-W6 / B4). It used to live down in check
// 5, after an `allPngs.length === 0 → exit 0` return, which is how a wiped estate greened:
// the gate never got as far as asking what the specs assert.
const specFiles = readdirSync(E2E_DIR, { withFileTypes: true })
  .filter((e) => e.isFile() && e.name.endsWith(".spec.ts"))
  .map((e) => join(E2E_DIR, e.name));
const asserted = new Map(); // golden base → [spec:line, …]
for (const f of specFiles) {
  // Whole-file scan, NOT per-line: prettier is free to wrap the call so
  // `toHaveScreenshot(` and its string land on different lines, and a per-line
  // regex then reports a consumed golden as an orphan (T6.2 — logo-light and
  // cell-light both "orphaned" by a reflow). The line number is derived.
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(/toHaveScreenshot\(\s*['"`]([^'"`]+)\.png['"`]/g)) {
    const at = `${rel(f)}:${text.slice(0, m.index).split("\n").length}`;
    asserted.set(m[1], [...(asserted.get(m[1]) ?? []), at]);
  }
}

const failures = [];

// ── 8 · the estate must be PRESENT ──────────────────────────────────
if (goldens.length === 0) {
  if (asserted.size > 0) {
    console.error(
      `\n[golden-bytes] FAIL — ZERO goldens under ${rel(GOLDENS_DIR)} while ${asserted.size} ` +
        `golden(s) are asserted by ${specFiles.length} spec file(s):\n` +
        [...asserted]
          .sort()
          .map(([n, at]) => `  ${n}.png  ← ${at.join(", ")}`)
          .join("\n") +
        `\n\nA wiped, gitignored, or never-checked-out estate is the loudest defect this ` +
        `gate can see, and it used to exit 0 on it ("nothing to police"). Every compare\n` +
        `downstream would fail open or write its own baseline. Restore the estate — never\n` +
        `re-mint it to make this green.`,
    );
    process.exit(1);
  }
  // No goldens AND no spec asserts one: the estate genuinely does not exist yet.
  console.log(
    `[golden-bytes] no *.png under ${rel(E2E_DIR)} and no spec asserts one — nothing to police.\n` +
      `  (Capture with: npm run test:golden:update)`,
  );
  process.exit(0);
}

// ── 1 · per-image ceiling · 4 · decode + floor ──────────────────────
let goldenBytes = 0;
const rows = [];
const decoded = new Map();
for (const p of goldens) {
  const bytes = statSync(p).size;
  goldenBytes += bytes;
  const notes = [];
  let verdict = "ok  ";
  if (bytes > PER_IMAGE_CEILING) {
    verdict = "FAIL";
    notes.push(`over the ${kb(PER_IMAGE_CEILING)} per-image ceiling`);
    failures.push(`per-image ceiling: ${rel(p)} is ${kb(bytes)}`);
  }
  if (bytes < MIN_IMAGE_BYTES) {
    verdict = "FAIL";
    notes.push(`under the ${kb(MIN_IMAGE_BYTES)} blank-capture floor`);
    failures.push(`blank-capture floor: ${rel(p)} is ${bytes} B`);
  }
  try {
    const ihdr = decodePng(readFileSync(p));
    decoded.set(p, ihdr);
    notes.push(`${ihdr.width}×${ihdr.height}`);
  } catch (err) {
    verdict = "FAIL";
    notes.push(`DECODE: ${err.message}`);
    failures.push(`decode: ${rel(p)} — ${err.message}`);
  }
  rows.push(`  ${verdict}  ${kb(bytes).padStart(9)}  ${rel(p)}  [${notes.join("; ")}]`);
}

const fossilBytes = fossils.reduce((s, p) => s + statSync(p).size, 0);
const totalBytes = goldenBytes + fossilBytes;

console.log(
  `[golden-bytes] ${goldens.length} golden(s) + ${fossils.length} unsanctioned PNG(s) under ` +
    `${rel(E2E_DIR)}\n` +
    `  estate total  ${kb(totalBytes).padStart(9)}  (goldens ${kb(goldenBytes)}` +
    `${fossils.length ? `, unsanctioned ${kb(fossilBytes)}` : ""})\n` +
    `  estate band   ${kb(TOTAL_CEILING).padStart(9)}  ` +
    (totalBytes <= TOTAL_CEILING
      ? `(headroom ${kb(TOTAL_CEILING - totalBytes)} = ` +
        `${(((TOTAL_CEILING - totalBytes) / totalBytes) * 100).toFixed(1)}% of the total)\n`
      : `(OVER by ${kb(totalBytes - TOTAL_CEILING)} = ` +
        `${(((totalBytes - TOTAL_CEILING) / TOTAL_CEILING) * 100).toFixed(1)}% of the band)\n`) +
    `  per-image     ${kb(PER_IMAGE_CEILING).padStart(9)} ceiling · ${kb(MIN_IMAGE_BYTES)} floor`,
);
for (const r of rows) console.log(r);

// ── 2 · estate total ────────────────────────────────────────────────
if (totalBytes > TOTAL_CEILING) {
  failures.push(
    `estate total: ${totalBytes} B > ${TOTAL_CEILING} B band (over by ${totalBytes - TOTAL_CEILING} B)`,
  );
}

// ── 3 · fossils ─────────────────────────────────────────────────────
if (fossils.length > 0) {
  console.log(
    `\n[golden-bytes] UNSANCTIONED — ${fossils.length} *.png outside ${rel(GOLDENS_DIR)}:`,
  );
  for (const p of fossils)
    console.log(`  FAIL  ${kb(statSync(p).size).padStart(9)}  ${rel(p)}`);
  failures.push(
    `fossils: ${fossils.length} *.png outside ${rel(GOLDENS_DIR)} (${kb(fossilBytes)}) — ` +
      `auto-written baselines no config reads`,
  );
}

// ── 7 · the count pin ───────────────────────────────────────────────
// Equality, not a ceiling. A ninth golden and a vanished eighth are both rulings, and a
// ruling lands with GOLDEN_COUNT bumped in the same commit.
console.log(
  `\n[golden-bytes] count pin: ${goldens.length} on disk, pinned at ${GOLDEN_COUNT}` +
    `${goldens.length === GOLDEN_COUNT ? "" : "  ← RULING REQUIRED"}`,
);
if (goldens.length !== GOLDEN_COUNT) {
  failures.push(
    `count pin: ${goldens.length} goldens on disk, pinned at ${GOLDEN_COUNT}. ` +
      (goldens.length > GOLDEN_COUNT
        ? `A new golden is a ruling — argue it, then bump GOLDEN_COUNT in the same commit.`
        : `A golden left the estate — say where it went, then bump GOLDEN_COUNT in the same commit.`) +
      ` The byte band is the secondary control and cannot make this judgment.`,
  );
}

// ── 5 · pairing + orphans ───────────────────────────────────────────
const onDisk = new Map(); // base → Set(platform)
for (const p of goldens) {
  const parsed = parseGoldenName(p.split("/").pop());
  if (!parsed) {
    failures.push(`malformed name: ${rel(p)} carries no -{platform} suffix`);
    continue;
  }
  if (!onDisk.has(parsed.base)) onDisk.set(parsed.base, new Set());
  onDisk.get(parsed.base).add(parsed.platform);
}

console.log(
  `\n[golden-bytes] pairing + consumers (${specFiles.length} spec file(s) grepped):`,
);
for (const [base, plats] of [...onDisk].sort()) {
  const missing = PLATFORMS.filter((pl) => !plats.has(pl));
  const consumers = asserted.get(base) ?? [];
  const bad = missing.length > 0 || consumers.length === 0;
  console.log(
    `  ${bad ? "FAIL" : "ok  "}  ${base}  [${[...plats].sort().join(", ")}]  ` +
      `${consumers.length ? `→ ${consumers.join(", ")}` : "→ NO CONSUMING SPEC"}` +
      `${missing.length ? `  MISSING: ${missing.join(", ")}` : ""}`,
  );
  if (missing.length > 0)
    failures.push(`pairing: ${base} has no ${missing.join("/")} baseline`);
  if (consumers.length === 0) failures.push(`orphan: ${base} is asserted by no spec`);
}
for (const [name, at] of asserted) {
  if (!onDisk.has(name)) {
    console.log(`  FAIL  ${name}  [no files]  → ${at.join(", ")}`);
    failures.push(
      `missing baseline: ${at.join(", ")} asserts ${name}.png, which is not on disk`,
    );
  }
}

// ── tracked-ness (B6) ───────────────────────────────────────────────
// A golden minted into e2e/goldens but never `git add`ed reports ok locally while CI has
// no baseline at all. One `git ls-files`.
let tracked = null;
try {
  tracked = new Set(
    execFileSync("git", ["ls-files", "--", rel(GOLDENS_DIR)], {
      cwd: FRONTEND_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split("\n")
      .filter(Boolean)
      .map((p) => p.split("/").pop()),
  );
} catch {
  console.log(
    "\n[golden-bytes] tracked-ness: SKIPPED (no git here) — not a pass, an absence.",
  );
}
if (tracked) {
  const untracked = goldens
    .map((p) => p.split("/").pop())
    .filter((n) => !tracked.has(n));
  console.log(
    `\n[golden-bytes] tracked-ness: ${tracked.size} tracked / ${goldens.length} on disk` +
      `${untracked.length ? ` — UNTRACKED: ${untracked.join(", ")}` : ""}`,
  );
  if (untracked.length > 0) {
    failures.push(`untracked: ${untracked.join(", ")} exist(s) on disk but not in git`);
  }
}

// ── 6 · engine-collision guard ──────────────────────────────────────
// snapshotPathTemplate has no {projectName}; declare a second engine and BOTH engines
// write the same file. That is exactly how the -webkit-darwin fossils were born
// (242fad7b's testIgnore window, r3/goldens-estate §1.4/§3.6). Any widening must land
// the template change in the same commit — this refuses the half that comes alone.
try {
  // Comments first: the config's own engine ARGUMENT names both keys in prose, and a guard
  // that reds on its own rationale is a guard nobody keeps.
  const cfg = readFileSync(GOLDEN_CONFIG, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|\s)\/\/.*$/gm, "$1");
  const declaresEngines = /^\s*(projects\s*:|browserName\s*:)/m.test(cfg);
  const templated = /snapshotPathTemplate\s*:.*\{projectName\}/.test(cfg);
  const status = declaresEngines
    ? templated
      ? "ok   multi-engine + {projectName}"
      : "FAIL engine declared without {projectName}"
    : "ok   single implicit engine (chromium), no {projectName} needed";
  console.log(`\n[golden-bytes] engine/template: ${status}  (${rel(GOLDEN_CONFIG)})`);
  if (declaresEngines && !templated) {
    failures.push(
      `engine collision: ${rel(GOLDEN_CONFIG)} declares an engine while snapshotPathTemplate ` +
        `lacks {projectName} — every engine would overwrite one baseline`,
    );
  }
} catch (err) {
  console.log(
    `\n[golden-bytes] engine/template: UNREADABLE ${rel(GOLDEN_CONFIG)} — ${err.message}`,
  );
  failures.push(`engine collision: cannot read ${rel(GOLDEN_CONFIG)}`);
}

// ── Verdict ─────────────────────────────────────────────────────────
if (failures.length > 0) {
  console.error(`\n[golden-bytes] FAIL — ${failures.length} defect(s):`);
  for (const f of failures) console.error(`  · ${f}`);
  console.error(
    `\nRecrop to the asserted surface, delete what no config reads, re-mint the missing\n` +
      `half of a pair — never raise a cap to make this green.`,
  );
  process.exit(1);
}

console.log(
  `\n[golden-bytes] PASS — ${goldens.length} goldens (pinned at ${GOLDEN_COUNT}), ` +
    `${kb(goldenBytes)} of a ${kb(TOTAL_CEILING)} estate band; paired, consumed, decodable, ` +
    `tracked; no fossils.`,
);
process.exit(0);
