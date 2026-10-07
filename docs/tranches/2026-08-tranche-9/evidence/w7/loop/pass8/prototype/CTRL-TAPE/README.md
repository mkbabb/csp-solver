# CTRL-TAPE · pass 8 prototype

Worktree `.claude/worktrees/wf_f72f3b5a-83a-27`, advanced in place from the pass-7 bank (tree `711834e8`).
Lane port 4230, control 4252 (HEAD control `w7-control`). Box load 30–87 (1 min) throughout.
Nothing committed, stashed or pushed.

## Gaps first

1. **Row 5 is RED at the chair's station, both engines, and the loss is named.** The foot ring is
   `outline: 2px dashed var(--ring-ink)` (`GameControlPanel.vue:2395`, every `.icon-btn`'s focus ring).
   At station 1 (the home's defaults, not re-parameterised), chromium's medians pass
   (4.145–4.379 on four bands, both themes), but **B4 HOLES reads 0.326–0.391 of every band**. The dash
   is the hole: 27–36 stations in 4–5 runs, longest 8, against a 0.02 cap. Chromium dark also reds B3
   on two bands (painted depth 1.32 and 1.67 css against 1.80). **WebKit reds B2 on every band, both
   themes** (light 1.286–2.063, dark 1.232–2.073, depth 0.41–0.94), reproducing pass 7 to the
   thousandth. The loss: **a dashed ring cannot pass B4 at station 1 by construction, and WebKit paints
   its dashes thinner.** The cure is a solid ring. That is the estate ring's form, not the tape's, and
   this lane did not take it. The control is worse (chromium B3 0.24–1.24 on the card ground; WebKit
   paints no ring at all, 1.00 on every band). Every plant reds on both sides, which tells nothing
   when the clean read is already RED.
2. **The 844×390 G3 cell has no crib to read.** The `i` is `!mobile` and fine-pointer only, so at
   844 wide the crib does not exist. The row detects that and NAMES it absent; it does not read it
   green. 1440×900 is read (row 4 below).
3. **The pw-projects floor band reds on the tree (WGATE's restamp).** Chromium floor 214 against a
   live 258, webkit 212 against 256. The new rows grew both projects past the 85 % band. The script
   restamps "WGATE only", so the lane does not restamp. The control exits 0.
4. **doc-truth: 6 RED on the tree, 0 on the control.** Four reds are counts the fold re-derives:
   - README e2e counts: 518 tests against the 476 stated;
   - the e2e total: 589 against 547;
   - `scripts/` holds 24 `.mjs` against the 22 stated (the gate and the library now live in `scripts/`);
   - CH-19's `index.css` bound: 598 code lines against the pinned 576 (pass 7's).

   The other two are the worktree's environment: no `csp-solver/wasm/pkg` is built here.
   The lane writes only under its evidence dir, so it edits no doc.
5. **The merged tree's CSS carries seven minted utility rules that no product source asks for, and
   every one comes from s10's own files.** The on-s10 delta touches none of those files.
   - The rules: `backdrop-filter`, `antialiased`, `font-[Comic_Sans_MS]`, `font-[600]`, `font-serif`,
     `font-[var(--face-written)]`, `font-[…]`.
   - Their sources: `face-law.spec.ts`, `check-face-engine-identity.mjs`, `check-font-coverage.mjs`.
   - `.inset-ring` also appears; the control ships it too, from `check-theme-tokens.mjs`.
   - Tailwind v4 scans `scripts/` and `e2e/`. The tree's own dist equals a product-only build except
     `.inset-ring`.
   - This is FACE's row, handed to the chair.
6. **INTAKE-22 row 22 (the junction): the mechanism is named, and the wording is the chair's.** See §INTAKE-22.
7. **INTAKE-22 row 23: the substance is ported and the file is not.** The tree has no `tool-strip.spec.ts`.
   The substance is "every row has a control that changes the verdict". It lands as:
   - the foot's painted-bottom row, whose four paint-verified plants must RED in-run and whose tree
     must hold again after they are removed;
   - the inset row's negative;
   - keys-crib G3's F1 plant;
   - the gate's 93 plants and its 10/10 clause sabotage.

   Born-RED 11/11 on HEAD is not re-run: there is no file to run.
8. **FACE's `face-law.spec.ts:1941` reds `typecheck:e2e` on s10 itself** (TS2339 `remove` on `Node`).
   It reds on the merged tree for the same reason. The lane does not touch FACE's file.
9. **Graft 3 asks after every Deal at a fine pointer.** `isDirty` is `undoDepth > 0`, and a deal
   counts. Seven estate rows failed on it until they learned to answer. The narrower dirty
   ("player-written since the deal") is a ruling on W1 §1.5 against T9-M12's wording. That ruling
   is the chair's; see §Blast.

## Numbers

| row | reading | control |
|---|---|---|
| 1 gate | `check-tape-foot` keyed on template ELEMENTS through `scripts/shape-census.mjs` (the home, `./shape-census.mjs`; the vendored `scripts/lib/shape-census.mjs` DELETED). Live GREEN on the tree and on the merged tree. Self-test **93 plants RED** (pass-6 23, K1–K15, N1–N11, R1–R5, **F1–F4 the flex seam's own clause**, the critic's **29 siblings** S1–S16, C1–C10); **clause sabotage 10/10** (bites 1:15 2:3 3:15 4:8 5:1 6:1 7:5 8:29 9:10 10:6), on the tree and again on the merged tree | no gate (exit 1) |
| 1 library | the TAPE clauses PROPOSED in the home: closed-context, class-writes, class-ternary, self-close, ws-combinator (a real bug: `:deep(x)`'s double space left an empty compound that matched every element), param-carried (a `setProperty(name, v)` through a local function resolves at its literal call sites, or stays UNRESOLVED; FACE's `put` at `GameControlPanel.vue:894` on s10). Self-test **98/98, 46/46 clauses planted**; library sabotage **46/46** | — |
| 2 painted bottom | ink present, spanning the bar's four sides, lowest ink ≤ vh and ≤ the foot's bottom, the bar on its seat, verbs ≤ vh. Dock 390×844: ink 758.25–839.5, foot to 844.16, verbs 829.77. Landscape 844×390: 294.75–382.5 of 390, verbs 369.61. Rail 1440: 685.75–764.5 of 900. Rail 1280: 620.75–699.5 of 800. Every plant RED in-run on every cell, both engines (**S10** no ink / frame not spanning; **S2** top ink below the bar's top; **S14** bar 46 px off its seat, verbs 875.77 of 844; **F1** verbs 963.78–1432.3 past vh); the tree holds again after each. 36/36 (×2 repeat) | 18/18 RED (no `#card-foot`) |
| 3 ring | see gap 1 | see gap 1 |
| 4 G3 (merged tree) | 1440×900 fine, post-paint through the home: open 0 px / 42 f, close 0 px, in-rAF 0/0; **in-run F1 plant** (`.drawer-case{display:block}`) 103.73 px chromium / 103.67 webkit; removed → 0/0. 844×390: NAMED absent (gap 2). keys-crib whole 16/16 both engines | — |
| 5 INTAKE-22 row 20 | every arm: 390×844 and 430×932, DPR 2 and 3. Chromium CDP inset 34: the shipped 0.75rem clears **4.5 / 4.67 css**; the 0.625rem arm clears **2.5 / 2.67**; the negative (`max(0.75rem, env())`) reds 12/12. WebKit, the FLAT PHONE at inset 0 (no override exists; its annotation says so): shipped **4.0–5.0**, 0.625rem **2.0–3.0**, exactly 2.0 at 430×932 DPR 3 | 18/18 RED |
| 6 lapse | e2e ARM 3 drives `activeElement === body` (a keyboard arm, then `blur()`): the ribbon stands; after the lapse, focus returns to "Deal a new board". Unit 38/38; born-RED 5 fails on the pass-7 panel; mutant m1 (body = moved on) reds the body row; m2 (pass-6 always-home) reds the moved-on row | — |
| 7 sampler | keys-crib's `sampleVerbs` re-pointed to `postpaint.mjs`'s `installSampler` (`post` = a task queued from each rAF; `inRAF` printed, not gated; the rest frame read before the press). `postpaint.d.mts` PROPOSED as a superset of NOTE-ERASE's | — |
| 8 ballots | NUMBERS ONLY, no frame, headroom spent **0 B**. The third arm (T9-B13, the voice): this tree's case outline carries **8 ARIA headings** at rail 1440 and dock 390 (`new game, size, level, pencils, marks, what fits, checking, players`); the control **2** (`Size`, `Level`); s10 and the merged tree 2 (pass 7's reading; the on-s10 delta changes no heading). `readings/voice.txt` | 2 headings |
| 9 grafts | (1) ARMED by construction: the ribbon replaces the verbs and paints the ask at every pointer (the fine 1440 row: "clear the board?" inside the bar, verbs 0, notes 0). (2) the input split, pinned by a unit row (`detail` 1 vs 0). (3) the pointer-agnostic ask LANDED (`props.isDirty && !armed`, no `isCoarse`), unit born-RED. Blast radius in §Blast | control: fine one click |
| 10 census | bare on the tree: `--tap-floor` ×2 (`ConfirmRibbon.vue:140/141`) and `--washi-tag-h` (`GameControlPanel.vue:1853`), exit 1. With the PROPOSED rows: **0 findings + 1 STALE** (`--refuse-dur`, inherited). On the merged tree: 1 finding (`--motion-whisper` `GameControlPanel.vue:3086`, FACE's, §13's block) + 2 STALE (`--refuse-dur`, `--washi-tag-h`) | 0 + 1 STALE, exit 1 |
| 10 viewport-law | tree: 2 red rows, both §2.6 (pencils tape `position: static`, tagVisFrac 0 at 1440 and at 375, while "new game" stays sticky). Merged tree: whole file green. Reconciled: the tree's own voice lays four tapes and pins one; the fold carries FACE's pin band | see §Blast |
| 11 banks | §Bank | — |
| goldens (row 26) | visual-golden 4/4 on the merged dist and 4/4 on the control (chromium only: the golden config is chromium-only by design, the carried row). visual-regression merged 24/24; control 20/24 (4 FACE rows born-RED) | |
| unit | full vitest: tree **835 / 68 files**, control 830 / 68 | |
| battery | see §Battery | |

## Battery (bare; tree = the final bytes' archive, then the re-cut specs re-linted; control = `w7-control`)

| gate | tree | control |
|---|---|---|
| `npm run lint` (prettier src/ scripts/ ../../scripts ../relay) | 0 | 0 |
| `eslint . --max-warnings 0` | 0 (the first run: 1, two unused imports in the gate, cured) | 0 |
| lint:boundary · typecheck:e2e · typecheck:node · knip | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 |
| lint: ink · catch · theme-selectors · theme-tokens · lanes · motion · copy · live-regions · tdz | all 0 | all 0 |
| lint:sleep | 0 (the first run: 1, an 80 ms sleep in `footSettled`, now two painted frames) | 0 |
| lint:tape-foot (self-test) · the gate live | 0 · 0 | 1 · 1 (no gate) |
| test:e2e:projects | **1** (FLOOR BAND 214/212 vs live 258/256, WGATE's restamp — gap 3) | 0 |
| test:e2e:retries · support-floor · font-coverage | 0 · 0 · 0 | 0 · 0 · 0 |
| vitest (full) | **835 / 68 files**, 0 | 830 / 68, 0 |
| `vue-tsc -b` (archive) | 0 | — |
| ledger-diff --verify-cites | 0 (worktree; 2 in a git-less archive) | 0 |
| check-doc-truth | **1** (6 RED — gap 4) | 0 |
| check-evidence-policy · check-inline-tests | 0 · 0 | 0 · 0 |
| shape-census self-test · sabotage | 98/98 · 46/46 | — |

## INTAKE-22 rows 18–26 (TAPE's)

- **18** (the foot on paint; the gate): CLOSED. The gate is element-keyed through the home with 93
  plants, including the 29 siblings, and 10/10 clause sabotage.
- **19** (the named deltas): not re-measured. The foot's geometry is printed per cell in row 2.
- **20** (the foot on the inset): CLOSED on every arm (the table). The smaller pad that clears 2 css
  is 0.625rem, and at WebKit 430×932 DPR 3 its margin is 0. The shipped 0.75rem clears with a 2.0–3.0
  css margin in both engines. `env(` is in `scene.css`.
  - RUNSHEET line (proposed for the chair's `evidence/w8/device/RUNSHEET.md`): "iPhone (Face ID), Safari,
    portrait and landscape, drawer open: the controls' drawn frame shows ≥ 2 px of daylight above the
    home indicator; photograph the foot at rest."
- **21** (the notes vs the lip's stroke): not re-read.
- **22** (the junction): the mechanism is NAMED.
  - Where: chromium, land844, scroll fraction 0.9, one column of 1676 at x 840.5. The other 23 poses
    read 6.5–8.5 css; land844 at fraction 0.25 is blind in both engines.
  - What: a scrolled `div.outline-container.tray-well` (its svg spans y 256.16–334.52) crosses the
    card's bottom edge at 305.23. The scrollport clips its right SIDE stroke at rows 291–303. The lip's
    svg starts at 301.23, its 4 px outset reaching into the scrollport band, and the lip's
    top-right corner begins at 303.5 in the same column.
  - Why: both outlines end at x = 840, bar.right 836 + the 4 px outset. The zero is two vertical flanks
    meeting in one column. It is not a bottom-stroke-to-lip gap.
  - Proposed wording for the chair: "painted daylight ≥ 4 css in every column between a well's
    BOTTOM stroke and the lip's top, where a column whose well ink is a side stroke cut by the
    scrollport is a flank, not a gap".
- **23** (the spec's controls): substance ported, file absent (gap 7). OPEN on the letter.
- **24** (code at fold): PROPOSED as before.
- **25** (the crib-first-row cure): ✓. G3 is 0 px in both engines on the merged tree.
- **26** (the estate rows the move exposes): goldens re-run, 4/4 merged and 4/4 control. The move's
  selector debt is cured on this tree: 11 `.controls-card button[aria-label=…]` sites (Solve, Fill,
  Share) and share-truth's verb locator, re-aimed to `.drawer-case` exactly as s10 re-aimed them. §Blast.

## Blast (graft 3's radius, and the move's selector debt)

- **What graft 3 does to the estate.** `isDirty` is `undoDepth > 0` (`useGameState.ts:332`), and a
  Deal goes on the spine. A freshly dealt board is therefore dirty, and at a fine pointer every Solve,
  Fill, Clear or Deal after a Deal now asks first. Probe at 1280×800 fine: Solve after a Deal shows
  "fill in the whole board? keep solve" at 250 ms and does nothing on the press (`instruments/probe-solve.mjs`).
  The pass-7 bank and the control solve on one click. The control asks the same way at coarse
  pointers today. **This is a ruling for the chair:** W1 §1.5 reads "a dirty board arms", and the dirty
  signal counts the deal. The owner's T9-M12 says "input a value … then attempt a destructive action".
  Narrowing dirty to "player-written since the deal" is a `useGameState` change the lane did not make.
- **The move's selector debt (pass 7's, never run).** The foot left `.controls-card`, and 11
  `.controls-card button[aria-label=…]` sites (Solve ×7, Share ×3, Fill ×1) plus share-truth's verb
  locator timed out. They are re-aimed to `.drawer-case`, byte-equal to the lines s10 already carries.
- **The runs** (16 spec files, 320 tests):

  | tree | reading |
  |---|---|
  | tree, pre-cure specs | 274 passed / 42 failed / 4 skipped: 40 selector timeouts + graft 3, and 2×2 viewport-law §2.6 |
  | tree, re-aimed | chromium 61/7; the 7 are graft 3 (Solve after a Deal: sudoku-interaction ×5, affordances ×2) |
  | tree, re-cut | the two files learn the ask (`pressDestructive`: press, then answer with the verb's own word when a question stands). 64/64 both engines. futoshiki, multiplayer, permalink and share-truth on WebKit 35/35 |
  | control, pre-cure specs | 266 passed / 50 failed: every red is this tree's own new row, born-RED (foot rows, the ask rows, the §2.5b tape band, the iPad seam) |
  | merged tree (s10 + on-s10), 17 files incl. keys-crib | **336 passed / 0 failed / 4 skipped, both engines** (10.2 min at load 40–87) |

- **Left on the tree:** viewport-law §2.6 ×2 per engine (the pencils tape `position: static`,
  tagVisFrac 0). It is green on the merged tree; row 10 reconciles it.

## The A.3 row (chair ruling 12; the chair mints the id)

| (next free after T9-R9) | OPEN → the W7 fold (PROPOSED at the pass-8 record) | `--tap-floor` is read bare twice, at
`ConfirmRibbon.vue:140–141`, and declared once, at `.page-root` (`App.vue:1020`). The undefined-token
census reads it as an INHERITED cross-file row, `--tap-floor :: App.vue -> games/shared/ConfirmRibbon.vue`.
The row is LIVE on TAPE's tree and on the WAVE union (`74a2b5d9 + s10 + pass8.delta.on-s10`), and STALE
on any tree without the ribbon. Readings: tree 0 findings + 1 STALE (`--refuse-dur`); union 1 finding
(`--motion-whisper`, FACE's §13 slot) + 2 STALE (`--refuse-dur`, `--washi-tag-h`). Trigger: the ribbon
mounted outside `.page-root`, or the declaration moved |

## Bank

See `BANKED.txt`.

- Tree `a6dc0c53`. s10 base `7f149a7f`. Merged tree `dc781cd5`.
- `pass8.diff`: 676,019 B, sha1 d8e58cf3, 41 files +12,145/−735, 74a2b5d9 → tree.
- `pass8.delta.diff`: 457,252 B, sha1 cfbae5a6, 21 files +8,580/−1,009, 711834e8 → tree.
- `pass8.delta.own.diff`: 168,837 B, sha1 f36a9565, 15 files +1,902/−1,016, net of the chair's homes.
- `pass8.delta.on-s10.diff`: 466,501 B, sha1 7eccc68f, 21 files +8,713/−1,050.
- `git apply --check` exits 0 for each on a fresh archive of its base, and each replay is byte-equal
  to its tree.
- The plain delta and the cumulative exit 1 on s10, as they must.
- Dist: the tree is `index-DsvO0RL8r_bB.js` / `index-C6DCWDyewgP3.css`; the merged tree is
  `index-DnfQ4D5OcO50.js` / `index-3l5Mtxqm0Z8U.css`. Both were rebuilt from the final bytes and are
  identical to the served builds.

## Replay route

1. `git archive 74a2b5d9`, then `git apply --binary pass8.diff`, which is byte-equal to the tree.
2. On `711834e8` (the pass-7 bank), `pass8.delta.diff`.
3. On `74a2b5d9 + pass7/integrate/s10.diff` (temp-index tree `7f149a7f`), `pass8.delta.on-s10.diff`.
   The plain delta refuses there at `zone-grammar.spec.ts:1409`. The rebased one is the delta with
   zone-grammar three-way merged (both EOF blocks kept), keys-crib's sampler and G3 row, and
   `postpaint.d.mts` added.
4. Build: `instruments/build.sh` (a private cacheDir, out of tree). Serve: vite preview with `--strictPort`.
5. Specs run through `instruments/pw.config.ts`, with `TAPE8_BASE` and `TAPE8_E2E` set.
6. Ring: `instruments/ring8-battery.sh <label> <port>`. Junction: `BASE=… node instruments/junction8.mjs`.
7. Voice: `node instruments/voice8.mjs tree=http://127.0.0.1:4230`.

## Instruments (every import path)

- `e2e/lib/paint-lib.mjs` (`onOff`, `maxDelta`, `settle`): the foot rows, via `./lib/paint-lib.mjs`.
  Typed by `e2e/lib/paint-lib.d.mts` (PROPOSED, NOT-A-LANE).
- `e2e/lib/postpaint.mjs` (`installSampler`): keys-crib, via `./lib/postpaint.mjs`, on s10.
- `e2e/lib/edge-bands.mjs` (`edgeGate`, `EDGE_PLANTS` incl. `DASH_1IN8`): `ring8.mjs`, by its path in
  the worktree.
- `scripts/shape-census.mjs`: `check-tape-foot.mjs`, via `./shape-census.mjs`.
- No `docs/` import in `e2e/` or `scripts/`.

## Incidents

- **A shell `&` inside a `run_in_background` launch** of the gate's sabotage battery (pass-8 opening).
  It finished, exit 0.
- **Pass 7's own dist was Tailwind-contaminated** by the gate's strings (`overflow-hidden`, `pb-0`,
  `backdrop-filter`). The cure is J-split plant strings. The tree's dist now equals a product-only
  build except `.inset-ring`, which the control ships.
- **Prettier was not idempotent on `check-tape-foot.mjs`.** The second `--write` converged.
- **A WebKit rail-1280 clean red was an instrument artefact.** The case outline's boil read as the
  frame's ink (755.75 > 748.16). The cure hides the case outline during reads (`CASE_QUIET`).
- `ledger-diff --verify-cites` exits 2 in a git-less archive and 0 in the worktree. This is environment.
