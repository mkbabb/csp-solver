# ACC-SIX: pass-4 critique (adversarial, non-author)

Subject: the prototype at `.claude/worktrees/wf_f72f3b5a-83a-45` (base `74a2b5d9`, 14 M + 1 ??,
+946/−104) and its evidence at `pass4/prototype/ACC-SIX/`. π control: `74a2b5d9`, the chair's
shared tree `w7-control` (dist `index-CubiZsMVSwTc.js`, served read-only, never built or touched).

**Convergence earned: 78 % (up from 72). Verdict: ADVANCE.**

## 0 · What I did myself (no number here is quoted from the lane)

- **Pass-4 advance isolated.** I rebuilt the pass-3 state (`git archive 74a2b5d9` + `pass3.diff`)
  in scratch and diffed it against the work tree. Seven files moved in pass 4: `MarginNote.vue`,
  `GameBoard.vue` (comment only), `GameBoard.count.test.ts`, `SheetWashiLabel.vue` (comment
  only), `index.css` (comment only), `check-theme-tokens.mjs` and `check-font-coverage.mjs`.
- **Dist identity.** I built the tree's source into scratch with a private cacheDir and got
  `index-BfaZiyPZjKWM.js`. The lane served `index-G5KfdW2p73Of.js`, built at 09:37. The only
  code difference is `SheetWashiLabel`'s scope hash (`data-v-47aa113b` → `data-v-9e1d3f6d`),
  from a comment edit made at 09:44. So the lane's dist matches the source's behaviour. I
  measured on MY build.
- **Pinned board (chair addendum, batch 4).** Every lane row loaded `?size=3&difficulty=EASY`,
  which does not pin the deal, and `p4-pi.mjs`'s header says it does ("a fixed murmur seed").
  Every browser row below uses a real codec payload that I minted with the product's own
  grammar: `?board=ATMuNTMw…MDc5`, which is `\x01` + `3.` + the classic
  `53..7....6..195....` puzzle. Its deal witness reads `53..7....` on both arms, in every
  cell, on both engines.
- **Servers.** Prototype on :4237 (pid 2247), control on :4238 (pid 2239), and a key-restored
  ABLATION dist on :4239 (pid 8123), built from a scratch mirror of the same source with
  `:key="meta"` put back. All three and their npx parents (2093, 2095) were killed by PID, and
  4237–4239 read free. Scratch configs under `<work>/web/frontend/.acc6-critic/` were deleted.
  The work tree's `git status` shows product files only, and its diff stat is unchanged.
- **Instruments.** `critique/ACC-SIX/instruments/acc6c-*.mjs` plus `acc6c-battery.sh`.
  Readings are summarised under `critique/ACC-SIX/readings/`. The raw 77 KB phone rect census
  was not banked.

## 1 · Re-measured (numbers)

