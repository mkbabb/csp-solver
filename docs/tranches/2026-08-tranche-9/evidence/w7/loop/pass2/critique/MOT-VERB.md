# MOT-VERB — pass 2, CRITIQUE · the fence holds, the ladder is contested, and a CI lane is red

Adversarial read of `pass2/synthesize/MOT-VERB.md` + `pass2/prototype/MOT-VERB/` against the
prototype's own worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-64`.
I wrote nothing in that worktree, nothing under `loop/r0/` and nothing under `loop/pass1/`.
Everything below that says "I read" was re-taken here: the gate and its self-test bare, four
estate lints bare, `vue-tsc`, the new unit file, two clean rebuilds, three planted negative
controls of my own, and a chromium + webkit probe over two viewports × two themes × PRM
against the prototype's dist (`:4241`) and MAIN's dist (`:4242`, `index-9rZPzI5DEcpe.js`,
`aab67b92` — the pre-C06 base, served read-only, never rebuilt). Both servers killed; the
4230–4249 band reads empty. Readings: `MOT-VERB/readings/`, probe `MOT-VERB/probe/critic.probe.mjs`.

**CONVERGENCE: 72%. VERDICT: ADVANCE** — with one CI-red to cure before anything folds, and one
section-level collision that is the adjudicator's, not this family's.

---

## 1 · What I reproduced (the family's strongest claims hold)

| claim | the prototype's reading | mine |
| --- | --- | --- |
| `lint:verbs` GREEN | 0/0/0/0/0/0, 36 admissions, 0 stale, 4 collisions, publisher 13/13 | **identical**, bare exit 0 |
| the self-test | 6 controls RED, a comment inside `RUNGS` still publishes | **identical**, bare exit 0 |
| V9 the toggle's beats | out 100@240 · rise 300@60 · wring 340@0 · bloom 800@60 · star1/2/3 150@560/640/720 | **identical, computed off the live element mid-gesture, chromium AND webkit** — and identical to MAIN's dist, which is the point: the revert is real |
| PRM at the ladder | every rung + `--verb-dusk-ms` `0s` at `:root` under reduce | **identical in 8 conditions × 2 engines**; MAIN's dist has no ladder (`""`) |
| the twins | chrome-leave and deck-leave one curve | shipped CSS: chrome `var(--rung-breath) var(--verb-lift-ease)` = base's `.2s var(--ease-fadeOut)` byte-for-byte; the deck moves to the same pair (the declared, U-10 change) |
| π unmoved | argued, not measured (their gap 5) | **now measured at the stylesheet**: set-diff of the two shipped CSS files (data-v hashes normalised, timing lines excluded) = 3 substantive additions, all of the inert rub-out rule. Zero colour, zero geometry. |
| AA | "untouched by construction" | **measured**: body 18.99 light / 16.18 dark, muted control 4.55 / 7.85 — byte-identical prototype vs base, both engines |
| filters | 11 by their probe, unknown to law 9 | my census: 3 distinct `url(#…)` at rest (`grain-static`, `wobble-celestial`, `wobble-heart`), **identical prototype vs base** in all 8 conditions × 2 engines |
| `vue-tsc` 0 · the new unit file | claimed | `vue-tsc -b --force` exit 0; `vitest` 1 file / 5 tests passed |

The delay fence is a real law with a real born-RED and a real sabotage, the derived shape set
kills pass 1's 29-name shadow ledger, and the marker-pair publisher kills the prettier-reflow
red class. Those three are the pass.

---

## 2 · What I broke

### 2.1 `lint:knip` REDS on the prototype — a standing CI lane, GREEN on main

```
$ npm run lint:knip                       # in the prototype's worktree
Unused exports (6)
TS_BEGIN  TS_END  BEGIN  END     scripts/publish-verbs.mjs:31,32,33,35
rows      function             scripts/publish-verbs.mjs:114
block     function             scripts/publish-verbs.mjs:123
exit 1
$ npm run lint:knip                       # main tree, same command
exit 0
```

`ci.yml:865` — "knip (dead-file / dead-dependency / dead-EXPORT gate)", configured `error` so a
dead exported surface reds the lane. The diff ADDS a CI step (`lint:verbs`) in the same file and
breaks an existing one. The return's battery names `lint:motion`, `lint:copy`, `vue-tsc` and
`vitest` and does not name knip. One-line cure; but "it runs" cannot be claimed until it does.

