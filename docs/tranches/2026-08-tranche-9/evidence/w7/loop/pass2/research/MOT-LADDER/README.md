# MOT-LADDER — pass 2 · RESEARCH

T9-W7 §13 · the duration ladder, absorbing MOT-DERIVE. Leader of §13 at 72.

Every number below was measured on this machine during this pass, read-only on product files.
Served dist: the main tree's `dist/`, **identity `index-9rZPzI5DEcpe.js`, md5
`b1066df72be999af4e8c109238257085`** — the dist W8 §8.1 has FIXED; nothing was rebuilt.
Static server on `127.0.0.1:4246`, killed before this return. Gates were run **bare** (a pipe
eats the exit code). Instruments in `instruments/`, raw readings in `data/`.

Tree HEAD `a8fee1f5`; the wave's base is `aab67b92` and `aab67b92..a8fee1f5` is **docs-only**
(3 files, 163 insertions) — so the pass-1 prototypes' base is still a valid source-identical
anchor for B6.

---

## 0 · The three findings a synthesizer has to design around

**F1 · One dock constant cannot serve the band, and the audition picked the second-fastest
pose.** Auditioned across the band's ends, both engines, on one dist (§1).

**F2 · MOT-VERB's PRM-at-`:root` graft is dead on arrival against MOT-LADDER's own publisher.**
`publishMotionRungs` writes the rungs as INLINE custom properties on `<html>`; an inline
declaration outranks every author rule, so `@media (prefers-reduced-motion: reduce) { :root {
--motion-*: 0ms } }` never applies. Measured in BOTH engines, identical strings (§3).

**F3 · The banked choreography table describes a gesture that does not happen.** Pass 1 banked
`gallery OUT — board + wordmark unfold, throw · glass`. On the HEAD dist the board's mover is
born `finished` with `startTime` set exactly 520.000 ms in the past; the wordmark beside it,
created in the same `run()`, glides the full 520 ms. Mechanism and fingerprint in §6.

---

## 1 · THE DOCK BAND — auditioned at the ends, not at one pose

`dockGlideMs` is spent by `mobileDock = !rowRegime` (`useControlsDrawer.ts:135`), and
`rowRegime` is `(min-width: 1024px)` — **the constant governs every viewport under 1024 in both
orientations.** Pass 1 auditioned 390×844 alone. The one-dist hook
(`Element.prototype.animate` rewritten for `.scene-controls` movers) was re-run at the band's
ends against 520 / 600 / 680, 60 Hz-resampled, drawer-open:

| pose | travel | | 520 | 600 | 680 | desk control |
| --- | --- | --- | --- | --- | --- | --- |
| **768×1024** the FAST end | 681.0 / 681.5 px | first / worst px | 54.6 / **91.0** | 48.8 / **78.6** | 44.3 / **68.6** | — |
| 390×844 the audited pose | 628.0 px | " | 56.7 / 83.7 | 47.4 / 72.3 | 38.2 / 63.3 | — |
| **844×390** the SLOW end | 302.0 px | " | 27.5 / **40.3** | 22.8 / **34.9** | 19.6 / **30.4** | — |
| *1440×900 desk* | *209 px @520* | " | — | — | — | ***17.6 / 27.9*** |

webkit agrees within 5 % at every cell (`data/band-webkit-slim.json`); its raw rAF is 17 ms
against chromium's 8.3 ms, so the 60 Hz resample is doing real work and is validated across
two cadences. The desk control was taken on the SAME dist in the same hour and reproduces
MOT-DERIVE's pass-1 desk figures (0.402 px/ms, first 16.7 px, worst 27.2 px) to within 0.7 px.

**What this settles:**

- The audited pose is **not** the band's worst case. 768×1024 is 8 % faster on travel and
  reads a 91.0 px worst frame at 520 against 390×844's 83.7. A number ruled at 390×844 is
  ruled one pose short.
- **600 buys 13–14 % off the worst frame at every pose** (91.0→78.6, 83.7→72.3, 40.3→34.9) and
  five more painted frames. It is a real, uniform improvement, not a pose-local one.
- **600 takes the band's only >40 px frame to zero** — at 844×390, 520 paints one frame over
  40 px and 600 paints none.
- `framesOver40px` is **not monotone in duration** (768×1024 reads 7 at 520 and 8 at 600,
  because more frames are painted in total while each is smaller). Rule on the **worst frame**,
  never on the count. Pass 1's audition table reports the count.