| row | result, both engines |
|---|---|
| **Count in place**, pinned board, desk 1280×800 fine + 393×699 dpr3 `hasTouch` (coarse witnessed) | prototype: distinct `.margin-note-meta` nodes **1,1,1** across writes 1→3; mutations for the count's life **1** (`+1 of 51`). ABLATION dist (key restored, same source, same run): nodes **1,2,3**, mutations **+1 −1 +2 −2 +3**. Both engines, all four cells. REPRODUCED, and born-RED on a real built surface rather than a hand `replaceWith` |
| **Unit row ablation** (scratch mirror) | clean **10/10**; `:key="meta"` restored gives **1 failed / 9 passed**, and the in-place row reds. REPRODUCED |
| **Escape byte, dpr 1/2/3** (pinned board, light) | line ground **49** (chromium dpr 1/2/3, webkit dpr 1/2; 22–23/24 columns agree), **48** at webkit dpr3. `#8b5cf6` vsLine **3.072**, under the 3.10 trigger in 5 of 6 cells (23–24/24 columns under), and **3.117 at webkit dpr3 (0/24 under)**. `#9b74f7` worst **3.309** (paper-bound) in all six. Dark shipped `#7c3aed` worst **3.284** (3.265 webkit dpr3). `#9b74f7` on dark **1.95/1.93**. The rule as written ("under 3.10 on EITHER engine") FIRES, and the byte is earned under it. My hypothesis that dpr ≥ 2 paints the core darker is REFUTED for chromium (49 at every density) |
| **User-ink digit, painted** (row 5, away from the trace, dpr 1/2) | light `#2f76bd` on 253 paper = **4.640**; dark: the most saturated pixel `105,170,234` gives **7.608**, the stroke body `#6aabeb` gives **7.696**, on ground **19,18,17**, i.e. the card's own byte. Both engines |
| **Count line AA** (phone dpr3 coarse, painted) | light gray 107 on 251 = **5.172**; dark 147 on 17 = **6.071** (chromium) / **6.127** (webkit) |
| **π vs 74a2b5d9, every element of 16 selectors, fill 0 and fill 3** | desk: **0 paint, 0 rect** deltas in all four engine × theme cells. Phone 393×699: **0 paint**, but **211–218 rect deltas** (§2.1). Landscape 844×390: **0 paint**, **3 rect deltas** (§2.1) |
| **Visual goldens** (`playwright-golden.config.ts`, external base, built dist) | prototype **4/4 passed**; control **4/4 passed**. `cell-light` and `grid-corner-light` inside tolerance. This closes the lane's unrun row |
| **Filter census** (`e2e/filter-census.spec.ts`, prototype dist, four projects) | light chromium + webkit: **all G3.1/G3.3/G3.5/G3.2 green**, so filterBudget holds at 9 in both regimes. Dark: 4 red on `svg.crayon-heart.idle ⟨saturate(0.85)⟩` ×2, and the **control reds identically** (G3.1 + G3.3, both engines). This is pre-existing and not the family's; see cross-pollination |
| **Forced-colors / print emulation** (`.progress-trace`) | prototype: normal `rgb(155,116,247)` → forced `rgb(0,0,0)` → print `rgb(0,0,0)`, both engines. Control stays `rgb(139,92,246)` @0.95 under both. The arms EXECUTE. `.attribution-tape` is absent on a solo board, so that arm is unexercised |
| **Gates bare** (work tree) | `lint:copy` · `lint:theme-tokens` · `test:font-coverage` · `lint:motion` · `lint:ink` · `lint:live-regions` · `lint:theme-selectors`: all **exit 0**. check-copy-register: 0 dashes, 0 unadmitted. theme-tokens self-test: 6 plants as required |
| **Undefined-token census** (every `var()` added by the diff) | 11 tokens, **all declared**; no `var(--x, fallback)` added outside a comment |

