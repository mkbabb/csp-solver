#!/usr/bin/env node
// T5-W1 row 1.3 — the EVIDENCE-POLICY enforcement gate (audit A3, CONFIRMED-worse).
//
// `docs/tranches/EVIDENCE-POLICY.md:13` promised an enforcer in so many words:
// "The gate greps the wave's evidence dir for `*.png`, sums bytes, and fails on
// breach." Nothing did. `check-golden-bytes.mjs` implements the *number* (150 KB)
// against `web/frontend/e2e/goldens` — the one directory `EVIDENCE-POLICY.md:12`
// carves OUT of the wave budget — which is why the hole read as covered for a
// whole tranche. This script is the missing gate, and its scope is the estate the
// policy actually binds: `docs/tranches/**`.
//
// Four rules. Three are straight off the policy text:
//   1. per-image  ≤ 153,600 B   (`:10` "Per-image cap: ≤150 KB")
//   2. per-wave   ≤ 2,097,152 B (`:11` "Per-wave cap: ≤2 MB of images")
//   3. name ban   /-full\.png$/ (`:9`  "Crops, never full viewports")
// The two byte figures are the binary-prefix reading pinned by the tranche-5
// gates block (`gates.json` → W1.evidencePolicy.perImageBytesMax / perWaveBytesMax).
//
//   4. BANKED DIST — born at the T5-W4 pass-5 seal, adjudication §2 (BC5-G2).
//      Every banked `dist-*` directory in the design-loop evidence turned out to
//      hold `_headers` + `_redirects` and no build: the payload never survived the
//      commit, so every md5/identity claim resting on those directories is
//      testimony with its exhibit missing. The ruling let the conclusions stand
//      (later passes rebuilt and re-measured) and wrote the policy this rule now
//      enforces: A BANKED DIST SHIPS AS A `.tar.gz` WITH AN md5 MANIFEST BESIDE
//      IT, OR THE RECORD SAYS "testimony, artifact not banked" IN PLACE.
//      Concretely, under `docs/tranches/**`:
//        (a) a directory whose basename is `dist` or starts `dist-` is a breach
//            unless it carries a `TESTIMONY.md` naming itself as testimony;
//        (b) a `TESTIMONY.md` that does not contain the literal phrase
//            "testimony, artifact not banked" is not a marker — a placeholder
//            file must not be able to buy an exemption;
//        (c) a `dist*.tar.gz` without a non-empty sibling md5 manifest
//            (`<archive>.md5` or `<archive>.tar.gz.md5`) is a breach — an archive
//            nobody can verify is the same hole in a smaller box.
//      The estate that existed when the rule was written is grandfathered by name
//      (GRANDFATHERED_DISTS), so the gate reds on NEW hollow banks only.
//
// A "wave" is the bucket the per-wave cap is summed over: the directory one level
// under the nearest `evidence/` segment (`.../evidence/w10`, and `.../evidence/w12`
// owns its `captures/` subtree). Evidence that predates the `evidence/` convention
// buckets at `<tranche>/<top-subdir>`.
//
// Enumeration is a filesystem walk, not `git ls-files` — the policy's own wording is
// "greps the wave's evidence dir", a CI checkout materialises exactly the tracked
// set so the two agree there, and locally the walk also catches a stray uncommitted
// capture before it can be committed.
//
// Run: `node scripts/check-evidence-policy.mjs [--self-test]`
// `--self-test` re-proves all four rules able to FAIL (and able NOT to fire on a
// clean estate) against synthetic inputs before the real audit runs, so a green here
// is never a green from a broken instrument. CI passes the flag. The self-test does
// not exit: control falls through to the real audit on purpose. See the main block.

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import process from "node:process";

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCOPE = "docs/tranches";

const PER_IMAGE_BYTES_MAX = 153600; // 150 KiB — EVIDENCE-POLICY:10
const PER_WAVE_BYTES_MAX = 2097152; // 2 MiB   — EVIDENCE-POLICY:11
const BANNED_NAME = /-full\.png$/; //            EVIDENCE-POLICY:9

// Rule 4 — pass-5 seal, adjudication §2. `dist` and `dist-<anything>`; `distillate` is not a
// dist bank, hence the anchored `(-|$)` rather than a bare prefix.
const DIST_DIR = /^dist(-|$)/;
const DIST_ARCHIVE = /^dist.*\.tar\.gz$/;
const TESTIMONY_FILE = "TESTIMONY.md";
/** The words the adjudication put in the record's mouth. A marker must actually say them. */
const TESTIMONY_PHRASE = "testimony, artifact not banked";

