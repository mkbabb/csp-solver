# ACC-FIVE — five crayons, no sixth · pass 1 (PROTOTYPE)

T9-W7 §3 the accent family · §4 the fill meter · §12 multiplayer chrome · §15 the confirm's
face · mark M07. The research lane's overlay, landed as **source** and measured on the product
it now is.

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-42`
on branch `worktree-wf_e58b4764-0fc-42`, off `aab67b92`. **Nothing committed.** The diff is
banked at `proto/acc-five-proto.diff` (7 files, +209 / −69). Measured 2026-09-17 on
`http://127.0.0.1:4236` — a dev server this lane started in its own worktree — chromium and
webkit headless, light and dark, 1280×800 and 393×699 dpr3.

**It runs.** Every number below is off this build, not off an injected stylesheet.

---

## 0. What the prototype changed

Plan steps 1–7, in full, and nothing else.

| # | file | what moved |
|---|---|---|
| 1 | `pencil/config/pencilConfig.ts` | `MOTION.traceFillMs 240`, `MOTION.traceWinMs 500` — the gauge's two bands, named |
| 2 | `assets/index.css` | `--color-blue-ink` born (`#026fc4` / `#47a7ff`); `--color-user-ink` aliased to it; `--color-progress-ink` → `#a47903` / `#7d6902`; `--color-focus-sketch` gains its `.dark` arm; `--sparkle-glow-soft/-strong` born; `.solve-success .progress-trace` opacity rule → stroke rule; `.progress-trace` print + forced-colours arms born; the violet's ledger comment replaced by gold's, the third gold tier said out loud |
| 3 | `pencil/glyph/HandwrittenGlyph.vue` | the fallback literal dies |
| 4 | `games/shared/GameControlPanel.vue` | the two glow tokens, `transition: all` → `filter`; `headingClass()` muted always, `activeColorClass` deleted |
| 5 | `pencil/chrome/GameGallery/GameGallery.vue` | the destructive verb in `--color-red-ink` on a 5% red ground (14% hover) |
| 6 | `pencil/grid/gridPaths.ts` | `FRAME_Y_PAD 0 → 12` |
| 7 | `pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` | the two bands v-bound; the win's tween moves from `opacity` to `stroke` |

Four hexes die (`#2563eb`, `#60a5fa`, `#8b5cf6`, the dark alias `#7c3aed`), two inline `rgba()`
literals die, one fallback hex dies, one function dies. Four hexes are born.

---

## 1. THE HAND-OFF PAINTS — the family's centre, decided on bytes

This is the number the research lane could not get. At HEAD the win's gold reaches **zero
pixels**: `.solve-success .grid-line` recolours the live vector stack, which is `display: none`
under the grid bake, while the trace fades to `opacity: 0`. Under the cure the trace stays and
lifts one pressure, and the trace is a grain-baked pose stack that is never hidden.

`probe/handoff-paint.mjs` → `readings/handoff-paint.json`. A 22 × 246 px band across the board's
LEFT frame edge, chroma floor 0.05, sampled at 900 / 1800 / 2700 / 3600 / 5000 ms after the win.

| engine / theme | before the win | AFTER the win, all five samples | median hue | Δ to crayon-gold | HEAD |
|---|---|---|---|---|---|
| chromium light | 1,403 px · h 83.7 | **1,382 px** | 83.6° | **0.1°** | 0 px |
| chromium dark | 1,379 px · h 96.6 | **1,410 px** | 95.7° | **0.5°** | 0 px |
| webkit light | 1,398 px · h 83.7 | **1,388 px** | 83.6° | **0.1°** | 0 px |
| webkit dark | 1,381 px · h 96.6 | **1,404 px** | 95.2° | **0.0°** | 0 px |

The computed stroke at the win reads `rgb(201, 154, 46)` light / `rgb(229, 199, 77)` dark — the
gold-star token, in both engines — with the pose stack held at opacity 1 rather than fading.
Zero filters and zero re-raster: a stroke colour swap on geometry already on screen
(`filterBudget` census below is unmoved).

