# T9-W7 · pass 3 · PROTOTYPE · CTRL-TAPE — the taped case, built and measured

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-27`
(branch `worktree-wf_f72f3b5a-83a-27`), cut from `74a2b5d9`, **uncommitted**. Prototype server
127.0.0.1:**4230**; HEAD control `74a2b5d9` on 127.0.0.1:**4235** (the MAIN tree, whose `src` is
frozen for exactly this office), each with a private `cacheDir`. Both servers KILLED; 4230 and
4235 read free at return. Readings in `readings/`, instruments in `instruments/`, gate logs in
`logs/`, four crops in `frames/` (288 KB total for the family).

## 0 · The replay, and the route it took

The harness refuses `git` aimed at another worktree in either form (`cd` and `-C`), so the replay
took the chair's stated fallback: a **verified file copy**, with the file list derived rather than
remembered — `git archive a8fee1f5` into a scratch tree, then `diff -rq` against the pass-2
worktree. **21 files** differ. The fold (`a8fee1f5..74a2b5d9`) touches **exactly the five** the
spec named, and no others, so sixteen files carried byte-for-byte and five were hand-merged:

| file | resolution |
|---|---|
| `check-copy-register.mjs` | pass-2 hunk DROPPED whole — `ADMITTED` is empty at HEAD and the fold's discovery grammar is law |
| `check-font-coverage.mjs` | HEAD's version kept (paperNoteCopy, `what fits`, the `.error-note-text` face); only the `.section-heading` face MOVE re-applied |
| `GameControlPanel.vue` | pass-2 file carried, then the fold's three sites restored verbatim (the pencils-hint comment, the caption comment, `finishes the board for you`) |
| `GameControlPanel.test.ts`, `zone-grammar.spec.ts` | pass-2 files carried, the fold's caption-census comments restored |

Pass 2 and the fold had independently renamed `candidates` → `what fits`; they converge.
`vue-tsc -b` **exit 0** on the replay before any pass-3 edit. Untracked carry: none.

## 1 · The six pieces, with their numbers

### 1.1 THE REGISTRATION (§6.5) — and one name measured OUT of it

`index.css` carries the `@property` block: eight `<length>` names at absolute `0px` initials and
§13's six `<time>` rungs at `0ms`. **`--washi-tag-rung` is NOT in it**, and the ablation is why.
It is declared on `.controls-card` and READ by every washi tape in the estate; the ones outside
the card fall back to `var(--type-tag)` = `--type-caption` = `clamp(0.75rem, 0.71rem + 0.21vw,
1rem)` — viewport-dependent, so no absolute initial can stand for it. Registering the name at
runtime at 1440×900 and re-measuring the deck's own `new game` tape:

| engine | before | after |
|---|---|---|
| chromium | 14.384px · 65.39 × 19.63 | 14px · **64.00 × 19.63** |
| webkit | 14.384px · 65.40 × 20.10 | 14px · **63.99 × 19.58** |

A π break on a surface this wave does not claim, both themes. The fallback is therefore a
DEFENDED one, like `--vv-height`'s. **Amendment to the spec, with its number.**

Fallbacks struck: eleven `, 0px` sites across `scene.css` and `GameControlPanel.vue` (the spec
named five; §6.5 is wave-wide, so the `::before`'s four `--card-pad-t` and `scene.css:134`'s
desk-rung `--card-foot-h` went with them). `--ring-ink`'s mint STRUCK; the consumer reads
`var(--ring-ink, currentColor)`.

### 1.2 THE TWO LOUD ROWS — both measured, both directions

**THE REGISTRATION TOOK.** Publishers deleted on the served page (the two root properties and the
four card properties removed from the elements that carry them): every registered name computes
**non-empty** — `0px`, never `""` — at six cells × two engines. HEAD's signature is `""`.

**THE PUBLISHER RAN.** At 390×844 after a ≥900 ms settle: `--masthead-foot` **214.73px** (webkit
215.02), `--sheet-chrome` **229.23px** (webkit 229.95), `--card-pad-t` **43.8656px**,
`--card-foot-h` **75px** — all ≠ their initials. With the publisher deleted the same reads are
exactly `0px` / **192px** / `0px` / `0px`, and the card's cap goes 515.77 → **628** (`max-height`
survives as a number rather than collapsing to `none`). Born-RED, both directions, both engines.

### 1.3 THE FOOT ON THE INSET (§6.3c) — and the defect the row caught

`--safe-b: env(safe-area-inset-bottom, 0px)` on `:root`; `.card-foot` stands on
`calc(0.5rem + var(--safe-b))`. The authored-rule walk finds **1** rule spending
`safe-area-inset-bottom` (`:root`). The arithmetic, six cells × two engines:

**foot +34.00 · verbs −34.00 · reverted 0.00**

It did not read that way at first, and the row is the reason the cure exists. **The observer
watched the BAR and published the FOOT.** A bottom inset changes the foot's height and leaves the
bar's alone, so nothing fired: `--card-foot-h` stayed at `75px` while the foot stood 108.77 tall,
the card's cap never gave the 34 back, and the foot's bottom landed at **853.77 against an
innerHeight of 844** — the verbs 9.77px BELOW the viewport edge, a worse fault than the flush
stroke the inset was spent to fix. Two cures, and the second was found by the first failing:
the foot joins the observed subjects, **and the observation takes `box: "border-box"`** — a
`ResizeObserver` reports the CONTENT box by default and the inset is spent as padding, so
observing the foot on the default box still fires nothing. After both: `--card-foot-h` republishes
to `109px` and the foot's bottom returns to the viewport edge (844/844, 812/812, 932/932, 390/390).
WebKit shows ≤0.45px of settle residue on the revert.

### 1.4 THE SEAL AND THE CROSSING — NOT TAKEN (gap 1)

Not measured this pass. The seal's restamp, the six-term ablation, the second negative control and
the crossing's reading against the named line (the painted path's bbox top) are the pass's largest
gap; `instruments/p3-seal.mjs` is the pass-2 probe copied and re-pointed, unrun.

### 1.5 §2.5b, I2/I3/I4, L3

`zone-grammar.spec.ts:372` re-cut to **five offsets** `[0, .25, .5, .75, 1]` with a stated
**0.25px²** tolerance for the WebKit clip seam, and `covers` now reports two decimals (the old
`Math.round` could not tell 0.00 from 0.49). **The row was not RUN** (gap 2) — the re-cut is in the
diff, the reading is not.

**L3 gained its floor and is born-RED.** `check-copy-register` exit **0** AND `ADMITTED.length ===
0`; with a planted admission the row flips **RED** (`--plant`). The r0 law probe COPY reads
**L1 = 9**, L2/L3/L4/L5/L6 **GREEN**, **R3 RED → GREEN** (MOVED), R1/R2 still born-RED and not this
family's. I2/I3/I4 were **not re-run** (gap 3).

### 1.6 HOUSEKEEPING — one narrowing, declared

`typography.css`'s `.section-heading` loses its **face** (`font-family: var(--font-display)`), not
its rule. A DECLARED narrowing of the spec's "delete 378-386": both wearers override the family
with `--font-hand`, so the face was dead ink — but the weight, the lowercase, the tracking and the
md arm are still LIVE on `StagingBand`'s axis label, a gallery surface this wave does not claim.
The π census confirms the narrowing was right: axis font, family, weight all **`same`** vs HEAD.

The landscape arm returns to HEAD's flat `4rem`. `App.vue`'s staleness prose becomes an
**assertion** — `zone-grammar.spec.ts` walks `document.styleSheets` and requires every rule that
declares or reads `--sheet-chrome` to sit under a `max-width: 1023.98px` condition, with a planted
desk-rung spender as its negative control. Written, **not run** (gap 2). `MOTION.inkLiftMs` DELETED
(0 importers); its CSS literal stays until §13's publisher lands, because consuming a rung whose
registered initial is `0ms` in a tree with no publisher would ship a settle that never runs.

## 2 · THE CONFIRM'S FACE (§2.5) — the section's rule, built

`ConfirmRibbon.vue` (new, 1 file): one sentence, two answers, no ground, no modal, at the full
width of the row the verb lives in. Four sentences and `keep` in one table; `sure?` and
`.icon-sublabel.is-armed` deleted with the pose they painted. The four `armed` refs and four
timers collapse to one `askingAct`.

Measured at 390×844, chromium and webkit, light and dark:

| row | reading |
|---|---|
| ribbon width vs its row | 390.00 / 390.00 — **Δ 0.00** |
| `keep` | 48.36 × **44** · stroke **1.5px** · path 218.2 · ink **327.2** |
| `clear` | 51.36 × **44** · stroke **2.5px** · path 224.2 · ink **560.6** |
| painted density ratio | **1.713** (floor 1.5) |
| the red word | `#D02A52` light · `#FF5C7C` dark, on bare card (`rgba(0,0,0,0)` over `#FDFDFC` / `#131211`) |
| ribbon ∩ the card's live controls | **0.00** |

