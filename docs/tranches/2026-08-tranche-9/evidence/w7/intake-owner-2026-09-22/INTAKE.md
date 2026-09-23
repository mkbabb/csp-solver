# INTAKE — the owner's marks of 2026-09-22 (T9-M15–M19), folded

Fable, the fold of the owner-marks intake (`wf_3b66f064-970`), 2026-09-22. Ground: the owner's
words in `../../../design-marks-2026-09-22.md` with frames `marks/m17-*.png` and `marks/m18-*.png`;
three censuses (`census/{motion,info,panel-bar}/`), eight portfolio designs (`portfolio/`), four
adjudications (`adjudicate/`), four Opus prototypes in isolated worktrees off main `1e6cfbbf`
(evidence under `prototype/<group>/`), four adversarial critiques (`critique/`). Every number below
is theirs, cited; the fold re-measured nothing. Every design was built against MAIN, the product the
owner audited, never against a loop family's tree. This file is the brief the mark lanes owe the
owner (pass-5 CHAIR-RULINGS §3/§4): its charter rows are pasted into the owning lanes' returns; its
ballots go to the owner as framed here, re-shot by the owning lane on one payload per pair.

**U-10.** Nothing here retires a mark. The owner disposes at the re-look. Every prototype is an ARM
on main's HEAD; a lane may replay its diff (`git apply --3way` into its `74a2b5d9` tree) and says
so, and re-measures every number on its own tree and on main-HEAD where W8's substrate touches the
surface (pass-5 rulings §1.5).

**The verdicts.** Four prototypes, four ADVANCE: G-MOTION 64 · G-INFO 74 · G-PANEL 72 · G-BAR 72.
None converged. Every mark's defect is cured at its mechanism and reproduced by a non-author on both
engines; every prototype also moved something it did not declare, and each carries at least one gate
its own guard reads RED on. Those are the charter rows.

## 0 · Corrections the intake owes the chair (booked, not a lane's)

1. **M17 is the ≥1024 RAIL, not the phone dock.** `mobile = !rowRegime` (`GameScene.vue:198`,
   `useCoarsePointer.ts:21` = `(min-width: 1024px)`); the m17 layout renders only in the `!mobile` arm
   (`GameControlPanel.vue:822–835`) and the "i" only on a fine pointer (`:1335`, `:2310`). Below 1024 the
   dock already lays the chips in a row (60×44 · 60×44 · 84×44 under a tab pair). Pass-5 lanes measure
   M17 at 1280×800 fine and coarse, not 390. The marks file already carries this in its frame caption.
2. **M15's mechanism is the toggle's own Bloom, starved**, not a deck re-cut or a carousel FLIP move
   (0 px deck rect delta, 0 poster `src` changes, 0 transform/opacity changes over 8 flips, both
   engines). The chair struck the first sentence per registry-v4 §6.14; the census's reading binds.
3. **Ballot numbers.** T9-B10 is MOT-VERB's (≥21 re-curves) and T9-B11 is MOT-LADDER's dock clock
   (pass-5 rulings §1.3). G-MOTION's adjudicator wrote "B10/B11/B12" before those were assigned; this
   file renumbers every intake ballot **T9-B12 … T9-B23**, PROVISIONAL, and the chair assigns.
4. **T9-B8 is answered by M18** (below, §6): the bar stays, bordered in the house hand; the deletion
   arm is dead; COST is retired into TAPE. What remains of B8 is the owner's eye on the built edge.
5. **The G-BAR prototype's evidence still lives only in its worktree**
   (`.claude/worktrees/wf_3b66f064-970-21/docs/…/prototype/G-BAR/`: README, `prototype.diff`, three
   instruments, four crops 13–18 KB). The chair copies it under `prototype/G-BAR/` before batch 3
   (pass-5 rulings §4). The other three prototypes' evidence is already on main.
6. **Registry-v3 §1 vs v4.** The task names v3's terms; v4 (the pass-4 fold) is the live registry and
   the two agree on every owning family here except that CTRL-COST is RETIRED into CTRL-TAPE (its
   grafts bind through TAPE) and CTRL-TABS is BANKED at 57 (so no tab-row ballot exists for M17).

---

## 1 · T9-M15 — "The storybook animation for the darkmode toggle shrinks the item and then teleports it"

### Reproduction (census/motion, main `1e6cfbbf`, dev server, both engines)

The word "storybook" is the code's own name for the toggle's Bloom (`DarkModeToggle.vue:778`). The
first flip into each theme triggers theme-keyed re-bakes: `HandDrawnGrid.vue:233` keys the grid cache
by `isDark` (4 × 1272² poses) and `HandwrittenLogo.vue:456` does the same for the wordmark (4 poses);
LoAF shows them as `IMG[blob].onload @pencil-boil` at 69–113 ms each, two per frame, inside the
Bloom's frames — the comment at `HandDrawnGrid.vue:179–180` claims the re-bake is "masked by the
toggle's Bloom" and it is the opposite. The Bloom's warp is tweened inside the SVG filter input
(`DarkModeToggle.vue:24,119,797–817`), so it paints on the main thread and a stall freezes it: the
outgoing body has barely shrunk and the incoming lands at 0.54–1.0 scale on the next frame.

- chromium 1280 fine, cold light→dark: frames of 150.4 + 149.8 ms; moon first visible at scale 0.686
  (op 0.77); the sun jumps 0.767→gone and the moon 0.686→1.004 in one frame. Dark boot cold: 192.7 ms,
  sun born 0.659. Gallery cold: 158.4/133.3/123.9/126.1 ms, born 0.544. 390 coarse cold: 108.2 ms.
- the designed reference (warm chromium 1280): max frame 10.3 ms, born 0.22 at op 0.03, Δscale ≈0.05
  per frame, crest 1.092 at ≈+530 ms.
- webkit 1280 cold: ONE 829 ms (light boot) / 862 ms (dark boot — the sun's first visible frame is at
  scale 1.0, a pure teleport) frame; warm flips max 108–164 ms, 4–7 frames > 50 ms per flip, born
  0.39–0.71. 390 coarse warm is near clean (max 56 ms, born 0.18–0.20).
- ablation (webkit 1280 warm, frames > 50 ms): as-is 4–6 · live filter off 5–6 · no gesture 3–6 · no
  dusk 3–6 · `html.dark` only, no Vue `isDark` 1 (52–57 ms). The warm cost follows the Vue `isDark`
  path; WebKit has no LoAF, so function-level attribution is a gap (M15-b).
- the deck under the flip: 0 px card delta, 0 poster `src` changes, 0 transform/opacity changes.
- PRM: the toggle's PRM crossfade stalls on the cold flip too (chromium 175/191 ms, webkit 783 ms).

Files: `DarkModeToggle.vue:24,119,663–685,778,797–817` · `HandDrawnGrid.vue:179–180,233` ·
`HandwrittenLogo.vue:456` · `index.css:662–670`. Frame: `census/motion/c1-…-1280x800-fine.png`.

### Apotheosis (adjudicate/G-MOTION — Fable's LAW, Opus's mechanism)

A verb never bakes. Every raster a move lands on is inked before the gesture, so the sun's wring is
one unbroken sheet on the glass curve with the Bloom's vector warp and every one of its numbers kept
verbatim. Arm A (default): the grid and wordmark bakes become theme-FREE alpha stacks (stroke `#000`
at the same opacities; the `isDark` term dropped from both cacheKeys) and the theme colour is painted
live through a mask over a fill that reads `--grid-line-color` / `currentColor` — 8 cold encodes per
first flip go to 0 with no pencil-boil change, and the WebKit `isDark`-path candidate (theme-keyed
href swaps) is removed rather than worked around. Fable's `warm()` seam on pencil-boil 0.12.1 is the
fallback arm; "hold the old raster until settle" stays refused; a crossfade, a longer Bloom or a
lower-res bake is refused under M09. Moving the warp to the compositor (Opus's 1.08× flight sheet
with park 0.182, the twist re-timed onto the glass, the live pair 9→7) is REFUSED as a default and
put to the owner (T9-B22), because the census names that trade the chair's row.

### Prototype (`.claude/worktrees/wf_3b66f064-970-16` · 8 files +335/−100 · served dists on 4253/4254)

Built: theme-free coverage bakes with theme-free cache keys; the grid on **A2** (an HTML `.grid-ink`
layer of divs, each `mask-image: url(bake)` over `background: var(--grid-line-color)`) because WebKit
re-rendered in-SVG masks on every repaint (idle worst 36 ms, 7–8 frames > 50 ms per gallery flip under
A1); the wordmark on **A1** (`<mask maskUnits="userSpaceOnUse">` + `<rect fill: currentColor>`)
because a CSS mask on an SVG `<rect>` paints unmasked in WebKit; the wordmark's bake key held for the
length of a verb (`holdBake`).