`frames/handoff-strip-light.png` (6,252 B) and `frames/handoff-strip-dark.png` (7,510 B) — four
panels each, the board's top-left corner at fill **5 / 50 / 100 / won**. This is the crop the
family exists for and the one the research lane could only bank as a negative.

**The claim this earns:** the trace and the celebration are the same hue at two pressures, on
the same rect, from the same seed — and now that sentence is a photograph, not a token
argument. The violet could never have said it, and at HEAD neither could gold.

---

## 2. Kinship — the five anchors unchanged, KIN_DEG unmoved

`probe/accent-kinship.probe.ts`, the FIVE-anchor set and the exception list carried verbatim.

| row | HEAD | prototype |
|---|---|---|
| 1 · kin, light | RED — user-ink 11.5°, progress-ink 41.3° | **GREEN** both engines |
| 2 · kin, dark | RED — user-ink 5.3°, progress-ink 43.7° | **GREEN** both engines |
| 3 · a control's focus ring | RED both engines | **RED, untouched — not this family's row** (§8) |
| 4 · off-token literals (the regex) | RED | **RETIRED.** Replaced by row 6; the ruling is written into the probe's own file |
| 5 · the exceptions pay their toll | GREEN | **GREEN** — rainbow 5.40 / 5.60 / 6.21 / 5.39 / 5.29; peer worst 5.36 over 40 indices |
| 6 · the glow names a token, to the byte | RED — painted `[237,233,254]`, no token matches | **GREEN** both engines |

Painted values, identical in both engines:

    light   user-ink        rgb(2,111,196)    h 251.2  C 0.156   Δ 0.2°   KIN
            focus-sketch    rgb(58,123,196)   h 253.3  C 0.131   Δ 1.9°   KIN
            progress-ink    rgb(164,121,3)    h  83.4  C 0.123   Δ 0.3°   KIN
    dark    user-ink        rgb(71,167,255)   h 249.4  C 0.157   Δ 0.0°   KIN
            focus-sketch    rgb(106,171,235)  h 249.3  C 0.115   Δ 0.0°   KIN
            progress-ink    rgb(125,105,2)    h  95.8  C 0.107   Δ 0.6°   KIN

Row 6's ruling, in the probe: R2's row 4 tested "no colour a token cannot name" with
`/drop-shadow\([^)]*(rgb|rgba|color)\(/`, which matches **any** colour including a correct one —
the row could only go green by deleting the glow. Row 6 resolves the painted glow and every
candidate token through one 1×1 canvas at the same alpha and requires a byte match. The glow
paints `color(srgb 0.788235 0.603922 0.180392 / 0.3)` and matches `--color-crayon-gold` exactly,
in both engines. The rainbow keeps `except: "discriminability"` and is billed by row 5.

---

## 3. The four 1.4.11 ratios, on painted bytes

`readings/proto/row7-ratios-*.json` — canvas read-back at each mark's own stroke opacity.

| ratio | HEAD (research control) | prototype chromium / webkit |
|---|---|---|
| focus ring @0.9 over card, light | 3.63 / 3.62 | **3.63 / 3.62** |
| focus ring @0.9 over card, **dark** | 3.66 / 3.67 | **6.38 / 6.44** |
| trace @0.95 over `--grid-line-color`, light | 3.35 / 3.35 | **3.60 / 3.60** |
| trace @0.95 over `--color-card`, light | 3.85 / 3.85 | **3.57 / 3.58** |
| trace @0.95 over `--grid-line-color`, dark | 3.44 / 3.48 | **3.18 / 3.23** |
| trace @0.95 over `--color-card`, dark | 3.05 / 3.07 | **3.23 / 3.26** |
| *(fifth, not in the charter)* trace over background | — | 3.48 / 3.53 light · 3.28 / 3.33 dark |

