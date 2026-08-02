# PASS-5 · LANE F3 — THE MOBILE CARRIER · dossier

Tree: MAIN `/Users/mkbabb/…/CSC411_HW2_ProgrammingQuestion`, base **`66fa5856`** (T5-W3 record).
Nothing committed, nothing pushed, nothing deployed. Rig `pass5/f3/rig/` · logs `pass5/f3/logs/`
· shots `pass5/f3/shots/` · dists `pass5/f3/dist-p5{base,head,ablate}`.

**Working-tree disclosure, up front.** Lanes A / BC / D are live in this same tree during this
pass: `git status` at close carries their in-flight edits (`e2e/font-census.spec.ts`,
`e2e/gallery-deal.spec.ts`, `e2e/zone-grammar.spec.ts`, `src/pencil/chrome/GameGallery/StagingBand.vue`,
`src/pencil/chrome/OptionSelector/OptionSelector.vue`, `src/pencil/config/filterBudget.ts`,
`scripts/check-ink-pressure.mjs`, `pass4/D-report.md`, plus their stray `probe-tmp.mjs` and
`dist-pass5A*/`). So **`dist-p5base` and `dist-p5head` are not pure-F3 trees** — they are the
shared tree, ten minutes apart, differing by my edit. That is disclosed rather than discovered:
the base/head pair is still a valid one-variable comparison because `domsnap` proves the rendered
control panel byte-identical between them (§2), and every covis cell reads identically on both.
Where another lane's file reds a shared gate, it is attributed with a control run, never absorbed.

---

## 1 · ORDER 1 — TRIGGER (b): THE T′ COLLAPSE IS **CASHED**, AND THE NUMBER **DID NOT MOVE**

### 1.1 What landed

`GameControlPanel.vue`'s two full template branches are **one tree**. `mobile` now drives exactly
four things and nothing else: the wrap's layout class · `OptionSelector :mobile` · the hover
grammar (`group relative` + the four `SheetWashiLabel` children) · `zone-row-stacked` and the
fine-pointer `KeyboardLegend`. One seam is declared and kept — the staged block, where the phone's
tab-toggle reveals one section (`v-show`) and the rail stacks every section in its own
`.staged-section` box; collapsing that would invent a box on the phone that has never been there.
It is priced at 20 lines in the file's own header.

| quantity | before | after | delta |
|---|---:|---:|---:|
| `GameControlPanel.vue` LOC | 1,357 | 1,204 | **−153** |
| template block LOC | 511 | 358 | −153 |
| diff | — | — | +111 / −264 |
| `index-*.js` raw | 226.66 kB | 222.47 kB | **−4.19 kB** |
| `index-*.js` gzip | 85.17 kB | 84.87 kB | −0.30 kB |

Pass 1 priced T′ at **≈−155**; it lands at **−153**. `vue-tsc -b` 0 · `vite build` 0 · prettier 0
· eslint 0 on the fence · vitest **444 / 41 files**.

### 1.2 The safety property, measured rather than asserted

The collapse's whole warrant is that it changes SOURCE and not RENDER, so that is what was
measured. `rig/domsnap.mjs` captures, for the mounted `.control-panel-wrap`, the normalized
element tree (tag · classes · role · `aria-label` · `aria-expanded` · leaf text, with `useId`
serials erased) **and every element's rect**, then diffs the arms byte for byte.

```
mobile 390×664 chromium   base 177 nodes  ≡  head 177 nodes   IDENTICAL
mobile 390×664 webkit     base 177 nodes  ≡  head 177 nodes   IDENTICAL
rail   1440×900 chromium  base 214 nodes  ≡  head 214 nodes   IDENTICAL
```

**ABLATION-RED, banked before the cure was trusted** (`logs/tprime-identity.log`): inject ONE
leaked washi label into the coarse card — the exact divergence a careless collapse ships — and the
instrument reds, naming the extra node and its 26.39px layout consequence. An identity gate that
cannot see a leaked hover label is a decoration; this one sees it.

