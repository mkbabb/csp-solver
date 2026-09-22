# ACC-SIX — pass-4 PROTOTYPE (it RUNS)

Worktree `.claude/worktrees/wf_f72f3b5a-83a-45`, base `74a2b5d9`, uncommitted, ADVANCED IN
PLACE (the pass-3 tree; the chair banked it as `pass3/prototype/ACC-SIX/pass3.diff`, so the
record is safe). Prototype dist built in-tree with a private cacheDir, identity
**`index-G5KfdW2p73Of.js`**, served on `127.0.0.1:4237` (pid 30082). The HEAD control is the
chair's shared read-only tree `.claude/worktrees/w7-control`, its pre-built dist served on
`127.0.0.1:4238` (pid 30080) and verified by its own asset hash **`index-CubiZsMVSwTc.js`** —
never by a 200. Both killed at return; ports 4237/4238 read free.

**Replay route: NONE. Nothing was replayed.** The pass-3 diff was already in this tree and was
advanced in place, as the chair's §2 directs. `git -C <work> diff --stat` at open read 14 files
/ +722 −104 plus two untracked (`GameBoard.count.test.ts`, `pw.acc6.config.ts`), which AGREES
with the pass-3 README's head figure and with the critique's "14 M + 2 ??". One discrepancy,
reported rather than silently fixed: the pass-3 README's change table lists ELEVEN rows while
the tree carries fourteen modified files — `GameControlPanel.vue`, `GameGallery.vue`,
`HandwrittenGlyph.vue` and `SheetWashiLabel.test.ts` are pass-2 replay carry-overs the table
never named. No line-count check was owed (no `diff3 -m`, no `git apply`).

---

## THE NUMBERS FIRST

### 1 · The count updates IN PLACE — closed, with a control that catches a re-mount

`MarginNote.vue`'s `:key="meta"` is struck (the key was bound to the string that changes).
Measured on the served dist with a `MutationObserver` on `.board-margin` plus NODE IDENTITY,
three writes, six cells (chromium/webkit × 1280×800 · 393×699 dpr3 `hasTouch` · 844×390 dpr3
`hasTouch`), coarse regime witnessed on the two phone cells:

| reading | every cell, both engines |
|---|---|
| distinct `.margin-note-meta` nodes across writes 1→2→3 | **1** |
| childList mutations for the count's WHOLE LIFE | **2** — `+1 of 20 on the board`, `−3 of 20 on the board` |
| pass-3's reading, same instrument shape | a `−`/`+` pair on EVERY write, webkit re-running `ink-write-in` |

**Negative control, in the same run and while the line is alive** (`p4-control.mjs`): the node
is replaced by hand (`replaceWith(cloneNode)`) between write 1 and write 2 — distinct nodes
1 → **2**, mutations gain the `+`/`−` pair. The instrument sees a re-mount; it sees none here.
(The first cut of this control, inside `p4-geom.mjs`, fired AFTER the lesson had lifted and so
replaced nothing — a vacuous control, reported as such and re-cut rather than quoted.)

**The unit row that could not fail can now**: `MarginNote` is NOT stubbed any more — the real
component is mounted — and the row asserts element identity. Ablation on this tree: put
`:key="meta"` back, `GameBoard.count.test.ts` goes **1 failed / 9 passed**; strike it again,
**10/10**. The pass-3 README's "12 rows" is wrong; the file holds **10**.

### 2 · The escape byte, re-read on ONE ground in ONE run — the byte is EARNED