| gate | prototype | HEAD, same run |
|---|---|---|
| GB1/GB2 chromium cold flip: born / max frame +0…+900 / encodes / href swaps | 0.20–0.28 / 13–47 ms / 0 / 0 | 0.47–0.62 / 104–189 ms / 8 / 8 |
| GB1/GB2 webkit cold flip (quiet interleaved round) | 44 ms, born 0.195 | 254 ms, born 0.848 |
| GB1 webkit warm flips | max 36–37 ms, 1 frame > 34 each | 30–32 ms, 0 > 34 (**+5 ms, the arm's standing price**) |
| GB3 grid rest identity, max channel Δ (target ≤ 1) | chromium 2/2 (74 · 21 px > 1); webkit 9/2 (light: 138,923 px > 1, ink mass −0.85 %) | reference |
| GB3 wordmark rest identity | chromium **73–75** (px > 16: 2,668 light / 4,325 dark, stair-stepped edges); webkit ≤ 14 | reference |
| GB4 idle 3 s | chromium 133.4 fps 0 > 33; webkit 97.5–98.1 fps 0 > 33 | 133.9 / 98.2 |
| GB4 filter census | 9 playing light · 11 dark · 13 gallery, `filter-census.spec` green both engines | same |
| GB7 PRM cold flip max frame | chromium 19.9–34.8; webkit **37–48 on every flip** | 125.5; 240 cold / 32–35 warm |
| GC3 lint:copy · lint:motion | bare 0 · 35 specs | — |

Not built: GB6 (the 300 ms stall injector); GB5 carried; raster union ±2 % during the fold unmeasured.
Frames: `prototype/G-MOTION/crops/c1-m15-toggle-cold-flip-chromium-light-to-dark-1280x800-fine.png`
(HEAD's grid vanishes at +270; the prototype's ink already turned) and
`c4-m15-grid-rest-diff-armA-vs-head-1280x800-fine.png` (GB3 diff maps ×8, both engines × both themes).

### Critic (critique/G-MOTION, ADVANCE 64) — what holds and what does not

Reproduced: GB2 0/0/0 encodes/hrefs/bitmap-style mutations vs HEAD 16/8/0 in all four cells; GB1
cold max 18.5/10.7 ms chromium and 20/24 webkit vs 141–165 and 44–291; GB3 to the pixel. **G-M1
BLOCKS the logo arm under M09**: the wordmark's Chromium AA loss (Δ 73–75, visible at 3× —
`critique/G-MOTION-k1-chromium-light-1280x800-fine-wordmark-rest-head-top-vs-proto-bottom-3x.png`)
re-opens the 2026-07-31 logo LOW-RES family; the arm's own guard GB3 was overridden, not honoured.
G-M2: the WebKit light grid is a whole-grid tone shift (Δ 9, −0.85 % ink), not edge noise — earn ≤ 1
or the chair rules a tolerance; nobody picks the px > 4 threshold that makes it quiet. G-M6: six specs
select `image.*` (visual-golden, visual-regression ×5 sites, gallery CH-67, wordmark-integrity,
multiplayer:476/533, theme-bake-freshness — 20 fails, needs a painted-ink rewrite) and
`src/probe/devicePaint.ts` (W8's boot-seam instrument) now counts divs. G-M9: arm A's WebKit price
(+5 ms warm, PRM 37–48 ms every flip) belongs in the ballot text, not a gap line. G-M10: A2's tag
change (grid `<image>`×4 → `div.grid-ink` + 4 divs outside the svg; logo `<image>` → `<mask>` +
`<rect>`) is the chair's ruling. Headless WebKit is not Safari (M19); the box was never quiet.

---

## 2 · T9-M19 — "the board selection animation … need[s] to be refined"

### Reproduction (census/motion, main `1e6cfbbf`)

**Enter (deck → playing).** `onLiveFace` runs `flipTransform(from, last)` on the board (`App.vue:636–642`)
after the Teleport has already put it inside `.live-face-fit scale(--live-fit)` (`GameCard.vue:467`,
the fit set at `App.vue:602`). The translate is written in viewport px and applied in the fit's local
space, so it is attenuated by the fit: error (1−f)·Δ = 89.9 px predicted / 92.7 measured at 1280,
20.0 / 21.5 at 390. `.live-face-slot overflow: hidden` (`GameCard.vue:459`) clips the fold: visible
fraction starts at 0.234 (1280) / 0.468 (390). The deck mounts inside the chrome-leave `setTimeout`
(`App.vue:711–713`, a 41 ms task) and starves the fold's head: chromium 1280 a 57.9 ms frame carrying
−110.4 px of width; webkit 1280 127.4 px centre + 167.2 px width in one 80 ms frame then 129.9 px in
a 96 ms frame; webkit 390 coarse the whole fold is 3 frames (162/123/78 ms), max step 110.1 px.

**Exit (playing → deck).** FIRST is the card rect, `centerCardEl()` (`App.vue:725`), not the board's
painted face: anchor error dy −35.2 / dw +28.8 at 1280, dy −34 / dw +46.4 at 390. `moveLiveBoard(null)`
(`:729`) parks the board while the deck still fades (gallery-fade 200 ms, `:963/:1227`); the centre
card collapses 407.9 → 104 (chromium) / 132.7 (webkit) px on frame 1. `runFold` (`:667`) reads LAST
with the leaving deck in flow, so its unmount drops the board AND the wordmark 135.3 px at +227
(chromium) / 135.7 at +322 (webkit) at 390 coarse. Under PRM both verbs are a same-frame cut (0 movers)
and conform. Files: `App.vue:602,636–642,667,711–713,725,729,963,1227` · `GameCard.vue:459,467` ·
`useFlipGlide.ts:81`. Frames: `census/motion/c2-…c4-….png`.

### Apotheosis (adjudicate/G-MOTION)

One continuous transform on the ratified glass curve (520 ms, `cubic-bezier(0.32,0.72,0,1)`,
unchanged): `flipTransform(first, last, parentScale)` divides the translate by `--live-fit` so the
error is 0 by construction; `.is-folding` lifts the slot's clip and the centre card for the fold's
lifetime; the fold's first painted frame IS the FIRST pose by leaving the mover's `startTime` pending
for the fold only (Opus's "pending start absorbs the task" was refuted on main — `run()` pins
`startTime`, which is the 57.9 ms head frame; Fable's rAF-after-LAST would flash the small board);
the wordmark's re-key held until finished. Unfold: FIRST = the painted face (`.board-peek-host` live /
`.game-card-face` poster; `centerCardEl` dies); the leaving deck pinned `position: fixed` at its
measured rect in `@before-leave` so LAST is final from frame 1, the unmount moves nothing and the
centre card holds 407.9 px; the board rises over the deck on `.is-unfolding` z 1. `--live-fit`
registered (initial 0, consumed bare); stagger 90 and `App.vue:1228`'s 200 ms homed on `MOTION`; PRM a
cut on both verbs; zero strings. Refused: shadow/tilt/spring/600 (ruling 1), a slide-up deck, a second
`useRasterStack`, `--deck-top` as `@property`.

### Prototype (`wf_3b66f064-970-16`, same tree as M15)

| gate | prototype | HEAD, same run |
|---|---|---|
| GA1 enter frame 1 centre / width error, chromium 1280 + 390, both themes | 0 / 0 | 97.9–98.5 / −33…−35 at 1280; 23.7 at 390 |
| GA1 webkit | centre 0.1–3.0, width −2.2…−5.9 (marginal) | 101–104.5 / 26.8–28.8 |
| GA2 visible fraction through the fold | 1.0 every cell (slot unclip alone: 0.712 — hence the scrollport lift, beyond the brief) | 0.25 at 1280; 0.49–0.54 at 390 |
| GA3 first painted fold frame (chromium screencast) | the whole board at FIRST, 0.5–1 px | at 390 already face-sized (257 px), 57 px off |
| GA4 chromium frames > 34 ms / encodes in fold | 0 / 0 | 0 / 4 (wordmark) |
| GA4 webkit frames > 34 ms | 1–2 (max 36–44); parity 1 vs 1 in the interleaved 390 re-read | 0–1 |
| GA5 exit live anchor dx/dy/dw | 0 / 0…−0.1 / 0 (webkit 1280 dx −3) | dy −35.2 dw +28.8; dy −34 dw +46.4 |
| GA5 poster exit (lazy scene) | 1 mover, the board cuts 632 px — **RED in both arms, pre-existing** | same |
| GA6 centre card through the exit | constant 407.9 / 357.8 / 180.9 (1280 / 390 / 390×560); 390 steps > 20 px after frame 1: 0; ablation (leave in flow) brings the 135 px drop back | 104 / 132.7; 101.6 / 130.3; 1 step of 135 px |
| GA9 interrupt mid-verb | settles clean, 0 style writes over 3 frames, both directions both engines | same |
| GC1 `@property --live-fit` initial 0 | ships in the first static sheet; ablation → face scale 0 (HEAD: a 640 px board spills) | `var(--live-fit, 1)` unregistered |
| GC4 π at rest, 16 cells | movedOutsideZone 0 | — |
| drawer.spec | 8/8 both engines (parentScale 1 path byte-identical) | — |

Beyond the brief and owed to the chair: the **scrollport lift** (viewport unscrolls,
`clip-path: inset(-100vmax 0)`, track translate, scrollLeft restored at settle) and the **fold z-order
cure** (`.game-card.is-folding .live-face-fit { z-index: 2 }`; `.gallery-viewport.is-folding ~
.staging-band { isolation: isolate }`) — at +60 ms the centre card's own outline and the staging
band's outline + tag painted over the board in flight. Void or vacuous instruments: GA7 doesn't
discriminate at 1280; GA8 is vacuous (the page never scrolls at 390×844/390×560); the painted GA2 read
1.0 on HEAD too. Frames: `prototype/G-MOTION/crops/c2-m19-enter-fold-chromium-light-1280x800-fine.png`
(the whole board unclipped and on top at +282) · `c3-m19-exit-webkit-dark-390x844-coarse.png` (each
animation seeked on its own clock: HEAD's card 130 px, the prototype's 358; a first cut that paused on
wall time caught both arms landed and was discarded).

### Critic (ADVANCE 64, shared with M15)

Reproduced: GA6 357.8/407.9 constant vs HEAD min 130.3/104; the 135.6/135.5 px step gone (max 5.0/5.5);
GA5 HEAD pops against the curve (webkit dCy −38.1 dW +53.8; chromium −32.6 / +37.8) while the
prototype's first changed frame is ≈6–8 % along the face→rest vector. **G-M3 (π, undeclared)**: the
scrollport lift makes the DOCUMENT horizontally scrollable for 520 ms — `scrollWidth` 1280→1872 and
390→1603; the page pans to scrollX 400 mid-fold and snaps back at settle; GC4 reads at rest and cannot
see it (cure candidate `overflow-x: clip` on the lifted viewport). **G-M4**: `holdFirstFrame` also
runs on the unfold against "for the fold only"; the exit's first moving frame lands 34–39 ms after
HEAD's (22–26 ms unexplained, rAF only). **G-M5**: `Number(el.style.getPropertyValue('--live-fit')) || 1`
is the JS twin of the CSS fallback GC1 deleted — an unset fit must take the cut. G-M7: GA3 has no
WebKit painted read; GB4's during-fold filter parity vs HEAD unreported (proto 13/15 only). G-M8: the
unfold's wordmark rides a held 0.72-size bake scaled 1.39× for 520 ms and re-bakes at settle (4
encodes at +515 in one WebKit read), softness unmeasured. The lift at a non-zero deck index (kenken,
390) is benign by construction (`restingIndex` reads rects the track translate holds). G-M11: vue-tsc
and vitest last ran before the z-order cure.

---

## 3 · T9-M16 — "The 'i' button clicking does not properly scroll the panel"

### Reproduction (census/info, main `1e6cfbbf`, 24/24 desk cells both engines)

