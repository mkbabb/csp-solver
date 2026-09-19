# CTRL-FACE — pass 3 ADVERSARIAL CRITIQUE

**Verdict: ADVANCE at 79%.** The prototype runs on the real surface in both engines, its
instruments are real, and six of the gates I re-ran bite when I break them. It is not at 100
because two of its own gate rows cannot fail as implemented, one gate was re-worded from the
spec's band to a proxy that passes where the spec's number reds, a stated layout invariant is
broken and ungated, and the face law's gate is falsifiably blind on a surface that ships today.

Critic's control commit: `74a2b5d9` (the chair's base), served read-only from the MAIN tree.
Prototype `127.0.0.1:4238`, HEAD control `127.0.0.1:4239`, both with private `cacheDir`s,
`--strictPort`, **both killed before this file was returned**. Instruments and raw readings:
`critique/CTRL-FACE-probe/{critic.mjs,critic2.mjs,proto.jsonl,head.jsonl,proto2.jsonl,head2.jsonl,gates.log}`.
Zero product files were written; the CHECK 6 falsifications ran on a scratch COPY of the tree
under the session scratchpad, never in the lane's worktree.

---

## 1 · What I re-ran, and what it said

| I re-ran | result |
|---|---|
| `check-font-coverage.mjs` (CHECK 6) — baseline, and falsified BOTH ways on a scratch copy | GREEN at baseline; **RED** when `.heading-value` is re-pointed to `--face-printed` (the gate bites, correctly); **GREEN** when `.staging-axis-label` is re-pointed to `var(--font-display)`, and **GREEN** again with a literal `"Comic Sans MS", cursive` on it (**the hole**) |
| `check-support-floor.mjs` | `6 UNITS REACHABLE` GREEN, `PASS — 0 violation(s)` |
| `lint:copy` · `lint:ink` · `lint:motion` · `lint:theme-tokens` | all exit 0, each with its own negative control firing |
| the card, 5 cells × 2 engines, paired against `74a2b5d9` | see §2 |
| the DECK's own tape and labels, 3 cells × 2 engines, paired | π holds — §2.4 |

---

## 2 · The measured findings

### 2.1 The caption's "fixed COLUMN" is gone, and its own comment still claims it

`flex: 0 0 3.75rem` is not a fixed width while `min-width: auto` stands: under `white-space:
nowrap` the flex item's automatic minimum size is min-content, so the used width is the word.

| | HEAD `74a2b5d9` | prototype |
|---|---|---|
| `marks` box width | **60.00** | **87.00** (wk 87.03) |
| `what fits` box width | **60.00** | **120.69** (wk 120.72) |
| `marks` right edge | **76.00** | **103.00** (wk 103.03) |
| `what fits` right edge | **76.00** | **136.69** (wk 136.72) |

At 320, 390 and 768×1024, both engines. The two captions end **33.69px apart** where HEAD's end
on one edge, and `text-align: right` is now inert because the box equals its content. The rule's
comment retains, verbatim and unedited, the sentence that is the whole stated reason for the
column: *"Right-aligned in its own column, both captions end on one edge and both control groups
centre on one axis."* Both halves are now false. The lane rewrote the sentence AFTER it and
declared the basis "a FLOOR"; it did not reconcile the invariant it kept.

The option strips bear this out — at 390 they start at x **111.00** and **144.69** (webkit 111.03
/ 144.72). They do not centre on one axis.

### 2.2 The prototype INVERTS the pose it cites as precedent

The shipped comment justifies the wrap with *"the caption takes the row's FIRST LINE and the chips
take the second — which is HEAD's own pose for that row today, not a new mechanic."* Measured, at
390×844 and 768×1024, both engines:

- **HEAD**: `marks` caption and its strip are on **different lines** (strip x 16, w 358);
  `what fits` likewise (strip x 84, w 290). Two lines, both rows.
- **PROTOTYPE**: both captions are on the **same line** as their chips (`marks` strip x 111 w 263;
  `what fits` strip x 144.69 w 229.31). One line, both rows.

The prototype does not reproduce HEAD's pose at these cells; it reverses it. The change may well
be the better card — that is U-10's — but the precedent the comment offers is not there.

The same comment states `marks` is **90.98px**. It is **87.00 / 87.03** — the lane's own README
table says so.