The rule was written into the instrument's header before any pass-4 paint was taken: *keep
`#9b74f7` only if `#8b5cf6`'s painted modal core reads UNDER 3.10 against the pinned ground on
either engine.* The ground is now the frame line's own modal core — the MODAL of the per-column
darkest achromatic pixel, glyph boxes (each cell's central 50 %) masked — not pass 3's single
darkest pixel.

| light, 1280×800, both engines identical to the thousandth | vs line | vs paper | worst |
|---|---|---|---|
| pinned ground | `rgb(49,49,49)`, **22/24 columns** (webkit 21/24) | `rgb(253,253,252)` | — |
| `#8b5cf6` (`answer-mid`, the incumbent) | **3.072** | 4.160 | **3.072 ✗ < 3.10** |
| `#9b74f7` (`answer-ink`, SHIPPED) | 3.862 | 3.309 | **3.309** |
| `#7c3aed` (`answer-deep`) | 2.283 | 5.599 | 2.283 |

Dark: ground `rgb(199,197,190)` (23/24), shipped `#7c3aed` 3.299 / 3.284, worst **3.284**;
`#9b74f7` would read **1.95** there — the ramp's inversion is forced, not chosen.

**The critic's counter-reading is refuted by paint.** §2.3 predicted that at
`--grid-line-color`'s own gray 38 the incumbent clears at 3.574. The PAINTED stroke core is
gray **49**, not 38: the frame is a wobbled hand line with soft edges, and token arithmetic
over-reports its ground by eleven grey levels. Pass 3's contaminating gray 10 is still reported
by the probe as `extremeOfAll`, so the contamination is visible rather than inferred.

### 3 · G0, the section's one instrument, re-cut over SEGMENT COUNT (my leader duty)

Painted violet share of the ring band against the requested fraction, walking the gauge up its
own writable count; both engines, dpr 1 and 3; bound 2 points.

| segments | requested | chromium dpr1 / dpr3 | webkit dpr1 / dpr3 | worst Δ |
|---|---|---|---|---|
| 26 | 5 % | 5.19 / 5.17 | 5.22 / 5.14 | 0.22 |
| 123 | 25 % | 24.99 / 25.29 | 24.92 / 25.12 | 0.29 |
| 247 | 50 % | 50.31 / 51.25 | 50.22 / 50.18 | **1.25** |
| 369 | 75 % | 75.25 / 76.15 | 75.19 / 75.15 | 1.15 |
| 494 | 100 % | 100 / 100 | 100 / 100 | 0 |

Every stop inside 2 points, both densities, both engines; `pathLength` absent and
`stroke-dasharray: none` at every stop.

**The CSS-declaration-form control, born-RED on THIS tree in the same run**: hand the live node
back `pathLength="100"` + `stroke-dasharray: 25 100` and chromium paints **24.99 / 25.29 %**
while webkit paints **97.84 %** at both densities — **72.85 points apart on identical DOM**.
The form the wave deleted is falsified by the lane's own instrument, not by a memory of pass 3.

### 4 · The reserve's price and W2's band, measured at both coarse cells

| cell (light, both engines) | strip h | `.board-margin` | board bottom, fills 0→3 | toolbar top |
|---|---|---|---|---|
| desk 1280×800 | 48.00 | `position: absolute` | 760.45 / 760.16, **Δ 0.00** | unmoved |
| phone 393×699 dpr3 `hasTouch` | 48.00 | in flow, `margin-right: 104px` | 499.13 / 498.83, **Δ 0.00** | 577.52 / 577.22, unmoved |
| landscape 844×390 dpr3 `hasTouch` | 48.00 | in flow, `margin-right: 4px` | 378.00, **Δ 0.00** | unmoved |

W2 §2.7's tongue band is PORTRAIT-ONLY and the reading proves it: 104 px of yielded column at
393, 4 px at 844×390. The bottom tab is reachable in every coarse cell — `elementFromPoint` at
its centre returns the tab's own child, `min-height`/`min-width` **44 px** at the phone (the
`--tap-floor` 2.75rem resolving; the token is declared on App.vue's shell, so a
`documentElement` read returns "" and says nothing — read from the consumer).

The phone's **13.6 px board cost** (`2lh` against the strip's old 20.8 px) STANDS as pass 3
declared it; nothing in pass 4 made it cheaper. It is §6.6's one seating with NOTE-LEDGER.

### 5 · The 16×16 wrap arm — closed by measurement, not by a pin