The owner's "i" is the rail's `.info-btn` (`GameControlPanel.vue:1332–1342`, aria-label "what the
keys do"), not `AttributionCard`'s "@mbabb". `toggleKeys()` (`:148–156`) calls
`#keys-fold.scrollIntoView({block:"nearest", behavior:"smooth"})` at `:154` on `nextTick`, while the
fold is at its `0fr` start: the target is **0.00 px tall in 24/24 cells**. `.legend-fold` then animates
`grid-template-rows 0fr→1fr` over 200 ms (`:2287–2296`); the smooth scroll's destination was fixed at
call time against the OLD maxScroll and nothing re-aims it as the range grows 101.8–107.7 px; the
growth lands under the opaque sticky bar (`:2181–2194`, `bottom: 0`, z 60). The comment at `:145–146`
("the fold rides into the scrollport as it opens") is false as measured.

- chromium 1280×800: maxScroll 534→636, scrollTop after the press 534; crib `<dl>` 93.80 px tall, 0.13 px
  visible (0.001), 93.67 px under the bar. 1440×900 0.002 · 1280×720 0.001. webkit 0.002 / 0.004 / 0.002.
- ablations: PRM (`transition: none`) → crib 1.000 visible both engines; the same call re-issued after
  the 200 ms settle → 1.000 visible, `<dl>` bottom 8 px above the bar (`census/info/c3-…`).
- coarse has no "i" by design: at 390×844 hasTouch the dock has 0 `.info-btn`/`#keys-fold`/legend nodes
  (`v-if !mobile` at `:1221/:1333`); at 1280×800 hasTouch the button is `display: none` (`:2308–2325`).
  The legend is keyboard shortcuts, so M16 is a desk mark.
- `scene.css:264` `scroll-padding-bottom: var(--action-bar-h, 0px)` — a `var()` fallback on a measured
  token, pre-existing, TAPE's registration block.

### Apotheosis (adjudicate/G-INFO — Opus's placement, Fable's instruments)

Press the "i" and the key crib unfolds out of the strip, directly above the "i" and the verbs, on the
strip's own paper: `#keys-fold` becomes `.action-bar`'s FIRST grid row (`grid-column: 1 / -1`), in flow,
clip-path-clipped, `0fr→1fr` at the ratified 200 ms `--ease-drawOn` moved verbatim. The panel does not
scroll (`toggleKeys` = the flip alone), the verbs and the "i" do not move, the scroll range grows by
exactly what the crib covers so everything under it stays reachable by wheel and Tab (the
`--action-bar-h` publisher follows), the bar's fade rides the crib's top edge for free; close is the
same clock reversed; PRM a cut. The form works in the sticky arm main has today and in the B8
`#card-foot` arm (the crib travels with the bar), so the scroll-after-settle fallback is dead. Fable's
growing drawn lid is refused on a source fact (`HandDrawnOutline` re-bakes its path on every
ResizeObserver callback — ~12 `d` regenerations per rung, a beat on a pose-0 frame, law 37). The "i"'s
CSS ring dies with M18's edge (one hand per strip); its replacement is ballot T9-B14 (default: a fifth
verb "keys" in the strip's grammar; alt: a drawn 28 px ring). Copy: aria-label unchanged; "keys" and
"what each key does" the only new strings.

### Prototype (`.claude/worktrees/wf_3b66f064-970-17` · 5 files +164/−69 · dists on 4255/4256)

| gate | prototype | HEAD, same run |
|---|---|---|
| G1 crib painted-visible ≤ 700 ms after the press (66/66 cells, both engines) | 0.995–1.026; `<dl>` bottom 7.99–8.01 px above the verbs | 0 painted px; bottom 84.5–96.5 px BELOW the verbs |
| G2 scrollTop Δ · scrollIntoView calls | 0.00 · 0 in 66/66 | +534/+535 (1280) … +614/+615 (720) · 1 per press |
| G3 verbs + "i" rect Δ per frame · settle | 0–0.16 px; monotone, 0 reversal; 168–205 ms (budget 233); PRM 0 intermediate heights | 0–0.36 |
| G4 π fine (10 cells) card width / board-left | Δ 0.00: chromium 324.22/131.89 · 315.59/24.2 · 330/193 · 339.69/332.16; webkit 332.31/127.84 · 323.59/20.2 · 338/189 · 347.81/328.09 | same |
| G4 π coarse (1280 hasTouch; 390/430 sheet settled) | rendered strip tags equal, 0 paint delta over 17 props × 35–40 nodes; bar 64.81/66.77 | same (the unrendered DOM order differs — the chair's word) |
| G5 Tab walk, crib open | 0/16 occluded in 14/14 cells; publisher-blinded control 5–8/16 | 0/16 |
| G6 webkit frames > 17.5 ms per open, interleaved, load 6–13 | median 1 (0–2) | median 0 (0–3) — **at the boundary, not quiet** |
| G8 borders inside `.action-bar` | `kbd` ×12 only (the named exemption) | `.info-glyph` 1/1.5 px |
| G9 a11y 3.4 | 2/2 chromium · 2/2 webkit | same |
| G10 painted AA 2× | dd 5.16/5.24 light, 5.96/6.07 dark; kbd 3.53 / 4.35; "keys" 4.66 light / 7.68 dark (open 15.84–19.45) | ringed "i" 3.30/3.53 light |
| G11 filter route census | 6/6 + 6/6 = control | same |
| G13 content band, crib open | 441/437 (1280×800) · 413/409 (1024) · 471/467 (1440) · 361/357 (1280×720, reported) | — |
| G14 Row B min verb gap | 7.59/8.92 at 1024×768; hover-note overlap 0 px² | 11.91/13.52 |
| mechanical | vue-tsc 0; unit 69 files / 848 tests (+1 born-RED row); lint:copy/motion/font-coverage 0; share-truth/zone-grammar/access 22/22 chromium, 21+1 skip webkit | — |

A finding of its own: the fifth verb's press lifted the sticky strip 17 px in WebKit — `.icon-btn:active
{ transform: scale(0.93) }` makes the pressed button its note's containing block, the last verb's note
overflowed the card by 15–17 px and WebKit's classic scrollbar stole the scrollport. Cured on the fifth
verb (children scale, not the box). Frames: `prototype/G-INFO/c1-chromium-light-1280x800-fine-open-from-top.png`
· `c2-webkit-dark-1280x800-fine-open-from-end.png` (G15's brackets beside the open crib) ·
`c3-chromium-light+dark-1280x800-fine-ring-arm-strip-rest-open-2x.png` (the ring arm, framed only) ·
`c4-chromium-light-1024x768-fine-open-density.png`.

### Critic (critique/G-INFO, ADVANCE 74)

Reproduced with its own instruments: G2 0·0 in 40/40 vs HEAD +505…+564 and 1 call; an independent
hit-test G1 (elementFromPoint at every kbd/dd centre) 19/19 vs HEAD 0/19; close as still as open;
π to the hundredth; viewport-law.spec 14/14 both engines on both arms (the lane hadn't run it).
Open: **H2** — the 200 ms height tween inside the bar fires `useResizeObserver(actionBarEl)` 18–20
(webkit) / 25–26 (chromium) times per open vs 0 on HEAD, each writing `--card-pad-b/--action-bar-h/
--card-pad-t` onto `.controls-card` and walking `publishFold`; **G6 leans RED under load** (7 vs 2 at
load 109, half the frames delivered); a settle-only publisher is the cheaper cure before MOT-VERB's M1
transform slide. **H3** — the press cure is scoped to one verb over an estate mechanism: HEAD's Share
note jumps +79.1/+81.9 px on a held press and the prototype's four siblings still jump 60–62 px; the
cure belongs on all five as a declared π row. **H4** — the `?keys-ring` scaffold ships in source
(`location.search` at setup, a second `<button>`, ~30 lines of CSS) with the alt arm's π/AA/filters
unmeasured and its open cue colour-only. **H5** — G15 is visible (c2): the next well's outset brackets
frame the open crib, so Row A cannot land before TAPE/RULE's slab-cover/edge row. H1: the lane's own
G1 reference compares the strip-arm crib to itself (the e2e must carry the hit-test). H6: G3's step
bound is the curve's peak slope, not the predicted per-frame step (first-battery chromium reads of
4.3–23.6 unexplained). H7: one control carries two sentences ("what the keys do" / "what each key
does"). Row B's rest pose framed by the critic:
`critique/G-INFO-k1-webkit-light+dark-1280x800-fine-rowB-rest-vs-head-2x.png` (the "i" 30 px in the
hand at the siblings' muted ink; box 46×56 vs HEAD's 32×32).

---

## 4 · T9-M17 — "this has a poor usage of space and needs to be re-designed"

### Reproduction (census/panel-bar, main `1e6cfbbf`, chromium + webkit × light + dark)

`OptionSelector.vue:44` lays every non-binary group on the rail as `flex-col`; `md:items-stretch` +
`md:text-left` (`:54`) make each chip a full-width 268.22 px line holding a 36–72 px word. The premise
at `:175` ("the rail is a 165px column") is stale: the fine rail's content column measures 259.59 (1024)
· 268.22 (1280) · 271.25 (1366) · 274 (1440) · 276.31 (1512) · 283.69 (1728), because the folded
keyboard legend's max-content sizes the card while closed.

- rail 1280×800 fine: card 324.22/332.31 wide, visible 608, scroll height 1142/1143; new-game zone
  284.22/292.31 × **503.19/504.16**; sections size 163.44 tall / ink 0.12 / width share 0.22, level
  178.03 / 0.13 / 0.27, deal row 120.17 / 0.08; zone ink 0.11. Chip boxes 268.22×38 holding text 36/36/60
  and 48/72/48 px. Chip pitch 45.19 (38 + 7.2 gap); section gap 13.6 + 1 px rule + 13.6; heading-to-heading
  191.62; the "new game" tag bottom → "size" heading top **2.19 px**, the smallest step in the ladder.
- at scroll top the Deal button (y 560.47–633.27) sits under the bar's 32 px fade (bar top 627.64).
- dock 390×844 coarse: zone 241.73; tabs 44×44 + 50.38×44; chips 60/60/84×44; deal row 117.77 tall =
  48.7 % of the zone at 0.07 ink. Coarse rail 1280 hasTouch: chips 168×44, zone 184×532.78.
- one-row arithmetic: size needs 218.4, level 254.4, futoshiki's four-chip row 261.6 (−2.01 at 1024).
- the owner's card is ≈369 CSS px wide in m17 (zone ≈320); no rail viewport 1024–1728 reproduces that
  width (card 315.59–339.69). The layout matches; the width is unexplained.

Files: `OptionSelector.vue:44,54,175` · `GameControlPanel.vue:822–835,1839–1856` · `GameScene.vue:196,198`
· `useCoarsePointer.ts:21`. Frames: `census/panel-bar/c1-…-1280x800-fine.png` (reproduces m17),
`c2-…-390x844-coarse.png` (what the phone shows).

### Apotheosis (adjudicate/G-PANEL — one layout in two hands)

The column arm dies for a wrapping, left-ruled, `contain: inline-size` LINE of intrinsic chips (fine:
word + 24; coarse rail: `flex: 1 1 auto` so a one-chip line is today's 168×44 byte-identical): `size`
over its line, `level` over its line, the verb with its receipt on ONE baseline. Rhythm: `--zone-step`
0.85rem (13.6) registered in CTRL-FACE's one `@property` block (inherits true, initial 0px), consumed
bare at six sites; ladder 4 < 7.2 < 13.6. Deal row: rail flush-left at both pointers, `align-items:
last baseline`, column-gap the chip seam; dock `1fr auto 1fr` with the verb on the well's spine (π on
its x) and the receipt in the right track (T6 mark 6/8's history, the reversal the chair books). One
graft: the deal button's `padding-inline` becomes the chip's inset 0.75rem, so h2 ink, chip ink and
the die's INK share one x. Scope ARM A (component-wide; the live wells a declared delta) default vs
ARM B (a staged-only `line` prop). Reconciled arithmetic: ≈303 px at 1280 fine (−40 %), the verb's
bottom ≈464 vs the fade 595.64, dock deal row 117.77 → ≈85. Nothing minted. Refused: segmented rows,
heading-beside-row, a per-row bracket (L11/L37), tabs on the rail (TABS is banked), any height tween.

### Prototype (`.claude/worktrees/wf_3b66f064-970-20` · 3 files +124/−40 · dists on 4257/4258, two codec payloads stated)

| gate | prototype (chromium / webkit) | HEAD |
|---|---|---|
| G1 zone height 1280×800 fine | **303.25 / 304.22**; every fine rung 302.63–305.31; futoshiki 1024 chromium 347.81 (latin 3+1); plants +200 px → 489.66 RED ✓, receipt stacked → 342.03 RED ✓ | 503.19 / 504.16 |
| G2 lines per staged group at six fine rungs | 1 (futoshiki latin 1024 chromium 2); census span-x/ink: size **0.72/0.70 · 0.22/0.21 RED** on floors 0.75/0.25; level 0.86/0.83 · 0.27/0.26 | 3/3 · 0.22 · 0.12 |
| G3 verb bottom vs fade top (1280 fine) | 466.11 / 466.78 vs 595.64 (clear by ≈129); the pencils tape out from under the bar | 633.27 RED |
| G4 tape→h2 · h2→chip · seam | 15.78 · 4.00 · 7.18–7.19, monotone; plant `--zone-step: 0px` → 2.19 RED ✓ | 2.19 |
| G5 Deal/dealt glyph bottoms | Δ 0.00–0.01, clearance 7.18, at 1280 fine · 1280 coarse rest + armed · 390/430 settled (with `.difficulty-tally { align-items: baseline }` — `last baseline` alone left dealt 9.2 px high) | Δ 30–34 stacked |
| G6 ink left edges vs h2 | first chip 0.5 (1.0 at 1024/1728 chromium); **die 1.0 chromium / 1.5 webkit vs a 0.5 bar — RED** (DiceIcon stroke inset + Fraunces side bearing) | die +105.5 centred |
| G8 card width / board.x vs control, 9 cells × 2 games × 2 engines | Δ 0.00 / 0.00; negative control (containment struck) widens the coarse rail 224 → 358.42, futoshiki 1024 315.59 → 328.00 | — |
| G8 scrollWidth === clientWidth | holds at every desk and phone cell; **282 ≠ 218 at the 1280 coarse rail on BOTH arms** (HEAD's hidden `.zone-hint` tapes) | RED too |
| G9 coarse rail 1280 hasTouch | every `.ctrl-btn` ≥ 44; size 2 lines, level/marks 3 × 168×44 byte-identical; deal pair unwrapped at rest and armed (158.3 ≤ 168); PANEL_H shipped 1105.53/1106.50; test 10's ORIGINAL control reverts only to 1172.72 (< 1227.5 seal — RED as predicted), EXTENDED control 1313.88/1315.02 | 1227.09/1228.06 |
| G10 painted AA 2× | light: muted chip **4.66**, level word 4.90, h2 4.90, dealt 5.24, Deal sublabel **4.66** (thin); dark 7.68/10.23/10.23/6.01/7.68 | same inks |
| G11 π (1280/1440/390/430) | masthead 2/2 · board 474/474 · bar 42/42 · tabs 8/8 at 390 · phone chip row identical; **at 430×932 the content-sized sheet's top descends 32.5–32.79 and webkit's bar −0.28** (a consequence of the dock deal-row delta); the deck UNREAD (not mounted in the game view) | — |
| G12 battery vs control | every lint/type/unit/golden/census exit code equal (unit 847/69 both; filter census 6/6 both; zone-grammar WHOLE 11/11 both); the `-1lh` guard not found (0 hits) | — |
| G13 chip press · PRM | 1 pose swap; **PRM `color 0.15s` on both arms — RED** (FACE row 9, cited) | same |

Side effects: fine card scrollH 1142 → 806; dock 699 → 666 at 390 (still 38 px under the case). Not
cured, as predicted: the coarse rail's level band 3 lines; coarse Deal under the fade at scrollTop 0
(625.27 > 595.64). Frames: `prototype/G-PANEL/c1-m17-head-proto-b2under-b4grown-chromium-light-1280x800-fine.png`
(four panels: HEAD, the prototype, ballot 2's under arm, ballot 4's grown arm) ·
`c2-armA-live-wells-head-proto-webkit-dark-1280x800-fine.png` · `c3-coarse-rail-head-proto-armed-chromium-light-1280x800-coarse.png`
· `c4-dock-deal-row-head-proto-webkit-light-390x844-coarse.png`.

### Critic (critique/G-PANEL, ADVANCE 72)

Everything on the desk rail reproduces to the hundredth on independent builds (proto
`index-1KzgJ-HoWD7T.js`, control `index-ChSrVSqM0j8q.js`). Open: (1) the coarse rail (iPad
landscape) is incoherent — `size` wraps 2+1 with `16×16` orphaned on a full 168 line, `level` and marks
stay columns, checking wraps 2+1: four layouts in one card, the M05 disease inside the zone, unframed;
(2) ARM A's live wells show a jag (`Center` orphaned; intrinsic chips over the what-fits pair's
half-width cells) and ballot 3's kept-column arm is described, not built; (3) **undeclared π**: the W2
drawer tab at 430×932 moves 208.84 → 241.63 (+32.79 / +32.5) with the sheet top, webkit's bar −0.28;
(4) Deal's fine hit box shrinks 71.19 → 60 (−16 %) on the card's one primary verb, and on the phone it
wears 0.75rem while every other icon button wears 0.5rem — neither declared as a trade against M01;
(5) G6 RED; (6) two comments assert what the numbers deny (tape→h2 is 15.78, not "13.6"; a wrapped
receipt lands left-flush, not "today's centred pose"); (7) **`--zone-step` is a NEW `@property` block
in main's index.css** against the chair's one-block-per-home ruling (§6.7/§6.8) — fold it into FACE's
block; the `line` prop is consumer-less under ARM A; test 8b and test 10 fail on this product until
`PROPOSED-visual-regression.diff` folds with it (the stamp is the chair's); (8) G2's size floor was
derived from chip boxes, not ink; (9) G10 as a column distribution holds at a flat 4.66 with 7–14 % of
edge columns under 4.5. The chair books the T6-mark-8 reversal and rules ARM A vs B if the owner doesn't.

---

## 5 · T9-M18 — "This needs to have a border in some way"

### Reproduction (census/panel-bar, main `1e6cfbbf`)

`.action-bar` (`GameControlPanel.vue:2104–2111`) paints no border, shadow, outline or
`HandDrawnOutline` — only the card's colour (253,253,252 light / 19,18,17 dark), a 32 px `::before`
fade (`:2123`) and a card-coloured skirt (`::after`, `:2228`; 6 px dock / 56 px rail). Ink in the bar's
top 3 px: 0–9 px of 736–1496 (≤ 0.8 %). The "brackets" in m18 are the tray wells' outlines, drawn 4 px
outside each well (`:outset=4` at `:763`; `HandDrawnOutline.vue:183`): the bar's opaque slab covers only
the content width, so a well scrolling under it shows its side strokes in 4 px bands either side —
88–142 ink px in the left 7 px column, 68–151 in the right, out of 462–528, both engines, both themes,
every scrolling cell. The rail bar: 284.22/292.31 × 64.81, 20 px in from the card edge, 56 px above
the card bottom; four buttons 46×56.03; the "i" 32×32 with a plain CSS ring (`:2328`). The dock bar
374×66.77 sits 6.00/6.02 px above the viewport bottom; no product rule reads `env(safe-area-inset-bottom)`
(`index.html:12` sets `viewport-fit=cover`). The card's drawn frame (`.drawer-case`, stroke 3, 4 px
outside) is 24 px outside the bar at the sides and 60 px below it; on the phone its side and bottom
strokes are off-screen, so the bar's edge would be the only drawn edge at the bottom of the screen.
R3 on the r0 probe (re-cut by the chair: a `<HandDrawnOutline` inside the bar's box AND no border
longhand > 0) reads RED on main. Frames: `census/panel-bar/c3-m18-rail-webkit-dark-1280x800-fine.png`
(reproduces m18 with the well-outline brackets) · `c4-m18-dock-webkit-light-390x844-coarse.png`.

### Apotheosis (adjudicate/G-BAR — the fifth compartment)

The tool strip is the pencil case's fifth compartment, the one that never scrolls. It wears the wells'
own drawn frame (`HandDrawnOutline` stroke 1.5 / outset 4 / radius 3 / pose 0 — `.tray-well`'s four
props at `:762–765`) around the fixed-height verbs row, in `#card-foot` (the card's second grid row,
outside the scrollport: T9-B8's firing default, now the owner's FORM), its side strokes on the same x as
the compartments above (|Δx| ≤ 0.5, the measurable thesis), so the wells dissolve down into the lip
through a fade that spans the body's PADDING box and nothing can leak around a slab because there is
no slab. The foot sits on `max(<pad>, env(safe-area-inset-bottom))` on the dock (chair §6.1). No CSS
border survives in the strip (the "i"'s ring dies; its form is T9-B14). The frame is still (pose 0):
no filter, no beat, no layer; it rides the sheet's ratified glide untouched; the fade's 150 ms moves
un-retimed. The crib (M16's Row A) rises ABOVE the lip on the strip's paper so the lip's path never
re-bakes. Refused: Opus's card-coloured box-shadow cover (needs an L5 ruling), the tab's 2.5/3/0 pen as
default (a third weight inside a card with two — ballot arm), Fable's keycap "i", regime-keyed margins,
moving the foot into the < 1024 landscape cell (`scene.css:466–514` makes it a scrollport with the bar
in flow; the lip is worn in place there). What dies on main: `:2181–2197` sticky + z 60, the bar's
`::before`/`::after`, the `--card-pad-b`/`--action-bar-h` publishers (`:588–628`), `scene.css:264`'s
`var()` fallback (→ static 2rem), the ring's border rules, the bar's background.

### Prototype (`.claude/worktrees/wf_3b66f064-970-21` · 8 files +398/−424 (+296/−322 ignoring whitespace) + NEW `e2e/tool-strip.spec.ts` (271 lines) · dists on 4259/4260, one codec payload)

Built: the split (`.controls-card` a two-row grid `minmax(0,1fr) auto` in every regime; `.card-body`
the scrollport, `<div id="card-foot">`; padding utilities split in the same edit; foot pads rail 3.5rem,
portrait dock `max(0.625rem, env(safe-area-inset-bottom))`, landscape 0.375rem); the lip as built; the
bar in `<Teleport defer to="#card-foot" :disabled="!footRegime">`; the fade hung from the foot
(`.card-foot::before`, not the brief's sticky `.card-body::after` — it spans the padding box by
construction and stops short of the scrollbar track); the ring dead; `.legend-fold { contain: layout }`
(the split exposed 94 px of blank scroll from the shut crib's overflowing `<dl>`); the gap one rule
`.card-foot .action-bar { margin-top: 0.5rem }` (no `--strip-outset` binding — deviation declared);
e2e re-aims (`zone-grammar.spec.ts:303–360`, `viewport-law.spec.ts` :22/:424/:581/:619/:805,
`mobile-platform.spec.ts:536`). Ballot arm b behind `?lip=tab` (scaffold).

| gate | prototype | HEAD, same run |
|---|---|---|
| G1 the lip's path in the DOM, pruned, every cell (32/32); coverage lip shown vs hidden | 1.00 on all four sides at every rail and dock cell, both engines, both themes; landscape top 0.87–0.97 / bottom 0.82–0.88 (instrument band 8 css; the 828 px side wanders 10.2–10.8) | no path; top band 0 ink |
| G2 leak: census 7 px flanks + 2 px above; Opus differential clamped 2 px inside the card | 0 / 0 / 0 every scrolling cell both engines both themes; swept over the WHOLE range by the critic: 0 of 101 poses | 55.8–58.3 (rail) / 125.8–132.8 (dock) per flank; 84 of 87 poses |
| G3 lip side-stroke centroids vs the nearest well | ΔL ≤ 0.25, ΔR ≤ 0.29 every cell (rail ≤ 0.10); no WebKit gutter miss under Playwright — the gutter cure held in reserve; tab arm ±0.9–1.15 | — |
| G4 rhythm above the lip | box gap 15.92–16.36 (wells 16.00); painted daylight min 8.5–9.5 rail, 7.5–9 dock, 4.5–5.0 landscape; painted s2s 13.5–14.0 vs the wells' 16.6–17.1 (**the nominal "8 ± 0.75" matches no pair of wells as painted — re-worded by the lane**); the 8 px dock gap REFUTED (daylight −0.5…1.0) | — |
| G5 foot on the inset | `env()` in source; computed pad 10 px at 390 both engines; lip's lowest ink above the viewport bottom 2.5–3.0 (390), **2.0–2.5 (430; webkit ON the 2.0 floor)**; 0.5rem refuted (0–1.0) | bar 6.00/6.02, no `env()` |
| G6 borders in the strip | 0 on every non-`kbd` descendant | 1–1.5 px ring |
| G7 π | card / board / masthead identical to the hundredth at 1280/1024/1440 both engines; board + masthead identical at 390/430/landscape; 530-node signature 0 tag deltas; **named deltas: dock strip up 4; 430 card +12 (not the adjudication's +4); landscape +12 of flow** (bar +8, play row +18.41) | — |
| G8 painted contrast | lip core median 17.61–17.78 light (min 4.73–5.24), 14.20–14.31 dark; sublabels 4.66 / 7.68 = HEAD | — |
| G9 filter census `filter-census.spec` both engines | 12/12 (G3.1 exact 9); lip pruned, 0 `will-change` | 12/12 |
| G10 Tab walk under a painted fade | 0 controls (worst −0.5…0); control `scroll-padding-bottom: 0` → 2/3 | **2 and 3 — HEAD RED**: `--action-bar-h` priced the bar and pad, never the fade |
| G11 notes | tops 0.20–1.57 below the lip's BOX; 0 over a body control; the berth note reveals in the foot | — |
| G12 the top edge | `--card-pad-t` 20/6 on the body; sentinel −20/−6; 0 orphans over the full scroll | — |
| G13 landscape 844×390 / 812×375 | lip in flow, no foot; top daylight 4.5–5.0; lowest ink 5.5 above the play row's box (ink read returned 0 columns — instrument clip) | — |
| G14 focus rings vs the lip's ink | 0 px² overlap both engines at 1.5; tab arm: WebKit's fourth ring overlaps 15–17 px² | — |
| discontinuity through the glide and a full scroll | 0 jumps, max step 0.00–0.09 px | sticky steps 2 × 2.2–2.4 px webkit; 3 × 37 px (webkit) / 2 × 29 px (chromium) on the coarse-rail scroll |
| mechanical | check-copy-register 0; lint:motion 36 specs; ledger-diff --verify-cites GREEN; `grep action-bar-h\|card-pad-b src` 0 (HEAD 12); `env(` 1; vue-tsc 0/0; vitest 69/847; e2e chromium + webkit 45 passed + 1 pre-existing red (`viewport-law:396` §2.5 tape over a level chip, RED on HEAD too); HEAD born-RED 11/11 tool-strip rows + zone-grammar:323 | — |

Frames (worktree, to be copied by the chair): `prototype/G-BAR/c1-chromium-dark-1280x800-fine-leakpose-lip1.5.png`
(m18's pose; HEAD twin census c3) · `c2-webkit-light-390x844-coarse-dock-leakpose-foot-on-pad.png` ·
`c3-chromium-light-1280x800-fine-scrollend-twoup-lip1.5-vs-2.5.png` · `c4-webkit-light-390x844-coarse-scrollend-twoup-lip1.5-vs-2.5.png`.

### Critic (critique/G-BAR, ADVANCE 72)

Reproduced on its own builds and instruments: rail identity to the hundredth; leak 0 of 101 poses vs
HEAD 84 of 87; G5's 2.0–3.0; 430 +12; the blank-scroll cure (3.9–4.5 css blank vs HEAD's 56). Open:
(1) **G5 has zero headroom** — WebKit 430 reads exactly 2.0 on a ≥ 2 floor at DPR 2; Playwright resolves
`env()` to 0 so the `max()` arm that matters on an iPhone never ran; DPR 3 unmeasured; the RUNSHEET line
unwritten (0.75rem or a ruled margin); (2) four spec rows carry weak or absent negative controls
(tool-strip G1 hides the svg and counts 0; zone-grammar :323 positions the foot by hand; G11 one-sided;
G13 asserts box gaps ≥ 0 where the gate says ink ≥ 2); (3) **undeclared π**: landscape scrollport
302 → 296 (−6) with the range 441 → 459 (+18); the landscape fade relocates onto the scrollport's last
32 px over the play tools; hover notes now start 2.4–3.8 css ABOVE the lip svg's bottom edge (tape over
the bottom stroke — "astride" was measured against the box, not the stroke); (4) **the "i" is naked** —
painted control ink 475–655 → 72–79 device px, a stray letter in c1/c3; the ring's death must land in the
same commit as T9-B14's winner; (5) `contain: layout` touches `#keys-fold` (G-INFO's node — layout-neutral
as measured; needs G-INFO's co-sign and G16's re-read); (6) `footRegime = mediaRef(…)` inside `setup`
leaks a matchMedia listener per mount and restates the regime a third time — compose `rowRegime ||
portraitDock`; `?lip=tab` reads `location.search` in product code; (7) G4 was re-worded by its own
prototyper (the chair rules, not the lane); (8) gestalt at m18's leak pose (c1, dark): a divider, the
incoming well's half-dissolved top stroke with visible corners, and the lip stack within ≈40 css and
read as a double border — the owner's eye; (9) ballot 2 has one arm (RULE's top rule unframed); (10)
unrun by anyone: 390×664, short landscape, G-PANEL's +12 payback, goldens (rows near the card bottom
will move), real Safari overlay scrollbars, DPR 3, a production pass.

---

## 6 · T9-B8, its state

**Answered by the owner's eye (M18): the bar STAYS, bordered; the deletion arm (CTRL-COST's) is DEAD;
COST is retired into CTRL-TAPE.** The ballot's firing default (the bar moves to `#card-foot` with a drawn
edge, pass-4 rulings §3) is now the FORM, built once on main by G-BAR and measured: the lip in the wells'
pen, in the foot, on the inset, with the leak at 0 and the rail's card and board identical to the
hundredth. R3 on the r0 probe stays the gate and reads RED on main until the §10 fold lands the edge.
What remains of B8 is the owner's eye on the built edge, framed as two ballots below (T9-B12 the pen,
T9-B13 the form), plus the chair's rows the build named: the +12 at 430 and the landscape −6/+18, G5's
floor vs a 0.75rem pad, G4's re-wording, and the RUNSHEET line for the real iPhone.

