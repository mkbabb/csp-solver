# CTRL-FACE — pass 1 (PROTOTYPE) · printed and written

Arm D, built as product files and RUN. Everything below was measured on this prototype on
2026-09-17, chromium and webkit, against a dev server serving the worktree itself
(`127.0.0.1:4242`, `--strictPort`; 4230–4241 and 4243–4249 were held by concurrent lanes). The
control is HEAD `aab67b92`, served the same way from a `git archive HEAD` tree with the same
node_modules and puzzle bank, so every delta below is this diff's and not the lane's.

**Worktree** `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-34`
· branch `worktree-wf_e58b4764-0fc-34` · NOT committed (`git -C <worktree> diff --stat` is the artifact).

**Verdict: the voice lands, the geometry does not pay for itself.** Every row the spec claims for
the FACE is green at every cell in both engines — one voice, the ratio at 900×500, the ransom
note cured, a gate that can see a face re-point, the hand's weight, the scribble's overrun, the
tap floor, contrast. One standing gate goes RED that HEAD passes: the iPad coarse card breaks the
P1 seal by **+49.25px** (chromium) / **+49.13px** (webkit), and the breach prices by ablation to
two declarations, both this family's.

---

## 1. What was built

`proto/ctrl-face.diff` (+ `ctrl-face.diffstat.txt`). Ten files, **+411 / −142**:

