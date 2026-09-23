# critique:G-BAR — T9-M18 "This needs to have a border in some way"

Adversarial critic (Opus), not the author of the design or the prototype. The mark stays the
owner's (U-10); nothing here retires it.

- **Under review:** prototype worktree `.claude/worktrees/wf_3b66f064-970-21` (HEAD `b9ba5c42`,
  docs-only over `1e6cfbbf`), uncommitted diff over 8 files plus `e2e/tool-strip.spec.ts`; its
  README, `prototype.diff` and four crops; the adjudication `adjudicate/G-BAR.md`.
- **My re-runs:** I built both dists myself (proto from the worktree, HEAD control from main, both
  `vite build` into my scratchpad with a private cacheDir in a `.mts` outside the tree) and served
  them on 127.0.0.1:4259 / 4260 `--strictPort`. Listener PIDs 22198 / 22196 and npx 22145 / 22144
  were killed by PID; 3001 was left alone and 4230–4249 were never touched. I wrote two independent
  instruments rather than re-running the author's `gbar.mjs`, so none of its code is reused. One
  encoded `?board=` payload, DPR 2, chromium + webkit, light + dark. Load average 7–13.
- **Verdict: ADVANCE at 72 %.** The form survives my independent re-measurement. It isn't
  converged: the gates are weaker than the README says, three deltas are undeclared or
  under-declared, the `i` is left naked, and the phone floor has zero headroom.

## 1 · Re-measured (numbers first)

**R1 · G7 π identity + named deltas** (`crit.mjs`; card / board / masthead / strip rects,
proto − HEAD):

| cell | chromium | webkit |
|---|---|---|
| 1280×800 fine, both themes | card 0/0/0 (h, y, w), board 0/0, logo 0, strip 0 | same, all 0 |
| 1024×768 fine, both themes | all 0 | all 0 |
| 390×844 coarse, settled | card 0, board 0, logo 0; strip −4 | same |
| 430×932 coarse, settled | **card h +12, y −12**; board 0, logo 0; strip −4 | same |
| 844×390 coarse | card 0, board 0; strip +8 in flow; **scrollport client 302 → 296 (−6); scroll range 441 → 459 (+18)** | same |

This reproduces the author's rail identity and the corrected 430 delta (+12, not the
adjudication's +4). It also finds a landscape delta the README does not name: the empty foot's
0.375rem pad now sits outside the scrollport. The window shrinks by 6 css and the range grows by
18, not "+12 of flow".

**R2 · G2 leak, swept over the WHOLE scroll range rather than one pose.** Wells' outlines shown
vs hidden; 7 px flanks beside the frame, clamped to the card, over the frame's height + 2 px
above:

| cell | proto: non-zero poses | HEAD: non-zero poses (worst flank px²) |
|---|---|---|
| 1280×800 fine | 0/39 both engines, both themes | 38/39 (137.5 / 135.75 chromium; 136.5 / 137.25 webkit) |
| 1024×768 fine | 0/39 | 38/38 (≈135 / 134) |
| 390×844 coarse | 0/11 | 8–9/9 (≈127–131) |
| 844×390 coarse | 0/12 | 0/11 (the bar is in flow and nothing runs beside it) |

G2 is earned on every scrolling cell, at every pose and not only m18's.

**R3 · G5 lowest lip ink above the viewport bottom at scroll end** (lip shown vs hidden):

| cell | chromium | webkit |
|---|---|---|
| 390×844 | 3.0 | 2.5–3.0 |
| 430×932 | 2.5 | **2.0 (both themes)** |

HEAD's bar sits 5.84–6.02 above the bottom. This reproduces the author's numbers, including
WebKit 430 on the 2.0 floor itself.