- **No clock brings the dock to the desk's weight, and the numbers say how far off it is.** To
  reach the desk's ~27 px worst frame the band would need ≈1,607 ms at 628 px and ≈776 ms at
  302 px. The sentence has to be restated (§7).
- **680 is strictly better on every worst-frame cell.** The argument against it is not "drag on
  a surface the owner calls slow to draw (M06)" — that cite is wrong (M06 is W8's
  render-performance mark; the mark this family serves is **M02**). The argument that IS a
  number: at the slow end 680 runs 0.444 px/ms against the desk's 0.402 — the phone would
  cross a *shorter* distance at the desk's own speed, which is what reads as drag.

**The reframe pass 1 missed.** The desk's own gesture already ships a velocity spread on one
clock: `board-peek-host` 193 px (0.371 px/ms) · `.scene-controls` 209 px (0.402) · `.masthead`
317.6 px (0.611) · `.drawer-tab` 0 px — **a 1.65× spread inside the pose the owner audited and
approved.** "One clock, many velocities" is the estate's own law, not a defect the dock
invents. The dock's band spread (2.26×) is the same species, larger. That is the honest ground
for ruling ONE constant and **declaring the band's min and max travel on the travel line**
rather than minting a second member.

Declared travel line the synthesizer can lift verbatim:

    travel: 302px @844x390 … 681px @768x1024 (sheet) · 0.503…1.136 px/ms · the sheet's own
    height; auditioned at both ends against 520/600/680 on one dist, both engines.

---

## 2 · THE GATE — three checks measured weaker than their names, at pass 2's own HEAD

Run bare, `ROOT=` main tree, script from `wf_e58b4764-0fc-51` (`data/gate-at-HEAD-a8fee1f5.txt`):

    B1 ✗ 59 · B2 ✗ 4 · B3 ✗ 1 · B4 ✗ 1 · B5 ✗ 4 · B6 ✓ GREEN     exit 1
    84 duration positions, 0 on a rung, 81 literal (22 distinct)

**B6 still cannot fail.** It compares the working tree against `git show HEAD:<file>`
(`check-motion-bands.mjs:471-500`). CI checks out the commit, so HEAD *is* the tree. It reads
GREEN at a tree carrying 59 unnamed literals and no ladder at all. Anchor candidates, in order
of strength:

1. **A banked inventory JSON** — `--inventory` already emits exactly the right shape
   (`counts`, `ladder`, `declarations[]` with `rel`/`line`/`pos[]`). Bank it at the wave base
   and diff against it. It is a hand-written subject list, so per W8's intake §2 LAW it must
   carry a born-RED negative control (shorten one row in the bank, the gate goes RED).
2. The wave's base commit `aab67b92` as an explicit `BASE` ref, falling back to `HEAD` only
   when the base is not an ancestor. Cheaper; still blind on a rebase.
3. Both: the ref for the diff, the JSON as the negative control's fixture.

Either way the **self-test must call `b6NoShorten` itself** — the current case re-implements the
comparison inline over two `collectText` models, so seven sabotages prove the model and not the
shipped function.

**B3 is quote-sensitive, re-proved this pass** (`data/b3-sabotage-*.txt`). Planted in a scratch
copy of the branch source, `GameGallery.vue`'s root node:

    :style="{ '--motion-step': `${MOTION.rungs.step + 200}ms` }"   →  B3 ✓ GREEN   (640ms shadowing a 440ms rung)
    :style="{ "--motion-step": `${MOTION.rungs.step + 200}ms` }"   →  B3 ✗ RED 1

One character — `/["'](--(?:motion|card)-[a-z-]+)["']/` at `check-motion-bands.mjs:337`. The
idiom it misses is the one this family deletes: `GameGallery.vue:930` publishes
`'--card-step-ms'` in single quotes today. W8's intake already promoted this to a chronic-ledger
law (`intake-from-w7.md` §3 row 9: *gate regexes over SFC bindings must match both quote kinds*).

**B5 is file-level, and the estate's real PRM posture is not the one B5 asserts.** See §3.

---

## 3 · PRM — the rule-level roster, and the graft that cannot land

`instruments/reduce-rule-roster.mjs` walks the live CSSOM under `reduce`, keeps every style
rule that declares a duration AND matches ≥1 live element, and reads what the engine resolves.
On the HEAD dist, dock open, 390×844: **28 rules in chromium, 28 in webkit** — identical counts.
(Trap worth carrying: a modern `CSSStyleRule` also exposes an empty `.cssRules` for nested CSS,
so the style-rule test must precede the recursion or a walker counts zero.)

