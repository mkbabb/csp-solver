# NOTE-ERASE · pass-4 prototype — THE CLOCK BECOMES A RULE

Worktree `.claude/worktrees/wf_f72f3b5a-83a-47`, **advanced in place** on the pass-3 diff (base
`74a2b5d9`). Nothing committed. Prototype dev server `127.0.0.1:4248`, HEAD control (the shared
read-only tree `w7-control`, sha1-verified at `74a2b5d9`) dev-mode on `:4247`, the lane's BUILT
dist on `:4245` — all three killed, PIDs recorded, band re-scanned.

## The replay route

**None.** The chair banked pass 3 as `pass3/prototype/NOTE-ERASE/pass3.diff`, so the tree moved
forward in place per pass-4 CHAIR-RULINGS §2. `git -C <work> diff --stat` at open read the twelve
files the pass-3 README names plus its two untracked tests — **agreed exactly**, no line-count
check needed because nothing was replayed. One patch WAS applied: this family's own
`check-ink-pressure.mjs` hunk, re-landed from
`pass3/prototype/NOTE-ERASE/instruments/gateNote-handoff-to-NOTE-LEDGER.diff` with `git apply
--3way` (clean, 99 lines, then `git restore --staged` so the critic reads one working-tree diff).

## Numbers first

### G16 re-cut — the honest clock is a RULE, not a fence around one state

A `transition: color 350ms linear` is PLANTED on bare `.margin-note-ink` (the exact act a palette
lane would commit) and the clock is read during the leave. `data-note-age` is now `fresh` or
`settled`, never absent, so the compound selector `.margin-note-ink.note-leave-active[data-note-age]`
covers both ages.

| reading, under the plant | chromium | webkit |
| --- | --- | --- |
| FRESH leave · `transition-duration` | **0s** | **0s** |
| FRESH leave · node absent | **149.7 ms** | **166 ms** |
| SETTLED leave · `transition-duration` | **0s** | **0s** |
| SETTLED leave · node absent | **166.8 ms** | **177 ms** |
| **BORN-RED** (`data-note-age` stripped, same page, same act) · `transition-duration` | **0.35s** | **0.35s** |
| **BORN-RED** · node absent | **368.3 ms** | **379 ms** |
| `animation-name` throughout | `ink-rub-out, ink-rub-out-fade` | same |

The born-RED is pass 3's own shape (a fresh note carried no attribute): the plant wins, the drop
clock stretches by a rung and a half, and the gate catches it.

### G7 — row E, as declared, because the registration left the publisher

`@property --motion-*` ×6 moved to the first STATIC stylesheet (`assets/index.css`,
`initial-value: 0ms`, `inherits: true`); `publishMotionRungs()` emits only the values.

| after deleting `style[data-motion-rungs]` | pass 3 (row I) | pass 4 (row E) |
| --- | --- | --- |
| `--motion-whisper` computed | `""` | **`0s`** (chromium and webkit) |
| `--motion-note` computed | `""` | **`0s`** |
| `animation-name` during the leave | `none` | **`ink-rub-out, ink-rub-out-fade`** |
| `animation-duration` | — | `0s, 0s` |
| node absent | 19.5 ms | **16.9 ms** chromium / **39 ms** webkit |
| distinct clip states | 1 | **1** |