**Worst of the four: light 3.35 → 3.57, dark 3.05 → 3.18.** The brief's targets exactly
(≥3.57 / ≥3.18), and both are an IMPROVEMENT on the violet, not a spend.

The digit, `readings/proto/row10-weight-*.json`:

    light   #026fc4   L 0.5366  C 0.1563  h 251.2   5.065 on card · 4.945 on background
    dark    #47a7ff   L 0.7115  C 0.1571  h 249.4   7.341 on card · 7.501 on background

Pen versus ring, composite: **1.40 light / 1.14–1.15 dark**. Pen versus the unit wash: 4.70
light / 6.72 dark. Iso-luminance in dark is structural — on near-black paper both marks must be
light to clear their floors — and the separation that is actually there is 0.052 of chroma plus
FORM. `frames/focus-cell-dark.png` (1,803 B) is the crop the owner picks the dark pen on.

---

## 4. The confirm, the chrome, print and forced colours

| row | prototype |
|---|---|
| 9 · the destructive verb, light | **GREEN both engines** — `rgb(208,42,82)`, chroma 0.200, h 13.6°, **4.55 chromium / 4.58 webkit** on its own 5% ground |
| 13 · the destructive verb, **dark** (new) | **GREEN both engines** — `rgb(255,92,124)` (the rose wax), **6.07** on its own ground |
| 11 · chrome achromatic, the desk rail | **GREEN both engines** — both `h2.section-heading` read `rgb(115,115,115)`, chroma **0**, after the 250 ms tween settles; the selected difficulty chip keeps `crayon-green` at chroma 0.141 |
| 11b · chrome achromatic, **the phone** (new) | **GREEN both engines, both themes, both tabs, active and inactive** — see below |

Row 11b is the seam the desk row cannot reach. The phone's tab head is a different node,
`.mobile-heading-btn .section-heading`, and it carries its own **scoped** `color:
var(--ink-press-quiet)` — a scoped SFC rule is unlayered and outranks a `@layer utilities`
utility class, so the retirement had to be measured there rather than inferred.
`probe/phone-heading.mjs` opens the dock, waits out the ~700 ms slide and the 250 ms colour
tween, and reads both heads in both states, 393×699 dpr3
(`readings/row11-phone-heading.json`):

    light   Size / Level, active and inactive   rgb(115,115,115)   chroma 0
    dark    Size / Level, active and inactive   rgb(168,166,159)   chroma 0.0102

The dark reading is not a tint: `rgb(168,166,159)` **is** `--color-muted-foreground`
(`hsl(48 5% 64%)`), the token index.css deliberately keeps off the ink ramp, and its chroma
0.0102 sits **below the census's own 0.012 chroma floor**. A gate that spells this row "chroma
exactly 0" will red in dark on the muted token itself; the claim is "no crayon reaches a
heading", and the number that carries it is ≤ 0.0102.
| 8 · print / forced colours, the digit | **GREEN** — print `rgb(0,0,0)`, forced `CanvasText` |
| 12 · print / forced colours, **the gauge** (new) | **GREEN both engines, before AND at the win** — print `rgb(0,0,0)`, forced `CanvasText`; on screen at the win it is `rgb(201,154,46)` |
| 14 · no stock hex (new) | **GREEN** — 0 hits for `#2563eb`, `#60a5fa`, `#8b5cf6`, `rgba(196,181,253)` in `index.css` or `HandwrittenGlyph.vue`; both progress arms read `#a47903` / `#7d6902` |

`frames/confirm-chromium.png` (4,266 B) and `frames/confirm-webkit.png` (4,568 B) — one red word
on a faint red ground, `keep` bare. `frames/corner-print-forced.png` (4,210 B) — the corner under
print beside the same corner under forced colours, both in system black.
`frames/sparkle-rest-hover.png` (1,783 B) — the solver button at rest and hovered, the tween
settled.

Row 14 cost the comments one habit: the retired hexes are named by their Tailwind names
("blue-600", "blue-400") rather than re-spelled, so the gate can stay a literal grep.

---