The top of the roster (`data/reduce-roster-chromium.json`), everything still tweening under
reduce at HEAD:

| live ms | in a PRM block | reads a var | live elements | rule |
| --- | --- | --- | --- | --- |
| 800 | n | Y | 2 | `.toggle-icon .warp` |
| 500 | n | Y | 1 | `.transition-[box-shadow]` (Tailwind) |
| 500 | n | n | 1 | `.duration-500` (Tailwind) |
| 250 | n | n | 1 | `.duration-250` (Tailwind) |
| 200 | n | Y | **17** | `.transition-colors` (Tailwind) |
| 200 | n | n | 1 | `.sparkle-icon` |
| 150 | n | n | **10** | `.icon-btn` — *the rung consumer the pass-1 diff re-points* |
| 150 | n | n | 8 | `.washi-label` |
| 150 | n | n | 11 | `.toggle-icon .twinkle-star, .dot-star` |
| 150 | n | n | **14** | `.duration-150` (Tailwind) |

**The estate already has a decided PRM posture, and it is not the family's.** `index.css:744-748`
ships `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important;
animation-iteration-count: 1 !important } }` with the comment *"kill looping animations but
allow brief transitions so that components can provide their own graceful reduced-motion
fallback."* The roster confirms it: every ANIMATION reads 0.01 ms; every TRANSITION above is
live, because `*` carries specificity 0 and loses to any class. So MOT-LADDER's "every rung
consumer collapses" is a **new posture**, not an enforcement of the old one. The synthesizer
owes a ruling, not a gate: either change the posture with a cite, or narrow B5's law to match it.

### THE CASCADE TEST — the graft's blocking defect

`instruments/reduce-rule-roster.mjs` also runs the composition question directly. Both engines,
identical output:

    ruleOnly        "0ms"     — a :root rule inside a reduce media block works on its own
    withInline      "150ms"   — the publisher's exact idiom (html.style.setProperty) BEATS it
    withInlineBang  "0ms"     — the same rule with !important wins back
    resolved        "0.15s"   — a consumer reading var(--x, 150ms) STILL TWEENS under reduce
    resolvedBang    "0s"      — with !important it collapses

`publishMotionRungs(document.documentElement)` (`pencilConfig.ts`, called from `main.ts` before
mount) writes inline custom properties. **MOT-VERB's "PRM as a value at `:root`" therefore has
no effect while that publisher stands.** Four landings, cheapest first:

1. `@media (prefers-reduced-motion: reduce) { :root { --motion-*: 0ms !important } }` — one
   keyword, measured to work in both engines. Costs an `!important` in the sheet.
2. The publisher consults `matchMedia('(prefers-reduced-motion: reduce)')` and publishes zeros,
   with a `change` listener. Moves a media query into JS; a live preference change is a
   one-frame re-publish.
3. The publisher emits a `<style>` element instead of inline properties, so the reduce rule
   outranks it by source order. Removes the inline-style seam entirely and keeps the PRM
   decision in CSS. **Recommended** — it also removes an inline `style` attribute from `<html>`,
   which the `:root` selector then owns alone.
4. Publish onto a class (`html.motion-rungs`) rather than inline — same cascade win as (3),
   one more selector.

Landing (3) or (4) also makes B3's "one home" claim enforceable by reading one `<style>` node.

---

## 4 · THE THREE VOCABULARIES OUTSIDE THE CENSUS — measured live

**Tailwind utilities.** `--default-transition-duration` resolves to **`.15s`** at `:root` — a
duration home nobody in this estate names, shipped by the framework. Live element counts on the
HEAD dist (`instruments/tw-tokens.mjs`):

| utility | live elements | resolved |
| --- | --- | --- |
| `.transition-colors` | **17** | `0.15s` · `0.2s` · `0.25s` (three lengths on one class) |
| `.duration-150` | 14 | `0.15s` = `whisper` |
| `.duration-200` | 2 | `0.2s` = `leave` |
| `.duration-250` | 1 | `0.25s` = `note` |
| `.duration-500` | 1 | `0.5s` |
| `.transition-[box-shadow]` | 1 | `0.5s` |

Sources, all six class attributes: `GameBoard.vue:328`, `GameControlPanel.vue:190`,
`AttributionCard.vue:45`, `OptionSelector.vue:52`, `StagingBand.vue:154`, `DebugToggle.vue:29`
(dev). **Cheapest correct cure: `:root { --default-transition-duration: var(--motion-whisper,
150ms) }` plus arbitrary-value utilities for the three overrides
(`[transition-duration:var(--motion-note,250ms)]`).** One token, no new mechanic, and it puts
17 elements' default length on the ladder in a single line. B1's sentence then has to say the
scope covers class attributes, and B1 has to read them.

