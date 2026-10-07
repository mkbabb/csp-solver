# NOTE-ERASE · pass 8 prototype

Work tree `.claude/worktrees/wf_f72f3b5a-83a-47`, advanced in place on base `74a2b5d9`. The number is the critic's.

## Bank line

| | |
|---|---|
| full diff | `pass8.diff` · 420,110 B · sha1 `a7f9c935a2332b14fe9f150d5c9b5931d59becd1` · 27 files +8,692/−94 · tree `f7b15b464ae6a3f84b96832d72e746272ec3af0b` · `git apply --check` **0** on a fresh `git archive 74a2b5d9` |
| of which the homes | `homes.diff` sha1 `a1d8adeb…` applied at open (plain `git apply`, check 0, so nothing staged); the lane's own pass-8 interdiff over the pass-7 bank is 9 files +577/−241 |
| on-union delta | `pass8.delta.on-s13-s7-s3.diff` · 57,321 B · sha1 `aefb0fb4e2e2ff46779a8b3a311eb481233022e3` · 5 files +810/−235, cut against union+homes (`1f8a729a`) · `apply --check` **0** on fresh `74a2b5d9 + s13-s7-s3.diff` AND on fresh union + `homes.on-s13-s7-s3.diff`; result write-tree `1f104003…` · refuses on bare `74a2b5d9` (by design) |
| battery = bank | the battery copy was `git archive 74a2b5d9` + this diff (`cmp` equal); the worktree was not edited after the cut |

The worktree's diff at open equalled BANKED.txt exactly (temporary index: 17 files +1658/−81, 107,061 B, sha1 `d77243bf…`, tree `4518da97`). Nothing needed declaring.

Every browser row was served from a clean out-of-tree copy (`git archive` + the same diff) built through a two-line `.mts` config with a private cacheDir. Served CSS: the tree's CSS equals the pass-7 bank's rebuilt CSS (`CNyQnHaWLGEi` reproduced) modulo scope hash. Against the control the only rule differences are MarginNote's rules, the seven `@property --motion-*` rules and the two keyframes (49 vs 42 `@property`). No utility is minted. A fresh `74a2b5d9` build equals `w7-control/dist` (`diff -rq`).

Dists: tree `index-Cr7o9fvpjGA6.js` · union+homes+delta `index-C_SlSGoMXD5k.js` · union with the literal pass-7 hook (U1) `index-DwK6gyq6mDHP.js` · union as integrated (S2) `index-Bqn6P2cEWqaQ.js` (the integrator's identity, reproduced) · control `index-CubiZsMVSwTc.js`. U1 and delta CSS equal the union's modulo scope hash.

## Gaps first

1. **User-origin and UA-origin `!important` are unplanted.** A page can't author them. An origin above author-important beats the inline write, and its effect is the write lost. The in-run PASS_SIX_HOOK arm shows that effect: 906.8–1209 ms. The bound for every origin would be an explicit `done` on `@leave` (the component's own clock). It isn't built; it's named for the owner.
2. **π moved one element on the control that no row claimed before.**
   - At 1280×800 fine, `.board-margin` is 23.63 px tall at rest on the tree against 20.80 on `74a2b5d9`, both engines. This is +2.83 px. It's pass 7's `min-height: 1lh` seat on an empty voice.
   - Pass 7 read π against the pass-6 dist, so it never showed up.
   - Nothing else moves: docH is equal, and the in-run floor (control against control) is 0/0.
   - At 390×844 coarse, 0 elements outside the block differ.
3. **The reserve law isn't green on this tree.** `--tree` reads the anchor ABSENT, 14 ok / 14 FAIL, exit 2, the same as the control.
   - The spelling of my seat is the union's: `line-height: calc(var(--type-body) * var(--type-leading-caption)); min-height: 1lh`.
   - What's missing is LEDGER's voice seat (`<1024 .margin-note { min-height: inherit }`).
   - On union+homes+delta it's 28/28, exit 0.