## 5. The meter's form — better, and NOT at the gate's number

`probe/meter-symmetry.mjs`, paired on this tree by flipping `FRAME_Y_PAD` back to 0 for the
control run and restoring it. The trace path's own client rect against the board SVG's, at 100%
fill, identical in both engines.

| arm | desk 1280×800 (board 636px) | phone 393×699 dpr3 (board 365px) |
|---|---|---|
| control (`FRAME_Y_PAD 0`) | L 2.78 · T **−3.22** · R 2.68 · B −1.72 → **\|T−L\| 6.00px** | L 1.60 · T −1.85 → **3.45px** |
| prototype (`FRAME_Y_PAD 12`) | L 3.15 · T **4.41** · R 2.72 · B 6.05 → **\|T−L\| 1.26px** | L 1.81 · T 2.53 → **0.72px** |

The frame moved **7.63px** at 1280 and **4.38px** on the phone — the brief's predicted numbers,
to the hundredth, and the overhang is gone (top inset crosses from −3.22 to +4.41).

**The gate asked for ≤0.5px and the prototype reads 1.26px at 1280.** That is a real miss and
the pad is not the cause: the residue is the wobble's own per-side jitter. In viewBox units the
trace's bbox sits at L 4.96 · T 6.94 · R 4.28 · B 9.51 off a rect whose four pads are all 12, so
the hand-drawn ring wanders ±7 units and no pad value can make the painted insets agree to half
a pixel. Equal pads are the whole cure available here; **≤0.5px is not reachable without
freezing the wobble on the frame, which is a different family's move.** The honest restatement
is "the meter no longer overhangs, and the worst painted asymmetry falls 6.00 → 1.26px".

The gauge's arithmetic is unmoved by the prototype: nothing at 0%, ~126 CSS px of gold at the
first digit on a 20-blank deal (0.16% of the board), the whole ring at 100%.

---

## 6. The pixel census, paired on one board

`probe/census-paired.mjs` with `proto/head-restore.css` — the **reverse** overlay, because this
tree is the cure and there is nothing left to inject. It restores HEAD's four accent values and
HEAD's violet glow onto the same page and the same deal, so the two censuses differ by the cure
and by nothing else. R2's band (OKLCH 40–115°) and chroma floor (0.012), verbatim. Two runs.

| engine | theme | state | prototype off-family % | HEAD-restored % | violet px |
|---|---|---|---|---|---|
| chromium | light | rest | **3.35** | 3.47 | 16 → 25 |
| chromium | light | mid-board | **12.49** / 12.42 | 25.12 / 25.05 | 16 → 3,013 |
| chromium | dark | rest | **6.49** | 6.94 | 16 → 43 |
| chromium | dark | mid-board | **20.58** / 20.70 | 27.06 / 32.10 | 16 → 816 / 1,569 |
| webkit | light | mid-board | **10.41** / 7.80 | 46.11 / 38.47 | 16 → 9,010 |
| webkit | dark | mid-board | **14.36** / 15.69 | 48.73 / 56.31 | 16 → 5,922 |

Three of the four gated cells clear: chromium light mid **12.49 ≤ 16** ✓, webkit dark mid
**14.36 / 15.69 ≤ 17** ✓, webkit light mid ✓. **Chromium dark mid-board reads 20.58% against a
gate of ≤17% and reproduces at 20.70% on a second run** — a miss, stated.

The reason is in the instrument, not the cure, and the research lane already named it: this
census's band contains exactly two crayons (orange 68.7°, gold 83.7°), so "off-family" here means
*not warm*. crayon-blue sits at 251.4° and is **off-band whether it is kin or not** — of that
20.58%, **10.0 points are the 240–270° bin**, which is the pen and the ring doing exactly what
the family asked them to do. The blue's win is measured by the kinship rows; this instrument
cannot see it and its absolute threshold was set from one research deal. The 16-pixel violet
residue survives in every state and both themes — the chrome sparkle's own `#sparkle-rainbow`
stop, the declared exception.

