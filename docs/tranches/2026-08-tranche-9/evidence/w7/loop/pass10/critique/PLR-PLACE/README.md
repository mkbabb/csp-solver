# PLR-PLACE · pass 10 · CRITIQUE (adversarial; the number is the critic's)

Critic scratch `.claude/t9-scratch/work/pass10/crit-PLR-PLACE/` (durable; every archive has its own `.git`). Ports
4243 (tree, as playwright webServer inside each guarded call) and 4257 (control; unused: 74a2b5d9 has no §11
surface, as the lane says). No git on main or the control; git only through temporary indexes in the lane worktree
and in own-init archives. No rm, no commit/stash/status. Zone at open 3,566,457 (`ZONE-ARMED` present, under 8M).

## 1 · The bank, re-derived (all reproduce)

| item | critic's reading |
|---|---|
| homes.diff | sha1 `07257854`, 531,611 B; `--check` 0 on a 74a2b5d9 archive, applied 0 |
| homes.on-WAVE.diff | sha1 `0723d508`, 139,131 B; applied 0 on a 954bbbab archive |
| pass10.diff | sha1 `b41bf5a7`, 312,002 B, 32 paths |
| pass10.delta.on-WAVE.diff | sha1 `7d888a8a`, 36,710 B, 4 files +321/−64 |
| PLR-SELF pass10.delta.on-WAVE.diff | sha1 `540b93da`, 25,204 B |
| pass10.diff on bare 74a2b5d9 | `--check` exit 0 (git dir `crit/ac/base/.git`) |
| pass10.diff on 74a2b5d9 + homes v3 | exit 0, 32 paths |
| pass10.diff on the WAVE 954bbbab (section's integrated tree) | exit 1 (expected: the WAVE carries pass 9's §11; the on-WAVE delta is the route) |
| delta on 954bbbab + homes.on-WAVE + SELF 540b93da (= 71f71a26, stacked) | exit 0, 4 paths (git dir `crit/ac/wave/.git`) |
| delta on 954bbbab + homes.on-WAVE alone | exit 0 |
| delta on bare 954bbbab | exit 0 (git dir `crit/ac/wavebare/.git`) |
| temp index 74a2b5d9 + homes.diff + pass10.diff | write-tree `e6f54f71` = the bank |
| temp index 954bbbab + homes.on-WAVE + SELF + delta | WS `71f71a26`, U `f6f7e6b4` = the lane's |
| the lane worktree now (`add -A web/frontend` on a temp index) | `e6f54f71`: the worktree is the bank, byte for byte |
| grep of both diffs | 0 scratchpad, 0 /private/tmp, 0 /tmp/, 0 t9-scratch, 0 /Users/, 0 dot-dir paths, 0 docs/ imports |
| home paths in pass10.diff | 0 (homes applied by sha; no residual home edit rides the bank) |

The pass-9 → pass-10 advance (`git diff 4a97c02c e6f54f71`, 18 files): the homes v2→v3 step (stripped from the bank),
SELF's blobs by sha (`node.d.ts`, `rowBudget.ts` comment-only, `pencilConfig.ts` comment-only), SELF's
`player-mark.spec.ts` merged under the chart column, and PLACE's own four: `player-place.spec.ts` (+331/−?),
`PlayerMark.vue` (+44), `PlayerLobby.vue` (+7), `useSession.ts` (+3). No paint-bearing line outside §11: π against
74a2b5d9 has no new surface to move this pass (π carried, not re-read; see gaps).

## 2 · The product cures, read in source

1. **`refont` (the third re-fit path).** `document.fonts.addEventListener('loadingdone', refont)` while open; `refont`
   clears `space` so `fit(true)` cannot short-circuit on an unchanged board. Bound and unbound beside `resize` and
   `transitionend`. Enumerated paths in PlayerMark.vue at the bank: `resize→refit`, `transitionend→onSettle→refit`,
   `loadingdone→refont`, and `watch([isOpen, people.length])→fit()` (a people change, not a space change). Row 15's
   `REFIT_PATHS` cuts the first three by source regex, each counted once per page. **Class not closed:** nothing re-fits
   when the board moves by a WAAPI or CSS `@keyframes` animation (no `transitionend`), by a `visualViewport` change that
   fires no window `resize` (iOS keyboard / pinch), or by a scroll. The row enumerates the paths the code HAS; it does
   not show the code has every path the class needs (gap C1).
2. **`settled` as a `shallowRef<ReadonlyMap>`.** Every write is a new Map; reads are `.get/.has/.keys`. A real
   structural change, not a pin in TIN's gate: lawful.