Both answers clear the tap floor on both dimensions. The frames did not paint at all in the first
cut — `strokeWidth: null`, `pathLen: null` on both, i.e. the weight ladder, this face's ONLY
non-colour channel, was not on the page — because a `HandDrawnOutline` with no children needs its
`.outline-container` laid at `inset: 0` and an `inline-flex` button gave it no size.

**The arm's focus contract**, measured:

| row | chromium | webkit |
|---|---|---|
| pointer press 1: focus moves | 2 focusout / 1 focusin | **1 focusout / 0 focusin** |
| pointer press 1: card `scrollTop` Δ | **0.00** | **0.00** |
| pointer press 2 fires | **glyphs 65 → 0** | **glyphs 68 → 0** |
| keyboard arm focuses `keep` | **yes** | **yes** |
| second Enter disarms, board unchanged | ribbon gone, glyphs 64 → 64 | 64 → 64 |
| Escape disarms, sheet stays | **yes / up** | **yes / up** |

Two more defects the rows caught, both mine: `@click="onClear()"` passed **no event**, so the
keyboard discriminator (`e.detail === 0`) never saw a keyboard press and the arm never focused
`keep`; and Escape was bound on the wrap and the bar, which **cannot hear it** once the pressed
control unmounts and focus falls to `<body>` — measured, the ribbon stood through Escape on all
four cells. Escape now listens at the document while, and only while, a question stands.