The shorthand stays valid and the verb still names itself; it simply has no length, so the note
vanishes on one frame — which is the defect this family was cut to cure, and is therefore a
failure that fails visibly (the @property law's third clause).

### G12 — the painted witness, at eight beats plus one (1,125 ms)

| verdict | is-quiet | age at settle+1 | computed ink | PAINTED, matched to the computed colour | both engines |
| --- | --- | --- | --- | --- | --- |
| gold, after a real 4×4 solve | **true** (R1) | **`fresh`** | `rgb(140,105,29)`, unchanged from landing | **4.97:1** on `rgb(253,253,252)`, match distance 0 | yes |
| teacher-red refusal | false | **`fresh`** | `rgb(208,42,82)`, unchanged | **4.87:1** on `rgb(251,250,249)` | yes |
| CONTROL, kind `state` (the hint) | false | **`settled`** | `rgb(38,38,38)` → `color(srgb .15 .15 .15 / .68)` | **5.17:1** | yes |

The control is what proves the clock ran: the kind that DOES age reached the quiet rung on the
same wait and changed colour, while neither verdict moved. The gold is read off
`CompletionVignette`'s own node, and the read is MATCHED to the computed colour rather than taken
as the box's darkest pixel — the vignette floats over the board, so the extreme reads 12.78
(chromium) / 19.45 (webkit) off the grid's ink and would have over-reported the grade's contrast.

### G13 — the built half

`vite build` in the worktree with its own cacheDir: **`index-onAA0yf2gPvl.js`**, 37 files in
`dist/assets`, 912 KB. The main tree's dist is untouched (`index-9rZPzI5DEcpe.js`), so W8 §8.1's
freeze held. Served on `:4245` and verified by that hash, never by a 200.

- `e2e/filter-census.spec.ts` against the built dist: **12/12 green, both engines** — G3.1 (the
  live census equals `filterBudget.ts` exactly, area and all), G3.2 (no retained fill supplies a
  transform; the source `forwards|both` set equals `FILL_ALLOWLIST`), G3.3 (the coarse regime
  below 1024), G3.5 (no `:hover` mints a filter, board and picker regimes).
- `playwright-golden.config.ts` against the same dist: **4/4 green** (cell, grid corner, logo
  wordmark, toggle crest dark). No golden re-minted.

### G17 — the peer arm, on the wire, both engines

The pass-2 two-page local-wire room (`c-peer.probe.ts`, `?wire=local`), 56.5 s chromium / 1.9 min
for the pair. Every row proves DELIVERY (`landedOnPeer`, `delivered`, the cell's value before and
after) before it reads the note.

| row | the peer's act | the note after | both engines |
| --- | --- | --- | --- |
| elsewhere | a digit outside the because set | **stands** (`9 goes nowhere else in this row`) | yes |
| named cell | a digit in the cell the hint names | **retracted** (`""`, no ink) | yes |
| because member | a digit in a DISTINCT member of the because set | **retracted** | webkit only (see gaps) |
| peer reveal | the peer reveals the named cell | **retracted** | yes |
| refusal | a peer delivers while a refusal stands | **refusal stands** (`that's a given clue`) | yes |

### π against `74a2b5d9`, and the strip's own reserve

Both arms deal the SAME board — `?board=` through the estate's own `encodeSudoku`, because an
unpinned `?size=` deals a random board per arm and the first run read a 92.84 px (390) / 105.44 px
(1280) delta on `.margin-note` that was two different sentences, not a layout move. Pinned, both
engines report identical numbers. Every key reports tag, box, `font`, `line-height`, `color` and
`background-color`; **the paint-and-tag delta list is EMPTY at every key, both widths, both states.**

| | 390×844 | 1280×800 |
| --- | --- | --- |
| board · controls · note, empty and fresh | **0 · 0 · 0** | **0 · 0 · 0** |
| `docH`, empty and fresh | **0** | **0** |
| strip, EMPTY | 0 | **+2.83 — DECLARED** |
| strip, FRESH | 0 | 0.02 |
| prototype strip, empty → fresh → settled | 20.8 → 20.8 → 20.8 | **23.63 → 23.63 → 23.63** |
| control strip, empty → fresh | 20.8 → 20.8 | **20.8 → 23.61 (+2.81)** |

The family's own sentence is now true rather than struck: `min-height: calc(var(--type-body) *
var(--type-leading-caption))` makes the reserve the line it reserves, so the strip does not move
when the voice speaks at ANY width. The price is the declared row: at 1280 the RESTING strip is
2.83 px taller than HEAD's, and `docH` is 0 at both widths in both states, so nothing below the
strip moves. That trade is the owner's if he wants it the other way (fork F-ERASE-1 below).

### Mechanical estate — ten gates, bare, exit 0

`lint:copy` (137 files, **0 em dashes, 0 unadmitted, 0 admitted**, lexicon 25) · `lint:motion` ·
`lint:ink` (which now carries this family's own `gateNote` again) · `lint:live-regions` ·
`lint:theme-tokens` · `lint:theme-selectors` · `lint:sleep` · **`lint:knip`** (NOTE-LEDGER's red;
green here) · `check-copy-register.mjs` bare · `check-ink-pressure.mjs --self-test`.

`check-ink-pressure`'s printed note row: **settled note 5.19 light / 6.12 dark ≥ 4.5**
(`--ink-press-quiet` on `--color-background`; **17** rung reads in `src/`, derived not written).

`vue-tsc --noEmit` exit 0. **vitest whole estate: 70 files / 849 tests, all passing** (the unit
floor is 729).

### The four copied r0 instruments — RUN, with OUT re-pointed

| instrument | rows | verdict on THIS tree |
| --- | --- | --- |
| `marks.probe.ts` **R3-d** (the hint note vs ten non-board acts) | 2 passed, both engines, 2.0 min | the ten acts read; logs `logs/hintnote-*.json` |
| `marks2.probe.ts` **R3-g** (the hint note vs five board-changing acts), reader AMENDED | 2 passed, both engines, 47.8 s | the amended reader separates the three states: `second H` / `deal` / `fill forced` → `text ""`, `age null`, not leaving; `clear` → `the board is clear`, `age settled`; `solve` → `solved it!`, `age fresh` |
| `budget.probe.ts` **R3-h** (the π-guard) | 2 passed, both engines, 14.1 s | **live filter total 9 at 4×4, 9×9 AND 16×16**, both engines, over exactly four rows (`g.boil-pose` 4 · heart 2 · toggle 2 · sparkle 1); ghost `filter: none`; the budget does not grow |
| `wobble.probe.ts` **R3-a** (the ring wanders in the grid's band) | **2 failed**, both engines | RED, as at HEAD: grid σ **1.443 px** (band 0.722–2.886), frame σ 1.145, **ring σ 0.092** (`ringInBand: false`), wash σ 0 (`washInBand: false`). §5/§6's cure, not §7's; this diff touches no ring |
| `heading-voice.spec.ts` (§1's born-RED) | **4 failed**, both engines, both cells | RED, as at HEAD: *the card names 8 control groups in 3 voices* · *only 2 of 8 group names are document headings* · *group name 20.35 px against the option chip's 20 px* (ratio **1.0175** vs the 1.23 floor). §1's cure, not §7's |

Two of the five are RED and both are r0 instruments written to be red until another section's cure
lands. Neither subject is in this diff; the point of running them is that this family did not
move them, and the numbers say so.

### R6 hue census

The r0 instrument, copied with its SUBJECT re-pointed at this worktree and its OUT into
`census/`: `diff` against `r0/r6-idiom-history/hue-census-HEAD.txt` is **empty — byte-identical.**
R6 row **UNMOVED**; this family mints no colour.

## Every born-RED, run on THIS tree, with its control in the same run

1. **G16's fence** — `data-note-age` stripped off the leaving node: `0.35s` and 368.3/379 ms,
   against `0s` and 149.7/166 ms as built.
2. **G7's publisher** — the `<style data-motion-rungs>` node removed: every rung falls to its
   registered `0s` and the note goes on one frame.
3. **The cross-channel cancel** — `clearBeat("voice")` put back inside `clearRepeat()` (pass 3's
   one-Set behaviour) and the new unit row FAILS on the assertion it exists for
   (`readings/bornred-crosschannel.log`); restored, it passes.
4. **`gateNote`** — `check-ink-pressure --self-test` exercises both halves (`note-floor`: the
   quiet rung at 55 % clears on the card and fails on the paper; `note-discovery`: the census told
   to expect more consumers than the tree has), exit 0.

## What changed in the diff, and why

- **`assets/index.css`** — six `@property --motion-*` blocks at the top level of the first static
  stylesheet. THE POINT: a registration emitted by the publisher it guards is no fence; deleting
  the publisher took the type with it and the born-RED fired as a mode nobody declared.
- **`pencilConfig.ts`** — `publishMotionRungs()` emits values only. The ladder block is unchanged
  and still bannered as §13's.
- **`MarginNote.vue`** — `data-note-age` is `fresh | settled`, never null, so the compound clock is
  a rule; `min-height` derived from the two tokens the voice reads; the "load-bearing half"
  sentence replaced with what the controls measured (the compound rule fixes the CLOCK, the rest
  pose fixes the POSE, both ship).
- **`GameBoard.vue`** — one beat handle PER CHANNEL (`margin`, `voice`); `clearRepeat()` cancels
  the margin's beat and nothing else; `onUnmounted` clears both. The `:802` comment no longer
  names a number this diff deleted.
- **`marginNote.motion.test.ts`** — G5 re-cut to PROVENANCE (the ladder is bannered §13's; the
  SFC declares no `--motion-*` and consumes three); G7's unit half asserts the publisher emits no
  `@property`; two new static rows (the age is never null; the reserve is derived).
- **`GameBoard.receipt.test.ts`** — the cross-channel row.
- **`scripts/check-ink-pressure.mjs`** — this family's `gateNote` hunk RE-LANDED (see G15 below).

## G15 — the handoff, decided

**NOTE-ERASE KEEPS ITS HUNK.** Registry §2.8 offers two arms and NOTE-LEDGER is in batch 4, after
this lane; a guard removed on the strength of a fold that has not happened is a guard removed. The
`check-ink-pressure.mjs` hunk is back in this diff and green bare with its self-test. If LEDGER
lands `gateNote` with the consumer string in the same fold, this hunk RETIRES — the two are the
same rows (`NOTE_QUIET`, `gateNote`, `gateNoteDiscovery`) and the fold takes one copy, LEDGER's,
with `.margin-note-previous` added to the consumer string. The diff is byte-identical to the one
banked at `pass3/.../instruments/gateNote-handoff-to-NOTE-LEDGER.diff`, so the fold is a delete,
not a merge.

## Gaps, every one — including the new ones

1. **NEW AND THE WORST ONE: G9's record arm was a RECT, not paint.** Pass 3 reported "a record
   under the park never empties, reads in the folded card at 300.18 × 11.21". At 1280 the ink's
   box is `x 137.89 · y 543.28 · 51.07 × 11.21` and **`.live-face-slot`'s `overflow: hidden` edge
   is at y 540.25** — the whole sentence is below the clip. `elementFromPoint` at the ink's own
   centre returns `game-card-paper`, and the crop shows the card's bottom edge with nothing under
   it. So the parked RECORD is announced (it is in the live region) and is invisible to a sighted
   reader at 1280. The family's "the park is a writer" claim survives for the READER; its visual
   half does not. NOT CURED here: the cure is either the strip inside the fold's clip or the
   record re-homed, and both move a §10/W2 surface this family does not own. Booked as a fork.
2. **The strip's +2.83 px at 1280 is a trade, not a free cure.** The growth is gone at every
   width; the resting reserve at 1280 is now 2.83 px taller than HEAD's. `docH` 0, nothing below
   moves, both engines. The owner may prefer HEAD's resting height with the growth — F-ERASE-1.
3. **G5's provenance row cannot see the stylesheet.** vitest answers a `*.css?raw` import with the
   empty string (the css pipeline takes the request first), and `node:fs` is untyped in `src/**`
   by design (`config-node.d.ts`'s argument). So the unit row asserts only the half it can see —
   the publisher emits no `@property` — and the static registration is asserted LIVE instead (row
   E, above). A wave-level home for "the registration is static and complete" would be
   `check-theme-tokens.mjs`; PROPOSED, not written, because it is §10's leader's block.
4. **The `becauseMember` peer row is vacuous on chromium.** That run's board had no hidden single,
   so `member: -1` and `distinctFromNamed: false`; webkit's board had one (member 78, named 51)
   and the row reads. The predicate is covered by seven unit rows at the seam either way. Closing
   it properly means pinning the peer room's board, which `c-peer.probe.ts` does not do.
5. **R3-d's `solve` round armed nothing** (`armed.text` empty), so that one act's row is vacuous;
   the other four read. Same class as pass 3's gap 8 — arming a hint is not guaranteed on every
   deal.
6. **The @property law's fourth clause is honoured only in the direction I could run.** The
   ablation runs on a host that DECLARES the token (`:root`, via the static registration) — good.
   I did NOT run the ablation on a tree where the registration is ALSO absent, because that is the
   pass-3 shape and it is already measured (row I).
7. **`MOTION.chromeLeaveMs: 200` and `MOTION.rungs.leave: 200` are still two homes for one
   number.** §13's to reconcile; it entered the estate through this diff and it is still here.
8. **The ladder is still a graft.** MOT-LADDER advances in `wf_f72f3b5a-83a-59` in this same
   batch; when §13's delta lands, the six `@property` blocks in `index.css` and
   `publishMotionRungs()` are §13's rows and this family's diff should carry neither. The fold
   order is stated below.
9. **The strip's landscape cell (844×390, 812×375) is unmeasured by this lane.** W2 §2.2 governs
   it and §7's surface is the board's margin, not the control estate; the reachability probe is
   §10's. Declared, not run.
10. **No dark-theme frame.** The AA numbers are measured (5.19/6.12 painted for the settled rung,
    and pass 3's 12.25/6.11 composited); the two crops are light.
11. **PRM was not re-measured this pass.** Pass 3's G4 numbers stand (`animationDuration 0s`,
    node gone 17.5 ms chromium / 43–49 ms webkit); the site block is unchanged and the unit row
    still asserts its static half.
12. **The repeat's hole was not re-clocked.** Pass 3's 133.4 ms (margin) / 123.6–127 ms (board
    voice) stand. What pass 4 changed is the CANCEL, and that is covered by the unit row and its
    born-RED, not by a new live clock.

## Crops — two, both REPLACEMENTS

| file | engine · theme · viewport · pointer | what it shows | retires |
| --- | --- | --- | --- |
| `midVerb-over-empty-390-chromium.png` (1,437 B) | chromium · light · 390×844 · **fine (mouse), no `hasTouch`** | one image, two bands: the line caught at `inset(0 21.73% 0 0)` — clipped from the right, mid-verb — over the same strip empty | `pass3/.../frames/settledExit-390-chromium.png` (an empty strip that could not tell "the verb ran" from "nothing arrived") |
| `parkRecord-clipped-1280-webkit.png` (55,265 B) | webkit · light · 1280×800 · **fine (mouse), no `hasTouch`** | the folded card's bottom edge with empty paper under it, where the record's 51.07 × 11.21 rect sits — gap 1's mechanism | `pass3/.../frames/park-record-1280-webkit.png` (cited as a legible record; it was a grey band) |

The other two pass-3 crops (`repeatHole-390-chromium.png`, `park-reply-1280-webkit.png`) are NOT
replaced and NOT re-cited: the numbers carry those claims.

## The section's rows (leader duties)

**LEDGER's rest-state question, raised to the chair with the KIND rule as the frame.** After a
record is fulfilled, what does line one hold? The KIND rule says the answer is not a tone question
and not a timer question — it is a question about what kind of thing line one IS.

- **Arm A · the record stays until displaced.** Line one keeps the fulfilled record, settled, and
  the next write replaces it. Consistent with `AGES = ["record","state"]` (a record is exactly the
  kind that settles rather than leaves) and with the park, where a record stands and a reply
  leaves. Cost: the strip can hold a sentence whose act is over for an unbounded time, and the
  reader has no way to tell a live record from a spent one except its rung.
- **Arm B · the line empties.** Fulfilment rubs the record out on the whisper rung, the same exit
  every other line gets, and line one is blank until something is true again. Consistent with "a
  note leaves as a verb"; costs the ledger its persistence, which is LEDGER's whole thesis.

LEDGER's frames carry the two states. The owner disposes (U-10). **My own read, stated as a read
and not a ruling:** arm A, because the ageing rule already distinguishes a record from a reply and
arm B collapses that distinction the moment it matters.

**The `2lh` reserve (ACC-SIX) and LEDGER's second line are ONE seating, and the worktree order is:
LEDGER first, then ACC-SIX on top, in §7's tree.** LEDGER owns the second line's existence (its
pass-3 red is that the two-line column does not exist at rest); ACC-SIX's reserve is the space
that line needs. A reserve minted before the line exists is a reserve for nothing — that is the
order the pass-3 record argues for. The phone price (13.6 px of board, `display: none` in
landscape <1024) is priced once, by LEDGER, with W2 §2.2 governing the landscape cell. This lane's
`min-height` change is on the BLOCK and derives from `--type-body`, so a `2lh` reserve seated on
the same block must derive from the same two tokens or the two rules will disagree at 1280 — the
one coupling I am handing over rather than resolving.

## Fork and ballot rows for the owner

- **F-ERASE-1 · the strip's resting height at 1280.** ARM 1 (this diff): the reserve is derived,
  the strip never moves when the voice speaks, and the resting strip is 23.63 px — 2.83 px taller
  than HEAD's 20.8. ARM 2 (HEAD): the resting strip is 20.8 px and grows to 23.61 the first time
  the voice speaks, at every width above the clamp's floor. Both arms are buildable today (arm 2
  is the control tree, served and measured). `docH` is 0 in both. Frames: the π table above reads
  both arms at both widths on both engines.
- **F-ERASE-2 · the parked record's visibility (gap 1).** ARM 1: leave it — the record is spoken
  and the parked card shows the board, which is what the park is for. ARM 2: the strip moves
  inside the fold's clip so the record paints. Arm 2 moves a §10/W2 surface, so it is not built
  here; arm 1 is what ships today and `parkRecord-clipped-1280-webkit.png` is its frame.

## r0 rows

- **R6 hue census — UNMOVED** (byte-identical).
- **R3-g — MOVED.** The reader is amended to report `age` and `leaving` beside `text`, `opacity`
  and `visible`, because this family gives the note an age and an exit and the old three fields
  describe three different states as one. PROPOSED at `instruments/r3g-age.diff` (34 lines,
  additive; r0 is frozen and nothing under `r0/` was written). Run on this tree, both engines,
  logs at `logs/hintnote2-*.json`.
- **R3-d, wobble, budget, heading-voice** — copied with OUT re-pointed and RUN; results in the
  table above, `readings/instruments.log`, `readings/heading-voice.log` and `logs/`. Two are RED
  and stay r0's rows, not this family's: `wobble` R3-a (ring σ 0.092 against a 0.722–2.886 band)
  and `heading-voice` (3 voices, 2 of 8 headings, rank 1.0175 against 1.23). The only edit to
  either copy was `heading-voice.spec.ts`'s hardcoded `127.0.0.1:4231` (r0's lane port) re-pointed
  to this lane's 4248 — an OUT/IN re-point, not a re-wording of a gate.
- **L3, law 27, L17, L19/L21, law 39, law 25, R1, ruling 1's 520 ms** — the chair's rows
  (pass4/CHAIR-RULINGS §1.3). This lane moved none of them and carries none.

## Incidents, self-declared

1. **A sibling lane held 4246 between my band scan and my start.** The band read empty at open;
   twenty minutes later `vite preview --port 4246 --strictPort` errored `Port 4246 is already in
   use`, and a `curl` to it returned a 200 with **a different asset hash**
   (`index-BvdTwOp8Owkm.js`, not my build's `index-onAA0yf2gPvl.js`). The LAWS' rule caught it: I
   verified by hash, not by the 200, and moved to 4245. **Nothing of that lane's was killed**; the
   PID (18140) was read and left alone. 4246 and 4249 were another lane's for the whole run.
2. **The first π run measured a confound, not a delta.** `.margin-note` read 92.84 px (390) /
   105.44 px (1280) apart on the two arms because an unpinned `?size=` deals a random board per
   arm and the two hints said different sentences. Re-run with `?board=` through the estate's own
   codec: 0 at every key. The first run's numbers are struck and named here rather than banked.
3. **Two probe defects of my own, found and fixed mid-run.** (a) The settled arm of the re-cut G16
   was written against a REFUSAL, which never settles — the age is armed by KIND, so the arm read
   `fresh` and the assertion failed correctly; it is the hint's line now. (b) `page.screenshot({
   animations: "disabled" })` on the parked card fast-forwards the fold and moves the card out
   from under the clip; the park frame is captured without it, on a polled pose.
4. **A unit row could not be written where it belonged.** `import … from "*.css?raw"` returns the
   empty string under vitest, so the "the registration is static and complete" assertion moved
   from the unit to the live probe. Declared as gap 3 rather than quietly narrowed.
5. **`git apply --3way` STAGES what it applies.** The re-landed `check-ink-pressure.mjs` hunk
   arrived in the index; `git restore --staged` put it back in the working tree so the critic
   reads one `git diff --stat`. No commit, no stash.

## Files

`src/pencil/chrome/MarginNote.vue` · `src/games/shared/GameBoard.vue` ·
`src/games/shared/useGameState.ts` · `src/pencil/config/pencilConfig.ts` (the §13 graft) ·
`src/assets/index.css` (the §13 registration, cited) · `src/App.vue` ·
`src/games/shared/GameShell.vue` · `src/games/shared/BoardHost.vue` · `src/main.ts` ·
`src/pencil/types.ts` · `src/games/shared/useSession.ts` ·
`src/games/shared/GameBoard.receipt.test.ts` · `scripts/check-ink-pressure.mjs` · + 2 new test
files (`marginNote.motion.test.ts`, `useGameState.authorship.test.ts`).
