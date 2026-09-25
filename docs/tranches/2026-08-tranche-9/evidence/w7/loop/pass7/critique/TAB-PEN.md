# TAB-PEN · pass-7 adversarial critique (§12, the tab's pen)

Critic: Opus. I'm not the designer or the prototyper. Subject: worktree `.claude/worktrees/wf_b6676cd9-8c6-17`
(base `1d0dc4fd` by the chair's §12 waiver), bank `pass7/prototype/TAB-PEN/pass7.diff` sha1 `f5bdbd76`.
Pass-6 record: the intake critic's 60 (`intake-owner-2026-09-23/critique/G-FAVICON.md`). U-10 applies: this
file retires nothing.

**Verdict: ADVANCE at 74, earned and no higher (60 → 74).**
- **Closed:** every intake row the lane touched. The 8 cascade escapes are RED, the loss is named, the
  anchor is restated on painted numbers, the touch icon is photographed and vendored, and H is built behind
  one const. Every number I re-ran reproduced to the thousandth.
- **What holds the number down:** the one CI row still has escape species. Two of them are ordinary HTML
  edits that ship no new icon, or a thick one, and read GREEN. The gate also decides two of the owner's ballot
  arms before the owner does.

## 0 · Re-measured (my own runs, bare)

| row | my reading | lane's claim |
|---|---|---|
| `lint:favicon` (= `check-favicon.mjs --self-test`) on the tree | exit 0; 26/26 plants RED, 2/2 NN GREEN | same ✓ |
| gate `--root` a fresh `git archive` of main `c31a92b9` | exit 1, 34 failures | same ✓ |
| arm H by one const (scratch copy, `ARM="H"`, `node scripts/icons.mjs`) | svg 510 B, PNG 2,470 B; gate a–e GREEN exit 0; `icons --check` (H) 0 | same ✓ |
| `icons --check` on the tree (W) | exit 0, png decoded max Δ 0 | same ✓ |
| dist diff, fresh builds (cacheDir + outDir in my scratchpad), tree vs main `c31a92b9` | `index.html` 2 link lines, +`icon.svg` +`apple-touch-icon.png` −`favicon.svg`; **45** other files byte-identical; `index-ChSrVSqM0j8q.js` both | lane printed "44"; the count is 45 (47 main files − favicon.svg − index.html). π holds by construction |
| served sha256 | `icon.svg` `856c8ad5…`, PNG `b07f52f9…` = sidecar | ✓ |
| G-TAB-4 served, `vite preview` tree :4240 · main :4247 · control `74a2b5d9` :4244 (`index-CubiZsMVSwTc.js`) | tree: `/icon.svg` 200 `image/svg+xml` 496 · `/apple-touch-icon.png` 200 `image/png` 2,473 · `/favicon.svg` 200 `text/html`. Main and control: html · html · `image/svg+xml` 1,961 | ✓ |
| bank | 81,631 B, sha1 `f5bdbd76`; `git apply --check` 0 on fresh `74a2b5d9` and `1d0dc4fd`; applied on `1d0dc4fd`, all 11 product files `cmp`-equal to the worktree; 12 diffs, 0 under `src/` | ✓ |
| battery, bare, on the tree | `lint:favicon` 0 · `lint:lanes` 0 · `lint:theme-tokens` 0 · `check-copy-register` bare 0 · `lint:sleep` 0 · prettier `--check` on the 7 touched files 0 · `eslint .` 0 · `lint:knip` 0 · `test:e2e:projects` 0 (35 specs / 553 tests) | ✓ (the control's exits are the lane's; I didn't re-run them) |

**T9-B28's loss, photographed by my own shooter and statistic** (`crit-shoot.mjs`, `crit-an.py`, `crit-an-16dpr1.txt`):
- The served `/icon.svg` against the control's served `/favicon.svg` (74a2b5d9), `<img>` at 16 CSS px, DPR 1.
- Two photographs per cell (Δ 0 in all 32). H and B are lab arms from the served W bytes, one variable each.
- Fringe = the keyed pixels under 4.5:1 against the arm's paper-only twin.

| 16 DPR 1 | chromium light | WebKit light | chromium dark | WebKit dark |
|---|---|---|---|---|
| main (74a2b5d9) | 0.289 (50/173) · cov 0.521 · core 16.08 | 0.385 (77/200) · 0.527 · 15.19 | 0.289 (50) | 0.382 (76) |
| **W / A = 4 (default)** | **0.375 (33/88)** · 0.226 · 17.90 | 0.360 (31/86) · 0.230 · 18.25 | 0.326 (28) · 14.83 | 0.337 (29) · 15.18 |
| B = 5 | 0.352 (37/105) · 0.285 · 18.99 | 0.360 (40/111) · 0.291 · 18.99 | 0.298 (31) | 0.339 (37) |
| H | **0.302 (26/86)** · 0.237 · 18.52 | 0.276 (24/87) · 0.239 · 18.25 | 0.247 (21) · 15.46 | 0.250 (21) · 15.18 |

The lane's table reproduces exactly, against the `74a2b5d9` control rather than main (the favicon is byte-equal
across `74a2b5d9..c31a92b9`). The painted AA reads core 14.8–19.0 on every cell, both themes, both engines.

## 1 · The one CI row still has escape species (the critic's plants, `crit-plants.mjs` / `crit-plants.txt`)

Each plant is a fresh on-disk copy of the tree's inputs, read by the gate through `--root`, with the sidecar
re-stamped just as the lane's own 26 plants do it.

| plant | what ships | gate |
|---|---|---|
| **C6** both `<link>`s wrapped in `<!-- -->` in `index.html` | **no icon at all** (the browser falls back to `/favicon.ico` → the SPA's html) | **GREEN, exit 0** |
| **C7** a second `rel="icon"` after ours, to main's thick `favicon.svg` copied to `public/thick.svg` | the thick s again; the link Chrome takes is the later one | **GREEN, exit 0** |
| **C1** `d="M8,6H24V26H8ZM8,11H24M8,16H24M8,21H24"`: five pen lines, the tab nearly solid | the owner's defect, "too thick", by mass instead of by stroke-width | **GREEN, exit 0** |
| **C2** a 180 PNG of four ink bars, paper and ink on the tokens, coverage ≈ 0.23 | a touch icon that isn't the s | **GREEN, exit 0** |
| **C5** H's path in the SVG with W's PNG kept | the tab and the home screen show different hands | **GREEN, exit 0** |
| C9 a second `@theme { --color-background: #f4efe4 }` in a file that sorts before `index.css` | depends on import order; the gate resolves by directory walk, not cascade | GREEN (C8, the same site sorting after: RED c) |
| C3 a `Z` at the same box and pen | letter identity; a source gate can't judge it (stated, not a gap) | GREEN |
| C10 a `.dark` site in an SFC retoning the ink | — | RED c ✓ |
| C4 T9-B28's own arm B, `stroke-width="5"` | the ballot's arm | **RED d** (stroke/H 0.200 outside [0.15, 0.17]) |

What this means:
- **C6 and C7 are the first-match class the SHAPE law exists to kill, moved into `index.html`.**
  - `readTree` takes the icon from the first `rel="icon"` regex match.
  - Clause e's link test is `links.some(…)` over a `<link>` regex that doesn't strip HTML comments.
  - NN2 proves the gate ignores a decoy in a *CSS* comment. No plant tests an HTML one.
- **C1, C2 and C5 refute the header's claim** (`check-favicon.mjs:31–32`, README "a PNG that isn't the s reds
  on CONTENT whatever the sidecar says").
  - The content check is three coarse statistics: corner paper, darkest pixel, and coverage ∈ [0.18, 0.32].
  - Only E5's solid-colour species is caught.
  - Nothing ties the PNG to the SVG except the sidecar, and nothing measures the SVG's own ink mass.
  - `icons --check` would catch C1, C2 and C5, but it's NOT-A-LANE and never runs in CI.
- **The cure is browserless and small (~40 lines):**
  - Raster the path analytically in the gate: flatten each C/Q to a polyline, and mark a pixel inked where its
    distance is ≤ pen/2, 4× supersampled at 180.
  - Require the PNG's decoded coverage to match it: mean |Δ| ≤ 0.02, IoU ≥ 0.97.
  - Hold the SVG's own coverage in [0.18, 0.32].
  - For C6/C7: strip `<!-- -->` before reading links, and require exactly one `rel~=icon` and exactly one
    `apple-touch-icon` (a token-list parse of `rel`).
  - For C9: RED when a token has two placed sites that disagree.

## 2 · The gate decides two of the owner's ballot arms (U-10)

- **Arm B.** Clause d's window [0.15, 0.17] is W's own 4/24 ± slack.
  - T9-B28's arm B (5/25 = 0.200) reds it (C4).
  - `icons.mjs` hard-codes `stroke-width="4"`, so B isn't "one const" either. It's an edit to the template,
    and then a re-cut of d.
- **Arm P.** Clause b ("one pen line": fill none, round caps) reds B-TAB-H's arm P by construction.
- **The consequence.** Only W and H can ship without re-wording the gate after the owner disposes. That's the
  intake critic's §4 finding ("ballots framed by gates built from the default arm") in CI form.
- **Lawful either way:**
  - key clause b/d's windows to an arm table beside `ARM` (W | H | B, with P as its own row set); or
  - print in both captions that choosing B re-cuts clause d and choosing P re-cuts clause b.

## 3 · The design-language half: my non-author reading (INTAKE-23 row 29's gate)

I read f1 (48 DPR 2, both engines, both strips) and f3 (180, photographed, both engines). Beside them I put the
served app at 1280×800 chromium light (the given digits: a monoline marker at 0.103–0.115, flat-topped 5s,
round joins, the same as `DigitCell.vue`'s `stroke-linejoin="round"`).
- **W reads as a generic rounded-sans letter tile at 48 and at 180.** This confirms the intake reading.
- **H doesn't read as the browser's fallback tile at 180.**
  - The flat top and the down-tick read as written, and as the digits' 5.
  - It reads as the board's marker, about 1.5× heavier (0.167 against the digits' 0.11).
  - The 0.1–0.6 u irregularity isn't visible at any size.
- **At 48 H reads as "an S with a squared top": marginal.**
- **Neither pen line carries the wordmark's hand** (Fraunces Black, grain). P does, but not its grain, and P′
  is unbuilt.

Row 29 is **PARTLY** closed. One non-author has read it: H is not generic at 180 and marginal at 48, and W is
generic. The owner disposes.

## 4 · Constraints

| constraint | reading |
|---|---|
| M16 | `check-copy-register` bare 0; no UI copy ✓ |
| filterBudget 9 | the icon carries 0 filters (main's carried 1, outside the DOM); dist assets byte-identical to main; lane's census 9 · 14 · 11 = `74a2b5d9` accepted on byte identity ✓ |
| AA, painted, both themes | core 14.83–18.99 across 16 cells ✓. The fringe row is T9-B28's named loss |
| π | dist diff: head only (2 `<link>`s) + 3 public files; `src/` 0 hunks ✓. I didn't re-run a whole-DOM computed-paint census. Against `74a2b5d9`, a DOM census would print W8's fold, not this family's |
| @property law · undefined-token census · W2 mechanics · R6/r0 | untouched (no CSS, no `src/`) ✓ |
| decided history | no r0 row moved ✓ |
| ballot pairs one payload, one variable | f2 A \| B (stroke-width) ✓, f3 W \| H (path) ✓, f1 W \| H \| P (P is a construction change, a third arm, stated) ✓ |
| legacy alias | `favicon.svg` deleted, not aliased ✓ |
| consumer-less substrate | the `knip.json` entry keeps `shape-census.mjs`'s 14 unconsumed exports live on this tree. It's LADDER's same act, declared, and it's the chair's row |
| `.gitignore` | the lane's own new negation sits under the "the one committed public PNG" comment it falsifies (INTAKE-23 §0.7h, the chair's) |
| evidence cap | w7 `*.png` = 2,330,935 B > 2,097,152 (the whole wave). This lane's three crops (37,484 B) net −9,400 B once the chair moves the retirees |

## 5 · Strengths (earned)

- **Every painted and served number reproduces**, independently shot, to the thousandth, against the named
  `74a2b5d9` control.
- **The intake's 8 escapes are RED on the SHAPE law, each with a real reason**, and 11 new plants plus 2 NN are
  in the same batch.
  - The style body goes through the estate's one parser. The formatting-only diff to the chair's
    `instruments/shape-census.mjs` is declared.
  - Colours are scored by ΔE, never by spelling.
  - Tokens are read at every declared site.
- **H is honest.** It's one const (verified), 510 B, no filter. It's the cleanest arm at the tab (fringe 0.302,
  count 26 against main's 50), and its remaining 0.013 loss is printed.
- **The loss is named in the ballot with both numbers.** G1's strike is proposed with its cost (1.58), not
  applied as law. M19 is stated.
- **The smallest possible product diff**, and the bank is cmp-equal to the tree.

## 6 · Gaps (each closable)

1. **C6/C7:** clause e passes an `index.html` whose icon links are commented out (no icon ships) or followed by a
   second `rel="icon"` to a thick SVG. Cure: strip HTML comments and require exactly one `rel~=icon` and one
   `apple-touch-icon`. Closes at C6/C7 RED as self-test plants.
2. **C1/C2/C5:** the SVG's ink mass is ungated, and the PNG isn't tied to the SVG except by the sidecar. Cure:
   a browserless analytic raster of the path at 180 against the decoded PNG (mean |Δcov| ≤ 0.02, IoU ≥ 0.97),
   plus the SVG coverage in [0.18, 0.32]. Closes at C1/C2/C5 RED, and the header claim at lines 31–32 becomes
   true.
3. **C9:** two placed `@theme`/`.dark` sites that disagree resolve by directory-walk order. Cure: RED on
   disagreement. Closes at C8 and C9 both RED.
4. **The ballot arms:** clause d reds T9-B28's arm B (0.200) and clause b reds B-TAB-H's arm P, and B isn't a
   const in `icons.mjs`. Cure: an arm table keyed windows, or both captions stating the re-cut.
5. **The loss:** H still loses to main on the 16 DPR 1 chromium-light fringe rate by 0.013 (0.302 vs 0.289),
   and W by 0.086 (0.375 vs 0.289). Named, and the owner's.
6. **Row 29:** one non-author reading (this file: H not generic at 180, marginal at 48). P′ (the wordmark's
   grain baked into an outline) is unbuilt, so no arm carries the wordmark's hand.
7. **G1:** the struck row awaits the chair's §0.7g ruling (tile on `#35363a` 1.58:1).
8. **The painted witness:** FADE80 GREEN in 4/24 cells; G4's 8 columns at 16 DPR 1 is the chair's instrument
   row (`glyph-pop.PROPOSED.diff`).
9. **M19:** Chrome's favicon service, Safari's tab and in-SVG query, iOS's web-clip mask, Android and Firefox
   are unwitnessed.
10. **The fold's collisions:** `scripts/shape-census.mjs` and `knip.json:84` with LADDER. The worktree's stray
    `.gfav-scratch/` and `docs/…/intake-owner-2026-09-23/` are the chair's to move.

## 7 · Discipline

- **Servers:** vite preview on 127.0.0.1 `--strictPort`: :4240 tree dist, :4247 main-archive dist, :4244 the
  shared control (identity `index-CubiZsMVSwTc.js`).
  - Killed by recorded PID: listeners 19818/19823/19853, npx 19720/19718/19716. All three ports read free.
- **Builds and cache:** outDirs and cacheDirs sat in my scratchpad (`tabpen-crit7/`).
- **Scratch configs:** the two-line config sat in `<work>/web/frontend/.tabpencrit/` and was moved to
  `<scratchpad>/trash-tabpencrit-1/`. The worktree's `git status` equals what it was at open.
- **Incident:** a first build attempt with the config outside the tree failed to load (Tailwind's plugin
  default import). No output was written.
- **Not done:** no commit, push, stash, install, `rm`, Safari, osascript, or git in the control tree.
- **Banked beside this file:** `crit-plants.mjs` / `.txt`, `crit-shoot.mjs`, `crit-an.py`,
  `crit-an-16dpr1.txt`. No images.