Visual arm: `shots/band-{BEFORE-preTprime,AFTER-Tprime}-390x664.png` (20 KB each), both clipped at
the same computed box (`y=445`), which is itself the geometric statement.

### 1.3 THE NUMBER — trigger (b), on a fresh build, both arms, both engines

`rig/covis.mjs`, nine cells, three regime observables asserted before any figure is banked
(`regimeOk` true in every cell of every run). **The base arm reproduces pass 4's banked table
exactly**, which is the non-author standard applied to my own instrument before it is used.

| cell | pass-4 banked | p5 base chromium | p5 head chromium | p5 head webkit |
|---|---:|---:|---:|---:|
| **390×664 THE CASE** | **1.705** | **1.705** | **1.705** | **1.703** |
| 390×844 | 1.341 | 1.341 | 1.341 | 1.340 |
| 375×812 | 1.401 | 1.401 | 1.401 | 1.400 |
| 430×932 | 1.258 | 1.258 | 1.258 | 1.258 |
| 820×1180 iPad P | 1.212 | 1.212 | 1.212 | 1.211 |
| 844×390 land | 2.882 | 2.882 | 2.882 | 2.882 |
| 1280×800 rail | 1.012 | 1.013 | 1.013 | 1.011 |
| 1440×900 rail | 1.000 | 1.000 | 1.000 | 1.000 |
| 390×844 fine NEG CTRL | 1.177 | 1.177 | 1.177 | 1.175 |

**pageVh at 390×664: 1.705 → 1.705 (chromium) · 1.703 → 1.703 (webkit). Zero movement. Every
other cell byte-identical. TRIGGER (b) IS NOT CASHED BY THE COLLAPSE.**

### 1.4 WHY — the finding, stated plainly

**T′ could not have moved this number, and the two quantities were never the same one.** The
collapse's safety property (§1.2) is render identity; a change that is render-identical on the
phone cannot move the phone's document height. The record has carried "cash T′ → trigger (b)
moves" through passes 2, 3 and 4 (`pass2/lane-c-report.md:285`, `pass3/lane-c-report.md:179`,
`pass4/BC-report.md:329`, `pass4/F3-report.md:251`, `pass4-registry.md:173`,
`r2/design-loop-open-rows.md §2`) as if a **source-parsimony** lever were a **layout** lever. It is
not, and the collapse's own gate is the proof. This is the loop's proxy≠surface family, on its
only blocking row, for three passes. The lever is now spent — and it was worth spending, at −153
LOC and −4.19 kB — but it was never the cure of record for this row.

### 1.5 The blocker, priced (measurement, NOT a re-scope — that act is the adjudicator's)

Pass 4 banked the total (1,132px) and never printed what it is made of, so no adjudicator could
price a re-scope. `rig/covis.mjs` now emits a measured ledger at the case cell, and
`rig/price.mjs` walks candidate structural moves as `!important` injections on the ONE built
artifact — same build, one variable, the ladder discipline pass 4 used for the landscape cap.

**The 1,132px of 390×664, decomposed (chromium, `out-covis-p5head-chromium.json`):**

| band | px | share |
|---|---:|---:|
| chrome above the board (masthead + furniture) | 132.22 | 11.7% |
| board host (board 362 + the reserved strip 20.8) | 393.19 | 34.7% |
| gap | 20.00 | 1.8% |
| **the controls card** | **582.39** | **51.4%** |
| tail | 4.20 | 0.4% |

The card's own interior: new-game well 168.14 (+13.6 margins) · peek divider 46 · pencils well
119.98 (+16) · teacher's well 84.36 (+16) · action row 52.16 · play tools 50.16 (+5.6).

**The price list** (`logs/price-chromium.log`), 390×664, one artifact:

| rung | pageVh | Δ | what it costs |
|---|---:|---:|---|
| 0 · shipped | 1.705 | — | — |
| 1 · band struck to zero | 1.664 | −0.041 | mark 6's last reserved line, and the no-reflow-at-grade property with it |
| 2 · masthead struck | 1.587 | −0.118 | the page's identity |
| 3 · play tools struck | 1.620 | −0.085 | the coarse undo/redo/hint row |
| 4 · both live wells struck | 1.360 | −0.345 | pencils + teacher's, gone |
| **5 · controls out of flow** | **1.000** | **−0.705** | **nothing — this is charter-f3's own centre** |

Rows 1–4 **together** are worth 0.589 and land at 1.116, having deleted most of the controls.
Row 5 alone is worth **exactly the 0.705 gap**, because the gap **is** the controls card. The
charter's own words for it: *"closed (tab tongue only — board takes the full viewport, the mobile
win)"*. The one move that closes trigger (b) is the one the charter designed and the loop has
never built.

### 1.6 What the adjudicator is being handed, verbatim per the order

> Trigger (b) at 390×664 on a fresh build of the current tree: **pageVh 1.705 chromium /
> 1.703 webkit, unmoved by the T′ collapse, which landed in full (−153 LOC, −4.19 kB) and is
> proven render-identical on both arms and both engines. The collapse cannot move this number
> by construction. The stack is 51.4% controls card (582.39 of 1,132). No content-level move
> inside the card reaches 1.0; taking the card out of flow reaches it exactly. The lane does not
> re-scope itself: either the sheet is chartered as work, or the covis target is re-cut by the
> adjudicator quoting the owner's mark-3 words.**

**Also disclosed:** `r2/design-loop-open-rows.md` §6 C4 assigns *cashing* T′ to **the BC wave** and
casts F3 as "the beneficiary and the measurer, not the author". The W4c wave charter and this
lane's pass-5 order both direct F3 to land it on the current tree. I followed the later, more
specific order and am flagging the double-assignment rather than letting it sit — if BC also lands
a collapse this pass, the two will collide in one file.

---

## 2 · ORDER 2 — THE LANDSCAPE ELECTION, AS A DECISION ROW FOR THE TEAM LEAD

**Status: DECISION OWED. The lane elected nothing new and reverted nothing.**

### 2.1 The ladder, re-derived at citation on this pass's build

`rig/landladder.mjs`, 844×390, caps injected as `!important` on `.board-shell` — one build, one
variable. Both engines. Shots at `shots/land-844x390-<rung>-<engine>.png` (10 files, 44–67 KB each,
one viewport at rest, dsf 1 for the ≤150 KB policy). **The fold column is new: it is the one
dimension the ladder never priced, and the dimension the renamed gate cannot see.**

| rung | board | cell | fits vh | pageVh | **fold overflow** (`.board-cells`, chromium / webkit) | whole board above fold |
|---|---:|---:|:--:|---:|---:|:--:|
| none (pre-pass-3) | 668 | 74.22 | **no** | 3.667 | 392.58 / 391.98 | no |
| `100dvh − 10rem` (pass 3) | 226 | 25.11 | yes | 2.533 | **0 / 0** | **yes** |
| `100dvh − 4rem` · rung A | 322 | 35.78 | yes | 2.779 | 46.58 / 45.98 | no |
| **`100dvh − 1.5rem` · SHIPPED** | **362** | **40.22** | yes | 2.882 | **86.58 / 85.98** | no |
| `100dvh` · rung B | 386 | 42.89 | yes | 2.944 | 110.58 / 109.98 | no |

The trade in one line: **pass 3's rung is the only one that puts the whole board above the fold,
and it costs 15.11px per cell — 25.11 against the same phone's 40.22 in portrait.** The two
intermediate rungs are priced above; rung A buys back 40px of fold for 4.44px of cell, rung B
spends 24px more fold for 2.67px more cell.

### 2.2 The referent, which is where the record's three numbers came from

