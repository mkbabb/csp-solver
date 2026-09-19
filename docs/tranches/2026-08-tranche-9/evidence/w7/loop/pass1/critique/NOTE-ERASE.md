# NOTE-ERASE · THE ERASER — pass-1 ADVERSARIAL CRITIQUE

Non-author. Read the spec (`../synthesize/NOTE-ERASE.md`), the prototype's diff in its worktree,
its README, its readings and its four frames; then re-measured on my own server against the
prototype's own tree — `npx vite --host 127.0.0.1 --port 4241 --strictPort` on
`.claude/worktrees/wf_e58b4764-0fc-53`, scratch playwright config (baseURL only), chromium and
webkit, 1280×800, light and dark. Read-only on every product file.

**Convergence earned: 71%. Verdict: ADVANCE.**

---

## 1 · What I re-measured myself, and what reproduced

| my probe | reading | agrees with the prototype? |
|---|---|---|
| C2 settle, painted bytes, my own reader | fresh **14.52 light / 12.25 dark**; settled **5.17 light / 6.07 dark** chromium, **5.17 / 6.13** webkit; `data-note-age="settled"` present | yes, to the hundredth, both engines |
| AA re-derived from the tokens, no browser | `--color-pencil-graphite` 68% over `--color-background`: painted `#6a6a6a` **5.19:1** light, `#94928c` **6.14:1** dark; red at 68% **3.03:1**, gold **2.70:1** | yes — the verdict tones genuinely cannot settle |
| C1 the exit on an ordinary replacement (refusal → hint) | `animationstart` = `ink-rub-out` + `ink-rub-out-fade` then `ink-write-in`, **both engines**; frames carry `note-leave-from`/`note-leave-active`/`note-leave-to` at t 158/175, the new line at 284 | yes — the exit is real and it runs |
| C1 the live region's empty window | **0 frames** with an empty region, both engines; the leaving span keeps its text through the verb and the new one mounts in the same frame | new — my own hypothesis, REFUTED. Out-in opens no announcement hole |
| C3 live filter population | 25 elements carry a filter; minus 8 `baked-hidden` celestial rest poses, 4 `logo-pose-parked`, 4 `boil-frame-layer baked-hidden` = **9 live** (2 heart, 2 toggle, 4 divider, 1 sparkle). Nothing on or above the note | yes — law 9 holds, π holds |
| C3 the refusal clock | ink present at 20 / 23 / **24.5** beats, gone at **25.5** / 27 / 30, both engines | yes — and it confirms G5's wording is short by the rub-out beat |
| the authorship suite, run | `useGameState.authorship.test.ts` **6/6 pass** | yes |
| `check-copy-register.mjs` | 137 files, 0 dashes, 2 admitted, **0 unadmitted** | yes — M16 clean, no string minted |
| `check-motion-contract.mjs` | 34 specs, 34 declaring, 0 silent | yes |
| C4 the repeat, re-traced | see §3.1 — **the spec's mechanism is false and G6 measures nothing** | no |
| C5 the refusal across a park | see §3.2 — **G9 is false for a refusal** | no (new) |

The numbers hold. The prototype did not flatter itself on any figure I could check.

## 2 · Strengths, stated so the agglomerator can take them

1. **The exit is real, it runs on both engines, and it costs nothing.** A Vue leave removed at the
   computed duration means no `fill: forwards`, no `FILL_ALLOWLIST` row, and law 6 whole — where
   MOT-VERB's own RUB OUT tuple has to buy an admission. This is the cheapest correct answer on the
   board and the reasoning behind it (PRM deletes the animation, so `animationend` can never be the
   seam) is exactly right.
2. **`.note-leave-active { transition: none }` is load-bearing and nobody else has found it.** A
   settled note carries a 500ms colour transition; Vue reads the element's computed durations, so
   without that line the rubbed-out ink hangs for four beats and then snaps back to full pressure.
3. **AA is not asserted, it is derivable.** I re-derived it from the token arithmetic alone and got
   the same numbers. The gating of the age timer on `tone === "graphite"` is the right shape: the
   verdict tones fail the quiet rung by construction and the code says so.
4. **The seam is the load-bearing half and it is unit-proven**, not cited: 6/6 green, and the rows
   are written against the wire's own entry point rather than against the private function.
5. **π holds everywhere I looked**: 9 live filters, nothing filtered or transformed anywhere near
   the note, no chromatic token, no string, no layout box.
6. **The gap list is the most honest in the pass.** It books a probe defect, a superseded probe run
   whose logs were deliberately not banked, and a lane hazard it caused itself. That is the posture
   the loop wants; the gaps below are in addition to those, not a restatement of them.

## 3 · What is NOT converged

### 3.1 G6 measures nothing, and the repeat is the exact defect the family exists to kill

Re-traced on both engines (rAF train, `animationstart` capture, MutationObserver on the block):