**R4 · the 94 px blank-scroll cure** (`.legend-fold { contain: layout }`). Blank at scroll end
(the scrollport bottom minus the last well's stroke) is 3.9–4.5 css on proto in both engines, at
every rail and dock cell. The cure holds in WebKit as well.

**R5 · the `i`, the notes and the crib** (`crit2.mjs`, 1280×800 fine):

- **The `i`'s painted ink:** proto 72–79 device px, HEAD 475–655 (glyph + ring). Glyph contrast
  is the same on both arms: 5.16–5.24 light, 5.96–6.07 dark.
- **Verb notes:** each note's top is **2.4–3.8 css ABOVE the lip svg's bottom edge**, both
  engines. On HEAD they sat 0.2–1.57 below the bar. The notes now overlap the band where the lip's
  bottom stroke is drawn. They cover 0 of the verbs' row, and the tallest note keeps 4.35 css
  inside the card.
- **Crib opened at rest:** the crib bottom lands 101.7 / 105.6 below the scrollport's clip edge on
  proto. On HEAD it lands under the sticky bar (bottom 101.7 / 105.6 below the bar's top). Neither
  arm shows it: the same M16 miss (G-INFO's).

**R6 · mechanical:**

- `grep 'action-bar-h|card-pad-b' src` returns 0.
- `env(safe-area-inset-bottom)` appears once in `scene.css`.
- `check-copy-register` bare: 0 / 0.

All three reproduce. I didn't re-run lint:motion, vue-tsc, vitest or filter-census.

## 2 · What is earned

- The form: a lip in the wells' pen, in `#card-foot`, outside the scrollport. It removes the
  leak by construction (R2) and doesn't move the card or the board at any rail rung (R1).
- The fade hung from the foot (`.card-foot::before`) is better than the brief's sticky
  `.card-body::after`. It spans the padding box without per-regime margins, and R2 proves it.
- G10 (static 2rem `scroll-padding-bottom`) and the HEAD RED behind it: HEAD's `--action-bar-h`
  never priced the fade. Credible, but I didn't re-run it.
- The `contain: layout` defect was found and cured, and it holds in both engines (R4).
- Two author corrections were refuted by painted ink and reverted: the 8 px dock gap and the
  0.5rem pad. I read the 0.5rem refutation as stated and didn't re-run it.

## 3 · Open gaps (exact)

1. **G5 has zero headroom and never exercised its live branch.** WebKit 430 reads 2.0 on a
   ≥ 2.0 floor at DPR 2. Real iPhones are DPR 3, and Playwright resolves `env()` to 0, so the
   `max()` arm that matters on an iPhone never ran. "0.625rem clears" is true only to the
   hundredth. The RUNSHEET line is unwritten. Either the pad goes to 0.75rem, or the floor is
   restated with a margin the chair rules on.
2. **The spec's negative controls are weaker than its header claims** ("every row carries its
   negative control"):
   - **G1:** hides the svg, then counts visible paths as 0. That's a tautology: it proves nothing
     about the positive assertion.
   - **zone-grammar :323:** the control sets the foot to `position: absolute; top: 100%` by hand,
     so "below the frame" is built in, not discovered. Striking `display: grid` alone would be
     the honest control.
   - **G11:** one-sided (`n.top − svg.bottom ≤ 5`), so a note laid over the verbs passes. It has
     no negative control.
   - **G13:** asserts svg-box gaps ≥ 0, where the gate says ink ≥ 2. It has no negative control.
3. **Undeclared or under-declared π:**
   - The landscape scrollport is −6 css with a +18 range (R1).
   - The landscape bottom fade relocates. On HEAD it floated above the in-flow bar. Now it paints
     over the scrollport's last 32 px, over the play tools, whenever content lies below. The
     README names only the tag deltas this causes.
   - The hover notes now lay tape over the lip's bottom stroke (R5). The README calls this
     "astride", but it measured against the `HandDrawnOutline` box, not the stroke.
4. **The `i` is naked, so this can't fold alone.** The ring dies with nothing drawn in its place:
   the control's painted boundary drops from 475–655 to 72–79 device px. In crops c1 and c3 it
   reads as a stray letter at the strip's end. The death must land in the same commit as G-INFO's
   ballot 1, or the fold ships a regression the owner never asked for.
5. **G-INFO's node was touched.** `contain: layout` on `#keys-fold` contradicts the brief's "do
   not move #keys-fold". It's layout-neutral as measured (card width identical), but it needs
   G-INFO's co-sign, and G16's lip-`d` stillness row must re-read with it once Row A lands.
6. **Code quality at fold:**
   - `mediaRef(...)` is called inside `setup`. It's the only per-instance caller; every other one
     is module scope. It adds a matchMedia listener that is never removed, on every
     GameControlPanel mount, and restates the regime query a third time. The cure is to compose
     the existing singletons, `rowRegime || portraitDock`, and fix the no-DOM default that forced
     the restatement.
   - `?lip=tab` reads `location.search` in product code. It's prototype scaffolding and must die
     with the losing arm.
7. **G4 was re-worded by its prototyper to fit the reading.** The spec now cites itself.
   "8 ± 0.75 stroke-to-stroke" failed. The box-gap and daylight form passes, but the lip's painted
   rhythm runs 2.5–3 css tighter than two wells'. The "fifth compartment" rhythm claim is only
   partly met. The re-wording is the chair's ruling, not the lane's.
8. **Unverified gestalt, owner's eye:**
   - At m18's leak pose (c1, dark), three horizontals stack within about 40 css: a divider, the
     incoming well's half-dissolved top stroke with visible corners, and the lip. The mark asked
     for "a border". This pose reads as a double one.
   - On the dock without an inset (c4), the lip's bottom stroke sits 2.5 css off the glass.
9. **Ballot 2 has one arm.** CTRL-RULE's top rule is unframed, so the ballot can't be put.
10. **Not run by anyone:**
    - 390×664 and short landscape
    - G-PANEL's payback of the +12 at 430
    - goldens (visual-golden / visual-regression pixel rows near the card bottom will move)
    - real Safari overlay scrollbars (M19), which leaves G3's gutter cure untested
    - DPR 3
    - a production pass

## 4 · Checklist hits

- **gates that cannot fail:** G1's negative control; the zone-grammar :323 control built by
  hand; G11 one-sided with no control; G13 without a control.
- **spec-cites-itself:** G4 re-worded by the prototyper to match its own reading.
- **π it moved and didn't declare:** the landscape scrollport −6 / +18; the landscape fade
  relocation; notes over the lip stroke.
- **the constraint it forgot:** G5's ≥ 2 floor met at exactly 2.0 in WebKit 430 (no margin, and
  the DPR 3 / real-inset branch never ran).
- **unverified gestalt:** the double-rule read at the leak pose; the naked `i`; no real Safari.
- **legacy alias:** the `?lip=tab` scaffold in product code.
- **masked fallback:** none found. `--card-gutter` got a 0px base, and no `var()` fallback
  survives on a measured token.
- **filterBudget:** held (I read the author's 12/12; the lip is pruned). M16: bare copy
  register is clean. R6 law 1: the drawer curve is untouched, and the 150ms moves un-retimed.

## 5 · Charter rows this critique adds (pass 5)

- **CTRL-TAPE:**
  - Re-cut the five spec controls (gap 2).
  - Name the landscape −6 / +18 and the fade relocation (gap 3).
  - Compose `footRegime` from the singletons (gap 6).
  - Delete `?lip=tab` at the ballot.
  - Re-read G5 with margin at DPR 3.
- **G-INFO / CTRL-FACE:** land the ring's replacement in the same commit as the ring's death, and
  co-sign `contain: layout` on `#keys-fold`.
- **Chair:**
  - Rule on G4's re-wording.
  - Rule on G5's floor versus a 0.75rem pad.
  - Rule on the named deltas (+12 at 430; landscape −6 / +18).
  - The RUNSHEET line.
- **CTRL-RULE:** frame ballot 2's arm (b), or let it fire unframed-against on the chair's word.