---

## 7. Every other instrument, re-run on this build

| instrument | reading |
|---|---|
| **filterBudget** (`e2e/filter-census.spec.ts`, scratch config) | **12/12 GREEN**, both engines, board and coarse regimes — exact count 9, union raster area within tolerance, injected-node control fires |
| **R6 law probe** | L1–L6 GREEN (unmoved); **R1 RED → GREEN** ("every chromatic token that paints in both themes carries a dark arm" — `--color-focus-sketch` declared in `.dark`); R2 and R3 still RED, both other families' |
| **R6 hue census** | reads the cured values: progress-ink `#a47903` h 83.4 / `#7d6902` h 95.8. *Instrument gap:* its token roster is fixed and does not know `--color-blue-ink`, and it now prints `--color-user-ink,dark,#000` because the only hex left under that name is the print arm — the alias is invisible to a hex scanner. The live kinship rows cover the claim |
| **R3 wobble probe** | grid σ **1.443px** (unmoved), ring σ **0.092px** (unmoved, born-RED at HEAD and still), frame σ **1.145 → 1.199px** on a chord that shortened 503.651 → 497.537px — the declared consequence of the pad move |
| **consumer map** | `--color-user-ink` **24** VAR (all 24 stand through the alias), `--color-progress-ink` **1**, `--color-focus-sketch` **2**, `--color-red-ink` 3 → **7** (the confirm's four new references), `--color-crayon-blue` 5/13. Off-token literals fall to **one**: `#c4b5fd` at `SvgFilters.vue:168`, the rainbow's declared exception. *Instrument gap:* the roster is fixed, so `--color-blue-ink` is not listed — it is minted with one consumer on the day it is minted |
| `vue-tsc --noEmit` | **0 errors** |
| `vitest run` | **66 test FILES passed / 810 tests passed**, 0 failed |
| `check-copy-register` | **0 unadmitted** — the prototype mints no rendered string |
| `check-ink-pressure` · `check-theme-tokens` · `check-theme-selectors` · `check-motion-contract` · `check-live-regions` · `check-font-coverage` · `knip` · `eslint` · `eslint --config eslint.boundary` · `prettier --check` | all **green** |

### Goldens — 2 of 4 moved, both declared, and NOT re-minted

`playwright-golden.config.ts` against this server, darwin:

| golden | delta |
|---|---|
| `grid-corner-light` | **6,858 px (ratio 0.06)** — the `FRAME_Y_PAD` move. Declared |
| `cell-light` | **2,292 px (ratio 0.12)** — the pen's new ink. Declared |
| `logo-light` | **0 px** |
| `toggle-crest-dark` | **0 px** |

Both non-board goldens are byte-identical; both board goldens moved and only where the family
claims the board. **The re-mint is owed and this lane did not do it**: the darwin arm should be
minted off a built dist rather than this dev server, and the linux arm mints from the runner
artifact, which is a CI act. The deltas above are the declared π delta, not a re-baseline.

---

## 8. What this family still does not claim, and every gap

1. **The meter's ≤0.5px symmetry is not reached** (§5): 6.00 → 1.26px at 1280, 3.45 → 0.72px on
   the phone, and the residue is the wobble, not the pad. Either the gate relaxes to the
   achievable number or a different family freezes the frame's jitter.
2. **The paired census's chromium/dark/mid cell misses its gate** (§6): 20.58 / 20.70% against
   ≤17%, reproducibly, with 10.0 points of it the blue pen — which is off-band by construction
   and cannot be lowered by this family. The threshold was set from one deal; the instrument is
   deal-sensitive by its own admission.
3. **The dark focus ring reads 6.38 in chromium against a gate of ≥6.4** (6.44 webkit). The spec
   quotes 6.42 — that is the mean of the two engines, and chromium is **0.02 under the literal
   gate**. It is 3.66 → 6.38 against a 3:1 floor, so nothing is at risk; the gate's number should
   be the painted one.
4. **Goldens are not re-minted** (§7).
5. **Row 3, the control focus ring, stays RED** — every control still renders `outline-style:
   auto` in `--color-ring` at 50%, the Tailwind preflight's ring. A focus-IDIOM decision, not a
   token alias. Its gate must keep the subject-count guard: PW-WebKit reaches **0** controls by
   Tab and the row would otherwise go green with no subject.
6. **The solved frame's `.grid-line` recolour still does not paint.** This prototype ROUTES
   AROUND it — the trace carries the win — and leaves the defect where it is: `bakedHidden 4`,
   `bitmaps 4`, the live vector stack hidden under the bake. `.solve-success .grid-line` stays
   for print, where the bitmaps drop. Curing the bake at the win is still a substrate row.
7. **The dark grid line is itself hue 95.2° at chroma 0.011** — in dark the trace and the frame
   it retraces are one hue and only pressure separates them. The band census says it reads (1,410
   chromatic px after the win); whether it reads *well* is an eye question, `frames/handoff-strip-dark.png`.
8. **Row 11's dark arm needs a number, not the word "achromatic"** (§4): the muted token is
   itself chroma **0.0102** in dark. A gate written as "chroma exactly 0" reds on `.dark` for a
   reason that has nothing to do with this family.
9. **And then the hard part.** Two things this pass did not do. The arcs do not reach §11c and
   the mark's live colour does not reach §11 — hand-offs, declared by the plan as not this patch,
   and nobody has carried them yet. And `--color-blue-ink` is in the roster of **neither** static
   instrument (`consumers.mjs`, R6 `hue-census.mjs`), so the two lane instruments that scan source
   rather than paint are blind to the very token the family mints: `consumers.mjs` cannot report
   that the new hex has a consumer, and `hue-census.mjs` now prints `--color-user-ink,dark,#000`
   because the only hex left under that name is the print arm. Both need one roster line in the
   cure's own commit, or the next census will describe an estate that no longer exists. That is
   the ordinary shape of this kind of work: the cure is cheap and keeping the instruments true to
   it is the part that gets skipped.

---

## 9. Recommendation

**DEVELOP.** Everything the research lane priced held when it became source, in both engines and
both themes, and the one thing research could only record as a negative — the win's gold reaching
zero pixels — is now 1,382–1,410 chromatic pixels within **0.0–0.5°** of crayon-gold at every
sample. The two accents that broke the wheel are kin (11.5° → 0.2°, 41.3° → 0.3°) with the anchor
set unchanged and KIN_DEG unmoved; the worst of the four 1.4.11 ratios rises in both themes
(3.35 → 3.57, 3.05 → 3.18); the dark focus ring nearly doubles and `index.css`'s four-tranche-old
claim becomes true; the gauge and the verb gain print and forced-colours arms they never had; the
filter budget, the wobble, the unit battery and every source gate are unmoved. The blast radius
is seven files, +209/−69, and more of it deletes than adds.

**Three adjustments the agglomerator must carry.** The meter's symmetry gate wants the achievable
number (1.26px at 1280), not 0.5. The paired census's dark-mid threshold wants restating against
the band it actually measures, or the family should be judged on kinship there instead. The dark
ring's gate wants the painted 6.38, not the spec's 6.42.

**One thing that is not a verdict.** The solved frame's own gold still does not paint (§8.6).
This prototype routes around it rather than curing it, which is the right scope — but it means
the estate ships a recolour rule that lands on hidden nodes, and the next family to reach for
`.solve-success .grid-line` will find the same trap.

Nothing here closes a mark. U-10.

---

## 10. Files, and how to re-run

    proto/acc-five-proto.diff        plan steps 1-7, the whole prototype, 7 files +209/-69
    proto/acc-five-proto.diffstat.txt
    proto/head-restore.css           the REVERSE overlay the paired census needs
    probe/accent-kinship.probe.ts    R2's, with row 4 retired and row 6 in its place
    probe/acc-five-proto.probe.ts    rows 12 (gauge print/forced), 13 (dark verb), 14 (stock hex)
    probe/handoff-paint.mjs          §1 — the band census, both engines, no overlay
    probe/meter-symmetry.mjs         §5 — the painted insets, both viewports
    probe/census-paired.mjs          §6 — paired against the reverse overlay
    probe/proto-crops.mjs            the frames
    probe/phone-crop.mjs             the phone frame, re-cut as a crop
    probe/phone-heading.mjs          row 11b — the tab heads on the phone, both themes
    probe/consumers.mjs              the consumer map, re-pointed at the worktree
    probe/pw.config.ts               the lane's scratch config (:4236, two engines)
    probe/e2e-scratch.config.ts      the estate's e2e specs without :3000's webServer/globalSetup
    readings/…                       every number above, raw
    readings/run2/census-paired.json the second paired run

From the worktree's `web/frontend`, with `npx vite --host 127.0.0.1 --port 4236 --strictPort`:

    ACC_FIVE_OUT=<here>/readings/proto npx playwright test --config <copy>/pw.config.ts
    OUT=<here>/readings node probe/handoff-paint.mjs
    ARM=proto OUT=<here>/readings node probe/meter-symmetry.mjs
    OUT=<here>/readings OVERLAY=<here>/proto/head-restore.css node probe/census-paired.mjs
    npx playwright test --config probe/e2e-scratch.config.ts filter-census
    PLAYWRIGHT_BASE_URL=http://127.0.0.1:4236 npx playwright test --config playwright-golden.config.ts

The probes resolve `@playwright/test` and `sharp` out of `web/frontend/node_modules`, so they run
from a scratchpad copy with that directory symlinked beside them and a `{"type":"module"}`
`package.json` — the research lane's arrangement. No product file and no `package.json` in the
tree is touched by the rig.

**Frames** — 76,670 B, eleven files, each cited above:
`handoff-strip-light.png` 6,252 · `handoff-strip-dark.png` 7,510 (§1) ·
`board-corner-light.png` 5,200 · `board-corner-dark.png` 4,800 (read beside R2's two at HEAD and
the research lane's two under the overlay) · `focus-cell-dark.png` 1,803 (§3) ·
`confirm-chromium.png` 4,266 · `confirm-webkit.png` 4,568 (§4) · `corner-print-forced.png` 4,210
(§4) · `sparkle-rest-hover.png` 1,783 (§4) · `phone-bottom-tab.png` 34,278 (393×699 dpr3 at W2's
bottom-tab pose, gauge at 50%).

---

## 11. Traps this pass hit, for whoever writes the gate

1. **`FRAME_X_PAD` and `FRAME_Y_PAD` are shared with the graphite frame.** Moving the gauge moves
   the board's own frame — that is the point of the one source, and it is why two board goldens
   move and the R3 frame wobble σ shifts. A gate that treats the trace's geometry as the trace's
   alone will read the frame's move as a regression.
2. **The win's stroke swap needs `!important`.** `.solve-success .progress-trace` lives in
   `@layer utilities` and the path carries `stroke` as a presentation attribute; the print arm in
   `@layer base` beats it because for important declarations layer precedence inverts. Both arms
   are now written and row 12 measures the pair, before the win and at it.
3. **Two board goldens are a DELTA, not a red.** `grid-corner-light` 6,858 px and `cell-light`
   2,292 px move by construction; `logo-light` and `toggle-crest-dark` must stay at 0 and do.
4. **The deal is still not seeded** (R2 trap 4). Paired-on-one-page is the only honest before/after
   on this product, and when the product IS the cure the pairing has to run in reverse.
5. **Prettier reformats `index.css`** after a comment edit; run `--write` on that one file or
   `npm run lint` reds on formatting alone and hides the real rows.
6. **The kinship probe's `kin-arithmetic.json` is a STATIC table** of hexes hardcoded in the
   probe. It still prints the retired values after the cure and is not a live read; the live rows
   are `kinship-<engine>-<theme>.json`.