```
C4 chromium  starts=[{"t":251,"n":"ink-write-in"}]                       muts=10  frames=181
  t=1    margin-note-ink                               "that's a given clue"  anim none
  t=242  margin-note-ink note-enter-from note-enter-active  "that's a given clue"  ink-write-in
  t=259  margin-note-ink note-enter-active note-enter-to    "that's a given clue"  ink-write-in
  t=493  margin-note-ink                                    "that's a given clue"  anim none
C4 webkit    starts=[{"t":238,"n":"ink-write-in"}]                       muts=10  frames=92
```

Three facts. **(a)** No leave class appears in any frame and `ink-rub-out` never starts — the spec's
§4 claim that "with `mode='out-in'` that is a rub-out and a fresh write-in" is false on both
engines. My C1 train catches leave classes readily with the same sampler on a normal replacement,
so the instrument is not blind; the leave genuinely does not run. **(b)** The old line is therefore
replaced by a **cut** — which is R4's M2 row, the very class this family was written to retire,
re-introduced in the one case the cure was written for. **(c)** The region's `textContent` is
`"that's a given clue"` at *every* sampled frame. Nothing in the DOM's text ever changes. G6 counts
MutationObserver records, and a childList swap produces records whether or not the accessible name
of the region moves or any AT says a word. **G6 is a gate that cannot fail**, and the claim it is
supposed to carry — "the same refusal can be said again" — is unproven and plausibly false on NVDA
and VoiceOver, which suppress a re-announcement of an identical atomic region.