Not re-run by me: G0 (the lane's segment-count table), G8, and the 16×16 wrap arm.

## 2 · Open gaps

### 2.1 The reserve moves unclaimed surfaces vs the control, and the declaration names only the board (NEW)

The lane's "board bottom Δ 0.00, toolbar top unmoved" compares fills inside the prototype, not
the prototype against the control. Against `74a2b5d9` on the pinned board, the paint is
identical but the geometry is not:

- **393×699 coarse, both engines, fill 0 and fill 3.** Moved UP 13.59–13.61 px: `.masthead`,
  `.logo-text`, `.board-wrapper` and all 81 cells, `.drawer-tab` and `.margin-note`. Moved DOWN
  13.59–13.61 px: `.play-controls`, the four `.icon-btn`s and `.board-voice`. The board is
  **369×369 on both arms**. So the "13.6 px of board" in pass 3 and in registry §6.6 is not a
  board cost. It is a column-wide redistribution: 27.2 px of added strip, split above and
  below. It touches the masthead and W2's bottom controls, and neither is declared.
- **844×390 coarse, both engines.** W2's `.drawer-tab` (a landed mechanic) moves DOWN **13.6
  px** (166.59 → 180.19, still in the viewport) and `.board-voice` moves 27.2 px.

To close it, declare the π in the same diff that carries the reserve, naming these selectors,
and price it once under §7's leader (§6.6), or cut the reserve so it moves nothing above the
board.

### 2.2 The bound census still cannot see two live bindings on the tree (NEW, the §2.9(b) class)

"Discovery by SHAPE" matches `(?::|v-bind:)([\w-]+)` against a template that paints the
*camelCase* prop. It uses `[^<>]*?` for the tag, so it stops at the first `>` inside an
attribute. A quote-aware scan of the tree (`acc6c-quoteaware.mjs`) finds 13 drawn bindings
where the gate finds 11. The two it misses are LIVE today:
`GameGallery.vue:989 <StagingBand :safe-verb>` and `:990 :saved-pair`. `StagingBand.vue:191–192`
paints both as `{{ safeVerb }}` and `{{ savedPair }}`.

I planted five shapes in a scratch mirror (exit shown):

| plant | exit |
|---|---|
| plain `<MarginNote :text="x">` (control) | **1 (RED)** |
| `@click="() => 0"` before `:text` | 0 |
| `:tone="a > b ? 1 : 0"` before `:text` | 0 |
| kebab `:board-text` on a component painting `{{ boardText }}` | 0 |
| `v-bind="{ text: x }"` | 0 |
| prop painted through a computed | 0 |

The comment also promises "plant: --self-test". `check-font-coverage.mjs` has no `--self-test`
handling, so the plant is asserted, not written. To close it: parse attributes quote-aware and
kebab→camel, pin the two StagingBand bindings, and write the plant.

### 2.3 Law 20 gates the admission site but not its consumers (NEW)

Re-pointing `GameControlPanel.vue`'s two `url(#sparkle-rainbow)` to `url(#solver-ink)` paints
chrome with the answer's five stops, and the gate reads **0 offences, exit 0**. The gate
matches only `var(--color-solver-ink-N)`. The one lawful consumer is
`HandwrittenGlyph.vue:83`. To close it, census `url(#solver-ink)` against a one-file allowlist.
The admission's own plants (P1: a sibling element after `#solver-ink`; P3: close-and-reopen)
red as required.

### 2.4 The ledger's user-ink row: the number holds, its provenance sentence is false (NEW, the §2.8 class)

`index.css` reads "7.608 … the PAINTED cell ground is 44,43,41, not the card's own byte".
Painted on the pinned board, the ground is **19,18,17**, the card's own byte, and
CR(`#6aabeb`, 44,43,41) = 5.818, not 7.608. The lane's own pass-4 digit probe misread: in 3 of
4 cells its "painted digit" is a VIOLET pixel (h 296.1 / 302.2 / 305.0°, dHue 44.7–55.7° from
crayon-blue), with `vsCellGround` 5.22 / 4.54 / 3.643 / 5.717. None of those is the ledger's
number. The 7.608 is pass-3's `digit-proto.json`, carried forward. It reproduces as the single
most saturated pixel, while the stroke body paints exactly the arithmetic 7.696. So "painted
7.608 vs arithmetic 7.696" is an artefact of picking one pixel. To close it: correct the
ground sentence, cite a pass-4 painted read, and fix `p4-paint.mjs`'s digit crop (row ≥ 5,
blue-hue gate).

### 2.5 The escape byte stands on one grey level

The rule fires and the byte is earned under the rule as written. But the trigger margin is a
single grey level: 3.072 at line 49 against 3.117 at line 48 (webkit dpr3). The LAWS'
threshold-sensitivity row (worst column at 50/70/90/100 % ink mass + fraction of columns under
the floor) is absent from `p4-paint.mjs`. My columns-under-3.10 fraction is 23/24 in five
cells and 0/24 in one. The owner's ballot T9-B-ACC6-1 should carry both figures.

### 2.6 Carried open (the lane names them; I confirm)

- **G8 RED**: 83.16 % at rest (≤ 30 / ≤ 5 charged). The argument that it measures ground is
  sound on the bins (the rest pose is identical on both arms, 83.16), and the lane did not
  re-word it. It is the chair's re-cut (T9-D-ACC6-3), still open.
- **The section's fork is unframed at one board** (leader duty). Violet / gold / graphite needs
  FIVE's and GRAPHITE's trees served beside this one on ONE encoded payload. That is the
  orchestrator's scheduling, and it stays open.
- **The hard co-landing is unpaid.** `d` steps about 31 px per digit at 9×9. ACC-FIVE's pass-4
  critic measures the tween's rate and finds a third consumer un-gated at 2.2× the ceiling. The
  condition stands.
- **Arm A unbuilt** (no occlusion px² at three viewports; U-10). **G6** seed on the live
  two-peer tape is unrun for a third pass. **R6 heading census** and **R3 wobble** are unrun.
- **The multi-subpath control degenerated** (one subpath live), so FIVE's guard goes unexercised
  here.
