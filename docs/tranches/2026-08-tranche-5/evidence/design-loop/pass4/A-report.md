# STAGE A / LANE A — PASS 4 · F4's PICKER STAGING

Tree: **MAIN**, `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`, five commits
`236d22fe → 2708716e → 94ce993e → c6eda619 → 3969f512` on top of `347826be` (stage BC's close).
Nothing pushed, nothing deployed. `:4894/:4895/:3001/:4288` untouched; the lane's dev server ran
on `:5321` and the built-dist preview on the config's own `:4188` (verified free before the run).

Work order: pass3-registry §2, Lane A rows 1–5, plus the A8–A15 minors at ≤5 LOC each. Every
row below is CLOSED or STRUCK IN THE OPEN with its reason. Gate logs are on disk under
`pass4/logs/A/` — an unbanked gate does not exist.

---

## 1 · A1 — THE DATA-LOSS ROW, AND ITS BORN-RED

**The defect.** `attemptSelect` has guarded one loss since Wave D: leaving a dirty board for a
different game. Pass 3 gave `attemptDeal` a TARGET-ledger test and dropped the source test, so
stepping to a card whose ledger row was absent or clean and pressing `deal` unmounted a board
with work on it, silently. Two verbs, one slip, one keystroke apart.

**The cure**, `GameGallery.vue`:

```
const destroysWork =
  (target?.board === true && target.userMoves) ||
  (props.dirty === true && props.currentId != null);
```

The second arm SUBSUMES pass 3's same-id fallback (`props.dirty && card.id === props.currentId`)
— the id comparison was the whole defect. Net product change: one line replaced, one line gone.

**BORN-RED, banked.** `gate1-C1-RED-source-arm-removed.log`: `destroysWork` patched back to the
pass-3 shape, whole spec re-run —

```
1 failed
  gallery-deal.spec.ts:314 › guard: a cross-game deal ABANDONS the mounted board —
                              dirty sudoku, clean target, ribbon
16 passed
```

Exactly the row that names the defect, and nothing else. Restored: `gate1-restored-GREEN.log`,
17/17. The row's own negative control ships beside it (*"a PRISTINE mounted board deals across
with no ribbon"*), so the source arm can be observed NOT firing.

**A14, folded in.** The ribbon's sub-line was a constant inherited from the select intent. It is
keyed to what is actually at risk now: the target's (`kenken's marks aren't saved`), the mounted
board's (`your marks aren't saved`), or both (`neither board's marks are saved`). Second control:
`gate1-C2-RED-subline-not-rekeyed.log` — the constant restored reds only the BOTH row.

**On glass, measured** (`ribbon-geom.log`, 36 cells = 2 engines × 2 themes × {1440, 375, 320} ×
3 states, built dist, DPR2): overflow `0/0` in all 36; the note's rect is IDENTICAL across the
three states at every width (320×115.31 · 300.94×106.2 · 255.83×106.2), so the copy change moves
no box and triggers no `HandDrawnOutline` re-bake; the longest string keeps 31.73px of slack per
side in the tightest cell (320) and stays single-line; `text→actions` is 9.59px in all 36 — no
wrap into the verb row. Shots: `pass4/shots-A/*.png` (36).

> **RESTAMPED at pass 6 (A5-G2, A5-G4, A6-G1) — the sentence above stands as written; these three
> corrections ride beside it, nothing is erased.**
> 1. **`overflow 0/0` is RETIRED as evidence.** Pass 5's falsifying arm reads 0/0 on a string that
>    cannot fit (4 lines, `noteH` 106.2 → 166.2) — the note grows, it does not clip — so the column
>    reported a property this layout cannot violate. The load-bearing columns are **`subLines`** and
>    **`noteH`**. No headline may cite the ribbon's `overflow` again.
> 2. **31.73px is a CONTENT-box slack, and the noun is now required.** Pass 5 read 45.33 on the same
>    shipped ribbon from the note's BORDER box; pass 6's one-instrument arm reproduces all three of
>    this row's 320 cells — 51.96/51.98 · 41.40/41.40 · 31.73/31.74 — on the content referent at
>    `abe533c4`, two waves later, and the gap is exactly `.guard-note`'s 13.60px horizontal padding.
>    Both figures are true of the same pixels; neither is struck
>    (`pass6/A/logs/A6-10-referent-arm.log`).
> 3. **`pass4/shots-A/` does not exist in the tree.** No number here rides those shots — the geometry
>    is in `logs/A/ribbon-geom.json`, and pass 6 regenerated it.

---

## 2 · ROW-BY-ROW DISPOSITION

| row | disposition |
|---|---|
| **1 · A1** the dirty-MOUNTED arm + the e2e cell that reds without it | **CLOSED** — §1; born-RED banked (C1), sub-line re-keyed and separately controlled (C2) |
| **2 · A5** same-game deal handled at the `dealStaged`-false site; the false comment dies; one same-game e2e row | **CLOSED, and the charge partly REFUTED** — §3 |
| **3 · A3** verb ink measured with C's inkmass instrument, or struck | **CLOSED — measured**, 12 cells, with a falsifying control — §4 |
| **4 · A4** the same-id `setGame` no-op adjudicated either way, ruling written | **CLOSED — KEPT**, ruling at the site, and now gated — §5 |
| **5 · A6** census made hover-aware, or the grep pre-filter restored beside it | **CLOSED — hover-aware, in the shipped spec, both regimes**, born-RED at source — §6 |
| A2 goldens claim | **RESTATED** — §7 |
| A7 M4 blind read | **OWNER ROW, unchanged** — ≥4 uninstructed cold readers; artifacts staged |
| A8 canRestore isomorphism overstated | **CLOSED** — the interface says VALUE half, and names the `initial.source` clause it does not carry |
| A9 8-tab-stop claim is sudoku-only | **CLOSED** — the row measures the card it stands on: 8 on sudoku, 9 on futoshiki |
| A10 dead `aria-keyshortcuts="d"` | **CLOSED — scoped, not deleted**: the band resolves its own `d` through the same emit; control C3 reds the row when unbound |
| A11 `unionArea` is a sum | **CLOSED BY LANE D** — the shipped `filter-census.spec.ts` computes a scanline union (overlapping pose stacks counted once). No in-tree surface still calls a sum a union |
| A12 dead `liveRegionText` probe | **STRUCK** — a pass-3 scratchpad rig field, no repo surface, no claim rests on it. This pass's rigs do not carry it |
| A13 "81 unchanged" has no base arm | **STRUCK as stated** — the *claim* in tree is the lane's DELTA (`staging controls inside role=option = 0`), which is asserted with its reason at the site; the 81 is Wave C2's shipped population and remains an owner row, not a measurement this lane makes |
| A15 the gallery census has no consumer | **PART** — the picker regime is now gated in-repo for the hover class (§6). Its POPULATION (17) is still measured, not an allowlist. Named as residue, §8 |

---

## 3 · A5 — THE FALSE COMMENT DIES, AND THE BRANCH TURNS OUT TO BE REACHABLE

The critique charged that `if (sameGame && !(await dealStaged(pair))) stageHandoff(…)` catches
`false` into an arm nothing can consume. Checked against the code rather than restated:
`useGameState` calls `registerStagingSource` **at setup**, so `dealStaged` returns `false` for
exactly one reason — no scene has mounted yet. And a mount that has not happened yet is precisely
the thing that consumes an id-keyed arm (`consumeHandoff`, before init).

So the branch is **live**, its reachable case is a `?view=gallery&game=<lazy>` deep link dealt
before its chunk resolves (four of five games are lazy), and the pass-3 comment was wrong about
*which* mount consumes it — it claimed the one `setGame` would produce, and `setGame` to the id
already selected is a no-op cut. The comment is rewritten to say that; the code stands.

**Gated, deterministically, not raced.** `gallery-deal.spec.ts` › *"a same-game deal issued
BEFORE the scene mounts still lands the staged pair"* holds the futoshiki chunk with a route
handler released only after the click. **BORN-RED**: `gate1-C4-RED-deferred-arm-dropped.log` —
the re-stage deleted reds that row alone (futoshiki mounts at its 5×5 default), 16 others green.

The other half of the order — *no e2e row exercises the same-game deal at all* — is closed by
*"a same-game deal rides the BRIDGE"*: the staged pair lands AND the scene root's stamp survives
the deal, so the bridge path is asserted to be a bridge. **BORN-RED**:
`gate1-C5-RED-samegame-off-the-bridge.log` — the same-game deal routed through the handoff
instead reds that row alone.

---

## 4 · A3 — THE VERB INK, MEASURED (order 5's dropped clause, paid)

Lane C's inkmass instrument (`pass2/rig/inkmass.mjs`), re-pointed at the picker regime:
`pass4/rigA/verb-ink.mjs`, built dist, 1280×900 DPR2, 2 engines × 2 themes × 3 arms = 12 cells.
Raw: `logs/A/verb-ink.json`; console: `logs/A/verb-ink.log`.

```
arm                     mass safe → deal        density safe → deal      gate
shipped                 333.74 → 770.53 ×2.31   0.09146 → 0.20208 ×2.21  PASS  (4/4 cells)
control: die hidden     333.74 → 656.76 ×1.97   0.09146 → 0.17224 ×1.88  PASS  (4/4 cells)
control: flat           333.74 → 278.60 ×0.84   0.09146 → 0.07307 ×0.80  FAIL  (4/4 cells)
```

(chromium/light shown; the spread across all four engine×theme cells is ×2.27–2.31 mass,
×2.18–2.21 density shipped, and ×0.83–0.84 / ×0.79–0.80 in the `flat` control.)

**What it says.** The destructive verb IS the heavier mark, measured, in both engines and both
themes — the rank claim pass 3 asserted structurally is true on the instrument as well. **And the
glyph is not the sole carrier**: hiding the die (visibility, so layout holds) costs 113.77 CSS px²
of 770.53 — 14.8% — and the verb still out-inks its neighbour ×1.97. Pass 2's border-weight
distinction was therefore not worthless; it is ~85% of the measured ink difference. The
structural argument (a glyph against no glyph) survives greyscale and low-res, which is a
different property the instrument cannot see — both legs are now stated for what they are.

**The gate falsifies.** The first control did not, so a second was written: `flat` reverts the
deal verb's own border weight and background tint to the shared `.staging-btn` rung as well, and
the gate FAILS 4/4 — "deal" (4 glyphs) does not out-ink "start" (5) on its own.

**Instrument defect found and named** (travels with the instrument, so it is a cross-lane row):
`inkmass.mjs` accumulates the SIGNED `paper − pixel`, which assumes ink is darker than paper.
Run 1 of this rig read `mass 0.00` in all four dark-theme cells on plainly-inked elements. This
rig uses `|paper − pixel|`; the light-theme numbers are unaffected. Any dark-theme ink figure
taken with the pass-2/pass-3 instrument is 0 by construction.

---

## 5 · A4 — THE SAME-ID `setGame` NO-OP, ADJUDICATED: KEPT

Ruling, written at `App.vue`'s early return: a remount is the wrong instrument for **both**
callers. The gallery's same-game DEAL rides the staging bridge into the live board (no remount,
no second solver dispatch, marks and undo spine intact); its same-game SELECT is a visit to the
board you are already on. A forced remount would throw away the board on the one path whose whole
promise is keeping it. The `cut` line's real job is named too: `scene` can lag `game` mid
page-turn, so a re-select of the outgoing game re-asserts the mounted scene rather than
deadlocking behind an `erased` that will never come for it.

