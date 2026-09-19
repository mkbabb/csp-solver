# NOTE-ERASE · pass-3 CRITIQUE — the adversarial read

Critic's own lane. I did not write the spec or the prototype. Prototype worktree
`.claude/worktrees/wf_f72f3b5a-83a-47` (cut from `74a2b5d9`, uncommitted, 12 files +2 untracked),
served by me on `127.0.0.1:4243` with a private `cacheDir`, both engines, server killed and the
band re-scanned (`4243` free; `4231`/`4232` are other lanes').
My readings bank at `critique/NOTE-ERASE/{probe,logs}` — 136 KB, no crops of my own.

**Convergence: 84 %. Verdict: ADVANCE.** The must-fix is real, cured, and I reproduced it from
scratch on both engines. What is not converged is the family's *dependency* (the ladder), its
*gates* (two green by declaration, three owed), one latent defect I found in the shared beat
timer, and a fence that does not generalise past the one state it was written for.

---

## 1 · What I re-measured myself

`probe/x-verify.probe.ts` + `probe/x7-filter.probe.ts`, written here, run against the prototype
server on `:4243`. Logs in `logs/`.

| reading | chromium | webkit | the claim it tests |
| --- | --- | --- | --- |
| **G1/G16 settled exit** — node absent | **157.1 / 157.8 ms** | **171 / 174 ms** | pass 2 held it a full dusk past the verb |
| restored-ink frames after the verb | **0** | **0** | pass 2: 25 / 13 |
| `clip-path: none` frames after the verb | **0** | **0** | the rest pose holds |
| `animation-name` during the leave | `ink-rub-out, ink-rub-out-fade` | same | the verb is the rub-out |
| `transition-duration` during the leave | **`0s`** with `data-note-age="settled"` on the node | same | the compound clock wins |
| **G14** distinct clip states / median rAF | 20–21 / 7.8 ms (bar 19) | 11 / 15 ms (bar 10) | the frame bar is the engine's |
| **AA light** fresh / settled, painted over `rgb(251,250,249)` | **14.52 / 5.18** | 14.52 / 5.18 | ≥ 4.5 |
| **AA dark** (`emulateMedia` dark, paper `rgb(17,15,14)`) | **12.25 / 6.11** | 12.25 / 6.11 | ≥ 4.5 |
| **filterBudget, LIVE** at 4×4 / 9×9 / 16×16 | 25 computed-`filter` elements, **9** once `baked-hidden` (12) and `logo-pose-parked` (4) come out | identical | `FILTER_BUDGET_TOTAL` 9, exact |
| replacement trajectory in the region | `"only 3 fits here"` → (188 ms) → `"that's a given clue"`, **no empty state** | → (210 ms), same | `mode="out-in"` claim confirmed |
| strip box, empty → fresh | 390: 20.8 → 20.8 · **1280: 20.8 → 23.61** | identical | see gap 9 |
| board rect, `docH` | unchanged at both widths | unchanged | π on the board holds |

The live filter census is the one number the prototype could not give: it banked the config total
(9) and its own `d-rects` probe banked an uninterpreted **25** at all three sizes. The 25 is the
whole computed-`filter` population; it **reconciles exactly** to `FILTER_BUDGET`'s four rows
(`g.boil-pose` ×4, `svg.crayon-heart g` ×2, `svg.toggle-icon` ×2, `svg.sparkle-icon` ×1 = 9).
G13's source half is genuinely green, and now measured rather than asserted.

Mechanical estate, run by me in the worktree: `lint:copy`, `lint:motion`, `lint:ink`,
`lint:live-regions`, `lint:theme-tokens`, `lint:sleep` — all exit 0. `filterBudget.ts` and
`FILL_ALLOWLIST` are untouched by the diff (`git diff --stat` empty on that file). W2's landed
mechanics (sticky tag, dock, bottom tab, tap floor) are not in the diff at all; `scene.css` is
untouched, and the fold's own hunks survived the replay (`cellAuthors` ×5 in `BoardHost.vue`,
`onGridFocusout` ×2 in `GameBoard.vue`). `index.css` gains two keyframes and a comment reword —
no colour, so R6's hue census being byte-identical is consistent with what the diff can do.