---

## 7 · THE PASS-5 CHARTER ROWS (one numbered row per owning family; paste into the lane's return)

Format per row: **what the lane lands · the gate · the number that closes it.** Every number is re-measured
on the lane's `74a2b5d9` tree AND on main-HEAD (pass-5 rulings §1.5); "HEAD" below is main `1e6cfbbf`.

### CTRL-FACE (§10 leader, 84) — M16 + M17

1. **M16 Row A (the crib in the strip).** Land `#keys-fold` as `.action-bar`'s first grid row
   (`grid-column: 1 / -1`), `toggleKeys` = the flip alone, the false comment at `GameControlPanel.vue:143–146`
   rewritten; the fold's 0fr→1fr / 200 ms `--ease-drawOn` / PRM none moved verbatim (replay
   `prototype/G-INFO/prototype.diff`). Gate: an e2e spec both engines, 1280×800 · 1024×768 · 1440×900 ·
   1280×720 fine, from the top AND the end, click AND Enter — the critic's hit-test (elementFromPoint at
   every kbd/dd centre) 19/19 inside the scrollport; `scrollTop Δ 0.00 ± 0.5` and 0 `scrollIntoView` calls
   (hooked); verbs rect Δ ≤ 0.5 every frame on open AND close. Closes at 19/19 · 0 · 0 · ≤ 0.5 (HEAD:
   0/19 · +504…+615 · 1). Order: **after** TAPE/RULE's edge row (G-INFO c2: the wells' brackets frame the
   open crib until the lip lands).
