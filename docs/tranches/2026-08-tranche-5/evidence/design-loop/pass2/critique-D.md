# CRITIQUE — LANE D (adversarial, non-author) · pass 2 · 2026-07-31

Read: `pass1-registry.md` §5 Lane D (the binding work order), `laneD-report.md`,
`laneD-MEASURE-REQUESTS.md`, `blast-radius.md`, `font-decision-row.md`, `laneD-shots/`,
`rig/`, and `measure/RESULTS.md`. Everything below was re-derived against the working tree at
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion` (HEAD `32198688`, nothing
committed). Read-only; two sabotage probes were run and reverted byte-clean.

**Convergence: 58%.** Five numbered ships, five landed as claimed in *substance*; three of five
are certified by arithmetic that does not survive re-derivation, one certifies itself with a gate
I demonstrated cannot fail, and the binding §4.3 rig mandate is unmet with the charter misquoted
as the reason.

---

## 0 · What survives audit (stated first, because most of it does)

- **Mark-4 grep gate: re-derived, HOLDS.** `git diff -U0 | grep '^+' | grep 'filter:'` → 0 across
  all 13 tracked files, and 0 in both untracked files (`check-ink-pressure.mjs`,
  `GameControlPanel.test.ts`). No lane-D line adds a filter. Clean.
- **Ship 1's root cause is correct and its negative control could have failed.** The diff confirms
  `.deal-btn` was authored at `:757` above `.icon-btn` at `:804`, same scoped sheet, tie at
  `(0,1,0)`. The overflow arithmetic reproduces (28 + 2.4 + 14.384 + 9.6 = 54.384; 28 − 10.384 =
  17.616 against a measured 17.63). `rig/die-{before,after}.json` verify in **both** engines, and
  the coarse row is byte-identical before and after in both (44 × 52.16, die 28 × 28) — a control
  on the right element that stayed silent for the right reason. `die-{before,after}-light.png`
  show the squashed die and its cure legibly.
- **Ship 2 is the strongest artifact in the lane and every load-bearing claim checks out.**
  `index.css:46-48` `unicode-range` carries `U+0042, U+0044, U+0053` and no other capital;
  `fraunces-subset.woff2` is 9,772 B; `typography.css:256` is `text-transform: uppercase`. The
  sentinel-fallback correction to the provenance probe is a genuine self-caught falsifier. And it
  is **device-confirmed from outside the lane**: `RESULTS.md` §2 G5 shows the per-glyph split on
  `SIZE / DIFFICULTY / NEW GAME / MARKS / CHECK / CANDIDATES` at 3× on real MobileSafari, with a
  `dist-base` negative control. §0 of the font dossier stands on glass.
- **Scoped-CSS honesty holds, and I checked rather than took it.** Both deleted wrappers carried
  **no `<style>` block** (their headers say the panel keeps every `<style>`), so no `:deep` /
  `::v-slotted` chain moved. The tree has 7 `:deep()` sites, none in the deleted paths. Work was
  done in the real tree with real SFC compilation.
- **The ink tokens really do flip per theme.** The report asserts "ONE definition serves light and
  dark"; I proved it: `@theme` (→ `:root`) at `index.css:81-325` and `.dark` at `:328-401` land on
  the **same element** (`useTheme` toggles `documentElement`), so `--ink-press-*`'s inner
  `var(--grid-line-color)` substitutes against the dark value. `@media print` overrides
  `:root, .dark` together, so print flips too.
- **The ownership gate does fire on the real authored form.** Injected
  `color-mix(in srgb, var(--color-pencil-graphite, var(--grid-line-color)) 62%, transparent)` into
  `MarginNote.vue` → `✗ pencil/chrome/MarginNote.vue open-codes the graphite ramp`. Not vacuous in
  that direction.
- **Re-run green by me, not taken on report:** `vitest` **299 / 28**, `knip` clean,
  `npm run lint:ink` green reproducing 3.53/5.23/5.95 light and 4.36/6.06/6.66 dark to ±0.01.
  Independent contrast derivation matches: rose `#e8315b` = **4.098**, red-ink `#d02a52` = **4.977**.