### 2.3 CHECK 6 is blind on a site that renders today, and the law it states is already false

`FACE_SITES` declares `.section-heading` → Fraunces. On the deck, `StagingBand.vue` renders
`class="section-heading staging-axis-label"` on one element and `.staging-axis-label` sets
`font-family: var(--font-hand)`. Measured, both trees, all three cells: that element paints
**`Patrick Hand · 16 · 800`**. The law as written is false at render on a shipping surface.

The gate cannot see it, because `LISTED` is built from the class names inside its own keys, so a
block whose selector contains no listed class is neither an "undeclared home" nor "a law with no
home". Falsified on a scratch copy of the tree:

- `.staging-axis-label { font-family: var(--font-display) }` → `font coverage OK`, exit 0.
- `.staging-axis-label { font-family: "Comic Sans MS", cursive }` → `font coverage OK`, exit 0.

A literal family string is the one thing the check's own header promises to red. It does, but only
inside the list it wrote for itself — which is the hand-written list the header says it replaces.

### 2.4 The gallery-π instrument never measured the deck's tape (the conclusion survives)

`p3-gallery.mjs` reads `document.querySelector(".staging-band .washi-tag, .washi-tag")`. A
selector list returns the first match in **document order**, and the card's tape precedes the band
— I measured `firstWashiInDoc.inBand === false` at every cell, both engines. So the
`deck tape voice head/proto: Patrick Hand · 14.048 … / Fraunces · 25.888 …` and
`deck tape margin −24.712 → −30.796` rows in `gallery-pi.log` are **the card's tape**, and the
deck's own tape is absent from the 328 numbers.

Re-measured properly, the deck's tape is π: box `{381.59, 631.88, 64.16, 19.63}` identical on both
trees at 1280f, voice `Patrick Hand · 14.05 · 500` identical, and the only delta anywhere is
`margin-top −21.7025px` vs `−21.712px` — **0.0095px**, the `1lh` vs `1.5em` rounding. Deck labels
and chips identical on both trees at all three cells. **The π claim is true; the evidence for it
did not exist until this file.**

### 2.5 The seal's sibling cell moved and nobody priced it

768×1024 coarse, card height: HEAD **681.02** chromium / **681.5** webkit → prototype **685.08** /
**685.50**. **+4.06 / +4.00px**, unreported. The same cell is where `--type-option`'s 768–1023 arm
dies: chip font **22px → 20px**, chip box 45px → 44px (the lane declares the chip, not the card).
The §6.1 restamp is priced at 1280 coarse only.

### 2.6 Contrast, filters, copy — all clear (independently computed)

Composited, alpha-aware, over the real ancestor chain, both themes, `.controls-card`:

| site | light | dark |
|---|---|---|
| open head `.section-heading.text-foreground` | 19.45 | 15.84 |
| shut head `.section-heading.text-muted-foreground` | 4.66 | 7.68 |
| shut value `.heading-value.crayon-orange` | **4.90** | 10.23 |
| `.zone-row-label` (printed ink) | 19.45 | 15.84 |
| `.tray-well .washi-tag` ×4 | 19.45 | 15.84 |
| worst card chip | 4.66 | 7.68 |

Floor 4.5 clears everywhere; the crayon value word at **4.90 light** is the thinnest margin and it
is a data-driven ink, so it is the row a later palette move will break first. `filterBudget`
untouched (no `src/pencil/config/` line in the diff). `lint:copy` exit 0, zero strings minted, M16
intact. Chip tap box 44.00×44.00 at every coarse cell — exactly at the floor, down from HEAD's
48.02–60.02 in width.

---

## 3 · The gates that cannot fail

**The printed count.** `face-law.spec.ts:224` asserts
`read.n === read.tapes + read.captions + read.sections` where `printed = [...tapes, ...captions,
...sections]` and `n = printed.length`. It is the same list counted twice. `sections.length` is
never asserted, and `n === 8` is never asserted — so the spec's stated content ("8 dies at a sixth
game") is not in the file. What survives is `tapes === 4` and `captions === 2`, which are two
constants, not a derivation.

