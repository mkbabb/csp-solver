# NOTE-ERASE · pass-3 RESEARCH — the note leaves

T9-W7 §7. One family, its own charter (`pass2/charters/NOTE-ERASE.md`), the chair's rulings
(`pass3/CHAIR-RULINGS.md`) read first. Read-only on product files; **no dev server was started
and port 4248 was never bound** — every reading below is either a file:line fact off the pass-3
base `74a2b5d9`, a cited pass-2 number (marked whose), or my own lab measurement on `about:blank`
with the estate's own Vue (`probe/r3-leave.mjs`, `readings/r3-leave-{chromium,webkit}.json`).
Nothing under `r0/`, `pass1/` or `pass2/` was written (`find -newermt` clean). No crops taken:
every finding here is a number or a source cite.

---

## 0 · The one thing this pass turns on

The critic's gap 1 is not a specificity slip with a one-selector cure. It is **two independent
defects that happen to cancel into one flicker**, and the family should close both or it will
carry the second into the fold:

1. **the DROP CLOCK is wrong** — Vue reads the leaving element's computed style and takes
   `max(transitionTimeout, animationTimeout)`, so the settle's 350 ms colour transition outranks
   the 150 ms rub-out and the node is dropped on a 351 ms fallback timer;
2. **the REST POSE is wrong** — `ink-rub-out` declares no fill, so at 150 ms the cascade takes the
   line back to `clip-path: none; opacity: 1`. Whatever the drop clock says, the erased pose is
   not a pose the cascade can hold.

Cure 1 alone is what the charter asks for. Cure 2 is what the ESTATE's own law asks for, it is
free, and it is the only one of the two that survives a rule this family does not control.

---

## 1 · The mechanism, at the source

`web/frontend/node_modules/@vue/runtime-dom/dist/runtime-dom.cjs.js` (Vue **3.5.39**, the tree's
own copy):

| line | what it decides |
|---|---|
| `:321` `getTransitionInfo` | reads `getComputedStyle(el)` on the LEAVING element |
| `:344-347` | untyped branch: `timeout = Math.max(transitionTimeout, animationTimeout)`; `type = transitionTimeout > animationTimeout ? "transition" : "animation"` |
| `:303` | `endEvent = type + "end"` — with `type = "transition"` it listens for `transitionend` |
| `:314-318` | and drops the node on `setTimeout(..., timeout + 1)` when the event never comes |
| `:296-297` | `explicitTimeout != null` short-circuits the whole sniff — this is `<Transition :duration>` |

A settled note leaving carries `transition: color 0.35s` (the age rule) and
`animation: ink-rub-out 150ms, ink-rub-out-fade 150ms` (the leave rule). 350 > 150, so `type`
is TRANSITION, `timeout` 350, the listener waits for a `transitionend` that never fires (nothing
transitions during the leave), and the node goes at **351 ms**. The critic measured the
consequence live (`pass2/critique/NOTE-ERASE/logs/settled-exit-*.json`, THEIRS): `trans "0.35s"`
present on every leave frame, gone 371 chromium / 386 webkit, 24/13 frames of restored ink.

## 2 · My own reading — four arms, both engines (`readings/r3-leave-*.json`, MINE)

The estate's Vue, the pass-2 build's exact rules, `about:blank`, 1280×800, rAF train, node
removal detected by the same train. The lab reproduces the live defect within one frame, which
is what licenses the other three arms.

| arm | what it adds | chromium: node gone / restored frames | webkit: gone / restored | `transition-duration` seen on the leave |
|---|---|---|---|---|
| **A** as pass 2 built it | — | **365.2 ms / 25** (span 156.8→356.8) | **382 ms / 13** (166→366) | `0.35s`, property `color` |
| **B** specificity cure | `.ink.note-leave-active[data-note-age] { transition: none }` | **154.2 ms / 0** | **159 ms / 0** | `0s`, property `none` |
| **C** rest pose only | `.note-leave-to { clip-path: inset(0 100% 0 0); opacity: 0 }` | 364.4 ms / **0** | 374 ms / **0** | `0.35s` |
| **D** both | — | **150.3 ms / 0** | **159 ms / 0** | `0s` |