Dealt at 16×16 the line reads `1 of 64 on the board`, one line box, `scrollWidth` 106 =
`clientWidth`. Driven to the WIDEST sentence the count can ever say — `200 of 200 on the board`
— it measures **129 px** against the **261 px** the tongue leaves at 393 (358 px at 844×390),
one line box, `scrollHeight` 18 px at `line-height` 18.2 px. It cannot wrap, so the `2lh`
reserve cannot be blown by a wide count. Both engines, both coarse cells.

### 6 · π against the control `74a2b5d9`, as PAINT and TAG NAMES

Eleven unclaimed selectors (`.board-wrapper`, `.sudoku-cell`, `.masthead`, `.logo-text`,
`.controls-card`, `.icon-btn`, `.deal-row`, `.board-voice`, `.margin-note`, `.drawer-tab`,
`.game-card`), each read for tag name, `font`, `line-height`, `color`, `background-color`,
`stroke`, `fill`, `opacity`, `transform`, border and rect: **0 deltas on ten of eleven, all
four engine×theme cells.** `.game-card` is absent on BOTH arms (the gallery is not open on this
route) — not a delta, an unmeasured selector, named here rather than counted as a pass.

### 7 · The gates, BARE, in the worktree

`lint:copy` · `lint:live-regions` · `lint:ink` · `lint:theme-selectors` · `lint:theme-tokens` ·
`lint:motion` · `test:font-coverage` · `test:support-floor` · `test:prod-shake` ·
`test:golden:bytes` · `lint:knip` · `lint:eslint` — **twelve, all exit 0**, plus
`check-theme-tokens --self-test` and `check-copy-register --self-test` exit 0.
`vue-tsc --noEmit` exit 0. Vitest, chunked: `src/games/shared` **35 files / 439 tests**,
`src/pencil` **8 files / 76 tests**, all green.

**Law 20's admission is a FILE + ELEMENT ID now, and the critic's two holes are plants.** The
±400/200-character window is gone; the admitted span is the element whose own opening tag
carries `id="solver-ink"`, in `SvgFilters.vue`, and the whole-file exemption went with it
(`#sparkle-rainbow`, the chrome twin four lines above in the same file, is NOT admitted).
`--self-test` prints, on this tree: the chrome-rule plant RED, the rung twin GREEN, the
admission GREEN, and **RED ×3** for (a) a rule 60 characters after a `url(#sparkle-rainbow)`,
(b) the same injection into the estate's real `GameControlPanel.vue` 300 characters after
`:2083`, (c) a stop named inside `#sparkle-rainbow`'s own element in the admitted file.

**The bound census discovers by SHAPE.** It no longer builds its surface list from its own pins:
it finds every bound prop on a component whose OWN template paints that prop as text. Run
before pinning, it found **eight** drawn bindings the old census was blind to
(`<MarginNote :text>`, `<CompletionVignette :text>` and `:meta`, `<SolverErrorNote :text>`,
`<GameCard :card>`, `<StagingBand :staging>` / `:size` / `:difficulty`) — the critic's §2.9(b)
with a number. Each is now pinned with the register it paints in: **12 pinned**, 46 codepoints,
**no re-cut**.

### 8 · G8 — run at r0's OWN floor and subject, and REFUTED AS A STATISTIC

`r0-hue-census.MOVED.mjs` reproduces r0's census exactly (`CHROMA_FLOOR 0.012`, the whole
1280×800 viewport, rest / cell-focused / mid-board, the SOLO deal) and substitutes ONLY the
anchor set; the substitution travels as `r0-hue-census.anchors.PROPOSED.diff` and is NOT
applied to r0. Off-anchor share of chromatic pixels, KIN_DEG 5:

| pose | proto 5 anchors | proto 6 anchors | control 6 anchors |
|---|---|---|---|
| rest, light | 83.21 | 83.16 | 83.16 |
| mid-board, light (chromium) | 78.50 | 72.82 | 72.83 |
| mid-board, dark (chromium) | 77.30 | **59.80** | 63.44 |
| mid-board, dark (webkit) | 76.68 | 62.93 | **43.00** |