**The caption is one line.** The test asserts `whiteSpace === "nowrap"`, then asserts `lines === 1`
and `h <= lh + 0.5`. Under `nowrap` those two are consequences of the first, so the row reds only
by deleting the rule it just asserted. The ablation the lane cites (`white-space: normal`) trips
the `nowrap` assertion first. The failure mode `nowrap` actually creates — the column loss in §2.1,
and overflow — is measured nowhere.

**Engine identity, re-worded.** The spec's gate (i) is *"every card chip's mark width chromium ==
webkit ± 0.5px"*. What shipped asserts, inside each engine, on ONE chip
(`.ctrl-btn[aria-pressed="true"]` `.first()`), that `paintedW - wordW ≈ 8`. The cross-engine number
is never compared in any gate, and the lane's own reading is **32.67 chromium vs 32.00 webkit =
0.67px apart** — outside the spec's own ±0.5 band. The argument that identity follows from both
engines measuring the same Patrick Hand advance is sound and unasserted. This is the chair's
"never re-word a gate to pass" line, and it should be closed by writing the cross-engine row (the
census already has both numbers) or by re-pricing the band with its reason.

---

## 4 · The frames

`f1` and `f3a/f3b` show what they say. **`f2-dock-light-checking-over-what-fits-chromium.png` does
not**: it is a 390-wide light crop of `marks` over `normal / corner / center`. The `checking` tape
and `what fits` are not in it. The +11.39 number stands in the census; the frame cited for it shows
a different row.

---

## 5 · Strengths — what should survive the fold whatever happens to the rest

- **`paintedExtent()`** — differencing two crops of the same element to get the pixels a layer
  painted. It is the only honest answer to "does this mark reach past this glyph" given WebKit's
  `actualBoundingBox` is the advance box and a `Range` is ascent+descent. It found and cured a
  real defect (the overhang was being clipped to the span's own box: 0.33 / 0.67 → 4.33 / 4.33).
- **`atLeast` derive-count floors.** A non-empty check passes on a rename that leaves one of two.
- **`check-support-floor` CHECK 6.** The pattern — a build grep that *cannot* fail is relabelled a
  guard, and the row that *can* fail is the browserslist floor re-derived against the feature — is
  the right shape, and its self-test bites on `firefox >= 119`.
- **The paired HEAD-control server at the chair's commit.** Cleanest π rig in the pass.
- **`.tray-well :deep(.x)` as the consumer hook.** A shared component's face is the consumer's
  ruling; neither `SheetWashiLabel` nor `OptionSelector` was edited to make this card printed, and
  the deck measurably did not move.
- **Self-honesty.** Three of the lane's own pass-3 readings were wrong before the surface corrected
  them and it says so; the `pencils` descender at −0.02px is reported rather than tuned away; the
  deck's 20.0% `ch` split is refused a hiding place behind π.

---

## 6 · Constraints — checked, one by one

| constraint | verdict |
|---|---|
| AA both themes | **clear** (§2.6), thinnest 4.90 |
| filterBudget 9 | **untouched**, no config line in the diff |
| M16 plain copy | **clear**, `lint:copy` exit 0, zero strings minted |
| π on unclaimed surfaces | **holds** (deck re-measured by me at 0.0095px), but the lane's own instrument never read it |
| r0 / R6 decided history | no R6 law re-worded; the r0 heading-voice instrument is COPIED and its change PROPOSED, never applied |
| W2's landed mechanics | respected — sticky tag, dock, bottom tab and the tap floor are all untouched; no new mechanic minted |
| §6.5 no-fallback | **diverged, declared** — `var(--motion-whisper, 150ms)` and `var(--ring-ink, currentColor)`; both publishers are absent at HEAD so both ship the fallback |
| §6.2 844×390 | **not done**, declared |
| 4 crops ≤150 KB | 4 crops, 58 KB — within cap; one mis-cited (§4) |

---

## 7 · Verdict

**ADVANCE, 79%.** Ship it into the agglomeration with §3's three gate rows reopened, §2.1's
invariant either restored or retired in the same commit as the comment that claims it, and CHECK
6's coverage closed at `.staging-axis-label` before this family's law is called enforced. None of
that is a missing primitive and none of it is a constraint violation, so it is neither BLOCK nor
RETIRE. It is also not 100: a gate that cannot fail is not a gate, and this family says so itself
three times in its own file headers.