**The centre is real.** The two-defect diagnosis is correct, both halves are in the diff, and the
prototype's live source-deletion controls (156.5 as built · 363 with the clock rule gone · 165.6
with the rest pose gone · 370/382 with 29/15 restored frames when both go) are the right shape of
proof: each half cures one defect and neither cures the other. That also means the spec's own
sentence — "`.note-leave-to` is THE LOAD-BEARING HALF" — does not survive its own measurement.
The prototype says so in its gaps rather than quietly editing the spec, which is the correct
move; the agglomerator should carry the correction into the registry, not the spec's sentence.

---

## 2 · The open gaps, each a closable sentence

1. **G5 is not green; it is inverted.** The gate says "`MOTION.rungs` and `publishMotionRungs`
   absent from this family's diff". They are *in* this family's diff — `pencilConfig.ts` +75 lines
   of ladder, `main.ts` +4 for the call — because MOT-LADDER's pass-3 diff does not exist yet. The
   declaration is honest and bannered in-source, but the gate as written reads RED, and the unit
   row that carries its name (`marginNote.motion.test.ts`, "G5: the family consumes the ladder and
   mints no rung of its own") passes *because* the family minted the ladder: it asserts
   `MOTION.rungs` has the three rungs, which is true only in a tree that grafted them. **Close it
   by:** re-stating G5 as "this family's fold carries no ladder row" and re-cutting the unit row to
   assert the ladder's PROVENANCE (a §13 marker), or by landing MOT-LADDER first and re-running.
2. **G7's declared failure mode is not the measured one.** The spec declares row E (registered at
   `initial-value: 0ms`, so a missing publisher makes the rub-out a 0 s animation); the tree
   measures row I (`--motion-whisper` computes to empty, the shorthand is invalid,
   `animation-name: none`), because the registration rides the same publisher. Loud either way, but
   the failure mode the record will carry is untested. **Close it by:** landing §13's registration
   statically and re-running the born-RED deletion, or by amending the declared mode to row I.
3. **The shared beat-timer cancels across channels — the declared cure is half a cure.** Gap 7 of
   the prototype's return says the two voices "each test their own" staleness, and they do: the
   guard is a closure. But the *cancellation* is still global — `beatTimers` is one `Set`
   (`GameBoard.vue:670`), `afterBeat` adds every channel's timer to it (`:697`), and `clearRepeat()`
   clears the whole set (`:672-673`) at the top of **every** `setMargin` (`:716`). So any margin
   write landing within one beat of a repeated `announce()` silently drops the board voice's
   re-say — a deal that repeats its line followed within 125 ms by the park, a refusal, or the
   fresh-board receipt. Same-flush ordering happens to be safe (every `setMargin` watcher is
   registered before both `announce` watchers), which is what hides it. No unit row covers it and I
   did not measure it. **Close it by:** giving each channel its own timer handle, and a unit row
   that writes the margin 60 ms into a repeated `announce()` and asserts the region still re-says.
4. **The honest clock is a fence around one state, not a rule.**
   `.margin-note-ink.note-leave-active[data-note-age]{transition:none}` neutralises a transition
   only on a note that carries the age attribute. A palette or accent lane putting `transition:
   color …` on `.margin-note-ink` with no age selector re-breaks the drop clock exactly as pass 2
   had it, and G16 — written against a *settled* leave — stays green while it happens. The spec
   claims survival "any transition a later lane puts on this element"; that is true of the rest
   pose and false of the clock. **Close it by:** asserting `transition-duration === "0s"` on a
   FRESH leave too, with a born-RED control that plants a transition on the bare class.
5. **G12's painted witness is owed.** No gold read off `CompletionVignette`'s node after a real
   solve and no `is-quiet === false` first; the 5.19/6.14 settled figures were pass 2's, carried.
   (I have now re-measured the settled rung myself — 5.18 light / 6.11 dark — so the *settle* is
   covered; the **verdict tones at 8 beats + 1**, and gold in particular, are still unwitnessed.)
   **Close it by:** one run that solves a 4×4, asserts `is-quiet === false`, and reads the gold off
   the vignette's own node.
