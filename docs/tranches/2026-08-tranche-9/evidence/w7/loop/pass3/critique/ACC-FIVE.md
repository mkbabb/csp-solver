# ACC-FIVE — pass-3 ADVERSARIAL CRITIQUE

Family: FIVE CRAYONS AT DIFFERENT PRESSURES. Base `74a2b5d9`. Prototype worktree
`.claude/worktrees/wf_f72f3b5a-83a-41` (read, not written). Critic's server :4242, private
`cacheDir` `.vite-cache-critic`, killed and the cache removed; 4242/4236/4237 read FREE at return.
Evidence 36 KB, no crops of my own.

**CONVERGENCE: 68% — EARNED. VERDICT: ADVANCE**, with three musts named in §6.

The colour half of this family is converged and reproduces to the byte. The motion half — the one
mechanism the family invented this pass — has a gate that FAILS when it is finally run, an
accessibility arm that INVERTS at the win, and a second consumer nobody priced. None of the three
is hard; all three are unclosed, and two of them the prototype could not have found, because every
browser reading it took was taken with the mechanism switched off.

---

## 1. What I did

- Read the whole diff (`git -C <worktree> diff`, 9 modified + 2 new, +624/−96) and both cited crops.
- Re-ran the arm the prototype never ran: served the worktree on :4242 and drove the fill tween at
  `reducedMotion: "no-preference"`, chromium + webkit, with a MutationObserver on the trace's `d`
  and an rAF frame timer — plus `prefers-contrast: more` at rest AND at the win.
  Instrument `critique/ACC-FIVE/instruments/crit-tween.mjs`, readings `readings/crit-tween.json`.
- Benchmarked `poseFronts` against the estate's real `pointsToLinear` on a 493-point ring
  (`scratchpad/bench.mjs`, numbers in §3.4).
- Ran `check-ink-pressure.mjs`, `check-theme-tokens.mjs` and `check-copy-register.mjs` BARE, and
  the G11 hex census myself.
- Computed every contrast pair in this file from the resolved tokens myself; the painted pairs are
  the prototype's, and I re-derived the arithmetic on each.

## 2. What holds (and it is a lot)

**The sentence is measured, not asserted.** Eight predicted painted figures land exactly, both
engines, both themes: #A87E13 at 3.505 line / 3.646 paper light, #79650F at 3.303 / 3.280 dark,
#C99A2E at 5.046 / 2.533 and #E5C74D at 1.037 / 11.234 at the win, hue distance from crayon-gold
0.0° in every cell. HEAD's violet reads **2.876** on the same instrument in light — a live WCAG
1.4.11 failure at the wave's base, measured rather than argued.

**The dash→geometry cure is the right diagnosis and it is falsifiable.** WebKit restarts a
polyline's dash phase every ~128 segments; the ring is ~493; decimation walks the defect back and a
straight 599-segment rectangle breaks identically. That kills a class rather than tuning a number,
and the four declaration arms are the control that makes it a finding instead of a guess.

**The chair was obeyed against the lane's own pass-2 diff.** Law 25's amendment reverted verbatim,
`pencilConfig.ts` reverted whole because `traceWinMs` was a second ladder, the two motion values
v-bound as HEAD literals naming the rung they consume. A lane that deletes its own previous work on
a ruling is a lane worth reading.

**The gate tests its own control.** Blunting `KIN_DEG` to 90 makes `--self-test` report
`kin-6deg did not fail on a known-bad input — it is vacuous` and exit 1. That is the strongest
single piece of gate craft in the pass and it should be law wave-wide (§7).

**Three wrong instrument cuts are banked beside the cured one** — the achromatic-extreme ground, the
unsolvable board whose "win" was the failure verdict's red, the sampling window that read the line's
own colour. The correction is auditable rather than believed.

