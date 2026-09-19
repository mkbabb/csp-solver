# NOTE-ERASE — pass-2 adversarial critique

Critic did not write the spec or the prototype. Everything below that carries a number was
re-measured by this lane on its own servers (the build at 127.0.0.1:4242, HEAD at :4243, both
with private cacheDirs, both killed before this file was written) with its own probe
(`critique/NOTE-ERASE/probe/verify.probe.ts`, `settled.probe.ts`, `pi.probe.ts`; run from a
scratchpad mirror with a `node_modules` symlink, readings banked to `critique/NOTE-ERASE/logs/`).
r0 and pass 1 were read only; nothing under them was touched (`find -newermt` on both dirs
returns nothing from this session). No crops taken — the two findings that matter are numbers.

**CONVERGENCE: 70%. VERDICT: ADVANCE**, with gap 1 as a must-fix before pass 3: the family's own
verb is broken, on both engines, in the state the note spends most of its life in.

---

## 1. What I confirmed for myself

| claim | my reading | agrees |
|---|---|---|
| the exit is `ink-rub-out, ink-rub-out-fade` on the whisper rung, `--ease-accelIn` | `0.15s, 0.15s`, `cubic-bezier(0.55,0.055,0.675,0.19)` — chromium and webkit | yes |
| the repeat is a trajectory `[X, "", X]`, rub-out starting once | `["that's a given clue","","that's a given clue"]`, `rubOutStarts 1`, `writeIns 2` — both engines | yes |
| painted AA, light | fresh `rgb(38,38,38)` = **14.52:1**, settled `color(srgb .15 .15 .15/.68)` = **5.18:1**, teacher-red **4.87:1**, all on `rgb(251,250,249)` — both engines | yes |
| the settle lands at eight beats | `data-note-age=settled` ~1003 ms after the arm, `transition-duration 0.35s` | yes |
| `lint:ink` gateNote | `settled note 5.19 light / 6.12 dark ≥4.5 … 17 rung reads in src/`, exit 0 | yes |
| π on unclaimed surfaces | at 1280, **build vs HEAD byte-identical both engines**: grid 636×636 @131.89,124.45 · controls 324.22×608 · `scrollHeight` 800 · `.margin-note-block` 20.8→23.61 with a note in it **on HEAD too** | yes |
| the seam typechecks | `vue-tsc -b --force` exit 0 on the worktree | yes |
| the new unit rows | `vitest run` on the two files: 2 files / **11 tests** green | yes |
| M16, motion contract, live regions, theme tokens/selectors, sleep | `lint:copy`, `lint:motion`, `lint:live-regions`, `lint:theme-tokens`, `lint:theme-selectors`, `lint:sleep` all exit 0 on the build | yes |
| filterBudget 9 | their `readings/budget-*.json`: `liveFilterTotal 9` at 4×4/9×9/16×16, rows unchanged (not re-cut here) | accepted |

The build is real, it runs, and the arithmetic is honest. What follows is what it does not say.

---

## 2. THE FINDING — the settled note's exit is not the whisper rung, and it flickers

`.note-leave-active { transition: none }` is declared LOAD-BEARING in both the spec and the
component's own comment: Vue reads the leaving element's computed durations to decide when to
drop the node, so the dusk colour transition must not be allowed to hold a rubbed-out line on
the page. **It is never applied to a settled note.** `.margin-note-ink[data-note-age="settled"]`
is (0,2,0); `.note-leave-active` is (0,1,0). The age rule wins.

Measured (`logs/settled-exit-{chromium,webkit}.json` — arm a hint, wait past the eight-beat
settle, retract it, sample every frame):

```
before the leave      age=settled   transition-duration 0.35s   transition-property color
the verb              ink-rub-out + fade, 0.15s, accelIn — ends at ~150 ms, NO fill
after the verb        chromium 24 frames, webkit 13 frames, every one of them
                      clip-path: none  and  opacity > 0.95   — the ink is BACK AT FULL
the plateau           chromium t = 170.9 → 362.2 ms · webkit 169 → 368 ms
the node is dropped   chromium 371 ms · webkit 386 ms   (not 197 / 214)
```

