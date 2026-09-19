# MOT-LADDER — pass 1 SYNTHESIS · the duration ladder

T9-W7 §13 (the transition grammar) · §12's motion half · M02 / M09 design half.
Input: `../research/MOT-LADDER/README.md` (DEVELOP; arm (a) lives, arm (b) dies) and its
`proto/mot-ladder.diff` (14 files, +110/−29, vue-tsc 0, lint:motion GREEN, +260 B). This file
decides the five questions the research left open, moves one thing the prototype got wrong,
and hands the prototyper a brief. Read-only on the product. Nothing closes (U-10).

Method: the frontend-design skill's two passes — plan the token system, review it against
the tell list, only then specify. §0 is the plan and the review; §1 onward is the spec.

---

## 0 · The plan, and the review against the tell list

**Subject.** A hand-drawn puzzle page whose chrome moves like paper: a sheet glides, chrome
fades off, a note writes itself on, the page dusks. The audience is the owner's eye on a real
phone (M02, M09). The job of this family is not a new motion; it's to make every length the
product already spends a NAMED decision, read from one place, so the three gestures the owner
called "not properly defined" are defined in writing and the drawer stops animating a property
nobody asked it to.

**Tokens (the plan).**

| axis | the set | home |
| --- | --- | --- |
| length | six rungs: whisper 150 · leave 200 · note 250 · dusk 350 · step 440 · throw 520 | `MOTION.rungs` (TS), published to `html` as `--motion-<rung>` |
| curve | the ten `--ease-*` already in `@theme §EASING` + `MOTION.curves.drawerGlide` (unchanged) | index.css / pencilConfig, the two-layer rule |
| colour | none. This family mints no hex. | — |
| copy | none. This family renders no string; the woff2 subsets are untouched. | — |

**Type / voice.** A rung is named for how it FEELS, never for who may spend it (the
`--ease-accelIn` idiom, index.css:340-344, one axis over). A call site reads as a sentence:
`opacity var(--motion-leave) var(--ease-fadeOut)` — "leave, fading out". That sentence, at every
site, is the family's one memorable thing. Everything else is quiet: no new curve, no owner-ruled
number moves, zero pixels move at rest.

**Layout (where things live).**

```
pencilConfig.ts   MOTION.rungs (THE home, six literals)  ──publishMotionRungs(html)──►  --motion-*
                  MOTION.curves.drawerGlide (unchanged)                                  --ease-* (unchanged)
                  MOTION.beatMs (a cadence, not a rung)
call site         transition: <prop> var(--motion-<rung>, <same ms>) var(--ease-<curve>);
                  animation:  <name> var(--motion-<rung>, <same ms>) var(--ease-<curve>) backwards;
TS consumer       useFlipGlide({ durationMs: MOTION.rungs.throw })
gate              scripts/check-motion-bands.mjs — B1..B6, ADMITTED ledger closed both ways
```

**Principles.** (1) Lengths, not meanings. (2) One home; the CSS copy is published, never
typed. (3) Nothing the owner ruled moves; nothing shortens as a tidy-up (W8 QUALITY LAW). (4)
A keyframed character gesture is auditioned whole — the ladder sets a gesture's length, never
its interior. (5) PRM collapses every rung consumer to a same-frame swap, proven on the engine.

**Review against the tells.** The generic motion-token page is an ordinal ramp
(`--duration-xs…xl`, `fast / normal / slow`, 100-200-300-500), `ease-in-out` on everything, a
`:root` block that duplicates a JS constants file, and a reduced-motion arm that is one
`0.01ms !important` nuke. Three things in my first plan were that default and got revised:

1. I had the four band keys (`cardStepMs`, `boardFoldMs`, `chromeLeaveMs`, + a new
   `drawerGlideMs`) as ALIASES onto the rungs, the prototype's form. That's a second name for
   one length — the two-home problem wearing TS clothes — and the research measured what it
   costs: i3-B and I6 go half-blind. **Revised: the band keys die; consumers read the rung and
   carry the ruling in a comment at the site.** Six TS sites, listed in §3.