The ruling is no longer only prose: the bridge row stamps the scene root before the deal and
requires the stamp to survive it, and control C5 reds that row the moment the same-game deal is
routed anywhere but the bridge.

---

## 6 · A6 — THE CENSUS LEARNS TO HOVER (and A15's first half)

Pass 2's mark-4 breach was `@media (hover:hover) .ctrl-btn:hover { filter: url(#wobble-heart) }`.
Its replacement — the rendered census — samples at rest, where that rule computes to `none`, and
its injected control is resident, so it could not fail on the hover case either. The successor
inherited the blindness of the thing it replaced.

**G3.5, shipped into `e2e/filter-census.spec.ts`, both regimes, against the built dist:**

- the pointer is MOVED (`mouse.move` to each candidate's own centre, one sample per surface
  class), never `locator.hover()` — actionability checks scroll, and scrolling moves the
  population being measured;
- the assertion is the one a count can carry: **a hover may not RAISE the filtered population**.
  `url(#wobble-heart)` is already resident (the attribution hearts), so a value comparison would
  have missed this exact defect; the count does not;
- a stability precondition first — two counts 400ms apart must agree;
- its own control every run: a `:hover { filter: blur(1px) }` rule injected over four control
  families must be caught, then removed and the population must return;
- the **picker regime is censused at all for the first time** — `filterBudget.ts` states the
  BOARD population and says so, while the band's chips ARE the `.ctrl-btn` that carried the
  wobble.

