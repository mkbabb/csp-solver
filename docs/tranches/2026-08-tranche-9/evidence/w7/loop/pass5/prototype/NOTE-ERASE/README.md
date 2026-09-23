# NOTE-ERASE · pass-5 prototype — the clock leaves the cascade, G5 becomes a set

Worktree `.claude/worktrees/wf_f72f3b5a-83a-47`, advanced IN PLACE on the banked pass-4 diff (base
and π control `74a2b5d9`). Nothing committed. Every browser row deals ONE payload minted with the
app's codec: `?board=` + `encodeSudoku(3, <the classic easy 9×9, 30 givens>, 81)` =
`ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5`
(the string is in every `logs/*.json` as `payload`), and every page asserts the dealt board equals
the given-set before it reads anything.

Servers (all killed by recorded PID; band re-scanned, 4247–4249 free): the lane's BUILT dist on
`:4248`, the shared control dist `index-CubiZsMVSwTc.js` on `:4249`, and a dev server on `:4247` for
the one `?wire=local` row. Measured dist `index-aW5mmGzDOl_l.js` (37 files). The final tree builds
`index-B5bclKNTuHnj.js`. The only difference is two comment edits: in production, plugin-vue hashes
the SFC source into the scope id. An empty-scratch rebuild gave the same `B5bcl…`, so Tailwind was
not contaminated. The whole spec file was re-run on `B5bcl…` (26/26).

## The replay route

**None, in place.** At open, `git diff --stat` read the pass-4 README's 13 files (+761/−78) plus its
two untracked tests, which agreed exactly. At return: **14 files +852/−78** plus the same two
untracked tests. This pass's delta is in `MarginNote.vue`, `marginNote.motion.test.ts`,
`pencilConfig.ts`, `index.css` (+1 `@property`) and `e2e/affordances.spec.ts` (+86, the new row).
`GameBoard.receipt.test.ts` changed by prettier only. No patch was applied to the tree.
**§13 fold rehearsal (scratch, outside every tree):** `git archive 74a2b5d9` +
`git apply pass4/prototype/MOT-VERB/pass4.diff` (clean), then this tree's `MarginNote.vue`, its
test file and its `MOTION.note` block laid on top.

## Numbers first

### Row 1 · G5 re-cut to the SET: born-RED both ways, green on the §13 fold

`Object.keys(MOTION.rungs)` must equal §13's banked set `whisper leave note dusk step throw rise`,
and nothing else. The graft now carries §13's set exactly (`rise: 520` plus its `@property`), so
the fold deletes this block and takes §13's. The banner string is no longer asserted. Break-tests
ran on this tree in one batch and were restored by sha1 (`12ff38ce…` before and after), log at
`readings/g5-break.log`:

| act | G5 |
|---|---|
| mint `erase: 125` (the act the gate forbids) | **RED** (`[dusk, erase, leave, …(5)]` ≠ the seven) |
| drop `rise` (a §7 fold losing a §13 rung) | **RED** |
| re-word the banner to §13's own phrasing (what the correct fold does) | **GREEN** |
| as built | GREEN |
| **the §13 fold rehearsal** (74a2b5d9 + MOT-VERB/pass4.diff + this SFC/test/`note` block) | **GREEN, whole file 11/11** |