// ---------------------------------------------------------------- grandfather
//
// ADDITIONS TO THESE LISTS ARE FORBIDDEN. (Two here; the dist list below says the
// same thing in its own words, on its own terms.)
//
// The lists are the once-only adjudication of the estate that existed when the gate
// was built — the sealed tranches (2026-06 / 2026-07), whose evidence was authored
// and RATIFIED before an enforcer existed. Sealed records keep their artifacts: you
// do not re-cut a closed tranche's evidence to satisfy a gate written after it
// closed. The full crop-or-grandfather table, breach by breach, is
// `docs/tranches/2026-08-tranche-5/evidence/w1/evidence-adjudication.md`.
//
// Every entry is a CEILING, not a blanket: `[path, bytes]` exempts that path from
// the per-image cap and the name ban only while it stays at or under the pinned
// byte count. A grandfathered file that GROWS reds. A grandfathered wave that gains
// a new image reds. The sealed estate may therefore only shrink.
//
// If your new evidence breaches a cap, the cure is a crop — not a line here. A live
// wave that cannot clear 150 KB per image is capturing too much frame. Removing an
// entry (because the file was pruned) is fine and the gate will tell you which ones
// have gone stale; adding one is a policy amendment, and this comment says no.
//
/** @type {Array<[string, number]>} path → pinned byte ceiling. 64 entries, all sealed. */
const GRANDFATHERED_IMAGES = [
  // 2026-07-grand-uplift — executed 2026-07-06. 6 over-cap.
  [
    "docs/tranches/2026-07-grand-uplift/artifacts/union-screenshots/composite-idle-dark.png",
    215429,
  ],
  [
    "docs/tranches/2026-07-grand-uplift/artifacts/union-screenshots/composite-idle-light.png",
    234376,
  ],
  [
    "docs/tranches/2026-07-grand-uplift/artifacts/union-screenshots/composite-peek-dark.png",
    263006,
  ],
  [
    "docs/tranches/2026-07-grand-uplift/artifacts/union-screenshots/composite-peek-light.png",
    295245,
  ],
  [
    "docs/tranches/2026-07-grand-uplift/artifacts/union-screenshots/motion-strip-laminate.png",
    270342,
  ],
  [
    "docs/tranches/2026-07-grand-uplift/artifacts/union-screenshots/union-dark-held-board.png",
    164059,
  ],
  // 2026-07-tranche-2 — closed 2026-07-10 at 98.2% (3b75eca2). 13 over-cap.
  [
    "docs/tranches/2026-07-tranche-2/evidence/execution/U5-engine-domains-marks/shots/01-sudoku-9x9-peek-light.png",
    417722,
  ],
  [
    "docs/tranches/2026-07-tranche-2/evidence/execution/U5-engine-domains-marks/shots/03-after-entry.png",
    410199,
  ],
  [
    "docs/tranches/2026-07-tranche-2/evidence/execution/U5-engine-domains-marks/shots/04-unsat-conflict.png",
    384708,
  ],
  [
    "docs/tranches/2026-07-tranche-2/evidence/execution/U5-engine-domains-marks/shots/05-sudoku-9x9-peek-dark.png",
    438431,
  ],
  [
    "docs/tranches/2026-07-tranche-2/evidence/execution/U5-engine-domains-marks/shots/07-futoshiki-6x6-peek-light.png",
    296948,
  ],
  [
    "docs/tranches/2026-07-tranche-2/evidence/execution/U5-engine-domains-marks/shots/08-futoshiki-6x6-peek-dark.png",
    321080,
  ],
  [
    "docs/tranches/2026-07-tranche-2/evidence/pass2/p3-shots/mid-after-t1400.png",
    283564,
  ],
  [
    "docs/tranches/2026-07-tranche-2/evidence/pass2/p3-shots/mid-before-t1400.png",
    291443,
  ],
  [
    "docs/tranches/2026-07-tranche-2/evidence/pass2/p4-shots/01-board-9x9-light.png",
    222461,
  ],
  [
    "docs/tranches/2026-07-tranche-2/evidence/pass2/p4-shots/03-after-entry.png",
    225364,
  ],
  [
    "docs/tranches/2026-07-tranche-2/evidence/pass2/p4-shots/04-unsat-conflict.png",
    184801,
  ],
  [
    "docs/tranches/2026-07-tranche-2/evidence/pass2/p4-shots/05-board-9x9-dark.png",
    243726,
  ],
  [
    "docs/tranches/2026-07-tranche-2/evidence/pass2/p4-shots/07-board-16x16.png",
    455779,
  ],
  // 2026-07-tranche-3 — shipped 2026-07-12 (bbeb2b87). 14 over-cap.
  [
    "docs/tranches/2026-07-tranche-3/evidence/T3-W11-gate/gate-failed-maroon-beat.png",
    217004,
  ],
  [
    "docs/tranches/2026-07-tranche-3/evidence/T3-W12-gate/shots/gate-completion-solved-1440x806.png",
    544847,
  ],
  [
    "docs/tranches/2026-07-tranche-3/evidence/T3-W9-gate/failure-red-graphite-zero-gold.png",
    188597,
  ],
  ["docs/tranches/2026-07-tranche-3/evidence/T3-W9-gate/heart-crest-dark.png", 202344],
  [
    "docs/tranches/2026-07-tranche-3/evidence/T3-W9-gate/prm-solved-instant.png",
    204339,
  ],
  [
    "docs/tranches/2026-07-tranche-3/evidence/T3-W9-gate/probe5-solved-row-light.png",
    211805,
  ],
  [
    "docs/tranches/2026-07-tranche-3/evidence/T3-WGATE-shots/live-solved-dark.png",
    255195,
  ],
  [
    "docs/tranches/2026-07-tranche-3/evidence/T3-WGATE-shots/live-solved-light.png",
    259291,
  ],
  ["docs/tranches/2026-07-tranche-3/evidence/addendum/a1-completion-live.png", 531066],
  ["docs/tranches/2026-07-tranche-3/evidence/addendum/a1-solved-1440.png", 493775],
  [
    "docs/tranches/2026-07-tranche-3/evidence/addendum/d1-shots/corner-1100-v2.png",
    532971,
  ],
  [
    "docs/tranches/2026-07-tranche-3/evidence/addendum/d1-shots/solved-1440-prm.png",
    574907,
  ],
  ["docs/tranches/2026-07-tranche-3/evidence/w13/b1-idle.png", 495086],
  ["docs/tranches/2026-07-tranche-3/evidence/w13/b4-close-midglide.png", 445286],
  // 2026-07-tranche-4 — sealed 2026-07-15 (WGATE aa77860e). 28 over-cap, of which the
  // four `-full.png` are ALSO the name-ban breaches EVIDENCE-POLICY:9 names by hand.
  [
    "docs/tranches/2026-07-tranche-4/evidence/w10/forcedcolors-fullpage-light.png",
    153762,
  ],
  [
    "docs/tranches/2026-07-tranche-4/evidence/w10/parity-futoshiki-dark-full-2.png",
    271175,
  ],
  [
    "docs/tranches/2026-07-tranche-4/evidence/w10/parity-futoshiki-dark-full.png",
    271130,
  ],
  [
    "docs/tranches/2026-07-tranche-4/evidence/w10/parity-futoshiki-light-full-2.png",
    263044,
  ],
  [
    "docs/tranches/2026-07-tranche-4/evidence/w10/parity-futoshiki-light-full.png",
    262711,
  ],
  [
    "docs/tranches/2026-07-tranche-4/evidence/w10/parity-sudoku-dark-full-2.png",
    310453,
  ],
  ["docs/tranches/2026-07-tranche-4/evidence/w10/parity-sudoku-dark-full.png", 310415],
  [
    "docs/tranches/2026-07-tranche-4/evidence/w10/parity-sudoku-light-full-2.png",
    293016,
  ],
  ["docs/tranches/2026-07-tranche-4/evidence/w10/parity-sudoku-light-full.png", 292795],
  [
    "docs/tranches/2026-07-tranche-4/evidence/w10/reflow-320-futoshiki-dark.png",
    161256,
  ],
  ["docs/tranches/2026-07-tranche-4/evidence/w10/reflow-320-sudoku-dark.png", 190250],
  [
    "docs/tranches/2026-07-tranche-4/evidence/w12/captures/gallery-focus-ring.png",
    202373,
  ],
  ["docs/tranches/2026-07-tranche-4/evidence/w12/captures/gallery-prm.png", 203254],
  [
    "docs/tranches/2026-07-tranche-4/evidence/w12/captures/gallery-settled-dark.png",
    211976,
  ],
  ["docs/tranches/2026-07-tranche-4/evidence/w12/captures/gallery-settled.png", 205105],
  [
    "docs/tranches/2026-07-tranche-4/evidence/w13/j1-gallery-5cards-thermo-fold.png",
    166283,
  ],
  ["docs/tranches/2026-07-tranche-4/evidence/w13/j1-killer-inapp-dark.png", 186763],
  ["docs/tranches/2026-07-tranche-4/evidence/w13/j1-killer-inapp-light.png", 166974],
  [
    "docs/tranches/2026-07-tranche-4/evidence/w13/jv-gallery-5cards-thermo-fold.png",
    165448,
  ],
  ["docs/tranches/2026-07-tranche-4/evidence/w13/jv-killer-inapp-dark.png", 169687],
  ["docs/tranches/2026-07-tranche-4/evidence/w13/kenken-furniture-face.png", 247626],
  ["docs/tranches/2026-07-tranche-4/evidence/w13/killer-furniture-face.png", 375931],
  ["docs/tranches/2026-07-tranche-4/evidence/w13/thermo-furniture-face.png", 188870],
  ["docs/tranches/2026-07-tranche-4/evidence/w8/crops/pi-collision-peek.png", 175123],
  ["docs/tranches/2026-07-tranche-4/evidence/w9/p2-beyond-sudoku-board.png", 176214],
  ["docs/tranches/2026-07-tranche-4/evidence/w9/p2-tier1-sudoku-board.png", 215071],
  ["docs/tranches/2026-07-tranche-4/evidence/w9/p2-tier2-sudoku-board.png", 185710],
  [
    "docs/tranches/2026-07-tranche-4/evidence/w9/p2-ungraded-16x16-sudoku-board.png",
    244611,
  ],
  // T4-P1 Safari/iOS patch — sealed 2026-07-31 (WGATE §9.1, seal 6800af04). 3 over-cap.
  [
    "docs/tranches/2026-07-tranche-4/patches/p1-safari-ios-performance/evidence/p1/soul-glyph-bake/chromium-dark/board-1x.png",
    167881,
  ],
  [
    "docs/tranches/2026-07-tranche-4/patches/p1-safari-ios-performance/evidence/p1/soul-glyph-bake/webkit-dark/board-1x.png",
    201420,
  ],
  [
    "docs/tranches/2026-07-tranche-4/patches/p1-safari-ios-performance/evidence/p1/soul-glyph-bake/webkit-light/board-1x.png",
    193494,
  ],
];