**An instrument note, not a defect.** The `.confirm-go` tap timed out on every cell with the button
resolved: `FilterTuner.vue`'s floating toggle (`import.meta.env.DEV`, allowlisted out of the copy
register for that reason) lands on the foot's right edge, over the destructive answer. It
intercepts the tap and it painted over the red word in the first crop. Removed in the probe and in
crop (2), and named here; it ships in no build.

## 3 · π, the voice, the ring

**Deck and board Δ 0.00 vs `74a2b5d9`** on every reading, four cells × two engines: band height,
band top, first card y, tape span, `ariaSnapshot` headings (1/1), the axis label's font, family
and weight, and the board's width, height, top, left and cell width.

**The voice:** 8 names, **1** distinct rung (25.888px), one family (Patrick Hand), at every cell.
The name/option ratio is **1.2944** at the rail and in landscape (chip 20px) — and **1.618** on the
dock, where the chip rung is 16px. The spec's "1.2945 every cell" holds on three of four; the dock
is a cell-dependent reading, reported rather than smoothed.

**The ring, as read.** `--ring-ink` computes to `""` on the root, the card and the focused element
— the mint is struck. The painted ring is `2px dashed` at offset 3, colour
`oklab(0.144521 … / 0.5)` light and `oklab(0.874786 … / 0.5)` dark, `:focus-visible` witnessed on
four chips. That is 50% of `--color-foreground` in both themes — numerically pass 2's value — and
it is **not** `currentColor` (the 4×4 chip's colour is `rgb(115,115,115)` and its ring is not).
A walk of every rule in `document.styleSheets` that mentions `outline` and matches the element
returns **[]**, so this lane could not attribute the 50% mix to a declaration in this tree.
Reported as the value read, and handed to MRK-LIVE, who owns the mint.

**The hue census** COPY: 29 token rows, unchanged, no colour minted.

## 4 · The gates, run bare

| gate | exit |
|---|---|
| `check-theme-selectors` | **0** |
| `check-copy-register` | **0** — 0 em dashes, 0 unadmitted, **0 admitted**, lexicon 25, 138 files |
| `check-font-coverage` | **0** |
| `lint:motion` | **0** — 34 specs |
| prettier | **0** |
| `vue-tsc -b` | **0** |
| vitest | **0** — **68 Test Files / 831 Tests**, all passed |

`transition: all` with a spent duration on a token carrier: **0**, at every cell (the first cut of
that probe returned 1,143 rows and was a broken predicate — `transition-property: all` is the
property's own initial value, so it selects the whole tree unless a duration is required too).

## 5 · Gaps, honestly

1. **The seal was not re-measured** — no restamp, no six-term ablation, no second negative control,
   and **the crossing was not read** against the reference line the chair named. The largest gap.
2. **No e2e row was RUN.** The §2.5b five-offset re-cut, the desk-rung `--sheet-chrome` assertion
   and W2 §2.2's reachability at 844×390 / 812×375 are in the diff as code and have no readings.
3. **I2 / I3 / I4 were not re-run**, so M04 term 1 has no GREEN this pass.
4. **No build.** `npx vite build` was never run, so the **filter census (EXACTLY 9) and the goldens
   (4/4) are unverified** on this tree. L1 reads 9 from `filterBudget.ts` statically, which is the
   source and not the dist.
5. **The `.confirm-go` frame paints red too**, not only its word: `HandDrawnOutline` draws in
   `currentColor` and `.confirm-go` sets `color: var(--color-red-ink)`. The spec says the WORD is
   red. Visible in crop (2), reported as a reading for the adjudicator, not smoothed over.
6. **The dock's name/option ratio is 1.618**, not 1.2945 (gap in the spec's claim, not the build).
7. **The ring's 50% mix is unattributed** (§3).
8. **The fresh-reader protocol (U-10) was not run.** Crop (3) is banked for another lane's agent.
9. **The confirm's face was measured at ONE cell** (390×844). The rail and landscape poses of the
   ribbon are unmeasured; `deal`'s own ribbon in the `deal-row` is built and never measured at all.
10. Two probe defects are recorded above because they nearly became findings: the unclipped
    intersection (2,048.97px² against a chip nobody could see) and the `transition: all` predicate.

## 6 · Crops (4 files, 288 KB total)

1. `c1-foot-flush-390-dark-chromium.png` + `c1-foot-inset34-390-dark-chromium.png` — the §6.3c
   condition seen: the foot flush at the viewport edge beside the same foot standing on 34px.
2. `c2-confirm-armed-390-dark-chromium.png` — the section's face: `clear the board?` · `keep` at
   1.5 · `clear` at 2.5 in red, full width, nothing under it (DEV tuner removed, §2).
3. `c3-pinband-1440-chromium.png` — the rail at scrollTop 0.5, the pinned tape inside the band.

## 7 · Merge watch

**YES on both halves, and both measured on this tree.** The pin band is ONE mechanism: `--pin-band`
computes **43.8656px** at every cell and both engines, from one declaration on `.controls-card`,
read by the card's padding, §2.5's exempt line and the well's hang. `useTwoTap` and `askingAct` are
one machinery — this pass collapsed four `armed` refs and four timers into a single `askingAct`,
which is the ribbon's own prop, and §2.5's focus contract (pointer arms move no focus, keyboard
arms focus `keep`, null `relatedTarget` is not a departure) is the section's.

## 8 · An incident this lane caused, reported

Killing this lane's two servers used `pkill -f "vite --config …/evidence/w7/loop/pass3"`, and
that pattern is a PREFIX of every pass-3 lane's scratch-config path, not just this one's. Ports
4231-4234 were BUSY when this lane opened the band and read FREE at its return. I cannot show they
were mine, and I should not have written a pattern that could not tell. If a sibling family's
prototype lost its server mid-run, that is this lane's doing; the fix for the next pass is to kill
by recorded PID, never by a path prefix the whole pass shares.