Distinct clip states inside the verb: 18 / 18 / 19 / 18 chromium (median rAF 8.3 ms), 10 / 10 /
11 / 10 webkit (17.0 ms) — the frame bar ⌊150/rAF⌋ = 18 and 8 clears on every arm, so no cure
costs the verb its resolution.

**Read arm C twice.** It leaves the drop clock broken and still shows ZERO restored frames: the
last present sample reads `inset(0px 100% 0px 0px)` at `opacity 0` on both engines. The flicker
is a REST-POSE defect, and the rest pose is the half that keeps holding when someone else's rule
(a palette lane's colour transition, the ladder's `:root` re-home, a future `@property`
registration with a non-zero initial) puts a duration back on this element.

## 3 · The estate already owns the idiom — three sites, three for three

| site | leave-active | the departed pose | PRM arm |
|---|---|---|---|
| `App.vue:1141-1153` `gallery-fade` | `transition: opacity 200ms var(--ease-glassGlide)` | `.gallery-fade-leave-to { opacity: 0 }` | local `@media (prefers-reduced-motion: reduce) { .gallery-fade-leave-active { transition: none } }` |
| `GameGallery.vue:1471-1494` `guard-ribbon` | `transition: transform/opacity 240ms` | `.guard-ribbon-leave-to { transform; opacity: 0 }` | local, and it re-poses the `-to` |
| `FilterTuner.vue:623-631` `tuner-slide` | transition | `.tuner-slide-leave-to` | — (dev surface) |

Those are the ONLY three `<Transition>`s in `src/` (grep, whole tree). Every one of them names a
`-to` pose, and every shipped one carries its PRM arm AT THE SITE. NOTE-ERASE's pass-2 build is
the first `<Transition>` in the estate with no `-to` class and the first whose PRM arm is
borrowed from another file (`index.css:1157-1171`). Both of the critic's gaps 1 and 4 are that
one deviation, and taking the house idiom closes them together:

- `.note-leave-to { clip-path: inset(0 100% 0 0); opacity: 0 }` — the animation still paints
  (animation origin outranks the cascade), and when it releases at 150 ms the cascade is already
  standing where the keyframe ended. This is `index.css:986-989`'s own sentence, satisfied
  literally: *"Every `to` equals its consumer's cascade rest pose, so releasing the fill changes
  no pixel."*