**Verified by me, not taken on trust.** G11: `#2563eb`/`#60a5fa`/`#8b5cf6` 0 occurrences,
`rgba(196, 181, 253` 0, `#7c3aed` exactly once. `check-copy-register` BARE exit 0 — which closes the
prototype's own gap 17, M16 is clean. `check-ink-pressure` bare exit 0, `check-theme-tokens` bare
exit 0. The P1-W3 zero-subscriber property survives the tween: `traceNodes` 0 at progress 0 in all
four cells.

**The frame COST claim holds** — the half of the tween the prototype worried about is the half that
is fine. Measured by me at no-preference, one write, same page: chromium control median 8.4 ms / p95
10.3, write median 8.3 / p95 10.3. WebKit control 16 / 19, write 17 / 19. The re-cut is +1 ms of
median frame time at worst, well inside the +5 ms the gate allows.

**The dark crop earns its disposition.** At 1.037:1 the wax and the warm-grey line are the same
luminance, and in `lift-dark-chromium.png` pane 4 the frame plainly turns gold anyway — hue is
carrying the state change. The crop is the right thing to put in front of the owner at U-10.

## 3. What is NOT converged

### 3.1 G10 fails as written, and the gate's number is a 60 Hz assumption

Run at `no-preference`, one digit, one write:

| engine | `d` mutations | poses | re-cut FRAMES | tween span | frame median |
|---|---|---|---|---|---|
| chromium | **116** | 4 | **29** | 233.7 ms | 8.3 ms (120 Hz panel) |
| webkit | 60 | 4 | **15** | 234.0 ms | 17 ms (60 Hz) |

The spec, the plan, the prototype brief and gate G10 all say **≤15 `d` re-cuts per write**. That is
240 ms at 60 Hz. On this box chromium runs the page at 120 Hz and the same write costs **29**. The
budget is not a property of the design, it is a property of the reviewer's display — and the estate's
own owner runs a 120 Hz Mac and a 120 Hz phone. A gate whose number changes with the panel is a gate
that will red in CI on one runner and pass on another.

Closable two ways, and the family should say which: price the budget per SECOND (≤64 re-cuts/s
regardless of rate) and restate G10, or coalesce the fraction writes to one `d` re-cut per rAF with
a leading-edge guard and keep 15 as a per-write ceiling at any rate.

### 3.2 Every browser reading in the prototype's evidence was taken with the mechanism OFF

`grep -n reducedMotion` over the five pass-3 instruments: `p3-win.mjs:115`, `p3-paint.mjs:131`,
`p3-final.mjs:118`, `p3-crops.mjs:21`, `p3-g0-segments.mjs:203` — all `"reduce"`. HandDrawnGrid's
watcher returns early under PRM, and the stroke transition lives inside
`@media (prefers-reduced-motion: no-preference)`. So the fill tween and the win's 500 ms lift had
**zero browser execution** in the prototype's own evidence, and both cited crops are PRM end states.

The prototype's gap 1 says "I never timed it". The true statement is stronger: it was never RUN. I
ran it and it works — the front draws, 88→363 characters of `d` across 74 distinct values in
chromium, the span lands at 234 ms against a 240 ms constant, and the PRM arm reads 0 re-cuts with
the front landing in-frame in both engines. That is the family's luck, not its evidence. Close it by
re-running p3-win and p3-paint at no-preference and banking the numbers as the prototype's own.

### 3.3 The `prefers-contrast: more` arm INVERTS at the win — a confirmed 1.4.11 regression

The spec books the hedge in its own sentence: *"post-win hedge booked: hold the post-win stroke at
the ink tier under prefers-contrast:more"*. The diff does not implement it, and the cascade goes the
other way. Both rules live in `@layer utilities` (index.css:576): the contrast arm is
`.progress-trace` (0,1,0), unimportant, at :649-666; the win is `.solve-success .progress-trace`
(0,2,0) with `!important` at :690. The win wins.

Measured, both engines, in the two cells where the solve actually fired:

| state, light, `contrast: more` | computed stroke | width | ground by the arm's own argument | ratio |
|---|---|---|---|---|
| before the win | `rgb(140,105,29)` = `--color-gold-ink` | 12 px | paper only | **4.967** |
| at the win | `rgb(201,154,46)` = `--color-gold-star` | 12 px | paper only | **2.533** |

At 12 units the trace covers the line outright — that is the arm's whole justification for taking
the text tier — so at the win the reader who asked for MORE contrast is left with the wax on paper
at 2.533:1, under the 3:1 non-text floor, DOWN from 4.967 a moment earlier. The default arm keeps a
5.046 line ground at the win and can argue the 2.533; this arm deletes that ground on purpose and
cannot. One rule closes it:
`@media (prefers-contrast: more) { .solve-success .progress-trace { stroke: var(--color-gold-ink) !important } }`,
plus the row in G4.

### 3.4 `poseFronts` re-parses invariant geometry every frame, and it is half the call

Benchmarked against the estate's real `pointsToLinear`, 4 poses × 493 points, warm V8:

```
poseFronts(4 poses, f sweeping)   0.427 ms/call
  of which poseLengths             0.204 ms  (48%)
  of which posePoints ×4           0.198 ms
~15 frames per 240 ms write     →  6.4 ms of main-thread JS per fill event (60 Hz)
                                → 12.4 ms at 120 Hz's 29 frames
```

`posePoints` runs TWICE per pose per call (once inside `poseLengths`, once in the map) over an
18.7 KB path string, and the points and lengths are constant for the whole tween. Memoizing
points+lengths per `frames` array (a `WeakMap`, or a computed seated above the fraction) halves the
call for nothing. JSC will be slower than V8 here and WebKit is the engine already at 17 ms frames.

### 3.5 The join ring inherited the per-frame re-cut with no budget row at all

`joinFront = poseFronts(joinTraceFrames.value, joinProgress.value)` is a computed on `joinProgress`,
and `useJoinWash` drives that from `createSequenceSubscription`'s `onProgress` over **740–1180 ms**
(`useJoinWash.ts:106/116/125`). That is ~140 frames at 120 Hz — roughly **560 `d` writes and ~60 ms
of JS per join**, against the fill gauge's declared 15 re-cuts. It replaced a `strokeDashoffset`
style write, which cost no path re-parse and no re-serialize, so the cost genuinely went UP. Nothing
in the spec, the plan, the prototype brief or G10 prices it; G10 counts "per write" on the fill gauge
only. Measure the join wash at no-preference and state its budget, or memoize per §3.4 and show the
number.

### 3.6 G2 has no running enforcement today — one arm can't fail, the other has never run

- **Node arm**: the prototype reports it honestly — run against `74a2b5d9`'s tokens,
  `check-ink-pressure` reds on the four KIN rows and the CORRIDOR row stays **GREEN**, because token
  arithmetic gives HEAD's violet 3.57 light where the paint is 2.876. The corridor row cannot fail on
  the exact condition the family exists to cure. It is a drift guard; the return should say so in
  those words and G2 should stop citing it as an arm of the gate.
- **Browser arm**: `e2e/progress-corridor.spec.ts` was written and never executed — and as code it
  cannot report the failure it is for. `modalCore` pre-filters pixels to a **45° window around the
  gold anchor**; on HEAD's violet (150° off) no column yields a candidate, `per` is empty, and
  `ranked[0][0]` dereferences `undefined`. The born-RED outcome is a TypeError, not a corridor
  reading. The closing `expect(hueGap(...)).toBeLessThanOrEqual(5)` is also near-circular on a sample
  a 45° window already selected. Close by running it in both engines and by making "no gauge pixel in
  the band" a named failure that prints the grounds and the ratios it did find.

### 3.7 `poseFronts` ships an unstated precondition into a cross-family hand-off

