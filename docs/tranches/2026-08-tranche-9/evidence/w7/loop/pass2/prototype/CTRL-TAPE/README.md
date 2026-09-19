# T9-W7 · pass 2 · PROTOTYPE · CTRL-TAPE — the taped case, built and measured

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-28`
(branch `worktree-wf_8630d340-e56-28`), uncommitted. Dev server 127.0.0.1:4230 (scratch vite
config, private cacheDir); the built dist previewed on :4232 (4231 was held by another lane).
Both engines on every reading. Nothing was committed, nothing on the main tree but this evidence.

## 0 · The replay

`wf_e58b4764-0fc-37`'s pass-1 diff carried in whole — **17 files**, applied file-by-file (the
harness refuses `git -C` into another worktree, so the replay is a verified copy of exactly the
17 files that differ from HEAD; the three-way apply was unnecessary because HEAD moved by docs
only). Untracked carry: **nothing** (`tsconfig.tsbuildinfo`, a build artifact, skipped).
`vue-tsc -b` on the replay: **exit 0** before any pass-2 edit.

## 1 · What the pass-2 numbers say

### The pin band (§1.1) — the law bites

`.controls-card { --washi-tag-h: calc(var(--washi-tag-rung) * 1.2 + 0.2rem); --pin-band:
calc(0.6rem + var(--washi-tag-h)); padding-top: var(--pin-band) }`. Computed **43.87px at every
cell and both engines** (rail 1440/1280, dock 390/375/430, landscape 900×500 and 844×390).
The tokens are declared on the CARD, not on `.control-panel-wrap` as the spec drew them: a
custom property does not travel upward, and `.controls-card` is `GameScene`'s element. One
declaration, three readers (the card's padding, §2.5's exempt line, the well's own hang).

**§2.5b, the proposed sweep, GREEN 4/4** (rail 1440×900 and dock 390×844 × chromium/webkit):
`overlaps: []` at scrollTop fractions 0 / .25 / .5 / .75 / 1, `worstBelow` −1.20 / −1.24 (rail),
−1.20 / −1.24 (dock) — the pinned tape's bottom sits INSIDE the band at every offset.
**The negative control fires**: ablate the band back to HEAD's 20px coherently
(`padding-top: 20px; --card-pad-t: 20px`) and the same sweep reads `new game ∩ 16×16` at
**2452.5px²**, `belowExemptBand +22.66`, `elementFromPoint` NOT the control's. That is HEAD's own
class of defect (358.6px² over `9×9`) isolated to the one declaration, in one run.

### The resting hang (§1.2) — paid, and it costs the crossing

`.tray-well` padding-top from `--washi-tag-hang`: **33.67px** (was 5.6). Tape ∩ control at rest,
all four wells, every cell, both engines: **0.00px²** (pass 1's constant 0.212 → 0).
Daylight from the tape's bottom to the well's first row: **1.67 / 2.71 / 2.15 / 2.16px**.

**AND THE CROSSING SHRANK — this is a gap, with its numbers.** The tape still crosses its well's
drawn stroke, but by far less than the pose the owner's re-look was banked on (~29–32px of
straddle at pass 1):

| cell | new game | pencils | checking | players |
|---|---|---|---|---|
| rail 1440×900 | +0.54 | +7.64 | +11.35 | +13.49 |
| iPad coarse 1280×800 | **−3.47** | +1.56 | +8.11 | +12.94 |
| dock 390×844 | +9.07 | +9.93 | +13.22 | +13.12 |

At the seal's own cell the first well's tape does not reach its stroke at all. The memorable
thing survives on three wells and on the dock; it is materially quieter everywhere.

### The foot (§1.3) — M04 term 2 closes by construction

The bar teleports to `#card-foot`, a sibling of the card inside the case. Measured: `position:
relative`, `inCard: false`, `bar.top − card.bottom = 0.00` at every cell. Bar ∩ any VISIBLE
control (clipped to the scrollport): **0.00px² at every scroll state on chromium**; webkit shows
sub-pixel residues at fractional offsets (worst 68.41px² over a ~300px verb ≈ **0.23px of
height**) at the clip seam where the two boxes touch exactly. The re-cut zone-grammar row
(`covers`, rounded) is GREEN on both engines.
Dies with it: the union media key, the `::before` fade, the `::after` skirt,
`scroll-padding-bottom`, `data-under-bar` (selector AND writer). `padding-bottom: 3.5rem` KEPT —
measured 56px at the rail. A bottom fold sentinel (`.controls-card::after`, the mirror of the top
one) takes the fade's job so `data-fold-below` keeps a reader.

### The gallery (§1.4) — the prop was necessary and NOT sufficient

`heading?: boolean` on `SheetWashiLabel`; the four wells pass it, `StagingBand` does not. That
fixed the `<h2>`, and the deck still moved: **band 192 → 200, first card y 151.84 → 147.84, the
tape 57.31×17.63 → 107.45×35.63**. The second cause was pass 1's own `font-size: var(--type-name,
…)` written into the shared component — the deck's tape wore the card's voice. Cure: the rung is
a token the CONSUMER declares (`--washi-tag-rung` on `.controls-card`; the component falls back
to `--type-tag`). Re-measured, both engines:

| reading | HEAD | this prototype |
|---|---|---|
| band 390 / 1280 | 192 / 136 | **192 / 136** |
| first dealt card y | 151.84 / 149.41 | **151.84 / 149.41** |
| staging tape box | 57.31×17.63 / 64.16×19.63 | **57.31×17.63 / 64.16×19.63** |
| tape tagName | SPAN | **SPAN** |
| AX headings on the deck | 1 (`sudoku`, level 1) | **1** |

Five readings, **Δ 0.00**, both engines. (`tagNetFlow` differs — −1.28 → +2.37 — on a tape whose
`display: inline` makes vertical margins inert; every BOX is identical.)

### The seam (§1.5) — derived, no fallback, and the sign is not the spec's

`--sheet-chrome: max(12rem | 4rem, calc(var(--masthead-foot) + 8px - var(--case-offset)))` in
both arms, no `, 0px`. `--case-offset` is published from the CASE's own painted stroke
(`GameScene`, the outline path — the first selector I wrote read the Deal button's icon and
published a term 230px wrong; found by a red).

**The measured offset is NEGATIVE**: −6.18 to −10.23 (the drawn stroke sits ABOVE the sheet's top
box by the outline's outset + half its stroke + the boil's jitter), where the spec expected
+20.01. So the term ADDS air rather than removing it, and at 390 the derivation resolves to
**229.23px against the shipped 229.72** — the card gets 0.49px back, not the 27.00 the spec
predicted. The seam itself, wordmark ink to case stroke, both engines:

| cell | 375×812 | 390×844 | 430×932 | 900×500 | 844×390 |
|---|---|---|---|---|---|
| seam, sheet up | 32.15 / 31.82 | 31.80 / 32.17 | 32.20 / 31.84 | 98.92 / 98.19 | 32.20 / 32.05 |

All ≥ 8.00. When the card is at its cap the arithmetic lands exactly 8.00 by construction.

**THE LANDSCAPE COLLISION — the loudest finding of this pass.** At 844×390 the derived arm gives
a seam of +32.24 and a card of **72.3px** (`clientH 72`, `scrollH 809`); the shipped `4rem` arm
gives a **235px** card and a seam of **−130.50** (the risen sheet covers the wordmark whole).
Both engines within 0.5px. The seam law and the short-landscape card cannot both be paid at that
cell, and W2's `4rem` was a decision to let the sheet cover the masthead there. This prototype
ships the spec's answer (derived, both arms) and hands the choice up.

### The ring (§1.6) — `--ring-ink`, from painted bytes

`--ring-ink: color-mix(in srgb, var(--color-foreground) 50%, transparent)` is declared in
`index.css` as the STOPGAP the chair's §6.1 allows, with the cite in its comment; the card's ring
rule reads it (`:deep(button | [role=tab] | [tabindex="0"]):focus-visible`, dashed 2px, offset 3).
Sampled off screenshots, `:focus-visible` witnessed true on every read:

| ground | light | dark |
|---|---|---|
| the chosen `level` chip | **3.72:1** | **4.68:1** |
| a size chip on the card's paper | 3.72:1 | 4.68:1 |
| a verb in the case's foot | 3.72:1 | 4.68:1 |
| Deal (the one boxed control) | 18.83:1 | 14.99:1 |

Identical on both engines (webkit 18.55 / 15.02 on Deal). Deal's reading is the drawn box's own
stroke inside the sample band, not the ring in isolation — recorded rather than claimed. Below
50% is refused in this family's return: the analytic 45% mix reads 3.15 on the light card.

### `level Easy` (§1.7) — the tree agrees with the tape

`ariaSnapshot` of `#controls-drawer` at 390×844, **identical on chromium and webkit**:

    - heading "new game" [level=2]
    - heading "size" [level=2]      - button "size" [expanded]
    - heading "level" [level=2]     - button "level Easy"
    - heading "pencils" [level=2]   - heading "marks" [level=2]
    - heading "what fits" [level=2] - heading "checking" [level=2]
    - heading "players" [level=2]