So a settled record rubs out over 150 ms, **snaps back to a full line, sits there for ~200 ms,
and then vanishes on a frame.** That is R4's M2 — the arrival with no departure, the note that
disappears mid-sentence — reinstated for every `record` and `state` line older than eight beats,
plus a flicker the estate did not have before. The family exists to cure exactly this.

**Gate 1 cannot see it.** Their `a1-exit` probe arms and retracts inside the settle window: the
clip train runs `47.5 → 187.7 ms` with no plateau and reports `absentAtMs 196.7 / 207.1`. Green
on the state the note is in for one second; blind to the state it is in for the rest of its life.

The cure is one selector (`.margin-note-ink.note-leave-active[data-note-age]`, or the settle's
colour moved off the attribute rule) plus a second gate row that retracts AFTER the settle and
asserts no post-verb frame reads `clip-path: none`. It is not a missing primitive — hence
ADVANCE, not BLOCK.

---

## 3. The other open gaps

2. **The gate is scoped so it cannot fail (gate 1).** Above.
3. **A timing constant landed outside `pencilConfig` — R6 law 4.** `MOTION.rungs.whisper + 17` at
   `GameBoard.vue:672`. The diff's own gate 13 greps `MarginNote.vue` only, so the one new
   literal in the diff sits outside the gate's scope. The frame belongs in `pencilConfig` (a
   cadence), or the deferral is expressed in beats.
4. **Gate 7's live half is now vacuous by the family's own hand.** `publishMotionRungs()` emits
   the reduced-motion arm, so under PRM I read **every** rung at `0ms`
   (`note/whisper/dusk/leave/step/throw`, both engines, `logs/prm-*.json`) and the leave computes
   to zero whether or not `index.css:1157` still names `.margin-note-ink`. The prototype declares
   this; it needs the static half (the PRM block still names the element) in the same diff.
5. **Three published rungs have no consumer.** `--motion-leave` 200, `--motion-step` 440,
   `--motion-throw` 520 are emitted to `:root` and zeroed under PRM; `grep -o 'var(--motion-[a-z]*'`
   over `src/` returns note ×2, whisper ×2, dusk ×1 — all five in `MarginNote.vue`. A token
   nothing reads is the checklist's consumer-less substrate, and it is §13's to land with its
   consumers.
6. **The repeat cure re-mints an idiom ten lines away.** `announce()` (T9-W3 §3.5, the same file,
   `GameBoard.vue`) already cures the identical repeat silence by emptying and re-writing on
   `nextTick` — the live-region law's third clause. The spec never mentions it. Say why the
   margin's hole must be `whisper + 17` and `announce`'s a tick, or make them one helper.
7. **The hole is 5–13 ms and nothing has heard it.** My run: 5 ms chromium, 10 ms webkit (theirs:
   13 / 8). SC 2.2.1's defence ("pressing the key again re-says it") and SC 4.1.3's service both
   rest on an AT announcing a second identical utterance across that empty. The family names this
   as the device row; the number makes it the load-bearing one.
8. **The seam is half-landed against its own spec.** The spec requires the predicate on BOTH
   primitives; `applyHintInk` implements only the peer arm (`useGameState.ts:577`). Your own
   revealed digit therefore leaves `lastRefusal` standing, against the spec's retraction table
   ("reply ← your ink that lands"). One line, or strike the clause — either way a unit row.
9. **§2.3 is refuted by the prototype's own measurement and the spec is not restated.** The
   parked line is clipped away (2.6 px below `div.live-face-slot { overflow: hidden }`,
   `elementFromPoint` returns the card), so "no DOM predicate can tell you" is false and the
   `parked` prop is threaded through four components — App → GameShell → BoardHost → GameBoard,
   one more forward than the plan named — on an argument the family has withdrawn. Restate the
   park as "a reply outlives the act it answered" and say why the prop still beats the rect test.