The charter's ≤30 / ≤5 is **unreachable by any accent design on this subject**, and the reason
is in the bins: at rest the light theme's top three hue bins are 50–60° (53.2 %), 40–50°
(26.8 %) and 70–80° (10.7 %) — the WARM PAPER, which r0's own comment says the census must see.
Ground is four fifths of the chromatic mass, so the statistic measures how much ground is on
screen. Worse, the control's webkit mid-board reads **43 %** — BETTER than the prototype's 62.9
— because HEAD's webkit paints ~99 % of the ring violet (the very dash-restart defect G0 was
cut to kill). **A gate that rewards painting more of one hue cannot score family coherence.** I
have not re-worded it: G8 stays RED and the number that holds it is 83.16 % at rest. The
chair's call. The family's defensible coherence figure remains the token-level kinship (G1).

---

## THE GAPS, and then the hard part

1. **The palette's central claim is still not photographed, and pass 4 found out why.** The
   first cut of crop A solved the board to get revealed digits and the trace in one frame: a
   SOLVED board RETIRES the trace (`solve-success`), so the frame carried rainbow digits and no
   arc — the pass-3 critique's §2.11 from the other end. And a revealed digit is not violet: it
   carries all five rainbow stops across its own glyph, of which violet is one. **"Violet ⇒ the
   answer" is unphotographable on the current mechanics**, not merely unphotographed. The crop
   banked instead shows the claim that IS true — the violet arc on the frame with the player's
   blue hand beside the givens' graphite. The failed cut is deleted (the cap), its instrument
   banked, and the owner should hear the claim narrowed to: violet is the ANSWER'S GAUGE.
2. **G8 is RED and, I argue, unscoreable as written** (§8). Not re-worded; the chair's row.
3. **The multi-subpath control degenerated.** The live trace carries ONE subpath at every
   stop, so my "4-subpath control" could only report that — the guard is ACC-FIVE's row and it
   is UNEXERCISED by anything on this surface. Reported, not claimed.
4. **The hard co-landing is unpaid** (charter 13): the front advances in `d`, which does not
   transition — ~31 px/digit at 9×9, ~158 at 4×4 measured in pass 3 and unchanged here.
   **CONDITION, stated as the charter asks: this family's geometric front MAY NOT LAND without
   ACC-FIVE's fraction tween**, whose rate budget (re-cuts per SECOND, registry §2.6 — a 120 Hz
   panel doubled the pass-3 count) is the row I cite and do not re-cut. I consumed
   `poseFronts` verbatim and minted no motion.
5. **The section's fork is UNFRAMED at one board.** Framing violet / gold / graphite at one
   deal needs ACC-FIVE's and ACC-GRAPHITE's trees built and served beside mine; I have neither,
   and building a sibling's tree is not mine to do. What I can hand the owner is the violet arm
   and the `74a2b5d9` control at the same deal. This is my leader duty and it is OPEN.
6. **Arm A (the bottom-left tape) was not built** — second pass running. Its occlusion px² at
   three viewports is therefore undeclared, and the margin line's zero-occlusion-by-construction
   makes the comparison moot TO ME, which is a judgement the owner may not share (U-10).