### 2.2 `spend()`'s rung is not fenced — rule 3 is a CSS-only law

`spend = <V extends WaapiVerb>(verb: V, rung: keyof typeof MOTION.rungs)`. The rung parameter is
the whole ladder, not the verb's own set. Rule 7 reads a mover's options object only for a typed
duration and a quoted curve. So:

```
- const GLIDE = spend("slide", "step");       // useCarouselGlide.ts:29
+ const GLIDE = spend("turn", "touch");       // turn.rungs === ["page"]
  → npm run lint:verbs: 0 offences, GREEN     (planted in a src copy, SRC= )
```

TURN is fenced to `page` alone, and the spec calls that fence "what makes TURN and SLIDE two
verbs on one curve rather than one verb with a loose number". Both of the product's TURN spends
are movers, i.e. exactly where the fence is not read. The new unit row named "spends no rung a
verb is not allowed to spend" asserts `MOTION.verbs.turn.rungs` equals `["page"]` — the data, not
the law.

### 2.3 The `isShape` carve-out voids rules 1′, 5 and 5b for any bound `animation:`

`isShape = isAnimationDecl && KEYFRAMES.has(head0) && !RAW_MS.test(body)` skips rule 1′, and with
no verb curve in the term the loop `continue`s before rules 5 and 5b. Planted in a src copy:

```
.probe-escape { animation: note-in var(--rung-mark) linear backwards; }
  → 0 offences, GREEN
```

A browser keyword curve, on an arrival keyframe, moving whatever it likes, with no ledger row.
"Rule 5 enforces a verb by what it does" and "5b: keyframes enforced" are true only of the
animations that volunteered a verb curve. That is opt-in enforcement described as a law.

### 2.4 Gate 8's fixture is one-directional

Nothing checks that the table covers the gesture. Deleting `"star3"` from `@toggle-beats` and
moving the real delay 720 → 900ms prints **"the toggle's beat table: 7 beats, every one read back
off its rule"**. The move was caught, but by the admission ledger (stale 1 + 1 unadmitted), not by
the fixture the family built for it. The gate's own prose says "every `.is-turning` rule must read
it"; no code enumerates those rules.

### 2.5 RUB OUT has no consumer, and the family's comment says so

`.is-rubbing-out` occurs exactly twice in `src/`: its own rule in `MarginNote.vue:160` and the
index.css §MOTION comment. No template, no script, no test ever adds the class. The verb ships as
ink no player can reach, defended in the source with "WHICH acts erase a note is not this
family's to design." Pass 1's headline primitive is still a primitive. This is not in the
return's gap list.

### 2.6 `--card-step-ms` is orphaned by this diff