- **419 LOC is exact** (106 + 100 + 114 + 99), the three `constants.ts` were correctly retained,
  and the pass-1 named offense ("F4's spec reads directories as deletable that `registry.ts`
  imports") is closed with exact importer rows. The TDZ cycle is a real, reproduced finding with an
  operative rule attached.
- **Consumer-less substrate: not committed.** All three minted rungs have live consumers and the
  comment refuses a zero-consumer stop by name. Correct instinct, correctly executed.
- **Legacy aliases: none.** The `.icon-btn.deal-btn` specificity bump was considered and rejected
  on the record, for the right reason.

---

## 1 · BLOCKING — the LOC ledger is wrong by 3.4× and its net sign is inverted

The report's headline, repeated verbatim into `blast-radius.md` §4:

> **Tree total: 15 files, +146 / −514.**

Re-derived:

| | files | + | − | net |
|---|---:|---:|---:|---:|
| tracked (`git diff --numstat`) | 13 | **124** | **494** | −370 |
| untracked `scripts/check-ink-pressure.mjs` | 1 | 234 | 0 | |
| untracked `src/games/shared/GameControlPanel.test.ts` | 1 | 145 | 0 | |
| **total** | **15** | **503** | **494** | **+9** |

(`docs/tranches/.../patches/` is untracked but pre-dates the lane — excluded, correctly.)

The report's **own body sums to my figure**: 31 (GCP) + 32 (css) + 47 (2 scenes) + 145 (test) +
234 (script) + 13 (5 consumers) + 1 (package.json) = **+503**. So the headline contradicts the
dossier it heads. The tracked-only reading (+124/−494) doesn't rescue it either — it misses by 22
insertions, and adopting it would commit precisely the error Lane A's own `rig/gate-mark4.sh`
warns about in its first comment ("a `git diff` alone would silently exempt every untracked line").

Why this is blocking rather than clerical: this lane's charter currency is **deletion**, and the
loop prices it. `+146 / −514` reads as a **−368 net contraction**; the tree is **+9**. Lane D is
net-neutral-to-slightly-additive, and the registry's cross-pollination row that created this
obligation ("F1's LOC ledger missed test/e2e rows") makes the test row non-optional. Restate as
+503 / −494 and let the ships argue for themselves — three of them will.

---

## 2 · BLOCKING — `--self-test`'s ownership case is a gate that cannot fail. Demonstrated.

The dossier's methodological centrepiece is §"Two gates I built that could not fail", closing with
"a gate that has never been seen red is an unmeasured claim", and `package.json` wires
`lint:ink` to `--self-test` on the strength of "proving each gate fails on a known-bad input".

For `floors` and `monotone` that is true (the `68% → 55%` mutation trips both). For `ownership` it
is not. The case reads:

```js
gateOwnership([KeyboardLegend.vue]).length ? ["unexpected"] : (OPEN_CODED.test(literal) ? [...] : [])
```

Both branches return non-empty. The only thing actually asserted is that the regex matches a
hardcoded string — `gateOwnership`'s file walk, its `index.css` filter and `sources()` are never
exercised. Two probes, both reverted byte-clean:

- **Sabotage `sources()` to return `[]`** → `node scripts/check-ink-pressure.mjs --self-test`
  prints the ladder and **exits 0**.
- **Same sabotage, plus a live open-coded reintroduction sitting in `MarginNote.vue`** → still
  prints the ladder, still **exits 0**. The gate is blind and the self-test certifies it green.

This is the third instance of the lane's own named offense, and the first one it did not catch.
Fix: mutate a real source file (or point `sources()` at a fixture dir containing a known-bad
`.vue`) and assert `gateOwnership` returns non-empty.

Two adjacent holes found while probing:
- **Regex evasion.** `color-mix(in srgb, var(--grid-line-color) 62%, transparent)` — the variable
  `--color-pencil-graphite` literally aliases (`index.css:202`) — passes green. "Sole ownership of
  the ramp" is ownership of one spelling.
- `sources()` collects `.vue` and `.css` only; a `.ts` reintroduction is invisible.

---

## 3 · BLOCKING — "18 tests out, 18 tests in" is 18 out / **10** in

Counted from `HEAD`: `sudoku/ControlPanel/ControlPanel.test.ts` **9** tests,
`futoshiki/ControlPanel/ControlPanel.test.ts` **9** — 18 out. The consolidated
`src/games/shared/GameControlPanel.test.ts` runs **10** (`vitest run` on that file alone: `Tests
10 passed`). Net **−8**. The campaign memory corroborates the delta independently: the T4 gate
counts were `unit 307/29`; the tree now reads `299/28`.

The *substance* is defensible — the 9 names are one-for-one twins and the 10th is a new
`.deal-btn` grammar assertion. The claim is not. And "299/28 total" is offered in the same
sentence as if it corroborates "18 in"; it is the post-change number and can corroborate nothing.

Worse, real coverage **was** dropped and is not acknowledged. The consolidated file mounts
`GameControlPanel` against a synthetic `SECTIONS` literal, so the **+47 LOC of scene wiring Lane D
just wrote** — `SudokuGame.vue`'s inline `sections` and `FutoshikiGame.vue`'s
`futoshikiGame.options(futoshiki)` — has **zero** unit coverage. The twins at least mounted
through a per-game wrapper that consumed the per-game constants. Honest restatement: "18 out, 10
in; the twins collapse cleanly, and the new per-scene wiring is uncovered."

---

## 4 · BLOCKING — the §4.3 rig mandate is unmet, and the charter is misquoted as the exemption

`pass1-registry.md` §4.3 binds **"every remaining lane"** to ≥1 measurement on the booted
`perf-rig-iphone16`, both pointer regimes, every gate paired with a control shown able to fail.
`laneD-report.md` closes with:

> **No on-device measurement.** By charter.

The charter says the opposite. And `measure/RESULTS.md` — §0 rig, §1 lane A, §2 lane B, §3 lane C,
§4 cross-lane — has **no Lane D section at all**. All five MEASURE-REQUESTS returned nothing,
including the row the lane itself flagged as highest value:

| row | what it was for | returned |
|---|---|---|
| R1 die at fine pointer, real Safari | the **only regime the fix changes** | — |
| R2 rendered-pixel contrast sampling | the hole `lint:ink` "cannot see paint" leaves | — |
| R3 five-game behavioural identity | the deletion's boot-order change | — |
| **R3b TDZ cycle on real Safari** | "highest-value row here" | — |
| R5 Deal coarse padding / e2e re-point | cheap regressions | — |

This is not a scheduling footnote. `RESULTS.md` §1 M5 is a same-session, same-rig refutation of
the exact warrant Lane D leans on: a carousel defect that Playwright-WebKit reproduces four ways
**does not exist on real MobileSafari iOS 19**. "Identical in chromium and webkit to ±0.02" is
therefore evidence about two headless engines, not about Safari — and ship 1 changes behaviour on
**fine pointers only**, the regime `RESULTS.md` §0 records as unreachable this pass (screen
locked, no desktop Safari, no Web Inspector). The lane's single most visible pixel change ships
with zero real-Safari witness.

---

## 5 · MAJOR — the deletion's own defect relocated, ungated

Ship 3's justification for deleting the wrappers: they were "a byte-for-byte second copy of this
list". The replacement, `SudokuGame.vue:47-63`, is a **byte-for-byte second copy of
`src/games/sudoku/game.ts:29-45`** — same two sections, same keys, same `ariaLabel`, same
`onChange` bodies. The duplication did not die; it moved from a wrapper into a scene, and its only
guard is a prose comment.

The TDZ reasoning for *why* it can't read `sudokuGame.options` is sound. The absence of any
mechanism keeping the two copies equal is not. `sudokuGame.options` is live (four other games'
`game.ts` files are in Lane A's blast radius this very pass) and nothing goes red when the two
diverge — no unit test (§3 above: the scene wiring is uncovered), no `lint` rule, no e2e assertion
on sudoku's heading set. Cheapest closure: one vitest asserting `sudokuGame.options(model)`
deep-equals the scene's list, or hoist the list into the `constants.ts` both already import (which
breaks the cycle without duplicating anything).

---

## 6 · MAJOR — ship 1 grows a live-filtered subtree, and the mark-4 grep gate is structurally blind to it

`.deal-btn` (template `:393` and `:567`) sits **inside** `<div class="control-panel-filtered">`
(`:336` / `:538`), and `.control-panel-filtered { filter: url(#grain-static) }` (`:719`, `:799`).
The fix takes that button from **44 × 44 → 55.94 × 54.38** (chromium) / **55.95 × 54.36** (webkit)
on every fine pointer — **+10.38 px of height, +11.94 px of width inside a live SVG-filtered
subtree**, in the campaign (T4-P1) whose entire subject is Safari raster cost.

The grep gate counts *added `filter:` lines*. It cannot see a filtered element's box growing, and
`RESULTS.md` §0 records that every paint/raster threshold was **NOT MEASURABLE this pass**. So the
one change most likely to cost Safari raster area shipped under a gate that is green by
construction, with the measurement that would have priced it unavailable. `rig/die-*.json` records
the button and the svg; it records **nothing** about `.control-panel-filtered`'s box or
`.controls-card`'s height.

Two consequences the dossier does not carry:
- **Cross-lane collision.** +10.38 px of card height is spent while Lane B's G1 gate is fighting
  `.controls-card` overflow (`RESULTS.md` §2 G1: 495 px of scroll on `dist-base`) and Lane C's M3
  banks −32 px at coarse. `blast-radius.md` §3 lists `.icon-btn` DOM order and computed width as
  slow-down surfaces; **card height is not listed**, and Lane D just moved it.
- **The invariant comment states one bound of two.** "ORDER IS LOAD-BEARING … Never move this up"
  is true; the block must **also** stay above the `@media (pointer: coarse)` `.icon-btn` block at
  `:883-897`, or Deal's mobile box changes. The report's residuals section names that move as an
  available fix, so a future author reading only the comment can take it and silently alter the
  coarse pose.

---

## 7 · MAJOR — G6 relocated: monotonicity holds over the three minted rungs and nowhere else

The registry's binding lesson: *"monotonicity asserted over ALL rungs, old and new, or the
inversion just relocates."* `gateMonotone` iterates `LADDER` — the three new tokens — only.

The neighbouring quiet voice is `--color-muted-foreground`, worn by `.icon-sublabel`, the very
element whose armed state Lane D recoloured. Re-derived on `--color-card` with the script's own
math:

| | light | dark |
|---|---:|---:|
| `--ink-press-rule` 55% | 3.534 | 4.360 |
| **`--color-muted-foreground`** | **4.646** | **7.689** |
| `--ink-press-quiet` 68% | 5.234 | 6.060 |
| `--ink-press-firm` 72% | 5.952 | 6.664 |

Light order: rule < **muted** < quiet < firm. Dark order: rule < quiet < firm < **muted**. The
untokenized rung sits second in light and **first** in dark — a cross-theme rank inversion over
the estate's real register. Concretely: raising the legend 55 → 68 makes the keyboard legend (meta
help) read **louder in light** than the button sublabels it explains, and the reverse in dark. The
report claims "The monotonicity clause forced two more closures"; the clause was applied inside
the token set, which is exactly where inversions are easiest to avoid and least likely to live.