| file | + | − | what |
|---|---|---|---|
| `src/assets/typography.css` | 40 | 44 | the FACE LAW block; `--type-group-title: var(--type-heading)`; `--type-option: 1.25rem`; **two media-query blocks die**; `.section-heading` reads `--face-printed`/`--printed-weight`; the stale `:250` header corrected |
| `src/assets/index.css` | 46 | 15 | both `unicode-range`s + the @font-face ledger; `.heading-value`'s quiet ink hoisted into `@layer components` |
| `src/pencil/sheet/SheetWashiLabel.vue` | 15 | 4 | `.washi-tag` printed face/rung/weight; `line-height: var(--washi-tag-lh, 1.5)`; the pull reads the same variable; **the 500 ask of a 400 face dies** |
| `src/games/shared/GameControlPanel.vue` | 77 | 26 | `--washi-tag-lh` on `.tray-well`; `.zone-row-label` printed; `.heading-value` lowercase + the 150ms ink; the two tab-row bindings; `headingClass`'s non-crayon arm → `text-foreground`; **the CAD underline dies**; the hover lift fenced to `[aria-expanded="false"]`; `.tray-well:first-child` 0.35rem → **1.5rem** |
| `src/pencil/chrome/OptionSelector/OptionSelector.vue` | 44 | 22 | `.ctrl-btn` reads `--face-written`, 400, lowercase (**the `"Fira Code"` literal dies**); the `.ctrl-word` span carries the marks; **`font-bold`, `rounded-md`, `--scribble-width`, `--ghost-width` die** |
| `scripts/check-font-coverage.mjs` | 165 | 10 | `washiTags` + `optionLabels` extractors, the corpus moves, and **CHECK 6** (the spec's "check 4"; five checks were already numbered) |
| `e2e/font-census.spec.ts` | 12 | 16 | eleven ledger rows retired (§5) |
| `e2e/zone-grammar.spec.ts` | 12 | 5 | `:text-is()` re-aimed at `.ctrl-word` (§5) |
| `fonts/fraunces-subset.woff2` | — | — | 14,636 → **14,896 B** (+260), 30 → 31 codepoints, **U+0070 present**, `fvar opsz 9..144 / wght 100..900` intact |
| `fonts/patrickhand-subset.woff2` | — | — | 4,312 → **4,896 B** (+584), 46 → 53 codepoints (+A E H L M N O) — **not in the spec** (§5) |

**The spec's "net LOC negative" is refuted**: src alone is +222/−111. The declarations die as
written; what replaces the lines is the estate's covenant comment.

---

## 2. The gates, with their numbers

| gate | reading | verdict |
|---|---|---|
| **heading-voice ROW 1** (desk-1280×800, dock-390×844, **land-900×500**) | `1 voices: ["Fraunces · 25.89 · 800 · lowercase"]`, 8 names, 3 cells × 2 engines | **GREEN** |
| **heading-voice ROW 3** | namePx 25.89 / optionPx 20 = **1.2945** at all three cells, both engines (HEAD: 1.0175 dock, 1.1768 landscape) | **GREEN** |
| heading-voice ROW 2 | `2 of 8 group names are document headings` at every cell — unchanged, W3's, **not claimed** | RED, recorded |
| **check-font-coverage CHECK 6** | HEAD: `FAILED`, exit 1, 13 problems (the `.ctrl-btn` literal, `.zone-row-label`'s hand, `.washi-tag` declaring no face, `p` ×2, 8 option capitals). Prototype: `OK`, exit 0 — Fraunces 31 cp / 14,896 B, Patrick Hand 53 cp / 4,896 B | **born-RED → GREEN** |
| **printed count** | visible printed nodes: **7/8 dock-390 · 7/8 dock-375 · 8/8 dock-430 · 3/8 land-900×500 · 4/8 desk** — one computed size (25.89), one weight (800), both engines | **GREEN** (≤ 8) |
| **tape net flow** | Δ vs HEAD per tape = **−0.07px** at every mobile cell, **0.00px** at the desk, both engines (covenant ±0.25) | **GREEN** |
| **tape ∩ tab-head** | **0 px²** at 390×844, 375×812, 430×932, both engines (the research measured 758px² before the first-well repricing) | **GREEN** |
| tape ∩ any other control | **not green** — the `checking` tape's box cuts 3.05px into the `candidates` caption (414.6–416.1px²) at every mobile cell; desk: `checking`∩`off` 692px², `players`∩`live` 626px². HEAD: zero. Paint verdict in §4 | **RED** |
| **scribble overrun** | every chip that paints a mark: **1.176 – 1.228** at 390-coarse and 1280, both engines (band 1.10–1.30; HEAD's Fira Code 1.17–1.33) | **GREEN** |
| **hand weight** | every `.ctrl-btn` computes `Patrick Hand · 20 · 400 · lowercase`, radius `0px`, at all five cells both engines; `.heading-value` likewise | **GREEN** |
| **ransom advance** | `p` at 25.888/800: **16.714** (chromium) / **16.719** (webkit) under the Fraunces stack vs **17.022 / 17.027** under Georgia. 20 glyph readings, **0 fellBack** | **GREEN** |
| **font-census ledger** | both directions, two games, two regimes, both engines — with **11 rows retired** (§5) | GREEN, ledger CHANGED |
| **filter census** | `filterBudget.ts` exact, area and all, board + picker + coarse, both engines — 8/8 | **GREEN** |
| **44px tap floor** | dock-390 44.00×44.00 (HEAD 44×44) · land-900×500 **50.41×45 → 44.00×44.00** · desk fine 130.52×38 unchanged (the per-dimension negative control) | **GREEN**, zero headroom left |
| **access 2.3 contrast** | the estate's own resolver: light + dark, both engines, 4/4 pass. This lane's paint read-back over **160 nodes**: min **4.659** (muted: shut head + unselected chips, light), **0 nodes under 4.5** | **GREEN** |
| **R7 I1** (1440×900) | `GREEN — 1 voices at 1440×900: 25.888px|Fraunces|800` (HEAD: 3 voices) | **GREEN** |
| R7 I2 | `ownChrome=false`, worst group coverage 75.2% (players) — **not claimed** | RED, recorded |
| **visual-regression** (24 tests × 2 engines) | HEAD control **24/24**. Prototype **21/24**: the iPad seal fails in both engines (§3); `grid draw-in` failed once in webkit under 9 parallel workers and **passes on re-run** (flake) | **RED on the seal** |
| zone-grammar | 16/16 both engines, including both 44px-floor rows with their negative controls and the heading lock | **GREEN** |
| vue-tsc `-p tsconfig.json` | exit 0 | GREEN |
| `vitest run` | **Test Files 66 passed (66) · Tests 810 passed (810)** | GREEN |
| `lint:copy` | 0 em/en dashes, 0 unadmitted jargon; **zero strings minted** | GREEN |
| `lint:ink`, `lint:motion`, `eslint .`, `prettier --check` | all exit 0 (prettier wanted `--write` on three files; re-checked green, and the coverage gate re-run green after) | GREEN |

Contrast by site, measured from paint (ground = the modal pixel with the node's ink turned
transparent; ink = the glyph's own core), light / dark:

| node | light | dark |
|---|---|---|
| printed name ON the tape (16 readings) | 11.006 – 17.362 | 9.122 – 10.284 |
| tab head OPEN (foreground) | 19.451 | 15.839 |
| tab head SHUT (muted) | **4.659** | 7.681 |
| shut value word (`easy`, green crayon) | 4.984 | 10.089 |
| row caption, printed | 19.451 | 15.839 |
| chips selected / unselected | 10.885 – 19.451 / **4.659** – 19.451 | 13.645 – 17.314 / 7.681 – 15.839 |

---

## 3. THE ONE REGRESSION, PRICED

`e2e/visual-regression` test 10 — "the iPad coarse card stays under the P1 seal" — reds at
1280×800 coarse: **1276.75px chromium / 1276.63px webkit against the 1227.5px seal**. HEAD passes
the same test on the same lane. In-page ablation at that cell (`readings/ipad-price.jsonl`), both
engines within 0.12px:

| reverted in-page | card | price |
|---|---|---|
| as built | 1276.75 | — |
| `.tray-well:first-child` 1.5rem → 0.35rem | 1258.34 | **18.41px** |
| the two captions back to the hand rung | 1245.50 | **31.25px** |
| the four tapes back to the hand rung | 1276.75 | **0.00px** |
| all three | **1227.09** (under the seal) | 49.66 = 18.41 + 31.25 |

Read it straight: **the tape's re-facing costs nothing in flow** — the pull/leading repair does
exactly what it claims, at every cell. The whole breach is (a) the first well's repricing, which
the collision gate demanded, and (b) the two row captions at the printed rung. The spec capped the
first-well re-price at ≤ 0.5rem; 0.35rem leaves the tape 6.79px INTO the tab head and 1.2rem
clears by 0.4px, so 1.5rem was chosen for the pose that clears by construction (the tape unpinned
at rest). Pass 2 picks: the caption's rung, the caption's lane, a first-well number that clears on
less — or the seal is re-priced on purpose, the way T6 and mark 13 re-priced it.

---

## 4. The tape's second collision, settled in paint

The box reading says the `checking` tape overlaps the `candidates` caption by 414.6–416.1px²
(3.05–3.06px deep) at every mobile cell. Three rects, measured (`readings/ink-overlap.txt`):
painted bbox ∩ caption line box **407.6px²**; the tape UNROTATED ∩ the same **243.2px²** (1.8px
deep) — so most of the depth is the ±1.5° tilt inflating an axis-aligned rect.

The pixel test settles it (`readings/tape-paint.txt`, dpr 3, the caption's own clip, every tape
hidden as the control): the caption's ink occupies rows **16–75 of 96**; the tape's paper begins at
row **93** (chromium) / **91** (webkit) — **no glyph is covered, clearance 6.00 / 5.33 CSS px**.
What IS true: the tape's paper now enters the caption's line box by ~1.0–1.7 CSS px where HEAD had
daylight, and `candidates` survives because it has no descender. The `players` tape ∩ the `off`
chip is 9.47px of BOX (the chip's 44px tap floor) and, at the word, 7.2–7.3px² of line box at 375
and none at 390 — the tape's paper never reaches it (`flatVsInk: null`).

---

## 5. Where this prototype departs from the spec — five, each measured

1. **The scribble is `120%`, not `calc(100% + 6px)`.** A constant overshoot cannot hold a RATIO
   band across words 17–52px wide: measured, `calc(100% + 6px)` reads **1.347 under `off`** and
   **1.116 under `normal`** — outside the spec's own 1.10–1.30 at the top. `120%` reads
   **1.176–1.228** on every painted chip in both engines at both cells. The gate refuted the
   spec's arithmetic before the crop did.
2. **`.tray-well:first-child` is 1.5rem, over the spec's ≤ 0.5rem cap.** Swept: 0.35 → −6.79px
   gap · 0.85 → −5.20 · 1.20 → +0.40 · 1.50 → +1.13 · 2.00 → +1.13. It stops moving at 1.5rem
   because that is where the first tape is no longer pinned at `scrollTop 0`. Cost: 18.41px of
   the iPad breach (§3).
3. **Patrick Hand was re-cut (+584 B), which the spec said cost nothing.** The option VALUES
   entered the coverage corpus, and the gate's both-cases rule wants their AUTHORED initials
   (A E H L M N O) — `selectors.ts` keeps `Easy`, so the cut has to hold `E`. Self-hosted total
   22,572 → **23,416 B (+844)**, not the +420 the spec priced.
4. **`e2e/font-census.spec.ts`'s ledger is not unchanged — eleven rows retired.** Seven
   `Fira Code|…` live-zone rows (the chips left that face), `Patrick Hand|Easy|Medium|Hard` and
   `Patrick Hand|H` (the re-cut), plus two CONDITIONAL rows. The spec's gate said "exact-match
   unchanged"; the truthful version is "the ledger's option-chip population is GONE and the
   backward arm proves no row went stale".
5. **`e2e/zone-grammar.spec.ts` needed a selector change.** `:text-is()` matches the smallest
   element carrying the text, so wrapping each label in `.ctrl-word` left
   `.ctrl-btn:text-is("Live")` matching nothing and timed the row out in both engines. Re-aimed at
   `.ctrl-btn:has(.ctrl-word:text-is("Live"))`. Worth banking: the engine reads `textContent`, so
   the CSS lowercasing changes nothing about what a selector finds.

---

## 6. The poses (4 crops, ≤ 78 KB each, 170 KB total)

1. `p1-dock-390x844-dark-size-open-armD-chromium.png` — `new game` printed ON the tape at the
   desk's rank; `size` open at full press, `level` shut and muted with `easy` written beneath in
   the green crayon; the chips written, `9×9` scribbled.
2. `p2-dock-390x844-dark-level-open-armD-webkit.png` — the switch: `level` open wearing its tier's
   ink, `size` shut with `9×9` written beneath in quiet graphite. No underline anywhere.
3. `p3-rail-1280x800-light-armD-chromium.png` — the flattening question re-asked: the wordmark
   (52px, the only boiling word) over `new game` and `size` at 25.89, `level` in its crayon.
4. `p4-land-900x500-dark-armD-webkit.png` — the ratio cell nobody had measured: 25.89 / 20.

Both engines were shot for every pose; the four banked are one per pose (the numbers carry the
cross-engine claim — every census above ran in both).

---

## 7. Gaps, stated

- **The iPad seal (§3).** Open, priced, not cured. This is the family's bill.
- **The tape's paper in the caption's line box (§4).** No glyph covered today; the clearance is
  ~1px of half-leading and a caption with a descender would be touched. Pass 2's.
- **Chip height at 900×500 moves 1px** (`dH = −1` on the stacked-card chips; every other cell
  0.00). It is the 768–1023 rung going 22 → 20px, which the spec declares — but the gate as
  written says ±0.5px, so it reads RED unless the gate names the declared re-cut.
- **The card grows at three of five cells**: dock 699 → **689** (−10), 430×932 675 → **689**
  (+14), 900×500 743 → **751**, desk 1142 → **1192** (+50). The spec predicted ~646 at the dock;
  that figure was before the first-well repricing.
- **`candidates` does not wrap** at 390 or 375 — measured 148.08px wide in a 60px-basis lane
  (min-content wins), one line, both engines, chip row remaining 201.92px at 390 / 186.92 at 375.
  The spec's open question is answered NO; whether a 25.89px caption beside a chip row READS well
  is the owner's (U-10).
- **ROW 2 and R7 I2 are still red and still not claimed** (W3's, and a component change).
- **Goldens were not run.** `e2e/visual-golden.spec.ts` compares images and the estate's rule is
  that goldens run only against a built dist; this lane served a dev server. `visual-regression`
  (geometry, one screenshot assertion) ran in full, HEAD and prototype.
- **`access.spec.ts` "a join and a leave each move a live region" timed out in chromium** — the
  two-peer roster test wants the relay; it passed in webkit and is outside this family's sites.
- **A lane hazard worth banking**: the worktree's `node_modules` is a symlink to the main tree's,
  so every concurrent lane shares `node_modules/.vite` and they evict each other's optimized deps
  — the page 504'd (`Outdated Optimize Dep`) with `card? 0` for two full minutes until this lane
  gave vite a private `cacheDir`. That override was reverted before the diff was banked; the
  worktree's `vite.config.ts` is untouched.

---

## Files

```
proto/ctrl-face.diff            the prototype, text files (the two woff2 are binary; sizes in §1)
proto/ctrl-face.diffstat.txt    git diff --stat
probe/heading-voice.spec.ts     r0's instrument + the 900×500 cell
probe/armd-extras.spec.ts       tapes, chips, heads, captions, floors — 5 cells × 2 engines
probe/compare.mjs               the control/armD delta table (readings/compare.jsonl)
probe/overlap-depth.mjs         every tape collision with its DEPTH
probe/ink-overlap.mjs           bbox vs unrotated vs line box, per pair
probe/tape-paint.mjs            the pixel test: is any glyph covered
probe/contrast.mjs              contrast from paint, 160 nodes, both themes
probe/ipad-price.mjs            the seal breach by in-page ablation
probe/ransom.mjs                the advance proof for `p`
probe/i1-i2.mjs                 R7 I1/I2
probe/crops-armd.mjs            the four poses
probe/pw.config.ts              scratch config (no webServer, no globalSetup)
probe/e2e.config.ts             the estate's specs against this lane's server
probe/e2e-head.config.ts        the same, against the HEAD control server
readings/                       every number above, as JSONL or the run's own text
frames/                         4 crops
```

Run: `npx vite --host 127.0.0.1 --port 4242 --strictPort` from the worktree's `web/frontend`,
then `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4242 npx playwright test --config probe/<config>`.
