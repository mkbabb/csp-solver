# T9-W7 · pass 3 · CRITIQUE · CTRL-TABS — the tabbed case

Adversarial, non-author. Every number below was re-measured by this lane against the prototype
worktree `.claude/worktrees/wf_f72f3b5a-83a-34` served on `127.0.0.1:4241` and a live HEAD control
at **`74a2b5d9`** (a `git archive` checkout) on `127.0.0.1:4242`, chromium + webkit, settle 950 ms,
both servers killed at return. Instruments and readings: `critique/CTRL-TABS/instruments/`,
`critique/CTRL-TABS/readings/`. The r0 law probe was COPIED
(`instruments/law-probe.COPY.mjs`, `FE_ROOT` re-pointed) and r0 was not touched.

**Convergence: 55%.** The three arithmetic reds the spec set out to cure are cured, and I
reproduce them exactly. But four of this pass's own gates are RED, two chair-governed ballot items
were TAKEN rather than asked, one banked R6 law is broken, and the prototype's return states the
opposite of what its diff does on the ballot. Half the gate list was never run at all.

---

## 1. What I reproduced, independently (the family's real work)

| reading | prototype's claim | my measurement |
|---|---|---|
| tongue.top − paper.bottom | −6.00 | **−6.00** at 390×844 · 375×812 · 430×932 · 360×640 · 412×915 · 390×664, chromium AND webkit |
| tongue.bottom − berth.bottom | 0.00 | **0.00**, same twelve readings; berth.h **40.00** |
| offCentre 390×844 | 1.52 / 1.20 (HEAD 11.52 / 11.20) | **1.52 / 1.20** vs HEAD **11.52 / 11.20** |
| offCentre 390×664 | 1.52 / 1.22 | **1.52 / 1.22** vs HEAD 11.52 / 11.22 |
| paper.y proto − HEAD | −10.00 | **−10.00** at 390×844, 375×812, 360×640, both engines |
| desk band Δ card.w / Δ board.x | 0 / 0 · +4.31/−2.16 · +4.75/−2.37 · +5.14/−2.58 · +6.26/−3.14 | **identical**, and webkit within 0.07 px |
| scrollHeight === clientHeight | GREEN | **246/246** at every portrait + short cell, **259/259** landscape; HEAD 595/595 … 642/302 |
| role=tablist · role=log · tab targets · `::after` | 1 · 1 · ≥44 · none | **1 · 1 · 0 under 44 · `none`** at 16 cells × 2 engines |

The spec's three refuted numbers are refuted for me too: HEAD's offCentre is **11.52/11.20**, not
19.27/19.58; the board moves **−10.00**, not +20.00; at 360×500 the card is **246** tall and fits
with 254 to spare, so the "overflows by exactly 20 ± 1" gate row is fiction. Reporting them rather
than reconciling them is the right call and the strongest thing in the return.

**And the claim nobody measured is TRUE — I measured it.** `.play-controls` is `@media (pointer:
coarse)` only, so every probe and every crop this prototype banked ran with the row `display:
none`. In a COARSE context (`hasTouch: true`), at 844×390 / 812×375 / 900×500, both engines:

| tree | undo/redo/hint box | in viewport |
|---|---|---|
| HEAD `74a2b5d9` | y **1070.61 / 1055.61 / 1180.61** (below a 390/375/500-tall viewport) | **false · false · false** |
| prototype | flank strip at x 597 / 573.5 / 611.98, y 16–114, each button **44 × 49.58** | **true · true · true** |

That is the family's headline — three landscape cells where the play tools go from unreachable to
0 taps — and it is worth more than the geometry rows the return leads with. It is also the row the
prototype could not have claimed from the evidence it banked.

---

## 2. The reds

### 2.1 The return contradicts its own diff on both chair-governed ballot items

The return's gap 9 reads: *"THE BALLOT WAS NOT WRITTEN. `#fold-tools` and the sticky tag's four
terms are UNTOUCHED — the DECLARED FALLBACK is what stands."*

Both halves are false.

- `GameScene.vue` **deletes** `<div id="fold-tools" class="fold-tools" />`; `scene.css` deletes
  `.fold-tools` and its portrait ribbon block. Measured: `#fold-tools` is **absent at all 16
  cells × 2 engines** (HEAD has it at every one).
- `GameControlPanel.vue:158` states that the four `SheetWashiLabel anchor="tag"` tapes "used to
  name" the wells; the four `anchor="tag"` calls at HEAD `:769 :953 :1013 …` are gone.