3. **`PlayerLobby` reduce arm `transition: none`** in place of two `0s` longhands. Same behaviour (the shorthand also
   resets `transition-property`, harmless under `none`). Lawful by the gate's letter.
4. **`// policy: dwell` on `PLACE_SETTLE_MS`.** B11's own lawful route (`POLICY_TAG = /\/\/\s*policy:\s*\w+/`, the
   gate's doc names "a dwell" a POLICY). It is truthful (a receiver-side damping timer). Note for the instruments
   lane, not PLACE's debt: the tag is self-attesting (any `\w+`); "a kind" is declared, not verified.

## 3 · The new and re-cut gates, read in source (before any browser row)

- **Row 15 (fold blocker).** `REFIT_PATHS` cuts `resize`, `settle` and `face` by source regex on the dev module, each
  asserted landed once per page; the negative asserts `atRest.rows === opened.rows` and `atRest != fresh`. The struck
  2-at-the-table cell (390×860) is struck by ARM (read from `App.vue`/`PlayerMark.vue` consts), returning only under
  `CHART_YIELDS`. P9 §F asks n ≥ 5 for the resize negative: the row reads ONE cell (n = 3 at the table) under the
  shipped arm. "n ≥ 5" is not met by cell count; it is met only if read as "every path, ≥5 runs", which the lane did
  not run (one clean + one negative per run). Priced, not fatal: the 860 cell's strike carries a sound reason.