2. **M16 the settle-only publisher.** The `useResizeObserver(actionBarEl)` publisher must not run during
   the crib's rung: publish once on `transitionend` (filtered to `grid-template-rows`) and at rest. Gate:
   `--action-bar-h` `setProperty` calls per open = 1 (HEAD 0; the prototype 18–26); WebKit frames > 17.5 ms
   per open ≤ the control's median + 1 on a quiet box (load < 4), n ≥ 8, arms interleaved. If the residue
   stays above, MOT-VERB's M1 slide is the escalation (row VERB-6), not a block.
3. **M16 the press on all five verbs (declared π).** `.action-verbs .icon-btn:active` scales the children,
   not the box, on every verb — the note's containing block stays the bar. Gate: a held press on each verb,
   both engines: card `overflow-x` 0, sticky/foot lift 0, note re-home 0 px (HEAD's Share note jumps
   +79.1/+81.9; the prototype's siblings 60–62). Declared as a pixel moved on four verbs.
4. **M16 ballot T9-B14's scaffold dies with the ballot.** `?keys-ring`, the second `<button>`, the
   `.ring-arm` CSS and `location.search` at setup are gone from product source when one arm fires; both
   arms framed at 2× both themes on one payload before the eye (the alt arm's π, AA, filter census and
   G8 measured, not "framed only"). Gate: `git grep keys-ring src` = 0 at fold.
5. **M16 one sentence per control.** aria-label "what the keys do" vs hover note "what each key does":
   pick one (the chair's or yours). Gate: `check-copy-register` bare 0; label-in-name holds; one string.
6. **M16 G3 re-instrumented.** Bound each frame's step by the predicted per-frame step of
   `cubic-bezier(0.33,1,0.68,1)` at the rAF timestamp, not the curve's peak slope. Gate: max ratio ≤ 1.35
   in every cell; the first battery's chromium 4.3–23.6 explained or reproduced as instrument.
7. **M17 the line grammar (ARM A default / ARM B staged).** Replay `prototype/G-PANEL/prototype.diff`
   behind `LINE_SCOPE`; at the ruling ONE arm survives and the `line` prop has a reader or dies. Gate G1:
   `.new-game-zone` ≤ 320 at 1280×800 fine both engines (HEAD 503.19/504.16; expected ≈303; a +200 px
   plant must red). G3: the verb's bottom ≤ bar/lip top − 32 at scrollTop 0 (466 vs 595.64). G5: Deal vs
   dealt painted glyph bottoms |Δ| ≤ 1.5 at 1280 fine · 1280 coarse rest AND armed (armed by DIRTYING the
   board, not a DOM swap) · 390 settled. G8: card width |Δ| ≤ 0.01 and board.x Δ 0 vs both controls on the
   sudoku AND futoshiki payloads at 1024/1280/1440 fine + 1280 coarse.
8. **M17 `--zone-step` re-homed.** The registration moves into FACE's ONE `@property` block (chair
   §6.7/§6.8; index.css:163 on the lane's tree), `<length>`, inherits true, initial 0px, consumed bare at six
   sites. Gate: exactly one `@property --zone-step` in the served CSS; plant `--zone-step: 0px` → tape→h2
   reads 2.19 (RED fires); the inherited-value discriminator reads the ancestor's 13.6 on an invalid value.
   G4 closes at tape→h2 ≥ 13.6 · h2→chip 4.00 ± 0.3 · seam 7.2 ± 0.3 (reads 15.78 · 4.00 · 7.18).
9. **M17 the two comments re-derived.** "tape → name = rule air 13.6" (measures 15.78; rule→h2 13.09/13.59
   net of the border) and "a narrow rail wraps the receipt beneath (today's pose)" (a wrapped receipt lands
   left-flush) rewritten to the numbers. Gate: a text law match on both, both true.
10. **M17 G6 restated with the die named.** |die INK-left − h2 ink-left| ≤ 1.5 with the DiceIcon's ≈3 px
    viewBox inset and Fraunces' side bearing named in the row, or ≤ 0.5 earned without a negative margin.
    Reads 1.0 chromium / 1.0–1.5 webkit today. G2's size floor re-derived from INK (0.72/0.70 span-x,
    0.22/0.21 ink on three short words) — the chair sets the number; the lane doesn't move it.
11. **M17 the coarse rail (1280×800 hasTouch) as ONE grammar.** Today four layouts in one card (`size`
    2+1 with `16×16` orphaned on a 168 line, `level`/marks columns, checking 2+1). Build and FRAME the
    two arms (grown 2+1 vs a kept column for three-value groups at coarse) as ballot T9-B20; Deal above the
    fade at scrollTop 0 on the coarse rail (reads 625.27 > 595.64 — RED). Gate: one arm per group class,
    stated; verb bottom ≤ fade top.
12. **M17 the declared trades.** (a) Deal's fine hit box 71.19 → 60 (−16 %) against M01, and the phone
    verb's 0.75rem gutter vs the strip's 0.5rem — declared in the return with a before/after crop, or
    reverted; (b) the 430×932 sheet top and W2 drawer tab +32.79 (webkit bar −0.28) declared with a crop
    (the deck π by construction: every deck `OptionSelector` passes `mobile`). Gate: G11's declared-delta
    list names both; the owner sees the 430 pose.
13. **M17 the tests fold with the product.** `PROPOSED-visual-regression.diff` (8b re-aimed to x: seam
    ≥ 7.15, baseline ≤ 1.5, intersection 0, growth control +200 not +120 — +120 cannot red on a rail
    sparing 109.9 px; test 10's control EXTENDED to the line arm, the deal grid, the pair) lands in the same
    commit; test 10's PANEL_H stamp is the chair's ONE act (shipped 1105.53/1106.50; extended control
    1313.88/1315.02 vs the 1227.5 seal — both numbers reported, nothing stamped by the lane). Gate: 8b RED
    on HEAD (−81.16), green on the tree; the whole `visual-regression.spec.ts` run both engines.
14. **M17 row 9's PRM cut at the chip.** The 150 ms colour tween runs under `prefers-reduced-motion:
    reduce` on HEAD and both arms (`color 0.15s`). Gate: computed transition-duration 0s under reduce, both
    engines; the re-injected `transition: color 150ms` plant must red. (Your existing charter row 9; G13's
    second read.)
15. **M17 ballots T9-B16–B19 framed at the m17 cell** (chromium · light · 1280×800 · fine, one payload, one
    variable each): ARM A/B (c2 shows both), receipt beside/under (c1 panels 2/3 — "under" reads 342.03,
    not the adjudication's 336.0), marks 2+1/kept column (the kept column BUILT, not described), intrinsic/
    grown chips (c1 panels 2/4). Gate: eight frames on disk, each naming engine · theme · viewport · pointer.
16. **M17 AA as a distribution.** Painted contrast per LAWS P4 as a column distribution at 2× both themes:
    the muted chip and the Deal sublabel read a flat 4.66 light with 7–14 % of edge columns under 4.5.
    Gate: median ≥ 4.5 AND the under-4.5 share stated; a 40 % ink plant must red.
17. **M18 (with TAPE/RULE): the case-wide occlusion gate as an estate spec** reads the edge: ∩(any
    out-of-flow layer, live control) = 0 over the whole case with the lip landed and the crib open; the
    stroke hierarchy stated as TWO weights (case 3 · compartments and strip 1.5) unless T9-B12(b) fires.
    Gate: the spec in `e2e/`, RED on HEAD for the crib-under-bar case, green on the merged §10 tree.

### CTRL-TAPE (78; the foot's mover; COST's grafts bind through it) — M18 + M16's foot arm

18. **M18 the split + the lip + the foot-hung fade**, replayed from the G-BAR diff (worktree `-21`):
    `.controls-card` a two-row grid in every regime, `.card-body` the scrollport, `#card-foot` holding the
    `Teleport`ed bar inside `<HandDrawnOutline :stroke-width="1.5" :outset="4" :radius="3" :pose="0">`;
    `.card-foot::before` the 32 px fade over the body's padding box (150 ms moved un-retimed); the sticky
    block, the skirt, the slab background, `--card-pad-b`/`--action-bar-h` and `scene.css:264`'s `var()`
    fallback dead (static `scroll-padding-bottom: 2rem`); `.legend-fold { contain: layout }` in the SAME
    commit (co-signed by FACE — 94 px of blank scroll without it). Gate R3 (r0 probe, the chair's re-cut):
    a `<HandDrawnOutline` inside the bar's box AND no border longhand > 0 — GREEN. G1: coverage lip shown
    vs hidden 1.00 on four sides at every rail and dock cell, both engines both themes (landscape read with
    a band wider than the side's wander, ≥ 12 css). G2: 0 ink in the census's 7 px flanks + 2 px above at
    EVERY scroll pose (the critic's sweep: 0 of 101; HEAD 84 of 87). G6: border widths 0 on every non-`kbd`
    strip descendant. G7: card/board/masthead identical to the hundredth at 1280/1024/1440 both engines
    vs BOTH controls (main-HEAD is the second, W8 touched the panel).
19. **M18 the named deltas, declared with crops.** Dock strip up 4 (pad − 6); **430×932 card +12** (not +4;
    the sheet, tongue and handle rise with it; board unmoved); **landscape 844×390: bar +8 in flow, play row
    +18.41, scrollport 302 → 296 (−6), scroll range 441 → 459 (+18)**; the landscape fade relocated onto the
    scrollport's last 32 px over the play tools (3 tag paint deltas); coarse rail: the play row now in the
    body above the strip. Gate: the return's G7 table lists each with a before/after frame; the chair rules
    which are paid back (G-PANEL's dock deal row −32.79 at 430 is the natural payback).
20. **M18 the foot on the inset (chair §6.1) with headroom.** `padding-bottom: max(<pad>,
    env(safe-area-inset-bottom))` landed; the lip's lowest ink ≥ 2 css above the viewport bottom WITH a
    margin the chair rules (WebKit 430 reads exactly 2.0 at 0.625rem, DPR 2; 0.5rem refuted at 0–1.0) — read
    at 0.625rem AND 0.75rem, at DPR 2 AND 3, 390×844 + 430×932 hasTouch settled, both engines; the RUNSHEET
    line (evidence/w8/device/RUNSHEET.md, the chair's file) proposed for the real iPhone's home indicator.
    Closes when the smaller pad that clears 2 + margin is stated and `env()` is in `scene.css` ≥ 1.
21. **M18 the notes vs the lip's stroke.** Each rail hover note's top vs the lip's PAINTED bottom stroke
    (paintedExtent), not its box: today 2.4–3.8 css above the svg's bottom edge (tape over the stroke band;
    HEAD 0.2–1.57 below the bar). Gate: 0 px² of note over the lip's ink, or the berth re-homed by the
    lip's outset; the G11 spec two-sided (a note over a verb REDs) with a negative control.
22. **M18 G4 re-worded by the chair, not the lane.** "8 ± 0.75 stroke-to-stroke" matches no pair of wells
    as painted (wells 16.6–17.1 at a 16 px box gap; the lip 13.5–14.0). Proposed: box gap = inter-well box
    gap ± 0.5 AND painted daylight ≥ 4 css in every column between the last well's bottom stroke and the
    lip's top (reads 15.92–16.36 · 8.5–9.5 rail, 7.5–9 dock, 4.5–5.0 landscape; the struck-gap control
    0.5–1.5). The lane carries the ruling, the chair writes it.
23. **M18 the spec's controls re-cut.** tool-strip G1's control asserts the positive (strike the
    `HandDrawnOutline` → R3 RED), zone-grammar :323's control strikes `display: grid` alone (not a hand-placed
    `top: 100%`), G11 two-sided, G13 asserts ink ≥ 2 with a control. Gate: every row in
    `e2e/tool-strip.spec.ts` has a control that changes the verdict; born-RED 11/11 on HEAD reproduced.
24. **M18 code at fold.** `footRegime` composed from the singletons (`rowRegime || portraitDock`), no
    per-mount `matchMedia` listener; `?lip=tab` gone from product source when T9-B12 fires; `index.css`'s
    theme-turning ground list without `.action-bar` (no slab). Gate: `git grep 'lip=tab' src` = 0; one
    `matchMedia` per regime query in the module.
25. **M16's foot arm re-read.** With Row A landed on the foot: G1–G5 of FACE's row 1 re-read in the foot
    arm; G16 the lip's path `d` byte-identical with the crib closed vs open (0 `HandDrawnOutline` re-bakes on
    open — the crib rises above the lip); the wells' 4 px outset flank ink beside the OPEN crib 0 (the slab
    is gone; G-INFO measured 146.8–170.6 px on the sticky arm). Gate: `d` equal; flank 0 both engines.
26. **M18 the estate rows the move exposes.** `visual-golden`/`visual-regression` pixel rows near the card
    bottom re-minted from the runner artifact per golden discipline (never on a single red); the pre-existing
    `viewport-law:396` §2.5 tape-over-chip red (RED on HEAD too) named, not absorbed; T9-D1's covered-surface
    row follows the bar into the foot. Gate: goldens 4/4 on the served dist both engines; the §2.5 red's
    HEAD twin cited.

### CTRL-RULE (68; co-mover) — M18's form and pad

27. **T9-B13's arm (b) framed or conceded.** One drawn top rule (`RuledLine`/`HandDrawnOutline`, never a
    border longhand — L5) on the same encoded payload at the two G-BAR cells (chromium · light · 1280×800 ·
    fine scroll end; webkit · light · 390×844 · coarse scroll end), or the return says arm (a) fires
    unframed-against. Its own 1.4.11 red (1.638/1.651 light) is why the rule isn't the default. Gate: two
    frames on disk or one sentence.
28. **The foot pad ≥ excursion + 2 css.** RULE's 0.15rem foot clips any drawn edge; `scene.css:264`'s
    `var(--action-bar-h, 0px)` dies to the static 2rem (its registration-block row). Gate: no `var()` fallback
    on a measured token in `scene.css`; the lip's lowest ink clears the foot's edge by ≥ 2 at every cell.
29. **The sideways scroll at the coarse rail** (its existing row, now with a second culprit): `scrollWidth`
    282 ≠ `clientWidth` 218 at 1280 hasTouch on HEAD and every arm — the hidden `.zone-hint` washi tapes
    overhang 14–64 px. Gate: `scrollWidth === clientWidth` at 1024/1280/1440 fine AND 1280 coarse.

### MOT-VERB (§13 leader, 78) — M15 + M19 (on the one §13 tree, after LADDER's delta)

30. **M19 THE FOLD.** `flipTransform(first, last, parentScale)` dividing the translate by the ancestor
    `--live-fit`; `run(movers, { holdFirstFrame })` pending `startTime` **for the fold only** (G-M4: confine
    it, or read the unfold's +22–26 ms latency on painted frames and justify it); `.is-folding` lifting the
    slot's clip and the centre card; the z-order cure fold-only (`.live-face-fit` z 2; the staging band
    isolated) — the chair rules the beyond-brief deltas. Gate GA1: frame-1 centre ≤ 3 px both engines both
    themes at 1280 fine + 390 coarse (reads 0/0 chromium; webkit 0.1–3.0 — marginal, re-read). GA2: painted
    visible fraction 1.0 every fold frame (the rAF read; the painted metric is void). GA3: the first PAINTED
    frame at FIRST ≤ 3 px on chromium screencast AND webkit recordVideo (missing today). GA4: painted
    intervals ≤ 34 ms in +200…+800, 0 encodes inside the fold (webkit 1–2 frames > 34 today, parity with
    HEAD interleaved). Drawer.spec 8/8 (parentScale 1 byte-identical).
31. **M19 the lift's π (G-M3).** The scrollport lift must not make the document scrollable: `overflow-x:
    clip` on the lifted viewport (y visible) in place of `overflow: visible` + `clip-path`, or the lift
    re-formed. Gate: `document.scrollingElement.scrollWidth === innerWidth` on EVERY fold frame, both
    engines, 1280 fine + 390 coarse (reads 1872/1603 today; a `scrollTo(400,0)` per frame must stay at 0);
    a classic-scrollbar chromium regime added; the lift at a non-zero deck index (kenken) re-read.
32. **M19 THE UNFOLD.** FIRST = the painted face (`.board-peek-host` live / `.game-card-face` poster;
    `centerCardEl()` dead); the leaving deck pinned `position: fixed` at its pre-flip rect in `@before-leave`
    (PRM skips the pin); `.board-group.is-unfolding` z 1; the gallery leave on `MOTION.chromeLeaveMs` over
    `--ease-glassGlide`. Gate GA5: frame-1 anchor ≤ 2 px (dy, dw) vs the painted face, live AND poster
    (reads 0/0/0 live; **the poster exit is 1 mover + a 632 px cut in both arms — pre-existing, now yours**).
    GA6: centre card height constant ± 1 (407.9 / 357.8) while it fades; 390 coarse 0 steps > 20 px after
    frame 1; the wordmark h1 the same; the in-flow ablation brings the 135 px drop back. GA9: a re-press
    mid-verb settles with 0 style writes over three still frames.
33. **M19 the fallback that isn't (G-M5).** `Number(el.style.getPropertyValue('--live-fit')) || 1` goes;
    an unset fit takes the cut. Gate: with the fit unset the verb is a same-frame cut (0 movers), never a
    divide-by-1 glide; the census's 92.7 px cannot return silently.
34. **M19 the held wordmark (G-M8).** The unfold rides a 0.72-size bake scaled 1.39× for 520 ms and
    re-bakes at settle (4 encodes at +515 in one WebKit read). Gate: a painted crop of the wordmark
    mid-unfold vs its rest raster at matched scale, max channel Δ stated; the settle's landing frame ≤ 34 ms
    both engines; or the label bake pre-warmed before the verb.
35. **M16 escalation M1 (only if FACE's row 2 leaves the residue above control median + 1 on a quiet
    box).** One layout step + a `useFlipGlide` transform slide of the crib with split grounds and a riding
    fade; no re-time, no re-curve; PRM a cut. Gate: FACE's G6 at ≤ control median + 1, quiet box, n ≥ 8.
36. **M15 the cold flip cured at the cause (arm A, the GRID half).** Theme-free coverage bakes with
    theme-free cache keys (`HandDrawnGrid.vue:233`'s `isDark` term dropped), the grid's ink painted live
    through the A2 CSS-mask layer (`div.grid-ink` outside the svg — the chair rules the tag change); the
    "masked by the toggle's Bloom" comment at `:179–180` struck; the Bloom's warp and numbers VERBATIM;
    `MOTION.dealStaggerMs 90` consumed at `GameGallery.vue:372`. Gate GB1: cold first flip both engines both
    directions both boots: incoming born ≤ 0.30, no painted interval > 34 ms in +0…+900, Δscale ≤ 0.08/frame
    (reads 0.20–0.28 / 13–47 ms chromium; 44 ms / 0.195 webkit quiet round; HEAD 104–291 ms). GB2: 0
    image-blob encodes, 0 `href` mutations AND 0 `.boil-frame-bitmap` style mutations in +0…+1100 (the
    critic's counter closes A2's href-blind hole; HEAD 16/8/0). GB3 grid: max channel Δ ≤ 1/255 at rest vs
    HEAD, painted bytes, both themes both engines — **WebKit light reads 9 over 138,923 px (−0.85 % ink), a
    tone shift**: earn ≤ 1 or the chair rules the tolerance as a number (nobody picks the px > 4 threshold).
    GB4: T4-P1's idle gate holds (idle ≥ 97.6, long33 0); filter census = control; the raster union ± 2 %
    during the fold MEASURED (unmeasured today); the during-fold filter parity read on HEAD too.
37. **M15 the WORDMARK half is BLOCKED under M09 (G-M1) until an ink path holds ≤ 1/255 in both engines.**
    Arm A1's in-SVG mask costs Chromium its anti-aliasing at rest (Δ 73–75; px > 16 = 2,668 light / 4,325
    dark; stair-stepped edges at 3× — the 2026-07-31 logo LOW-RES family re-opened). Until then the wordmark
    keeps HEAD's theme-keyed bake and only the grid takes A2. Candidates (W6's row 42): a device-px mask, a
    mask `<image>` with an explicit resolution, `warm()` on pencil-boil 0.12.1. Gate: GB3 wordmark ≤ 1/255
    both engines both themes, painted AA equal; `holdBake` for the verb's length kept.
38. **M15 arm A's standing price goes in the ballot text (G-M9 / M15-b).** WebKit warm flip 36–37 ms vs
    HEAD 30–32 (1 frame > 34 per flip); PRM flips 37–48 ms on EVERY flip vs HEAD's warm 32–35. Gate: measured
    on the lane's tree and main-HEAD, interleaved, quiet box; stated in T9-B22; the W8 RUNSHEET row proposed
    (the owner's iPhone, the cold flip and the fold).
39. **M15/M19 the spec estate moves in the same commit (G-M6).** Six specs select `image.*`
    (`visual-golden`, `visual-regression` ×5 sites, `gallery` CH-67, `wordmark-integrity`,
    `multiplayer:476,533`, `theme-bake-freshness` — 20 fails; rewritten to assert PAINTED ink, since the
    blob is now theme-free coverage); `src/probe/devicePaint.ts` (W8's boot-seam instrument) counts divs
    where it counted SVG images — a W8 row. Gate: the estate's own configs green on the served dist both
    engines (no patched copies); vue-tsc and vitest bare on the final tree (G-M11).
40. **M15/M19 the instruments become estate specs (P5-GATES).** The painted-frame recorder (CDP
    `Page.startScreencast` chromium; `recordVideo` webkit) as the PRIMARY read for every compositor mover;
    the 300 ms busy-loop stall injector at gesture +100 (GB6: ≥ 4 painted poses of the incoming body inside
    the stall — RED by construction under the vector warp; T9-B22's gate); GA7 a discriminating metric at
    1280 (the 32×32 painted-centre SSIM) or struck; GA8 in a regime that scrolls (844×390 or 568×320, or a
    planted height); rAF-only compositor gates struck. Gate: each in `e2e/`, each with a control that
    changes the verdict.
41. **M15/M19 PRM stays a cut, cold too (GB7).** 0 movers on both verbs (conforms today); the toggle's PRM
    cut with no frame > 34 ms cold both engines (HEAD 175/191 chromium, 783 webkit; the prototype 19.9–34.8
    chromium but **37–48 webkit every flip** — row 38's number).

### MOT-LADDER (74; the ladder, delta applied first on the one §13 tree)

42. **`--live-fit` in the ONE `@property` block** at file scope in the first static stylesheet
    (`syntax: '<number>'; inherits: true; initial-value: 0`), consumed bare (`scale(var(--live-fit))`, no
    `, 1`), the JS `|| 1` twin struck (row 33); `--deck-top` NOT registered (the pinned leave uses inline px).
    Gate GC1: the ablation on a declaring host shows the empty face both engines (a 640 px board spilling on
    HEAD); `lint:motion` bare; the §2.11 undefined-token census over the diff.
43. **The rungs homed.** `MOTION.dealStaggerMs = 90` (GameGallery.vue:372's literal), `App.vue:1228`'s 200 ms
    → `MOTION.chromeLeaveMs`, the crib fold's 200 ms (`GameControlPanel.vue:2291`) and the foot fade's 150 ms
    named as rungs through the `--motion-*` publisher — none re-timed. Gate GC2: no timing literal outside
    `pencilConfig` in the §10/§13 diffs; B6/`lint:bands` see the toggle's lengths; `lint:bands` BARE 0.

### MRK-ABS (74; the ring token)

44. **G-ABS-3's `.info-btn` dark row (2.92; 2.61/2.42 riding B8) loses its subject** when the CSS ring
    dies. Replacement read: the open "i"/"keys" painted at 2× both themes (Row B reads 15.84 dark / 19.22–19.45
    light open; 4.66 / 7.68 at rest). Gate: the row re-aimed at the painted glyph; the 4.66 rest reading
    holds ≥ 4.5 with its distribution stated.

### Crossings (not loop families; the chair routes)

45. **W2 (gallery mechanics).** The scrollport lift is W2's gallery (row 31); `GameCard.vue`'s slot clip
    and the deck's leave are W2's landed mechanics moved fold-only; the 430×932 drawer tab +32.79 (M17) and
    the landscape scrollport −6/+18 (M18) touch W2 §2.2/§2.3 — declared, framed, ruled.
46. **W6 (pencil substrate).** Rows 36–38: the wordmark ink path (G-M1), the grid's WebKit tone shift
    (G-M2), the `warm()` seam on pencil-boil 0.12.1 as the fallback arm (built only if the mask arm fails
    GB3/GB4), M15-b's attribution of WebKit's warm-flip cost along the Vue `isDark` path (a Safari timeline,
    not headless — no osascript; the owner runs it).
47. **W8 (device RUNSHEET).** Two owner-run iPhone rows under arm A (the cold flip; the fold); one row for
    the lip's bottom stroke above the home indicator (G5); `devicePaint.ts`'s census semantics.
48. **PLR-PLACE.** The 430 sheet-top delta (+12 from the foot, −32.79 from the deal row — net stated) and the
    390×664 / short-landscape laps, unmeasured by anyone.
49. **The chair.** (a) T6-mark-8's reversal booked (the receipt beside the verb); (b) the one-home
    `@property` ruling applied to `--zone-step`; (c) ARM A vs B for M17 if the owner doesn't; (d) test 10's
    ONE stamp at the §10 fold; (e) the R3 probe stays as re-cut; (f) DOM vs rendered "tag list" for coarse π
    (G-INFO's unrendered fold inside the bar); (g) the kbd exemption (7 keycaps' CSS borders under law 37);
    (h) G4's re-wording (row 22) and G5's margin (row 20); (i) the named deltas (rows 19, 12b); (j) A2's tag
    change, the scrollport lift and the z-order cure (M19); (k) GB3's WebKit grid tolerance if ≤ 1 isn't
    earned; (l) the L5 ruling on a card-coloured box-shadow is NOT owed (refused); (m) the ballot numbers
    below; (n) the G-BAR evidence copied to `prototype/G-BAR/` before batch 3.

---

## 8 · THE BALLOTS (the owner's, at the re-look; both arms, frames named; defaults fire only on the owner's silence per DISPOSITIONS)

Numbering PROVISIONAL from T9-B12 (B10 is VERB's, B11 LADDER's — pass-5 rulings §1.3); the chair
assigns. Every pair is re-shot by the owning lane on ONE encoded `?board=` payload with one variable
before it goes up (§2.9); the frames named here are the intake's, on main.

**T9-B8 — the tool strip (T9-M04/M18).** ANSWERED by the owner's eye: the bar STAYS and wears its edge
in the house hand; the deletion arm is DEAD. The FORM (the bar in `#card-foot` inside a `HandDrawnOutline`
on the safe-area inset) is built and measured on main (§5). What the owner still decides is B12/B13.