The prototype books this as gap 2 but attributes it to "Vue re-uses the element". Its own timeline
contradicts that: `note-enter-from` only ever lands on an *entering* element. The mechanism is that
the empty render and the re-write resolve inside one frame and the leave is cancelled before style
resolution — which is why keying on a write sequence (the prototype's own proposed cure) is the
right fix and why it cannot be deferred: without it the family ships its own counter-example.

### 3.2 The refusal's clock does not stop for the board, and G9 is false for it

Measured, both engines: refuse a given, press `g` to park the layout, and the board stays in the DOM
(`boardStillInDom: true`) with the sentence still on the strip at 3.0s — then the hold fires behind
the park and the strip reads `""` at 3.6s. `onUnmounted` never runs because the park is
`display: none`, not an unmount. So a refusal can leave while the reader is looking at the gallery,
and G9's assertion ("`g` then cancel = the same sentence at the same box") holds for the hint note it
was measured with and is **false for a refusal older than 24 beats**. G9 was written as a
no-mechanism assertion and the family then gave it a mechanism without re-writing it.

### 3.3 The seam's default is the masked fallback

`origin: WriteOrigin = "self"` on both primitives. The whole cure rests on one call site passing
`"peer"`; a future wire path, a replay, or a second session source that forgets restores the
peer-anywhere wipe with **no type error and no gate**. A defaulted parameter whose default is the
loud behaviour is the shape the checklist names. Make it required on both primitives (or type
`sessionSource.applyValue` to demand it) and the compiler names every call site instead.

### 3.4 The AA claim has no standing instrument

`npm run lint:ink` prices a **fixed six-surface census** (the T5 ship-4 list) and its quiet figures
(5.23 / 6.06) are resolved on `--color-card`. The settled note is a **seventh** consumer of
`--ink-press-quiet`, painted on `--color-background` (5.19 / 6.14 by my own arithmetic), and the gate
gained no row — I ran it and the census still prints six. Law 24's enforcing script is blind to the
one surface this family adds, so the AA claim rests on this lane's probe alone. This is the class
R6 §4 already names: a census that reports clean over a surface outside its corpus.

### 3.5 The number is unconverged and the gestalt is unverified

The house's only other erase verb is `AnswerKeyLaminate`'s lift-away — **200ms on the same
`--ease-accelIn`** — and MOT-VERB's RUB OUT rung is also 200ms. This spec picks 125ms from internal
symmetry ("half the arrival") and defers the reconciliation to the agglomerator. That deferral is
what the checklist calls "and then the hard part".

It matters visually. On `cubic-bezier(0.55, 0.055, 0.675, 0.19)` the banked t=62ms frame is clipped
**14.2%** — at the *midpoint* of the verb the line is 86% intact. The remaining 86% of travel lands
in the last ~50ms, roughly three frames at 60Hz, which is also the honest reading of webkit's eight
distinct clip states. I looked at all four frames: `rubout-62ms-390-chromium.png` shows a line that
reads as whole, and the README concedes both verb frames are `animation-play-state: paused`
constructions, not wall-clock captures. **There is no frame, on either engine, of the line actually
half-erased.** The one memorable thing in the family is the one thing not shown.

### 3.6 Smaller, each closable in a line

- **The gold-dark figure moved and nobody reconciled it.** Spec table 11.48, the token's own comment
  "11.48:1 on dark paper", prototype "painted 12.46 dark". One of the three is wrong.
- **`.margin-note-meta` keeps its own `250ms` literal** (and MarginNote's header comment at :13 still
  says the note writes in at 250ms). R6 law 4 is still broken inside the file the plan claims brings
  the note's timing home — booked by the prototype, unclosed.
- **The `--ease-accelIn` roll-call is still short.** The updated comment names laminate, ScribbleLoader,
  DarkModeToggle and the note — four — while the tree carries five surfaces: `bloom-out` at
  `index.css:1036` is unnamed. The plan's own step 2 was "name accelIn's sixth consumer".
- **`refusalHoldBeats: 24` is the band's low end with no derivation**, and the WCAG answer to a new
  three-second limit on reading ink is one asserted sentence with no SC cite and no gate. The
  reading-time argument that produced the band points at the *high* end.
- **The retraction set is stated as "1 or 9"**, measured on a naked single and a hidden single;
  `techniqueEngine` mints `becauseCells` from six other shapes (subset cells, chain components, a
  16-cell house at 16×16) and none was measured.
- **`setMargin`'s repeat clause defers the re-write to an uncancellable `nextTick`** — a writer that
  lands in the same tick is overwritten by the stale sentence. Latent, but it is a race the file did
  not have before.
- **r0's banked census is dirty in the main tree right now** — 7 files under `r0/r2-accent-family/`,
  including the three this lane names. Attribution is ambiguous (concurrent lanes run the same
  absolute-path probe), which is the point: the repair is a re-pointed `OUT` committed with the
  probe, not a restore after the fact.
- **Testimony, not artifact**: the goldens and G3.2's live (built-dist) half were not run; no device
  (M19). All three self-declared and all three still open.

## 4 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | HIT — G3 and G9 are green at HEAD and green after; G9 turns out to be false once measured, so it was vacuous as written |
| spec-cites-itself | HIT (mild) — G5 and G6 were both restated after measurement to match what the build does |
| gates that cannot fail | HIT — G6 counts MutationObserver records over a region whose text never changes |
| elegant-reduction trap | HIT — the repeat cure is claimed "for free" from out-in; the hard part (key on a write sequence) is named only in the gaps |
| legacy aliases | clear |
| masked fallbacks | HIT — `origin: WriteOrigin = "self"` on both primitives |
| unverified gestalt | HIT — no frame of the line mid-erase on either engine; both verb frames are paused constructions |
| consumer-less substrate | clear — every `MOTION.note` beat and all three `--note-*-ms` have a consumer |
| the generic default | clear — nothing here is out of house |
| the pixel it did not declare | clear — 9 live filters re-counted by me, no filter/transform on the note's chain, rects 0.00, the +125ms replacement latency declared |
| the constraint it forgot | HIT — `check-ink-pressure`'s census gains no row for the seventh quiet consumer; WCAG 2.2.1 answered by assertion with no gate |
| W2's landed mechanics | clear — untouched |
| the decided history (R6) | law 4 still broken in-file (booked); laws 6, 9, 10, 23, 24's ramp, 31, 35, 43 all respected |

## 5 · Cross-pollination

1. **The `<Transition>`-computed-duration removal is the house's general answer to PRM.** Any family
   with an exit verb (MOT-VERB, MRK-WASH, CTRL-TAPE) can take it and skip the `FILL_ALLOWLIST` row
   entirely, because there is no end pose to retain.
2. **`transition: none` on a leaving element** — a leave element's *other* transitions inflate Vue's
   computed leave duration. Any family that gives a surface both a settle and an exit needs this
   line, and nobody else has it.
3. **`WriteOrigin` is not a note law.** "The margin speaks TO THE READER" generalises to every
   surface addressed to one reader on a shared board: PLR-*, MRK-LIVE, the receipts.
4. **Beats in MOTION published to CSS via `v-bind`** (the `--card-step-ms` precedent) is the pattern
   MOT-DERIVE and MOT-LADDER should generalise, so no SFC keeps a duration literal.
5. **Two instruments worth making the wave's standard.** The rAF train of
   `{class, region text, animationName}` collapsed to state changes caught both the real leave and
   the repeat's absent one. And the counter-example: **gate a live region on its TEXT changing, never
   on MutationObserver record counts.**

## 6 · Verdict

**ADVANCE at 71%.** Nothing here needs a primitive the house does not have, nothing violates a
standing law, the seam is real and unit-proven, AA is derivable rather than asserted, and π holds at
every surface I could count. What it is not is finished: one gate is false by measurement (G9), one
measures nothing (G6), one was reworded after the fact (G5), the load-bearing seam ships behind a
default that hides its own failure, the quiet rung gains a consumer no standing gate prices, the
exit's duration is unreconciled with the house's only other erase verb, and the family's one
memorable pose has never been photographed. Every one of those is a pass-2 sentence, not a rewrite.