It parses every number pair in the `d` as ONE polyline and re-serializes with a single
`pointsToLinear`. A multi-subpath pose — the un-grained `generateFrameTraceFrames` branch
(`gridPaths.ts:288-290`), `generateGridBoilFrames`' four-subpath frame — would have the jumps between
subpaths counted as drawn length and would come back as one connected path. Today both callers pass a
single grained ring, so nothing is broken; the function is nonetheless EXPORTED as §1's hand-off to
ACC-SIX and the §10 tally with no guard, no doc line, and no test. One `if` and one sentence.

### 3.8 "ONE GRAMMAR FOR A DRAWN FRONT, estate-wide" is false as written

`DifficultyTally.vue`'s new comment says it. The estate still draws fronts with `pathLength` + dash in
`DigitCell.vue` (×3), `ScribbleLoader.vue`, `AnswerKeyLaminate.vue` and `HandwrittenGlyph.vue`. Before
this diff there was one grammar; after it there are two. The cure is right and the scope claim is not.
Close by naming each survivor's segment count against the ~128 WebKit boundary the family measured —
then the cure's edge is a measured line rather than the two files that happened to be in this diff.

### 3.9 The light lift is 0.0044 over its floor, and the crop shows it

ΔL band-median fill→win is +0.0944 light against a ≥0.09 gate (dark +0.3217). In
`lift-light-chromium.png`, pane 3 → pane 4 is a small brightening of the same line; the dark strip's
same transition is unmistakable. The family's sentence is "one pressure harder on the same rect", and
in LIGHT that is the weakest claim it makes. It needs the owner's eye against a control at U-10, not
a 0.0044 margin reported as a pass.

### 3.10 Carried unrun, from the prototype's own list

G0's five-arm segment sweep · G5 the verb · G7 the glow, filterBudget 9, the 45,572/6,673 dist union
(**no dist was built**) · G9 the per-anchor census · π entirely (no rect census, no R6 heading census,
no R3 wobble, no golden deltas — the ~2,292 px cell-light figure is an `a8fee1f5` reading and must not
travel as a pass-3 number) · the phone at 393×699 dpr3, which matters precisely because the 12 u
`prefers-contrast` arm is specified FROM the phone's 0.73 px flank · G4's three arms in a browser (I
verified `prefers-contrast` and found §3.3; print and forced-colors remain unverified) · F1's two arms
· two crops of four · no r0 instrument proposed as a diff, so no r0 row is reported MOVED.

## 4. Constraints, checked

| constraint | reading |
|---|---|
| AA / 1.4.11 both themes | gauge 3.505/3.646 light, 3.303/3.280 dark — CLEAR. Win light 5.046 line / 2.533 paper and dark 1.037 line / 11.234 paper — DECIDED, and the dark crop earns the decision. **`prefers-contrast: more` at the win 2.533 with paper the only ground — FAILS (§3.3).** |
| filterBudget 9 | NOT MEASURED — no dist was built. The diff mints no `filter=`; the census row is absent. |
| M16 plain copy | `check-copy-register` BARE exit 0, verified by me. No new string; `aria-valuetext` untouched. |
| π on unclaimed surfaces | NOT RUN. Structurally, `poseFronts` returns its input unchanged at f ≥ 1 so the tally at rest and the gauge at 100% are byte-identical geometry, and the trace has no DOM node at progress 0 — but no census was taken. |
| decided history (r0/R6) | Law 25 STANDS and the pass-2 amendment is reverted verbatim; the earned condition is re-stated beside the token and the ask travels to the chair. Law 39 / law 20 are not this family's rows. |
| W2's landed mechanics | untouched — no sticky tag, dock, bottom tab or tap-floor token appears anywhere in the diff. |
| the record is frozen | nothing written under `r0/`, `pass1/`, `pass2/`; `oklch.COPY.mjs` copied and re-pointed. Clean. |
| ports / servers | prototype's 4236/4237 free at my read; my 4242 killed and free. |

## 5. Failure-mode checklist — the hits

- **gates that cannot fail** — G2's node arm stays green on HEAD's violet (§3.6); the e2e arm's 45°
  pre-filter makes its closing hue assertion near-circular.