10. **Gate 13 is unsatisfiable as worded** (`grep -c '250ms' = 0` versus the byte-equal fallback
    law). Reported honestly, not re-worded in the lane; the chair re-words it.
11. **The gold verdict has no painted witness.** 4.85 light / 11.48 dark are token arithmetic; no
    solve completed in either run and the strip goes `is-quiet` at solve. It needs the vignette's
    own node.
12. **The refusal-vs-peer row is chromium-only live** (webkit's probe outran the 24-beat hold).
13. **R3-g was not re-run; hue-census is chromium-only; `filter-census` G3.2's source half is
    argued from the diff, its built-dist half and the goldens are OWED at WGATE's rebuild.**
14. **MOT-LADDER collision.** `MOTION.rungs` + `publishMotionRungs()` are §13's, landed here
    because §13 has not landed. The agglomerator takes ONE publisher, not two.
15. **R6 law 6's letter.** Every verb in the vocabulary fills `backwards`; the rub-out declares no
    fill mode at all. Harmless (the node is removed) but undeclared — take `backwards` or cite it.

---

## 4. Checklist

- **gates that cannot fail** — gate 1 (blind to the settled state, which is the failing state),
  gate 7's live half (self-defeated by the ladder's PRM arm); gate 13 fails the other way.
- **consumer-less substrate** — three published rungs, zero reads.
- **the constraint it forgot** — R6 law 4 (`+ 17` in `GameBoard.vue`), R6 law 6's `backwards`.
- **legacy aliases / the old thing under a new name** — the repeat cure beside `announce()`.
- **unverified gestalt** — the settled exit was computed from a clip train and never watched;
  the ~200 ms full-ink plateau is what nobody looked at.
- **and then the hard part** — whether an AT speaks the 5–13 ms hole (the family says so itself).
- **clear**: vacuous convergence · spec-cites-itself · elegant reduction · masked fallbacks (the
  byte-equal `var(--motion-*, 250ms)` fallback is a declared no-op, not a mask) · the generic
  default · **π** (verified byte-identical to HEAD, both engines, note present and absent) · AA ·
  filterBudget 9 · M16 · W2's landed mechanics (untouched: no new mechanic, no box moved).

## 5. Strengths

- Every claim is measured on the real surface, both engines, and the two that cannot be measured
  there (the derivation of the hold, R6 law 4) are unit rows at the place they are decided.
- Born-RED is proven, not asserted: stripping one `origin` gives `TS2554` at
  `useGameState.ts:535`; both new `check-ink-pressure` self-test cases fail on known-bad input.
- The `:key` finding is the pass's best piece of mechanism — with the runtime-core cite AND the
  honest second half, that the key is necessary and not sufficient under `mode="out-in"`.
- The kind-not-tone kill: two `…NoteLive` booleans and a colour proxy collapse into one
  `marginKind`, and the idle stale-clear stops keying on "any non-graphite tone".
- The gate ships with the mechanism (`gateNote` + a derived discovery census, both self-tested,
  printed on every run) rather than after it.
- Three objections carried in the return rather than buried in the diff — including one that
  refutes the spec's own argument. That is the discipline this pass asked for.

## 6. Cross-pollination

- `publishMotionRungs()` with byte-equal CSS fallbacks — the cleanest TS→CSS duration seam in the
  portfolio. Hand the SHAPE to MOT-LADDER (§13), with the PRM arm as a value of the ladder.
- The painted-byte reader's cross-check against `getComputedStyle().color` (per-channel delta,
  floor 12) belongs in every colour family's probe: it is what caught pass 1's gold 12.46.
- "Behaviour keys on what a thing IS, never on the colour it wears" generalizes to every family
  still reading a tone or variant class as a proxy for a state.
- **A warning for the whole pass**: a Vue `<Transition>` leave class is (0,1,0) and loses to any
  state-attribute rule on the same element. Any family adding a leave over an attribute state
  inherits gap 1. Worth a chair's note.
- The "origin required, the default dies, `TS2554` is the gate" seam is the template for any W1
  primitive that must not be defaulted.