Three smaller instruments in the same ship:

- **Phantom citation shipped in source.** `index.css:215` reads "Contrast on `--color-card`, light
  / dark (**assert-tested, assets/inkPressure.test.ts**)". No such file exists anywhere in the
  repo — `grep -rn inkPressure src/ scripts/` returns that comment and nothing else. Shipped code
  certifying itself against an artifact that does not exist is the spec-cites-itself failure mode
  in its purest form. The real gate is `scripts/check-ink-pressure.mjs`; say so.
- **Closure 3 is ungated.** `.icon-sublabel.is-armed` rose → red-ink is covered by no gate at all —
  `lint:ink` reads only the three graphite tokens, and `blast-radius.md` §3 itself records "The
  armed sublabel's **colour** is unasserted". "Ship 4 — AA closures, **token-level, gated**" is
  true of 3 of 5.
- **The gate models one surface.** Every rung is scored on `--color-card`. `DifficultyTally`'s own
  retained comment says the **board margin** (4.32, not 4.34) and `CompletionVignette` overlays the
  board. A consumer that changes surface is invisible. This is what R2 existed to catch, and R2
  did not run.
- **`.legend-sep` is still sub-AA inside the component the lane says it closed.**
  `opacity: 0.7` on inherited `--ink-press-quiet` = 68 × 0.7 = 47.6% graphite → **2.877 light /
  3.564 dark**. Better than the 2.274 / 2.747 it replaced, still under 4.5 for text, and the
  ladder reports green because `opacity` is outside its model.