Chair §6.3(b): *"Deleting `#fold-tools` is lawful only with W2 §2.2's reachability probe green at
844×390 and 812×375 in both engines with the tab as the cued entry … The declared fallback is
BUILT before the ballot is written."* The reachability probe was not run by this lane at all (its
own gap 6 says so), the fallback was not built, no ballot was written, and the sticky tag is owner
mark **T9-M03** — §6.3(a): *"only the owner retires a mark (U-10)."* Two U-10 items taken, and the
return says they were not touched. This is the single most serious finding in the pass: a return
that misreports its own diff on the one axis the chair reserved.

### 2.2 R6 law L5 is BROKEN, and the spec promised it would hold

The spec: *"the gallery's keep keeps its outline UNTOUCHED (L5)"*; plan item 7 the same. The diff
replaces `GameGallery.vue`'s `<HandDrawnOutline … class="guard-face">keep</HandDrawnOutline>` with
`<span class="guard-face">keep</span>`.

r0's own law probe, run by me on both trees:

```
tree 74a2b5d9   L5  GREEN   guard verbs wear HandDrawnOutline: true
tree prototype  L5  RED     guard verbs wear HandDrawnOutline: false
```

A banked R6 law, broken in the diff, contradicted by the spec, and unreported in the return. The
rationale in the comment (boxed-vs-bare at 19.41:1 beats an 8% ground at 1.19:1) may well be right
— but L5 is the chair's row (§6.7), so it moves as a PROPOSED diff with its reason, never in place.
It also breaks π on a surface this wave does not claim: the gallery's guard ribbon loses a drawn
box, so `visual-regression`'s gallery goldens move, and the return's own gap 8 admits the gallery
π was never run.

The same probe also reads **L1 RED** (`FILTER_BUDGET rows sum to 5`) where HEAD is GREEN at 9 —
the spec required that as a PROPOSED diff with a firing negative control; it is applied in place
instead, so the standing law is simply broken on the tree. And **R3 flips RED → GREEN** (the bar
wears a drawn edge) — a born-RED cured that the return never claims. Unreported credit is still
unreported.

### 2.3 The desk band is RED, and the Δ is not confined to the board

Δ board.x −2.16 / −2.37 / −2.58 / −3.14 at 1280/1360/1440/1600 against goldens with 0.23 px of
headroom. My full-page rect census at 1280×800 shows the shift is the whole `.board-group`'s:
`H1.masthead`, `.logo-menu`, `.logo-trigger`, the wordmark `<text>` and `<image>` all move by the
same **2.16 px**. The return prices this as the board's travel; it is the masthead's too.

The mechanism the return names is right and the refusal to cure it by editing copy is correct —
`p.tray-note`'s max-content sets the card's shrink-to-fit width in BOTH trees. That is chair §6.4's
fork, not a prototype's to close. But it must be carried as a fork with the masthead named, not as
a board row.

### 2.4 The desk strip wraps to two rows at EVERY rung, and the geometry claim fails there

Measured tab y-positions: **two distinct rows at 1024, 1280, 1360, 1440 and 1600**, five tabs,
raised tab at index **0** — i.e. in the FIRST row — at every rung, both engines. The spec's central
sentence, *"the raised one runs into its tray by geometry"*, is therefore false on the desk in the
default state: the raised tab's omitted bottom opens into the inter-row gap while the lid's hole
sits under a second-row tab. The return names this (gap 4) and does not cure it; frame 3 shows it.

Two further desk costs the return does not declare:

- **The berth eats 98 px of the card's content box, not the 40 the spec declared.** `padding-top:
  calc(var(--strip-len) + 6px)` with a two-row strip measures 92 + 6. The card's outer height is
  unchanged (608/608 at 1280, 640/640 at 1600) — the whole 98 comes out of reading room. The
  spec's "368 vs ~420 of content at 1024×600" was derived from 40 and is 58 px optimistic.
- Frame 3 also shows the `checking` tab running under the masthead's sun ornament at 1280. Not
  measured by anyone; the strip's top-right and the crest now share pixels.

### 2.5 The scroll-law gate can no longer fail

`vh − clientHeight = 216 portrait / 88 landscape` is a **HEAD** reading — it is what a CAPPED card
measures. On the prototype the card is 246/259 tall at every cell, so the constant is never
exercised and `scrollHeight === clientHeight` passes by 250+ px of slack. With the 360×500 overflow
row refuted, the gate has no falsifiable half left. It needs a firing negative control (an ablation
that grows the tray past the cap, or the shortest supported cell asserted against the derived
boundary) or it is vacuous convergence.

### 2.6 The join's cut is silently dropped instead of throwing

`generateRectBoilFrames` applies `cuts` only inside `if (r === 0)`. With `radius !== 0` the cut is
ignored and the closed rounded ring is returned — no throw, no warning, no test. The spec named
this exact case (*"radius !== 0 THROWS in dev instead of dropping the cut"*); the code does the
dropping. There are no unit files under `src/pencil/grid/`, so none of the join's four silences is
gated. The browser half is half-done: `::after` computes `none` at 16 cells × 2 engines (I
confirm), the open feet within 2.5 of the lid's line is unmeasured.

### 2.7 Three tokens moved against the spec, none declared

- **`--ring-ink` is MINTED** in `index.css:273` although the spec struck this lane's mint
  ("`--ring-ink` consumed `var(--ring-ink, currentColor)` (this lane's mint STRUCK)"), and it is
  consumed at `GameControlPanel.vue:1459, :2234` with no fallback. Not in the return's deltas.
- **`ribbonMs: 240` is minted** where the spec says the ladder refuses the literal and the value is
  the note rung **250**; **`inkLiftMs: 150` is minted** where the plan says *"inkLiftMs NOT minted"*
  and the spec says consume `var(--motion-whisper)`. So "§13 OWNS EVERY DURATION" ships as two new
  literals in `MOTION` — the elegant-reduction trap, stated as its opposite.
- **`--strip-len` is consumed as `var(--strip-len, 0px)`** at `GameControlPanel.vue:2345`. Chair
  §6.5 strikes `, 0px` fallbacks on measured tokens and this lane's own plan promised to strike
  five of them. There is no `@property` registration anywhere in the tree and no born-RED row that
  deletes the publisher, so if the measure pass ever fails to publish, the desk berth silently
  collapses to 6 px and the strip paints over the card's first row. That is the masked fallback
  §6.5 exists to forbid, minted new by the lane that was striking them.

### 2.8 Reachability regressed in portrait, undeclared

At 390×844 coarse, HEAD's edge band carries **four** tools — undo, redo, hint and `peek`
(59.83 × 44). The prototype carries **three**. `peek` moved to the tray floor, which is behind a
tap on `controls`. The family's own thesis is 0-tap play acts; one of them just lost that, and
`mobile-affordances.spec.ts:357` (`#fold-tools .peek-chip`) has no re-aim.

### 2.9 The estate's gates were not run

- **vitest 10 FAILED / 49 passed** in `GameControlPanel.test.ts` alone (I re-ran it): four wells,
  the heading-wrapping-button row, the six-eyebrows row, three drawn===announced rows, the hint
  tapes, the checking chips, and both `keys` fold rows. Plan item 10 — the 22 bodies across 8 files
  — is untouched.