7. **Unrun, named with what holds them**: the `visual-golden` goldens (`cell-light`'s declared
   pen delta, `grid-corner-light`'s 0 px — only `test:golden:bytes` ran, green); R6's heading
   census; R3's wobble; G6's seed arm on the fold's own attribution tape across two peers (it
   needs a live `?wire=local` room — the fix's motivating consumer, unmeasured for two passes);
   the print / forced-colors arms were written for the section in pass 3 and NOT re-executed by
   emulation in pass 4.
8. **The π deal-witness is weak.** Both arms load the same URL and the probe compares the first
   row, but the readback marks every input `_` (givens are not `readOnly` on this route), so the
   string carries no information. The ten identical selectors are computed-paint rows that do
   not depend on the deal; the witness that they dealt the same board is not proven.
9. **`--tap-floor` reads "" from `documentElement`** — it is declared on App.vue's shell. Not a
   defect and not my row; recorded because a lane reading it at the root would write a zero.
10. **The `.board-margin` reserve still lives in `GameBoard.vue`'s scoped sheet**, not
    `index.css`, so §7's shared seating has to be written there too.
11. **The ledger now marks its arithmetic rows** (`arith` vs `painted`) rather than paint them
    all: `solver-ink-2 as text`, `user-ink on background` and the four `red-ink` rows are still
    arithmetic. The critic's §2.8 asked for "paint it or mark it"; I marked them and painted the
    one row the critic named (dark user-ink **7.608** painted, against the 7.696 arithmetic the
    block used to print as 7.70).
12. **Two R6 rows travel as PROPOSED, per the chair** (pass4/CHAIR-RULINGS §1.3): L19's
    "amended in this commit" is struck and reads "PROPOSED amendment — the chair's row"; L21's
    dark `--color-user-ink: var(--color-crayon-blue)` carries the same sentence and its painted
    number (7.608 dark, 4.640 light). Neither is amended by this lane.

---

## The crops (2, both REPLACEMENTS, both cited)

- `frames/1-the-arc-desk-light-chromium-fine.png` — 24.2 KB, desk 1280×800 dpr2, light,
  **chromium**, **fine pointer**. **RETIRES pass-3 `frames/2-solved-corner-desk-light-chromium.png`.**
  Ten writes in: the answer's violet riding the frame's top edge as the board's own gauge, the
  player's blue digits beside the givens' graphite — three inks, three jobs, one frame.
- `frames/2-count-under-the-board-phone-light-webkit-coarse.png` — 76.7 KB, 393×699 dpr3,
  light, **webkit**, **coarse pointer** (`hasTouch`, `(pointer: coarse)` asserted before the
  shot). **RETIRES pass-3 `frames/1-count-under-the-board-phone-light-chromium.png`.** The count
  UNDER the board at two writes, and the strip visibly yielding the tongue's column.

## Instruments (all under `instruments/`, all re-pointed copies or new)

`p4-paint.mjs` (the pinned ground + four arms in one run) · `p4-geom.mjs` (in-place, the
reserve, W2's band, the 16×16 arm) · `p4-control.mjs` (the live negative control, the worst-case
string, the tap floor from its consumer) · `p4-g0.mjs` (the segment-count re-cut + the CSS-form
and subpath controls) · `p4-pi.mjs` (π as paint and tag names) · `r0-hue-census.MOVED.mjs` +
`r0-hue-census.anchors.PROPOSED.diff` (G8) · `p4-crops.mjs`, `p4-cropA2.mjs` · `oklch.COPY.mjs`.
Readings in `readings/`, logs in `logs/`.

## Incidents, self-declared

- **The ground probe's first cut masked WHOLE CELL RECTS and lost the frame stroke with the
  glyph** — the "line" read `rgb(251,250,249)`, paper. Caught by the ground's own witness (the
  ratio vs line and vs paper collapsed to within 0.08), re-cut to mask only each cell's central
  50 %, re-run. The bad run is named in the instrument's header.
- **`p4-geom.mjs`'s negative control was vacuous** (it fired after the lesson lifted). Re-cut
  into `p4-control.mjs` and run while the line is alive.
- **`vue-tsc -p tsconfig.app.json` — no such file in this tree** (the estate has
  `tsconfig.json` / `.e2e` / `.node`). Re-run bare; exit 0.
- **`vitest --reporter=basic` is gone in vitest 4.1.11** and killed the first unit run with
  `ERR_LOAD_URL`. Re-run with the default reporter.
- **Crop A was taken twice** (the solved-board cut, deleted — §Gaps 1). Net crops: 2.
- **Ports**: this lane opened 4237 (prototype) and 4238 (control) only, killed both by recorded
  PID. No `pkill` on a shared path. Nothing else in 4230–4249 was touched.
