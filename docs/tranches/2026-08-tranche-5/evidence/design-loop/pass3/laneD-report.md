# LANE D — STAGE D · pass 3 dossier

Tree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion` — **MAIN**, base
`6800af04` (the sealed P1 patch). Stash `lane-d-pass2-ships` applied, reconciled, **dropped**.
Shots: `…/pass3/shots/` · rig: `…/pass3/rig/` · 2026-07-31. `frontend-design` invoked before the
shots; its calibration for this lane was again *restraint* — an evidence crop inside an
established pencil-notebook system shows real rendered pixels at identical geometry, with no
annotation layer competing with the design.

**Four commits, all on MAIN, nothing pushed:**

| commit | ship |
|---|---|
| `b4e2c447` | 4 — the graphite ladder, named; and a gate that can actually go red |
| `b075e95b` | 1 — Deal's crushed die: `.icon-btn.deal-btn`, and the geometry row that would have caught it |
| `d4e8e41e` | 3 — the 419-LOC wrapper deletion + the equality gate on the copy the TDZ cycle forces |
| `2335282c` | 2 — name the denominator the font finding is quoted against |

---

## 0 · The fact that re-priced three ships before any of them moved

The stash was cut at `32198688`. **P1-W2→W4 landed 13 commits between then and now, and P1-W3
group A deleted the estate's reference filters** — `.control-panel-filtered`'s
`url(#stroke-light/-dark)`, `.icon-btn`'s filter and hover wobble, `.section-heading:hover`,
`OptionSelector`'s `.ctrl-btn:hover { filter: url(#wobble-heart) }`, the glyph chains, the
loader. That single commit moots three pass-2 mark-4 charges (this lane's ship-1 "+10.4px inside
a live SVG-filtered subtree", Lane B's grain-static Deal growth, Lane A's composition breach) and
it means **the rendered filter census registry §4 ordered as the grep gate's successor already
exists and is green**: `filterBudget.ts` (exact-match allowlist, `FILTER_BUDGET_TOTAL` = 9) +
`e2e/filter-census.spec.ts` against the built dist at `retries: 0`.

Nothing in the pass-2 stash could be re-landed on its pass-2 warrant. Every ship below was
re-derived against `6800af04`.

---

## Ship 1 — the crushed die · **SHIPPED**, Lane C's mechanism, D's tree · `b075e95b`

The root cause reproduces exactly as pass 2 stated it: `.deal-btn` authored above `.icon-btn`,
tie at (0,1,0), later-wins pins the button at 44px, column content overflows 10.38px, a text item
cannot shrink below min-content, the die absorbs all of it → 28 × 17.616 predicted, 17.63/17.64
measured.

**Mechanism ruled: `.icon-btn.deal-btn` (0,2,0)** — C's and B's independent form, adopted over
this lane's pass-2 block move. The move restores the pose but leaves the cascade order-fragile
with only a comment standing between the estate and the next rule authored under `.icon-btn`.

**The second bound the audit named is closed structurally.** The bump also outranks the coarse
`.icon-btn` block, so Deal's coarse padding is RESTATED inside that block at matching
specificity — the shipped touch pose stays byte-identical, and widening Deal's mobile box is
left as the design call it is, unmade.

**The measurement the audit charged was never taken** (`rig/deal-box.{mjs,json}`; one build, both
engines, BEFORE reproduced in-page by pinning the button back to the base square):

| box | fine 1440×900, chromium · webkit | coarse iPhone 13 |
|---|---|---|
| `.deal-btn` | 44×44 → **55.94×54.38** · **55.95×54.36** | **44×52.16, unchanged** |
| die `svg` | 28×**17.63** → 28×28 · 28×**17.64** → 28×28 | 28×28, unchanged |
| `.control-panel-filtered` | 241×359.78 → **241×359.78** · 241.03×359.73 → **unchanged** | 350×126.02, unchanged |
| `.controls-card` box | 281×640 → **281×640** (clientH 640 — a clipped column) | — |
| `.controls-card` **scrollHeight** | 1028 → **1038 (+10)** | — |

So the growth is **+11.94w / +10.38h on the button, zero on the wrapper, zero on the card's box,
and +10px of SCROLL** — which is the collision with Lane B's G1 overflow row, booked in
`blast-radius.md` §2.3. And the wrapper it grows inside is not filtered at all any more.

**The gate that would have caught it.** `visual-regression.spec.ts` gains *"the Deal die is not
crushed"*: squareness ≤0.5px, die ≥27px, and `btn.h ≥ die.h + label.h` — the last is the general
form, failing for any cause. **GATE-1 negative control run:** patched back to the bare
`.deal-btn` selector it goes RED; green on the fix. Shots: `shots/deal-{chromium,webkit}-{light,
dark}-{before,after}.png`, same clip anchored on the stationary `.deal-row`.

## Ship 2 — the font row · **EXECUTED, not open** · `2335282c`

The B2 ruling **already shipped at P1-W3 `387cceea`**, together with §4's derivation rule and a
standing guard (`check-font-coverage.mjs`, in the CI lint lane, proven able to RED against this
lane's own 25-glyph file by naming `C M N` exactly). `font-decision-row.md` is restated against
the shipped tree and marked EXECUTED, with the price corrected from estimate to measurement:
**13,788 B, not 12,048 B** — the estimate covered rendered lowercase only, while "both cases of
any string passing a text-transform" additionally needs the six authored initials `B C D M N S`
at 1,852 B, which is exactly what makes the cut survive a later change of transform. Three faces
21,724 B. The m+n gap is closed and gated (G3.4, 6/6 WebKit).

**The sum statement is fixed at the shipped site, not only in the row.** 6/41 and 9/50 are both
right and neither was labelled: 41 is the sudoku screen (the table minus `BOARD SIZE`, futoshiki's
alternate for `SIZE`, never co-visible). All three denominators — **sudoku 6/41 = 14.6% ·
futoshiki 8/46 = 17.4% · every distinct heading string 9/50 = 18.0%** — now ride `index.css`'s
DERIVATION RULE comment, which is the first thing a future subsetter reads.

## Ship 3 — the wrapper deletion, re-derived and gated · `d4e8e41e`

Re-derived against the CURRENT tree with the blast method: **P1 deleted no panel components** —
`6b8c1ffd` deleted panel *filters* and `0642e098` `v-if`ed the twin *cards*. All four wrapper
files were still present at `6800af04`. Deletion re-priced there: **419 LOC exactly** (99 + 114 +
100 + 106), zero importers, the three `constants.ts` retained (five importers on sudoku's alone),
knip green.

The TDZ finding stands and is now **gated rather than narrated**: `sudoku/game.test.ts` mounts the
scene with a `GameScene` stub that renders the named `controls` slot (a default stub renders no
slots — without it the test would assert nothing) and requires the scene's list to equal
`sudokuGame.options(model)` in shape and in what each `onChange` moves. **Both negative controls
fire:** dropping `ariaLabel` reds the shape row; rewiring the difficulty handler reds the
behaviour row.

**Coverage restated honestly: 18 out (9 + 9), 12 in (10 + 2), net −6**; suite 307/29 → 301/29.
The +38 LOC of per-scene wiring the deletion created is out of `GameControlPanel.test.ts`'s reach
by construction (it mounts a synthetic `SECTIONS` literal) — that is what `game.test.ts` covers,
and both files now say so at the top.

Still owed, named: **R3b — the TDZ cycle on real Safari.** Cyclic-ESM evaluation order is
engine-specific; only chromium is proven. Blocked on the locked rig session.

## Ship 4 — AA closures + a self-test that can fail · `b4e2c447`

The three rungs, the two forced closures and the ±0.02 re-derivations all stand. The four
closures the audit demanded:

1. **`--self-test` made falsifiable.** The ownership case asserted a regex against a hardcoded
   string, so `sources()`, the recursion and the index.css exemption were never exercised. It now
   walks a REAL temp fixture tree — `nested/bad.vue` (alias spelling), `nested/bad.ts`,
   `assets/index.css` which must be SKIPPED — through the real collector and requires **both**
   bad files named. **Probe: with `sources()` sabotaged to return `[]` the self-test now exits 1
   on two counts** (it exited 0 in pass 2, even with a live reintroduction on disk).
2. **The alias evasion closed.** `--color-pencil-graphite` literally aliases `--grid-line-color`,
   so `color-mix(in srgb, var(--grid-line-color) 62%, transparent)` walked past. Both spellings
   now match, in the ownership gate and the stop parser. Probe: injected into `MarginNote.vue` →
   RED. `sources()` also takes `.ts` now. Probe: a `.ts` reintroduction → RED.
3. **Closure 3 gated.** `gateArmed` requires `.icon-sublabel.is-armed` to NAME `--color-red-ink`,
   to not carry the raw wax, and that token to clear 4.5 on `--color-card` in both themes — read
   out of index.css by a resolver that follows `var()` aliases, so the assertion cannot drift
   from the theme values. Probe: reverted to `--color-crayon-rose` → RED, three ways.
4. **The phantom citation deleted.** `index.css` cited `assets/inkPressure.test.ts`, which has
   never existed in this repo. It names `scripts/check-ink-pressure.mjs`, which does.

**The estate-register inversion is ledgered.** `--color-muted-foreground` is **4.646 light**
(between rule and quiet) and **7.689 dark** (above firm) — it crosses the ramp between themes, so
the legend raised to quiet reads louder in light than the sublabels it explains and quieter in
dark. Tokenising it re-pitches every muted surface: a design ruling, not an AA repair. It is
**booked, not gated** — `index.css` §INK PRESSURE says so at the site and the script prints the
rank in both themes on every run:

```
  light  rule < muted-foreground < quiet < firm
  dark   rule < quiet < firm < muted-foreground
```

**`.legend-sep`'s 2.877 cured, not renamed.** `opacity: 0.7` on the inherited quiet rung = 47.6%
graphite = 2.877 light, sub-AA text inside the component this ship claimed to close, invisible to
a ladder that reads declared stops rather than composited alphas. The opacity is deleted rather
than tuned, and the model gap is written at the site.

## Ship 5 — the blast map · refreshed to the post-P1 post-D tree

`…/pass2/blast-radius.md`, rewritten against `6800af04`. New or re-derived: §2.1 the filter
deletion and the three mark-4 charges it moots · §2.2 the census that already satisfies registry
§4 · §2.3 ship 1's measured price including **card scrollHeight** · §2.4 the settled `.deal-btn`
mechanism · **§2.5 there is no drawer below 1024** — `GameScene` mounts `#controls-drawer` only
under `v-if="rowRegime"`; on a phone the panel is `.mobile-board-width` in flow and
`querySelector('#controls-drawer')` returns null, which re-points the ~280ms "drawer-open" stall's
regime and its hypothesis (the three-pass stroke filter it names was deleted by P1) · §2.6 P1's
six new surfaces every lane inherits · **§3 C0, the dominant new collision: A, B and C are 13
commits behind MAIN and none of their hunks is readable before a rebase** · C2 marked RESOLVED,
C4 narrowed, C10 partly discharged.

---

## Gates — one run, on the committed tree, after the last edit

vue-tsc **0** · vitest **301 / 29 files** · eslint · knip · prettier · `lint:ink` green with all
four self-test cases proven able to fail · `test:font-coverage` 28 codepoints / 13,788 B / 12
strings both cases · **default e2e 78 / 78** (was 77 — ship 1's row) · built-dist lane **13 / 13**
(filter-census 3, theme-bake ×2, wordmark-webkit 6) · `npm run build` green ·
`test:golden:bytes` PASS.

**LOC ledger of record, re-derived, no elegant-reduction claim:** 17 files, **+828 / −483, net
+345** (tracked 14 files +185/−483; untracked `check-ink-pressure.mjs` 390,
`GameControlPanel.test.ts` 152, `sudoku/game.test.ts` 101). The lane buys gates and tests with
lines. Pass 2's headline was +146/−514 (net −368); its audit re-derived +9; this is the tree.

---

## Two reds I did NOT touch, and the proof they are not mine

`playwright-golden.config.ts` on darwin reds **`logo-light` (3948 px, ratio 0.03)** and
**`toggle-crest-dark` (1028 / 1194 px)**. I built `6800af04` in a throwaway worktree, served it on
a second port, and ran the same config: **both fail there, with byte-identical pixel counts,
deterministically over three isolated runs each.** They are pre-existing at the P1 seal and
unmoved by this lane — which is exactly the pair the sun-crest clause names as non-convergent.
Per the standing rule, **nothing was re-baselined on a single red**; the worktree was removed and
the rows are routed to the team lead.

## Residuals, stated not buried

- **`--sheet-washi-neutral` dark (the inbound row C's M5 routed here) is NOT shipped.** Zero
  assertions and zero goldens read the token, so it is free in test terms and wide in rendered
  terms; its gate is `lint:ink` plus a **dark device shot**, and the rig session is still locked.
  Booked in `blast-radius.md` §2.7 with both consumers named.
- **`lint:ink` is still not in CI.** Standing team-lead row.
- **No on-device measurement, and this time by circumstance, not by a misquoted charter.** R1
  (die at fine pointer on real Safari) and R3b (TDZ on real Safari) both remain unrun; ship 1
  changes behaviour on fine pointers only, and `RESULTS` §0 records that regime as unreachable
  this pass. Both engines agreeing is evidence about two headless engines — M5 is the standing
  reminder that this is not evidence about Safari.
- **Deal's coarse padding** is preserved at the shipped 0.5rem by explicit restatement. Widening
  it to the fine 0.85rem is an open design call, not a bug.