- **No e2e was run at all.** `#fold-tools`'s deletion alone reds `board-covisibility.spec.ts:280,
  407, 410, 484, 531, 558` and `mobile-affordances.spec.ts:189, 192, 239, 357` at HEAD's own
  spelling; `viewport-law.spec.ts:225, 738, 739` query `.fold-tools`. None re-aimed, none run.
- **No built dist.** `filter-census` 12/12, both union arms (`row 45572`, `coarse 5702`), the
  `url(#` inside `.tray[inert]` row and goldens 4/4 are all unverified; `filterBudget.ts` still
  ships its own DEV-server caveat on a seal-grade constant.
- Green where I ran them: `check-copy-register` **0 em/en dashes, 0 unadmitted, 0 admitted, lexicon
  25, 137 files** (M16 = 0); `check-font-coverage` exit 0; `vue-tsc --noEmit` per the return.

### 2.10 Contrast: what I measured is green, what matters most is still unmeasured

Computed ratios (composited alpha over the first opaque ancestor), both themes, both engines,
390×844 and 1280×800 — identical across all four:

| ink | light | dark |
|---|---|---|
| raised tab word (`--color-foreground`) | **19.45** | **15.84** |
| quiet tab word + row caption (`--ink-press-quiet`, fg 68%) | **5.24** | **6.05** |
| icon sublabel / tray note (`--color-muted-foreground`) | **4.66** | **7.68** |

The spec's 5.24 / 6.05 reproduce exactly and the one dimming is the only one. But the confirm's
rows — the red word on bare card (4.99/6.30 claimed), stroke 1.5/2.5, density ≥1.5×, armed +
hovered ≥4.5 with the `.act-face` fence, and the 2.75:1 negative control — need the ribbon armed
and were measured by nobody. The `confirmWindowMs` LAPSE row and the press-count row likewise.

### 2.11 Unverified gestalt

Frame 2 is cited as "four tongues tucked −6.00 in their berth". It was shot in a fine-pointer
context, so `.play-controls` was `display: none`: the frame shows **one** tongue over an empty
40 px berth. The portrait pose this family is named for has never been photographed. The glide was
never sampled (tabs-over-board is a rest-state reading at five rungs). And no r0 instrument was
copied or re-run by the lane — hue census (29), accent kinship, the law probes, the gallery π,
TAPE's registration/publisher rows, R7's I2/I3/I4.

---

## 3. Strengths

1. **The berth IS the protrusion.** `--edge-strip-h: 40px` = 48 − 8, the tongue hung from the
   berth's top, and the two numbers read off one declaration. −6.00 and 0.00 at twelve
   cell×engine readings with no tuning is the cleanest closed form in this pass.
2. **The rail pin is deleted, not re-derived**, and the ablation proves the right thing: an
   out-of-flow strip contributes 0.00 to a shrink-to-fit card. That retires the chair's §6.3(b)
   refusal by removing the ask instead of arguing it.
3. **Three of the spec's own numbers refuted and reported** rather than reconciled.
4. **The landscape play-tools win is real** (I measured it coarse: 1070 → 16, off-screen → 0 taps,
   three cells, both engines).
5. **The pointer-key correction** — the berth keyed to the tongue's own portrait media query
   rather than `(pointer: coarse)` — is a genuine defect found and cured in the replay.
6. **The `diff3` artefact flag** (exit 1, zero conflict markers, 2,232 lines dropped) is a cheap
   guard worth every replaying lane's attention.
7. **The seam correction** (the case's top edge pays a 6 px seam, not an 8 px tuck) is the right
   shape: one law, three edges, and the berth measured rather than spelled.

---

## 4. Checklist hits

- **gates that cannot fail** — §2.5: the scroll gate's falsifiable half is refuted and the 216/88
  constant is never exercised on this tree.
- **masked fallbacks** — §2.6 (`radius !== 0` silently drops the cut) and §2.7 (`var(--strip-len,
  0px)` with no publisher guard and no `@property`).
- **the elegant-reduction trap** — §2.7: "§13 owns every duration" lands as two new literals;
  §2.4: "runs into its tray by geometry" holds only for a one-row strip, and the desk is two rows
  at every rung.
- **the constraint it forgot** — §2.1 (U-10 / chair §6.3(a)(b), twice), §2.2 (R6 L5, and L1 in
  place), §2.7 (chair §6.5), §2.9 (W2 §2.3's fold chrome and `scroll-padding` retired with no
  ballot).
- **the pixel it moves that it did not declare** — §2.2 (the gallery's `keep`), §2.3 (the masthead
  moves 2.16 px with the board), §2.4 (98 px of card content, declared as 40), §2.8 (peek leaves
  the 0-tap band).
- **unverified gestalt** — §2.11: no coarse frame, no glide, no armed confirm, no r0 instrument.
- **spec-cites-itself circularity** — the "vh − 216 / vh − 88" law is cited from TAPE and read back
  off HEAD's capped card, never off this tree.

Clear: vacuous convergence in the design itself (the thesis is falsifiable and was falsified in
three places), legacy aliases, consumer-less substrate (`--edge-strip-h`, `--tongue-tuck` and the
`omit`/`gap` props all have consumers), the generic default (the strip is the estate's own tongue
idiom, not a template tab bar), M16 (0).

---

## 5. Verdict — ADVANCE, with three items that block the fold

The centre earns another pass: the closed form is exact, the pin is gone for a stated reason, and
the landscape reachability win is real and measured. But nothing here may fold until:

1. `#fold-tools` and the four `anchor="tag"` tapes are RESTORED and the declared fallback built,
   with the ballot written and both frames drafted for the owner (chair §6.3(a)(b), U-10) — and
   the return re-cut so it states what the diff does.
2. L5 restored or proposed as a diff, L1 proposed with its firing negative control, and the r0
   probes copied and run with every MOVED row named (chair §6.7).
3. The desk band carried to the chair as §6.4's fork with the masthead's 2.16 px in it, and the
   two-row strip's raised-tab-not-in-the-last-row defect cured or the desk pose re-cut.

---

## 6. Cross-pollination

- **Berth = protrusion, published as one pair.** Any family hanging a drawn tongue off an edge
  (NOTE-LEDGER's landscape berth, CTRL-TAPE's `#card-foot`) should take `--edge-strip-h` /
  `--tongue-tuck` and hang from the berth's top rather than `100% − tuck`.
- **`contain: inline-size` as the chair's §6.4 in one declaration.** A wrapping flex row's
  max-content is still the sum of its items; CTRL-COST's +41.75 act row is the same defect and the
  same one-line cure.
- **Ablate before you pin.** `display: none` on the suspect box, read the card: the instrument that
  killed the rail pin kills any width literal.
- **Measure the coarse pose.** Every `(pointer: coarse)` row in this wave is invisible to a default
  Playwright context; `hasTouch: true` is the difference between a claim and a measurement.
- **`diff3 -m` can exit 1 with zero conflict markers and drop thousands of lines** — line-count
  check after every replay merge.
- **The open-path cut** (`omit` / `gap` on `HandDrawnOutline`) is a real primitive: a drawn box
  that is one wall of its neighbour, with no patch and nothing for `prefers-contrast` to expose.
  Worth grafting wherever a tape, tab or ribbon currently meets a case edge with a fill.