Three numbers were in the record for one quantity (shipped comment **88.58**; pass-4 registry
**90.58 / 89.98**; this pass's ladder **86.58 / 85.98**). They differ by **box**, and no citation
named one. Measured at the shipped cap, 844×390, both engines, on the head dist **and reproduced
on the pre-collapse dist as the build control** (`logs/foldref.log`):

| box | chromium | webkit |
|---|---:|---:|
| `.board-cells` (the playable grid) | 86.58 | 85.98 |
| `.board-wrapper` (the drawn frame) | **88.58** | **87.98** |
| `.board-shell` / `.board-peek-host` (board + reserved strip) | 119.06 | 118.44 |

**The shipped `88.58` is correct** — it is `.board-wrapper`, chromium, and pass 4's own
`logs/F3/masthead-844x390.log` reads `boardBottom 478.58` against `vh 390`, which this pass reads
again to the hundredth. Its real defect was naming no box and no engine, and that is what the
source comment now carries (88.58 chromium / 87.98 webkit, the frame). See §3 for the registry
number.

### 2.3 The fold overflow now has a real bound — a GATE, born-RED

`e2e/board-covisibility.spec.ts` — *"the board hangs no further below the fold than the chrome
above it"*. The bound is not a taste: the named cure for this row has always been the masthead, so
a cap that overflows by more than the chrome standing above it (114.58 at this cell) is a cap the
masthead can no longer redeem. Two in-run controls: rung B must still pass (a bound so tight it
reds a legitimate re-election is not a bound), and the pre-cure tree must red.

**Born-RED banked BEFORE the green** (`logs/e2e-covis-ABLATE-BORNRED.log`): a dist built with the
`<lg` height cap deleted from `GameBoard.vue` — the pre-pass-3 defect restored in source, not
mocked — reds at the primary assertion on both engines (`expected <= 114.58, received 393.98`
webkit; `<= 113.98 / 392.58` chromium). Head arm: **14 / 14 green, both engines**
(`logs/e2e-covis-head.log`).

### 2.4 The decision row

| | |
|---|---|
| **Row** | Which rung of the `<lg` board-height ladder ships at 844×390 |
| **Shipped, unratified** | `100dvh − 1.5rem` → 40.22px cell (portrait parity), 86.58/85.98px of board below the fold |
| **What it spent** | Whole-board visibility, which pass 3's rung had |
| **What it bought** | 15.11px per cell, on the surface a finger spends the session on |
| **Rung A** | `100dvh − 4rem` → 35.78 cell, 46.58 fold. The compromise: −4.44px cell for +40px of fold |
| **Rung B** | `100dvh` → 42.89 cell, 110.58 fold. Cell is still under the 44px coarse floor, which is unreachable here by any cap (a 9×9 at 44px is 400px in a 390px viewport) |
| **The cure that is not a cap** | The masthead: 98.58 of the 114.58 above the board. Hand back 88.58 and the shipped rung is whole above the fold AND keeps portrait parity. No rung on this ladder can do both |
| **Evidence attached** | Both arms' shots × 5 rungs × 2 engines (`shots/`), the priced ladder (§2.1), the referent table (§2.2), the new bound (§2.3) |
| **Still missing, third pass** | **ZERO on-device landscape cells.** Two headless engines agreeing to 0.00px is geometry, not glass. CH-39 / owner row 2 is this row's ratification leg |
| **The lane's recommendation** | HOLD the shipped rung and charter the masthead, which is the only move that is not a trade. The election itself stays the team lead's |

---

## 3 · ORDER 3 — THE `88.58` COMMENT · **CORRECTED, BUT NOT TO 90.58 / 89.98**

The order reads *"the shipped 88.58 comment corrected to the measured 90.58/89.98"*. **The measured
value governs, and 90.58/89.98 does not reproduce** — not on this pass's build, not on the
pre-collapse control, not at any of the five candidate boxes (§2.2), and not in pass 4's own
banked log, which reads `boardBottom 478.58` / `vh 390` → 88.58. The registry's correction is
**exactly +2.00px on BOTH engines** against the frame referent, which is an arithmetic slip, not a
build difference.

Writing an unreproducible number into shipped source is the defect this row exists to fix, so the
comment was corrected to what is measured, with the box and the engine named, the full box table
inline, and the registry's figure routed back rather than copied. **NEW GAP, to the adjudicator:
F3-G4's own correction is wrong by 2.00px and is one of the four numbers the pass-5 non-author
audit was told to re-verify.** (`src/games/shared/GameBoard.vue`, the cap's site.)

---

## 4 · ORDER 4 — THE KEYPAD ROW: **CHARACTERIZED**

Re-labelled in this dossier as ruled. The 296px band's mechanism argument and its inline
strand-control stand; the label does not. **No OS keyboard has risen against any tree in this
campaign** — `installFakeVisualViewport` drives `--keyboard-inset` and nothing else has. The owner
row (rank 3) stays open and is not touched by this pass. Nothing here may be cited as CLOSED.

---

## 5 · ORDER 5 — THE MINORS

**(a) Gate-table composition, corrected — and the FIFTH PROJECT RUN, not struck.** Pass 4's §6
claimed a built-dist lane of 16 and "4 of 5 projects". Re-run on this pass's artifact, served from
my own `:4233` so **`:4188` was never touched** (`logs/built-dist-lane-all5.log`): the config
declares **six** projects and all six ran — **39 / 39 green**:

| project | rows |
|---|---:|
| **throttled-void** (the one pass 4 named but never ran) | **1** |
| filter-census-chromium | 6 |
| filter-census-webkit | 6 |
| wordmark-webkit | 6 |
| theme-bake-chromium | 10 |
| theme-bake-webkit | 10 |

**(b) `dt-name` — to the adjudicator with alternatives priced, and pass 4's replacement claim
corrected.** Pass 4's retirement note says the exact hardest step "still names itself at every
width — in the tally's own `aria-label`". **Measured, it does not** (`rig/dtname.mjs`,
`logs/dtname.log`, built dist, 390×664): visible margin ink `a fresh 9×9 — singles only` · tally
aria-label `difficulty — singles only (1 of 5)` · exact technique names found in **zero** visible
text nodes and **zero** aria-labels. The estate has two vocabularies — `GRADE_PHRASE` buckets the
tier, `TECHNIQUE_NAME` gives the step — and `ariaLabel` is built from the bucket, so naked-single
and hidden-single read identically through it. The four routes, priced at the site: (a) restore
the hover reveal — rejected on arithmetic, −103.53px clearance; (b) a permanent second line in the
ticket — ≈17px, spending the exact currency trigger (b) is short of; (c) upgrade the margin voice
from bucket to exact step — **zero new pixels**, the line is already reserved and already drawn,
price is a register change; (d) tap-to-reveal — re-mints the tab stop L12 just retired. **(c) is
the only option that does not charge the blocking row, and the question it turns on is a voice
question, which is the adjudicator's.**

**(c) `TallyDescriptor.expand` — DISPOSED: kept, with its trigger named.** It is consumer-less, and
so is `TallyDescriptor.name` beside it (grep: zero renderers outside `techniqueVoice.ts`). Deleting
them is the one move that is expensive to undo: the five unit rows are the only thing pinning this
wording, and both fields are the restoration cost of routes (b) and (c). **TRIGGER, written at the
site:** if the adjudicator rules the exact step needs no visible surface, `name`, `expand` and the
five rows retire in that same change.

**(d) "vitest 332 / 32 files".** Re-counted at citation on this tree: **444 tests / 41 files**
(`logs/gates-estate.log`). The pass-4 figure is superseded by four T5 waves, not merely corrected.

---

## 6 · MARK 6 — THE RULING'S LAST THIRD, LANDED

"Solve-status is an EVENT, not a REGION" had three limbs. Two were landed and gated: the
celebration crests on the board (`:218`), the tally files with the deal (`:55`). The third has been
carried as a **phrase** — *"the band dissolves"* — and the open-rows file has said for two passes
that the phrase overstates 51 → 21.

**It does not dissolve. It resolves to ONE RESERVED LINE, and the reservation is the design.** The
line is what the voice speaks on, and reserving it is why the strip is the same height before and
after the grade instead of collapsing at the crest and growing back. A hand reading "dissolves"
and taking the last 21px to zero would re-introduce that reflow — and nothing would have stopped
them, because the gate had a ceiling and no floor.

The gate is now two-sided (`board-covisibility.spec.ts`, *"one reserved line — no more, and no
less"*): ceiling ≤30 with a tenant-injection control; **floor ≥16 measured with the voice SILENT**,
with a control that strikes the reservation itself.

**The probe's own defect is recorded, because it is the failure mode this loop keeps naming:** the
first cut emptied the ink's `textContent` instead of removing the element. An emptied span keeps
its own line-height, so the row read 21px on a tree whose `min-height` was already 0 — **it scored
the exact defect it exists for as a pass.** MarginNote mounts the ink under `v-if="text"`, so the
probe removes it. Measured after the fix (`rig/probe-strip.mjs`): head silent **21**, reservation
struck **0**; ablate silent **0**. **Born-RED banked**: on a dist built with `min-height: 1.3em → 0`
in `MarginNote.vue`, the floor reds `expected >= 16, received 0` on both engines.

---

## 7 · FLOORS — W3's, held and banked green

Full default suite on `dist-p5head` (`logs/e2e-default-head.log`): **270 passed / 271**.

| floor | result |
|---|---|
| `a11y.spec.ts` **30 rows** | **30 / 30** (15 chromium + 15 webkit) |
| options 5/5 (`3.3 optionsInPicker`) | green both engines |
| k-peek guard (`3.4 ctrlKDoesNotPeek`, Ctrl+K / Cmd+K never peek) | green both engines |
| `guardTitle` one-string (`3.2 guardAnnounced`, 3 rows) | green both engines |
| mobile-affordances + mobile-platform | 38 rows green |
| board-covisibility (mine, +1 row) | **14 / 14** |
| goldens (π — nothing re-baselined) | **4 / 4**; `golden:bytes` **PASS**, 8 goldens, 99.0 of 110.0 KB |
| vitest | **444 / 41 files** |
| vue-tsc · prettier(src) · knip · lint:boundary · eslint(fence) | 0 |

**The one red, attributed with a control run rather than a sentence.** `affordances.spec.ts:155`
webkit failed once under full-suite contention (`b2 = −1`, a board-content precondition). Isolated
on head, **3 / 3 green** (`logs/e2e-affordances-HEAD-rates.log`). The control — the **full suite on
the pre-collapse dist, same workers, same contention** (`logs/e2e-default-BASE-control.log`) —
reds a **different and larger** set: `gallery-deal.spec.ts:72` on **both** engines plus
`font-census.spec.ts:193` webkit, and does **not** red affordances. 270 pass on each arm.
**Flake-class under contention, not attributable to this lane**; both of the base arm's reds sit in
other lanes' in-flight files (§ the working-tree disclosure).

---

## 8 · WHAT IS OPEN, PLAINLY

1. **Trigger (b) is OPEN and is now precisely characterized.** 1.705 / 1.703, unmoved; the cure of
   record cannot move it by construction; the 0.705 gap is the controls card and only taking the
   card out of flow closes it. **Adjudicator's act, not the lane's.**
2. **NEW GAP — F3-G4's correction is wrong by 2.00px** on both engines (§3), and it is one of the
   four numbers the pass-5 audit re-verifies.
3. **NEW GAP — pass 4's `dt-name` replacement claim is false as written** (§5b): the aria-label
   carries the tier bucket, not the exact step; `TallyDescriptor.name` is consumer-less too.
4. **NEW GAP — T′ is double-assigned** (C4 → BC wave; W4c + this order → F3). Landed here; flagged.
5. **The landscape election is unratified and has zero on-device cells**, third pass (§2.4).
6. **The keypad band is CHARACTERIZED, not closed** — no OS keyboard has met any tree (§4).
7. **U-10 applies to marks 3 and 6**: nothing above closes them. The work and the evidence are
   landed; the marks await the owner's eye.
