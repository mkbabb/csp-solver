# MOT-LADDER — pass 4 PROTOTYPE

T9-W7 §13, the transition grammar. Worktree
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59`
(the pass-3 tree, ADVANCED IN PLACE per pass4/CHAIR-RULINGS §2). Base and π control in every
row: **`74a2b5d9`**. Uncommitted: **43 modified + 3 untracked**, one delta.

Served arms, verified by their OWN build's asset hash and never by a 200:
after **`index-BvdTwOp8Owkm.js`** on 127.0.0.1:4246 · control **`index-CubiZsMVSwTc.js`** on
127.0.0.1:4249 (the chair's pre-built `w7-control`, untouched). Both killed by recorded PID
(18087 / 18088); 4246 and 4249 read free at return.

---

## 0 · Numbers first

| reading | control `74a2b5d9` | after | engines |
| --- | --- | --- | --- |
| **π** structural rect + paint census, board PINNED (`?board=`), 4 poses | — | **maxDelta 0.000px · 0 moved rects · 0 paint moves · 0 keys on one side only** | chromium + webkit |
| shared structural keys compared | — | 850 / 825 / 825 / 823 (chromium) · 934 / 909 / 909 / 907 (webkit) | both |
| **PRM** rendered elements whose transition resolves nonzero under `reduce` | **62** | **16** | identical in both |
| of those 16: inherited from the control's roster / UNACCOUNTED | — | **16 / 0** | both |
| every rung at `:root` under `reduce` | — | `0s` ×7 | both |
| **filter census** (estate's own, against this dist) | — | **12 passed** | both |
| **goldens** (`PLAYWRIGHT_BASE_URL` → this dist) | — | **4/4**, no re-mint | — |
| unit | — | **68 files / 830 tests, 0 failed** | — |
| `vue-tsc -b` | — | **0** | — |
| static gate, bare | — | **14/15 green, B8 red at 21** | — |
| `MOTION_LADDER_B8_OWNED=1 npm run lint:bands` | — | **exit 0** (the CI lane's exact invocation) | — |
| `--self-test` | — | **29 negative controls RED, 1 negative-negative HELD, 0 vacuous** | — |

**Dock audition, six rounds on ONE build, both engines, four poses** — worst rate over all
eight pose-engine cells, taken on a resampled 60Hz grid:

| clock | 440 | 480 | 520 | 560 | 600 | 700 |
| --- | --- | --- | --- | --- | --- | --- |
| worst rate px/s | 6404 | 5862 | **5411** | 5010 | **4739** | 4057 |

Travel, matched per pose: **302.0px @844x390 … 681.5px @768x1024**. Settle: **0 running
animations** on the sheet's ancestor path 800ms after the tap, at every pose and every clock,
both engines (24 cells × 2).

---

## 1 · The thirteen rows the charter set

**1 · B6's site half, defeated by a comment edit — CLOSED, two clauses.**
`selectorOf()` now reads the **masked** text (comments already spaces, offsets preserved) and
may not walk back across a `<style` boundary into a Vue template. The 17 prose-keyed bank rows
are gone: the bank re-keys to **80 real selectors**, e.g.
`src/assets/index.css :: opacity: 1\`. But \`scale(1)\` does not COMPUTE… :: cell-reveal`
becomes `src/assets/index.css :: .cell-reveal-enter-from .board-cell :: cell-reveal`.
Masking shuts the prose door; the **ORPHAN clause** shuts the only one left — a banked key that
vanishes from a file which still carries lengths is RED, because rewriting the rule head is now
the only way to hide a shortening. The escape is a ledger row (`cls: "MOVED"`, keyed, cited),
never an edit. Two real orphans exist on this tree and both are booked: `.solve-failure ::
refuse-shake` (bound to `var(--refuse-dur)`, so it carries no duration position) and
`.sparkle-icon :: all` (B4's narrowing to `filter`). The critic's **two-step attack is the
self-test's control, in both steps**, and both RED.
Third clause, unasked and load-bearing: `--bank` now reads the site floor from **BASE_REF**, not
from this tree. A bank written from the tree it guards banks the shortened value as the floor.

**2 · G-DOCK-BAND is a presence regex — CLOSED.** It now reads
`scripts/motion-dock-series.json`, the probe's own output, and checks five clauses, four
numeric: a series exists on this base with ≥2 clocks; every travel end in the docstring is
within 1px of a measured pose; the declared `ceiling:` equals the series'; the declared `pick:`
equals `dockPick()` computed from the readings; and the shipped rung is that pick or is ruling
1's 520 under a BALLOT row. **The critic's exact falsification (`293px` → `9999px`) is the
self-test's first negative control and REDs**, as do a falsified pick and a shipped clock that
is neither.

**3 · `npm run lint:bands` exits 1 on this tree — CLOSED as the charter's first option.**
`.github/workflows/ci.yml` sets `MOTION_LADDER_B8_OWNED: "1"` on the lane with its cite
(registry §2.1 gives curves to MOT-VERB) and its **retirement condition** (delete the line when
MOT-VERB's curve ledger lands). Verified both ways on this tree: bare **exit 1**, with the
variable **exit 0**.

**4 · The curve axis moved — CLOSED by reverting, and the count went UP.** Twelve assignments
reverted to HEAD's own curve term across nine files (`App.vue` back to `--ease-glassGlide`;
`index.css` `stroke`/`box-shadow` back to no curve; `DrawerTab` back to `ease-out`;
`GameControlPanel` ×4; `SolverErrorNote`; `scene.css`; `HandDrawnGrid`; `SheetWashiLabel`).
Only the LENGTH moved anywhere now. And B8 was under-counting: it read only the WRITTEN bare
keyword, so **an absent curve — the UA's `ease` by omission — was invisible**, which is how six
reds were "cured" by assigning a house curve. B8 now counts both. **10 → 21**, reported, not
hidden. §7(i)'s fixed-t sampler is NOT run and is not needed: no curve moves.

**5 · `gameCell.css` — CLOSED, handed back.** Both rows reverted; the file is byte-identical to
`74a2b5d9`. The finding travels as a GRAFT ledger row naming MRK-LIVE and chair §6.6:
*`marks-fade-in 250ms` ×2 → `var(--motion-note)`; 250 IS `note`; the edit belongs in §6's diff.*
**MRK-LIVE must name this graft in its return.**

**6 · The dock clock needs a criterion with an interior optimum — CLOSED, and it says something
uncomfortable.** The two pass-3 statistics fall monotonically with the clock at matched travel,
so minimising either picks the longest clock offered. Replaced by: **the shortest audited clock
whose worst RATE clears a declared ceiling** — shorter is better, the ceiling is the constraint,
the optimum is interior. The ceiling is a PARAMETER with its source, disposed by the owner
(U-10); nothing derives it here. At the wave's own threshold — 40px per 60Hz frame = **2400
px/s** — **no audited clock clears**, down to 4057 px/s at 700ms. That is a finding about the
THRESHOLD (or about a sheet that travels its own height), not about the length, and the rung
says so with `pick: 700ms (CEILING UNCLEARED)`. The ballot table below is what the owner
actually disposes.

**7 · B5 passes while sixteen elements tween — the clause is now EXECUTED at runtime.** The
roster is over RENDERED ELEMENTS, under `reduce` (witnessed by `matchMedia` on the page), and
resolves every survivor against the control's own roster: **62 → 16, inherited 16, UNACCOUNTED
0**, identical in both engines. All sixteen are inside one component (`button > svg > g`, the
DarkModeToggle's rest stack: `0.8s` on `.warp`, `0.3s` on the icon, eleven `scale, opacity`
pairs at `0.15s, 0.12s`). **The two numbers in the record are different facts and both stand**:
the family's ADMITTED `PRM-FALLBACK` class is 2, and the surface's pre-existing residue is 16.
Neither is this family's to cure and the record no longer lets them read as one number.

**8 · π is not proven — CLOSED, and it is now the strongest row in the pass.** Both arms load
the same `?board=` blob (built with the estate's own `e2e/wire.ts`), and the key is a
`TAG[n]` path from `body`, which cannot collide the way `TAG.class#id` did. Result at four
poses × two engines: **0 keys on one side only, maxDelta 0.000px, 0 moved rects, 0 paint
moves** — paint means `color`, `background-color`, font shorthand, `line-height` and tag name,
not rects alone. Pass 3's 17.22px was two builds dealing different puzzles; there is nothing
left of it. Coarse poses ran `hasTouch: true` with the regime WITNESSED on both pages of one
context (`pointer: coarse` true on both arms at 390×844, 768×1024, 844×390).

**9 · The R6 MOVED diff cannot be applied — CLOSED.** `instruments/R6-moved-rows.diff` names
`r0/r6-idiom-history/R6-census.md` lines **75** and **78** and quotes both `−` lines
**verbatim**, including law 4's real text (`No timing constant outside pencilConfig
(cardStepMs 440, boardFoldMs 520, chromeLeaveMs 200, the CELEBRATION budget)`), which pass 3
misquoted. PROPOSED only: a moved law is the chair's row (pass4 §1.3).

**10 · The exit ballot — STILL OPEN.** See gaps.

**11 · `rise: 600` ships with no flag — CLOSED.** `rise: 520`. Ruling 1's value is the default;
600 is the audition's alternative and is one line. The shortening is booked as the ratchet's own
**RETUNE** row citing pass4/CHAIR-RULINGS §1.3 — which is the rung half of B6 working: without
that row the gate REDs on `600 → 520`.

**12 · The six unrun instruments — PARTLY CLOSED.** The dusk fixed-t sampler is retired by row
4 (no curve moves). The r6 `law-probe` L3 row was landed by the CHAIR (pass4 §1.1), not by this
lane. The rest are still open: see gaps.

**13 · G-GUARD's self-test, B11's message, the bundle account, the commit shape.** G-GUARD has a
negative control (`SETTLE_GUARD_MS = GLIDE_MS + 200` returned) and it REDs. B11's
negative-negative no longer prints "RED (as it must)" while holding — the harness reads inverted
cases as **HELD**, and REGRESSED when an artefact does read as a clock. Bundle account below.
The commit shape is still one delta: see gaps.

---

## 2 · The owner's rows

### T9-B9 (proposed) — the dock's clock, `rise` 520 vs 600

The seam is not the ballot; the VALUE is. Both arms are one line apart in
`pencilConfig.ts:297`. The criterion makes the trade one number:

| ceiling (px/s) | ≥6404 | 5862 | **5411** | 5010 | **4739** | 4057 | <4057 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| pick | 440 | 480 | **520** | 560 | **600** | 700 | none clears |

**Choosing 520 over 600 is choosing 5411 px/s over 4739 px/s at the worst pose (768×1024,
webkit).** That is the whole cost, and it is 12% of a rate that is itself 1.7–2.3× the
threshold this wave has been scoring against since pass 2. **Firing default: 520** — the
chair's, and this tree ships it.

Frames, both from THIS build with only the clock substituted, read at the SAME wall clock
(300ms after the tap), webkit · 768×1024 · light · **coarse (`hasTouch`, `pointer: coarse`
witnessed true)**:
`frame-dock-520ms-webkit-768x1024-light-coarse.png` · `frame-dock-600ms-webkit-768x1024-light-coarse.png`.
**Said honestly: the two stills differ by about 9px of sheet travel and a still cannot show a
rate.** The frames prove the arms are the same board and the same layout; the audition table is
the evidence. If the owner wants this decided by eye it wants a moving surface, not a crop.

### The GRAFT to MRK-LIVE (chair §6.6)

`gameCell.css` rows 35 and 154: `animation: marks-fade-in 250ms` → `var(--motion-note)`, twice.
250 is `note` exactly. Reverted here, booked in the ladder's ADMITTED ledger as a GRAFT row so
B1 stays closed, and owed a line in MRK-LIVE's return.

### R6 rows MOVED (PROPOSED, the chair's to land)

`R6-census.md:75` (ruling 1, SCOPED to the desk pose with the dock's rung named) and `:78`
(law 4, re-cut to TRAVEL/WINDOW/CADENCE/POLICY on the measurement that the old wording is false
for twelve constants). Neither edited. Pass 3's proposal to re-cut §1.3's guard ribbon 240 → 250
is withdrawn from this lane and belongs to MOT-VERB now that curves went back to the verbs.

---

## 3 · The bundle account (the charter's row 13)

Whole `assets/` tree, gzip -9, against the control's dist:

```
files   38 vs 37   (+1: glyphRegistry.js — a rollup chunk split, not a new artifact)
CSS     +1,721 raw / +191 gz
JS      +1,226 raw / +628 gz
TOTAL   +2,947 raw / +819 gz      against a ceiling of +400 raw / +150 gz
```

Accounted, in raw bytes: the seven `@property` registrations measured in the built CSS are
**502 bytes**; **57** `var(--motion-*)` reads in the built CSS replace literals of 5–6 bytes
each, which is about **+800**; together ~1,300 of the CSS's 1,721. The JS carries
`MOTION.rungs` + `characters` + `settleGuardMs`, `motionRungsCss` + `publishMotionRungs`,
`glideMsFor`, `FLIP_GLIDE_ANIM_ID` and the per-run duration — and an extra chunk boundary.
**The ceiling is missed in both units and this pass did not pay it down; it is smaller than
pass 3's (+2,774 / +808 was measured before the curve assignments came out, and taking them out
moved the figure the wrong way by ~170 raw, which is the registration's own cost being visible
rather than hidden in a curve token).** Stated, not excused.

---

## 4 · Gaps, named — the hard parts first

1. **The exit ballot is STILL UNDECIDED.** `app-exit-last-rect.diff` (pass 3's) is not built
   into a second dist and §7(h)'s three numbers are not measured. The exit's rest geometry is
   still pass-2's reading on a stale dist (145.49 / 145.77 and 319.10 / 324.02).
   G-EXIT-MIRROR stays RED and the ballot cannot go to the owner. This is the same
   elegant-reduction tell the critic named and it is still true: a fifth build and a fifth
   server. **I chose π, the PRM clause, the ratchet and the dock criterion over it, and the
   exit is the cost.**
2. **The ceiling is a parameter, not a finding.** The criterion has an interior optimum only
   once the ceiling is fixed, and nothing in this pass derives it. The wave's own 2400px/s is
   unreachable by any clock at this travel, which means the pass-2 `excess area over 40px`
   statistic has been scored against a threshold this gesture can never meet. **Either the
   threshold is wrong or the sheet's travel is the subject.** Not settled here.
3. **B8 is red at 21 and the lane carries an escape variable.** Honest, cited, retirement
   stated — but a gate held open by an env var is a gate held open. Fold order: this delta
   first, MOT-VERB's curve ledger second, the variable deleted in the same commit.
4. **The chromium travel spread.** Per-pose travel varies 24–57px across the six rounds in
   chromium and **0.00px in webkit**. That is the sampler's start latency against the tap, not
   a layout difference (webkit's identical readings prove the layout). The series banks the
   full excursion per pose and records the spread; the rates are unaffected (they are
   per-grid-step), but a matched-travel claim in chromium is weaker than webkit's.
5. **Still not run**, each a real hole: the 15-gesture frame trace at 1× (§7 k), theme flips ×6
   at 4× (§7 l), r6's `hue-census.mjs`, r1's `heading-voice.spec.ts`, r3's `wobble.probe.ts`.
   r6's `law-probe.mjs` is the chair's act this pass, not this lane's.
6. **Three commits are still ONE delta.** §4 asks ≤3 / ≤22 / ≤16 files; the tree carries 43
   modified + 3 untracked, uncommitted.
7. **The bundle ceiling is missed** (§3), and this pass moved it the wrong way by ~170 raw.
8. **`npm run knip` does not exist as a script** in this tree (`npm error` on the name); pass 3
   reported "knip 0" and this pass could not reproduce that invocation. Reported rather than
   quietly dropped.
9. **The two ballot frames are weak.** ~9px apart; a still cannot show a rate. Named in §2.
10. **The orphan clause has a cost nobody has paid yet.** A legitimate selector rename in any of
    the 80 banked sites now REDs until a MOVED row is written. That is the discipline working,
    but the next lane to rename a rule head will meet it, and this pass has not measured how
    often that happens.

---

## 5 · Instruments, and what MOVED

Under `instruments/` — all PROPOSED, none applied to a frozen path:

| instrument | status |
| --- | --- |
| `dock-audition.spec.ts` | **MOVED** — replaces pass 3's `dock-band.spec.ts`. Its subject moved: one build instead of two, the clock substituted at `Element.prototype.animate` for `useFlipGlide`'s exact signature, six rounds, and a rate on a resampled 60Hz grid instead of px-per-sample. |
| `pi-rects4.spec.ts` | **MOVED** — replaces pass 3's `pi-rects.spec.ts`: pinned board, structural key, paint properties. |
| `prm-roster4.spec.ts` | **MOVED** — replaces pass 3's `node-and-prm.spec.ts` roster half: rendered elements, and the class-closure clause executed against the control's roster. |
| `frames4.spec.ts` | new — the ballot's two frames. |
| `board.ts`, `pw.config.mts` | the pinned board and the lane's scratch config (deleted from the worktree at return). |
| `R6-moved-rows.diff` | **re-cut** — names its file and quotes it verbatim. |

`scripts/motion-dock-series.json` is a PRODUCT file, not evidence: it is what G-DOCK-BAND reads,
and it is written by the instrument, never by hand.

A statistic this pass had to throw away, banked as a trap: the first cut of the audition took
px/s between raw rAF pairs, and a sub-millisecond pair read **137,787 px/s**. A rate needs a
time base it does not share with the sampler. The readings under `readings/` are the resampled
run; the raw-pair run is not banked, because it measured the instrument.

## 6 · Frames

Two, both replacements of nothing: **MOT-LADDER banked ZERO frames in pass 3** (its README
§8: "Zero frames banked"), so this family's own allocation is unspent and the wave's cap is not
touched by these. 84.5 KB and 84.9 KB, each naming engine · theme · viewport · pointer class in
its filename.

## 7 · Replay route

None. The chair's ruling: continuing lanes ADVANCE IN PLACE in their pass-3 worktree, with the
pass-3 record preserved as `pass3/prototype/MOT-LADDER/pass3.diff`. `git -C <work> diff --stat`
at open read 44 modified + 2 untracked, which agrees with the pass-3 README's file list; nothing
was replayed, reset or rebased. At return: 43 modified + 3 untracked (`gameCell.css` returned to
`74a2b5d9` as the graft, `scripts/motion-dock-series.json` added).

## 8 · Incidents, self-declared

1. A scratch Playwright config under the scratchpad **cannot resolve `@playwright/test`** — the
   LAWS say so and this lane hit it anyway, losing one battery run. Configs and specs moved to
   `<work>/web/frontend/.mot-ladder/`, deleted at return.
2. `playwright test --project chromium <spec>` parses the spec filter as a second PROJECT.
   `--project=chromium` is the form. One battery void.
3. `cmd | tail` ate every exit code in the first static battery (the standing trap, met again).
   Rewritten to redirect, capture `$?`, then tail the file.
4. vitest 4.1.11 has no `basic` reporter; `--reporter=default`.
5. The first audition's rate statistic measured the sampler (see §5). Re-run, both engines.
6. The first PRM roster counted elements with a nonzero `animation-duration` and
   `animation-name: none` — 1,174 instead of 16. Guarded and re-run on both engines; the two
   engines then agree exactly.