- **unverified gestalt** — the tween and the win transition were never executed in a browser in the
  prototype's evidence (§3.2); the light lift clears by 0.0044 and its own crop reads faint (§3.9).
- **the constraint it forgot** — `prefers-contrast: more` inverts at the win to 2.533 (§3.3). The spec
  booked this hedge and the diff dropped it.
- **the elegant-reduction trap** — "the front is geometry" is the elegant half; "and then it has to
  not step" is the hard half, and its budget FAILS at 120 Hz (§3.1) with a second consumer nobody
  priced (§3.5).
- **legacy alias / the second spelling** — two grammars for a drawn front where there was one, under a
  comment that says "estate-wide" (§3.8).
- **the pixel it moves that it did not declare** — π unrun; the join ring's per-frame cost undeclared.
- **consumer-less substrate** — AVERTED and worth saying: `poseLengths` was un-exported rather than
  left as a decoy. The §1 hand-off now travels through `poseFronts`, which is a fair trade.
- NOT HIT: vacuous convergence · spec-cites-itself on the colour thesis (every headline number is a
  painted byte with a born-RED control) · masked fallbacks (the glyph fallback hex DIES, with a
  born-RED unit row) · the generic default (nothing here is cream-and-terracotta; the palette is the
  estate's own crayons at declared pressures).

## 6. Verdict — ADVANCE, with three musts

Not BLOCK: nothing missing here is as hard as the problem. Not RETIRE: no rewording, and the one
constraint violation is a single CSS rule. Not BANK: this family is §3's centre and its open items
close in one slice.

**MUST 1 — the contrast arm.** Add the win's hedge under `prefers-contrast: more` and give G4 the row.
This is an accessibility regression against a reader who explicitly asked for the opposite, confirmed
in both engines.

**MUST 2 — the motion budget, re-priced and re-run.** State G10 per second (or coalesce to one re-cut
per rAF), measure the JOIN wash under the same budget, memoize `poseLengths`, and re-take p3-win and
p3-paint at `no-preference` so the family's own evidence contains the mechanism it invented.

**MUST 3 — run the gates that were written.** `e2e/progress-corridor.spec.ts` both engines, with the
no-gauge-pixel case turned into a named failure; G0's segment sweep; a dist for G7/filterBudget; and π
against the `74a2b5d9` control. Then the node corridor row is re-labelled a drift guard in the return.

Everything else in §3 is a sentence each and should be closed in the same slice.

## 7. Cross-pollination

1. **The self-test that declares itself vacuous.** Blunt the threshold and the gate must report
   `did not fail on a known-bad input — it is vacuous` and exit 1. Every family's negative control in
   this wave should carry it; it is the cheapest cure for "gates that cannot fail" we have seen.
2. **Read the GROUND where the subject provably has no DOM node** (here: progress 0, zero
   `.progress-trace` nodes). It kills the "was the sample clean?" argument outright — PAL-TIN,
   ACC-GRAPHITE and MRK-LIVE all need it.
3. **The LAYERED ablation**: re-state a dead rule inside an EARLIER `@layer` to beat an `!important` in
   `utilities`. The general way to ablate any layered rule in this estate.
4. **Fill through the product's own Hint** so the board stays solvable — mandatory for any probe that
   needs a real win, and the cure for the failure-verdict-red-mistaken-for-a-gauge trap.
5. **Corridor-as-interval**: an accent that sits on a line over paper has TWO grounds that swap between
   themes, so the assertion is an interval, not a number, and the gate asserts the interval, never the
   hex. Every accent family in §3 wants this shape.
6. **The 120 Hz lesson, wave-wide**: any budget of the form "≤N frames/re-cuts per event" is
   display-rate dependent. Every such row in this wave should be re-read as a rate.
7. **WebKit restarts a polyline's dash phase every ~128 segments.** That is a wave-level trap, not a
   family's finding: it belongs in the traps ledger, with the four surfaces that still draw with a dash
   (§3.8) checked against it.