- **R6 law 6 closes by deletion, not by declaration.** The verb takes no fill, exactly as
  `bloom-out` takes none (`index.css:986-990`, cited verbatim in the estate's own discipline),
  and `FILL_ALLOWLIST` gains nothing. Charter row 14's `backwards` is not needed and would be
  ceremony: with no delay it paints nothing. **Recommend: no fill, cite `bloom-out`.**
- The PRM arm lands in `MarginNote.vue` beside the leave rule, in the three sites' shape. Gate 7's
  static half then asserts the FAMILY's own block, not another file's — and `index.css:1163`'s
  `.margin-note-ink` entry stays exactly where it is for the write-in, untouched (π-free).

## 4 · The base moved: `74a2b5d9`, and what the replay must re-cut

The fold touched 16 frontend files (`git diff --stat a8fee1f5 74a2b5d9 -- web/frontend`). Overlap
with this family's 12:

| file | fold's hunks | family's hunks | verdict |
|---|---|---|---|
| `GameBoard.vue` | `:53` import, `:470-530` (`pointedPos`, `isCoarse`, `hoveredPos` computed, focusout), `:1081`, `:1252` | `:35`, `:58`, `:109`, `:614-677`, `:697-830`, `:923`, `:1130` | **one real conflict: the import block.** The margin's own region (`:645-800`) and the fold's tape region never meet. Re-cut the import hunk toward the fold (`useCoarsePointer` stays), name it in the return |
| `BoardHost.vue` | `:84-110`, `:259` (`cellAuthors`) | `:31`, `:235` (`parked` forward) | adjacent, not overlapping |
| `useGameState.ts` | **untouched by the fold** | the `origin` seam | clean replay |
| `MarginNote.vue`, `index.css`, `pencilConfig.ts`, `App.vue`, `GameShell.vue`, `main.ts`, `types.ts`, `check-ink-pressure.mjs` | untouched | — | clean |
| `GameBoard.notes.test.ts` | fold edits 14 lines | family adds rows | re-read before asserting |

The refusal string is unmoved: `GameBoard.vue:747` still `setMargin("that's a given clue", "teacher-red")`, and `GameBoard.notes.test.ts:216/:225` still assert it. B1/B1b moved the SOLVE tape and the paper note, not the margin. **π control for pass 3 is `74a2b5d9`**, named in every row.

## 5 · The surfaces and tokens, exact

| surface | file:line at `74a2b5d9` | what this family does to it |
|---|---|---|
| the ink span | `MarginNote.vue:61` `<span v-if="text" :key="text" class="margin-note-ink">` | wrap in `<Transition>`, `:key="seq"`, `:data-note-age`; **`:name` bound** (NOTE-LEDGER's graft — the node's departure means two things) |
| the arrival | `MarginNote.vue:147-150` `animation: ink-write-in 250ms var(--ease-noteWrite) backwards` | moves to `.note-enter-active`, length reads the `note` rung |
| the tally's arrival | `MarginNote.vue:180` (second `250ms`) | same rung; outside the Transition, stays an animation |
| the two prose `250ms` | `MarginNote.vue:13`, `:25` | re-worded to the rung's name (gate 13 counts comments too) |
| the write-in keyframe | `index.css:1115-1122` (`@layer utilities`) | UNCHANGED; the rub-out mirrors it beside it |
| the PRM block | `index.css:1157-1171`, `.margin-note-ink` at `:1163` | UNCHANGED; the family's own PRM arm lands at the site |
| the easing roll-call | `index.css:341-344` (`--ease-accelIn`'s enumeration) | drop the enumeration, keep the role sentence — `index.css:336-338` is the block's own law |
| the curves | `index.css:349` `--ease-noteWrite`, `:352` `--ease-accelIn`, `:350` `--ease-standard` | consumed, none minted |
| the clocks | `pencilConfig.ts:121-195` `MOTION` (`beatMs: 125` at `:123`) | `MOTION.note` gains clocks in BEATS only |
| the rungs | do not exist at HEAD | **consumed from MOT-LADDER** (§2.1); this family's `MOTION.rungs` + `publishMotionRungs()` + the `main.ts` call all die |
| the writers | `GameBoard.vue:645-656` `setMargin`, `:651` its signature | `kind` + `seq`; `hintNoteLive`/`refusalNoteLive` (`:649-650`) die |
| the repeat idiom | `GameBoard.vue:689-697` `announce()` | ONE helper with the margin's repeat (§7 below) |
| the hint arm | `GameBoard.vue:709-737` | kind `record` |
| the refusal arm | `GameBoard.vue:742-753` | kind `reply`, the hold |
| the stale clear | `GameBoard.vue:780` `marginTone.value !== "graphite"` | keys on `kind`, not tone |
| the refusal seam | `useGameState.ts:477` set · `:488` cleared by a landing write · `:771` cleared by fill | `origin` required |
| **the self arm (gap 8)** | `useGameState.ts:537-547` `applyHintInk` | **measured: it clears `values`, `solvedValues`, `animatingCells`, `solveState` and NOTHING ELSE** — no `lastRefusal`, no `hintReasoning`. `inkReveal` (`:730-736`) is its only self caller |
| the park's clip | `GameCard.vue:456-461` `.live-face-slot { position:absolute; inset:0; overflow:hidden }` | the note is clipped, never painted (critic's 2.6 px, THEIRS) |
| the Scene seam | `App.vue:89-93` (`FunctionalComponent<{ leaving?: boolean }>`), bound `:864-865` | `parked?: boolean`, forwarded `GameShell.vue:51/:146/:153` → `BoardHost.vue` → `GameBoard.vue` (THREE forwards) |
| the gate | `check-ink-pressure.mjs:399` `SHIP4`, `:515-534` `gateTape`, `:650` `selfTest`, `:732` the covered set | `gateNote` lands ONCE under NOTE-LEDGER (§2.3); this family contributes its two self-test cases and its consumer string |

## 6 · The numbers pass 3 must hit

| row | number | source |
|---|---|---|
| node gone after the retract | **≤ whisper + 1 frame**: 154.2 chromium / 159 webkit measured on the cure (arm B/D) | MINE |
| frames past the verb showing full ink | **0** (was 25 / 13) | MINE |
| distinct clip states in the verb | **≥ 18 chromium, ≥ 8 webkit** (⌊150/rAF⌋, rAF 8.3 / 17.0) | MINE, agrees with pass 2's 18/18, 8/9 |
| the settle lands | 8 beats = **1000 ms ± 1 frame** (1003–1018 measured) | pass 2, THEIRS |
| painted AA, settled | **5.17–5.19 light / 6.07–6.14 dark** ≥ 4.5 | pass 2 + critic, THEIRS |
| painted AA, fresh / verdict / gold | 14.52 · red **4.87** light, 6.44 dark · gold 4.85 light, **11.48** dark (gold still owes a painted witness) | pass 2, THEIRS |
| filterBudget | **9 exact** at 4×4 / 9×9 / 16×16, both engines | pass 2, THEIRS |
| the hold | `24 × 125 = 3000 ≥ 2582` (G-hold), band 24–40 (U-10) | pass 2, THEIRS |
| **the empty an AT can hear** | **13 ms chromium / 8 ms webkit as built** — see §7; the cited floor is ~100 ms | pass 2's own `b1-repeat-*.json`, re-read by me |
| π vs `74a2b5d9` | every unclaimed rect 0.00; the ONE declared move is the replacement latency +150 ms | control named |

## 7 · The repeat hole is not 167 ms — it is 13 ms, and it is BELOW the prior art's floor

Charter row 7 asks for an AT basis. Reading pass 2's own trajectory
(`prototype/NOTE-ERASE/readings/b1-repeat-chromium.json`, THEIRS) against the DOM the AT sees:

```
t=1045  the retract: text := ""  →  the LEAVING span still holds "that's a given clue"
t=1187  the node is removed      →  the region's textContent becomes ""      ← mutation 1
t=1200  the re-write             →  "that's a given clue"                    ← mutation 2
        the empty window an assistive technology can observe = 13 ms
```

`whisper + 17` is measured from the RETRACT, not from the removal, so the timer's 167 ms buys a
hole of one frame. Prior art (background only, the verdict is the codebase's): the WordPress core
thread on Safari/VoiceOver swallowing repeated identical live-region strings settles on a **150 ms**
clear-then-set and still reports it inconsistent; the common practitioner figure is **100 ms**,
and NVDA deliberately waits after a mutation to coalesce further ones. 8–13 ms is an order of
magnitude under both.

**Consequence for the estate, not only for this family.** `GameBoard.vue:689-697`'s `announce()`
opens its hole with `nextTick` — a microtask, so `""` and the re-write land in the SAME frame and
the observable empty is ≈0 ms. If this family's hole is too short, W3's is shorter. That makes
charter row 6 ("one helper, or a stated reason") a class row with its second occurrence in hand.

**What the synthesizer should write:** ONE helper — `sayAgain(region, line)` — that empties, waits
**one beat** (`MOTION.beatMs` 125, a cadence already in `pencilConfig`, R6 law 4 satisfied with
zero new constants), then re-writes under a seq guard; the margin's re-write is timed **from the
node's removal** (`@after-leave`, Vue's own hook), not from the retract. Cost: a repeat replaces
at whisper + one beat = 275 ms, against 167 ms today. The device row (M19) then confirms a hole
the prior art already licenses, instead of being the only thing holding SC 2.2.1's defence up.

`+ 17` dies with it. If a frame is still wanted anywhere, MOT-VERB's delay fence is the graft:
a wait is a delay, keeps its own number, and is never a rung — but R6 law 4 still puts the number
in `pencilConfig`, and a beat is the house's unit for a wait.

## 8 · Chair §6.5 overtakes charter row 10 — and makes gate 13 satisfiable as first written

§6.5 names **"the motion rungs"** explicitly among the measured tokens that register with
`@property` + `initial-value` and are consumed **with no fallback**. That strikes
`var(--motion-whisper, 150ms)`. Two lanes have already measured the ground
(`pass3/research/CTRL-TAPE/README.md §4`, `pass3/research/MRK-LIVE/README.md §6`, THEIRS):
`@property` is live in both engines, `package.json` browserslist licenses it (`chrome >= 111`,
`safari >= 16.4`), the shipped dist already carries **42** `@property` rules from Tailwind v4, and
MRK-LIVE states the wave's form for our very token: `var(--motion-note)` **with no fallback**.

So:

- **gate 13 returns to its original wording** — `grep -c '250ms' MarginNote.vue = 0`, zero duration
  literals in every touched file — and it is now satisfiable, because there is no admitted
  fallback left to contradict it. Widen the grep to the whole diff (charter row 3) and keep the
  chair's re-wording only as the fallback-era note.
- **the born-RED row moves to CTRL-TAPE's form**: assert the PUBLISHED value, not validity. At
  rest `--motion-whisper` = 150 ms; under PRM the ladder's reduce arm publishes 0 ms while the
  registration's initial-value stays 150 ms — **delete the publisher and the PRM row reds**. That
  is the one arm where publisher and registration disagree, and it is the ladder's gate to keep
  (§2.1), cited here, not re-minted.
- **the failure mode is loud, not silent**: unpublished and unregistered, `animation: ink-rub-out
  var(--motion-whisper) …` is invalid at computed-value time, the animation becomes none, and the
  note vanishes with no rub-out at all. Gate 1 catches it. Say this in the spec.

## 9 · The charter's fourteen rows, each with what closes it

| # | row | what pass 3 does | the number |
|---|---|---|---|
| 1 | the settled exit snaps back | arm **D**: `.margin-note-ink.note-leave-active[data-note-age] { transition: none }` **and** `.note-leave-to` | gone 150.3/159, restored frames **0** (MINE) |
| 2 | gate 1 is blind | a second row: arm, **wait past the settle**, retract, assert no frame at `t ≥ whisper` reads `clip-path: none`, absent at whisper + 1 frame | born-RED on arm A: 25/13 frames |
| 3 | `+ 17` outside `pencilConfig` | it dies (§7); gate 13 greps every touched file | 0 literals |
| 4 | gate 7's live half vacuous | the PRM arm lands AT THE SITE, in the three Transitions' shape; the static half asserts MarginNote's own block | `animationDuration "0s"` + `transitionDuration "0s"` under PRM |
| 5 | three rungs with no consumer | closed by §2.1: the ladder publishes, this family consumes `note`/`whisper`/`dusk` | 3 reads |
| 6 | the repeat re-mints `announce()` | ONE helper, hole = one beat, timed from `@after-leave` (§7) | empty window 125 ms, was 13 |
| 7 | the hole has no AT basis | prior art floor 100–150 ms + the M19 device row; the helper meets it | §7 |
| 8 | `applyHintInk` is peer-only | measured: `useGameState.ts:537-547` clears no refusal. Add the self clause with its unit row, or strike the spec's line | 1 line, 1 unit |
| 9 | the park clips, it does not paint | restate §2.3 as *"a reply outlives the act it answered"*; the prop beats the rect test because the rect test is a coincidence of today's layout and `checkVisibility()` has no option for an ancestor's clip | slot `304×304` vs the line 2.6 px below (THEIRS) |
| 10 | gate 13 unsatisfiable | §6.5 strikes the fallbacks; the original wording is satisfiable | §8 |
| 11 | gold has no painted witness | read `CompletionVignette`'s own node after a real solve, with `is-quiet === false` asserted first | 4.85 / 11.48 to confirm |
| 12 | refusal-vs-peer chromium-only | re-cut the row to assert INSIDE the 24-beat hold (the probe's own clock outran it) | both engines |
| 13 | R3-g unrun, censuses owed | **R3-g is `r0/r3-marks/probe/marks2.probe.ts`** and it runs under `reducedMotion: "reduce"`, so its five verdicts are unchanged by design; it needs the same reader amendment as R3-d (`age`, `leaving`) and a MOVED row. hue-census on webkit; `filter-census` G3.2 + goldens on a dist built IN THE WORKTREE | 5/5 unchanged expected |
| 14 | no fill mode | **take none and cite `bloom-out`** (`index.css:986-990`); with `.note-leave-to` the rest pose carries what a fill would have held | `FILL_ALLOWLIST` unchanged |

## 10 · Primitives to reuse, named

- **Vue's own `-to` class** (`.note-leave-to`) — the departed pose; three estate precedents.
- **`@after-leave`** — the removal's own event; kills the second timer's dependence on a frame
  constant.
- **`<Transition :name>` bound** — NOTE-LEDGER's graft: the node's departure means "rubbed out"
  or "replaced", and the name is where that is said.
- **`ink-write-in`** (`index.css:1115`) — the mirror the rub-out is drawn from; shared with the
  vignette, so the rub-out lands beside it in `@layer utilities`, not in the SFC.
- **`useLiveRegion`** (`src/composables/useLiveRegion.ts`) — born-empty / persists / empties. The
  margin is NOT one of its sites today (it is a bare `role="status"` in `MarginNote.vue:54-60`);
  the repeat helper is the third clause of that same law and belongs beside it.
- **`--ease-accelIn`** — the laminate's lift-away; the note is its sixth surface.
- **MOT-LADDER's one publisher** and its PRM-as-a-value; **MOT-VERB's ordinal ledger key**
  (`${file} :: ${body} #${n}`) for any census that counts two identical declarations.
- **CTRL-TAPE's "assert the published value, not the validity"** for the `@property` seam.
- **The painted-byte reader's per-channel cross-check** (pass 2's own, floor 12) — it is what
  caught pass 1's gold 12.46 and it is what the gold witness needs.

## 11 · Sketches

```
(1) THE LIFE, WITH THE TWO CLOCKS SEPARATED

    write-in            fresh                 settled                     rub-out
    |<-- note 250 -->|<------ 8 beats ------>|<-- dusk 350 -->|          |<- whisper 150 ->|
    [                ][ full pressure       ][ quiet 5.19    ][ ... ]    [ clip 0->100%    ]
                                                                         + opacity 1->0
    kinds that reach 'settled':  record (hint) · state (receipt)
    kinds that never do:         grade (verdict/gold) · reply (refusal — it LEAVES)
    the reply's own clock:       refusalHoldBeats 24 from the LAST refusal (ballot 24-40, U-10)

(2) THE EXIT, AS THE CASCADE SEES IT (arm D)

    t=0      text := ""           .note-leave-from  (rest pose: clip none, opacity 1)
    t=+1f    .note-leave-active   animation: ink-rub-out 150ms accelIn  <- paints
             .note-leave-to       clip inset(0 100% 0 0); opacity 0     <- the REST pose now
             .margin-note-ink.note-leave-active[data-note-age] { transition: none }
                                  ^ (0,4,0) with the scope attr; the age rule is (0,3,0)
    t=150    animation releases   the cascade is already standing where the keyframe ended
    t=151    Vue drops the node   animationTimeout 150 > transitionTimeout 0  ->  type ANIMATION

    the defect it replaces (arm A): at t=150 the animation releases onto clip:none/opacity:1,
    Vue's clock reads 350 off the settle rule, and the full line sits there 25 frames.

(3) THE REPEAT — WHAT THE LIVE REGION HOLDS, AND FOR HOW LONG

    region:  "that's a given clue" ################################|    |###############
    node:    [span present, leaving.................][removed.......]    [span re-enters]
             ^ retract                              ^ -150ms        ^ +one beat (125ms)
                                                    @after-leave     the re-write
             AT-observable empty  =  125 ms   (as built: 13 ms chromium / 8 ms webkit)
```

## 12 · Risks

1. **The specificity cure is a rule about the rules that exist today.** `[data-note-age]` in the
   selector means it only matches an AGED note; a fresh note's leave wins on animation timeout
   alone. That is correct today and silently wrong the day any lane puts a `transition` on
   `.margin-note-ink` (PAL-WALK/ACC-* both touch colour). `.note-leave-to` is the half that does
   not depend on who else writes a rule. **Ship both, and say in the comment which one is the
   belt.**
2. **`@property` with no fallback moves the failure from a no-op to a missing verb.** Under §6.5
   an unpublished rung makes `animation` invalid at computed-value time and the note vanishes with
   no exit. That is the loud failure §6.5 wants, but it is louder than what pass 2 shipped; the
   spec must say so and gate 1 must be the thing that catches it.
3. **Arm B removes the node 200 ms earlier than pass 2's build.** Anything downstream that read
   the leaving node inside that window (a probe, a golden, `elementFromPoint`) changes answer.
   The estate's one reader is `e2e/board-covisibility.spec.ts:125-144`, which PLANTS a bare
   `.margin-note-ink` span and later `.remove()`s it — bare, so it carries no `data-v` attribute
   and MarginNote's scoped rules never matched it in the first place; moving the write-in from
   `.margin-note-ink` to `.note-enter-active` cannot move that row. The readers that do change
   answer are the family's own pass-2 probes.
4. **`mode="out-in"` plus a one-beat hole makes a REPLACEMENT slower than it reads**: rub-out 150
   + write-in 250 = 400 ms for a different sentence, and a repeat is 150 + 125 + 250 = 525 ms. Both
   are declared latencies, not defects, but the owner sees them at the re-look (U-10).
5. **The park's prop is three forwards for a behaviour the owner has not seen.** Charter row 9
   only asks for the argument to be restated; if the owner's re-look kills G9b, the prop and its
   three forwards go with it. Keep the watch and the prop in one hunk so the revert is one hunk.
6. **The `clip-path` rest pose trap**, if anyone proposes making the exit a TRANSITION instead of
   an animation: `clip-path: none → inset(...)` is not interpolable, so the exit would jump. That
   is why the animation stays and only the `-to` pose is added. Do not "simplify" it into a
   transition without giving `.margin-note-ink` a resting `inset(0 0 0 0)` — which would then clip
   the gold star's `overflow: visible` box (`MarginNote.vue:154-161`) and is a π risk of its own.
7. **The lab is a lab.** Arms B/C/D are measured on the estate's Vue with the estate's rules, not
   on the product. The prototype must reproduce the two numbers that matter (gone ≤ whisper + 1
   frame, restored frames 0) on the real surface, both engines, or this research is wrong.

## 13 · Open, for the synthesizer to decide or declare

- Which cure carries the comment as load-bearing: the specificity rule, or the `-to` pose. (My
  recommendation: the `-to` pose is load-bearing, the specificity rule is the honest clock.)
- Whether the repeat helper lives beside `useLiveRegion` (a fourth clause of the idiom) or in
  `GameBoard.vue` beside `announce()`. The former is the estate-shaped answer and touches W3's
  file; the latter is one file and is what §7 costs.
- `refusalHoldBeats` default 24 (U-10 band 24–40) — unchanged from pass 2, still the owner's.
- Whether W8 §8.1's dist freeze has lifted; the owed rows (`filter-census` G3.2's built half,
  goldens 4/4, R3-g, hue-census webkit) need a dist built in THE LANE'S worktree and never on main.

---

### Provenance

MINE: `probe/r3-leave.mjs` → `readings/r3-leave-{chromium,webkit}.json` (Vue 3.5.39 from
`web/frontend/node_modules`, playwright 1.61.1, chromium + webkit, `about:blank`, 1280×800).
THEIRS: every number tagged in place, from `pass2/prototype/NOTE-ERASE/` and
`pass2/critique/NOTE-ERASE/`. Prior art in §7 is background only. No server, no port, no crop,
no product file written.