**G7 was the same disease, found by running it on the fold.** Its "the publisher emits values"
assertion matched THIS tree's publisher text, and it redded on §13's tree, which builds the values
in a helper (`readings/fold13-unit.log`: 10/11). Re-cut to the BEHAVIOUR: run
`publishMotionRungs(freshDoc)`, then assert one node, no `@property`, and `--motion-<rung>:<ms>ms`
for every rung. Green on both trees. Born-RED: making the publisher emit
`@property --motion-whisper{…}` again (pass 3's shape) reds it. Restored by sha1
(`readings/g7-break.log`).

### Row 2 · the honest clock: specificity-proof, the bound stated, the ablation in-run

The (0,4,0) compound rule is DELETED. `stopTheClock` at the Transition's `@before-leave` writes
`transition: none` inline with `!important`, which outranks every author declaration at any
specificity. **The bound is the author origin.** It was not tested against user-origin or
UA-origin `!important`, which a page cannot plant. BUILT dist, a transition PLANTED, the clock read
off the leaving node at leave start, node-absence by MutationObserver (`logs/clock-*.json`):

| plant · leave | chromium td · absent | webkit td · absent |
|---|---|---|
| none · fresh | 0s · 153.2 ms | 0s · 151 ms |
| `.margin-note-ink` (0,1,0) · fresh | 0s · 154.5 | 0s · 150 |
| **`#app .margin-note-ink` (1,1,0) · fresh** (pass 4: 0.35s / 362.6 / 368) | **0s · 153.1** | **0s · 155** |
| (1,1,0) **`!important`** · fresh | 0s · 152.3 | 0s · 169 |
| (1,1,0) · settled | 0s · 155.3 | 0s · 150 |
| (1,1,0) `!important` · settled | 0s · 150.9 | 0s · 152 |
| **ABLATION** (hook's write stripped before Vue reads) · (1,1,0) fresh | **0.35s · 369.1** | **0.35s · 368** |
| **ABLATION** · (1,1,0) `!important` fresh | **0.35s · 358.4** | **0.35s · 379** |
| **ABLATION** · no plant, settled (the settle's own dusk step; pass 3's defect) | **0.35s · 363.6** | **0.35s · 366** |

In every arm the inline write reads `priority: important`, and `animation-duration` reads
`0.15s, 0.15s`. **The price** is one inline style write per leave. A settle still tweening when its
line is rubbed out lands on its end colour on the rub-out's first frame; that was not measured
visually.

### Row 5 · ONE shipping e2e row: `e2e/affordances.spec.ts` "drop clock"

This is the row the estate lacked (pass 4's grep for the mechanism over `e2e/` and `scripts/` found
0 hits). It uses the spec's own pinned `CONFLICT_BOARD` payload. It plants
`#app .margin-note-ink { transition: color 1000ms linear !important }` and asserts the plant is
LIVE on the resting line (`1s`) as its in-run control. It then drives a red verdict out by the next
edit and asserts, on the leaving node: `transition-duration 0s`, `animation-name ⊇ ink-rub-out`,
every `animation-duration > 0` (the rung resolved, so row E reds it too), and node gone in < 500 ms.

| run | chromium | webkit | file |
|---|---|---|---|
| this tree, `aW5mm…` | ✓ | ✓ | 46/46 (the path filter also matched `mobile-affordances.spec.ts`) exit 0 |
| this tree, final `B5bcl…` | ✓ | ✓ | **26/26 exit 0** |
| **BORN-RED: hook deleted, rebuilt (`DIihPJDjHql-`)** | **✘ `1s` ≠ `0s`** | **✘ `1s` ≠ `0s`** | exit 1; restored sha1 `6334cc88…`, rebuild reproduced `aW5mm…` |
| this tree's spec on the CONTROL dist | ✘ (no leave exists at HEAD) | ✘ | 44/46 exit 1 |
| the control's OWN spec on the control dist | — | — | **24/24 exit 0** |

`pencilConfig.ts`'s "the exit gate reds" sentence is now true and names this row.

### Row E (the @property first clause), re-run

Delete `style[data-motion-rungs]` and all seven rungs go `0.15s…0.52s` → **`0s`**, both engines.
`animation-name` stays `ink-rub-out, ink-rub-out-fade` at `0s, 0s`. The node is gone at 1.9 ms
(chromium) / 19 ms (webkit).

### Row 4 · π at FOUR cells, both BUILT dists, one payload, same sentence both arms (`logs/pi-*.json`)

Coarse cells run `hasTouch` with `(pointer: coarse)` witnessed true on both arms. At every cell,
in every state and on both engines, **board · controls · `.margin-note` = 0 on x/y/w/h** and the
paint and tag delta list is empty, save the one claimed property (`.margin-note-block` min-height).

| cell | proto strip empty→fresh→settled | control empty→fresh | strip Δ at rest | **docH** proto / control (empty, fresh, settled) |
|---|---|---|---|---|
| 390×844 coarse | 20.8 → 20.8 → 20.8 | 20.8 → 20.8 | 0 | 844 / 844 — 0 |
| 1280×800 fine | 23.63 → 23.63 → 23.63 | 20.8 → 23.61 | **+2.83** | 800 / 800 — 0 |
| 844×390 coarse | 22.09 → 22.09 → 22.09 | 20.8 → 22.09 (webkit 22.06) | **+1.29** | **410,410,410 / 409,410,410 — +1 at rest** |
| 812×375 coarse | 21.98 → 21.98 → 21.98 | 20.8 → 21.97 | **+1.18** | **395,395,395 / 394,395,395 — +1 at rest** |

The pass-4 README's "docH 0 in every cell" was false. It is +1 px at rest in both landscape cells,
both engines, because HEAD's strip has not grown yet. Once the voice speaks, both arms read the same.

### Row 6 · AA from PAINTED bytes, with the LAWS' sensitivity row (1280 fine, DPR 1; `logs/aa-*.json`)

The ground is the modal pixel of the ink's own box, i.e. the paper it abuts. Per column: the core
is the column's most distant pixel. The sensitivity row reports the worst column among columns at
≥ 50/70/90/100 % of the median ink mass, and the fraction of ink columns (~109) whose core is < 4.5.

| arm | core median (chromium / webkit) | worst @50/70/90/100 % mass (chromium) | fraction < 4.5 (chromium / webkit) |
|---|---|---|---|
| light fresh | 14.52 / 14.52 | 1.80 · 1.80 · 1.84 · 3.07 | 0.358 / 0.312 |
| **light settled** | **5.17 / 5.17** | 1.69 · 1.69 · 1.69 · 2.04 | **0.385 / 0.431** |
| dark fresh | 12.25 / 12.25 | 2.87 · 2.87 · 3.75 · 3.75 | 0.257 / 0.291 |
| **dark settled** | **6.07 / 6.13** | 1.94 · 1.94 · 2.34 · 2.34 | **0.349 / 0.349** |

The dark number is now cited as **painted 6.07 (chromium) / 6.13 (webkit)**. `check-ink-pressure`'s
6.12 is its derived row. The SFC comment says which is which.

### Row 3 · F-ERASE-2, re-read on this tree (`logs/park-*.json`)

Parked by `g` at 1280. The ink rect sits at y **543.57** (chromium) / **543.28** (webkit). The
`.live-face-slot` `overflow: hidden` bottom is at **540.55** / **540.25** (`containsNote=false`).
`elementFromPoint` at the ink's centre returns `div.game-card-paper`. The ink's own box is
**612 px, all `rgb(253,253,252)`** (paper), both engines. The record is announced and does not
paint. NOT cured (a §10/W2 surface).

### Row 8 · the rows pass 4 left vacuous or carried

- **`becauseMember`, pinned** (dev `:4247`, `?wire=local`, both pages read the payload back).
  Both engines: hint at cell 5 "8 goes nowhere else in this column", because set
  `[5,14,23,32,41,50,59,68,77]`. The named cell is 5, derived by reveal, diff and undo (board
  restored). The peer writes `1` at member **23** (distinct from named): landed on the peer,
  **delivered**, note after `""`. Pass 4's chromium row read member −1; this one is not vacuous.
- **R3-d/R3-g's `solve` act is reachable on EASY**: "only 5 fits here" is armed, Solve rubs it out
  (155–157 ms; 4.1 / 12 ms under PRM), then "solved it!" writes in (gold, `age fresh`, never
  settles). Both engines, both regimes.
- **PRM, re-run:** `animation-duration 0s`, node gone **14.7 ms** chromium / **8 ms** webkit.
  **The repeat's hole, re-run** (the refusal re-said, drop to the next line's insertion):
  **126.1–127.8 ms** (pass 3: 133.4). The board-voice hole (pass 3: 123.6–127) was NOT re-run.

### Constraints, measured

- **filterBudget**: `filter-census.spec.ts` (estate, throttle config) is **12/12 on the lane's dist
  and 12/12 on the control dist**, both engines. Light only; the DARK arm is ACC-SIX's born-RED
  (chair §1.4).
- **M16**: `check-copy-register.mjs` bare exit 0, and this pass adds no product string.
- **R6 hue census**: this pass mints no colour. The pass-4 byte-identical diff stands (not re-run).
- **W2**: no scene, drawer, dock, tab or controls file is touched. π reads 0 on `.controls-card` at
  all four cells.
- **@property law**: one block at file scope in the first static stylesheet, now seven with
  `rise`, `initial-value: 0ms`, `inherits: true`. Row E proves clause 1 live, and G7 proves it
  behaviourally on both trees.

### Units and types

vitest whole estate, chunked: **70 files / 849 tests** (composables 3/16 · pencil 9/84 · games
58/749). After prettier, `src/pencil` plus the receipt file: 10/100. `vue-tsc --noEmit` 0.
`typecheck:e2e` 0.

## The pre-return battery (registry-v4 §2.11), each gate bare, exit codes

The control column is a `git archive 74a2b5d9` copy in scratch (the shared control tree was never
touched).

| gate | tree | control 74a2b5d9 |
|---|---|---|
| the whole spec file (`affordances.spec.ts`, both engines) | **0** (26/26) | **0** (own spec 24/24) |
| `lint:lanes` | 0 | 0 |
| `lint:theme-tokens` | 0 | 0 |
| `lint:sleep` | 0 | 0 |
| `test:e2e:projects` | 0 | 0 |
| `check-pw-projects.mjs` (incl. check 8, the floor band) | **0** | 0 |
| `eslint .` | 0 | 0 |
| `prettier --check` (`npm run lint`) | **1 → 0** (three files of this diff, see incident 5) | 0 |
| `lint:copy` · `check-copy-register` bare | 0 · 0 | 0 · 0 |
| `lint:motion` · `lint:ink` · `check-ink-pressure` bare | 0 · 0 · 0 | 0 · 0 · 0 |
| `lint:live-regions` · `lint:theme-selectors` · `lint:knip` | 0 · 0 · 0 | 0 · 0 · 0 |
| `vue-tsc --noEmit` · `typecheck:e2e` | 0 · 0 | 0 · 0 |

Nothing inherited is red.

## Gaps, every one

1. **The painted AA is a core median, not a distribution.** Under the LAWS' sensitivity statistic,
   **31–43 % of ink columns read < 4.5 in EVERY arm**, including the fresh full-graphite line whose
   core is 14.52. The worst column at 50 % of median mass is 1.69–2.87. So the hand's thin strokes
   at DPR 1 fail the per-column floor whatever the rung. What the settled rung adds is **+2.7 /
   +11.9 points light and +9.2 / +5.8 points dark** of under-floor columns over the fresh line
   (chromium / webkit). "5.17 / 6.07 painted" is therefore true at the core median and a ceiling as
   a floor claim. DPR 3 was not read this pass. The statistic's own threshold for glyph text
   (per-column vs per-glyph) is a wave question, not this lane's to set.
2. **F-ERASE-2 is not cured** (the numbers above). It is seated with LEDGER's question at the
   re-look. §10's leader has not built arm 2 (batch 3, after this lane), so there is no second arm
   to read.
3. **The clock's bound is the author origin, and it is a runtime fence.** User- and UA-origin
   `!important` were not tested. A later lane that replaces the `<Transition>` or its
   `@before-leave` loses the fence silently to the unit row's text check. Only the e2e row sees it
   live.
4. **G5's seven names are a second copy of §13's set.** If §13 moves its set in pass 5 (T9-B11, or
   `rise` renamed), G5 reds at the fold by design and the constant moves in §13's fold commit.
5. **The graft grew by one rung** (`rise: 520` plus its `@property`) so that G5 could assert §13's
   exact set. Consumer-less rungs on this tree are now **four** (`leave`, `step`, `throw`, `rise`),
   plus the `chromeLeaveMs` / `rungs.leave` alias. All of it retires in §13's fold commit (carried
   row). §13's own tree gives them consumers and deletes `chromeLeaveMs`.