**8/8 headings on the card, and the `level` heading's own name is `level`.**
ONE DECLARED DELTA from the spec's sketch: the button is the tab's STRETCHED HIT BOX
(`position: absolute; inset: 0` inside `.mobile-heading-head`), not the value chip. The spec's
literal shape leaves the button holding only `heading-value`, which is `v-if`'d away the moment
the tab opens — an empty box where the tap floor was. The floor moves to the wrapper and holds:
**52.53×44 (`size`) and 94.80×44 (`level`)**, both engines.

## 2 · The seal — BROKEN by +19.9, and the one lever is refused

`.control-panel-wrap` at 1280×800 coarse: **1303.44 chromium / 1303.31 webkit** against the
1283.5 bound — **+19.94 / +19.81 over**. Six terms, each an in-page ablation of ONE declaration,
taken in the same run (`probe/p2-seal.mjs`):

| term | px |
|---|---|
| pin band 43.87 → 20 | **0.00** (the band is the CARD's padding; the seal measures the wrap inside it) |
| well padding-top 33.67 → 5.6 (the hang unpaid) | −113.85 |
| first-well margin 0.35rem → 2rem (pass 1's own) | +26.40 |
| the bar's flow reserve back inside the card | 0.00 (not in the tree either way) |
| tape leading 1.2 → 1.5 | +31.06 |
| the lever: lift 3px → 40% of `--washi-tag-h` | −42.81 |

Reconciles with pass 1 exactly: 1280.81 + 113.85 (the hang) − 26.40 (the first well) − 64.81
(the bar leaves the WRAP with the Teleport) = 1303.45 against 1303.44 measured.

**THE LEVER IS REFUSED, and this is its number.** Taking it lands the panel at 1260.63 — under
the seal — and breaks the law this whole pass was built to pay: the hang shrinks into the
inter-well gap and the tape reaches **7.33px into the well above it**, so worst tape ∩ control
goes **0.00 → 412.4px² (`checking ∩ Off`, 1440×900) and 360.3px² (`players ∩ Live`, the seal
cell)**. The spec's one lever costs §2.5. Booked, not taken.

## 3 · Censuses and gates, as run

| instrument | result |
|---|---|
| §2.5b sweep (proposed diff, landed) | **4/4 GREEN**, negative control fires at 2452.5px² |
| `heading-voice-plus900.spec.ts` (R1) | **6/6**, voices **1**, ranks `[H2]`, docHeadings **8**, ratio 25.89/20 = **1.2945** at all three cells |
| `access.spec.ts` 2.1 / 2.2 / 2.3 | 6/6 GREEN both engines |
| `zone-grammar.spec.ts` | 34/34 with access, both engines, after three MOVED rows re-cut |
| r0 `law-probe.mjs` COPY | L1 **9** · L2 · L3 **GREEN on the gate's exit** · L4 · L5 · L6 GREEN; R1/R2 still born-RED; **R3 RED → GREEN** |
| r0 hue census COPY | 29 token rows, unchanged; user-ink vs focus-sketch gap 9.6° |
| `filter-census.spec.ts` (built dist) | 6/6 — the live-filter population equals `filterBudget.ts` exactly |
| goldens (built dist, `playwright-golden.config.ts`) | **4/4** |
| `check-theme-selectors` / `check-copy-register` / `check-font-coverage` / `lint:motion` | exit 0, exit 0, exit 0, exit 0 |
| `vue-tsc -b` | exit 0 |
| unit battery | **66 files / 811 tests, all green** (serial; a parallel run under load flaked 6 unrelated files — latency and stress rows) |
| card width at 1440 | **330px**, byte-identical to HEAD |
| note berth | `padding-bottom` 56px present at the rail |

Two unit rows were re-cut because this pass moved their subject, in the same diff:
`SheetWashiLabel.test.ts` (the promotion is the prop, not the anchor) and
`GameControlPanel.test.ts` (the tab's heading is the button's sibling). Three e2e rows likewise:
zone-grammar's rendered-name census (`Size`/`Level` → `size`/`level`; `candidates` → `what fits`)
and its action-bar row (the bar left the scrollport; the row now asserts the foot's berth AND
zero coverage at three offsets, with a `position: fixed` negative control).

## 4 · Gaps, honestly

1. **The seal is over by 19.9px and the named lever cannot be taken.** No cure inside this
   family's own laws. The hang (+113.85) is what buys §2.5's rest-state row; giving it back
   reopens the disease. This needs the adjudicator.
2. **The crossing is much quieter** (above), and at the iPad coarse cell the first well's tape
   does not cross at all. The owner's re-look was banked on the pass-1 pose.
3. **The landscape arm's collision** (72.3px card vs a −130.5 seam). Ships the spec's answer;
   the choice is not this lane's.
4. **The publisher's staleness is 0.00 at every cell that spends the token** and 16.41 / 16.58
   on WebKit's two DESK rungs, where `--sheet-chrome` is inert. Mechanism identified (the
   callback runs before the wordmark's last growth; one resize nudge corrects it exactly). Two
   re-publish clocks were auditioned and measured inert; booked rather than closed by a guess.
5. **The loud-fallback born-RED row was not built** (delete the publisher, assert
   `--sheet-chrome` ≠ 192px/64px). Neither arm carries a fallback, so the failure IS loud, but
   the assertion does not exist.
6. **R7's I2/I3/I4 were not re-run.**
7. **The foot sits flush at the viewport's bottom edge** on the dock and in landscape
   (`foot.bottom == innerHeight`, 844/844 and 500/500): the fifth compartment's bottom stroke has
   no air under it and no safe-area inset is spent there. New with the berth; not cured.
8. **WebKit's sub-pixel bar residue** at fractional scroll offsets (≤0.23px of height).
9. **The fresh-reader protocol (U-10) was not run** — crop (2) is banked for another lane.

## 5 · The crops (4, all ≤30 KB)

1. `p1-seam-390-dark-{chromium,webkit}.png` — 390×844 dark, sheet up, masthead INCLUDED: the
   wordmark, the board's first row, the case's stroke and the `new game` tape crossing it.
2. `p2-pinband-1440-chromium.png` — rail at scrollTop 0.25 (0.50 releases the tape by the
   half-life law, so there is no pinned tape to show there): `new game` pinned inside the band
   with `16×16` clear below it.
3. `p3-hang-390-chromium.png` — the `checking` well at rest: the tape across its top stroke,
   `Off · Ask · Live` with air under the hang.
4. `p4-foot-900-chromium.png` — 900×500 sheet up: the card's end, then the foot's verbs.