4. **The 2lh seat isn't landed.** It's LEDGER's row. What it costs my frame: nothing in time, because the rub-out clips line one only. In document height it's +18/+19 desk and +22/+23 landscape. Those are pass-6 numbers, not re-measured.
5. **F-ERASE-2 is numbers only.** Ruling 18 names no ERASE composite, and no ERASE crop is on disk to retire. The ballot says unframed. The numbers are pass 7's, not re-read: −13.52/−13.32 px of square, parked text whole-pop 2.48–2.80 < 4.5.
6. **T9-R8 is cited, not re-read.** No ink moved at rest (the CSS equals pass 7's).
7. **`registerProperty(<non-literal>)` is outside the library.** It's covered by a PROPOSED clause, not by the row.
   - The ONE copy reads only `registerProperty({…})`.
   - `instruments/shape-census.register-any.PROPOSED.diff` adds `register-any` with its plant. On a scratch copy the self-test reads 93/93 with 41/41 clauses; with the clause sabotaged it's 92/93 and the plant goes RED.
   - It isn't in the tree. The chair folds it.
8. **The spec imports `./lib/postpaint.mjs`, which needed a type.** `typecheck:e2e` is strict with no `allowJs`, so a bare `.mjs` import is TS7016. I added `e2e/lib/postpaint.d.mts`: declarations only, `installTimeline` typed, every other export `unknown`. It's PROPOSED for the chair's home.
9. **Inherited on the union, declared:**
   - `test:e2e:projects` / `check-pw-projects` exit 1: check 8 FLOOR BAND, the chair's restamp. It's the same on union+homes.
   - `lint:bands` exit 1 in a non-git copy (B6 needs `74a2b5d9`). With `GIT_DIR` pointed read-only at the main repo's objects it's 0 on both.

## Numbers (box load: 1-min 12–218 across the pass; per-row loads in `logs/spec-summary.txt`)

### Row 1 · the fence re-keyed on the COMPUTED name and GATED (fold blocker)

**The hook.** `stopTheClock(el)` now rides `@leave` on both `<Transition>`s, not `@before-leave`.
- Vue calls `before-leave` before `*-leave-active` is on the node (`runtime-dom:212–233`), so a name read there is the resting ink's.
- It reads `getComputedStyle(el).animationName`. `none` (or every item `none`) writes `animation-duration: 0s`; any other value writes the whisper rung. Delay 0s and `transition: none` are written as before, all inline `!important`.
- It declares one parameter, so Vue keeps the clock.
- PRM needs no `matchMedia` read: the site's PRM arm is `animation: none`.
- On the union, `stopLineOne` and the name-keyed `still` flag (S2) are deleted.

**Tree, post-paint** (`installTimeline`, the recorder's post track). ×5 per engine, `logs/spec-tree-still-x5.txt`:

| leave | chromium | webkit |
|---|---|---|
| PRM arm | 7.7–15.0 ms · 1–2 painted frames | 3.0–16.0 ms · 1–2 |
| `animation-name: none !important` | 9.2–11.2 ms · 1 | 26–50 ms · 1 |
| negative: the fence blinded (= U1) | 163.4–166.9 ms · 18–19 | 158.0–163.0 ms · 16–17 |

**Union SWAP leg** (HOLD push; line two holds the pushed record, asserted). ×5 per engine per theme, `logs/spec-u8-swap-x5.txt`; ×6 with the first run:

| arm | chromium light · dark | webkit light · dark |
|---|---|---|
| union+homes+delta | 5.3–12.5 ms · 0–2 frames · 4.2–12.4 ms · 0–2 | 8–28 ms · 1 · 8–18 ms · 1 |
| in-run negative, the fence blinded | 158.9–167.0 ms · 19–23 | 160–171 ms · 15–17 |
| literal U1 dist (`DwK6gyq6`) | swap rows RED 10/10 (duration `0.15s`) · held 153.8–163.9 ms · 22–23 frames | RED 10/10 · 161–165 ms · 16–17 |
| S2 as integrated (`Bqn6P2cE`, name-keyed) | swap GREEN 10.3/10.9 ms · 0–1 | GREEN 15/26 ms · 1 |

The charter window for the negative was 156–166 ms. It read up to 167.0 (cr) and 171 (wk) at load 81–86.

**Born-RED for the re-key itself** (`logs/spec-s2-dropclock.txt`). S2 passes the swap but reds `animation-name: none !important` on BOTH leaves in both engines, writing `0.15s`. That's 8 failed / 30 passed: the two still rows plus the two blinded negatives per engine. The negatives show S2 never reads the computed name. The union+delta run is 38/38 (`logs/spec-u8-dropclock-1.txt`).

**Unit** (`logs/unit-bornred.txt`):

| file | on the new hook | pass-7 hook | S2 | U1 |
|---|---|---|---|---|
| tree `marginNote.motion.test.ts` | 13/13 | 2 red / 11 (the zero-length row + the static row) | — | — |
| union file | 14/14 | — | 2 red | 3 red (+ the push row: swap `0s`, line two keeps the rung) |

### Row 2 · line two's clock on the union, in a browser (`logs/spec-u8-dropclock-1.txt`)

Node-gone ms · painted frames, 1280 fine:

| adversary on `.note-previous-leave-active` | chromium | webkit | pass 6's hook (in-run) cr · wk |
|---|---|---|---|
| none | 156.1 · 19 | 159 · 16 | — |
| `@layer` duration 900 + delay 300 `!important` | 155.9 · 19 | 146 · 15 | **1197.7 · 1203** |
| shorthand `ink-rub-out 900ms linear 200ms !important` | 154.5 · 19 | 154 · 15 | **1112.8 · 1101** |
| `:root { --motion-whisper: 900ms !important }` | 154.2 · 19 | 153 · 15 | **906.8 · 907** |
| `animation-iteration-count: 6 !important` | 163.8 · 20 | 165 · 16 | — (not an attack) |

Every leaving node reads the rung (150 ms) and delay 0. The bound is `< MOTION.rungs.note`.

### Row 3 · the registration row through the ONE library

`check-theme-tokens.mjs` reads registrations through `propertyRegistrations`, and depth through the library's `rulesOf` ctx. `stripComments`, `sheetsOf`, `otherSheets` and `motionRegistrations` are deleted, and the census strips with `stripCss`.
- **Script clause.** It has C4's shape: ANY `registerProperty(` in code, or `@property` text in a script string, reds whatever its name.
- **Self-test.** 23 plants, all RED. Each plant is a file the library reads.
  - New: a `.pcss` sheet imported from `main.ts` (inherits:false), a split name `{name: W}`, a `registerProperty` of any name, `@property` text a script appends, nesting in `@media`.
  - One exclusive plant per clause: moved to typography.css, syntax `<length>`, inherits false, initial 150ms, a stray rung in the home.
- **Clause-sabotage** (`logs/sabotage-battery.txt`, tree and union).
  - 11/11 row clauses BITE, and the library's `pcss` BITES.
  - `register-split` off reads 0 by design: the script clause is name-blind. It's printed as NOT LOAD-BEARING, and `script` off reds the split plant.

**Agreement** (`logs/registration-agreement.txt`):

| arm | row (pass 8) | row (pass 7, the negative) | `check-property-block --dist` | cpb source-only |
|---|---|---|---|---|
| tree | 0 | 0 | 0 | 0 |
| tree + a real `.pcss` imported from `main.ts` (`index-CTbW8bCz`) | **1** | 0 (the hole) | **1** (C5: served `--motion-whisper inherits: false`) | 0 |

`cpb --served` is 0 on :4248 (tree) and on :4250 (control).

### Row 4 · the four consumer-less rungs and the alias

- **`leave` is consumed.** App.vue's timer reads `MOTION.rungs.leave` (the same 200). `chromeLeaveMs` is deleted from `pencilConfig.ts`, and three comments are re-pointed.
- **`step`, `throw` and `rise`** are named in `FOLD_CONSUMERS` by their union file:
  - `GameCard.vue` / `useCarouselGlide.ts`
  - `SolveIcon.vue` / `useControlsDrawer.ts`
  - `useControlsDrawer.ts` `spend('slide','rise')`
- **The consumer row.** It reads `var(--motion-x)` via `varRefs` over the library's strippers, `MOTION.rungs.x` via `clockReads`, and §13's `spend(…,"x")`.
  - A STALE entry reds, and an entry naming no rung reds.
  - Born-RED before the alias cure: exit 1, `--motion-leave has no reader` (`logs/theme-tokens-bornred-before-alias.txt`).
- **On the union** the table is `{}` and all seven are read: whisper 20 · leave 20 · note 14 · dusk 3 · step 3 · throw 7 · rise 1.

### Row 5 · the untested pair

`animation-name: none !important` is read on both leaves in both engines: the tree's note leave above, and the union's note leave at 9.4 / 13 ms. Line two reads 13.6 ms · 2 frames (cr) and 8 ms · 1 (wk). User/UA origin is gap 1.

### Rows 6–9

- **Row 6 (the reserve law).** Gap 3 has the readings: `logs/reserve-law.txt`, 14/14 FAIL exit 2 on the tree and control, 28/28 exit 0 on union+homes+delta.
- **Row 7 (F-ERASE-2).** Gap 5.
- **Row 8 (T9-R8).** Cited, not bent: 2.563 / 2.866 / 4.099 in 3/4 DPR-1 cells. HOLD pays it at rest. The settle comment states it.
- **Row 9 (the incident guard).** `instruments/erase8-serve.sh`.
  - `up` never frees a held port: it exits 3 naming the holder's pid and cwd. It records the wrapper pid, the listener pid, the cwd and the served identity.
  - `down` kills only when four things all hold: the port's listener is the recorded one, the recorded wrapper is among the listener's ancestors (a `ps -o ppid` walk), the listener's cwd is the recorded dir, and the page serves the recorded identity.
  - Used for every server this pass (`logs/servers.txt`): 7 up / 7 down, 0 refused. Siblings held :4236 and :4251, and I touched neither.

### π · AA · constraints

- **π.** Tree vs `74a2b5d9`, whole DOM (`logs/pi.txt`):

  | cell | elements | unclaimed diffs | block diffs | floor |
  |---|---|---|---|---|
  | 390×844 coarse (witnessed) | 1,052 / 1,054 | 0 | 1 | 0/0 |
  | 1280×800 | — | 1 (gap 2) | 1 | 0/0 |

  Both engines.
- **AA.** No painted ink moved against pass 7 (CSS equal modulo scope hash). T9-R8 is as cited.
- **filterBudget.** Static `filter:` 9 = 9 and `url(#` 16 = 16, tree vs control. The union reads 8 (the ratified crayon-heart deletion).
- **M16.** `check-copy-register` is 0. No new UI string.
- **Frames.** None made. Headroom spent: **0 B**. `check-evidence-policy` PASS.

## Battery (bare; tree copy | control copy `git archive 74a2b5d9`; union+homes+delta | union+homes)

| gate | tree | control | union+Δ | union+homes |
|---|---|---|---|---|
| lint:lanes, lint:theme-tokens, lint:sleep, lint:motion, lint:copy, lint:ink, lint:knip | 0 each | 0 each | 0 each | 0 each |
| typecheck:e2e, test:font-coverage, lint:live-regions, lint:catch, lint:theme-selectors | 0 each | 0 each | 0 each | 0 each |
| test:e2e:projects · check-pw-projects | 0 · 0 | 0 · 0 | 1 · 1 (FLOOR BAND) | 1 · 1 |
| check-copy-register · `eslint . --max-warnings 0` · `npm run lint` · `vue-tsc -b` | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 |
| check-property-block source · `--self-test` | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 |
| lint:bands · lint:verbs | 1 · 1 (no such script) | 1 · 1 (same) | 1 (B6, not git) → 0 with `GIT_DIR` · 0 | same |
| whole `affordances.spec.ts`, both engines | **38/38** | 24 passed / 14 failed (no mechanism) | **62/62** | the union spec on the control: 24 passed / 38 failed |

vitest, chunked by directory:

| tree | union+Δ |
|---|---|
| `src/games` 57 files / 742 tests (the shared chunk ran twice: 35/437 within it) · `src/pencil` 9/86 · `src/composables` 3/16 | `src/games` 58/770 · `src/pencil` 14/123 · `src/composables` 3/16 |
| 0 failed | 0 failed |

`src/lib` exits 1 with no test files in both. The tree has 70 test files on disk, and the chunks collected 69. One file is unaccounted for.

## Grafts and the leader's §7

- LEDGER's reserve SHAPE law, MUST_CLOSE and the `nowrap` clip ride the union (`lint:ink` 0 there). They aren't on this tree, which lacks LEDGER's mechanism.
- My two-axis clock plus delay, line two on the same fence, and the computed-name key are in the on-union delta.
- **The union's §7 SWAP as I read it:** 4.2–12.5 ms (cr) and 8–28 ms (wk), 0–2 frames, over 24 runs. LEDGER's read of S2 was 8.9–13.3 / 10–12 ms, 0–1 frames. S2 as integrated reads the same order here (10.3–26 ms).
- **What the union keeps regardless of T9-B-LEDGER:** the computed-name `stopTheClock` on `@leave` for both lines. S2 is superseded by it, not reverted.

## Replay route

1. Open: the tree's diff equals BANKED.txt. Apply `homes.diff` (sha `a1d8adeb`) plainly.
2. Edit in place: `MarginNote.vue`, `marginNote.motion.test.ts`, `check-theme-tokens.mjs`, `affordances.spec.ts`, `e2e/lib/postpaint.d.mts`, `App.vue`, `pencilConfig.ts`, and the comments in `scene.css` and `committed-press.ts`.
3. The union: `git archive 74a2b5d9`, then `s13-s7-s3.diff`, then `homes.on-s13-s7-s3.diff`. The tree hashes `98454964` and `1f8a729a` reproduced. Port the same hunks, then cut the delta through a temporary index against `1f8a729a`.
4. Builds, serves and runs: `instruments/erase8-{build,serve,battery,sabotage}.sh`, `run-spec.sh`, `batch1.sh`, `batch2.sh`, `vitest-chunks.sh`, `pi.probe.ts`.

## Incidents (self-declared)

1. **Background launches.** The union battery was launched with a shell `&`, not `run_in_background`. It completed, and its exits were read from its own log. Two foreground waits ran to the 115–118 s harness limit and were moved to the background, a stall-law breach. Nothing was lost.
2. **Output outside scratch.** One `check-evidence-policy` output was written to `/tmp`, against the no-`/tmp` law, then moved to `<scratchpad>/trash-erase8-1/`.
3. **Errors caught before any reading:**
   - The union self-test crashed on a `planted` name collision with the alias law's own `planted`. My helper was renamed `plantFile`.
   - eslint caught an unused `REG_CLAUSES`, which now validates `THEME_SABOTAGE` ids.
   - The union WAAPI stub was missing in the new unit row (jsdom has no `animate`).
4. **A dead run.** One spec invocation with `-g xxxx` ran against the wrong port, matched no tests, and is in the summary as `u8-probe-none`.
5. **Scratch hygiene.** No `rm` and no `git clean`. The lane's `.erase8/` probe dir was `mv`ed out of the worktree to `<scratchpad>/trash-erase8-1/`. No git ran in the control tree.
6. **Git on the main repo.** Read-only `GIT_DIR=<main>/.git` object reads for `lint:bands` B6. Temporary-index cuts only (`GIT_INDEX_FILE`); no real index was touched.
7. **Servers.** Every server was killed by the guard. :4248 and :4250 read free at return.
8. **Worktree status at return.** Product files only (18 M, plus the homes' `e2e/lib/` and `scripts/shape-census.mjs`, plus the two untracked tests).