6. **G15 is a handoff, and the handoff has no receiver yet.** Plan step 7 deleted this family's
   `check-ink-pressure.mjs` hunk and banked it as a diff for NOTE-LEDGER's `gateNote`. If
   NOTE-LEDGER does not fold, the settled note's painted rung ships with **no gate at all** —
   the family removed its own guard on the strength of another family's existence. **Close it by:**
   making the handoff conditional at the fold (NOTE-LEDGER lands `gateNote` with the consumer
   string, or NOTE-ERASE keeps its hunk).
7. **G17's peer arm is owed** — the probe reached for `window.__sudokuSession`, which does not
   exist, so the refusal-vs-peer row inside the hold was vacuous on both engines. The seven unit
   rows cover the same predicate at the seam and are green (I read them: peer-outside, peer-at-cell,
   peer-in-because, peer-reveal, peer-vs-refusal, self-both, self-reveal). **Close it by:** the
   pass-2 two-page local-wire room (`probe/c-peer.probe.ts`), both engines.
8. **G13's built half is owed** — a dist was built in the worktree (`index-BZIXN59CvHfI.js`; main's
   `index-9rZPzI5DEcpe.js` untouched, so W8 §8.1's freeze held) and carries both halves with zero
   `var()` fallbacks, but `e2e/filter-census.spec.ts` and the 4/4 goldens were never run against it.
   **Close it by:** wiring the bundled-preview config to the worktree dist for one run.
9. **The spec's own layout sentence is false at 1280 and the family did not cure it.** "one
   construction at every width, min-height 1.3em holds the strip, no layout box moves" — the strip
   grows **20.8 → 23.61 px (+2.81)** the first time the voice speaks at 1280, on both engines, on
   the prototype and (the prototype measured) on the HEAD control. `.margin-note-block{min-height:
   1.3em}` is 1.3 × the block's inherited 16 px, while `.margin-note` sets `--type-body` 18.18 →
   line 23.61. `docH` is 0 either way, so nothing below moves — but the family owns this rule and
   states it as satisfied. **Close it by:** either deriving the floor from `--type-body` in this
   diff, or striking the sentence from the spec and booking the 2.81 as a declared π row.
10. **G3 was narrowed to pass.** The gate says "no duration literal anywhere touched"; the return
    answers it for `MarginNote.vue` only. `GameBoard.vue` — a touched file — still carries `2500`
    (`:902`), `200ms` (`:1421`), and, at `:802`, a comment that still says the margin voice writes
    "via the existing 250ms" — a number **this diff removed** when it converted the write-in to
    `var(--motion-note)`. The literals are pre-existing and out of the family's motion; the stale
    comment is not. **Close it by:** re-wording `:802` and stating in the return that the gate is
    scoped to the family's own verbs, rather than answering a wider gate with a narrower grep.
11. **Two of the four cited crops are the same bytes.** `settledExit-390-chromium.png` and
    `repeatHole-390-chromium.png` are byte-identical (`sha256 29d49450…`): both are an empty grey
    strip, so neither can tell its own gate's claim from the other's. The park pair is legible only
    as a grey band — I looked, and "only 9 fits here" cannot be read in `park-record-1280-webkit.png`
    at the cited `300.18 × 11.21`. The visual claims rest entirely on DOM readings; the frames are
    ceremony. **Close it by:** one crop that shows the strip mid-verb (clip at ~50 %) beside the
    empty, and one park crop at a legible scale — or cite no frames and say the numbers carry it.
