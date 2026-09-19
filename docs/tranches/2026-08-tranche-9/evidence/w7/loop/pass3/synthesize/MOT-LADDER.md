# MOT-LADDER — pass 3 SYNTHESIS · the ladder, made unable to lie

T9-W7 §13 the transition grammar · M02 / M09 (design half). Leader of §13. Base: `74a2b5d9`.
Input: `../research/MOT-LADDER/README.md` (pass 3, 11 findings, five instruments), the pass-2
spec/prototype/critique, `pass2/registry-v2.md` §2.1 §2.2 §2.5, `../CHAIR-RULINGS.md` §6.5 §7,
`pass2/charters/MOT-LADDER.md` (the fourteen rows). Read-only on product files; nothing closes
(U-10). Method: the frontend-design two passes (plan, review against the tells, then specify);
§0 is the plan and the review, §1 onward is the spec.

The family's centre is unchanged and is the best-evidenced thing in the section: **PRM is a value
of the ladder** (row F of the property probe: the reduce arm beats a registered initial value in
both engines). Pass 3's job is narrower: make the gate able to see the two consumers it was blind
to, take the chair's no-fallback shape without re-silencing the failure it exists to expose, and
hand the owner two honest statistics for the dock.

---

## 0 · The plan, and the review against the tells

**Subject.** A hand-drawn puzzle page whose chrome moves like paper. The owner's eye on a real
phone: frame `marks/m03-controls-open-iphone.png` is the risen sheet, the thing the dock's rung
times; frame `m01` is the playing pose it rises from. Every length the product spends is a NAMED
decision read from one place, and the gate that says so can fail.

**Tokens (the plan).**

| axis | the set | home |
| --- | --- | --- |
| length | six shipped rungs: whisper 150 · leave 200 · note 250 · dusk 350 · step 440 · throw 520, plus ONE proposed: **rise 600** (the dock, U-10) | `MOTION.rungs` (TS), emitted as `--motion-<rung>` |
| registration | `@property --motion-<rung> { syntax: "<time>"; inherits: true; initial-value: 0ms }` ×7 — **absence reads as reduce** | emitted by the same publisher, cited to chair §6.5 |
| PRM | the reduce arm sets every rung `0ms`; the same value as absence | the same publisher |
| character twin | `MOTION.characters.refuse: 600` — the one keyframed length that had a TS twin | `pencilConfig`, bound as `--refuse-dur` at both consumers |
| curve | **none of this family's.** Registry §2.1: curves are VERBS and MOT-VERB rules them. B8 keeps its prohibition half only (no bare UA keyword on a `transition:`) | MOT-VERB |
| colour · copy | none rendered. Gate messages in M16's register | — |

**Voice.** A rung is named for how it feels, never for who spends it, and a site reads as one
sentence with nothing after the comma: `opacity var(--motion-leave) var(--verb-lift-ease)`. That
bare sentence, at every site, is the family's one memorable thing. The dock's clock is the second
and only place this pass spends boldness: a named length seen against the band it governs, in
two statistics the owner can read.

**Layout (where a length lives after this pass).**

```
pencilConfig.ts   MOTION { beatMs 125 · settleGuardMs 220 · rungs {7} · characters { refuse 600 } · curves }
                  motionRungsCss(rungs) → "@property…×7  :root{--motion-*:Nms}  @media (reduce){:root{--motion-*:0ms}}"
                  publishMotionRungs(doc) → ONE <style data-motion-rungs>, main.ts before mount   (§2.1)
index.css         :root { --default-transition-duration: var(--motion-whisper) }     ← Tailwind's tier joins, no fallback
call site         transition: <prop> var(--motion-<rung>) var(--verb-<verb>-ease) [<delay literal>];
TS mover          useFlipGlide({ spend: spend("slide", "throw") })   ← MOT-VERB's door reads MOTION.rungs.throw
gate              scripts/check-motion-bands.mjs  B1..B12 · two rosters (CSS + CODE) · one bank (rungs + sites)
```

