# MOT-VERB — pass 2, PROTOTYPE · the delay fence, and the beats it gives back

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-64`,
branch `worktree-wf_8630d340-e56-64`, cut at `a8fee1f5` with **W8 C06 (`0bf9cb0e`) cherry-picked
as the one commit** (`ec47a373`). Nothing else is committed: this family's change is the
working-tree diff — **25 files, +390/−82, plus three new files** (`scripts/check-pencil-verbs.mjs`,
`scripts/publish-verbs.mjs`, `src/pencil/config/pencilVerbs.test.ts`).

It RUNS. Three BUILT dists: the prototype (`index-B_9Pru8TmQgi.js` / `index-EAwejBJoaRPz.css`,
index.html md5 `5b7319b947cc6d78f5419ae33ec820aa`, 43 files / 809.3 KB), a control that is
**HEAD + C06 alone** (`index-CydLs17Yb6Kt.js` / `index-DouNrfU0EVpa.css`), and a negative
control at **`aab67b92`, pre-C06** (`index-9rZPzI5DEcpe.js`) built only to show I1's RED.
Served static on 127.0.0.1:4247 / :4248 / :4249 (the charter's port and the next free; the
4230–4249 band was empty at run time, `lsof`-scanned), chromium and webkit headless, 1280×800
and 390×844 dsf3 touch, both themes, and under `prefers-reduced-motion: reduce`. Every server
was killed before this record was written; the band reads empty again.

---

## 1 · The replay

`git -C <pass-1 worktree> …` is refused by this session's worktree isolation, so the replay was
done by FILE COMPARISON against the base the pass-1 worktree was cut at (`aab67b92`, extracted
with `git archive`): **26 tracked files differed and 2 scripts were new**, and every one was
copied in. `App.vue` was replayed hunk by hunk instead, because C06 rewrites
`boardAnimations()` in that same file; the replayed `App.vue` then differed from the pass-1
worktree's copy **only by C06's twenty lines**, which is the check that the replay was exact.

The replay carried: the published `@theme` block and its PRM arm · `--ease-fadeOut` and
`--ease-ghostDraw` folded · RUB OUT (`ink-rub-out` + `MarginNote`) · the twins · `spend()` at
the fold, the drawer and the carousel · all 55 swept rows · `lint:verbs` in `package.json` and
in `.github/workflows/ci.yml`. `vue-tsc` ran clean on the replayed tree before anything was
advanced.

## 2 · Born RED, then GREEN (`npm run lint:verbs`)

| reading | pass-1 branch (replayed) | HEAD | prototype |
| --- | --- | --- | --- |
| unadmitted declarations | **16** | **35** | **0** |
| rule 1′ curve | **1** (`GameCard.vue:410`) | 30 | 0 |
| rule 2 a typed number | 0 | 34 | 0 |
| **rule 2′ the fence** | **9 declarations / 10 terms** | 0 (no rungs at HEAD) | 0 |
| rule 5 what it moves | **7** | 0 | 0 |
| rule 5b direction | **1** (`DMT:882`, LIFT on the star's arrival) | 0 | 0 |
| the ledger, stale | 17 | 0 | **0** |
| identical texts in one file | **6** | **4** | 4 |
| movers that spend | 2/2 | 2/2 | 2/2 |
| the toggle's beat table | absent | absent | **8 beats, each read back off its rule** |
| undeclared duplicate curve pairs | 0 | 0 | 0 |
| publisher | RED (no marker pair, block ≠ config) | RED | **13/13 rows, divergent 0, byte-for-byte yes** |

The spec predicted 1 / 7 / 1 / 10 terms / 6 collisions; the branch read 1 / 7 / 1 / 10 / 6.
Raw: `readings/born-red-pass1-branch.txt`, `readings/born-red-HEAD.txt`, `readings/gate-green.txt`.
The ledger is 36 admissions — shape 12 · signature 9 · graded 6 · elsewhere 4 · prm 3 ·
layout 1 · loop 1 — 0 stale.

**Gate 8, born RED properly.** The pass-1 branch carried no beat table at all, so "RED" there
says only that the fixture is missing. `probe/gate8-born-red.sh` restores the pass-1 SPELLINGS
of the toggle's own rows beside the pass-2 table and re-runs the gate
(`readings/gate8-born-red-pass1-beats.txt`). It names **four** moved beats, one more than the
spec predicted:

```
wring: .toggle-icon .warp runs 250ms at 0ms; the beat table says 340ms at 0ms
rise : .toggle-icon.is-active runs 280ms at 150ms; the beat table says 300ms at 60ms
out  : .toggle-icon runs 150ms at 250ms; the beat table says 100ms at 240ms
star1: .toggle-icon.is-active .twinkle-star runs 150ms at 520ms; the table says 150ms at 560ms
```

**The self-test** — six controls, each against the real tree with one line moved, all RED as
they must be (`readings/self-test.txt`):

```
A: a legacy --ease-* token on a transition, the rung kept   RED    rule 7: a mover types its own duration   RED
B: an erase curve on the note's arrival                     RED    rule 8: a beat moves, the table does not RED
the delay fence: a delay respelled as a rung                RED    a fifth name for the glass curve         RED
a comment inserted inside RUNGS                                    still publishes
```

## 3 · The numbers on the real surface

**V9 · the toggle's beats, computed off the live element mid-gesture** — prototype = control =
HEAD's table, every beat, on **both engines, both viewports, both themes**:

```
out 100@240 · rise 300@60 · wring 340@0 · bloom 800@60 · tuck 150@0
star1 150@560 · star2 150@640 · star3 150@720
```

**V10 · the players well**, read off a live node wearing the scope attribute the RULE itself
names (`data-v-0d15028c` prototype, `data-v-abacab54` control — the hash moves because the SFC
text moved; the numbers do not):

| | row | name |
| --- | --- | --- |
| `.is-arriving` | 320 @ 0, glass | `ink-write-in` 380 @ 140, drawOn |
| `.is-returning` | 280 @ 0, glass | `ink-write-in` 320 @ 120, drawOn |
| `.is-leaving` | 320 @ 420 | `player-name-quiet` 260 @ 260 |
| **arriving − returning** | **40 ms** | duration 60 ms, and the name **LANDS 80 ms sooner** (520 → 440) |

Identical on prototype and control, both engines: the well is untouched in paint, and the
comment at `:1732` now says exactly this.

**P5 · the twins** — the deck's leave and the chrome's leave resolved through a probe element so
the shipped shorthand does the talking, then evaluated at t = 100 ms:

| | prototype | control |
| --- | --- | --- |
| deck `.gallery-fade-leave-active` | 200 ms `cubic-bezier(0.32, 0, 0.67, 0)` | 200 ms `cubic-bezier(0.32, 0.72, 0, 1)` |
| chrome `.scene-leaving .scene-controls` | 200 ms `cubic-bezier(0.32, 0, 0.67, 0)` | 200 ms `cubic-bezier(0.32, 0, 0.67, 0)` |
| opacity ratio at 100 ms | **1.00** both engines | **19.3005** both engines |

Pass 1 read 19.30 and 1.00. Same numbers, taken again.

**I1 · the exit fold plays** (r0's instrument, run from a copy — it banks nothing to disk, so
no OUT needed re-pointing):

| build | reading |
| --- | --- |
| `aab67b92`, pre-C06 | **RED** both engines: the EXIT's mover ran **0 frames**, first state `finished`, no transform |
| HEAD + C06 (control) | **GREEN** 4/4 |
| prototype | **GREEN** 4/4 — EXIT `.board-peek-host` running **62 frames** chromium / **31** webkit, live transforms both widths; the ENTER is the control and runs in all twelve |

**RUB OUT live** — the class on a real margin note (`?size=3&difficulty=EASY`, hint armed):
`ink-rub-out 0.2s cubic-bezier(0.32, 0, 0.67, 0) backwards`, **one glyph box across every
frame** (33 sampled chromium / 17 webkit), the clip retreating `inset(0 0 0 0%)` →
`inset(0 0 0 100%)` with opacity 1 → 0, in **both themes and both engines**. Under `reduce`:
`animation: none` and the END POSE already in the first sampled frame (clip 100 %, opacity 0).
The control has no such verb — the class does nothing there (`ink-write-in 0.25s`, clip `none`).

**PRM at the ladder** — under `reduce`, prototype: every rung and `--verb-dusk-ms` read `0s` at
`:root`; `DrawerTab .drawer-tab-text` `0s`; the washi label `0s`. Control: the ladder does not
exist (`""`) and both sites still run **0.15 s** under reduce. The two admitted fallbacks keep
their literals in the shipped bundles — `transition:opacity .2s` (the toggle's crossfade) and
`transition:opacity .15s linear` (the laminate's).

**Frame trace, 15 gestures at 1×** — chromium 0 frames > 33 ms on either tree; webkit prototype
**8** (worst 42 ms) against the control's **11** (worst 56 ms). Zero new long frames, nothing
shortened.

**The dusk** — six alternating flips: the painted `background-color` sequence is byte-identical
on prototype and control, both engines (`rgb(17,15,14)` ⇄ `rgb(251,250,249)`).
`--verb-dusk-ms` reads `.35s` on the prototype, absent on the control: the same paint under a
name. Long frames during the six flips: chromium 0 vs 0; webkit 2 (43, 43 ms) vs 1 (35 ms) —
parity within this rig's jitter. The absolute-fps / "≤ 17 colour steps" clause is **retired by
name** (r0 R4 :201-202 headless rAF uncapped; r7 M09 16 vs 33 steps by engine); the device
floor is W8 §8.3's owner-run instrument.

**π, unmoved.** `check-font-coverage` OK — 2 subset faces, 30 + 46 codepoints, 14 636 B /
4 312 B, byte figures unchanged. `lint:motion` OK (34 specs). `lint:copy` OK (0 dashes, 2
admitted). `vue-tsc` 0. `vitest` **67 files / 815 tests**, all passing, including the five new
rows of `pencilVerbs.test.ts`. The filter census read **11 ids on a bare desk load, identical
on prototype and control, both engines and both viewports** — see gap 3.

## 4 · What changed, and what went back

40 rows change; 15 revert to HEAD byte-for-byte; **zero delays move**. `DarkModeToggle.vue`
rows 32–38 are HEAD's text again (four beats restored). `GameControlPanel.vue`'s players well
is HEAD's six literals with `:1732` corrected to the measured truth. `gameCell.css` is
byte-identical to HEAD (`diff` clean — §6's file, the chair's §6.11). `sharePop 500ms ease` and
`eraserScrub 400ms ease` are back, admitted `shape`.

**`--ease-ghostDraw` comes back with them.** Pass 1 folded it into WRITE IN; its only two
consumers are the rows this pass hands to §6, so the token still has the ring it names, and the
§EASING ledger says so in one line. (`--ease-fadeOut` stays folded: its consumers are this
family's thesis rows.)

The three silent +50 ms are gone by the widened tuple — sparkle, gallery pip and toggle hover
all at `breath` (200 → 200). `GameCard.vue:410` is SLIDE at `step`. `App.vue`'s
`animKey === ""` guard is deleted in favour of C06's id filter, and I1 proves the exit still
paints without it.

## 5 · Gaps, stated plainly

1. **V5 as written is unsatisfiable.** It asks for `spend("rubOut","breath").fill ===
   "backwards"` AND for `spend("writeIn", …)` to be a type error under a verb union derived from
   `mechanism ∋ "waapi"`. RUB OUT is a keyframe verb, so under that union `spend("rubOut", …)`
   is a type error too. The prototype ships the DERIVED union and proves the fill as a value:
   `MOTION.verbs.rubOut.fill === "backwards"`, `spend("turn","page").fill ===
   MOTION.verbs.turn.fill`, and `// @ts-expect-error spend("writeIn","mark")` — `vue-tsc` 0
   confirms the error is really raised. **The adjudicator should re-word V5's first clause.**