12. **Four instruments were copied and not run** — `marks.probe.ts` (R3-d, R3-g), `wobble.probe.ts`,
    `budget.probe.ts`, `heading-voice.spec.ts`. The r3g age+leaving reader amendment and its
    `instruments/r3g-age.diff` are therefore not proposed and the r0 row is correctly NOT MOVED, but
    the wave asked for the censuses. **Close it by:** running the four copies with OUT already
    re-pointed (they are in the prototype's `probe/`).

---

## 3 · Failure-mode checklist

| item | verdict |
| --- | --- |
| vacuous convergence | **CLEAR** — every gate names a number that reds; the born-RED publisher deletion was actually run and restored. |
| spec-cites-itself circularity | **HIT** — the G5 unit row passes because the family grafted the ladder it claims not to mint (gap 1). |
| gates that cannot fail | **HIT (narrow)** — G16 is scoped to the settled leave, so the clock fence's general failure is unreachable by it (gap 4). |
| elegant-reduction trap | **CLEAR** — nothing is deferred as "and then the hard part"; the two halves are both in the diff. |
| legacy aliases | **HIT (graft-borne)** — `MOTION.chromeLeaveMs: 200` and the grafted `MOTION.rungs.leave: 200` are now two homes for one number. §13's to reconcile, not §7's, but it entered the estate through this diff. |
| masked fallbacks | **CLEAR** — the `var(--x, 250ms)` fallbacks are gone (0 in the SFC and in the built CSS); `kind` is required at `setMargin` with TS2554 naming the sites; `origin` likewise. The `withDefaults` `kind: "state"` on `MarginNote` is a component-boundary default, not a masked case — the domain always passes one. |
| unverified gestalt | **HIT** — see gap 11; the only look-claims with pictures behind them have pictures that cannot show the claim. |
| consumer-less substrate | **CLEAR** — `MarginKind` has five consumers, `parked` three forwards and one watcher, both new `MOTION.note` clocks are read. |
| the generic default | **CLEAR** — no eyebrow, no card, no arrow; the exit is the arrival run backwards, which is the estate's own idiom. |
| the pixel it did not declare | **HIT (gap 9)** — +2.81 px on the strip at 1280, declared as a reading and attributed to HEAD rather than cured, while the spec asserts the opposite. |
| the constraint it forgot | **CLEAR on AA (14.52/5.18 light, 12.25/6.11 dark, measured here), filterBudget (9 exact live, both engines, three sizes, measured here), M16 (`lint:copy` 0), W2's mechanics (untouched), the decided history (R6 census byte-identical, no colour minted).** |

---

## 4 · Strengths worth banking whatever the agglomerator decides

- The diagnosis is the contribution: Vue takes `max(transition, animation)` **off the leaving node**,
  so a settle transition outranks a shorter exit verb, and a no-fill keyframe releases into the
  cascade. Both are general to every `<Transition>` the estate will write.
- The prototype separated the two halves with live source-deletion controls instead of arguing,
  and published the result *against* its own spec's sentence.
- `WriteOrigin` required on both write primitives, enforced by `TS2554` at six named sites, is the
  right shape for a seam: the compiler names every caller that has to decide.
- `kind` replacing `tone` as the ageing key kills two booleans (`hintNoteLive`, `refusalNoteLive`)
  that could disagree with each other and with the text.
- Ageing by kind is what makes "verdicts never settle" a construction rather than a promise:
  `AGES = ["record","state"]` is the whole rule.
- The repeat's hole timed from Vue's own `@after-leave` rather than a guessed length.
- W1's seam was handed back with seven unit rows, not a claim.

---

## 5 · Verdict

**ADVANCE.** The family's centre — a note with an exit, and an exit with an honest clock and a rest
pose — is built, runs, and I reproduced its headline number independently on both engines. No
missing primitive (nothing here is as hard as the problem), no constraint violated (AA, filter
budget, M16, W2, R6 all hold under my own measurement). What stands between this and a fold is a
dependency it cannot land alone (§13's ladder), five gates that are owed or handed rather than
asserted, one latent cross-channel defect, and a layout sentence the family should either cure or
strike. None of those is a rewrite.

**Convergence 84 %** — 100 is unreachable while G5 reads inverted, G12/G13-built/G17 are owed, G15
has no receiver, and gap 3 is unmeasured.