6. **The §13 fold is rehearsed for the unit gates only.** On `MarginNote.vue` the fold conflicts:
   §13 edits `.margin-note-ink`'s `ink-write-in` line, which this tree moved to `.note-enter-active`.
   §13's comment says the rub-out lands with `--verb-rubOut-ease … backwards`, while this rule has
   NO fill and uses `--ease-accelIn` (byte-identical curve `0.32,0,0.67,0`). The fold swaps the
   token name and keeps no-fill (a leave retains nothing). This is for the batch-6 rehearsal lane.
7. **The probes measured `aW5mm…`, not the final `B5bcl…`.** The two differ by two comments and the
   scope hash. The whole spec file was re-run on the final; the probes were not.
8. **The `2lh` seating is arithmetic, not built.** LEDGER (batch 2) runs after this lane, so the
   seating does not exist on any tree. See the row below.
9. **LEDGER's rows are not seen closed** (GATE 1b re-cut, the undefined-token census run, π
   populated at ≥1024, ARM C built, ARM B measured). They are LEDGER's batch-2 work, after this
   return.
10. **PRM and the repeat's hole were re-run now, not "at the fold".** The board-voice hole was not
    re-run.
11. **`check-theme-tokens.mjs`'s "the registration is static and complete" row is still PROPOSED**,
    cited to §10's leader (the `@property` block's home, registry §6.5) or the chair. Not written
    here. G7's behavioural re-cut now covers the publisher's half in a unit.