// ------------------------------------------------- grandfather: the dist banks
//
// ADDITIONS TO THIS LIST ARE FORBIDDEN, on the same terms as the two above.
//
// This is the banked-dist estate as it stood when rule 4 was written (T5-W4 pass 6,
// at `abe533c4`). The adjudication that ordered the rule counted "all 23 banked
// `dist-*` directories"; re-derived at citation, the filesystem holds **29** banked
// dist directories, of which **25 are hollow** (`_headers` + `_redirects`, nothing
// else) and **4 are full** (39 files each, a real build). The 23 is corrected here
// rather than copied — the ruling's substance is untouched, only its count.
//
// Every entry is a CEILING on FILE COUNT, not a blanket: a grandfathered bank that
// GAINS files reds. That is the point. Re-filling a hollow directory with loose
// build output is exactly the practice the rule retires; the cure for wanting a
// payload back is a `.tar.gz` + md5 under a NEW name, which this list does not
// cover and rule 4 therefore checks properly.
//
/** @type {Array<[string, number]>} dist bank → pinned file count. 29 entries. */
const GRANDFATHERED_DISTS = [
  // HOLLOW — 25. The BC5-G2 subject: payload absent, claims stand as testimony only,
  // and no future claim may cite these directories as proof (adjudication §2).
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass2/dist-base", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass2/dist-f2pen", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass2/dist-f2type", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3/dist-127fde0d", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3/dist-A", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3/dist-B0", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3/dist-B1", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3/dist-Bfinal", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3/dist-F3base", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3/dist-F3head", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3/dist-base", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3/dist-e982a403", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3/dist-head", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3/dist-prune", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3/measure/dist-head", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3/stall/dist-head", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4/dist-BChead", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4/dist-F3base", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4/dist-F3head", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4/dist-FINAL", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4/dist-curveCTRL", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4/dist-noopCTRL", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4/dist-p4base", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4/dist-recon", 2],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4/measure/dist-head", 2],
  // FULL — 4. Payload present (39 files each, pass 5 banked real builds), but LOOSE:
  // not a `.tar.gz`, no md5 manifest. They are grandfathered because they are real
  // evidence that predates the rule, not because loose is acceptable going forward.
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass5/BC/rig/dist-head", 39],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass5/f3/dist-p5ablate", 39],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass5/f3/dist-p5base", 39],
  ["docs/tranches/2026-08-tranche-5/evidence/design-loop/pass5/f3/dist-p5head", 39],
];

