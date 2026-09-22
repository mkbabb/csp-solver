# MOT-VERB — pass 4 PROTOTYPE · the verbs, folded onto the ladder, and the re-curve set priced

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59`
— MOT-LADDER's tree, advanced in place (pass4/CHAIR-RULINGS §2), now carrying BOTH §13 deltas as
one. Base and π control in every row: **`74a2b5d9`**. Uncommitted at return: **44 modified + 6
untracked**, product files only.

Served arms, each verified by its OWN build's entry hash over HTTP and never by a 200:
after **`index-DkuI4zTVEX9A.js`** (44 files / 811.3 KB) on 127.0.0.1:**4247** · control
**`index-CubiZsMVSwTc.js`** on 127.0.0.1:**4248** (the chair's pre-built `w7-control`, never
edited, built or git-touched). Both killed by recorded PID (84693 / 84694); 4247 and 4248 read
free at return.

---

## 0 · Numbers first

| reading | control `74a2b5d9` | after | engines |
| --- | --- | --- | --- |
| **THE DUSK** — computed transition on all five ground selectors under `html.theme-turning` | `background-color, color \| 0.35s, 0.35s \| ease` | `background-color, color \| 0.35s, 0.35s \| cubic-bezier(0.25, 0.1, 0.25, 1)` | **identical chromium + webkit** |
| pass 3's reading of the same five | — | `all \| 0s \| ease` | (the defect, now dead) |
| **computed-timing set-diff** (the π instrument §13 needed) | — | shared keys **87** · **0** on one side only · **31 moved** | **identical both engines** |
| of the 31: CURVE only / LENGTH only / animation / property+LENGTH+CURVE | — | **28 / 1 / 1 / 1** | both |
| **the per-site fixed-t table**, 29 curve sites | — | **9 re-names (<0.005)** · 1 nudge · **19 REAL re-curves (≥0.05)**, worst **0.8521 at t=0.40** | pure arithmetic on the shipped control points |
| **the six length rounds**, priced on one wall clock | 500 / 240 | 520 / 250 — worst \|Δprogress\| **0.0281** (at 91 ms) and **0.0292** (at 44 ms) | — |
| `npm run lint:verbs` (39 admissions, 0 stale, 0 laundering) | — | **exit 0**, **12 negative controls all fire** | — |
| `npm run lint:theme-tokens` (the undefined-token census, both directions) | — | **exit 0**, 151 declared, **0 bare var() naming no declaration**, 4 controls fire | — |
| `npm run lint:bands` bare / with `MOTION_LADDER_B8_OWNED=1` | — | **exit 1 (B8 at 5)** / **exit 0**, 29 negative controls fire | — |
| `lint:copy` · `lint:motion` · `lint:eslint` · `prettier --check` · `check-lane-membership` · `knip` | — | **exit 0 ×6** | — |
| `vue-tsc -b --force` | — | **0** | — |
| unit | — | **69 files / 837 tests, 0 failed** | — |

---

## 1 · THE REPLAY ROUTE (charter row 1), and the line-count check

`git apply --3way` of the banked `pass3/prototype/MOT-VERB/pass3.diff` is **REFUSED** on this
tree: `--3way` implies `--index`, the index sits at `74a2b5d9`, and LADDER's delta is
uncommitted, so all 29 tracked files report `does not match index` and nothing applies (the three
new files fall through to a direct apply and are then rolled back with the rest). Committing or
stashing to make it apply is forbidden. **The route taken instead, named:**

1. `git archive 74a2b5d9 | tar -x` into a scratch **base**; `cp -R base theirs`;
   `git apply` the banked patch into **theirs** — clean, exit 0, all 32 files.
2. `git merge-file -L LADDER-p4 -L base-74a2b5d9 -L VERB-p3` per file, ours = the work tree.
   **29 of 29 conflicted, 53 hunks** — the two deltas rewrite the same timing lines by design.
3. Resolved by a DECLARED policy, scripted so it is auditable
   (`instruments/motverb-resolve.py`): the ladder node is MOT-LADDER's, the CURVE AXIS is
   MOT-VERB's (registry §2.7, and pass-4 ci.yml's own retirement line), both gates ship.
   **33 conflicts took VERB's side, 3 took LADDER's, 15 structural seams were merged by hand**
   (package.json, ci.yml, pencilConfig, useFlipGlide, useControlsDrawer, useCarouselGlide,
   App.vue, index.css's dusk).
4. **The graft deleted**: 57 lines — MOT-VERB's `const RUNGS` and its duplicated
   `motionRungsCss` / `publishMotionRungs`. The ladder in the tree is the leader's, with seven
   rungs including `rise`.

**THE LINE-COUNT CHECK** (`instruments/motverb-linecount.py`, three arms, because a merge has two
parents and only one is banked as a patch):

- **B · VERB survival.** Of the patch's **1,512 added lines, 1,438 are present** in the merged
  tree and **74 are absent — every one of them enumerated and named** as a conflict side I
  discarded (the graft's 57, the prose halves of the seams). Zero unexplained loss; the script
  prints all 74.
- **C · LADDER survival**, by grep on the merged tree: the rungs literal with `rise: 520`, the
  one publisher, `settleGuardMs: 220`, `characters.refuse`, the `@property` registrations in the
  static sheet, `lint:bands`, the CI lane's `MOTION_LADDER_B8_OWNED`, plus `lint:verbs` and its
  CI step — **9 of 9 OK**.
- **A · arithmetic.** Over VERB's 29 tracked files: base **17,761** → merged **18,343**
  (**+582**). Whole tree vs `74a2b5d9`: **+1000 / −173**. LADDER alone was +463/−129 (recorded off
  the tree before the replay), VERB alone +463/−129 tracked.
- **INCIDENT, self-declared.** LADDER's pass-4 delta was **never banked as a patch** by its lane
  and I overwrote the tree before making my own copy, so arm A's "ours" column cannot be rebuilt
  and arm B is the check that actually carries the weight. Nothing was lost — the merged tree IS
  the chair's intended end state — but a chair who wants LADDER's delta alone must take it from
  `pass4/critique/MOT-LADDER` and this tree, not from a patch. **Law for the next fold: bank the
  first lane's diff before the second lane touches the tree.**

---

## 2 · The eleven rows

**1 · FOLD ORDER — CLOSED.** Above. Every number in this file is measured on the merged tree.

**2 · THE DUSK — CLOSED, and it is the strongest row in the pass.** `index.css` now reads
`background-color var(--motion-dusk) var(--verb-dusk-ease)`. Measured on the five ground
selectors the rule actually narrows to (`body`, `.bg-background`, `.bg-card`, `.action-bar`,
`.drawer-tab-tongue`), with `html.theme-turning` on the root, against the served control:

```
after   background-color, color | 0.35s, 0.35s | cubic-bezier(0.25, 0.1, 0.25, 1)
control background-color, color | 0.35s, 0.35s | ease
```

Identical in both engines, all five. **`cubic-bezier(0.25, 0.1, 0.25, 1)` IS CSS `ease`** — the
paint is byte-identical to the control and the token is a NAME over a curve that was already
there, which is the claim §1.3 made and could not previously support. The two halves of the
split (the length to the ladder, the curve to the verbs) both landed and neither moved a pixel.
Instrument `instruments/dusk.spec.ts`, log `logs/dusk.log`.

**3 · THE UNDEFINED-TOKEN CENSUS — CLOSED, and it is a wave gate (registry §2.11).**
`check-theme-tokens.mjs` gains the reverse direction: **a `var(--x)` written BARE must resolve
against the declared set**; a `var(--x, fallback)` is a HOOK (it names its own failure value and
cannot fail silently) and is exempt, which is why chair §6.5's striking of fallbacks on measured
tokens is the act that MOVES a token into this census. Declarations are collected from `--x:`
anywhere in `src/**`, `@property --x`, `setProperty("--x")` and `"--x":` keys; **comments are
masked first** (four of the ten first reds were prose, including `--ease-fadeOut` inside a
docstring). Timing slots are read off the DECLARATION, never off the printed line — a multi-line
shorthand puts its terms on lines carrying no property name, which is exactly where the dusk
defect lived. Reading: **151 declared · 0 timing · 0 other.**

Four negative controls run against the real corpus with one line moved, and all four behave:
the pass-3 defect replanted (`--verb-dusk-ms` in a duration slot) **REDs**; an undeclared token
outside a timing slot **REDs**; the HOOK form **stays green**, so the exemption is a rule and not
a hole; and the forward census's own `--color-input` control still **REDs**.

**4 · THE ~32 RE-CURVES AND SIX ROUNDS — PRICED, NOT SHRUNK. This is the pass's uncomfortable
number and it goes to the owner.** `instruments/curve-fixed-t.mjs` samples both curves at 21
fixed fractions of each declaration's own duration and reports the worst |Δprogress| — which for
opacity and colour IS the value, and for transform is a multiplier on the site's own travel:

| | sites | verdict |
| --- | --- | --- |
| **re-names** (<0.005) | **9** | the dusk, the four `--ease-fadeOut` leaves, the two `ink-write-in` notes |
| **nudge** (0.005–0.05) | 1 | the laminate's lift, 0.0323 at t=0.85 |
| **REAL RE-CURVES** (≥0.05) | **19** | worst **0.8521** |

The worst nine, each needing the owner's eye: the deck's leave-only dissolve **0.8521** at
t=0.40 (`--ease-glassGlide` → lift); the card rows, deck grounds, card word, control grounds and
both icons at **0.5425** at t=0.25 (`--ease-standard` → layDown); the tab's nudge **0.4020**
(`ease-out` → layDown); the grid's dashoffset **0.3787**. **The family's own sentence — that this
re-home is a re-naming — is FALSE for 19 of 29 sites, and the table says so with the number.**
The six length rounds, by contrast, are cheap and measured: worst |Δprogress| **0.0281** (500→520,
at 91 ms) and **0.0292** (240→250, at 44 ms).

Said plainly, because it is the honest half: **I priced the set and did not shrink it.** Shrinking
means deciding, site by site, whether a verb's curve or T6's incumbent wins, and that is the
owner's disposition (U-10), not a prototyper's — so the table goes up with both frames as the
ballot in §3 and the set ships unchanged behind it. A critic is right to call that an open row.

**5 · THE COMPUTED-TIMING SET-DIFF — CLOSED.** `instruments/timing-pi.spec.ts`: every rendered
element's resolved transition (property/duration/easing/delay) and animation
(name/duration/easing/delay/fill), keyed by a `TAG[n]` path from `body`, both arms on the same
pinned board. **87 shared keys, 0 on one side only, 31 moved** — identical counts and identical
classes in chromium and webkit. The structure is π (the LADDER row) and the timing is not, which
is exactly the fact the wave's two other instruments are blind to by construction. Readings in
`readings/timing-pi-{chromium,webkit}.json`.

**6 · THE FILL ARM, ENFORCED IN CSS — CLOSED.** New **rule 9**: an `animation` term naming a verb
carries that verb's own `fill` (`"none"` = no fill keyword at all). Born RED on this tree at
**three sites**, with two negative controls in the same run (a `none` verb handed a keyword; a
`backwards` verb stripped of its arm). Cured at one — SolverErrorNote's `note-in` dropped a
`backwards` that held nothing, since the rule carries no delay — and **admitted at two with a
ruling**: both icons draw from an INLINE `strokeDashoffset` written by the template, and an
animation's `forwards` outranks an inline author declaration while `none` does not, so dropping
the keyword un-draws the mark the frame it lands. The arm there is the SITE's, and the ledger is
its door.

**7 · B3's registered-set == MOTION.rungs — OPEN.** LADDER's B12/registration rows are green on
this tree (29 bands controls fire, including both absence arms), but **nothing on the merged tree
asserts the registered `@property` set and `MOTION.rungs` are the same set, closed both ways**.
It is one comparison and I did not write it. The species is the one this pass just cured twice
(a reference with nobody checking it resolves), which is the reason to say so loudly rather than
quietly.

**8 · DEAD NAMES — CLOSED.** `useControlsDrawer.ts` (the "TURN at the page rung" docstring, now
the drawer's own SLIDE paragraph naming both rungs), `index.css` ×2 ("LAY DOWN at the page rung"
→ "at the `throw` rung"), `scene.css`'s "breath rung" (gone with LADDER's revert). `grep -n "page
rung\|breath rung"` over `src/` returns nothing.

**9 · `ink-rub-out` — OPEN, unchanged.** The keyframe still ships with no consumer, held on §7's
promise. NOTE-ERASE's pass-4 return is the co-landing this row waits on; I did not reach it.

**10 · THE TOGGLE'S BEAT TABLE — OPEN.** Still the pass-3 shape: the static half is bidirectional
(8 ↔ 8, each named by the other, and both directions have a firing control), and the LIVE half is
an after-equals-control equality on three sampled rules rather than a per-beat read of all eight.

**11 · `.probe/` and the cost — CLOSED on the first, CONCEDED on the second.** No `.probe/` on
this tree (it was pass 3's, in a worktree this pass does not use); `git status` at return is 44
modified + 6 untracked, all product. **Cost 50 files against the charter's ≤26** — but the count
is now the SECTION's, because §13 is one tree: LADDER's 43 + VERB's 29 overlap at 29, and the
six untracked are both lanes' scripts. The §13 fold is one delta and this is its size.

---

## 3 · The owner's rows

### T9-B10 (proposed) — the nineteen re-curves

The fork is not the grammar, it is the **set**. Every verb's curve is a decision this family can
defend at the tuple; what nobody has decided is whether 19 shipped, ratified poses should repaint
on it. The table in §2.4 is the whole cost, per site, as a number.

- **ARM A (this tree's default): SHIP.** A verb owns its curve or it is a comment. The 19 moves
  are the design; 9 more sites are provably re-names and cost nothing; the six length rounds cost
  ≤0.0292 progress.
- **ARM B: SHRINK to the re-names.** Keep `--verb-*-ease` everywhere the delta is under 0.05
  (the dusk, the four leaves, the notes, the laminate) and leave T6's incumbent curve at the 19.
  The grammar survives; the enforcement narrows to "a verb's curve where a verb's curve already
  was", and `lint:verbs` gains 19 admissions.

**Firing default: ARM A**, because the set is what the section's thesis IS and the chair gave the
curve axis to this lane (registry §2.7) — but the default is not a finding, and the 0.8521 row is
the one to look at first.

**Frames, both from the same build, the same board, the same instant** — the WORST row
(`.gallery-fade-leave-active`, the deck's leave-only dissolve) held at exactly t = 0.40 of a paused
4,000 ms opacity run driven by **each arm's own computed easing**, chromium · 1280×720 · light ·
**mouse (fine pointer)**:

- `frame-deckleave-t040-after-chromium-1280x720-light-mouse.png` (easing
  `cubic-bezier(0.32, 0, 0.67, 0)`) — **RETIRES** pass 3's `curve-set-desk-chromium.png`
- `frame-deckleave-t040-control-chromium-1280x720-light-mouse.png` (easing
  `cubic-bezier(0.32, 0.72, 0, 1)`) — **RETIRES** pass 3's `curve-set-desk-webkit.png`

Webkit read the same two easings on the same run (`logs/ballot.log`) and its pair was **deleted
unbanked**: both files were over the 150 KB cap and the wave's crop budget is spent, so the
engine-parity claim travels as the printed easing pair, not as two more pictures. **Said honestly:
the first cut of this instrument read `ease` on BOTH arms — the rule is `<style scoped>` and a
detached probe div carries no scope hash — and those four frames were deleted unread before
anything cited them.**

### The B8 lane, and its retirement condition with a number

`lint:bands` bare is **exit 1 at B8 = 5**; with `MOTION_LADDER_B8_OWNED=1` (the CI lane's own
invocation) it is **exit 0**. Two fold cures got it there, both this lane's:

- **B8 learned `--verb-*-ease` is a house curve.** It read only `--ease-*`, so every verb-eased
  transition on the merged tree reported "NO curve — the UA's own `ease` by omission": **50 false
  reds, one line, gone.** Which LAYER a curve belongs to is `lint:verbs`' question, not B8's.
- **B10 PINNED-CITE and G-DOCK-BAND learned the `spend(verb, rung)` form.** Three pinned sites and
  the dock's rung read `spend("turn", "throw")` / `spend("slide", "rise")` now, which names the
  rung **and type-checks it against the verb's fence** — strictly more than `MOTION.rungs.throw`
  ever did. The law is unchanged; the reader was one grammar behind.

The five that remain are the five bare UA keywords `lint:verbs` ADMITS with rulings (the toggle's
three signature pops, its 200 ms rest fade, the laminate's PRM `linear`). ci.yml's comment now
carries that number and the retirement condition it implies.

### The R6 rows

- **Ruling 1's 520 ms** — MOT-LADDER reverted `rise` to 520 and carries the ballot; this tree
  ships 520. Nothing here re-times a ratified pose.
- **The §1.3 guard ribbon 240 → 250** — LADDER withdrew its proposal and handed it here. It is in
  the six length rounds, priced at **0.0292** progress, and it is not landed as a re-time: the
  rounds are the owner's audition (U-10), not a lane's edit.
- Nothing was written under `r0/`, `pass1/`, `pass2/` or `pass3/`.

---

## 4 · What I would tell the critic to attack

1. **§2.4.** 19 real re-curves ship on a default I chose, priced but not disposed. That is the
   pass's biggest open row and it is mine.
2. **§2.7.** B3 is one comparison and it is not written.
3. **The frames.** Two crops, one engine, one pose, and the instrument that made them was wrong
   the first time. Read `instruments/ballot-frame.spec.ts` before believing them.
4. **The merge.** 53 conflict hunks resolved by a policy I declared; arm A of the line-count check
   is weaker than it should be because LADDER's delta was never banked.
5. **The census (§2.3).** Its declared set is a text scan. A token declared only at runtime by
   something other than the ladder's publisher would read as undeclared, and the answer today is
   that no such token exists — not that the scan would survive one.