2. I had considered `--dur-*`. **Revised to `--motion-*`**: it's `MOTION`'s namespace, and it
   sits beside `--ease-*` as the two halves of one sentence rather than a third vocabulary.
3. I had the ~57 remaining B1 rows re-pointed by script to "nearest rung", the research's own
   sweep. Run honestly that shortens eight rows and splits two graded sets. **Revised: a script
   may only re-point a row whose value is unchanged or lengthens ≤5% (below the ~10% duration
   JND); everything else is ADMITTED with a class and a cite, and never moves in this wave.**
   §2.3 has the arithmetic: 54 of 78 positions on rungs, 24 admitted in two named classes,
   0 unadmitted, 0 shortened.

One thing I kept that looks like a default and isn't: the `var(--motion-x, 150ms)` fallback IS a
second copy of the number. It's kept because it's the shipped idiom (`GameCard.vue:411`) and
because a missed publish must be a no-op, not a page of zero-length transitions — and it's made
honest by a gate (B3 FALLBACK) that holds every fallback byte-equal to its rung.

---

## 1 · The ladder

### 1.1 Six rungs, every one a number the product already ships

| rung | ms | sites at HEAD | the ruling it carries |
| --- | --- | --- | --- |
| whisper | 150 | 18 | the estate's most-used length: a hover, a tape, a hint's fade. No prior ruling; the ladder ratifies what shipped |
| leave | 200 | 14 | was `MOTION.chromeLeaveMs` (pencilConfig.ts:163) — chrome leaving the page; both declared twins |
| note | 250 | 7 | the note-write family (MarginNote.vue:149/:180, SolverErrorNote.vue:63, CompletionVignette.vue:133) |
| dusk | 350 | 4 | the theme's colour turn (index.css:667, T3-W10 disposition keep) |
| step | 440 | 2 | was `MOTION.cardStepMs` — RATIFY-ME T4-W12 ballot row 4, auditioned 380/440/520 |
| throw | 520 | 0 CSS, 3 TS | was `MOTION.boardFoldMs` + `GLIDE_MS` (useControlsDrawer.ts:86) — audit 4, 2026-07-11, auditioned 480/520/560 |

Closed set: six, ≤8 by gate. A seventh rung needs an owner ruling and a gate edit in the same
commit. `beatMs` 125 is NOT a rung — it's the boil scheduler's raster-swap cadence
(pencilConfig.ts:122, consumed by `beatsFor`, boilBeat.ts:32, HandwrittenLogo.vue:129,
DarkModeToggle.vue:427); it never reaches a `transition:` and is never published. Research
question 1, ruled.

### 1.2 The TS home

```ts
// pencilConfig.ts — replaces cardStepMs / boardFoldMs / chromeLeaveMs (the rulings move
// into the rows; the numbers do not move)
export const MOTION = {
  beatMs: 125,                       // cadence, not a rung — see 1.1
  rungs: { whisper: 150, leave: 200, note: 250, dusk: 350, step: 440, throw: 520 },
  bands: { sun: 2, moon: 1.5 },      // unchanged
  curves: { drawerGlide: "cubic-bezier(0.32, 0.72, 0, 1)" },  // unchanged
} as const;

/** THE ONE PUBLISHER — called once from main.ts against document.documentElement, before
 *  mount. html, not the app root: the dusk's `html.theme-turning body` (index.css:663) sits
 *  above .page-root and must inherit it. */
export function publishMotionRungs(el: HTMLElement): void {
  for (const [name, ms] of Object.entries(MOTION.rungs))
    el.style.setProperty(`--motion-${name}`, `${ms}ms`);
}
```

The comment block above `rungs` carries: the six rulings (1.1), the two admitted classes (2.3),
and the choreography table (1.4). No `@theme` duplicate; no `--card-step-ms`.

### 1.3 The CSS grammar — one sentence per site

```
transition: <property> var(--motion-<rung>, <rung ms>) var(--ease-<curve>);
animation:  <keyframes> var(--motion-<rung>, <rung ms>) var(--ease-<curve>) [delay] backwards;
```