**Principles.** (1) Lengths, not meanings. (2) One home; the CSS copy is emitted, never typed;
PRM and absence are the same value of the ladder. (3) Nothing shortens, and the ratchet holds the
RUNG, not only the rows. (4) The ladder governs TRAVEL in either language; a WINDOW derives from
a rung and says so; a CADENCE answers to `beatMs`; POLICY is out of scope by kind, never by file
type. (5) A delay keeps its literal (B9 is MOT-VERB's fence). (6) A character is auditioned whole,
and a character with a TS twin has one home bound twice.

**Review against the tells.** The generic motion-token page is an ordinal ramp, a `:root` block
duplicating a JS file, `ease-in-out` everywhere and a reduce arm of `0.01ms !important`. Four
things in my first plan were that default and were revised:

1. I kept pass 2's `var(--motion-x, 150ms)` fallbacks "so a missed publish is a no-op". Research
   row B measured what that buys: a deleted publisher is INVISIBLE in both engines, and B3's static
   mirror is the only thing holding it. **Revised: fallbacks struck (chair §6.5); the rungs are
   registered at `initial-value: 0ms`.** Not the chair's literal shape — row D shows a shipped
   initial-value re-silences the born-RED row — but its intent: a registered property cannot take
   the shorthand to `all`, and absence reads as reduce, which B5's roster sees.
2. I had the 16-site curve row (bare `ease` → `--ease-standard`). That is Material's curve under
   Material's name on the estate's grounds, and §2.1 gave curves to the verbs. **Revised: the curve
   row leaves this family.** B8 keeps only its prohibition; the scrub sampler (§6 of research) is
   handed to MOT-VERB as the instrument that turns fifteen frames into fifteen numbers.
3. Arm 4 (CSS as the one home, TS reads the cascade) is the cheapest in bytes and makes PRM
   correct-by-construction for the WAAPI movers. It also moves the numbers OUT of `pencilConfig`,
   and the wave's §13 sentence is the owner's: "written into `pencilConfig`'s MOTION bands, not
   incidental CSS". **Refused on the wave's own words; priced in §8 for the record.**
4. I had `framesOver40px` as the dock's acceptance. It is a count and cannot fall (research §4).
   **Revised: worst frame AND excess area, both monotone, both in the ballot.**

Kept, and it looks like a default: the runtime `<style>` node. Registry §2.1 rules it and stands
unmodified; MOT-VERB's build-time form is an objection this return carries with a price (§8), and
the prototype measures the one number that decides it (the boot-frame sampler, CTRL-TAPE's graft).

---

## 1 · The ladder

### 1.1 Seven rungs: six the product ships, one it proposes

| rung | ms | the ruling it carries | consumers after this pass |
| --- | --- | --- | --- |
| whisper | 150 | the estate's most-used length; ratified as shipped | 18 CSS sites · `usePathAnimation.ts:163` (the grid erase) · Tailwind's default tier · **the section's one RUB OUT (§2.2 — NOTE-LEDGER, NOTE-ERASE, MOT-VERB's `rubOut` consume it)** |
| leave | 200 | was `chromeLeaveMs`; chrome leaving the page | the twins (`scene.css:617,:629`, `App.vue` deck leave) · the laminate's lift · `App.vue:643`'s window · `.duration-200` ×2 |
| note | 250 | the note-write family | MarginNote / SolverErrorNote / CompletionVignette · `controls-fade-in` · the guard ribbon (MOVED 240 → 250, §5) · the progress trace's dashoffset (MOVED 240 → 250) · `.duration-250` ×2 |
| dusk | 350 | the theme turn (T3-W10) | `index.css` the five narrowed selectors · `FillForcedIcon.vue:72` · `SolveIcon.vue:55` |
| step | 440 | was `cardStepMs`; RATIFY-ME T4-W12 row 4 (auditioned 380/440/520) — **PINNED** | `useCarouselGlide` · `GameCard.vue` flank pose |
| throw | 520 | was `boardFoldMs` + `GLIDE_MS`; R6 standing ruling 1 (audit 4, auditioned 480/520/560) — **PINNED** | drawer desk (4 movers) · fold in/out · the deal's derived delay · five followers 500 → 520 · `.duration-500` |
| **rise** | **600** | **PROPOSED, U-10.** The dock sheet, `<1024` both orientations. Two statistics at matched travel, webkit (research §4): worst 60 Hz frame 91.1 → 78.0 / 81.5 → 71.7 / 82.6 → 71.0 px (−11…14 %); excess area over 40 px 213.2 → 170.2 / 172.0 → 130.3 / 171.7 → 127.3 (−20…26 %); frames >40 px unchanged ±1. If the owner keeps 520 the rung dies in one line and every reading stands for `throw`. | `useControlsDrawer`, dock pose only |

Closed set: seven, ≤8 by gate. Two EXEMPT keys with a sentence each: `beatMs` 125 (a cadence, R6
law 7) and `settleGuardMs` 220 (the FLIP engines' never-never backstop, never painted). One
admitted TS class beside `DRAW_IN_PRESETS`: `characters` (§1.5).

`throw` has ZERO CSS consumers at HEAD (research §1.2: 520 × 0 in the histogram) and two TS
consumers. That is the whole reason pass 2's sabotage was invisible, and the reason §3's bank is
keyed on the rung itself.

### 1.2 The TS home, the render, the publisher

```ts
export const MOTION = {
  beatMs: 125,                         // cadence, EXEMPT (R6 law 7)
  settleGuardMs: 220,                  // the FLIP engines' backstop, EXEMPT
  rungs: {
    whisper: 150, leave: 200, note: 250, dusk: 350, step: 440, throw: 520,
    /** PROPOSED (U-10) — the dock sheet's clock. travel: 302px @844x390 … 681px @768x1024 (sheet).
     *  worst frame −11…14 %, excess area over 40px −20…26 % vs 520 at matched travel, webkit
     *  (pass3/prototype/MOT-LADDER/readings/dock-band-*.json). Dies to `throw` if the owner keeps 520. */
    rise: 600,
  },
  /** Keyframed characters whose length has a TS reader. ONE home, bound at the consumer as a
   *  custom property (the `--draw-dur` precedent); the CSS site reads the binding, never a literal. */
  characters: { refuse: 600 },
  bands: { sun: 2, moon: 1.5 },
  curves: { drawerGlide: "cubic-bezier(0.32, 0.72, 0, 1)" },
} as const;

/** The ladder's CSS, rendered from the object — pure, testable, one string. Registration first:
 *  a registered <time> can never take the shorthand to `all`; its initial 0ms means an ABSENT
 *  publisher reads exactly as reduce does, which B5's roster sees and a bitmap cannot. */
export function motionRungsCss(rungs: Record<string, number> = MOTION.rungs): string {
  const rows = Object.entries(rungs);
  const reg  = rows.map(([n]) => `@property --motion-${n}{syntax:"<time>";inherits:true;initial-value:0ms}`).join("");
  const live = rows.map(([n, ms]) => `--motion-${n}:${ms}ms`).join(";");
  const still = rows.map(([n]) => `--motion-${n}:0ms`).join(";");
  return `${reg}:root{${live}}@media (prefers-reduced-motion: reduce){:root{${still}}}`;
}

/** THE ONE PUBLISHER (registry §2.1) — main.ts, before mount. A <style> node, never inline
 *  properties (inline outranks the reduce arm, measured both engines). */
export function publishMotionRungs(doc: Document = document): void {
  const el = doc.createElement("style");
  el.dataset.motionRungs = "";
  el.textContent = motionRungsCss();
  doc.head.append(el);
}
```

`@property` appears zero times in `src/` and 42 times in the shipped dist (Tailwind's own), the
support floor is `safari >= 16.4` (`package.json:12-16`, the version typed `@property` landed
in), so the at-rule is not a new dependency. The MOVED sentence for the record: the registration
is the motion rungs' own, emitted with their values, cited to chair §6.5; `initial-value` is
`0ms`, and §8 says why that is the only value the law's own born-RED row survives.

### 1.3 The CSS grammar, one sentence per site, nothing after the comma

```
transition: <property> var(--motion-<rung>) var(--verb-<verb>-ease) [<delay literal>];
animation:  <keyframes> var(--motion-<rung>) var(--verb-<verb>-ease) [<delay literal>] backwards;
```

The gate reads: the FIRST time value in a term is a rung or an ADMITTED row (B1); the second and
later are delays and keep their literal (B9, MOT-VERB's fence); a `var(--motion-*)` carries NO
fallback (B3, chair §6.5); `all` never appears, static and live (B4); a bare UA keyword never
appears on a `transition:` (B8, prohibition only). The curve name is MOT-VERB's law, not this
family's; the ladder never reads it.

### 1.4 The three gestures M09 names, as they run on this build

The exit column describes HEAD + W8 C06 (`useFlipGlide.run` tags its animation; the board's
mover survives to its own settle); HEAD's cut is the named control.

| gesture | beat | what moves | rung | PRM |
| --- | --- | --- | --- | --- |
| gallery IN | 0 | `.scene-controls` opacity → 0 | leave | same-frame cut |
| | +leave | board folds into the centre card + the wordmark, one clock | throw (PINNED) | cut |
| | +round(0.42 · throw) after the fold | the card draw-ins (a DERIVED delay; the coefficient is a literal by the fence, and the record says the deal begins at 42 % of the fold) | — | settled |
| gallery OUT | 0 | board unfolds + the wordmark, one clock | throw | cut |
| | 0 | the deck's leave-only dissolve | leave | cut |
| | +150 ms | `controls-fade-in` (the delay is a literal) | note | gated |
| | 0 | tag / bar whisper fades, masked under the scene's opacity for their first 150 ms | whisper | cut |
| | | chrome lands at 400 ms; the paper settles at 520. The paper stops last. | | |
| card step | — | track FLIP + three cards' transform/opacity | step (PINNED) | cut |
| drawer, desk ≥1024 | — | sheet · case · masthead · tab, one WAAPI clock | throw (PINNED, R6 #1) | cut |
| dock <1024 | — | the sheet alone, 302…681 px; the tongue's berths are W2's (§1.7) | rise 600 proposed / throw 520 shipped | cut |
| dusk | — | background-color + color on the five narrowed selectors | dusk | gated |

**The phone's exit is a real defect, with its number** (research §5). The wordmark's rest poses
at 390×844 sit 145.49 / 145.77 px apart (chromium / webkit), which is the entry's declared travel
to 0.3 px; the exit's declared 10.0 is the rect `App.vue:584-598` reads one `nextTick` after
`applyState()`, before the playing layout exists at that width. At 1440×900 the tick suffices
(316.6 / 318.5 vs 319.1 / 324.0 rest). The same signature shows on the board host (57.6 → 43.9 /
44.2 at the phone). The cure is the fold owner's, App.vue's: read the last rects after the layout
is real (one animation frame after the tick, or the settled layout read). It moves 145 px of ink
on every phone exit where today the wordmark cuts, ink the owner has never seen, so it is a
BALLOT row (U-10) built as a proposed patch under `instruments/`, measured, never folded silently
(§7). G-EXIT-MIRROR stays RED at HEAD until the owner's word.

### 1.5 One character, one home: the refuse shake

`refuse-shake` is the house's ERROR verb with two consumers and its length typed in two languages:
`useGameCell.ts:184` `REFUSE_MS = 600` (bound as `--refuse-dur` for the cell, the right shape
already) and `index.css:679` `.solve-failure { animation: refuse-shake 0.6s linear }` (the
verdict's shake, a hand-typed twin). Nothing holds them equal, and B1/B2 as scoped could not see
it. **Ruling: `MOTION.characters.refuse` is the one home; `useGameCell` imports it; the element
that wears `.solve-failure` binds `--refuse-dur` from the same export; `index.css:679` reads
`var(--refuse-dur)`.** Zero paint moves (600 = 600). A CHARACTER stays a CHARACTER (auditioned
whole, never a rung); what changes is that its number is typed once. The prototype finds the
binder for `.solve-failure` (the verdict's host); if that element has no style binding today the
cost is one `:style` entry, never a second literal.

### 1.6 Two FLIP engines, one backstop

`useFlipGlide.ts:116` guards at `durationMs + 220`; `useCarouselGlide.ts:31` at `GLIDE_MS + 200`.
`MOTION.settleGuardMs: 220` (EXEMPT), both engines derive from it. G-GUARD.

### 1.7 The tongue: carried, a mechanic

W2 §2.7's four berths live in `DrawerTab.vue:79-227`; the onset swap (163.0 / 154.0 px) is a
berth question, the deferred swap was refuted at 371.7 px by this family's own pass-2 trace. §13
may time the tongue, never re-berth it. G-TONGUE stays RED and goes to W2 with its numbers.

### 1.8 The code roster: the four-class fence

77 clocks in 24 `.ts`/`<script>` files at HEAD, 19 of them bare literals (research §1.3), against
85 CSS terms. The ladder's claim "one home for every length" is true only if a gate reads both
rosters. The fence a gate can execute, and the tag each class carries in source:

| class | law | sites at HEAD | what the gate requires |
| --- | --- | --- | --- |
| **TRAVEL** | a painted length; the ladder's business | WAAPI durations, `useControlsDrawer.ts:86`, `useCarouselGlide.ts:27,31`, `useFlipGlide.ts:116`, `App.vue:376`, `GameGallery.vue:371,377`, `usePathAnimation.ts:123,163`, `AnswerKeyLaminate.vue:34,144-145`, `HandwrittenGlyph.vue:201,230`, `glyphAnimations.ts:58,69`, `DifficultyTally.vue:77,148`, `GameCard.vue:190`, `useGameCell.ts:184` | reads `MOTION.rungs.<r>`, a rung expression, `spend(…)`, or an ADMITTED TS class (`DRAW_IN_PRESETS`, `GLYPH_ANIM`, `CELEBRATION`, `characters`, **`WASH` as §12's GRADED furniture**, §1.9) |
| **WINDOW** | a class held over a gesture, derived from a rung | `DarkModeToggle.vue:671` 400 (dusk + 50), `:676` 1100 (the toggle character), `App.vue:220` 900 (the seam guard), `GameControlPanel.vue:219` `PEEK_HOLD_MS` 350 | the expression names its rung or character (`MOTION.rungs.dusk + 50`) or carries `// window:` with the gesture it holds; a bare literal is RED |
| **CADENCE** | a beat; R6 law 7's business | `GameControlPanel.vue:96,98` `setTimeout(tick, 120)` (a hand-rolled underline boil, "~8Hz") | reads `MOTION.beatMs` or `beatsFor()`. 120 → 125 is +5 ms, declared (§8's exhibit 5) |
| **POLICY** | a deadline, a backoff, a dwell, a wire rate; never painted | `relayWire.ts:67`, `solver/client.ts:56`, `useSession.ts:616,624,910` (`CUR_MS` is a send rate, not a boil), `GameControlPanel.vue:323,520,555`, `App.vue:292`, `useLongPress.ts:40`, `GameShell.vue:86` — 13 | carries `// policy:` and one word (`retry`, `leash`, `heartbeat`, `idle`, `long-press`, `wire`); out of scope by KIND; a `*_MS` const without a class tag is RED |
| instrument artefacts | type positions and comments the regex read as clocks — 9, named in research | the gate's parser strips comments and type annotations before it reads; the nine are the self-test's negative-negative (must NOT red) |

The fence and the tags ship in the SAME commit as the widened arm (§4 commit 2), or the first
person to meet a red on `HEARTBEAT_MS` mutes the gate.

### 1.9 `WASH`, and the truth of law 4

`useJoinWash.ts:101` opens "EVERY NUMBER. Tuning happens here and nowhere else" over fifteen
constants, two of which are the ladder's own numbers (`rowArmMs` 520 and 440). It is §11/§12's
furniture (the join wash). This pass names it and does not re-home it: `WASH` is an ADMITTED
GRADED TS class (one bank row, content-anchored, `useJoinWash.ts :: WASH`), and R6 law 4 is
proposed MOVED with its KIND scope (§5), because at HEAD the law is false by measurement: `WASH`,
`REFUSE_MS`, `LIFT_MS`, `KEY_DRAW_MS`, `KEY_DELAY_LEAD_MS`, `PEEK_HOLD_MS`, `DRAW_STAGGER_MS`,
`CUR_MS`, `SAMPLE_MS`, `RETRY_MS`, `DEAL_LEASH_MS`, `HEARTBEAT_MS` all live outside
`pencilConfig`. A row the tree contradicts is worse than no row.

---

## 2 · Every site, classed

### 2.1 The script class: value unchanged, or lengthened ≤5 %

Unchanged from pass 2: exact matches (150 ×18, 200 ×14, 250 ×7, 350 ×4, 440 ×2 = 45 positions)
plus 240 → 250 ×4 and 500 → 520 ×5 = 9. **54 of the CSS positions read a rung**, each now bare.
Zero shortened. The nine lengthened rows are named with their surface in the record and are
§8's exhibits 3 and 4.

### 2.2 The ADMITTED ledger, keyed so it cannot collide

Research §7 row 13: over the same rows `file :: line` collides 15×, `file :: prop :: ms` 23×,
`file :: term` 6×, **`file :: selector :: term` 0×**. That is the key; no ordinal.

| class | positions | rows | ruling |
| --- | --- | --- | --- |
| CHARACTER | 13 | the dark-toggle gesture (admitted whole, `@toggle-beats` its cite), `cell-reveal` 300, `eraserScrub` 400, `sharePop` 500, **`refuse-shake` (now reads `var(--refuse-dur)` at both sites; the number's home is `characters.refuse`)**, ScribbleLoader 1000, the wordmark's 1200 wipe | a keyframed gesture is auditioned whole |
| GRADED | 15 CSS + 2 TS | the player rows 320/380/280/320/320/260, the laminate 280 ×2 (R6 §1.2 — MOT-VERB's `signature` row, one ruling, cited here), `--draw-dur` 160, `ghost-draw-on` 180 ×2 (§6's, R6 law 39), `DRAW_IN_PRESETS`, **`WASH`** | a set whose differences are the design |
| PRM-FALLBACK | 2 | `DarkModeToggle.vue :: reduced :: 200ms`, `AnswerKeyLaminate.vue :: linear :: 150ms` | a reduced-motion fallback never reads a rung, because the ladder reads 0 there |
| RETUNE | 0 | (the class exists; B6 reads it) | a SHORTENING the owner cites at a re-look |

### 2.3 The retune policy, now gate-readable (B10)

The three PINNED cites already exist verbatim in source (research §7 row 2): `pencilConfig.ts:150`
"RATIFY-ME (T4-W12 ballot row 4)", `:157` "(T4-W12 Wave C)", `useControlsDrawer.ts:86` "auditioned
480/520/560 … S3′". After this pass they live on the rung's docstring and at the site. B10 asserts
three things per PINNED site: the cite string is present at the site; the site's value IS the rung
(`MOTION.rungs.throw`, never a literal); the rung's docstring names the same ruling. Content, not
lines. Every other site FOLLOWS silently, and the record says so beside the five 500 → 520 rows
and the derived deal delay.

### 2.4 What dies

`MOTION.cardStepMs` / `boardFoldMs` / `chromeLeaveMs` (their rulings move into the rung rows) ·
`--card-step-ms` and its `:style` publisher (`GameGallery.vue:930`) plus the gate allowlist entries
that would keep its door open · `GLIDE_MS` (`useControlsDrawer.ts:86`) and `useCarouselGlide`'s own
guard · `REFUSE_MS` as a composable-local const · every `var(--motion-x, Nms)` fallback (59 in the
pass-2 tree) · the two bare 120 ms ticks · `transition: all` (`GameControlPanel.vue:2089` →
`filter, transform`) · this family's curve row (to MOT-VERB) · `--ease-dusk` (never mints;
MOT-VERB's rule 1′) · `framesOver40px` as a criterion · the absolute >100 ms theme-flip clause.

---

## 3 · PRM, the posture, ruled (unchanged in direction, sharper in mechanism)

A rung reads `0ms` under reduce; every rung consumer collapses to a same-frame swap, transitions
included (proven against MAIN's dist in pass 2: `.icon-btn` 0.15s → 0s, `.transition-colors`
0.2s → 0s, both engines). New this pass: **absence is the same value.** A registered rung with no
publisher reads `0ms`, so a broken publisher ships the reduce page, not a page of `transition: all`
and not a page that looks fine. The two PRM-FALLBACK rows keep breathing. The universal reset at
`index.css:744-748` stays as the animation floor for what lies outside the ladder; its comment is
rewritten to say what is now true.

---

## 4 · The plan: files, order, what each commit is

1. **THE GATE, born-RED** — `scripts/check-motion-bands.mjs` + `scripts/motion-bank.json`
   (`{ rungs: {…}, sites: { "file :: selector :: term": ms } }`). Two rosters: CSS (B1/B3/B4/B7/B8/B9)
   and CODE (B11, the four-class fence, comments and types stripped). B6 compares rung-to-rung
   against `bank.rungs` and site-to-site against `bank.sites`; a lower value needs a RETUNE row
   with a cite. B10 reads the three PINNED sites. B12's static half. `--self-test` runs every
   negative control (incl. the critic's exact `throw` 520 → 500 sabotage in a scratch copy, and the
   planted `.animate({duration: 777})` + `setTimeout(…, SABOTAGE_MS)`) and then FALLS THROUGH to
   the census (MOT-VERB's lesson: a self-test that exits never runs the census in CI). `npm run
   lint:bands` = `node scripts/check-motion-bands.mjs --self-test`; the CI lane, `check-lane-
   membership` and `knip` green in the same commit. ≤3 files. RED at HEAD.
2. **THE HOME** — `pencilConfig.ts` (rungs, `characters`, `settleGuardMs`, `motionRungsCss`,
   `publishMotionRungs`, the rulings on the docstrings), `main.ts` (the one call), `index.css`
   (the root line, no fallback; the reset comment), `useFlipGlide.ts` / `useCarouselGlide.ts`
   (the guard), `useControlsDrawer.ts` (`GLIDE_MS` dies; the dock reads `rise`, the desk `throw`;
   the cite moves to the rung and stays at the site), `App.vue` (the fold reads `throw`; `:643`
   reads `leave`; `:220` tagged WINDOW), `GameGallery.vue` (`:371` derives from `throw`; `:930`
   binding dies), `GameCard.vue`, `usePathAnimation.ts`, `useGameCell.ts` + `DigitCell.vue` + the
   `.solve-failure` host (`characters.refuse`), `DarkModeToggle.vue:671,676` and
   `GameControlPanel.vue:219` (WINDOW expressions), `GameControlPanel.vue:96,98` (`beatMs`), the 13
   POLICY tags, `useJoinWash.ts` (the `WASH` row's anchor comment), the six Tailwind attributes,
   the R6 MOVED diff under `instruments/`. ≤22 files, `vue-tsc` 0. The gate's CODE arm goes GREEN
   here; the CSS arm stays RED until 3.
3. **THE SITES** — the 54 script-class positions bare, the five followers, the four 240 → 250,
   the dusk's LENGTH (`--motion-dusk`; the curve token is MOT-VERB's), the PRM arms.
   `apply-ladder.mjs` re-run with anchored edits that fail loud. ≤16 files. Nothing in
   `gameCell.css` (§6's, chair §6.11).
4. **PROPOSED, NOT APPLIED** — `instruments/app-exit-last-rect.diff`: `App.vue`'s last-rect read
   after the layout is real. Built in a second scratch tree, measured (§7), carried to the ballot.

Fold order with MOT-VERB: LADDER lands 1 → 3 first (the drawer reads `MOTION.rungs.*` directly);
VERB re-cuts those TS reads to `spend()` on top. One law-4 diff (this family's); MOT-VERB cites.

---

## 5 · The MOVED record (R6, proposed as a diff under `instruments/R6-moved-rows.diff`, never re-cut in place)

- **Ruling 1** ("at 520ms", no pose scope): scoped — *the DESK drawer's curve is
  `cubic-bezier(0.32, 0.72, 0, 1)` at 520ms; the dock (<1024) rides the same curve at the rung the
  owner rules (`rise` 600 proposed, `throw` 520 shipped)*. Law 2's fence is what the scoping rides
  on; the curve never re-eases.
- **Law 4**, re-cut without the stale parenthetical and WITH its kind: *no TRAVEL length outside
  `pencilConfig` (`MOTION.rungs`, `beatMs`, `settleGuardMs`, `characters`, the admitted TS classes
  `DRAW_IN_PRESETS` / `GLYPH_ANIM` / `CELEBRATION`, and `WASH` as §12's graded furniture); a WINDOW
  derives from a rung; a CADENCE reads `beatMs`; POLICY is out of scope by kind*. The row states
  that at HEAD twelve constants contradicted the old wording.
- **§1.3** the guard ribbon: 240 → `note` 250 on `--ease-glassGlide` (250 is two boil beats; 240
  is not).
- `HandDrawnGrid.vue:620-623`'s comment (240 → 250) in the same hunk.

MOT-VERB files R6 §1.2's laminate row (its `signature` admission); this family cites it.

---

## 6 · Gates this family lands with (born-RED; the reading at HEAD `74a2b5d9` in brackets)

| id | asserts | RED at HEAD | negative control (self-test) |
| --- | --- | --- | --- |
| B1 NAMED | the first time value in every CSS term is a rung or an ADMITTED row; ledger closed both ways, `file :: selector :: term` | 59 unadmitted | remove one ledger row → RED |
| B2 CLOSED | `MOTION.rungs` ≤8 keys; every other numeric member EXEMPT by cite or an admitted TS class | 4 unruled band keys | plant `dockGlideMs: 600` → RED |
| B3 ONE HOME, NO FALLBACK | exactly one `<style data-motion-rungs>`; no `--motion-*` declaration anywhere but the render (`.css`, `<style>`, `:style`, `["']`); no `var(--motion-*, …)` fallback; the live cascade's seven values equal the parsed rungs byte-for-byte | RED (no publisher) | plant a `:style` shadow → RED; plant one fallback → RED |
| B4 NO-ALL, static + live | `transition: all` nowhere in source; on a NAMED rung consumer (`.icon-btn`) `transition-property` never computes `all` | 1 static | — |
| B5 PRM (runtime) | under `reduce`, both engines, 390×844 dock open and 1280×800: no live rule reading a rung resolves nonzero; every other nonzero live rule is a PRM-FALLBACK row | 28 rules tween | append an un-admitted live rule to the fixture → RED |
| **B6 RATCHET, rung-keyed** | every `bank.rungs.<r>` ≤ the tree's rung; every banked site ≤ its current value; a lower value needs a RETUNE row with a cite | GREEN until the bank exists; RED on first run with one rung shortened | **`throw` 520 → 500 in a scratch copy (the critic's sabotage) → RED** |
| B7 TAILWIND | no `duration-\d+` attribute; `--default-transition-duration: var(--motion-whisper)` with no fallback | 6 sites, 0 root line | plant `duration-300` → RED |
| B8 CURVE (prohibition only) | no bare `ease`/`ease-in`/`ease-out`/`linear` on a `transition:` | 16 | — |
| B9 DELAY FENCE | the second and later time values in a term are literals, never a rung | vacuous at HEAD; RED on the pass-1 MOT-VERB branch | plant `var(--motion-note) var(--motion-whisper)` → RED |
| **B10 PINNED-CITE** | at each PINNED site: the cite string present, the value is the rung, the rung's docstring names the ruling | 3 of 3 (literals, cites on the wrong node) | drop the cite at `useControlsDrawer` → RED |
| **B11 KIND FENCE (code roster)** | every clock in `.ts`/`<script>` is TRAVEL (reads the ladder or an admitted class), WINDOW (derives + says so), CADENCE (`beatMs`), or POLICY (tagged); a bare literal is RED; the nine artefacts do NOT red | 19 bare literals, 0 tags | plant `const GLIDE_MS = 600`, `.animate({duration: 777})`, `setTimeout(…, SABOTAGE_MS)` → RED ×3 |
| **B12 ABSENCE (chair §6.5's row)** | a scratch build with the publisher call deleted: `.icon-btn`'s `transition-duration` computes `0s`, `transition-property` `opacity`, both engines — the reduce page, not `all`, not normal | RED (no registration; absence → `all`) | ship `initial-value: 520ms` in the scratch → the row reads 0.52s → RED |
| G-DOCK-BAND | `rungs.rise`'s docstring carries the band's ends; live travel at 844×390 / 390×844 / 768×1024 matches within 5 %; both statistics banked as a full per-frame series | 0 of 1 declared | edit the declared px → RED |
| G-EXIT-MIRROR | each exit mover's declared travel mirrors its entry's within 10 %, 1440×900 and 390×844, both engines | 390×844 wordmark 10.0 vs 145.49/145.77 | stays RED until the ballot (U-10) |
| G-TONGUE | carried to W2 (a mechanic) | 163.0/154.0 | — |
| G-GUARD | one settle-guard constant read by both FLIP engines | 200 vs 220 | — |
| **G-REFUSE-ONE-HOME** | `refuse-shake`'s length appears once, in TS; both CSS consumers read `var(--refuse-dur)` | `index.css:679` literal | plant `0.6s` back → RED |

CI half (O-12): B1–B4 static, B6, B7, B8, B9, B10, B11, G-GUARD, G-REFUSE. Local instruments with
banked artefacts: B4 live, B5, B12, G-DOCK-BAND, G-EXIT-MIRROR.

---

## 7 · The prototype brief

**Build.** A FRESH worktree from `74a2b5d9` under the scratchpad (the fold is law; never main's
tree). Replay the pass-2 delta: `git -C .claude/worktrees/wf_8630d340-e56-60 diff a8fee1f5`
(C06 included, per the chair's §8) — research says it applies clean, `git apply --check` first
and name the route if the isolation refuses `git`. Then §4's commits 1 → 3 as three patches
(never committed on main). `npx vite build` → `dist-after`. Control: `74a2b5d9` bare →
`dist-control`, named as the commit in every π row. **Two clean builds each, `scripts/dist-identity.mjs`
run, its output banked** (never a hand-typed md5). Serve `dist-after` on 127.0.0.1:4246 and
the control on the next free port in 4230–4249, `--strictPort`, `python3 -m http.server` (no vite
cache touched); any dev server through the two-line scratch config with a private `cacheDir`;
a scratch Playwright config resolving `@playwright/test` via `createRequire(<frontend>/package.json)`;
chromium + webkit headless; 390×844 dsf3 touch, 768×1024, 844×390, 1440×900; both themes. No
osascript, no Safari.app. Everything over 90 s in the background with a log, polled. Every server
killed; the band read empty at return.

**Static, bare (no pipe).** The §6 table RED at the control and GREEN after; `--self-test` shows
every check able to fail (B6 by the critic's sabotage, B11 by the three plants, B12's static half
by the 520ms initial-value) and then prints the census; `lint:motion` 34 specs; `vue-tsc` 0;
`lint:copy` 0; `check-theme-tokens` 0 unreferenced; `knip` 0; `check-lane-membership` 0;
`check-font-coverage` unchanged; bundle delta in BOTH units with the ceiling stated in gz.

**Runtime, numbers first.**

| probe | success |
| --- | --- |
| the node | one `<style data-motion-rungs>`; seven `@property` registrations present; under `reduce` every `--motion-*` reads `0s` at `:root` and on `.icon-btn`, `.washi-label`, `.drawer-tab-text`, a `.transition-colors` element, both engines |
| B12 absence | a scratch build with the `publishMotionRungs()` call deleted: `.icon-btn` duration `0s`, property `opacity`, both engines; the same scratch with `initial-value: 520ms` reads `0.52s` (the negative control) |
| the boot-frame sampler (CTRL-TAPE's critic's graft, `addInitScript` rAF loop) | the first frame in which ANY element consumes a `--motion-*` vs the frame the node lands: the window in frames, both engines. **This is the number that prices §8's build-time objection**; 0 keeps §2.1, >0 hands the agglomerator the cure |
| B5 roster | 0 live rules reading a rung with nonzero duration under reduce; exactly 2 PRM-FALLBACK rows nonzero |
| dock band, FULL per-frame series | both arms (520 / 600) at 768×1024, 390×844 light + dark, 844×390, desk control at 1440×900; per pose: travel, worst frame, frames >40, excess area Σ max(0, Δ−40); success = worst frame −11…14 % and excess area −20…26 % at matched travel (webkit), desk unchanged ±0.7 px |
| dock settle | open, wait 700 ms: 0 running animations; the rest rect equals the control's to the pixel, both engines both themes |
| the exit's rest geometry, re-read on THIS build | `.logo-menu` playing vs gallery rest at 390×844 and 1440×900, both engines: 145.49/145.77 and 319.10/324.02 within 0.5 px (the research read a stale dist) |
| the exit with `instruments/app-exit-last-rect.diff` applied in a SECOND scratch build | wordmark exit travel at 390×844 within 10 % of 145.5, both engines; the board host within 10 % of its entry; the desk unchanged. Numbers to the ballot; the patch stays proposed |
| the dusk, fixed-t | `CSSTransition.pause()` + written `currentTime`, t = 0, 35 … 350: `background-color` on `--motion-dusk` + MOT-VERB's `--verb-dusk-ease` equals bare `ease` 11/11 samples, both engines |
| the refuse twin | `.solve-failure` and `.game-cell.is-refused` both compute `animation-duration: 0.6s` from the binding; `index.css` carries no `0.6s` |
| frame trace, 15 gestures at 1× | no gesture gains a >33 ms frame against the control; bake frames unchanged in kind (W8's) |
| theme flips ×6 at 4× | parity with the control per flip; long-frame list identical |

**π identity (surfaces this family does not claim), on `dist-after` with the control paired,
raw output banked under `readings/`:** goldens 4/4 unmoved (`PLAYWRIGHT_BASE_URL`, no re-mint);
`e2e/filter-census.spec.ts` under `playwright-throttle.config.ts` both engines, allowlist EXACTLY
9; r6's `hue-census.mjs` and `law-probe.mjs` COPIED into `instruments/` with OUT re-pointed, 29
rows byte-identical, L2 (ruling 1 / law 3) reported MOVED with the diff cited; r1's
`heading-voice.spec.ts` and r3's `wobble.probe.ts` from copies, readings identical; a rect census
of the three rest poses vs the control, Δ 0.00.

**Frames.** Zero planned. If the critic wants one: the dock at the worst frame, 520 beside 600,
390×844 dark, webkit, ONE crop ≤150 KB.

**Cost.** Three commits ≤3 / ≤22 / ≤16 files; deletions stated, never hidden.

---

## 8 · What the owner disposes (U-10), and the objections this return carries

**Exhibits for the re-look.** (1) `rise` 600 for the dock, with the two statistics and the desk
untouched. (2) The phone's exit: 145 px of wordmark travel where today it cuts (the proposed
App.vue patch, numbers from §7). (3) Four 240 → 250 lengthenings (the ribbon, the trace). (4) Five
500 → 520 followers. (5) The underline boil 120 → 125 (R6 law 7's own number).

**Objections, in the return and never in the diff.**

1. **Chair §6.5's `initial-value` must be `0ms` for the motion rungs.** With the rung's real value
   as the initial (row D), the born-RED delete-the-publisher row reads 0.52s and passes; the
   registration ships at `0ms` (row E) or not at all. Absence then reads as reduce, which is the
   honest failure for a ladder.
2. **The build-time publisher** (MOT-VERB's `--write | --check` into `@theme`) deletes the
   publisher's JS (+533 raw / +216 gz measured in pass 2), puts the ladder in the first
   stylesheet, and keeps the rungs inside `check-theme-tokens`' corpus. Registry §2.1 rules the
   runtime node and stands; the boot-frame sampler in §7 measures whether a first-paint window
   exists at all. If it reads 0 frames, the objection costs bytes only and the agglomerator prices
   it; if it reads >0, the build-time form is the cure and §2.1's mechanism moves.
3. **Arm 4 (CSS as the one home, TS reads the cascade)** is ~0 JS and PRM-by-construction for the
   movers, and is refused here on the wave's own §13 sentence (durations live in `pencilConfig`).
   Priced: ≈+1,300 B CSS raw, 0 JS, one `getComputedStyle` read per gesture with a module-scope
   cache as a second mechanism.
4. **The bundle ceiling** (+400 raw / +150 gz) is unmeetable in raw at every honest arm (the
   grammar alone is ~+1,000 B) and missed by 7 B in gz for CSS. State the ceiling in the units
   that ship.

**Handed over.** `gameCell.css:35,:154` to MRK-LIVE (§2.5). The curve row and the scrub sampler
to MOT-VERB. G-TONGUE to W2. `WASH`'s fifteen numbers stay §12's; the law-4 row names them.
