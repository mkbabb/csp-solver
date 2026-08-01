# LANE D — STANDALONE SHIPS · pass 2 dossier

**Worktree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend` — the MAIN tree, not a worktree** (per charter).
Shots: `…/pass2/laneD-shots/` · rig: `…/pass2/rig/` · 2026-07-31.
Nothing committed. `frontend-design` skill invoked before any visual artifact; its calibration for
this lane was *restraint* — a comparison instrument inside an established pencil-notebook system
must show real rendered pixels at identical geometry, not compete with the design.

---

## Status

| # | ship | status | diff |
|---|---|---|---|
| 1 | `.deal-btn` / `.icon-btn` cascade | **landed**, root cause found, both engines verified | `GameControlPanel.vue` +31/−26 (a block MOVE + comment) |
| 2 | font-subset owner decision row | **delivered** (a row, nothing applied) | 0 LOC in tree |
| 3 | 419-LOC wrapper deletion | **landed**, blast-radius corrected, TDZ hazard found + mapped | −419 across 4 files; +47 in 2 scenes; +145 consolidated test |
| 4 | AA closures (3 named + 2 forced by monotonicity) | **landed**, token-level, gated | `index.css` +32; 5 consumers −26/+13; `check-ink-pressure.mjs` +234 |
| 5 | blast-radius map | **refreshed** | `blast-radius.md` |

**Tree total: 15 files, +146 / −514.** Mark-4 grep gate: **0** new `filter:` lines.
Checks: vue-tsc **0** · `npm run build` **green** · vitest **299/28 green** · eslint **green** ·
knip **green** · prettier **green** · `lint:ink --self-test` **green** · targeted e2e **40/40**.

---

## Ship 1 — the crushed die

**Reproduced first, in the real app** (not a mock): `#controls-drawer .deal-btn svg` measures
**28 × 17.63** (chromium) / **28 × 17.64** (webkit) at 1440×900 fine. Coarse 390×844 measures a
correct 28 × 28. `rig/die-before.json`.

**The true defect is source order, not specificity.** `.deal-btn` — a modifier of `.icon-btn` —
was authored at `:757`, *above* the `.icon-btn` base at `:804`, in the same scoped sheet. They tie
at `(0,1,0)`, so the later `.icon-btn { width: 2.75rem; height: 2.75rem }` won and pinned the
button at 44px. The column content then overflowed:

```
28 (die) + 2.4 (gap) + 14.384 (label) + 9.6 (padding) = 54.384   vs   44 available
overflow 10.384 → a text item cannot shrink below min-content, so the die absorbs all of it
28 − 10.384 = 17.616                              measured: 17.63   ✓
```

That arithmetic is why the coarse regime was fine: the `@media (pointer: coarse)` `.icon-btn`
block sits at `:879`, *after* `.deal-btn`, so on touch the override already won.

**Fix: move the `.deal-btn` block below the `.icon-btn` base.** One relocation, zero new
declarations, zero specificity escalation. I rejected the `.icon-btn.deal-btn` selector bump
(a smaller diff) because it masks the defect — the next rule added under `.icon-btn` would
re-break it. The comment at the site says so, so the block doesn't drift back up.

| | fine 1440 | coarse 390 |
|---|---|---|
| before | btn 44 × 44, **die 28 × 17.63** | btn 44 × 52.16, die 28 × 28 |
| after | btn 55.94 × 54.38, **die 28 × 28** | btn 44 × 52.16, die 28 × 28 |

Identical in chromium and webkit to ±0.02. **The coarse row is the negative control** and it is
byte-identical — the fix did not leak out of the fine regime.
Shots: `die-{before,after}-{light,dark}.png` (true before-pane, captured from the stashed tree —
not a simulated one).

---

## Ship 3 — the wrapper deletion, and the hazard it uncovered

**Blast-radius first, as ordered.** Pass-1's spec priced `sudoku/ControlPanel/` and
`futoshiki/ControlPanel/` as deletable *directories*. They are not: each holds a `constants.ts`
with live importers in `registry.ts` **and** up to three `game.ts` files. Only the four
`ControlPanel.vue` / `ControlPanel.test.ts` files were dead — **419 LOC exactly**. Deleted; the
three `constants.ts` stay; knip green.

**Then the hazard.** The obvious replacement is what thermo/killer/kenken do —
`sections = computed(() => sudokuGame.options(sudoku))`. I flagged it as a cycle risk from
`registry.ts:18,24` + `App.vue:14,27`, implemented it anyway, and **the app died at boot**:

```
ReferenceError: Cannot access 'sudokuGame' before initialization
```

Sudoku is the *eager* game, so `registry.ts` statically imports the scene; the scene importing
`./game` closes `scene → game → registry → scene`, and `registry`'s body evaluates
`gameRegistry = { sudoku: sudokuGame }` while that const is still in its TDZ. The four **lazy**
scenes have no such cycle. So futoshiki reads its declaration; **sudoku builds `sections` from its
own `constants.ts`**, with the reason written at the site (`SudokuGame.vue:38-46`) so nobody
"DRY"s it back in. Verified: all five games boot with an **empty console** and correct headings.

**Coverage was consolidated, not dropped.** The two deleted test files were byte-twins asserting
the *shell's* DOM through a relay wrapper — the same claim made twice against one implementation.
They are now `src/games/shared/GameControlPanel.test.ts`, asserting it once against the shell,
verbatim (18 tests out, 18 tests in; 299/28 total).