**BORN-RED AT SOURCE, not in the harness** (`gate1-C6-RED-hover-wobble-reauthored.log`): the
pass-2 rule re-authored verbatim in `OptionSelector.vue` and rebuilt —

```
✘ G3.5 · … board regime    [board]  button.ctrl-btn → +1, div.zone-row → +1
✘ G3.5 · … PICKER regime   [picker] button.ctrl-btn → +1, div.staging-axis → +1
✓ G3.1  ✓ G3.2 ×2  ✓ G3.3          ← green throughout, which is the charge in one line
```

Restored + rebuilt: `gate-filtercensus-restored-GREEN.log`, 6/6.

---

## 7 · A2 — THE GOLDENS ROW, RESTATED

Pass 3 banked `goldens 4 passed` inside its single-tree guarantee; MEASURE refuted it
(`logo-light` red 3948px, 3/3 on head AND base). **The pass-3 claim was false when it was made.**
It is true now for a reason that is not this lane's: Lane D re-minted `logo-light`'s darwin
baseline at `64fa37a4` this pass. Taken at the Lane A seal (`gates-goldens.log`):
`4 passed` + `[golden-bytes] PASS`. No golden clips the band or the ribbon, and nothing was
re-baselined here.

---

## 8 · OPEN, BANKED HONESTLY

