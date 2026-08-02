# PASS-5 · LANE A — PICKER (T5-W4a)

Work order: `pass4-registry.md` §2 "Lane A" (1)–(4), verbatim, plus T5-W4a's two charter rows
(the Deal-weight successor; W3.3's options 5/5 as a persisting floor). Binding numbers:
`evidence/audit/r2/design-loop-open-rows.md` §"Lane A". Settled ground inherited, not re-opened:
`pass5-lead-adjudications.md`.

Fence held: `src/pencil/chrome/GameGallery/**`, `e2e/gallery*.spec.ts`, this evidence dir. One
temporary ablation outside it (`e2e/font-census.spec.ts`), of pass-4 **Lane A's own** cure
`3969f512`, reverted in the same session and verified line-present (§5.3).

Base: `66fa5856` (T5-W3 record). Host darwin. node v26.0.0 · npm 11.12.1.

---

## 0 · THE ROWS, AND WHERE EACH LANDED

| # | order | verdict | the evidence that closes it |
|---|---|---|---|
| 1 | `:432` hold harness-independent, RED-then-green on BOTH harnesses | **CLOSED** | `A1-01` (defect RED, preview) · `A1-11` (gate RED, preview) · `A1-10` (green, dev) · `A1-40`/`A1-41` (36/36 each harness, both engines) |
| 2 | the dirty + SAME-game deal row | **CLOSED** | `A2-10` (ablation-RED, dev: 1 red / 17 green) · `A23-30` (ablation-RED, preview) |
| 3 | the `d` radius pinned + `aria-keyshortcuts` moved to match | **CLOSED** | `A3-20` (ablation-RED, dev) · `A23-30` (preview) · `StagingBand.vue` |
| 4a | §4's denominator corrected via the `flat` arm | **CLOSED** | §4.1 — re-derived from pass 4's own JSON, all four cells |
| 4b | one **coarse** cell through verb-ink | **CLOSED** | `A5-61` + `rig/verb-ink.mjs` |
| 4c | `attrib-font-census-BASE-x3.log` re-taken with the AUDIT prepend | **CLOSED** | `A5-62` (BASE arm, 3/3 red) · `A5-63` (cured arm, 3/3 green) |
| 4d | e2e sub-ledger corrected (+318 is 310) | **CLOSED** | §4.2 — re-derived from `git --numstat`, per commit and per file |
| 4e | a long-string arm for `ribbon-geom` | **CLOSED, and it found something** | `A5-60` + `rig/ribbon-geom-longstring.mjs` — §4.3 |
| W4a | the Deal-weight successor (G3's open half, `766aa068` extended) | **MEASURED, PICKER HALF PASSES — awaiting the owner's eye (U-10)** | `A6-70` + `rig/deal-weight.mjs` — §6 |
| W4a | W3.3's options 5/5 as a persisting floor | **CLOSED** | asserted in `gallery-deal.spec.ts:144-145`; floor green `A7-81` |

Floors, after every control was reverted (`A7-81`, dev, both engines): **94/94** —
`a11y.spec.ts` **15 rows × 2 = 30**, `gallery-deal` 18 × 2, `gallery` 8 × 2, `gallery-guard`
6 × 2. Unit: 28/28 (`GameGallery` + `cards`). `vue-tsc` exit 0. `prettier --check` on the
lane's source clean.

Sub-ledger, this lane, this pass: **+166 / −11** (churn 177) — `gallery-deal.spec.ts` +152/−9,
`StagingBand.vue` +14/−2. Of the 14 source insertions, **1 is code** (one attribute) and 13 are
the comment that states why. Counted the way §4.2 says pass 4's should have been: insertions,
not churn.

---

## 1 · A1 — THE `:432` HOLD, HARNESS-INDEPENDENT

**The defect, reproduced before anything was touched.** Same tree, same spec, two harnesses:

```
dev  (vite dev :4236)            17 passed                    A1-00-BEFORE-dev-chromium.log
preview (built dist :4246)       16 passed · 1 failed :432    A1-01-BEFORE-preview-chromium.log
                                 .futoshiki-cell  Expected 0 · Received 25
```

A-M1 exactly: `page.route(/futoshiki\/spec/)` matches the dev module URL
(`/src/games/futoshiki/spec.ts`) and matches **nothing** on the built dist, where the module is
`/assets/spec-<contenthash>.js`. Four chunks share that stem and the hash is content, not name:

```
spec-BkYbGe2P52BR.js  thermo      spec-Cr7dd6GqvWtl.js  killer
spec-BobPrmIZKFO_.js  futoshiki   spec-DsTAZmxlvXcf.js  kenken
```

No URL regex can pick futoshiki's. So the hold was a no-op there and the row degraded to the
race it replaced — and the 25 cells above are that race losing.

**The cure.** The pattern matches both stems; on the built stem identity is read off the BODY —
hold the chunk that IS futoshiki's, fulfil every other one straight through. And the hold is
**counted**: `heldHits` must be > 0 before the row proceeds. That is the assertion pass 4 was
missing, and the only one that can tell a hold from a no-op. The row's other vacuity — a
`toHaveCount(0)` an empty document satisfies — is paid beside it with a `.game-gallery` visible
precondition.

**RED-then-green, both harnesses.** The gate was run against the pass-4 pattern first, so the
defect is stated as a failing gate rather than a lost race:

| arm | dev :4236 | preview :4246 |
|---|---|---|
| pass-4 pattern (`/futoshiki\/spec/` only) + the new gate | **18/18 green** — the dev URL carries the game name (`A1-10`) | **RED at `heldHits`: Expected > 0 · Received 0** (`A1-11`) |
| cured pattern (both stems + body identity) | **36/36**, chromium + webkit (`A1-40`) | **36/36**, chromium + webkit (`A1-41`) |

The row now means the same thing on both harnesses, and the RED it produces names its own cause.

---

## 2 · A2 — THE SUBSUMPTION, GATED (four lines, and a control that isolates the arm)

`attemptDeal` says of its second clause: *"The second arm subsumes the pass-3 same-id fallback
(`dirty && card.id === currentId`)… the id comparison the fallback made was the whole defect."*
Nothing pressed it. Every dirty-deal row in the file steps to a DIFFERENT card first.

**Ablation-RED** — the clause narrowed back to cross-game only
(`… && card.id !== props.currentId`), which is the shape the prose says is wrong:

```
dev      A2-10-RED-samegame-arm-narrowed.dev.log      1 failed · 17 passed
preview  A23-30-RED-both-ablations.preview.log        the same row, on the built artifact
```

One red, and it is the new row. The other seventeen pass under the ablation — which is the
charge, printed: they never gated it.

**The row isolates the arm it tests**, or the ablation above would have been absorbed by
`attemptDeal`'s FIRST clause. The fixture writes a digit and erases it: two entries on the undo
log so `isDirty` (undo-depth > 0, `766aa068`'s ruling) is true, and no non-given cell holds a
value so the ledger reads `userMoves: false` (`useGameState.ts:879`). Measured, not assumed:

```
staging-ledger-v1 = {"sudoku":{"size":3,"difficulty":"EASY","board":true,"userMoves":false}}
ribbon after a SAME-game deal: visible · "deal over this puzzle?" · "your marks aren't saved"
                                                   A2-probe-dirty-without-usermoves.log
```

Only the mounted-board clause can raise that ribbon, so the ablation has nowhere to hide.

---

## 3 · A3 — THE `d` RADIUS, PINNED; THE ATTRIBUTE MOVED TO MATCH

The handler is bound on `.staging-band`, so `d` resolves from any focus inside it. Pass 4
pressed it **from the deal button alone** and asserted the attribute **on the deal button
alone** — a gate that a handler scoped back to that one button passes. Radius unpinned, both
halves.

**The gate now holds the radius the handler has**: three origins, one per focusable class the
band owns — a chip, `.staging-safe`, `.staging-deal` — each arming the ribbon and each retiring
it with the ribbon's own Escape. Ablation-RED (`@keydown` moved off the band onto the button):
`A3-20-RED-d-scoped-to-button.dev.log`, one red, the `d` row, plus the preview arm in `A23-30`.

**The attribute.** `aria-keyshortcuts="d"` now sits on `.staging-band` as well as
`.staging-deal`, and the two placements state two different true things:

- on `.staging-band` — the **scope**: `d` is live anywhere in this region, which is exactly what
  `onKeydown` delivers. **It is not announced.** The band takes no focus, and AT speaks
  `aria-keyshortcuts` on focus; this placement is a machine-readable declaration the gate holds
  equal to the handler, and nothing more. Said here rather than left for an auditor to find.
- on `.staging-deal` — the **target**, and the announced one. ARIA's reading is "the keys that
  activate THIS element"; the button is what `d` activates and the only focusable in the band
  that can speak the claim to a reader.

Deleting either leaves a true statement unsaid, so neither was deleted. The third true statement
— the listbox resolves `d` too — was already on `.gallery-viewport` and is asserted with them.

**Why the handler was not scoped instead** (the order's other branch): scoping it to the button
re-creates the defect `StagingBand.vue` cured — "a `d` typed with a chip or a verb focused
reached nothing" — so that branch buys a matching radius by removing the delivery. The band is
the right radius; the gate and the attribute were the things out of step, and they moved.

---

## 4 · THE MINORS THAT ARE ARITHMETIC

### 4.1 §4's denominator, corrected via the `flat` arm

Pass 4 published: the die costs 113.77 of 770.53 — 14.8% — "so [border weight] is ~85% of the
measured ink difference." The denominator is the deal verb's **total** ink; the quantity being
apportioned is the **difference** between the two verbs. The `flat` arm — cited in the same
section and never used in the arithmetic — supplies the missing term, since `flat` is the deal
verb reduced to its word. Re-derived from pass 4's own `verb-ink.json`, all four cells:

| cell | safe | deal | Δ = deal−safe | die | word (`flat`) | border+tint | die/Δ | b+t/Δ | word/Δ |
|---|---|---|---|---|---|---|---|---|---|
| chromium/light | 333.74 | 770.53 | 436.79 | 113.77 | 278.60 | 378.16 | 26.0% | 86.6% | −12.6% |
| chromium/dark | 312.76 | 711.15 | 398.39 | 101.21 | 258.08 | 351.86 | 25.4% | 88.3% | −13.7% |
| webkit/light | 333.72 | 770.14 | 436.42 | 114.56 | 277.91 | 377.67 | 26.2% | 86.5% | −12.8% |
| webkit/dark | 310.94 | 709.28 | 398.34 | 101.93 | 257.17 | 350.18 | 25.6% | 87.9% | −13.5% |

**Corrected statement**: of the measured ink difference between the two verbs, the border weight
and background tint carry **86.5–88.3%** (mean 87.3%), the die **25.4–26.2%** (mean 25.8%), and
the word itself **−12.6 to −13.7%** — "deal" (4 glyphs) is *lighter* than "start" (5), so the
word is a debit the other two channels pay off. The three sum to 100% by construction, which is
the check the pass-4 derivation had no way to run. Pass 4's "~85%" was close to the right answer
by an arithmetic that could not have produced it.

### 4.2 The e2e sub-ledger — +318 is 310

`git --numstat` over the five pass-4 Lane A commits, e2e pathspec:

```
94ce993e  gallery-deal.spec.ts   +181 / −8
c6eda619  filter-census.spec.ts  +123 / −0
3969f512  font-census.spec.ts      +6 / −0
                                 ─────────
insertions 310 · deletions 8 · churn (i+d) 318
```

The published `e2e/ +318 / −8` is the **churn** in the insertions column — and the per-file
breakdown carries the same error once more: "gallery-deal +189" is 181+8. Corrected:
gallery-deal **+181** · filter-census +123 · font-census +6 = **310**. The registry's reading
holds in both directions: the grand total `+392` is right precisely because it was computed with
310 (310 + src's 82 = 392), so the error lives in the sub-ledger alone.

### 4.3 `ribbon-geom` gets a falsifying arm — and the arm indicts a column

`A5-60`, chromium/light/320 (the tightest cell), the shipped `both` state then the same reads
with the sub-line replaced by a string that cannot fit:

```
shipped (both)        255.83×106.2  overflow 0/0  slack 45.33/45.34  lines 1
control: long string  255.83×166.2  overflow 0/0  slack 14.27/14.27  lines 4
FALSIFIABILITY GATE: the instrument must MOVE on a string that cannot fit — PASS
```

The instrument moves, so it is an instrument. **And the arm found the thing the missing control
was hiding**: `overflow` stays **0/0 even on an impossible string**. The note grows; it does not
clip. So pass 4's headline reading — `overflow 0/0` across all 36 cells — was reporting a
property the layout cannot violate, not a property the copy satisfies. The load-bearing columns
are `subLines` and `noteH`, and those are the ones a future copy change must be read on.

Disclosed: the shipped `both` slack reads 45.33/45.34 here against pass 4's 31.73/31.74 at the
same nominal cell. Two trees apart (T5-W2/W3 moved the estate) and two instruments apart — see
§5.1. The pair inside this run is single-instrument and single-tree, which is what the arm needs.

> **STAMPED at pass 6 (A5-G2, A5-G4).** (a) The `overflow` column is **RETIRED**: it is printed
> here and gated nowhere, and no headline may cite it again — `subLines` and `noteH` carry the
> claim. (b) The disclosure above is **now reconciled, and the explanation it offered was wrong on
> both axes**: neither the tree nor the instrument moved the number. The gap is the REFERENT —
> 45.33 is measured from the note's BORDER box, 31.73 from its CONTENT box, and the difference is
> exactly `.guard-note`'s 13.60px horizontal padding, a rule byte-identical at both trees. Pass 6's
> one-instrument arm reproduces all three of pass 4's 320 cells on the content referent at
> `abe533c4` and reds on the border referent, as it must: `pass6/A/logs/A6-10-referent-arm.log`.
> Neither figure is struck; both are quoted with the referent named or not at all.

---

## 5 · THREE THINGS FOUND WHILE DOING THE WORK

### 5.1 Pass 4's Lane-A rigs are not in the tree

`pass4/rigA/` contains `package.json` and a `node_modules` symlink and nothing else at
`66fa5856`; `verb-ink.mjs`, `ribbon-shots.mjs` and `serve.mjs` are named in the pass-4 report's
§12 and absent from disk. `git log --all -- 'pass4/rigA/*'` returns one commit and it added the
two files that are there.

So `A5-61`, `A5-60` and `A6-70` run on **re-authored** instruments, against pass 4's published
schema and gate rather than its code. Handled by measuring the fine cell again on the new
instrument so no comparison in this dossier crosses instruments. The re-authoring reproduces
pass 4's fine cell closely — mass safe 334.58 vs 333.74, deal 771.4 vs 770.53, ratio ×2.306 vs
×2.309 — which is corroboration, not proof of identity, and is stated as such. **This is a
record defect, not a product defect**, and it is a pass-5 gap in the loop's sense: a number the
record cannot regenerate. Pass 5's own rigs are committed beside their logs (`pass5/A/rig/`).

### 5.2 The shared tree carried three other lanes' in-flight work

Every measurement here was taken on a working tree with lanes BC/D/F3 editing concurrently
(`check-ink-pressure.mjs`, `GameBoard.vue`, `GameControlPanel.vue`, `filterBudget.ts`,
`font-census.spec.ts`). Two consequences, both banked rather than smoothed:

- **The dev harness reloads under other lanes' HMR.** The first `A1-40` attempt failed 5 of 36
  with `navigated to …` inside the Playwright call log and `stepTo` reset to card 0 — a full
  reload mid-test, not a product defect. Cured by restarting the dev server and re-running on a
  quiescent window: 36/36. Named for the next lane that runs e2e against a shared dev server.
- **`e2e/font-census.spec.ts:207`** — "the ledger holds BOTH directions across two games and two
  regimes" — is Lane BC's pass-5 order 2, in flight, and it reds at this HEAD (`A7-80`). It is
  not in the T5-W3 seal, it is not Lane A's, and it is presumably their born-RED. Lane A's own
  row in that file (`:193`, the mixed-face census) is green 3/3. The lane battery `A7-81`
  excludes the file and says so in its own header.

### 5.3 A port in the lane band was already occupied

`4231` and `4241` were held by another lane serving a built dist. `vite --port 4231 --strictPort`
failed to bind, the shell backgrounded the failure, and a run against `PLAYWRIGHT_BASE_URL`
pointed there **looked valid** — `global-setup`'s assert-the-SPA passes, because it *is* the app,
just not this lane's build. One log was banked and discarded on discovery; the lane moved to
4236/4246 (and 4247 for the ablated dist). For the trap ledger: the assert-the-SPA gate catches
the wrong *server*, never the wrong *tree* — check `lsof` before trusting a lane port, and prefer
a dev server whose index serves `/src/main.ts` over one serving `/assets/`.

---

## 6 · THE DEAL-WEIGHT SUCCESSOR — G3's OPEN HALF (CH-61 / mark 5)

**The ruling being extended.** `766aa068` (T4-WU): *"a `New game` role=group zone (Size +
Difficulty + the re-homed Deal) above the divider, live tools below — size goes ARM-NOT-LIVE …
only Deal deals."* It settled the **grammar** — options are armed, one verb commits them — and
the registry records it as `ADDRESSED-with-successor`: *"the verb 'bake'→'Deal' lost a ratify-me
row; open successor = mark 5's Deal weight = CH-61."*

**The open half names its own comparison**, and pass 4 measured a different one. `charter-f1.md`
§1: the commit verb is *"visually subordinate to **the option lists it commits**."* `verb-ink`
weighed deal against **safe** — two verbs on one rung. Nobody weighed the commit verb against
the **options**. That is the measurement this row owed, and `A6-70` takes it, in the picker
regime T5-W4a gives this lane, at both pointer regimes, on three channels:

```
── fine  1280×900 dpr2
   type      deal 18.4px · chip 16px · axis label 14.4px          → deal / chip  ×1.15
   ink mass  deal 771.4 · heaviest of 6 chips 272.42 · all 797.41 → ×2.832; 96.7% of the whole list
   density   deal 0.20919 · heaviest chip 0.12126 · mean 0.05923  → ×1.725
── COARSE 390×844 dpr3
   type      deal 18.4px · chip 16px · axis label 14.4px          → deal / chip  ×1.15
   ink mass  deal 806.25 · heaviest of 6 chips 276.56 · all 800.51→ ×2.915; 100.7% of the whole list
   density   deal 0.19877 · heaviest chip 0.10072 · mean 0.04866  → ×1.973
GATE — the commit verb out-ranks the option list it commits on TYPE, MASS and DENSITY
       in both regimes: PASS
```

The verb carries as much ink as **the entire six-chip list it commits** (96.7% fine, 100.7%
coarse) and beats the heaviest single chip — the honest adversary — by ×2.8/×2.9 in mass and
×1.7/×2.0 in density, on a type rung 15% above them. The band's CSS made the claim on purpose
and says so at the site: *"the chips are INPUTS, not the headline… Pinned to the body rung here,
so the verbs lead."* The rung is now measured against the list rather than asserted.

**Scope, stated plainly.** This closes the **picker** half of CH-61 only. The surface
`charter-f1.md` §1 indicts by geometry — "a 28px `DiceIcon` + caption sublabel" — is the
**drawer's** Deal in `GameControlPanel.vue`, which is W4b/Lane BC's fence, not this lane's. The
picker's deal is a 20px die beside an 18.4px word inside a ribbon-weight box, a different
control. Lane A does not claim mark 5.

**U-10.** Mark 5 closes only on the owner's re-look. Nothing above closes it. The picker's rank
claim is now measured on three channels in two regimes and the numbers are on disk **awaiting
the owner's eye**; the words "cured" and "closed" are not used of the mark.

---

## 7 · W3.3's OPTIONS 5/5, AS A FLOOR IN THIS LANE'S BATTERY

`a11y.spec.ts:331` owns the AX-tree half and keeps it (Chromium's own tree, plus the portable
`axStrip` half for WebKit). The charter asks for the floor to persist *while the visual design
moves*, so the structural half is now asserted in `gallery-deal.spec.ts:144-145` — the file the
picker's own composition changes land in. A re-skin that drops or un-names an option reds the
lane that made it, not only the a11y lane downstream. Both green in `A7-81`, both engines.

## 8 · DELTA

No picker **composition** changed this pass. The source delta is one ARIA attribute on a
non-painting container plus its comment (§0's ledger: 1 code line of 14). No CSS, no element, no
text, no layout property. So no before/after pair is owed, and none is claimed. The picker's
composition as it stands is banked instead, one crop per pointer regime, for the passes that will
move it: `crops/band-fine-1280.png` (21,857 B) · `crops/band-coarse-390.png` (34,248 B) — both
well under the 150 KB policy.

## 9 · FILES

```
rig/verb-ink.mjs · rig/ribbon-geom-longstring.mjs · rig/deal-weight.mjs · rig/band-crop.mjs
logs/A1-00-BEFORE-dev-chromium.log            17/17 — the hold works on dev
logs/A1-01-BEFORE-preview-chromium.log        16/17 — A-M1, the race, on the built dist
logs/A1-10-ABL-devonly-pattern.dev.log        pass-4 pattern + the new gate: green on dev
logs/A1-11-RED-devonly-pattern.preview.log    the same arm on preview: heldHits 0, RED
logs/A1-40-GREEN-dev-both-engines.log         36/36
logs/A1-41-GREEN-preview-both-engines.log     36/36
logs/A2-probe-dirty-without-usermoves.log     the two guard signals pulled apart
logs/A2-10-RED-samegame-arm-narrowed.dev.log  ablation-RED, 1 of 18
logs/A3-20-RED-d-scoped-to-button.dev.log     ablation-RED, 1 of 18
logs/A23-30-RED-both-ablations.preview.log    both ablations on the built artifact, 2 of 18
logs/A4-50-FLOORS-a11y-gallery.dev.log        58/58
logs/A5-60-ribbon-geom-longstring.log         the falsifying arm
logs/A5-61-verb-ink-coarse.log                fine + COARSE, shipped + flat control
logs/A5-62-attrib-font-census-BASE-x3.log     BASE arm, 3/3 red, with the prepend
logs/A5-63-attrib-font-census-CURED-x3.log    cured arm, 3/3 green
logs/A6-70-deal-weight.log                    G3's open half
logs/A7-80-FINAL-battery.dev.log              97/98 — the one red is Lane BC's in-flight row
logs/A7-81-FINAL-battery-laneA.dev.log        94/94 — Lane A's fence + the W3 floors
crops/band-fine-1280.png · crops/band-coarse-390.png
```