- **Row 15f (font-landing leg).** The face is held by `ctx.route` until open, its pending state witnessed on
  `FontFace.status` (not `fonts.check()`). Liveness is asserted (`fresh.rows != opened.rows`), so a dead cell reds
  rather than passes. Holes: (a) ONE cell, 390×1050, fitted by the lane's own Chromium sweep with a 12.3 px margin, a
  lane-chosen parameter (P9 §E: a fitted constant names its ballot or its flip cells; FACE_CELL names neither ±ε nor a
  WebKit value); (b) the leg covers re-fit only, not the yield (arm not shipped; admitted); (c) a face landing BEFORE
  open is never read (the open's own fit reads it; plausible, unwitnessed).
- **Row 4 re-author (the union's tally boil).** `beat(r)` admits EVERY `class` record on a `g.pt-pose`, by shape
  alone, and `__boil` is printed but never bounded. The in-run plant sets a NON-class attribute, which the admission
  excludes by construction, so the plant proves the admission's attribute key and nothing about its cause: a
  walk-driven class flip on `g.pt-pose` reads GREEN. An unbounded admission is a masking ledger (LAWS P9 §C). The cure
  is cheap: bound `__boil` by the beat over `shutMs` (or read the same window with no walk and require equality ±1
  beat), and plant a class flip per walk step that reds. OPEN (gap C2).
- **Threshold battery (`PLACE_THRESH`).** ε is a literal from the command line (P9 §F met); the site regex replaces the
  FIRST `e.clientX/Y <|> r.<bound>` in the module, landed-once asserted. Only right/top/bottom were run (left has no
  live band, stated). Source-sound.
- **edgeRow WebKit clean reach.** The early `return` now follows the clean `expect`: WebKit gates clean reach (pass-9
  gap 10 closed in source).

## 4 · Re-derived on the tree (critic's own runs; exits read bare from files the battery writes)

Rig: the lane tree `e6f54f71` served by its own dev server as playwright webServer on 127.0.0.1:4243 (critic scratch
vite config, private cacheDir), `--workers=1`, one guarded call per engine. Control: not served (no §11 surface at
74a2b5d9; no control column exists for rows 15/15f).

| run | engine | rows | exit | load 1m head→tail | zone inuse | reading |
|---|---|---|---|---|---|---|
| `c15-cr` 02:17:56→02:20:49 | chromium | 15, 15f | **0** (2/2) | 11.27 → 11.48 | 3,590,936 → 3,623,908 | row 15 clean opened 3r/0/0 → at rest 1r/92.7px/21 = fresh 1r/92.7/21; negative (resize+settle+face cut, each landed once/page) at rest **3r/117.0/21 ≠ fresh** (RED asserted in run). Row 15f clean opened 1r → at rest 4r = fresh 4r (lap 0); negative held **1r ≠ fresh 4r** |

Both of the lane's Chromium numbers reproduce to the decimal. The fold blocker (pass-9 gap 1) is closed in Chromium:
every enumerated re-fit path cut in the run, the row reds, the clean read is GREEN.

**PICK 9 / the batch gate, critic's stacked check.** PLR-COUNT's `pass10.delta.on-WAVE.diff` is NOT in
`pass10/prototype/PLR-COUNT/` (README.md and ROUTE.md only). Its scratch copy (`work/pass10/PLR-COUNT/bank/`, sha1
`ed064ae2`, 28,095 B, one path `e2e/player-tally.spec.ts`) was read for the check only: on a temp index at `71f71a26`,
SELF → PLACE → COUNT exit 0/0 → `60c91718`; SELF → COUNT → PLACE exit 0/0 → `60c91718`. The route commutes on bytes,
not just by construction. COUNT's base reads frontend subtree `11d04ba3` = `71f71a26:web/frontend`: one base. But the
COUNT delta is unbanked in the record, so the batch gate's "ONE route applies stacked" is MET ON SCRATCH BYTES ONLY;
the record cannot replay it until COUNT banks. LADDER's K7r RED through CI is another lane's gate (not read here).

### The union's three gate reds, born-RED pair re-derived (WS `71f71a26` = WAVE + homes v3 + SELF, the pass-9 product; U `f6f7e6b4` = WS + PLACE's delta; each a fresh `git archive` with its own `git init`, `guarded --light`, exits bare)

| gate | WS (the pass-9 plant) | U (the cure) | PLACE's part |
|---|---|---|---|
| `lint:bands` B11 | exit 1: `23 clocks — 10 TRAVEL, 1 WINDOW, 11 POLICY, 1 unkinded`, ✗ B11 — 1 | exit 1: `12 POLICY, 0 unkinded`, ✓ B11 | **cured**. Residual ✗ B6 — 1 and ✗ B13 — 2 identical on WS and U (B6 the scratch archive's missing 74a2b5d9 history; B13 not PLACE's) |
| `lint:verbs` | exit 1: `declarations that name neither a verb nor a rung: 2` | **exit 0**: `… : 0` | **cured** |
| `lint:theme-tokens` wash reach | exit 2: 6 offences (useSession 7 vs 6 ×3, PlayerMark.vue 2 vs 0 ×3) | 3 offences, useSession ×3 only | **PlayerMark cured**; residual is PAL-TIN's |

Each pass-9 red is on WS and gone on U in the same critic session: the born-RED pair holds for all three.

### The critic's plant on the new 15f gate (a mutation of the cure, not of the spec)

Plant: a `git archive` of `e6f54f71` (own `git init`, `crit/plant/.git`), `PlayerMark.vue`'s `refont` reduced to
`refit()` (the `space = "";` line deleted; bytes checked with `od -c`: `function refont(): void {\n  refit();\n}`), served
by its own dev server on 4243 inside one guarded call.

| run | engine | exit | load 1m | zone | reading |
|---|---|---|---|---|---|
| `plant-nospace-cr` 02:24:36→02:25:22 | chromium | **1** (15f RED) | 11.94 → 10.85 | 3,669,367 | clean opened 1r → at rest **1r** ≠ fresh 4r: `at rest after the face lands = a fresh open` fails |

So the `space` reset is load-bearing (`fit(true)` returns early on an unchanged board and window) and 15f catches its
loss in Chromium: the gate fails on a mutated cure, not only on its own cut. Control exit: no control column exists
(74a2b5d9 has no sheet); the tree's own clean 15f exit 0 (`c15-cr`) is the same-session pair.

## 5 · Constraints (critic-read on the bank)

- **M16:** `check-copy-register.mjs` on the tree exit **0** (0 em/en dashes, 0 unadmitted jargon).
- **filterBudget 9 / @property:** `filterBudget.ts` not in the bank; `git diff ac862f1e e6f54f71 -- web/frontend/src`
  adds **0** lines matching `@property|filter:|url(#`.
- **Unit:** `vitest run src/pencil/chrome/PlayerMark` (critic, `--maxWorkers=2`, light) exit 0, 3 files / 25 tests.
- **π against 74a2b5d9:** not re-read by the lane or the critic. The pass-10 product delta has no at-rest paint line
  (a Map for a record, one listener, a reduce arm already `0s`), and 74a2b5d9 has no sheet, so π has no surface the
  control shares that this pass moves. Carried, named.
- **AA (painted):** T9-R8's 2.972 / 3.009 light RED stand, carried from pass 9 by the lane, not re-read; the charter
  asked the control read "attempted again on the lane's reader, or the failure named": the failure is named (the
  reader died with the pass-9 scratch, the control has no sheet). Met by its letter; the RED stands in the number.
- **Ballot pair on one payload:** no frame this pass (0 B of the 102,698 B headroom). B-CHART's numbers carried from
  pass 9, labelled carried (LAWS P9 §G met by the caption). No new pair owed.

## 6 · Open gaps (the critic's, numbered; gaps first in the return)

- **C1 · the re-fit class is enumerated from the code, not from the class.** Three paths exist and all three are cut
  and red; nothing re-fits when the board or the window moves by a WAAPI / `@keyframes` animation (no `transitionend`),
  a `visualViewport` change with no window `resize` (iOS keyboard, pinch), or a scroll. No row plants one of these.
  A class cure cured for its plants (registry-v8 §2.12) is open on these three members until each is planted or
  shown unreachable under an open sheet. A concrete member is in the product: `games/shared/useControlsDrawer.ts`
  moves "board+tab sheet, case, masthead" on ONE `element.animate()` (WAAPI; no `transitionend`), and the drawer's
  rest pose reads `--vv-height` (`useKeyboardViewport`). Whether a drawer gesture can land while the sheet is open is
  unwitnessed either way.
- **C2 · row 4's admission is unbounded (a masking-ledger shape, LAWS P9 §C).** Every `class` record on a `g.pt-pose`
  is admitted by shape, `__boil` is printed (92 on U, the lane's) and never bounded; the in-run plant is a non-class
  attribute, excluded by construction, so it cannot red a walk-driven pose flip. Cure: bound `__boil` by the beat over
  `shutMs` (or an equal no-walk window, ±1 beat) and plant one class flip per walk step that reds. Union-only; not
  browser-planted by the critic (source-proven).
- **C3 · 15f reads ONE fitted cell in ONE engine-keyed sweep.** FACE_CELL 390×1050 is the lane's Chromium sweep with a
  12.3 px margin, no ±ε pair, no WebKit value (LAWS P9 §E: a fitted constant names its flip cells). WebKit: §7.
- **C4 · row 15's n.** P9 §F's "all cut, n ≥ 5" is met on paths, not on the cell: the row reads n = 3 at one cell under
  the shipped arm (860 struck with a sound reason). Priced.
- **C5 · PICK 9 met on scratch bytes only.** SELF → PLACE → COUNT = SELF → COUNT → PLACE = `60c91718` on the critic's
  temp index, but COUNT's delta is not banked in `pass10/prototype/PLR-COUNT/`; the record cannot replay the route.
- **C6 · carried, not re-read:** T9-R8 AA 2.972 / 3.009 light RED; π and the filter census; check 8 FLOOR BAND red
  (286/284 vs 214/212, the fold's); B-CHART numbers (owner's, U-10); real iOS aim (RUNSHEET M19).
- **C7 · siblings' reds riding the tree:** SELF's far-edge row in `player-mark.spec.ts` red in Chromium on tree and
  union (SELF's); `lint:theme-tokens` exit 2 on U (TIN's useSession 7 vs 6); `lint:sleep` exit 1 on U (SIX's
  `count-yield:302`, LEDGER's `note-reserve:305/:357`, critic-read); `lint:bands` B13 ×2 and the scratch's B6.

## 7 · WebKit (the critic's column; `guarded --exclusive webkit`, lock wait 02:25:31 → 02:36:36 behind five foreign waiters)

| run | engine | rows | exit | load 1m head→tail | zone inuse | reading |
|---|---|---|---|---|---|---|
| `c15-wk` 02:25:31→02:36:54 | webkit | 15, 15f | **1** (1 pass / 1 fail) | 11.62 → 13.91 (row heads 14.51 / 15.44) | 3,669,367 → 3,801,302 | row 15 GREEN: clean 3r/0/0 → at rest 1r/93.0/21 = fresh 1r/93.0/21; negative at rest 3r/117.3/21 ≠ fresh (RED asserted) = the lane's WebKit read 1. **Row 15f RED on the CLEAN tree**: liveness holds (opened 1r, fresh 4r: the cell IS live in WebKit), but at rest after the face lands **1r ≠ fresh 4r**; the clean read equals the all-cut negative (1r held) |

**This is a product red, not a witness artifact.** The precondition (face held, `FontFace.status` not `loaded`) passed,
the release landed (the poll on `status === 'loaded'` passed), and a fresh open in the same page draws 4 rows. In
WebKit the open sheet does not re-fit when the face lands: `loadingdone → refont` either does not fire for a CSS-driven
face load in WebKit, or fires before layout takes the face. The font-landing cure works in Chromium only. The row is
correct to red; the lane never read it (its WebKit read 2 was dequeued; read 1 stopped at the old witness). The
charter's "must close" 1 (a font-landing leg, with its negative) is CLOSED IN CHROMIUM, OPEN IN WEBKIT, and WebKit is
the engine the owner's Safari complaint lives in.

### The mechanism, named (critic's diagnostic archive; scratch only, never a bank)

Archive of `e6f54f71` (own `git init`, `crit/diag/.git`): `refont` increments `window.__refont`; the diag copy of 15f
adds a test-side `document.fonts` `loadingdone` listener before `release()` and reads it with every face's status
after the rest.

| run | engine | exit | zone | `loadingdone` events (clean / cut) | `refont` calls (clean / cut) | Patrick Hand status after | at rest (clean) |
|---|---|---|---|---|---|---|---|
| `diag-wk` →02:37:59 | webkit | 1 | 3,811,757 | **0 / 0** | **0 / 0** | `loaded` | 1r ≠ fresh 4r |
| `diag-cr` →02:38:21 | chromium | 0 | 3,811,757 | 1 / 1 (`Fira Code, Fraunces, Patrick Hand: loaded` at ~780 ms) | 1 / 0 | `loaded` | 4r = fresh |

**WebKit dispatches no `loadingdone` on `document.fonts` for the CSS-driven face load**, though the face reaches
`loaded`; the product's third re-fit path never runs there, and no other path covers a face landing. Two WebKit reads
(`c15-wk`, `diag-wk`), identical. The cure is Chromium-only by mechanism. A cure that holds in both engines reads each
face's own promise (`FontFace.loaded`, or `document.fonts.ready` re-armed on `loading`) rather than the set's event;
that is the lane's to cut and read, both engines, with this row as its born-RED.

**Gap C0 (added after §7, ranks first): row 15f is a shipped product red in WebKit** — the font-landing cure rides
`loadingdone`, which WebKit never dispatches here (0 events, 0 refonts, n = 2 reads). The gate is right; the product is
not. Not masked by any ledger; the lane's return called the leg "CLOSED in Chromium" with WebKit UNREAD, which is
accurate but not converged.

## 8 · The number and the verdict

**90 (held; pass 9 was 90).** Earned this pass, re-derived by the critic: the fold blocker (row 15) closed in BOTH
engines (every enumerated path cut in the run, negative RED, clean GREEN, the lane's numbers to the decimal); the three
union gate reds cured with their born-RED pair WS→U; the font-landing gate is a real gate (liveness asserted, the
critic's mutation `space` reset deleted reds it in Chromium); edgeRow's WebKit clean reach gates; the ONE route
commutes on bytes. Taken back: 15f's cure fails in WebKit by mechanism (C0); row 4's union admission is unbounded (C2);
the re-fit class has a concrete unplanted member in the product (C1, `useControlsDrawer`'s WAAPI board mover); PICK 9
replayable only from COUNT's scratch (C5). Verdict **ADVANCE** (alive; not converged; no default moves).

Owed next pass, in order: a both-engine face-landing path (`FontFace.loaded` per face, or `fonts.ready` re-armed on
`loading`) with 15f read GREEN in WebKit and its cut RED; `__boil` bounded by the beat with a class-flip plant; C1's
WAAPI member planted or shown unreachable under an open sheet; FACE_CELL's WebKit value and ±ε cells; COUNT's delta
banked so the stacked route replays from the record.

## 9 · Incidents (critic, self-declared)

- I1: the first WebKit waiter (`pw-run.sh` 86748 / guarded 86756, both mine, checked by `ps`) was dequeued at ~02:24 to
  run the Chromium plant without two of the lane's runs alive at once; re-queued 02:25:31 (flock, no FIFO position lost).
- I2: `ZONE-ARMED` present all session; zone 3,566,457 → 3,811,757, always under 8M. No reboot owed by this lane.
- I3: git only through temporary indexes in the lane worktree (objects to the shared store) and own-init scratch
  archives (`crit/ac/{base,wave,wavebare}`, `crit/u/{WS,U}`, `crit/plant`, `crit/diag`); no commit, stash, status, ref
  move; none on main or the control. No rm. Nothing written into the lane's tree.
- I4: PLR-COUNT's on-WAVE delta read from its lane scratch (`work/pass10/PLR-COUNT/bank/`), not from the record.
- I5: every browser run's server was the playwright webServer inside its guarded call; no listener left on 4243/4257.

## 10 · Replay route

`crit/ac.sh` (shas, grep, the six apply checks, the temp-index trees). Browser rows: `crit/pw-run.sh <tag> crit/pw.mts
<chromium|webkit> '15f? · ' player-place.spec.ts` (WebKit through `--exclusive webkit`); plant: `crit/pw-run-plant.sh`
on `crit/plant` (refont without `space = ""`); diag: `crit/pw-run-diag.sh` on `crit/diag`. Lints: `crit/lints.sh` on
`crit/u/WS` and `crit/u/U`. Annotations: `python3 crit/annot.py <json>`.
