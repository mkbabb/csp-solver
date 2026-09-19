# CTRL-FACE — pass 2 RESEARCH · printed and written

§10 with §1 §2 §8 inside · marks M01 M03 M05 · the family that composes under a structure it
does not own. Everything below was measured on 2026-09-17, **chromium and webkit**, against the
pass-1 prototype worktree (`wf_e58b4764-0fc-34`, the face law AS BUILT) served at
`127.0.0.1:4234` with a private vite `cacheDir`; the server was killed before this lane
returned. HEAD is `aab67b92`. Controls are **in-page ablations** (the prototype's own method):
HEAD's declarations restored on the live page, so every delta is a declaration's and not a
lane's. Readings in `readings/`, instruments in `probe/`. **Zero crops** — every claim here is
a number, and the wave's 2 MB cap is better spent by the prototype.

**The verdict the synthesizer needs first: pass 1 found ONE undeclared gallery move and it
found the wrong mechanism for it. There are TWO moves, the mechanism is a CSS box rule and not
a masked fallback, and neither of the charter's row-2 remedies can repair either one. SCOPE
repairs both, exactly, measured to 0.00px at every cell in both engines.**

---

## 1. The two shared classes (row 1, and the row nobody wrote)

`shared-class-census.mjs` (banked, `readings/shared-class-SheetWashiLabel.txt`) censuses a
component's RENDER consumers, not its class name — which is the only census that can see this,
because `StagingBand` never writes the string `washi-tag`.

| owner | class | consumers | the face law's reach |
|---|---|---|---|
| `SheetWashiLabel.vue:164` | `.washi-tag` | `GameControlPanel.vue` ×4 (`:769 :952 :1006 :1042`), **`StagingBand.vue:130`** | the gallery's staging tape goes Patrick Hand 14/500 → Fraunces 25.89/800 |
| `OptionSelector.vue:105` | `.ctrl-btn` | `GameControlPanel.vue`, **`StagingBand.vue:143, :158`** | **the gallery's staging chips go Fira Code → Patrick Hand, lowercase** |

`.section-heading` is a third shared class (`StagingBand.vue:140, :154`) and it is SAFE: the band
pins the face and the rung back at `StagingBand.vue:315-319` (`--font-hand`, `--type-small`),
measured 16.00px Patrick Hand under the law at both gallery cells. It inherits `font-weight`
from `.section-heading` (800 at HEAD and 800 under the law — unmoved), and its ink comes from
the template utility, so the law's `--printed-ink` never reaches it (`--printed-ink` has exactly
ONE consumer in the built prototype: `.zone-row-label`, `GameControlPanel.vue:1657` — the
spec's `.section-heading { color }` was never built, an undeclared departure #6).

### 1.1 The staging chips — the move pass 1 did not see (`readings/H-staging-*.json`)

`StagingBand.vue:289-292` pins the chip's `font-size: 1rem` and `padding-inline: 0.65rem`. It
does not pin the FAMILY. Both engines agree to the hundredth at both gallery cells:

| row (gallery 1280×800) | HEAD face (in-page) | as built | Δ |
|---|---|---|---|
| sudoku `size` chips, total | 167.96 (Fira Code) | **134.03** (Patrick Hand) | **−33.93** |
| `16×16` alone | 68.78 | 53.02 | −15.76 |
| sudoku `level` chips, total | 196.77 (`Easy Medium Hard`) | **157.69** (`easy medium hard`) | **−39.08** |
| futoshiki `size` — the widest row in the estate | 198.36 | **168.66** | **−29.70** |
| row overflow, every arm | 0 | 0 | none |
| at 390: `4×4` | 49.59 | **44.00** (the tap floor binds) | −5.59 |

The direction is benign (the row SHRINKS; nothing overflows), but three estate statements go
stale the moment this lands, and they are written into the file as measured facts:
`StagingBand.vue:268-289` ("it buys 38.4px on the widest row in the estate"), the
`--staging-label-col: 48px` reserve derivation, and the rendered casing on the deck
(`Easy` → `easy`) which the gallery's spoken/visual specs read as `textContent` (unchanged —
`zone-grammar`'s own lesson: the engine reads `textContent`, not paint).

### 1.2 The cure, priced (`readings/B-gallery-*.json`)

Four arms at `?view=gallery`, 1280×800 and 390×844, both engines. `headControl` = HEAD's
`.washi-tag` declarations restored in-page; `scopedVar`/`scopedLh` = the printed face applied at
`.tray-well .washi-tag` only.

| arm | staging band h | first card `y` | tape |
|---|---|---|---|
| as built | 150.83 / 214.77 | 141.98 / 140.45 | Fraunces 25.89, paint 147.14×32.63 |
| HEAD control | 136.00 / 199.94 | 149.41 / 147.88 | Patrick Hand 14, paint 64.00×19.63 |
| **scoped (variable pull)** | **136.00 / 199.94** | **149.41 / 147.88** | Patrick Hand 14 — identical to HEAD |
| **scoped (`lh` pull)** | **136.00 / 199.94** | **149.41 / 147.88** | identical to HEAD |
| built + a GLOBAL `lh` pull | 150.83 / 214.77 | 141.98 / 140.45 | **unchanged — the repair does nothing here** |

(1280 / 390 pairs; webkit within 0.32px on every row, its own file.)

**Scoping restores the gallery exactly — 0.00px, both cells, both engines — and it leaves the
controls identical to as-built** (iPad panel 1276.75 built vs 1276.75 scoped-var vs 1276.88
scoped-`lh`, `readings/C-controls-ipad-*.json`).

---

## 2. Why the covenant could not have held there (row 2, re-founded)

`readings/E-flow-*.json`, both engines:

| | gallery tape | controls tape |
|---|---|---|
| computed `display` | **`inline`** | `block` |
| parent | `.outline-container`, `display: block` | `.tray-well`, `display: flex` |
| is a flex item | **no** | yes |
| computed `margin-top` | −39.47px | −34.71px |
| **true flow cost** (the box with the tape vs `display:none`) | **+38.83 / +38.81px** | **−0.01 to −0.05px per well** |

**Vertical margins do not apply to a non-replaced inline box** (CSS 2.1 §8.3). On the staging
band the tape is an inline box in a line box: the pull is computed and never used, the
give-back likewise, and what moves the band is the tape's LINE BOX. So the covenant is not
"off by 4.8–5.8px per tape" there (pass-1 critique §2.2) — it is **inert**, and the number the
pass-1 instrument prints (`marginTop + offsetHeight + marginBottom`) is arithmetic about a box
that does not lay out that way. Both charter remedies for row 2 therefore repair the CONTROLS
and cannot repair the GALLERY: setting `--washi-tag-lh: 1.2` on `StagingBand` would only shrink
the line box (38.83 → 31.07), leaving ~7px of the 14.83px band growth in place.

**The honest instrument is the consumer's, not the tape's**: take the tape out of flow and read
what the box around it loses. It is three lines, it is engine-portable, and it is RED at HEAD on
the gallery (21px) as well as under the law (38.83px) — which is the truth: the tag has never
been flow-free on that surface, and the family's job is to say so, not to fix it.

### 2.1 `lh` is live, and it is the pull's honest form (`readings/A-lh-unit-*.json`)

| | chromium | webkit |
|---|---|---|
| `CSS.supports("margin-top","calc(-1lh)")` | true | true |
| `1lh` at leading 1.2 / used 31.0656px | 31.046875 | 31.046875 |
| `1lh` at leading 1.5 / used 38.832px | 38.8125 | 38.8125 |
| `1lh` at `line-height: normal` | 30 (the case NO variable can express) | 30 |

Agreement is within **0.02px** (1/64 layout unit) — an order of magnitude inside the ±0.25px
covenant. The unit is inside the estate's own declared floor: `package.json:12-18` is
`chrome ≥ 111 · edge ≥ 111 · firefox ≥ 128 · safari ≥ 16.4 · ios_saf ≥ 16.4`, and `lh` shipped
in Chrome 109 / Safari 16.4 / Firefox 120. `scripts/check-support-floor.mjs` holds that floor to
the toolchain's own Lightning CSS target, so the citation is a gate's, not a claim.

With the `lh` pull the covenant survives a leading re-cut with no variable anywhere: swept at
six leadings (1.2 → 0.9), the tape's true flow cost on its own well reads **0.00–0.02px** at
every one, both engines (`readings/G-leading-*.json`).

---

## 3. The iPad seal (row 3), priced as a menu

`e2e/visual-regression.spec.ts:790-870`, `SEAL = 1227.5` at `:821`. Measured at 1280×800 coarse
on the built prototype (`readings/C-controls-ipad-*.json`, chromium / webkit within 0.13px):

| arm | panel h | Δ vs built |
|---|---|---|
| as built | **1276.75 / 1276.63** | — (+49.25 over the seal) |
| `.tray-well:first-child` 1.5 → 1.2rem | 1271.94 | −4.81 |
| … → 0.5rem | 1260.75 | −16.00 |
| … → 0.35rem (HEAD's) | 1258.34 | **−18.41** |
| captions `--type-subheading` (20.35) | 1263.47 | −13.28 |
| captions `--type-small` (16) | 1253.00 | −23.75 |
| captions printed, leading 1 | 1266.41 | −10.34 |
| captions back to the hand rung (14.05) | 1248.31 | −28.44 |
| captions to HEAD entire (rung 14.05 **and** leading 1.1) | — | **−31.25** (pass 1's ablation, reproduced by arithmetic) |
| first-well 0.5rem + captions hand rung | 1232.31 | −44.44 (**still +4.81 over**) |
| first-well 0.35rem + captions HEAD entire | 1227.09 | −49.66 (**under by 0.41px**) |
| the four tapes' re-facing | 0.00 | the tape costs NOTHING in flow here |

**There are exactly two terms in the bill and no third.** The first well is worth 18.41; the two
row captions are worth 31.25. Every combination that clears 1227.5 requires BOTH, and the only
one measured under it clears by 0.41px — which is not a margin, it is a coincidence.

### 3.1 The first well's 18.41px is buying a STICKY OFFSET, and a sticky offset is free

`readings/F-pin-*.json` — dock 390×844, 375×812 and 900×500 read identically; both engines:

| arm | tape ∩ tab head (gap, +daylight) | tape top vs the card's case edge | card `scrollHeight` |
|---|---|---|---|
| as built (first well 1.5rem, pin 0.15rem) | **+1.13** | +4.62 (unpinned at rest) | 689 |
| first well 0.35rem | **−6.79** | +0.54 | 677 |
| 0.35rem + pin `0rem` | −4.38 | −1.87 | 677 |
| 0.35rem + pin `−0.3rem` | **+0.41** | −6.67 (pinned ABOVE the case edge) | 677 |
| 0.35rem + pin `−0.6rem` | **+1.13** (the as-built clearance, exactly) | −7.38 | 677 |
| 0.35rem + `--washi-tag-lift: 12px` | −6.79 (the lift does not move the pinned pose) | +0.54 | 677 |

The pin costs zero flow and buys the identical clearance. It pays in CLIP: at `−0.6rem` the
pinned tape's top sits 7.38px above the card's case edge, and the card is a scrollport
(`scene.css:60`) — precisely the residue the W2 comment at `GameControlPanel.vue:1487-1499`
cured. So the pin is a real lever with a real price, and the price is measurable.

### 3.2 The leading is the second free lever (`readings/G-leading-*.json`)

With the `lh` pull (flow cost 0.00–0.02px at every leading), the first well back at 0.35rem, dock
390×844, both engines:

| tape leading | paper h | tape ∩ tab head | ink fits its paper by |
|---|---|---|---|
| 1.2 (as built) | 35.43 | **−6.76** | 12.77 |
| 1.1 | 32.83 | −4.17 | 10.18 |
| 1.05 | 31.54 | −2.87 | 8.88 |
| 1.0 | 30.26 | −1.59 | 7.60 |
| 0.95 | 28.96 | −0.29 | 6.30 |
| **0.9** | **27.66** | **+1.00 / +1.02** | 5.01 |

At the iPad the same arms read panel **1258.47 / 1258.34** for every leading with the first well
at 0.35rem — i.e. the leading is free vertically in the card (the tape's flow is zero) and buys
the dock's clearance outright. `new game`'s own ink is 22.02px tall, so even at leading 0.9 the
paper still clears the glyphs by 5.0px: a tape that HUGS its word is a washi tape, not a defect.

**The synthesizer's real choice is therefore about the CAPTIONS, not the tapes**: 1258.47 is
30.97 over the seal, and 31.25 is what the two printed captions cost.

---

## 4. The INK gate (row 4), with its clearance (`readings/D-ink-390x844-*.json`)

Measured from font metrics (`canvas.measureText` in the node's own computed font) rather than
from a bitmap — cheap, engine-portable, no screenshot, and it can ask a question a crop cannot:

| pair (dock 390×844) | chromium | webkit |
|---|---|---|
| `checking` tape ∩ `candidates` caption, BOX | 416.1px² | 414.6px² |
| tape paper top − caption's OWN ink bottom | **+3.13** | **+3.12** |
| tape paper top − a worst-case descender's ink bottom (`pgjqy`) | **−2.88** | **−2.88** |
| the caption's half-leading at 25.89/1.2 | **−0.47** (Fraunces' own box overflows the line box by 0.94px) | −0.47 |

So: nothing is covered today and `candidates` survives because it has no descender — and the
lane holds **3.12px**, against a **6.34px** descender the same face would draw. The gate to
write is an INK gate with both arms: the rendered word (GREEN, 3.12) and the lane's worst case
(RED, −2.88). Pass 1's pixel test read 6.00/5.33px of clearance for the same pair; that number
measures the paper against the caption's PAINTED rows at dpr 3, mine measures it against the
font's ink box. Prefer the metric form and cite the difference.

---

## 5. Surfaces, tokens, file:line — what this family actually touches

| site | HEAD | the law | shared? |
|---|---|---|---|
| `.section-heading` | `typography.css:366-374` — `--font-display`, `--type-group-title`, 800, lowercase | reads `--face-printed` / `--printed-weight` | YES → `StagingBand.vue:140,154` (pinned back at `:315`) |
| `.washi-tag` | `SheetWashiLabel.vue:164-181` — hand, `--type-tag`, 500, `line-height: 1.5`, pull `-1.5em` | printed rung + weight; pull from `1lh` | YES → `StagingBand.vue:130` (**not** pinned back) |
| `.zone-row-label` | `GameControlPanel.vue:1608-1618` — hand, `--type-tag`, 1.1, `--ink-press-quiet` | printed + `--printed-ink` | no |
| `.ctrl-btn` | `OptionSelector.vue:105` — `"Fira Code", monospace` LITERAL | `--face-written` 400 lowercase | YES → `StagingBand.vue:143,158` (size/padding pinned, face **not**) |
| `.heading-value` | `GameControlPanel.vue:2404-2413` (node `:809`) | lowercase + layered quiet ink | no |
| `.is-active` underline | `GameControlPanel.vue:2414-2418` | dies | no |
| hover lift | `GameControlPanel.vue:2444-2446` | fenced to `[aria-expanded="false"]` | no |
| chip marks | `OptionSelector.vue:52,56,74,81,125,130` (`rounded-md`, `font-bold`, `--scribble-width`/`--ghost-width` in `ch`) | `.ctrl-word` span, `background-size: 120%` | the span reaches the gallery chips too |
| the tape's lane | `GameControlPanel.vue:1484-1516` (`--washi-tag-lift: 3px`, `--gap: 0.1rem`, `--inset: 0.35rem`, `--top: calc(0.15rem − --card-pad-t)`, `:first-child { margin-top: 0.35rem }`) | the family's ONE geometry | — |
| ladder | `typography.css:55` `--type-leading-heading: 1.2` · `:36-37` `--type-subheading: 1.272rem` / `--type-heading: 1.618rem` · `:124` `--type-group-title` · `:139-168` the option arms | one right-hand side each | — |

Gates and instruments this family must move: `e2e/access.spec.ts:439` (`CONTRAST_TARGETS`, today
`.icon-sublabel` + `.ctrl-btn` under `CARD = ".controls-card"` at `:228`, floor 4.5 at `:542-546`),
`e2e/visual-regression.spec.ts:821` (the seal), `e2e/font-census.spec.ts:47-110` (the ledger; the
backward arm at `:291` is what proves no row went stale), `e2e/zone-grammar.spec.ts:676-700`
(the `:text-is()` re-aim), `scripts/check-font-coverage.mjs:641-718` (CHECK 6 / `FACE_SITES`),
`e2e/visual-golden.spec.ts` (four goldens — logo, toggle crest, a given cell, the grid corner:
**none of them sees the controls card or the gallery**, so π there is defended by geometry, not
by a bitmap).

---

## 6. Primitives to reuse, by name

1. **Consumer-scoped deep styling** — `GameControlPanel.vue:1523` already reaches the tape at
   `.tray-well :deep(.washi-tag) { z-index: 35 }`. Compiled that is `.tray-well[data-v-x]
   .washi-tag` (0,3,0), which beats `SheetWashiLabel`'s own `.washi-tag[data-v-y]` (0,2,0)
   deterministically — no source-order luck. The face law's `.washi-tag` block moves there
   verbatim and the gallery is restored by construction. The alternative — a `face="printed"`
   prop on `SheetWashiLabel` minting `.washi-printed` — costs an API surface and a unit test but
   makes the gallery's choice EXPLICIT in `StagingBand`'s template instead of an ancestor
   accident. Both were measured identical in geometry; the choice is ownership, not pixels.
2. **The `lh` unit** — `calc(-1lh - 0.04rem - var(--washi-tag-lift, 0px))`. Kills
   `--washi-tag-lh` and its masked `, 1.5` fallback outright: nothing to set on any consumer,
   correct under `line-height: normal`, inside the declared support floor.
3. **`canvas.measureText` in the node's computed font** — `actualBoundingBoxDescent` /
   `fontBoundingBox*` give the INK gate its clearance and its worst case with no bitmap, no dpr,
   no golden. Already proven in `probe/r2-face.spec.ts` §D.
4. **In-page ablation for pricing** — the estate's own idiom (`visual-regression.spec.ts:860-870`
   negative control; the T6 and mark-13 seal re-prices are ablation tables in the test's comment).
   Every number in §3 came from it.
5. **`shared-class-census.mjs`** (banked here) — the one-grep gate the charter asks for, at the
   grain that can see the defect: a component's render consumers and the prop values at each
   call site. It finds `SheetWashiLabel` → 3 consumers / 16 tags / 5 `anchor="tag"`, and
   `OptionSelector` → 2 consumers.
6. **`--ring-ink`** (`color-mix(in srgb, var(--color-foreground) 50%, transparent)`, CTRL-RULE
   pass 1; painted median 3.53 light / 4.364 dark) — CONSUMED, never minted (chair §6.1). The
   chips are the reason it exists (WebKit's UA ring reads 2.147:1 on them) and `.ctrl-btn` is a
   site this family re-faces, so the chip's `:focus-visible` ring is this family's to spend.
   R6 law 39 is the form ledger: `2px dashed currentColor` offset 3 (tab) / `2px solid` offset 4
   (ribbon face).
7. **CTRL-TABS's ONE DIMMING law** — one dimming, never two: the ground holds at opacity 1 and
   the word takes the quiet rung, or the ground dims and the word stays foreground (both at once
   measured 2.75:1). It binds the shut tab head and the shut value word, which is exactly where
   this family puts `--ink-press-quiet` (5.23 light / 6.06 dark) under a `--sheet-washi-neutral`
   tape.
8. **`e2e/access.spec.ts`'s own composite resolver** (`:441-530`) — the analytic reader; adding
   the four sites is four strings, and the floor at `:542` stays 4.5 (all four measured ≥ 4.659
   in pass 1, so the stricter floor costs nothing and the comment at `:540-541` needs re-wording
   because the printed names ARE large text).

---

## 7. Sketches

```
 A · WHERE THE LAW STOPS (the scope, drawn)

   BOARD  .tray-well ────────────────┐        GALLERY  .staging-band ───────────┐
   ┌╌ new game ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐ │        ┌╌ new game ╌┐  ← Patrick Hand 14  │
   │ PRINTED · Fraunces 25.89/800  │ │        │ 500 · tape unmoved, 64.00×19.63 │
   │ pull = -1lh, flow cost 0.00   │ │        └╌╌╌╌╌╌╌╌╌╌╌╌┘                     │
   │   size      level             │ │          size   [4×4][9×9][16×16]         │
   │   4×4  9×9  16×16  ← written  │ │          level  [easy][medium][hard]      │
   └───────────────────────────────┘ │        the chips: pinned rung, UNPINNED face
                                     │        → 134.03 vs 167.96 today. Declare it
   the law lives at `.tray-well .washi-tag`   or pin the face back at `:289`.
   and `.tray-well .ctrl-btn`, never at the
   component's own class.
```

```
 B · THE BILL AT 1280×800 COARSE (seal 1227.5)

  1276.75 ██████████████████████████████████████████  as built      +49.25
  1258.34 ████████████████████████████████████░░░░░░  first well ─18.41 (free: pin or leading)
  1227.09 ███████████████████████████░░░░░░░░░░░░░░░  + captions ─31.25  → under by 0.41
          └────────────────────────────┴─────────────
                                        the two terms. There is no third.
          the four tapes ────────────── 0.00px. The tape is not the bill.
```

```
 C · THE INK GATE (dock 390×844, the `checking` tape over `candidates`)

   ╭──────────── candidates ─────────────╮   line box 31.07, half-leading −0.47
   │ c a n d i d a t e s                 │   own ink bottom ────────── +3.13 clear
   │ p g j q y  ← a descender would sit  │   worst ink bottom ──────── −2.88 TOUCHED
   ╰─────────────────────────────────────╯
   ▓▓▓▓▓▓▓▓ checking ▓▓▓▓▓▓▓  ← the tape's paper starts here (416.1px² of BOX)

   the gate reads INK, not boxes, and carries both arms.
```

---

## 8. Risks the synthesizer must price

1. **The seal has no cheap door.** Under it costs the caption's printed rung (31.25) plus the
   first well (18.41) and clears by 0.41px. Re-pricing it is legitimate and has a two-fold
   precedent IN THE TEST (`visual-regression.spec.ts:800-820`: T6 re-priced P1's 1098.25 and
   mark 13 re-priced it again, each with an ablation table naming every term) — but a third
   re-price on a design's say-so, with no feature bought, is the "regression wearing a fix's
   name" the same comment warns about. If pass 2 re-prices, the row must name the face law as
   the purchase and carry §3's table.
2. **The pin lever trades flow for clip.** −0.6rem buys the exact as-built clearance for free and
   puts 7.38px of a pinned tape above the case edge of a scrollport. Anything that spends it
   must re-read the §2.3 residue-clip cure at `GameControlPanel.vue:1487-1499` and re-cut the
   fade sentinel with it (`scene.css`, cited at both ends).
3. **A leading under 1.0 is a design claim, not a repair.** Free in flow, but a tape that hugs
   its word changes what the tape LOOKS like — and the tape is the one asymmetry in a card of
   centred stanzas (`SheetWashiLabel.vue:135-140`). U-10 territory; bank the frame.
4. **Scoping weakens CHECK 6 unless CHECK 6 learns the scope.** A rule at `.tray-well
   :deep(.washi-tag)` still satisfies `FACE_SITES[".washi-tag"]` (the gate's selector test
   matches the compound), so the gate would pass while the gallery's tape paints another face.
   The fix is a second entry, not a stricter regex: `".staging-band .washi-tag": "Patrick Hand"`
   and `".staging-axis .ctrl-btn": "Patrick Hand"` — the shared-class discipline made
   machine-checkable at the site. Row 6's first-token rule (`--face-*` only, `--font-display`
   retired as a second home) is four lines at `scripts/check-font-coverage.mjs:706-712`.
5. **A gallery cell in the VOICE census would be red at HEAD for reasons this family does not
   own.** Measured at `?view=gallery`: the staging tape (Patrick Hand 14/500) and the two axis
   labels (Patrick Hand 16/800) are already two voices at HEAD. Make the gallery cell a **π
   cell** — face, rung, weight and box identical to HEAD for the tape, the two axis labels and
   the chips — not a one-voice cell. That is the gate that would have caught pass 1, and it is
   green the moment the law is scoped.
6. **The font bill is bigger than the spec said and partly recoverable.** +260 B Fraunces
   +584 B Patrick Hand = +844 B (self-hosted 22,572 → 23,416). After the law, Fira Code's
   subset (3,624 B, `index.css:77-84`, unicode-range carrying `1 4 5 6 7 9 E H M`) keeps a
   repertoire only the byline and the mono registers still render — a declared departure, or a
   re-cut that hands bytes back. Price it either way, in the same commit as the CSS.
7. **Two estate numbers go stale on the gallery** (`StagingBand.vue:268-289`'s 38.4px reserve
   claim and the `--staging-label-col` derivation). Neither breaks — the row shrinks and nothing
   overflows at either cell in either engine — but a comment that states a measured fact which
   is no longer the measurement is the estate's own disease class.
8. **The chip's −1px at 900×500** is the declared 22 → 20 rung (`typography.css:139-168`, the
   768–1023 arm) landing on a ±0.5px gate; the gate must name the re-cut or it reads as drift.
   The card's own height is re-priced here: dock 699 → **689** built → **677** with the first
   well returned; 900×500 743 → **751** → **739**; the spec's ~646 was always stale.
9. **Goldens are local instruments** (O-12: CI is sixteen browserless lanes), so a new golden
   costs nothing in CI and defends nothing in it either. `playwright-golden.config.ts:107-109`
   takes `PLAYWRIGHT_BASE_URL`, so the dist run is `vite preview` on the lane's port; the four
   existing goldens see neither the card nor the gallery, which is why §1's numbers — not a
   bitmap — are the π defence on both surfaces.

---

## Files

```
probe/vite.lane.config.mts      the estate's vite config + a private cacheDir (the lane law)
probe/pw.config.ts              scratch playwright config (no webServer, no globalSetup, :4234)
probe/r2-face.spec.ts           A the lh unit · B the gallery's four arms · C the iPad price menu · D the ink gate
probe/r2-flow.spec.ts           E the tape's TRUE flow cost, per consumer (display:none delta)
probe/r2-pin.spec.ts            F the first well vs the sticky pin, swept at three mobile cells
probe/r2-leading.spec.ts        G the tape's leading swept ×6 with the lh pull, dock + iPad
probe/r2-staging-chips.spec.ts  H the second shared class: the gallery's staging chips
probe/shared-class-census.mjs   the one-grep gate — a component's render consumers and their props
readings/                       every number above, JSON per cell per engine, + the census text
```

Run: serve the worktree at `127.0.0.1:4234` with the private `cacheDir`, then
`PLAYWRIGHT_BASE_URL=http://127.0.0.1:4234 CTRL_FACE_OUT=<readings> npx playwright test
--config=probe/pw.config.ts`. The server is killed; the port is free.