/** @type {Array<[string, number]>} wave bucket → pinned byte ceiling. 5 entries, all sealed. */
const GRANDFATHERED_WAVES = [
  ["docs/tranches/2026-07-tranche-2/evidence/execution", 2467705],
  ["docs/tranches/2026-07-tranche-3/evidence/addendum", 2564266],
  ["docs/tranches/2026-07-tranche-4/evidence/w10", 4236208],
  ["docs/tranches/2026-07-tranche-4/evidence/w12", 4324819],
  ["docs/tranches/2026-07-tranche-4/evidence/w13", 2583004],
];

// ---------------------------------------------------------------- machinery

const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** Recursively collect every *.png under `dir` (absent dir → no files). */
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

/**
 * Every banked dist under `dir`, as `{ dir: absPath, files: n, marker: 'ok'|'empty'|'absent' }`,
 * plus every `dist*.tar.gz` as `{ archive: absPath, manifest: boolean }`. One walk, because the
 * two halves of rule 4 live in the same tree and a dist dir never nests inside another.
 */
function collectDistBanks(dir) {
  const dirs = [];
  const archives = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return { dirs, archives };
    throw err;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (DIST_DIR.test(e.name)) {
        dirs.push({ dir: p, files: countFiles(p), marker: readMarker(p) });
        // Do NOT descend: a banked dist is judged whole, and its own build output
        // must never be mistaken for further banks.
        continue;
      }
      const inner = collectDistBanks(p);
      dirs.push(...inner.dirs);
      archives.push(...inner.archives);
    } else if (e.isFile() && DIST_ARCHIVE.test(e.name)) {
      archives.push({ archive: p, manifest: hasManifest(p) });
    }
  }
  return { dirs, archives };
}