1. **The M4 blind read** — owner row, third pass. ≥4 uninstructed cold readers, captioned-free
   crops of the band's `start`/`resume`/`diverged` faces. This lane still does not grade it. The
   ink measurement (§4) is the instrument leg of the same question, not a substitute for it.
2. **The gallery's filtered POPULATION (17) is measured, not allowlisted.** The hover class is
   gated in that regime now; the exact-match count is not. Folding a `GALLERY_FILTER_BUDGET` into
   `filterBudget.ts` is a Lane-D-shaped ship and the population would have to be re-derived
   against the current tree.
3. **Crayon tints on the band's difficulty chips** — unchanged, blocked on the AA re-verify
   against `--color-card`.
4. **81 focusables inside `role="option"`** — Wave C2's live-face projection. Shipped,
   pre-existing, this lane's delta still zero and still asserted in that scope.
5. **The inkmass instrument's dark-theme blindness** (§4) — cured in this lane's rig only. Lane C
   owns the instrument.

## 9 · ONE INHERITED RED, FOUND AND CURED (a NEW GAP, attributed)

`e2e/font-census.spec.ts` — Lane BC's pass-4 ship — **reds at `347826be`**, the tree this lane
started from: `Fira Code · "fx" (span.tuner-fx) misses U+0066 U+0078`. Verified against the base
tree with this lane's work stashed, **3/3 deterministic** (`attrib-font-census-BASE-x3.log`); BC
banked it green because `FilterTuner` is an async component and raced their run. It is DEV-only
chrome (`import.meta.env.DEV`), absent from every artifact that deploys, so a census over the
shipped estate must not read it. Skipped by subtree, attribution at the site (`3969f512`).