**`usePathAnimation.ts:163` `duration: 150`.** A real shipped erase, and **it is already
PRM-armed** — `reducedMotion.value` short-circuits at `:146`, before the batch at `:169`. It is
numerically `whisper`. Admit it as a rung read (`MOTION.rungs.whisper`); the ladder already
reaches TS. No exemption needed.

**`DRAW_IN_PRESETS`** (`pencilConfig.ts:478-507`, at HEAD — pass 1 cited `:519/:526/:533/:540`,
which is the *branch's* numbering; the cite rotted between the lanes). Six consumers in five
files: `DifficultyTally.vue:148`, `GameGallery.vue:377`, `HandwrittenGlyph.vue:201`,
`usePathAnimation.ts:102-104`. Values 350 / 280 / 200 / 350 — `350` is `dusk`, `200` is `leave`,
**`280` is the only orphan, and it has a second independent home** (`AnswerKeyLaminate.vue:236`,
the laminate's lay-down). The branch's residual histogram already reads `280ms ×3`. So the
choice is honest either way: a seventh rung at 280, or a GRADED admission with the cite that
the stagger/jitter/baseDelay tuple is the design and the duration is part of it.

R6 covenant row #4 names "the CELEBRATION budget" in the same breath as the band keys, so this
tier is out of scope by nobody's reading but the gate's.

---

## 5 · THE RETUNE POLICY — `throw` 520's consumers, and what each was

The branch puts eight sites on one number. Five of them shipped **500 ms** at HEAD and were
lengthened to ride it:

| site | HEAD | branch | note |
| --- | --- | --- | --- |
| `useControlsDrawer.ts:86/89` `GLIDE_MS` | 520 literal | `rungs.throw` | **R6 standing ruling #1** — the drawer's audited settle, owner audit 4 |
| `App.vue:376` board fold | `boardFoldMs` 520 | `rungs.throw` | T4-W12 Wave C |
| `index.css:590` `.solve-success .grid-line` stroke | **500** | `var(--motion-throw,520ms)` | +20, and the curve moved to `--ease-drawOn` |
| `index.css:607` `.solve-success` box-shadow | **500** | " | +20, curve → `--ease-drawOn` |
| `SolveIcon.vue:70` `sparkleGrow` | **500** | " | +20 |
| `DiceIcon.vue:113` `diceRoll` | **500** | " | +20 |
| `HandDrawnGrid.vue:590` `.progress-trace` opacity | **500** | " | +20, curve `ease` → `--ease-standard` |
| `GameGallery.vue:371` the deal's delay | `round(boardFoldMs × 0.42)` = 218 | `round(rungs.throw × 0.42)` | a DERIVED delay — a retune moves it too |

So the gold flood, the sparkle, the dice roll and the progress bow-out now follow the DRAWER's
audited number, and none of the four was ever auditioned at 520. A policy has to say which
sites follow a retune and which are pinned. The shape the estate already uses is a
**pin-by-cite**: a site whose length carries its own ruling (R6 #1, RATIFY-ME T4-W12 row 4)
reads the rung *and records that its value is the ruling's*, so a retune of the rung is a
re-audition of that ruling; every other site follows silently. `GameGallery.vue:371`'s `× 0.42`
is the sharp case — W8 §8.1 routes it to this section by name (see §6).

**A curve census the diff does not declare.** Pass 1 sells lengths, but the diff moves curves
too: 13 removed declarations carried a bare `ease` / `ease-out` / `ease-in` / `linear` and 59
added lines carry a `--ease-*` against 34 removed. At minimum `.progress-trace`'s
`stroke-dashoffset 240ms ease` → `var(--motion-note,250ms) var(--ease-drawOn)`,
`.controls-card::before`'s `opacity 150ms` (no curve) → `var(--ease-standard)`, and
`.gallery-fade-leave-active`'s glassGlide → fadeOut. R4 records that **16 of 39 shipped
`transition:` declarations carry no house curve** — assigning them one is a real cure, but it is
a SECOND claim and needs its own row and its own ruling, or the family's "lengths, not meanings"
sentence is not what the diff does.

**The 240s.** R6 §48 records the guard ribbon at **240 ms** on `--ease-glassGlide`; the branch
spends `note` 250 at `GameGallery.vue:1474-1475`. A third 240 moves with it:
`HandDrawnGrid.vue:589`'s `stroke-dashoffset 240ms`, whose own comment at `:620-623` reasons
about 240 ms against J3's window. Note 250 ms is **exactly two boil beats** (`beatMs` 125, R6
law 7) and 240 is not — that is an argument FOR the move, and it belongs in the row that moves
the record. R6 covenant row #4 (`cardStepMs 440 / boardFoldMs 520 / chromeLeaveMs 200`) names
three keys this family retires. Both rows are proposed as diffs under
`pass2/<stage>/MOT-LADDER/instruments/` and reported **MOVED**; `r0/` is not written.

---

## 6 · W8 §8.1 ROUTED FOUR ROWS TO §13 — this family is the section's leader and owns them

From `evidence/w8/attribution/ATTRIBUTION.md`, the wave's frozen attribution:

1. **G7 — the tongue's berth swap** (line 68): a one-frame rect jump, **157–158 px chromium /
   130–136 WebKit on open**, 459.16 px on close but occluded ≈100 ms under the risen sheet.
   `GRAMMAR → W7 §13`. Neither pass-1 motion lane mentions it. It is a rect jump inside the
   gesture whose rung this family rules.
2. **gallery in** (line 94): `+558 DOM nodes mount on the fold's first frame; three clocks (CSS,
   WAAPI, pencil-boil rAF) coupled by a literal × 0.42` → `W7 §13`. The literal is
   `GameGallery.vue:371`, the exact line the pass-1 diff re-points and keeps.
3. **gallery out** (line 95): `UNDEFINED, and BROKEN ... NO TRAVEL 3/3, every engine; 5
   concurrent animations from frame 0; worst 42.5–68` → `W7 §13`.
4. **toggle whirl** (line 96): `W7 §13: the grammar has to survive a starved main thread`
   (6 frames at 4× CPU, **0 at 6×**).

**Also: the 4× first-open long frame is ALREADY ATTRIBUTED and needs no re-run.** ATTRIBUTION
G4: *"The drawer's first gesture rasters the sheet (it is `visibility:hidden` until opened: 80
paints vs 12)"* — CONFIRMED, cure **C08**, budget B3. Cite it and close the row.

### F3, re-derived here: the exit's board fold is a CUT, and the mechanism has a fingerprint

`instruments/exit-travel.mjs` + `exit-cut2.mjs`, HEAD dist, both viewports:

| | ENTER | EXIT (cancel and select read identical) |
| --- | --- | --- |
| 1440×900 `board-peek-host` | 168.4 px | 171.2 px |
| 1440×900 `logo-menu` | 319.1 px | 316.6 px |
| **390×844 `board-peek-host`** | 57.6 px | 43.9 px |
| **390×844 `logo-menu`** | **145.5 px** | **10.0 px** |

Both movers are declared. Then, in the microtask after `.animate()` returns, at
`document.timeline.currentTime = 3973.564`:

    board-peek-host   startTime 3453.564   currentTime 520   playState "finished"   (never paints)
    logo-menu         startTime 3973.564   currentTime   0   playState "running"    (glides 520ms)

`useFlipGlide.run` pins **both** to one clock (`useFlipGlide.ts:172-176`), so something
re-assigns the board's `startTime` to `clock − 520.000` — which is precisely what
`Animation.finish()` does to a running animation. The only `finish()` in scope is
`App.vue:456`, inside `restoreBoardAnims`, whose subject is
`document.querySelector('.board-peek-host').getAnimations({ subtree: true })`
(`App.vue:425-427`) — a scope that contains the fold's own mover and does **not** contain the
wordmark, which is why one cuts and one glides. `unfoldToBoard` (`App.vue:639-652`) calls
`moveLiveBoard(null)` at `:645` (which schedules the restore) and `runFold` at `:648`. **A
prototype lane must confirm the tick ordering by instrumenting `restoreBoardAnims`** — the
fingerprint is measured, the scheduling is inferred.

This is the mechanism under R4's banked headline 1 (*"The gallery EXIT does not animate the
board ... it cuts"*) and under W8's `NO TRAVEL 3/3`. **No duration ruling can fix it**, and the
pass-1 choreography table's `gallery OUT — board + wordmark unfold, throw · glass` is an
aspiration written as a record. Either the table says what runs, or the row cures the cut.

### One correction the §13 leader owes W8

ATTRIBUTION line 95 reads `glassGlide + linear + bare ease in one exit`. **`linear` is an
instrument artifact**: a CSS animation's `effect.getTiming().easing` is always `linear` — the
curve lives on the keyframes. Read properly (`instruments/exit-cut2.mjs`, desk, +90 ms):

| animation | type | ms | delay | the REAL curve |
| --- | --- | --- | --- | --- |
| `.washi-label` | CSSTransition | 150 | 0 | **`ease`** (bare UA keyword) |
| `.action-bar` | CSSTransition | 150 | 0 | **`ease`** (bare) |
| `.gallery-fade-leave-active` | CSSTransition | 200 | 0 | glassGlide |
| `controls-fade-in` | CSSAnimation | 250 | 150 | **`--ease-drawOn`**, not linear |
| `logo-menu` | WAAPI | 520 | 0 | glassGlide |

The defects that survive the correction are real and countable: **five animations from frame 0,
four lengths (150/150/200/400/520), three curves, two of them bare `ease`**, and the chrome
finishing at 400 ms under a 520 ms wordmark — a 120 ms tail where the wordmark moves alone.
That is exactly the §13 brief ("the gallery's in and out ... get DEFINED animations").

---

## 7 · THE SENTENCE, THE RUB-OUT, AND THE SECOND ENGINE

**The sentence (U-10 — bank the view, do not dispose).** `opacity var(--motion-leave, 200ms)
var(--ease-fadeOut)` reading as "leave, fading out" is the owner's. What is NOT the owner's, and
is disproved by this lane's own table, is *"the dock's rise reads at the desk's weight"*: 1.047
px/ms against 0.402 at the audited pose, and no clock in any sane band closes it (§1). What is
true and worth banking: **the dock's clock is its own named decision, seen against its own band's
ends.**

**ONE rub-out duration for §13.** Three numbers are in play and they are not independent:

| claimant | value | cite |
| --- | --- | --- |
| MOT-VERB's RUB OUT tuple | **200 ms** | the retired `--ease-fadeOut`'s points |
| NOTE-ERASE's note exit | **125 ms** | picked from internal ratio; 125 is also `beatMs`, R6 law 7 |
| `AnswerKeyLaminate.vue:225-226` the lift | **200 ms** `--ease-accelIn` | shipped |
| `usePathAnimation.ts:163` the grid erase | **150 ms** easeInCubic | shipped, PRM-armed |

`leave` (200 ms) is already a rung, already spent on the scene's own leaving fade
(`scene.css:617/629`) and already the laminate's lift. **125 collides with the boil beat**: R6
law 7 fences 125 ms as the shared raster cadence, and minting a *motion* length at the same
number invites a retune of one to move the other. The defensible ruling is
**`rubOut = leave = 200 ms`**, with NOTE-ERASE's 125 stated as a REJECTED candidate and the
reason given (the beat collision, not taste), and `usePathAnimation`'s 150 admitted as `whisper`
because it erases *strokes*, not a *note*. §7 then consumes the section's one number.

**`useCarouselGlide` owns the estate's second FLIP engine, and nobody claimed it.** It is not
`useFlipGlide`: `useCarouselGlide.ts:27-31,330-345` hand-rolls `t.animate()`, pins its own
`startTime`, and carries its own guard — **`SETTLE_GUARD_MS = GLIDE_MS + 200` against
`useFlipGlide`'s `+ 220`** (`useFlipGlide.ts:116`). Two engines, two backstop constants, one of
them unruled. §13's leader should either name the owner or fold the second engine's guard onto
the primitive's; MOT-DERIVE's `run(specs, durationMs?)` seam is what makes the fold possible.

---

## 8 · PRIMITIVES TO REUSE (name them, do not re-invent)

| primitive | where | what it buys this family |
| --- | --- | --- |
| `useFlipGlide(options).run(specs, durationMs?)` | MOT-DERIVE's seam, `useFlipGlide.ts:160` | a per-POSE clock without a second controller; the never-never guard re-derived per run |
| `publishMotionRungs(el)` | pass-1 `pencilConfig.ts` | the one publisher — **change it to emit a `<style>` node** (§3) |
| the one-dist audition hook | `instruments/dock-band-audition.mjs` | three clocks on one build, the desk provably untouched |
| the 60 Hz resample | same file, `walkStats` | headless rAF is ~120 Hz chromium / 60 Hz webkit; a raw per-frame figure is the rig's cadence |
| the paired HEAD control dist | MOT-DERIVE's method, ratified by the wave | lets a long frame be attributed to the estate rather than the diff |
| `--inventory` | `check-motion-bands.mjs` | already emits B6's anchor shape (§2) |
| `--empty-ledger` + SKIPPED-never-passes | same | handed to W5's gate wave; keep both |
| the runtime reduce roster | `instruments/reduce-rule-roster.mjs` | the shape B5 has to take, both engines, 28 rows |
| `MOTION.curves.drawerGlide` ≡ `--ease-glassGlide` | i3 check A, GREEN | the mirror already holds; do not re-mint a curve |
| R6's law-probe / hue census | `r0/r6-idiom-history/` | **`hue-census.mjs` writes nothing** ("Read-only; writes nothing", its own header) — pass 1's clobbering came from a different instrument, and `r0/` is clean at this pass (`git status` empty). Re-point whatever you run, and name it. |

---

## 9 · SKETCHES

### A · Where a length lives today, and where the ladder puts it

    HEAD                                        LADDER (+ the two cures this pass names)

    pencilConfig.MOTION                         pencilConfig.MOTION.rungs
      cardStepMs 440 ──► --card-step-ms ─┐        whisper 150  leave 200  note 250
      boardFoldMs 520 ──► App, Gallery   │        dusk 350  step 440  throw 520
      chromeLeaveMs 200 ─► a setTimeout  │                  │
      (GLIDE_MS 520 lives in a module) ──┘                  ▼
                                                  publishMotionRungs(el)
    81 literal positions in .vue/.css                       │
      "150ms" x19  "200ms" x16  "250ms" x9                  ├─► <style> :root{--motion-*}   ◄── §3 (3)
      "500ms" x6   "350ms" x4   "240ms" x4                  │      (NOT inline — inline
                                                            │       outranks the PRM rule)
    Tailwind, invisible to every gate:                      │
      --default-transition-duration .15s ──► 17 els         └─► MOTION.rungs.*  (TS)
      .duration-150/200/250/500     ──► 18 els
                                  ▲
                                  └── :root{--default-transition-duration:var(--motion-whisper)}  ◄── §4

### B · The band, and what one clock does across it

    worst 60Hz frame (px), chromium — the desk's audited pose is the dotted floor

     95┤ ●91.0                                    ● 520
       │  ╲                                       ▲ 600
     80┤   ▲78.6        ●83.7                     ■ 680
       │    ╲             ╲                       │
     65┤     ■68.6         ▲72.3                  │
       │                     ╲                    │
     50┤                      ■63.3               │
       │                                          │
     35┤                              ●40.3 ▲34.9 ■30.4
    27┤· · · · · · · · · · · · · · · · · · · · · · · · · ·  desk @520 = 27.9
       └──────────────┴──────────────┴─────────────────────
         768×1024        390×844         844×390
          681px           628px           302px
        (the FAST end)  (the ONLY pose   (the SLOW end)
                         pass 1 auditioned)

### C · One gesture, two fates — the exit at HEAD

    keypress ─► unfoldToBoard()                      App.vue:639
                 ├─ moveLiveBoard(null)              :645  ─► schedules restoreBoardAnims
                 ├─ applyState()                     :647
                 └─ runFold([board, wordmark])       :648
                        └─ nextTick ► foldCtl.run(movers)      useFlipGlide.ts:160
                                       clock = timeline.currentTime = 3973.564
                                       both movers .startTime = clock          ← "one clock"

    then, before the first paint:

      .board-peek-host   startTime 3453.564  ct 520  FINISHED   ← finish() shifts startTime
          ▲                                                       back by exactly one duration
          └── App.vue:456  a.finish()  over  .board-peek-host getAnimations({subtree:true})

      .logo-menu         startTime 3973.564  ct   0  running    ← outside that subtree
          └── glides 520ms, alone, for 520ms

---

## 10 · RISKS

1. **The exit cut (F3) is not a duration problem and will eat the row.** If §13 lands the
   choreography table without curing it, the wave ships a banked sentence contradicted by its
   own dist — the exact failure the T2–T4 retrospective calls "the record can't verify the
   record". Either cure it or write what runs.
2. **The two pass-1 diffs CONFLICT in both shared files.** `pencilConfig.ts` (LADDER replaces
   the three band keys with `rungs`; DERIVE adds travel docstrings to two of them and mints
   `drawerGlideMs`/`dockGlideMs`) and `useControlsDrawer.ts` (LADDER re-points `GLIDE_MS`;
   DERIVE kills it). The merge is a design decision, not a rebase: 600 is either a seventh rung
   or a GRADED member reading none, and **B2's stray-check convicts `dockGlideMs: 600` as an
   unruled MOTION key unless it is a rung or is added to `EXEMPT_KEYS`** (which today holds only
   `beatMs`).
3. **Cost.** 30 tracked files + 1 new (715 lines) at +195/−97, plus DERIVE's 3 files at +69/−18
   with 2 files overlapping → **31 tracked + 1 new**, ceiling 20; deletions −97 against −80.
   Either raise the ceiling with the reason (a grammar at 55 sites) or cut the 16 incidental
   sites into their own row. Bundle is not the problem: +110 B raw / +30 B gzip against a +400 B
   ceiling.
4. **The `!important` landing (§3 option 1) puts a bang in the sheet** that a later lane will
   read as a smell. Option 3 (the `<style>` publisher) avoids it and is barely larger.
5. **Changing the estate's PRM posture is a user-visible change to 28 rules across 60+ elements**
   and is π-relevant: the goldens are captured PRM-frozen, so they are blind to it. Any posture
   change needs a born-RED roster assertion, not a bitmap.
6. **A curve sweep hiding inside a length family** (§5). If it stays, it needs its own row, its
   own ruling and its own before/after — R4 measured 16 of 39 declarations with no house curve,
   so this is a real cure wearing the wrong family's badge.
7. **Line-anchored cites rot inside a single pass** — proven twice now (`GameControlPanel.vue`
   `:2452/:2473` → `:2457/:2478` in pass 1; `DRAW_IN_PRESETS` `:478` at HEAD cited as `:519` by
   pass 1's own README). Content-anchored cites (file + literal + a nearby stable string) or
   price the churn in the ledger's maintenance.
8. **i3-B and I6 are absolutes with no exceptions clause** and red forever while any CHARACTER
   or GRADED length exists. i3-B's five remaining rows are exactly five ADMITTED GRADED rows —
   B1 strictly subsumes it. Retire i3-B into B1; teach I6 the ledger or hand its law to B1, and
   bank the before/after. **Unwidened, I6 reports the ladder as a regression** (36 distinct
   literals against HEAD's 35, because a `var()` fallback is literal text to the old reader).
9. **CrayonHeart's PRM arm guards a rule nothing renders** — `.face` is inside
   `v-if="variant === 'blush'"` and no shipped surface passes `blush`. Keep the hygiene, drop
   the runtime claim to two arms plus the sparkle narrowing, and correct R4 §5's "3 unarmed
   shipped transitions" to 2.
10. **The theme-flip >100 ms criterion is still uncertified** and this box was not quiet either
    (three sibling lanes live). It is not this family's path — the dusk's curve and duration are
    computed-style reads and confirmed. Re-run it on a quiet box or retire the criterion by name.
11. **π rows not run here, and why.** The r1 heading census and the r3 wobble σ are full
    Playwright batteries whose SUBJECT this family does not move; a research lane re-running
    them buys a number nobody will read. The π evidence this family owes is named and cheap:
    goldens 4/4, `filter-census` + `theme-quadrants`, `check-font-coverage`, the dock rest rect,
    and the 29-row hue census with its `OUT` re-pointed — all on the prototype's own dist, with
    the paired HEAD control. **Nothing was rebuilt this pass and `r0/` is byte-clean
    (`git status` empty).**

---

## Files

- `instruments/dock-band-audition.mjs` — MOT-DERIVE's `travel-per-gesture.mjs`, re-pointed to
  `:4246` and to the band's ends; `--audition` sweeps 520/600/680 on ONE dist
- `instruments/reduce-rule-roster.mjs` — the rule-level reduce roster + THE CASCADE TEST
- `instruments/exit-travel.mjs` · `exit-cut2.mjs` — the declared exit against the one that runs
- `instruments/tw-tokens.mjs` — the Tailwind duration vocabulary, live element counts
- `data/band-{chromium,webkit}-slim.json` · `band-control-chromium*` — the audition and the
  paired desk control
- `data/reduce-roster-{chromium,webkit}.json` — 28 rows each, plus the cascade strings
- `data/gate-at-HEAD-a8fee1f5.txt` — the gate bare at this pass's HEAD (exit 1, B6 GREEN)
- `data/b3-sabotage-single-quote-GREEN.txt` · `b3-control-double-quote-RED.txt`
- `data/exit-travel-chromium.json`

Zero crops. Every claim above is a number or a `file:line`.