**T9-B12 — M18, the pen.** (a) DEFAULT: the wells' — `HandDrawnOutline` 1.5 / outset 4 / radius 3; the
strip a fifth compartment, its side strokes on the wells' x (|Δ| ≤ 0.29), two weights in the card, focus
rings clear both engines. (b) The tab's — 2.5 / outset 3 / radius 0 (`DrawerTab.vue:65`'s pair); the strip
"reachable chrome" drawn with the tongue's pen; strokes 0.9–1.15 px inside the wells'; a third weight 24 px
inside the 3 px case edge; WebKit's fourth focus ring touches it (15–17 px²). Frames two-up:
`prototype/G-BAR/c3-chromium-light-1280x800-fine-scrollend-twoup-lip1.5-vs-2.5.png` and
`c4-webkit-light-390x844-coarse-scrollend-twoup-lip1.5-vs-2.5.png`; the m18 pose at
`c1-chromium-dark-1280x800-fine-leakpose-lip1.5.png` (HEAD twin `census/panel-bar/c3`). The owner's eye
also on c1's stack — divider, the incoming well's dissolving top stroke, the lip — which the critic reads
as a double rule at the leak pose.

**T9-B13 — M18, the form.** (a) DEFAULT: a closed drawn frame (built; on the phone the case's strokes are
off-screen, so this is the only drawn edge at the bottom of the glass — `c2-webkit-light-390x844-coarse-dock-leakpose-foot-on-pad.png`).
(b) CTRL-RULE's one drawn top rule ("in some way" read literally; L5-lawful; sides and foot open against
the glass on the dock; RULE's own 1.4.11 reads 1.638). UNFRAMED — RULE frames it on the same payload (row
27) or (a) fires unframed-against.