function countFiles(dir) {
  let n = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) n += countFiles(join(dir, e.name));
    else if (e.isFile()) n += 1;
  }
  return n;
}

/** 'ok' = a TESTIMONY.md saying the words; 'empty' = one that does not; 'absent' = none. */
function readMarker(dir) {
  const abs = join(dir, TESTIMONY_FILE);
  if (!existsSync(abs)) return "absent";
  let text = "";
  try {
    text = readFileSync(abs, "utf8");
  } catch {
    return "empty";
  }
  return text.toLowerCase().includes(TESTIMONY_PHRASE) ? "ok" : "empty";
}

/** `<archive>.md5` or `<archive-without-.tar.gz>.md5`, and it must have something in it. */
function hasManifest(archiveAbs) {
  const candidates = [`${archiveAbs}.md5`, archiveAbs.replace(/\.tar\.gz$/, ".md5")];
  return candidates.some((c) => {
    try {
      return statSync(c).size > 0;
    } catch {
      return false;
    }
  });
}

/** The bucket the per-wave cap sums over. See the header. */
function waveKeyFor(rel) {
  const seg = rel.split("/");
  const i = seg.lastIndexOf("evidence");
  if (i >= 0) return seg.slice(0, Math.min(i + 2, seg.length - 1)).join("/");
  return seg.slice(0, Math.min(4, seg.length - 1)).join("/");
}

/**
 * The whole policy in one pure function, so `--self-test` can run it against a
 * synthetic estate with its own pins.
 */
function audit({ root, scope, images = [], waves = [], dists = [] }) {
  const imagePins = new Map(images);
  const wavePins = new Map(waves);
  const distPins = new Map(dists);
  const scopeDir = join(root, scope);
  // An absent scope dir is a BROKEN INSTRUMENT, not a clean estate — a moved script
  // or a renamed docs tree would otherwise green forever on zero files.
  if (!existsSync(scopeDir))
    throw new Error(`scope directory does not exist: ${scopeDir}`);
  const files = collectPngs(scopeDir).sort();
  const seenPins = new Set();
  const byWave = new Map();
  const breaches = [];
  let totalBytes = 0;

  for (const abs of files) {
    const rel = relative(root, abs).split(sep).join("/");
    const bytes = statSync(abs).size;
    totalBytes += bytes;
    const wave = waveKeyFor(rel);
    byWave.set(wave, (byWave.get(wave) || 0) + bytes);

    const pin = imagePins.get(rel);
    if (pin !== undefined) {
      seenPins.add(rel);
      if (bytes > pin)
        breaches.push({ rule: "grandfather-image", path: rel, bytes, limit: pin });
      continue; // pinned and within its pin → exempt from the cap and the name ban
    }
    if (bytes > PER_IMAGE_BYTES_MAX) {
      breaches.push({
        rule: "per-image",
        path: rel,
        bytes,
        limit: PER_IMAGE_BYTES_MAX,
      });
    }
    if (BANNED_NAME.test(rel)) {
      breaches.push({ rule: "name-ban", path: rel, bytes, limit: null });
    }
  }

  for (const [wave, bytes] of byWave) {
    const pin = wavePins.get(wave);
    if (pin !== undefined) {
      seenPins.add(wave);
      if (bytes > pin)
        breaches.push({ rule: "grandfather-wave", path: wave, bytes, limit: pin });
      continue;
    }
    if (bytes > PER_WAVE_BYTES_MAX) {
      breaches.push({ rule: "per-wave", path: wave, bytes, limit: PER_WAVE_BYTES_MAX });
    }
  }

  // ---- rule 4: the banked dists -------------------------------------------
  const banks = collectDistBanks(scopeDir);
  const distDirs = banks.dirs.sort((a, b) => a.dir.localeCompare(b.dir));
  const distArchives = banks.archives.sort((a, b) =>
    a.archive.localeCompare(b.archive),
  );

  for (const d of distDirs) {
    const rel = relative(root, d.dir).split(sep).join("/");
    const pin = distPins.get(rel);
    if (pin !== undefined) {
      seenPins.add(rel);
      // A ceiling, not a blanket — same grammar as the image and wave pins.
      if (d.files > pin) {
        breaches.push({
          rule: "grandfather-dist",
          path: rel,
          bytes: d.files,
          limit: pin,
        });
      }
      continue;
    }
    if (d.marker === "ok") continue; // the record says the words; the bank is declared testimony
    breaches.push({
      rule: d.marker === "empty" ? "dist-marker-mute" : "dist-loose",
      path: rel,
      bytes: d.files,
      limit: null,
    });
  }

  for (const a of distArchives) {
    if (a.manifest) continue;
    const rel = relative(root, a.archive).split(sep).join("/");
    breaches.push({
      rule: "dist-no-manifest",
      path: rel,
      bytes: statSync(a.archive).size,
      limit: null,
    });
  }

  const stale = [...imagePins.keys(), ...wavePins.keys(), ...distPins.keys()]
    .filter((k) => !seenPins.has(k))
    .sort();
  breaches.sort((a, b) => b.bytes - a.bytes || a.path.localeCompare(b.path));
  return {
    files: files.length,
    totalBytes,
    byWave,
    breaches,
    stale,
    distDirs: distDirs.length,
    distArchives: distArchives.length,
  };
}