---

## Ship 4 — AA closures, token-level, monotone over every rung

The estate open-coded `color-mix(… var(--color-pencil-graphite …) N%, transparent)` at **six
different N across five files**. Reading it revealed the shape of the original defect: the
**T4-W10 gate-1 sweep already canonized 68% as the AA-clean quiet-text rung** — twice, with
comments saying so (`.heading-value` 60→68, `.dt-label` 62→68) — and then stopped.

So the three named closures do not mint a new stop; the legend **joins the existing one**. And
raising it exposed the G6 trap directly: MarginNote and CompletionVignette still sat at 62%
(4.34:1, sub-AA), so closing only the named three would have left the legend reading *louder*
than the margin note. **The monotonicity clause forced two more closures**, and they were genuine
sub-AA sites the W10 sweep missed.

| rung | token | stop | light | dark | floor | consumers |
|---|---|---|---|---|---|---|
| non-text furniture | `--ink-press-rule` | 55% | 3.53 | 4.36 | 3.0 | kbd borders (was 40% = 2.36) |
| quiet caption text | `--ink-press-quiet` | 68% | 5.23 | 6.06 | 4.5 | legend (was 55%), MarginNote + CompletionVignette (were 62%), `.heading-value`, `.dt-label` |
| firm | `--ink-press-firm` | 72% | 5.95 | 6.66 | 4.5 | `.dt-name` |

Strictly increasing in **both** themes. The ladder **loses two stops and gains none** (40/55/62/68/72
→ 55/68/72). Third closure: `.icon-sublabel.is-armed` `--color-crayon-rose` (4.10) →
`--color-red-ink` (4.98) — the swap `.crayon-rose` already makes two rules above; dark aliases the
same wax, so night is byte-identical.

My re-derivation matched the F5 critique to **±0.02** on every figure (55% → 3.534 vs 3.53;
40% → 2.361 vs 2.36; rose 4.098 vs 4.10; red-ink 4.977 vs 4.98).

**Gated: `npm run lint:ink`** (`scripts/check-ink-pressure.mjs`) — floors, monotonicity over all
rungs, and sole ownership of the ramp, with `--self-test` proving each gate fails on a known-bad
input. It lives in `scripts/` beside `check-golden-bytes` / `check-prod-shake` because it must read
real stylesheet bytes: `src/**` is typechecked by the browser tsconfig, which has no node types and
stubs `*.css?raw` under vitest. **Not yet wired into CI — a row for the team-lead** (CI runs
vue-tsc/eslint/knip/prettier/e2e, and notably *not* vitest).

---

## Ship 2 — the font row

Full artifact: **`font-decision-row.md`**. Headline: `.section-heading` is
`text-transform: uppercase`, and the Fraunces subset was cut from **authored** strings, so it
carries `B D S` and no other capital. **Headings render 6/41 = 14.6% Fraunces**; the rest is
Georgia at `font-weight: 800`, i.e. synthetic bold on a fallback serif — a plausible component of
the owner's "low-res / font loss" mark. `NEW GAME` and `CHECK` contain **zero** Fraunces glyphs.
Folded in as ordered: the m+n gap (`thermo`'s `m`, `kenken`'s `n`, mid-word Georgia), which
`text-transform: lowercase` does **not** fix.

Four priced options (A ship-as-is / B lowercase, 0 B / B2 lowercase + 5 glyphs, +2,368 B /
C re-subset caps, +15,560 B), rendered in both engines and both themes, state-pinned. Byte figures
are measured by re-subsetting a full Fraunces already on this machine — **no dependency added,
nothing copied into `src/`** — and validated by reproducing the shipped subset to within 0.9%.

---

## Two gates I built that could not fail, and how they were caught

Reporting these because the loop keeps charging lanes for them and I shipped two before catching them.

1. **The ownership regex.** `var\(--color-pencil-graphite[^)]*\)` can never reach the percentage —
   the graphite var carries a `var(--grid-line-color)` fallback, so the first `)` is eaten by the
   fallback. The gate passed on a *deliberate reintroduction*. Caught only by running the negative
   control; now matched against whitespace-stripped source and re-verified against the real form.
2. **The font-provenance probe.** Measuring each glyph against Georgia and calling any width
   difference a "Fraunces hit" reported **100% coverage for every option including today's** —
   uncovered glyphs fall through to the *default* face, not Georgia. Replaced with the
   sentinel-fallback method and an inline control (`B` must be true, `Ω` false) asserted on every
   run. Without that catch this dossier would have told the owner the fonts were fine.

Both are now documented at their sites. The lesson generalises: a gate that has never been seen
red is an unmeasured claim.

---

## Residuals, stated not buried

- **Deal's coarse padding** is still clobbered `.85rem → .5rem` by the later coarse `.icon-btn`
  block. Pre-existing and unchanged by this pass. Moving `.deal-btn` below that block would fix it
  but changes Deal's mobile box — a design call, not a bug fix, so Lane D left it. Flagged in
  `blast-radius.md §4` and `MEASURE-REQUESTS R5`.
- **`lint:ink` is not in CI.** Team-lead row.
- **No on-device measurement.** By charter. `laneD-MEASURE-REQUESTS.md` lists five rows with
  thresholds and negative controls; **R3b (the TDZ boot cycle on real Safari) is the highest-value
  one** — cyclic-ESM evaluation order is engine-specific and I only proved chromium.