**T9-B14 — M16, the "i" once its CSS ring dies (one hand per strip).** (a) DEFAULT: a fifth verb in the
strip's grammar — glyph "i" in the hand at `--icon-verb`, sublabel "keys", hover note "what each key
does", the scribble underline as the open cue, the `1fr auto` trailing track dies; min verb gap 7.59/8.92
at 1024×768 (HEAD 11.91/13.52); rest ink 4.66 light / 7.68 dark. Frames: open
`prototype/G-INFO/c1-chromium-light-1280x800-fine-open-from-top.png`; rest
`critique/G-INFO-k1-webkit-light+dark-1280x800-fine-rowB-rest-vs-head-2x.png`. (b) The "i" keeps its
trailing track and wears a DRAWN 28 px ring (`HandDrawnOutline` 1.5 / outset 2 / radius 14 / pose 0) — two
drawn hands in one strip once the lip lands; framed only, open cue colour-only, π/AA/filters unmeasured:
`c3-chromium-light+dark-1280x800-fine-ring-arm-strip-rest-open-2x.png`. Either arm lands in the SAME
commit as the ring's death (G-BAR leaves the "i" naked at 72–79 device px of ink).

**T9-B15 — M16, "scroll" vs "no scroll" (the owner's word is "scroll").** (a) DEFAULT: no scroll — the
crib arrives where the "i" is, on the strip's paper, panel scrollTop Δ 0, one clock, 19/19 visible (c1).
(b) The literal reading — the crib stays in the scroll body and the panel scrolls to its SETTLED height
(the census's counterfactual `census/info/c3-chromium-light-1280x800-fine-counterfactual-scroll-after-settle.png`:
1.000 visible, 8 px above the bar; two clocks under M09; strands the crib behind the B8 foot). (b) is
booked only on the owner's word.

**T9-B16 — M17, one grammar.** (a) DEFAULT ARM A: `OptionSelector`'s line arm component-wide — checking
one line, marks 2+1 at HEAD's face — a declared delta on two live wells the m17 frame doesn't show. (b) ARM
B: a staged-only `line` prop — live wells byte-identical, π-strict, the card keeps two rail grammars (the
M05 disease the §10 fold exists to cure). Frame: `prototype/G-PANEL/c2-armA-live-wells-head-proto-webkit-dark-1280x800-fine.png`
(HEAD = ARM B's wells; ARM A's `Center` orphan and the misaligned columns visible).

**T9-B17 — M17, the receipt BESIDE the verb (T6 mark 8's reversal, the chair books it).** (a) DEFAULT:
`Deal … dealt |||` on one baseline, ink gap ≥ 19 px, zone 303.25/304.22. (b) UNDER, as today: zone
342.03/343.17; the dock's deal row stays 117.77. Frame: `c1-m17-head-proto-b2under-b4grown-chromium-light-1280x800-fine.png`
panels 2 vs 3.

**T9-B18 — M17, the marks well (CONDITIONAL — only if the marks band still wraps at the fold's face).**
(a) DEFAULT: the 2+1 wrap (`Center` orphaned on line two at every fine rung at HEAD's 302.4). (b) A kept
column for that one group (under FACE's padding-0 chips 230.4 fits every rung and the ballot is struck).
(b) UNBUILT — FACE builds and frames it (row 15) before the eye; c2 shows only (a).

**T9-B19 — M17, fine-rail chip boxes.** (a) DEFAULT: INTRINSIC (word + 24; 60–96 × 38, the phone's chip;
the fine hit box shrinks from 268.22 × 38 — M01 "larger targets" is the owner's). (b) GROWN to fill the
line (three ≈84.6 px cells, words left, scribble under the word). Frame: c1 panels 2 vs 4.

**T9-B20 — M17, the coarse rail (1280×800 hasTouch, iPad landscape).** (a) grown 2+1 wraps for every group
(today `size` 2+1 with `16×16` on a full line; `c3-coarse-rail-head-proto-armed-chromium-light-1280x800-coarse.png`)
vs (b) a kept column for three-value groups at coarse (today's `level`/marks). NO default — four layouts in
one card is the M05 disease; FACE frames both (row 11).

**T9-B21 — M19, the deal under the sheet.** (a) DEFAULT: on enter the flanks deal from under the shrinking
board on the existing 0.42·520 + stagger clock (the neighbours revealed as the board becomes its page).
(b) The deal waits for the settle (the deck dealt onto a still page). One class; frames at chromium ·
light · 1280×800 · fine — UNFRAMED by the intake (the prototype's c2 shows only (a) at +282/+520).

**T9-B22 — M15, who plays the Bloom.** (a) DEFAULT, built: the vector warp inside the filter stays (§2
crispness contract, the soul gate, filterBudget 9); the flip's OWN work no longer stalls it (cold 104–291 ms
→ 13–47 ms both engines); any OTHER main-thread stall still freezes it (GB6 RED by construction); **the
measured price: WebKit warm +5 ms (36–37 vs 30–32, 1 frame > 34 per flip) and PRM flips 37–48 ms every
flip vs HEAD's warm 32–35 — on the engine the owner audits on**; the wordmark half blocked until G-M1.
Frame: `prototype/G-MOTION/crops/c1-m15-toggle-cold-flip-chromium-light-to-dark-1280x800-fine.png` beside
`census/motion/c1`. (b) Opus's flight sheet: a 1.08× compositor raster per body, continuous under any
stall, at the price of a raster crest (native 1.0802, soul-gated ≥ 0.983), park 0.06 → 0.182, the twist
re-timed onto the glass at 520, the live filtered pair 9 → 7 (law 9 exact-match moved), ≈6.5 MB GPU at
desk DPR 2. Framed on paper only; built on the chair's or owner's word.

**T9-B23 — M15, the ink at the flip under arm A.** (a) DEFAULT: the grid's and wordmark's ink SNAPS to the
new theme at frame 2 while the five grounds dusk over 350 ms (the code's documented intent; zero paint
cost). (b) The ink JOINS the dusk (a fill transition on the masked layers under `html.theme-turning`: 4
masked 1272² repaints per frame for 350 ms, against P1-W3's +23.5 fps narrowing). Today the ink lands
late and pose by pose, so neither arm is what the owner has seen. Both to be framed at chromium ·
light→dark · 1280×800 · fine by VERB; (a) is what c1 shows.

---

## 9 · Gaps the fold carries whole (a gap is a gap)

- No real Safari or iOS anywhere (M19 forbids osascript / `open -a Safari`); every WebKit number is
  headless Playwright's proxy. The box was never quiet (load 6–42; one spike to 109): every G6/GA4/GB1 warm
  reading is a loaded-box reading, and only the interleaved A/B rows discriminate.
- Every prototype was dev-tree source built to a dist and served by `vite preview`; no production pass,
  no goldens re-minted, no owner-run device row.
- Four prototypes, four `?board=` disciplines: G-PANEL two stated payloads; G-BAR one; G-MOTION one
  (the census's); G-INFO none (each arm dealt its own default — π matched to the hundredth anyway).
- The intake prototypes are arms on main; the owning lanes' trees sit at `74a2b5d9` and every number is
  re-measured there and on main-HEAD (§1.5). Nothing here is a lane's number.
- Nothing retires T9-M15, M16, M17, M18 or M19 (U-10). The owner disposes at the re-look.