const RULE_TEXT = {
  "per-image": (b) => `${fmt(b.bytes)} B  > ${fmt(b.limit)} B per-image cap`,
  "per-wave": (b) => `${fmt(b.bytes)} B  > ${fmt(b.limit)} B per-wave cap`,
  "name-ban": (b) =>
    `${fmt(b.bytes)} B  name matches /-full\\.png$/ — a crop, never a viewport`,
  "grandfather-image": (b) =>
    `${fmt(b.bytes)} B  > ${fmt(b.limit)} B grandfather pin (it grew)`,
  "grandfather-wave": (b) =>
    `${fmt(b.bytes)} B  > ${fmt(b.limit)} B grandfather pin (it gained)`,
  "dist-loose": (b) =>
    `${fmt(b.bytes)} file(s)  a banked dist DIRECTORY — ship a .tar.gz + md5 manifest, or ` +
    `drop a ${TESTIMONY_FILE} saying "${TESTIMONY_PHRASE}"`,
  "dist-marker-mute": (b) =>
    `${fmt(b.bytes)} file(s)  ${TESTIMONY_FILE} present but it never says ` +
    `"${TESTIMONY_PHRASE}" — a placeholder buys no exemption`,
  "dist-no-manifest": (b) =>
    `${fmt(b.bytes)} B  dist archive with no non-empty sibling md5 (<archive>.md5) — ` +
    `an archive nobody can verify is the same hole in a smaller box`,
  "grandfather-dist": (b) =>
    `${fmt(b.bytes)} file(s)  > ${fmt(b.limit)} grandfather pin (the bank gained files — ` +
    `re-filling a hollow dist loosely is the practice rule 4 retires)`,
};

// ---------------------------------------------------------------- self-test

/** Materialise `[relPathUnderScope, bytes]` pairs into a throwaway estate. */
function plant(root, files) {
  for (const [rel, bytes] of files) {
    const abs = join(root, SCOPE, rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, Buffer.alloc(bytes));
  }
}

/** Materialise `[relPathUnderScope, text]` pairs — for markers and manifests. */
function plantText(root, files) {
  for (const [rel, text] of files) {
    const abs = join(root, SCOPE, rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, text);
  }
}