Rules the gate reads: the fallback equals the rung (B3); a `<style>` duration is a rung or an
ADMITTED literal (B1); `all` never appears (B4); a bare `ease` / `ease-in` / `ease-out` /
`linear` never appears on a transition (i2) — `linear` stays legal on an `animation:` whose
`@keyframes` carry per-step easing (the existing 15-row class R4 §5 names).

### 1.4 The three gestures M09 names, defined

Written into `MOTION`'s comment as the choreography table. No value moves; the exit's board
fold is assumed cured by its mechanism row (App.vue:447, R4 §3) before any curve here is judged.

| gesture | beat | what moves | rung | curve | PRM |
| --- | --- | --- | --- | --- | --- |
| gallery IN | 0 | `.scene-controls` opacity → 0 (scene.css:617/:629) | leave | `--ease-fadeOut` | same-frame cut |
| | 1 (at +leave, App.vue:630) | board folds into the centre card + wordmark fold (useFlipGlide, App.vue:376) | throw | glass (`drawerGlide`) | cut |
| | 2 (at +0.42·throw, GameGallery.vue:371) | the deal | — | — | — |
| gallery OUT | 0 | board unfolds + wordmark unfold (App.vue:639) | throw | glass | cut |
| | 0 | deck leave-only dissolve (App.vue:1142) | leave | **`--ease-fadeOut`** (was glass — the twins now share one curve) | cut |
| card step | — | track FLIP (useCarouselGlide.ts:27) + three cards' transform/opacity (GameCard.vue:411) | step | glass | cut |
| drawer | — | sheet · case · masthead · tab counter-scale, one WAAPI clock (useControlsDrawer.ts:86) | throw | glass | cut |
| dock (<1024) | — | the sheet alone, translate ±628px at 390×844 | throw (inherited — 1208 px/s, within 5% of the desk's 1256/1198) | glass | cut |
| dusk | — | background-color + color on the five narrowed selectors (index.css:661-671) | dusk | **`--ease-standard`** (was the UA's bare `ease`) | the block is no-preference gated |

The dock stays on `throw`. If W8's device reading convicts the dock's clock (not its frames),
the per-pose value is `MOTION.rungs.step` (440) — the next rung down, already on the ladder —
never a seventh rung and never a second engine. The desk's reciprocal pair is not re-timed.

Delays are a separate axis (11 positions, 9 distinct — research §1 correction 3). The ladder
does not govern them in this pass; the only delay that is a rung is BEAT 1's offset, which is
`leave` by construction (App.vue:630). If a later pass wants delays laddered, it says so with
its own gate row.

### 1.5 Curves: nothing new, two corrections

- **The twins ride one curve.** G7 (App.vue:1142) leaves the glass glide for `--ease-fadeOut`
  (easeInCubic, "things leave the page", scene.css:606). Proven on the built dist: the
  `gallery-fade-leave-active` transition reads `cubic-bezier(0.32, 0, 0.67, 0)`, byte-identical
  to `.scene-controls`' leave.
- **The dusk rides `--ease-standard`** (0.4, 0, 0.2, 1). The five narrowed selectors, the
  `!important`, the `html.theme-turning` window and the `no-preference` gate are byte-identical;
  only the curve token changes. useTheme.ts:35 `disableTransition: true` stands; nothing is
  re-blanketed.
- The 16 incidental sites (R4 §5) each take the house curve their motion already implies:
  `--ease-standard` for a fade/ground swap, `--ease-drawOn` for a stroke or tilt,
  `--ease-accelIn` for the star's tuck. The table is the prototype diff, row for row.

---

## 2 · Every site, classed

### 2.1 The script class — value unchanged, or lengthened ≤5%

Re-pointed by `apply-ladder.mjs` (anchored edits that fail loud), no eye needed:

- exact: 150 ×18, 200 ×14, 250 ×7, 350 ×4, 440 ×2 → 45 positions
- lengthen ≤5%: 240 → 250 ×4 (CrayonHeart.vue:329, GameGallery.vue:1473 ×2 the guard ribbon,
  HandDrawnGrid.vue:588), 500 → 520 ×5 (index.css:590/:607, HandDrawnGrid.vue:588,
  DiceIcon.vue:113, SolveIcon.vue:70) → 9 positions

**54 of 78 duration positions read a rung at landing.**

### 2.2 The ADMITTED ledger — two classes, 24 positions, each with a cite, never moved here

**CHARACTER** — a keyframed gesture auditioned as a whole; the ladder sets a gesture's length,
the keyframe owns its interior. 13 positions:

| ms | site | note |
| --- | --- | --- |
| 100, 120, 120, 300, 340, 800, 1010 | DarkModeToggle.vue:873/:822/:882/:780/:795/:810/:843 | the toggle is ONE character gesture (T3–T10); the ladder governs its dusk (T2) and its chrome rows (T11 hover, T12 rest swap), which DO take rungs |
| 300 | index.css:721 `cell-reveal` on `--ease-anticipatePop` | an overshoot keyframe |
| 400 | GameControlPanel.vue:2473 `eraserScrub` | a scrub |
| 500 | GameControlPanel.vue:2452 `sharePop` | a press flourish |
| 600 | index.css:679 `refuse-shake` | a refusal |
| 1000 | ScribbleLoader.vue:81 `infinite` | a loop cadence, not a length |
| 1200 | HandwrittenLogo.vue:560 clip write-on | the wordmark writing itself |

**GRADED** — a set whose differences ARE the design; a rung would erase the difference.
11 positions:

| ms | site | note |
| --- | --- | --- |
| 320, 380, 280, 320, 320, 260 | GameControlPanel.vue:1724/:1728/:1735/:1739/:1744/:1749 | the player rows: "a return is lighter than an arrival" (:1730), 40ms lighter by design. Snapping 320→350 and 280→250 turns 40 into 100 |
| 280 ×2 | AnswerKeyLaminate.vue:236 | lay-down 280 on glass vs lift-away 200 on accelIn — the erase-family asymmetry (R6 §1.2) |
| 160 | index.css:768 `--draw-dur` default | the pencil-draw-on primitive's own default; every write-in overrides it |
| 180 ×2 | gameCell.css:239/:257 `ghost-draw-on` | the focus ring "sketched on over 180ms" (R6 law 39) — §6's surface, handed to the focus-ring family; admitted here until §6 rules |

The ledger is closed both ways (the `check-copy-register.mjs` shape): an entry whose line
leaves the tree reds the gate, so an admission can't outlive its reason. 54 + 13 + 11 = 78.
Zero shortened. The research's "69 of 78 at tolerance 30" moved to 54 because this spec refuses
every shortening and keeps two graded sets whole; the fifteen-row difference is the QUALITY
LAW, applied per row.

### 2.3 What dies

- `MOTION.cardStepMs`, `MOTION.boardFoldMs`, `MOTION.chromeLeaveMs` (three keys; rulings move
  into the rung rows)
- `--card-step-ms` and its component publisher (GameGallery.vue:930); GameCard.vue:411-412 read
  `var(--motion-step, 440ms)`
- `const GLIDE_MS = 520` as a literal (useControlsDrawer.ts:86) → `MOTION.rungs.throw`, comment
  kept; and useCarouselGlide.ts:27 → `MOTION.rungs.step`
- `transition: all` (GameControlPanel.vue:2082 → `filter`) — and a reduce arm for that rule,
  the research's stated residue
- the UA's bare `ease` on 16 transitions; the glass curve on the deck leave
- three files with no PRM arm (DrawerTab.vue, CrayonHeart.vue, SheetWashiLabel.vue)

---

## 3 · The plan — files, order, gates

Each step is one commit-sized unit; the gate is written first and runs RED before step 2.

1. **Gate.** `web/frontend/scripts/check-motion-bands.mjs` lifted from
   `research/MOT-LADDER/probe/`, widened: B3 gains FALLBACK, B5 PRM-ARMED and B6 NO-SHORTEN are
   added, `beatMs` exempted by name, the ADMITTED ledger added (empty at HEAD so it reds at 76).
   Wired as `npm run lint:bands` beside `lint:motion`; CI lane added in the same commit (the
   lesson: a ruling lands with its enforcing config). `--self-test` sabotages all six.
2. **The home.** pencilConfig.ts: `rungs`, `publishMotionRungs`, the comment block (rulings ·
   admitted classes · choreography). Delete the three band keys. main.ts publishes before mount.
   Re-point the six TS consumers: App.vue:376/:630, GameGallery.vue:371/:930 (publisher line
   deleted), useCarouselGlide.ts:27, useControlsDrawer.ts:86. vue-tsc 0.
3. **The instruments that would go blind.** `r0/r4-transition-grammar/instruments/i3-glass-curve-home.mjs`
   check B reads `rungs.<name>` (its `Ms:` regex reads nothing after step 2 — widened with a
   before/after reading banked, not silently); `r0/r7-owners-eye` I6 counts `var(--motion-` as
   NAMED. Both re-run at HEAD and on the branch.
4. **The 16 incidental sites + the twins + the dusk + the three PRM arms + the sparkle
   narrowing and its reduce arm** — the prototype diff verbatim, plus the one `@media (reduce)`
   block for `.sparkle-icon` inside GameControlPanel's existing PRM block. i2 39/39, B4 GREEN.
5. **The script class** (§2.1): `apply-ladder.mjs` extended over the 54 rows. Values unchanged
   or +≤5%. B6 NO-SHORTEN reads the diff.
6. **The ADMITTED ledger** (§2.2) filled, 24 rows, each with class + cite. B1 GREEN.
7. **The zone disclosure** (GameControlPanel.vue:2284): `var(--motion-leave, 200ms)
   var(--ease-drawOn)` + one sentence naming it the estate's one layout tween. If §10's re-cut
   lands first, §10 carries this line; otherwise this commit does. One rule, whichever wave
   reaches it first, never both.
8. **Evidence.** Frames before/after, flips, PRM rosters, goldens, the r0 π censuses, all against
   built dists (§4).

Order matters at 2→3: the instruments are widened in the same commit that would blind them.

---

## 4 · The prototype brief

**Build.** Replay `research/MOT-LADDER/proto/apply-ladder.mjs` in a throwaway worktree at HEAD
under the scratchpad, then the pass-2 delta: delete the three band keys and re-point the six TS
consumers; the `.sparkle-icon` reduce arm; the §2.1 script rows; the §2.2 ledger; the widened
gate + i3-B + I6. `npx vite build` to `dist-after`; a clean HEAD build to `dist-before`. Serve
both on 127.0.0.1:4246 / :4248 (`--strictPort`; the next free in 4230-4249 if taken). Scratch
playwright config, never the estate's. No osascript, no Safari.app.

**Static readings (both trees).**

| instrument | HEAD | success |
| --- | --- | --- |
| `check-motion-bands.mjs` B1 NAMED | RED 76 | GREEN — 0 unadmitted, 24 admitted, ledger closed both ways |
| B2 CLOSED | GREEN 4 | GREEN 6, each with a ruling, `beatMs` exempt by cite |
| B3 MIRROR + FALLBACK | RED (no publisher) | GREEN — 6 published, every `var(--motion-r, n)` fallback === `rungs.r` |
| B4 NO-ALL | RED 1 | GREEN |
| B5 PRM-ARMED (static) | RED 3 files | GREEN — every file reading `var(--motion-` carries a reduce or no-preference gate |
| B6 NO-SHORTEN (diff) | n/a | GREEN — no re-pointed duration shorter than HEAD's |
| i2 incidental | RED 16/39 | GREEN 39/39 |
| i3 A / B (widened) | GREEN / RED 8 homeless | GREEN / GREEN 0 homeless |
| I6 (widened) | RED 77/35/4 | GREEN — every non-admitted duration NAMED |
| `lint:motion`, `vue-tsc --noEmit`, `check-font-coverage` | GREEN / 0 / n/a | GREEN / 0 / no string moved |
| `--self-test` on the gate | — | all six sabotages RED |

**Runtime readings (built dists, both engines where the rig runs them).**

| probe | success |
| --- | --- |
| `prm-arms.mjs` — published ladder off `documentElement` | `{whisper:150ms, leave:200ms, note:250ms, dusk:350ms, step:440ms, throw:520ms}` |
| `prm-arms.mjs` — dock tap roster, 390×844 | reduce: **0** animations (HEAD 1: `visibility 200ms ease` on `.sparkle-icon`); no-preference: 1 (the `.scene-controls` mover) |
| `prm-arms.mjs` — theme flip, gallery exit, card step under reduce | 0 tweening properties each; DrawerTab / washi / CrayonHeart `.face` (pose the attribution card open first) read `none 0s` |
| `frame-probe.mjs` — 15 gestures, 390×844 dsf3, 1× | no gesture gains a >33ms frame; the two cold-bake gestures (first dark toggle, first card step — HandwrittenLogo.vue:343, HandDrawnGrid.vue:216, W8 §8.1's) carry the same count both sides |
| `theme-flip-probe.mjs` — six alternating flips at 4×, light↔dark | no frame >100ms after flip 0, both sides; flip 0's cold bake unchanged in kind |
| exit roster at 4× | `gallery-fade-leave-active` reads `cubic-bezier(0.32, 0, 0.67, 0)`; the dusk reads `cubic-bezier(0.4, 0, 0.2, 1)` |
| dock settle | open the sheet, wait 700ms, read `getAnimations()` → 0; the sheet's rest `translate` equals HEAD's to the pixel |

**π identity (the wave's surfaces this family does not claim).** All read on `dist-after`:
r1's heading census (three voices, unchanged), r6's `hue-census.mjs` (29 rows, byte-identical),
r3's wobble probe (ring σ unchanged), `filter-census` **9** exact both themes, e2e goldens
**4/4 unmoved** — the ladder claims zero rest-state pixels, so a moved golden is a defect, not a
DELTA.

**Frames.** Zero by default; this family's claims are numbers. If the critic wants a picture,
two crops ≤150 KB each, both engines, dark and light: the dock sheet open at 390×844 settled
700ms, HEAD beside branch (identity), and nothing else. Wave cap 2 MB; the research banked
340 KB.

**Cost ceiling.** ≤20 files, ≤+200/−80 lines, bundle ≤+400 B gzip ≤+150 B. Above that, the
family is doing something this spec didn't ask for.

---

## 5 · Risks carried forward, stated

- M09's DEVICE half is W8's. The first dark toggle is a 199–233ms cold bake at 4× on both
  sides; if the owner's re-look still reads the flip as a hitch, that frame is not this
  family's. Say so at the fold.
- The dusk's five-selector list is RE-DERIVE-ON-CHANGE (index.css:655-659). The named curve
  makes the dusk look deliberate; a new full-bleed ground would still snap beside it.
- The bench is chromium headless with rAF uncapped. It proves no regression, which is what the
  QUALITY LAW asks; it acquits nothing about the real iPhone (R7 §6.4).
- The 24 admitted rows are a ledger, not a loophole: 13 character, 11 graded, every one cited.
  If pass 2's eye wants any of them on a rung, it's an audition with a before/after roster, not
  a script.
- Deleting the three band keys touches six TS sites. The rulings survive in the rung rows; a
  reader grepping `cardStepMs` finds the row via the comment ("was cardStepMs").

## 6 · Gates this family lands with

B1 NAMED · B2 CLOSED · B3 MIRROR+FALLBACK · B4 NO-ALL · B5 PRM-ARMED · B6 NO-SHORTEN — one
script, `lint:bands`, self-tested, CI lane in the same commit. Plus the re-run r0 instruments
(i2, i3 widened, I6 widened) and the runtime rosters (prm-arms, frame-probe, theme-flip) banked
under `evidence/w7/loop/pass2/prototype/MOT-LADDER/`.