2. **The beat table is a JSON block in a comment**, `@toggle-beats`, beside the gesture in
   `DarkModeToggle.vue`'s `<style>`. A `const` would have been dead code the linters would red;
   a comment block is data both the node gate and a browser probe can read. It is the one place
   in this diff where "data" is a comment, and a critic may want it elsewhere.
3. **The filter census is 11 by this probe's count, not 9.** It is identical on prototype and
   control, so π holds by construction, but this probe counts every distinct `url(#…)` a
   computed filter names, including the four baked celestial poses and the four logo poses —
   which `filterBudget.ts` deliberately excludes. The estate's enforcing census,
   `e2e/filter-census.spec.ts` under the bundled-preview config, was NOT run here.
4. **CrayonHeart `.face` cannot be read at runtime** — the element never renders (it is behind
   `variant === 'blush'`). That is §3's row 39 confirmed from the surface: the PRM claim covers
   two sites, not three.
5. **The goldens were not run** (`playwright-golden.config.ts`, 4/4), nor `check-theme-tokens`,
   nor r1's heading-voice spec, r3's wobble probe or r6's `hue-census.mjs`. Nothing in this diff
   touches colour, text or geometry — the whole change is durations, curve NAMES and comments —
   but "no pixel moved" is argued here, not measured by those four.
6. **R6:42 (the laminate) is MOVED NARROWLY** and the proposed re-wording is the synthesis's
   `instruments/R6-laminate-row.diff`; this prototype wrote nothing under `loop/r0/` and re-cut
   nothing. R6:48 (the ribbon, 240 → 250) is cited from MOT-LADDER's diff. R6:49 is not an R6
   row.
7. **Zero crops.** Nothing here moves a pixel that pass 1's two frames did not already show.

## 6 · The files

`probe/mot-verb-p2.probe.mjs` (beats · twins · PRM · frame trace · dusk · filters) ·
`probe/p2b.probe.mjs` (the players well · RUB OUT) · `probe/gate8-born-red.sh` ·
`probe/i1-run.sh` + `probe/i1-prec06.sh` + `probe/serve.mjs` · `probe/summarize.mjs`,
`probe/sum2.mjs` · `readings/*.txt|json` · `instruments/i1-exit-fold-plays.COPY.mjs`.