---

## 10 · ESTATE AT THE SEAL — ONE TREE, ONE RUN, AFTER THE LAST EDIT

All rows taken at `3969f512`, working tree clean (`gates-FINAL-*.log`).

```
vue-tsc --noEmit         exit 0
prettier --check src/    clean          (e2e/ + scripts/ NOT formatted — the standing trap)
eslint .                 exit 0
knip                     exit 0
vitest                   332 / 31 files
test:font-coverage       OK — 2 subset faces (Fraunces 28cp/13,788B · Patrick Hand 46cp/4,312B)
e2e default              110 passed     (was 105; +5 gallery-deal rows)
  PLAYWRIGHT_BASE_URL=http://127.0.0.1:5321 (explicit — :3000 is the foreign palette-api)
e2e built-dist           16 passed      (filter-census 6 ← was 4; theme-bake ×2 engines;
                                         wordmark-webkit 6)  preview :4188, verified free
goldens                  4 passed  ·  golden-bytes PASS      (nothing re-baselined here)
lint:ink                 runs; its one ungoverned-register finding is Lane D's, unchanged
```

**LOC** — product code is 21 lines added, 4 removed; the rest of the src delta is the two rulings
and the two corrected claims, written where the code is.

```
src/   +82 / −19 raw   ·   +21 / −4 code   ·   +61 / −15 comment
e2e/   +318 / −8       (filter-census +123 · gallery-deal +189 · font-census +6)
total  +392 / −27      over five commits, 318 of them gate
```

---

## 11 · COMMITS

| sha | pathspec | what |
|---|---|---|
| `236d22fe` | `GameGallery.vue`, `StagingBand.vue` | the source-dirty arm, the re-keyed sub-line, the band's own `d` |
| `2708716e` | `App.vue`, `useStagingBridge.ts` | the two rulings at their sites + the `canRestore` precision |
| `94ce993e` | `e2e/gallery-deal.spec.ts` | five rows, five controls, the per-card stop count |
| `c6eda619` | `e2e/filter-census.spec.ts`, `filterBudget.ts` | G3.5, the hovered pass, both regimes |
| `3969f512` | `e2e/font-census.spec.ts` | the inherited red, attributed |

## 12 · GATE LOGS ON DISK — `pass4/logs/A/`

```
gate1-C1-RED-source-arm-removed.log        A1's born-RED (1 row, named)
gate1-C2-RED-subline-not-rekeyed.log       A14's born-RED (1 row)
gate1-C3-RED-band-d-unbound.log            A10's born-RED (1 row)
gate1-C4-RED-deferred-arm-dropped.log      A5's born-RED  (1 row)
gate1-C5-RED-samegame-off-the-bridge.log   A4/bridge born-RED (1 row)
gate1-C6-RED-hover-wobble-reauthored.log   A6's born-RED AT SOURCE (2 rows; G3.1/3.2/3.3 green)
gate1-newrows-GREEN-on-cure.log            17/17 with the cure
gate1-restored-GREEN.log                   17/17 after every control was reverted
gate-filtercensus-hover-first.log          6/6 first green
gate-filtercensus-restored-GREEN.log       6/6 after C6 reverted + rebuilt
attrib-font-census-BASE-x3.log             the inherited red, 3/3 on the base tree
gates-static.log · gates-vitest-font-ink.log · gates-e2e-default.log · gates-e2e-builtdist.log
gates-FINAL-static.log · gates-FINAL-e2e-default.log · gates-FINAL-e2e-builtdist.log
gates-goldens.log · verb-ink.{json,log} · ribbon-geom.{json,log} · vite-5321.log
```

Rigs: `pass4/rigA/{verb-ink.mjs, ribbon-shots.mjs, serve.mjs}`. Shots: `pass4/shots-A/` (36).