12. **F-ERASE-1's frame is sub-perceptual.** At 1:1 the four bands (control empty / fresh, proto
    empty / fresh) look alike. The owner's fork is 2.83 px that the frame cannot show, and the
    growth it cures is also invisible there.
13. **G15 handoff:** ERASE KEEPS its `check-ink-pressure.mjs` hunk (`gateNote`,
    `gateNoteDiscovery`, `NOTE_QUIET`). It retires only if LEDGER lands `gateNote` with the
    consumer string (plus `.margin-note-previous`) in the same fold, and then the fold takes
    LEDGER's copy.

## Leader duties

- **THE REST-STATE QUESTION (registry §2.8), three arms.** After a record comes true, what does line
  one hold? The KIND rule frames it: how a line ages is decided by what it IS, never its tone or a
  timer. **HOLD** (LEDGER's default): the record keeps its line. **AGE**: fulfilment empties it,
  and it leaves as the verb. **ARM C** (LEDGER builds it in batch 2): hold, then step down one
  rung on the next write, or a spent tint. **My read, as a read and not a ruling: HOLD**, with one
  fact the registry's "full graphite indefinitely" misses. On this tree a `record` is one of the
  two kinds that AGE (`AGES = ["record","state"]`), so a held record already steps down to the
  quiet rung eight beats in. That is ARM C's spent tint on a clock instead of on a write. The
  owner disposes on LEDGER's three frames on one payload.
- **THE `2lh` SEATING (one, under §7's leader: LEDGER first, then ACC-SIX's reserve on top).**
  ACC-SIX's `2lh` measured **27.2 px** of added strip at 393×699, split −13.6 above
  (`.masthead`, `.logo-text`, `.board-wrapper` and cells, `.drawer-tab`, `.margin-note`) and +13.6
  below (`.play-controls`, four `.icon-btn`, `.board-voice`), and W2's tab +13.6 at 844×390. This
  tree's reserve is ONE line derived from the voice's two tokens. A second line seated on the same
  block must read `calc(2 * var(--type-body) * var(--type-leading-caption))`, which is **+20.8 px
  at 390 and +23.63 px at 1280** over today's reserve, not 27.2. The two rules disagree by 6.4 px
  at the phone. That is the number the seating names or refuses, and it is arithmetic until LEDGER
  seats the line. W2 §2.2 governs landscape.

## Crops (2, both REPLACEMENTS, chromium; the author looked at both)

| file | engine · theme · viewport · pointer | shows | retires (pass4/SWEEP.md) |
|---|---|---|---|
| `c1-midverb-50pct-dark-390x844-coarse-chromium.png` (3,412 B) | chromium · **dark** · 390×844 · **coarse** (hasTouch, witnessed) · DPR 2 | two bands, one variable (the moment): the settled hint "only 5 fits here", then the same line at **clip 50.21 %, opacity 0.498** (t = 117 of 150 ms). The pose is PINNED by pausing and seeking the leave's two animations, and the node is held by an instance `removeChild` shim on `.margin-note`. The shim is the frame's uncontrolled variable. | `prototype/NOTE-ERASE/midVerb-over-empty-390-chromium.png` |
| `c2-ferase1-strip-pair-light-1280x800-fine-chromium.png` (6,886 B) | chromium · light · 1280×800 · fine | F-ERASE-1: four bands on the same clip rect, control empty (20.80) / control fresh (23.61) / proto empty (23.63) / proto fresh (23.63). The fresh bands carry the hint's because-wash in both arms equally. | `prototype/NOTE-ERASE/parkRecord-clipped-1280-webkit.png` (F-ERASE-2 is carried by its numbers) |

## Ballot rows for the owner

- **F-ERASE-1 · the strip's resting height, four cells.** ARM 1 (this diff): the reserve is the
  line, so the strip never moves when the voice speaks. At rest it is +2.83 px (1280), +1.29 px
  (844×390) and +1.18 px (812×375) taller than HEAD, and docH is +1 px at rest in both landscape
  cells. ARM 2 (HEAD, the control dist): 20.8 px at rest, growing on first speech by those same
  amounts. The board and the controls are 0 in both. Frame `c2-…` (one payload, one variable: the
  tree). It is sub-perceptual at 1:1.
- **F-ERASE-2 · the parked record paints nothing.** ARM 1 (ships today): spoken, invisible. ARM 2
  (the strip inside the fold's clip) is §10's to build, and unbuilt. There is one arm, so no pair.
  Seated with LEDGER's question at the re-look.
- **§7's rest-state question**, three arms (HOLD / AGE / ARM C). The frames are LEDGER's.

## r0 rows

- **R3-g: MOVED, still the pass-4 PROPOSED diff** (`pass4/prototype/NOTE-ERASE/instruments/r3g-age.diff`,
  unchanged). This pass's `solve` row reads through the same `age` field.
- **R6 hue census: UNMOVED** (no colour minted). L1 (a ceiling ≤ 9): unmoved (filter census 12/12
  both dists). **Every other r0 row: not moved.**

## Incidents, self-declared

1. **G7 redded on the §13 fold rehearsal.** Its second assertion matched this tree's publisher
   literal, the same shape as G5's pass-4 defect. It was found by running the gate on the fold and
   re-cut to behaviour (`readings/fold13-unit.log`).
2. **A probe defect of mine:** the AA probe armed the hint twice. The second H REVEALS the named
   cell and empties the note, so both engines redded on `age undefined`. It was fixed, and the
   first run's two reds are struck.
3. **The hole first read null:** the reader returned at the drop, before the re-said line entered.
   It was fixed to await the next insertion.
4. **The first affordances run's path filter also matched `mobile-affordances.spec.ts`** (46 rows).
   That is extra coverage, not a gate change. The final run is the exact file (26).
5. **`prettier --check` redded on three files of this diff.** `GameBoard.receipt.test.ts` was red
   since pass 4, INHERITED FROM MY OWN pass-4 diff and undeclared by pass 4. The other two were
   this pass's edits. I formatted them with the tree's own prettier and config, then re-ran units
   (10/100), `vue-tsc` and `eslint .`, all 0.
6. **The dist identity moved after comment-only edits.** An empty-scratch rebuild proved it was
   plugin-vue's source-hashed scope id, not Tailwind scanning `.note-erase/`.
7. I read a backgrounded log before its job finished (`g7-break`). It was re-read, and the restore
   was sha1-verified.
8. **Five listeners in the band at return are not mine:** 4230, 4231, 4238, 4239, 4241. They were
   left untouched. Mine were 4247 (dev), 4248 (dist) and 4249 (control), all killed by recorded
   PID.

9. **This README's payload was first typed from memory, not read from a log.** Replacing it with
   an unquoted heredoc let zsh eat the regex. An empty match then inserted the payload between
   every character (2.55 MB). The damage was reversed exactly (every inserted copy stripped), and
   the payload is now the one every `logs/*.json` carries, checked by string equality.

## Files

Product (the work tree): `src/pencil/chrome/MarginNote.vue` · `src/pencil/chrome/marginNote.motion.test.ts` ·
`src/pencil/config/pencilConfig.ts` · `src/assets/index.css` · `e2e/affordances.spec.ts` ·
`src/games/shared/GameBoard.receipt.test.ts` (prettier). The rest of the pass-4 diff is unchanged.
Evidence: `logs/` (per-row readings, ~88 KB), `readings/` (break-tests, the battery, e2e and census
runs), `probe/` (the pass-5 probes, OUT re-pointed here), `instruments/` (the break-test and
battery scripts).