- **The §6.6 seating.** The `2lh` reserve still lives in `GameBoard.vue`'s scoped sheet, and
  NOTE-LEDGER's pass-4 record has no `2lh` row. It is one seating owned by neither tree.
- **The palette claim is narrowed** to "violet is the answer's GAUGE" (ballot T9-B-ACC6-2).
  Frame 1 shows the arc, verified by eye. But its board is illegal: the instrument typed `5`
  into every cell, so row 1 reads 5 · 7 · **5** · 2 · **5**. An owner's re-look frame should
  show a legal play state.

## 3 · Closed this pass (verified)

- §2.1 in-place: reproduced with a built ablation arm, both engines, fine and coarse.
- §2.2 the stub is struck: a real mount plus element identity, and the ablation reds.
- §2.3 the ground is pinned: the byte is earned under the written rule.
- §2.4 behaviour decided: the name, the comment and the assertion agree (undo to empty resumes
  the same lesson, and only a new deal un-teaches).
- §2.7 the SheetWashiLabel π is corrected in the diff (14 instances, 4.60 / 4.82 px).
- §2.9 the ±400/200 window is gone: both of pass 3's holes red and the file's chrome twin reds.
- §2.10 L19 / L21 are recast as PROPOSED per pass4/CHAIR-RULINGS §1.3.
- §2.13 the one-consumer rung is argued once, in the ledger.
- The goldens, the forced-colors and print arms, and the filter budget in the light regime are
  closed by my runs above.

## 4 · Checklist

| item | verdict |
|---|---|
| vacuous convergence | clear |
| spec-cites-itself | **hit** (§2.4): a "painted" row whose pass-4 instrument misread and whose ground sentence is false |
| gates that cannot fail | **hit ×2** (§2.2 kebab / `>` / object-bind blind spots plus a phantom self-test; §2.3 `url()` bypass) |
| elegant-reduction trap | **hit** (§2.6): the geometric front needs FIVE's tween |
| legacy aliases | clear (the rung is argued) |
| masked fallbacks | minor: `declaredElementSpans` fails OPEN to end of file on an unterminated tag |
| unverified gestalt | partial: the arc is shown, the claim is narrowed, the frame's board is illegal, and the fork is unframed |
| consumer-less substrate | clear |
| generic default | clear |
| the pixel it moves and did not declare | **hit** (§2.1): masthead / logo / controls ±13.6 px at the phone, W2's tab +13.6 px in landscape |
| constraints | AA painted ok (trace 3.309 / 3.284, count line 5.17 / 6.07, user-ink 4.64 / 7.61); filterBudget 9 light ok; M16 ok; undefined-token ok; decided history booked PROPOSED; **W2's tab moved (§2.1)**; **the chair's `?board=` addendum was unmet in every lane row** (they survive my re-pin) |

## 5 · Verdict

**ADVANCE at 78.** The centre is now reproduced by a non-author on a pinned board, in both
engines, with the strongest born-RED this family has had: a built ablation that re-mounts
three nodes where the prototype keeps one. The escape byte is earned under its own written
rule, and the goldens, print, forced-colors and light filter census all pass. Four new faults
hold the number below 80:

1. an undeclared π on unclaimed surfaces, W2's tab among them;
2. a font census still blind to two live bindings;
3. a law-20 bypass through `url()`;
4. a ledger provenance sentence that is false.

The three structural opens (the fork unframed, the co-landing, G8's statistic) are
orchestration and chair rows, not missing primitives.

## Cross-pollination

- **Estate / the chair**: `filter-census.spec.ts` runs light only. Under `colorScheme: dark`
  it reds on `svg.crayon-heart.idle ⟨saturate(0.85)⟩` ×2 (`CrayonHeart.vue:317`) on the
  CONTROL `74a2b5d9` too, in G3.1 + G3.3, both engines. That is an unbudgeted filter the gate
  has never looked for.
- **Every lane**: mint the pinned board with the product's own codec (see `acc6c-inplace.mjs`,
  five lines). A key-restored ABLATION DIST served beside the prototype is a cheap born-RED for
  any `:key`/re-mount row.
- **Every lane's π**: compare against the control, not across fills; read every element, not
  `querySelector`'s first.
- **ACC-FIVE / ACC-GRAPHITE**: the columns-under-threshold fraction for the painted-contrast
  sensitivity row.