function selfTest() {
  const W1 = "2026-08-tranche-5/evidence/w1";
  const WAVE = `${SCOPE}/${W1}`;
  const cases = [
    {
      name: "per-image cap fires on one over-cap image",
      files: [[`${W1}/big.png`, 200000]],
      want: { "per-image": 1 },
    },
    {
      name: "per-wave cap fires even when every image is under the per-image cap",
      files: Array.from({ length: 20 }, (_, i) => [`${W1}/crop-${i}.png`, 140000]),
      want: { "per-wave": 1 },
    },
    {
      name: "name ban fires on a tiny -full.png",
      files: [[`${W1}/board-full.png`, 1024]],
      want: { "name-ban": 1 },
    },
    {
      // The anti-vacuity control: an instrument that reds on everything is not a gate.
      name: "a policy-conformant estate reds nowhere",
      files: [
        [`${W1}/crop-a.png`, 100000],
        [`${W1}/crop-b.png`, 100000],
      ],
      want: {},
    },
    {
      name: "a grandfather pin exempts the file it names",
      files: [[`${W1}/sealed.png`, 200000]],
      images: [[`${WAVE}/sealed.png`, 200000]],
      want: {},
    },
    {
      name: "a grandfather pin is a ceiling, not a blanket — growth past it reds",
      files: [[`${W1}/sealed.png`, 200000]],
      images: [[`${WAVE}/sealed.png`, 100000]],
      want: { "grandfather-image": 1 },
    },
    {
      name: "a wave pin is a ceiling too — a new image past it reds",
      files: [
        [`${W1}/a.png`, 150000],
        [`${W1}/b.png`, 150000],
      ],
      waves: [[WAVE, 150000]],
      want: { "grandfather-wave": 1 },
    },
    {
      name: "a pin naming nothing is reported stale",
      files: [[`${W1}/crop.png`, 1024]],
      images: [[`${WAVE}/pruned-long-ago.png`, 999]],
      want: {},
      staleCount: 1,
    },
    {
      // A moved script or a renamed docs tree must red, not green on zero files.
      name: "an absent scope dir throws rather than reading as a clean estate",
      files: [],
      wantThrow: /scope directory does not exist/,
    },

    // ---- rule 4, the banked dists ---------------------------------------
    {
      name: "rule 4 — a NEW hollow dist bank reds (the BC5-G2 shape, exactly)",
      files: [
        [`${W1}/dist-head/_headers`, 9349],
        [`${W1}/dist-head/_redirects`, 40],
      ],
      want: { "dist-loose": 1 },
    },
    {
      name: "rule 4 — a FULL loose dist bank reds too: the rule is the FORM, not the payload",
      files: [
        [`${W1}/dist-head/index.html`, 3015],
        [`${W1}/dist-head/assets/index-abc.js`, 222490],
        [`${W1}/dist-head/_headers`, 9349],
      ],
      want: { "dist-loose": 1 },
    },
    {
      name: "rule 4 — TESTIMONY.md saying the words exempts the bank",
      files: [[`${W1}/dist-head/_headers`, 9349]],
      texts: [
        [
          `${W1}/dist-head/TESTIMONY.md`,
          "# dist-head\n\ntestimony, artifact not banked.\n",
        ],
      ],
      want: {},
    },
    {
      name: "rule 4 — a TESTIMONY.md that never says the words buys nothing",
      files: [[`${W1}/dist-head/_headers`, 9349]],
      texts: [
        [`${W1}/dist-head/TESTIMONY.md`, "# dist-head\n\nbuilt from HEAD, trust me.\n"],
      ],
      want: { "dist-marker-mute": 1 },
    },
    {
      name: "rule 4 — a .tar.gz WITHOUT an md5 manifest reds",
      files: [[`${W1}/dist-head.tar.gz`, 4096]],
      want: { "dist-no-manifest": 1 },
    },
    {
      name: "rule 4 — a .tar.gz WITH a non-empty sibling md5 is the compliant bank",
      files: [[`${W1}/dist-head.tar.gz`, 4096]],
      texts: [
        [
          `${W1}/dist-head.tar.gz.md5`,
          "d41d8cd98f00b204e9800998ecf8427e  dist-head.tar.gz\n",
        ],
      ],
      want: {},
    },
    {
      name: "rule 4 — an EMPTY md5 manifest is not a manifest",
      files: [
        [`${W1}/dist-head.tar.gz`, 4096],
        [`${W1}/dist-head.tar.gz.md5`, 0],
      ],
      want: { "dist-no-manifest": 1 },
    },
    {
      name: "rule 4 — a grandfathered bank is exempt at its pinned file count",
      files: [
        [`${W1}/dist-head/_headers`, 9349],
        [`${W1}/dist-head/_redirects`, 40],
      ],
      dists: [[`${WAVE}/dist-head`, 2]],
      want: {},
    },
    {
      name: "rule 4 — a grandfathered bank is a CEILING: re-filling it loosely reds",
      files: [
        [`${W1}/dist-head/_headers`, 9349],
        [`${W1}/dist-head/_redirects`, 40],
        [`${W1}/dist-head/index.html`, 3015],
      ],
      dists: [[`${WAVE}/dist-head`, 2]],
      want: { "grandfather-dist": 1 },
    },
    {
      name: "rule 4 — a stale dist pin is reported, not silently carried",
      files: [[`${W1}/crop.png`, 1024]],
      dists: [[`${WAVE}/dist-pruned-long-ago`, 2]],
      want: {},
      staleCount: 1,
    },
    {
      name: "rule 4 — `distillate/` is NOT a dist bank (the anchored name, not a prefix)",
      files: [[`${W1}/distillate/notes.txt`, 100]],
      want: {},
    },
    {
      name: "rule 4 — build output INSIDE a dist bank is not counted as further banks",
      files: [
        [`${W1}/dist-head/_headers`, 9349],
        [`${W1}/dist-head/dist-nested/index.html`, 10],
      ],
      want: { "dist-loose": 1 },
    },
    {
      // The anti-vacuity control for rule 4: an estate with no dist banks at all must not
      // manufacture one, and an estate with a compliant one must stay silent.
      name: "rule 4 — an estate with no dist bank reds nowhere",
      files: [[`${W1}/crop.png`, 1024]],
      want: {},
    },
  ];

  let failed = 0;
  for (const c of cases) {
    const root = mkdtempSync(join(tmpdir(), "evidence-policy-selftest-"));
    try {
      if (c.wantThrow) {
        let threw = null;
        try {
          audit({ root, scope: SCOPE });
        } catch (err) {
          threw = err;
        }
        if (threw && c.wantThrow.test(threw.message)) {
          console.log(`[evidence-policy] self-test ok    — ${c.name}`);
        } else {
          failed += 1;
          console.error(
            `[evidence-policy] self-test FAIL  — ${c.name}\n` +
              `    want a throw matching ${c.wantThrow}, got ${threw ? threw.message : "no throw"}`,
          );
        }
        continue;
      }
      plant(root, c.files);
      plantText(root, c.texts ?? []);
      const r = audit({
        root,
        scope: SCOPE,
        images: c.images ?? [],
        waves: c.waves ?? [],
        dists: c.dists ?? [],
      });
      const got = {};
      for (const b of r.breaches) got[b.rule] = (got[b.rule] ?? 0) + 1;
      const wantStr = JSON.stringify(c.want);
      const gotStr = JSON.stringify(got);
      const rulesOk = gotStr === wantStr;
      const staleOk = (c.staleCount ?? 0) === r.stale.length;
      if (rulesOk && staleOk) {
        console.log(`[evidence-policy] self-test ok    — ${c.name}`);
      } else {
        failed += 1;
        console.error(
          `[evidence-policy] self-test FAIL  — ${c.name}\n` +
            `    breaches want ${wantStr} got ${gotStr}\n` +
            `    stale    want ${c.staleCount ?? 0} got ${r.stale.length}`,
        );
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }

  if (failed > 0) {
    console.error(
      `\n[evidence-policy] SELF-TEST FAILED — ${failed} of ${cases.length} case(s). ` +
        `The instrument is broken; do not trust a green from it.`,
    );
    process.exit(1);
  }
  console.log(
    `[evidence-policy] self-test PASS — ${cases.length}/${cases.length} cases.\n`,
  );
}

// ---------------------------------------------------------------- main

// THE FALL-THROUGH IS LOAD-BEARING. `--self-test` proves the instrument, it does not replace
// the audit: control MUST reach the real `audit()` below and the process MUST exit on ITS
// verdict. Two scripts in this estate have shipped an `exit(0)` at the end of their self-test
// and greened CI while auditing nothing. Do not add one here — `selfTest()` returns, and the
// only exits in this file are the instrument-broken exit, the breach exit, and the PASS exit.
if (process.argv.includes("--self-test")) selfTest();

let r;
try {
  r = audit({
    root: REPO_ROOT,
    scope: SCOPE,
    images: GRANDFATHERED_IMAGES,
    waves: GRANDFATHERED_WAVES,
    dists: GRANDFATHERED_DISTS,
  });
} catch (err) {
  console.error(`[evidence-policy] FAIL — the instrument cannot run: ${err.message}`);
  process.exit(1);
}

console.log(
  `[evidence-policy] scope ${SCOPE}/** — ${fmt(r.files)} png, ${fmt(r.totalBytes)} B ` +
    `across ${fmt(r.byWave.size)} wave bucket(s)`,
);
console.log(
  `[evidence-policy] caps ${fmt(PER_IMAGE_BYTES_MAX)} B/image · ${fmt(PER_WAVE_BYTES_MAX)} B/wave · ` +
    `name ban /-full\\.png$/`,
);
console.log(
  `[evidence-policy] banked dists — ${fmt(r.distDirs)} directory bank(s), ` +
    `${fmt(r.distArchives)} archive(s); form required: .tar.gz + md5, or ${TESTIMONY_FILE}`,
);
console.log(
  `[evidence-policy] grandfathered ${GRANDFATHERED_IMAGES.length} image pin(s), ` +
    `${GRANDFATHERED_WAVES.length} wave pin(s), ${GRANDFATHERED_DISTS.length} dist pin(s)`,
);

for (const s of r.stale) {
  console.log(
    `[evidence-policy] NOTICE stale pin names nothing on disk — delete the line: ${s}`,
  );
}

if (r.breaches.length > 0) {
  const byRule = new Map();
  for (const b of r.breaches) byRule.set(b.rule, (byRule.get(b.rule) ?? 0) + 1);
  console.error(`\n[evidence-policy] FAIL — ${r.breaches.length} breach(es):`);
  for (const [rule, n] of [...byRule].sort()) console.error(`    ${rule}: ${n}`);
  console.error("");
  for (const b of r.breaches) {
    console.error(
      `  ${b.rule.padEnd(18)}  ${RULE_TEXT[b.rule](b)}\n${" ".repeat(22)}${b.path}`,
    );
  }
  console.error(
    `\nRecrop to the pixels under audit; text-first for anything a number can state ` +
      `(EVIDENCE-POLICY.md). Do NOT raise a cap and do NOT add a grandfather line.`,
  );
  process.exit(1);
}

console.log(
  `[evidence-policy] PASS — every image, every wave and every banked dist within policy.`,
);
process.exit(0);
