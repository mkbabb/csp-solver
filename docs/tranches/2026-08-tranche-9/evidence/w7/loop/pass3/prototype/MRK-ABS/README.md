# PASS-3 PROTOTYPE · MRK-ABS · One visible hand

It RUNS. Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39`,
branch `worktree-wf_f72f3b5a-83a-39`, off `74a2b5d9`, uncommitted, **13 files, +180/−66**.
Servers: prototype dev `127.0.0.1:4239`, HEAD control `127.0.0.1:4240` (main tree at
`74a2b5d9`, read-only, never built), built preview `127.0.0.1:4241` — all three killed before
this was returned, band verified clear. Both engines throughout.

---

## 0 · What the replay carried

`git -C <the pass-2 worktree>` is refused to a worktree-isolated agent, so the chair's declared
fallback was taken: the pass-2 critique's `filesTouched` (12 files) copied across whole, route
stated. The fold's own 11 `src` files (`BoardHost.vue`, `DigitCell.vue`, `GameBoard.vue`,
`GameControlPanel.vue`, `useGameCell.ts`, `solver/classifyError.ts` and the five tests) and the
pass-2 12 are **disjoint** — verified by name against `git diff --name-only a8fee1f5 74a2b5d9`
— so **nothing conflicted and nothing was re-cut toward the fold**. The replay reproduced pass
2's own figure exactly: `+145/−37` over 12 files. `vue-tsc -b --noEmit` exit 0 on the replayed
tree before the delta.

Carried: `index.css` (the token pair, the `@layer base` block, the `.dark` alias, the `:219`
comment, `outline-ring/50` deleted), `gridPaths.ts` + `pencilConfig.ts` (`RING_GEOMETRY`,
`cellSegments = 4`, the inset rect, the roughness inversion), `gameCell.css` (tier 2 → 0.95),
`DrawerTab.vue`, `DarkModeToggle.vue`, `GameCard.vue`, `StagingBand.vue`, `GameGallery.vue`,
`HandwrittenLogo.vue`, `OptionSelector.vue`, `AttributionCard.vue`. The pass-2 worktree was
not edited and carries no untracked product file.

## 1 · The pass-3 delta (~35 lines net on top of the replay)

1. `pencilConfig.ts` — **`kW4` left the product** (`RING_GEOMETRY` is now exactly
   `{ wanderUnits: 5.4, inset: 0.86 }`, frozen); the comments re-cut from this base: σ in the
   reader's px, the honest per-rule ceiling, the crossover, MA-N's two numbers, and the
   sentence that the inset does **not** buy separation from the rule.
2. `gridPaths.ts` — the `kW4` mention out of the segments comment; bytes re-measured here.
3. `index.css` — `:727-732` (`.sudoku-cell:focus-within`) **DELETED**; `--color-ring` deleted
   at both arms (see §3.1); `:219`'s comment re-written to the measured readings; the dark
   arm **REFUSED** (§2.2) with the measurement that refused it written where it was going to be.
4. `gameCell.css` — the `:294-303` neutraliser **DELETED**; the prose at `:7`/`:10-11`
   corrected; the two dead `var(--color-focus-sketch, …)` fallbacks struck and the
   `.cell-native-input` modality comment corrected (MRK-LIVE's rows, chair §6.6 — replayed for
   measurement, cited, not owned).
5. `DigitCell.vue:33-34` — the "frozen DOM contract" prose corrected (the fourth site).

**Nothing new is mounted. Nothing new is minted.** Dies: one board-size branch, `kW4` from the
product, two focus rules, two minted radii, one dead token, the seventh rule at four sites, the
`outline-ring/50` sweep, two outline fades, MA-R as a gate, the "board 18 on B" comment, the
false dark-mode comment, and the dark arm itself.

---

## 2 · The decision this pass was called to make

### 2.1 MA-L from painted bytes — the frame crossing (G-ABS-6)

The instrument (`probe/p3-mal.spec.ts`) screenshots the board unfocused, focuses one cell
(programmatic `.focus()` + one key press — the recipe that arms `:focus-visible` in both
engines), screenshots again, and reads the SAME device pixels in both frames along the ring's
own left side. Per sample it takes the pixel that changed most in a 3×3 window (the stroke's
core, not its antialiased skirt), and the ground is named against the cell's own paper in
LUMINANCE, discovered from the surface.

| board | theme | cell | the ground the ring is ON | chromium | webkit |
|---|---|---|---|---|---|
| 9×9 | light | 0 | paper `[253,253,252]` | **3.97** | **3.97** |
| 9×9 | dark | 0 | paper `[19,18,17]` | **3.99** | **4.00** |
| 16×16 | light | 0 | **the FRAME `[49,49,49]`** | **2.81** | **2.85** |
| 16×16 | dark | 0 | **the FRAME `[199,197,190]`** | **2.44** | **2.40** |
| 16×16 | either | 1, N/4 | paper | 3.97 / 3.99 | 3.97 / 4.00 |

Read it twice. **At 9×9 the 0.86 inset keeps the ring's stroke off the frame entirely** — every
sample's ground is paper. **At 16×16 the cell is small enough that the ring's whole left stroke
is painted on the frame** (`FRAME_X_PAD 12` inside every edge cell, by the grid's design), and
there it reads **under 3:1 in both themes and both engines**.

**G-ABS-6 · RED at the 16×16 frame crossing, GREEN everywhere else.** The number is banked and
the crop is beside it (`frames/crop1-…png`, 6.4 KB — the blue stroke on the grey rule).

### 2.2 The dark arm is REFUSED, by its own condition

The spec made the alias (`--color-focus-sketch: var(--color-crayon-blue)` in `.dark`)
conditional on exactly this crossing reading ≥ 3:1. Measured with the alias in place:
**1.39:1 both engines**. The alias is therefore deleted and the token is **one value in both
themes**, which is the spec's own stated fallback.

And the fallback's own number is measured, not assumed: the one value reads **2.44 / 2.40** at
that same crossing. So **neither candidate clears 3:1 there** — the alias was not merely
insufficient, it was *worse* (a brighter blue on a light-grey rule is a smaller ratio than a
darker blue is). The colour axis cannot buy this pixel. It is a geometry row, and per §6 of the
spec it belongs to the section, not to this family.

What the refusal costs and buys, measured (`logs/census-*.json`): the one value reads
**4.29–4.38 on every banded chrome stop in dark** against the alias's pass-2 7.70–7.86 — dimmer,
still well over the floor. What it buys: **zero new hex, zero delta in the hue census**, and a
token that is one value (chair §6.7's rebased R1, satisfied in the stronger direction).

---

## 3 · The gates, measured

| gate | reading | verdict |
|---|---|---|
| **G-ABS-1** ring σ ÷ rule σ, ONE run, ONE window | px **0.657 / 0.695 / 0.657** at 4×4 / 9×9 / 16×16 (units 0.854 / 0.903 / 0.854); rule σ 2.8101 / 2.6320 / 2.8265 over n = 6 / 16 / 30 rules | **GREEN**, inside [0.5, 2.0] (RED at HEAD: 0.146 / 0.073 / 0.067) |
| **G-ABS-2** one constant, its window in the sentence | W4 σ **2.4004 / 2.3777 / 2.4148** units at the product's seeds (+0.34% / −0.61% / +0.95% of 2.3922, spread 1.55%); n = 4096 population 2.3918 (−0.02%), labelled a pencil-boil version canary | **GREEN** (±5%) |
| **G-ABS-3** ≥ 3:1 from the ring's own band, BOTH engines | per-side, built preview, both themes: `.attribution-trigger` `.logo-trigger` 4.19 / 4.38, `.ctrl-btn` `.icon-btn` 4.29 / 4.29, `.info-btn` 3.47 light / **2.92 dark (chromium)**, 4.11 / 3.34 webkit | **RED on one stop** — see §4.1 |
| **G-ABS-4** one colour, same-frame, BOTH engines | built preview, 8 stops, both themes, both engines: **ONE** painted colour `rgb(58,123,196)`, `outline-style: auto` **0**, arrival **8/8 same-frame** in all four arms | **GREEN** (RED at HEAD: five colours, seven `auto`; never executed in WebKit before this pass) |
| **G-ABS-5** the dark arm is DECLARED and TRUE | no `.dark` redeclaration; `:219`'s comment names **3.97 light / 3.99 dark** on the board and the painted reading is 3.97 / 3.99 (|Δ| ≤ 0.02) | **GREEN** (RED at HEAD: comment 5.3, painted 3.69) |
| **G-ABS-6** MA-L, legible on every ground it meets | §2.1 | **RED at the 16×16 frame crossing**, both themes, both engines, under BOTH candidate values; GREEN on paper, cell line and subgrid at every board |
| **G-ABS-7** MA-N at the heaviest tier | boundary C, every cell, tiers 7 and 10, desktop + phone: 16×16 tier 10 **+2.577 u = +1.433 px** desk / +0.941 px phone, 17408/17408 samples clean; 9×9 +10.819 u; 4×4 +34.324 u. **The witness**: `f = 1.00, W = 5.4` reads **−0.788 u = −0.438 px** at the same tier — the ring enters the neighbour | **GREEN**, and the inset is proven load-bearing |
| **G-ABS-8** pose 0 is the shipped artifact | the DOM's resident `d` for cell 0 equals `wobbleRect` recomputed offline with the same seed and `RING_GEOMETRY`: **byte-identical at 4×4 / 9×9 / 16×16 in BOTH engines** (435 / 646 / 454 B) | **GREEN** |
| **G-ABS-9** a focus rule mints no radius, ANY focus pseudo-class | AST-ish scan of every `:focus`/`:focus-within`/`:focus-visible` block in `src`: **0** declare `border-radius` (the one grep hit is prose inside `GameCard.vue`'s new comment); `.live-face-slot` computes `0px` blurred and `0px` focused, both engines | **GREEN** (RED at HEAD: 3 rules) |
| **G-ABS-10** the constants cannot be mutated | `RING_GEOMETRY` frozen with exactly `{ wanderUnits, inset }`; `grep -rn "kW4\|ringSigmaUnits\|ringK" src/` = **0**; `vue-tsc -b --noEmit` exit 0 | **GREEN** (RED on the pass-2 build — `kW4` shipped) |
| **G-ABS-11** the dock sheet, opened | 393×699, settled 900 ms, clipper `.controls-card`: **19 stops, 18 WHOLE**, exactly one not — the full-width sticky `button.icon-btn.invite-btn` at **−35.20 px** chromium / **−35.55 px** webkit, W2's one declared clip, named | **GREEN with the one named clip** |
| **G-ABS-12** the seventh rule is gone at all four sites | `grep .sudoku-cell:focus-within src/` **0**; `grep preserved` in `gameCell.css`/`DigitCell.vue` **0**; `.game-cell:focus-within` has no rule (**0**); a focused cell computes `outline-style: none` | **GREEN** (RED at HEAD: 1 rule, 1 neutraliser, 3 prose) |
| **G-ABS-13** MA-R is a table, never a verdict | `logs/ma-r-table.txt` — per board × rule kind × tier, wobbled AND straight columns, both geometries, at this base's boardPx. No gate in this diff asserts B ≥ 0 | **GREEN** |

### 3.1 One gate found a defect in the diff and the diff paid it

Deleting `.sudoku-cell:focus-within` orphaned `--color-ring`: `lint:theme-tokens` went RED with
`1 unreferenced @theme token`. The token had exactly one reader in the whole product (that rule)
and no Tailwind `ring-*` utility is authored anywhere in `src`, so **both declarations were
deleted** rather than the gate re-worded. `@theme declared: 52 → 51`, unreferenced 0, negative
control still RED as required.

### 3.2 Guards

| guard | reading |
|---|---|
| filter budget | **9 / 9 / 9** at 4×4 / 9×9 / 16×16, **both engines**, exact rows unchanged |
| ghosts | **16 / 81 / 256**, every ghost `filter: none`, both engines |
| toggle ring | `2px solid rgb(58,123,196)` at **1280** (offset 54, the declared range) and at **393** (offset 12), `:focus-visible` true |
| deck | reach **5**, air 9.594, headroom **4.594**, **WHOLE**, owners **1**, viewport `outline-style: none`, card radius **0px** — identical both engines, both themes |
| `.live-face-slot` | radius `0px` blurred and `0px` focused, both engines |
| hue census | **byte-identical to HEAD** (not "alias row only" — the alias was refused, so the delta is zero) |
| r0 law probe | output **byte-identical to HEAD's**: L1 = 9 GREEN; L3 and R1 read RED on BOTH trees (pre-existing, not this diff) |
| copy register | 0 em/en dashes, 0 unadmitted jargon; every self-test colour RED-as-required |
| lints | `theme-tokens` `theme-selectors` `ink` `motion` `copy` `knip` — all exit 0 |
| unit battery | **68 files / 830 tests passed**, exit 0 |
| `vue-tsc -b --noEmit` | exit 0 |
| a11y estate (built preview, chromium) | `spoken-gallery` + `access` + `a11y` + `join-language-prm` — **32 passed** |
| dist-bound suites (built preview, both engines) | `filter-census` `theme-quadrants` `theme-bake-freshness` `wordmark-integrity` — **73 passed**; one failure is the scratch config's, not the tree's (§4.4) |
| phone | boardPx 365, ring stroke **1.965 px** at 16×16 — the 2.4.11 **thickness** arm is NOT met there, as the spec concedes; the claim is the contrast arm |
| §2.7 hovered-then-focused | measured **1.02:1** at the same pixels, both engines (the spec's arithmetic said ~1.6). A compound state; banked as a reading, never a gate |

---

## 4 · The gaps, named

1. **G-ABS-3 is RED on one stop.** `.info-btn`'s **right** band in **dark** reads **2.92**
   (chromium; webkit 3.34). Its other three sides read 4.29. The ground on that side is
   `[212,211,208]` — a light element sits against the button's right edge, and the ring crosses
   it. Same class as the frame crossing, and the alias would have made it *worse*, not better.
   Unfixed here: it is a layout/ground row, not a token row.
2. **G-ABS-6 stays RED at 16×16's frame crossing** and this family cannot close it. Neither blue
   clears 3:1 on that rule. The honest options are geometry (a larger inset regresses MA-N and
   the σ band; the ceiling table says `f = 0.86` reaches board 13 flush against the frame) or a
   change to the frame's own painted value — both the section's, per §6 of the spec.
3. **Three of eight stops do not band.** `.cell-native-input` by design (the named exemption —
   it computes `outline-style: none` and the board's ghost is its mark). `.sun-moon-toggle`: its
   ornament offset puts the ring ~54 px out, past the instrument's ±30 px clip margin — the ring
   IS painted (computed `2px solid` token, `:focus-visible` true, confirmed at both viewports),
   it is just outside this window. `.drawer-tab`: pass-2's gap 1 unclosed — the per-side form is
   built and used here, and the tongue's ring still returns no changed samples on the sides the
   board occludes.
4. **Two of the four named crops were not taken.** Crop 2 (`f = 0.90`, U-10's alternate) needs a
   second build of a second geometry and was cut for time. Crop 4 (the armed `.guard-face`) is
   pass-2's gap 3 unclosed: the guard arms on the DEAL verb, not on a select, so the brief's
   recipe switches the game silently. Two crops are banked, 6.4 KB and 60.2 KB, both cited above.
5. **`throttled-void` failed under webkit** — `browserContext.newCDPSession: CDP session is only
   available in Chromium`. That is MY scratch config running a chromium-only spec on two
   projects; the estate's own `playwright-throttle.config.ts` declares chromium only, where it
   passes. Not a finding about the tree.
6. **Not run:** the `forced-colors` arm (the rule is authored in `@layer base` and greps clean,
   but no instrument executed it); the phone performance trace (the box was not quiet — three
   servers and two engines were live); the WebKit arm of `spoken-gallery`/`access`/`a11y`;
   `visual-golden` (darwin baselines, and a single red must never re-baseline).
7. **A WebKit instrument law, learned by getting it wrong.** Flipping the theme by CLICKING the
   toggle poisons the census: in WebKit, once the last interaction was a pointer, a later
   programmatic `.focus()` plus one key press does **not** re-arm `:focus-visible` — the whole
   dark arm came back with `outline-style: none` on all 8 stops and zero colours. Flipping the
   theme by KEYBOARD (focus the real toggle, press Enter) cures it. Banked because the same trap
   will bite any lane measuring a dark-mode ring.
8. **The band instrument read its window blurred** in pass 2's form, placing the strips on the
   border box where a ring at `outline-offset: 3` never is. Fixed here (focus → read geometry →
   blur → sample), and the toggle's reading changed from `3px none` to `2px solid` token on that
   fix alone.
9. **MRK-LIVE's `gameCell.css` rows travel in this diff.** Tier 2's 0.95, the two struck
   fallbacks, the modality comments and the `:294-303` deletion are replayed so this family's
   measurements sit on the section's sheet. They are cited, not owned, and leave this diff at
   the fold (chair §6.6).
10. **r0 R3-a is reported MOVED, not re-cut.** `instruments/R3-a-MOVED.md` carries the proposal
    (window W1 → W4, and the wash clause as *not applicable* rather than zero). Nothing under
    `loop/r0/`, `loop/pass1/` or `loop/pass2/` was written.

---

## 5 · π, at this base

Control commit **`74a2b5d9`**, served read-only on `:4240`. boardPx measured on the prototype:
**412 / 556 / 556** at 4×4 / 9×9 / 16×16, 1280×800 — pass 2's 636 was its own base, and every
px figure in this file is re-derived at 556. The `boardPx / 1300` ghost ratio and the
`boardPx / 1000` grid ratio both hold. Resident `d` at 16×16: **58,761 → 119,894 B** (segments
6 would be 215,431 B). Filter budget, ghost counts, the hue census and the law probe all read
identical on both trees.