`GameGallery.vue:930` still writes `:style="{ '--card-step-ms': …MOTION.cardStepMs… }"`; its one
reader, `GameCard.vue:410`, now reads `var(--rung-step)`. A custom property with a writer and no
reader — the exact species the family invokes to justify `turn.published = false` ("publishing
`--verb-turn-ease` would mint a token with no consumer and the dead-token census would red on
it"). `check-theme-tokens` is GREEN because an inline-bound property is not an `@theme` token, so
the estate cannot see it either.

### 2.7 The dock's verb contradicts the sentence above it

`useControlsDrawer.ts` spends `spend("turn", "page")` for every pose; three lines above, its own
comment reads "the portrait dock throws the sheet along its rail, which is SLIDE at the same page
rung", and the spec's SURFACES line promised "dock SLIDE at the section's rung". Nothing spends
SLIDE at the dock. Either the verb or the sentence is wrong, and the gate cannot tell (2.2).

### 2.8 The banked dist identity does not reproduce

The working tree is byte-identical to the banked `mot-verb-p2.diff` (diff-of-diffs empty). Two
clean `npx vite build` runs from it produce **`index-CZKMXa0jaF0Y.js` / `index-DyYvzSpy3VHO.css`,
`index.html` md5 `9eb7a9d235ca746928b8498085c50d44`**, identical to each other (`diff -rq` empty),
43 files / 809.3 KB — the file count and the byte total the record claims, under different
hashes than the record's `index-B_9Pru8TmQgi.js` / `index-EAwejBJoaRPz.css` / md5 `5b7319b9…`.
The measurements were taken on a build the banked diff no longer yields. (T2–T4 lesson: the
record can't verify the record.)

### 2.9 THE SECTION HAS TWO LADDERS (for the adjudicator, not this family)

`pass2/synthesize/MOT-LADDER.md:32` ships `--motion-whisper 150 · leave 200 · note 250 · dusk 350
· step 440 · throw 520` (+ `rise 600` proposed) with the call-site grammar
`transition: <prop> var(--motion-<rung>, <ms>) var(--ease-<curve>)`. MOT-VERB ships `--rung-touch
150 · breath 200 · mark 250 · sheet 280 · step 440 · page 520` and a rule 1′ that REDS an
`--ease-*` on a transition. Each family's gate reds the other family's every call site; `sheet
280` and `dusk 350` have no counterpart across the aisle. MOT-VERB's own citation carries the
collision into the record: the R6:48 row it cites from MOT-LADDER's diff is worded "the `note`
rung (250ms)" — a rung MOT-VERB does not have. "Composes with MOT-LADDER's `<style>` publisher"
is true of the mechanism and false of the grammar. Relatedly, MOT-LADDER's critic found its B9
(the fence, section-wide) **vacuous in that diff** — so the outside adoption this spec leans on
adds no independent evidence; the fence's only RED is still this family's own branch.

---

## 3 · Checklist

- **gates that cannot fail** — HIT ×3: the `isShape` carve-out (2.3), gate 8's one-directional
  table (2.4), rule 3 unread at the only two TURN sites (2.2).
- **consumer-less substrate** — HIT ×2: RUB OUT (2.5) and, inverted, the orphaned
  `--card-step-ms` (2.6).
- **the constraint it forgot** — HIT: `lint:knip`, a standing CI lane, red (2.1). AA, M16
  (`lint:copy` 0), filterBudget (`filterBudget.ts` untouched; census identical), W2's landed
  mechanics: CLEAR, measured.
- **legacy aliases** — SOFT HIT: `cardStepMs`/`boardFoldMs`/`chromeLeaveMs` survive as aliases of
  `RUNGS.*` with a "dies the pass after" note; the sibling family deleted its equivalents this
  pass.
- **unverified gestalt** — SOFT HIT: zero frames this pass by design, and the one visibly moved
  row (the deck's leave, glass → lift, dAUC 0.852) is defended by arithmetic and pass-1's frames,
  never looked at on this build. Defensible under U-10; not "proven".
- **the pixel it moves that it did not declare** — CLEAR, and now measured, not argued: the
  shipped-CSS delta is the rub-out rule and scoped-keyframe renames, nothing else.
- **masked fallbacks** — CLEAR. `fill` from the verb is a genuine removal of one.
- **elegant-reduction trap** — SOFT HIT, named honestly: the players well is admitted whole and
  its rung expression banked for pass 3; the `spend().fn` arm is banked for "the pass after next".
- **vacuous convergence · spec-cites-itself · generic default** — CLEAR. The born-RED is real
  (1/7/1/10 terms/6 predicted, 1/7/1/10/6 read), the ledger carries 36 rulings in seven named
  kinds, and nothing here reads as a Material scale with a spell-checker.
- **decided history (r0/R6)** — CLEAR: `R6:42` (line 42, the laminate) is proposed as a diff and
  never re-cut; `R6:48` (line 48, the ribbon) and `R6:49` (line 49, DrawerTab — indeed names no
  curve) check out against `R6-census.md`; law 9 (filterBudget 9), law 14 (three hover forms) and
  law 39 (the 180ms ring, handed to §6 with `gameCell.css` byte-clean) are respected.

---

## 4 · The open gaps, as closable sentences

1. Un-export `TS_BEGIN`/`TS_END`/`BEGIN`/`END`/`rows`/`block` in `scripts/publish-verbs.mjs` (or
   bring them under knip's entry surface) so `npm run lint:knip` returns to exit 0.
2. Narrow `spend`'s second parameter to `(typeof MOTION.verbs)[V]["rungs"][number]`, and teach
   rule 7 to read the `spend(` arguments, so `spend("turn","touch")` fails the type check and the
   gate.
3. Make an `animation:` whose head names a defined `@keyframes` obey rules 1′, 5 and 5b unless it
   carries a `shape` admission — i.e. delete the silent `isShape` exemption and let the ledger
   carry the T6 incumbents it already carries.
4. Add gate 8's other direction: every `transition` declaration inside a `.is-turning` rule of
   `DarkModeToggle.vue` must appear in `@toggle-beats`, so deleting a row reds instead of
   shrinking the count.
5. Name the act that erases a margin note (or hand RUB OUT to the family that owns note lifetime)
   so `.is-rubbing-out` has a writer in the same diff as its CSS.
6. Delete the `--card-step-ms` binding at `GameGallery.vue:930` now that `GameCard.vue:410` reads
   `--rung-step`, or re-point it, so the diff leaves no property with a writer and no reader.
7. Decide the dock: either spend SLIDE at the dock's pose or rewrite the comment and the SURFACES
   line to say the dock TURNS, so the source and the spec agree.
8. Re-build from the banked diff and re-bank the dist identity (or bank the build's inputs), so
   the recorded `index-*.js`/`index.html` md5 is one a reader can re-derive.
9. The adjudicator rules ONE ladder for §13: `--rung-*` (touch/breath/mark/sheet/page) or
   `--motion-*` (whisper/leave/note/dusk/throw), one call-site grammar, and one wording for the
   R6:48 row the two families now cite in different vocabularies.
10. Re-word V5's first clause (the family's own gap): `spend("rubOut", …)` cannot both be a type
    error and return a fill; state it as `MOTION.verbs.rubOut.fill === "backwards"`.
11. Run the four instruments still owed on this build — goldens 4/4, `e2e/filter-census.spec.ts`
    (R6 law 9's EXACTLY 9; three probes have now produced 3, 9 and 11 by three definitions), r1's
    heading-voice spec and r3's wobble probe from re-pointed copies — so "no pixel moved" is
    closed by the estate's own gates and not only by a stylesheet diff.
12. Put the owner's seven U-10 dispositions in front of the owner (deck leave on LIFT, the 17
    hover grounds, the tongue's straighten, the well's pass-3 rung audition, the dock's rung, RUB
    OUT at breath vs touch, the toggle's reduced-motion crossfade).

---

## 5 · Strengths worth banking

1. **The delay fence.** A one-sentence law with a born-RED of 10 terms, a sabotage control, and
   six decided beats given back — and I confirmed the beats on both engines against MAIN's own
   dist, mid-gesture, off computed style. This is the rare pass whose headline is a subtraction.
2. **The record verifying the record.** `@toggle-beats` beside the gesture, read statically by the
   gate and dynamically by a probe, on the surface the owner audited most. The idea survives gap 4.
3. **The derived shape set and the marker-pair publisher.** Pass 1's two brittle mechanisms (a
   hard-coded 29-name list, an indentation parse with an end sentinel) are gone; a comment
   inserted mid-tuple still publishes, which I re-ran.
4. **The ledger's kinds.** shape · signature · graded · layout · loop · prm · elsewhere, with an
   occurrence ordinal in the key, so two identical texts in one file are two rows and a graded
   pair cannot collapse unseen. It caught 2.4's planted move when the purpose-built gate did not.
5. **The admissions that are reverts.** Fifteen rows back to HEAD byte-for-byte, `gameCell.css`
   diff-clean under the chair's §6.11, zero delays moved — a design pass that mostly returns
   things is a design pass that read its own critique.

---

## 6 · Cross-pollination

- **"A delay keeps its number; only travel takes a rung"** — to MOT-LADDER (whose B9 is vacuous
  without this family's branch) and to every family publishing a duration token.
- **The occurrence-ordinal ledger key** `${file} :: ${body} #${n}` — to any gate whose ledger is
  keyed on a line number (the copy gate, the motion contract): a comment above a row stops
  reddening it.
- **The marker-pair publisher** (`/* @x-begin */ … /* @x-end */` + brace matching + byte-for-byte
  `--check`) — the general cure for the prettier-reflow red class, for any TS→CSS publisher.
- **A fixture beside the thing it describes, read by both a node gate and a browser probe** —
  the pattern for every owner-audited gesture; ship it with the completeness check gap 4 names.
- **A derived set instead of a name list** — "a keyframe is shape by existing in the tree" kills
  the second, unnamed ledger wherever one is hiding.
- **The kinds taxonomy for admissions** — a readable schema other gates can adopt so a reader can
  count classes without reading prose.