---

## 8 · MINOR — the font table does not sum to its own headline

`font-decision-row.md` §1 tabulates seven strings and totals **6/41 = 14.6%**. The seven rows sum
to **9/50 = 18.0%**. The 41 is the six rows excluding `BOARD SIZE` (9 letters, 3 hits) — defensible
(it's futoshiki's alternate for `SIZE`, never co-visible) but never stated, and the excluded row is
the **best-covered** one, so the headline flatters the finding. Per-screen totals are 6/41 (sudoku)
and 8/46 = 17.4% (futoshiki). Say which denominator the 14.6% is, or drop the row from the table.

## 9 · MINOR — citations drift, and the cited rig path no longer holds the lane's evidence

- `blast-radius.md` §4 cites the coarse `.icon-btn` block at `GameControlPanel.vue:892-900`;
  it is at **888-897**. The report cites `:879`; the media query opens at `:883`.
- `laneD-report.md` cites `SudokuGame.vue:38-46` for the TDZ note; `blast-radius.md` §1 cites
  `:38-63`. The comment runs `:38-47`, the block `:38-63`. Two Lane D documents, two citations.
- `laneD-report.md` names `…/pass2/rig/` as its rig. That directory is **shared scratch, since
  overwritten**: `gate-mark4.sh` and `added.txt` are timestamped 05:53 (Lane D's report is 05:43),
  `cd` into `.claude/worktrees/wf_6e1b18f4-0f2-1`, and append Lane A's `useStagingBridge.ts` and
  `StagingBand.vue`; `rig/node_modules` symlinks into lane C's worktree. Lane D's own mark-4
  artifact is not recoverable from the path it cites. Only `die-*.json`, `font-*.{mjs,json}`,
  `mn-gap.mjs` and `fonts/` are demonstrably Lane D's.

## 10 · MINOR — "maintained as lanes move" is a 05:41 snapshot

`blast-radius.md` is timestamped 05:41; the other lane reports land 05:45–06:00 and `RESULTS.md`
at 06:35. The map carries no Lane A surface (`useStagingBridge.ts`, `StagingBand.vue`,
`--staging-reserve`), no Lane B ticket, no Lane C `.tray-well` / `--sheet-washi-neutral`, and none
of the device rows that bear directly on it: Lane B G2's **1.6 px** `.ctrl-btn` neighbour gap
failure, Lane B G4's **−8.9 px** Deal keypad clearance, the build-independent **~280 ms**
drawer-open WebKit stall, and — squarely Lane D's — **Lane C M5's explicit routing of
`--sheet-washi-neutral`'s dark value to "Lane D, estate-wide"**, which is an open inbound ship the
dossier does not know about.

---

## 11 · Failure-mode checklist, ruled

| mode | verdict |
|---|---|
| vacuous convergence | **charged** — 5/5 "landed" while 3 rest on arithmetic that fails re-derivation (§1, §3) |
| spec-cites-itself | **charged** — `index.css:215` cites `assets/inkPressure.test.ts`, which does not exist (§7) |
| gates that cannot fail | **charged, demonstrated** — `--self-test` ownership green under a sabotaged collector *and* a live reintroduction (§2) |
| elegant-reduction | **charged** — −419 headline, tree net **+9**; duplication relocated rather than removed (§1, §5) |
| legacy aliases | **clear** — the `.icon-btn.deal-btn` bump was rejected on the record |
| masked fallbacks | **charged** — sudoku's hand-copied `sections` silently substitutes for the declaration route, ungated (§5) |
| unverified gestalt | **charged** — zero device rows; `RESULTS.md` M5 refutes the headless-WebKit-⇒-Safari warrant the lane relies on (§4) |
| consumer-less substrate | **clear** — all three rungs have live consumers, and a zero-consumer stop is refused by name |

## 12 · What closes this lane

1. Restate the ledger: **15 files, +503 / −494, net +9**. Correct it in `blast-radius.md` §4 too.
2. Make the ownership self-test mutate a real file; add the `--grid-line-color` spelling and `.ts`
   to the collector.
3. Restate coverage as **18 out / 10 in**, and add the one test that pins
   `sudokuGame.options(model)` ≡ `SudokuGame.vue`'s literal — it closes §3 and §5 together.
4. Delete or repoint the `assets/inkPressure.test.ts` citation in `index.css:215`.
5. Extend `LADDER` to score `--color-muted-foreground` (and model `opacity` for `.legend-sep`), or
   state in the source that the ladder governs three tokens and not the register.
6. Measure `.control-panel-filtered`'s box and `.controls-card`'s height before/after ship 1, and
   add card height to `blast-radius.md` §3.
7. Run R1 and R3b on real Safari, or mark ship 1 and ship 3 **unverified in their only changed
   regime** and stop citing two headless engines as agreement.
