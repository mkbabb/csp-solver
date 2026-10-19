# NOTE-ERASE · pass-9 CRITIQUE

I'm the critic. I didn't write the charter, the spec or the prototype. Base and π control: `74a2b5d9`. The number is mine.

**Convergence: 91 (held; the lane's pass-9 work is real but both of its headline rows are cured for their plants, not their class). Verdict: ADVANCE.**

## Gaps first (each re-derived here, both engines, on the WAVE union + homes on-WAVE + Δ unless named)

1. **Row 1 is OPEN at its class (registry-v8 §2.12).** The fence now keys "a CSS animation is PRESENT", not "a CSS animation RUNS". `getAnimations()` returns a paused animation and an animation on a dead timeline, and the hook writes the rung on both. The leaving sentence then sits at FULL ink (opacity 1.00 on every painted frame) until Vue's fallback timer fires:
   - **SWAP, real verb + `animation-play-state: paused !important`:** 161.9–170.3 ms cr / 162–185 ms wk, **16–22 VISIBLE both-line frames** (line two already holds the record; asserted). The getAnimations read on `@leave` reports `ink-rub-out:paused`.
   - **SWAP, real verb + `animation-timeline: none !important`:** 159.9–165.6 cr / 160–175 wk, 16–22 visible frames at opacity 1. The read reports `ink-rub-out:running`, timeline `null`.
   - The positive control (the same real verb, running) is 146–160 ms, and its opacity falls 1 → 0 across the frames. The fold-blocker species (pass-8 critic, registry v8 §2.3) is reproduced by two new spellings. The ghost-name cure doesn't reach them.
   - **One-declaration plants on the leaves that ship a verb:**
     - Line two `paused`: 159–171 ms, 16–20 visible, frozen at 1.00.
     - Line two `timeline: none`: 160.7–168 ms, 16–20 visible.
     - Line one (the red-line leave) `paused`: 158–278 ms, 14–21 visible.
     - Line one `timeline: none`: 156.8–188 ms, 15–22 visible.
     - Line two `animation-timeline: scroll(root)`: 162–168 ms held, visible 1–2. That's the ghost's held-slot harm, with `currentTime` null.
   - The fence's own comment ("returns the leave's own CSS animation when, and only when, one runs") is false in both engines.
2. **Row 2 is OPEN at its class, the third pass running.** Six script spellings register a ladder rung `inherits: false` in BOTH engines (proved live: a child reads the initial `0s` under a parent's `900ms`, and the negative control inherits `900ms`). The registration row reads **0 breaches** on the tree AND on the union:
   - `CSS.registerProperty.call(CSS, {…})`
   - `CSS.registerProperty?.({…})`
   - `Reflect.apply(CSS.registerProperty, CSS, [{…}])`
   - `(0, CSS.registerProperty)({…})`
   - `const k = "registerProperty"; CSS[k]({…})`
   - `let r; r = CSS.registerProperty.bind(CSS); r({…})`

   The library's script arm keys on the token run `registerProperty\s*\(` plus a declared-alias list. Its class is "a call whose callee resolves to `CSS.registerProperty`". The lane's 8 plants and homes v2's clauses are each RED as claimed (I re-derived two: the escaped head and `registerProperty(def)`, 1 breach each). The CSS side holds: a comment between `@property` and the name, `--motion\-whisper`, an `@import` chain to a sheet outside `src/` and a `replaceSync` template literal all red.
3. **The drop-clock time clause is non-binding** (LAWS P8 §F threshold law, which the lane declared unbuilt). I planted a hook that writes a near-bound length in place of `0s` on the ghost swap:
   - 100 ms writes hold 103.8–117 ms.
   - 140 ms writes hold 145.4–150 ms, and they PASS `ms < MOTION.rungs.whisper` in 3/4 reads.
   - 149 ms writes hold 154.3–165 ms and red it.

   The gate as a whole still reds on every plant through `animationDuration === '0s'` and the ≤ 2-frame clauses (12–22 frames). So the time clause adds nothing below the rung: a 140 ms double paint is caught only by the other two. There's still no bound ± ε plant on the 2-frame count.
4. **`expect(leave.visible).toBeLessThanOrEqual(leave.painted)`** (the still-leave arms on the tree and the union) can't fail: visible frames are a subset of connected frames by construction. It's harmless, since `painted ≤ 2` is the binding clause, but it's a vacuous assertion, and row 3's visibility count gates only the SWAP arms and the SWAP name-key negative (`visible > 2`).
5. **Row 4 stays declared, not planted** (user- and UA-origin `!important`). I accept the mechanism per engine as stated. The explicit `done` is priced and not built. It's a gap, not a cure.
6. **No frame.** F-ERASE-2 is unframed, and the ballot reads numbers. I accept the reason. T9-R8's settled rung (2.563 / 2.866 at DPR 1) stays open, and it isn't ERASE's ink.
7. **The SWAP arm of Row 1 depends on `.note-swap-leave-active` carrying `animation: none`.** A real verb on the swap needs its own duration to run at all: my name-only plant ran nothing and dropped in 7.6–13 ms. That's correct behaviour, and it's recorded so no one cites it as a hole.

## 0 · Setup (mine; the lane's work tree read only, through a temporary index)

- **The bank, re-cut.** `GIT_INDEX_FILE` in my scratch, `read-tree 74a2b5d9`, `add` of the frontend product paths, `write-tree` gives **tree `8c4f72ab`**. The diff is **573,234 B, sha1 `fd3173ab…`, 32 files +11,990/−94**, equal to BANKED.txt.
- **The pass-9 advance** is the interdiff `f7b15b46` → `8c4f72ab`: 16 files +3,527/−229.
  - 12 of them are the homes paths. `git diff d17813ba 8c4f72ab` over the 13 homes paths is EMPTY, so homes v2 is applied by sha and the residual home edit is 0.
  - 4 are product files: `MarginNote.vue` (the key, +comment), `marginNote.motion.test.ts` (+2 G16 rows, getAnimations stub), `e2e/affordances.spec.ts` (ghost arms, NAME_KEY/BLIND fakes, visibility count) and `check-theme-tokens.mjs` (+8 plants, graph-only reach). I read all four whole.
- **apply --check, mine** (`logs/applycheck.txt`; the copies are `git archive 74a2b5d9` extractions under my durable scratch):
  - `pass9.diff` on 74a2b5d9: **0**.
  - `pass9.delta.on-WAVE.diff` on 74a2b5d9 + `WAVE.diff` (the union `acb9c08e`): **0**.
  - The same delta on 74a2b5d9 + `s13-s7-s3.diff` (§7's integrated tree): **0**.
  - The same delta on bare 74a2b5d9: 1. That's expected, since the delta is on-WAVE.
  - The shas of the diffs read are in `logs/shas.txt` (WAVE.diff `0dc4fd85`, homes.on-WAVE `a0f8e6f3`, delta `1a9c822a`).
- **Copies and builds.**
  - t9 = archive + pass9.diff, served as `index-BpslhW5fBCRV.js`. It's an archive build, so the CSS is bigger than the work tree's, as the lane declared.
  - u9 = archive + WAVE + homes.on-WAVE + Δ: **`index-CO1tTFvQzwWh.js`, the lane's identity reproduced**.
  - wh = archive + WAVE + homes.on-WAVE: **`index-BRpbF3dGtZoj.js`, the lane's `acde977b` identity reproduced**.
  - u9c = u9 + my PROPOSED one-clause cure: `index-B_Ef88gr0wyw.js`.
- **The bank grep.** the session scratch, the temp paths and the durable scratch give 0 hits on `+` lines in both banks, and there are no dot-dirs on `+++`. Two `docs/…` strings ride homes v2's comments (homes' own lines, not imports). No product file imports from `docs/`.
- **Servers.** Lane port :4240 (u9, then u9c, then t9) and control :4248 (`w7-control`, `index-CubiZsMVSwTc.js`, its own `.vite-control.config.ts`). Each went up and down through the guard (the lane's `erase9-serve.sh`, re-pathed): **4 up / 3 down at this line, 0 refusals, 0 held ports met** (`logs/servers.txt`).
- **Box load.** The 1-minute load at open/close of every row is printed in the row's `.exit`. Timing rows opened at 41–85 and closed at 62–91. The peak was 112 mid-run on the cure probe (not a verdict row). Nothing ran above 120.

## 1 · Row 1 re-derived (union u9, ×3 per engine, both themes; `logs/spec-crit-u9.log`, parsed `logs/parsed-crit-u9.txt`; **96/96 passed, exit 0**, load 48.7 → 62.9)

| arm | chromium ms · connected / visible | webkit |
|---|---|---|
| SWAP ghost, light | 11.3–12.9 · 1–2 / 1–2 | 7–10 · 1 / 1 |
| SWAP ghost, dark | 8.5–11.5 · 0–2 / 0–2 | 8–13 · 1 / 1 |
| **SWAP ghost under the pass-8 NAME key (in-run), light · dark** | **157.9–162.3 · 159.9–164.5 · 20 / 20** | **161–162 · 160–164 · 16–17 / 16–17** |
| line two ghost, light · dark | 8–11.6 · 8.8–14.7 · 0–2 | 9–17 · 8–11 · 1 |
| line two ghost under NAME key, light · dark | 160–161.4 · 159.8–164.5 · 20 / 0–1 | 161–173 · 164–166 · 16–17 / 1 |
| line one (red line) ghost | 9.6–11.9 · 1 / 1 | 16–36 · 1 / 1 |
| line one ghost under NAME key | 159.8–162.6 · 20 / 1 | 181–191 · 16–18 / 1 |

The lane's ranges reproduce (its 3.7–16 ms / 157–186 ms). The pass-8 plant runs first on the re-cut gate: the NAME-key negative reproduces the pass-8 hook in-run in both engines and reds the clean bound. The ghost-name batch gate is **MET** for the ghost spelling.

## 2 · Row 1 at its CLASS: present ≠ running (`instruments/crit-append.ts`; `logs/spec-crit2-u9.log` 36/36 exit 0 at load 41.1 → 72.5; `logs/spec-crit-u9.log`; `logs/spec-crit4-u9.log` exit 0 at 81.8 → 91.2)

Each row logs `el.getAnimations()` on the leaving node at first sight (`name:playState:currentTime:timeline`) and the node's computed opacity on every post-paint frame (the ONE `installTimeline`, `css:<sel>:opacity`).

| plant (union u9, the shipped fence) | the read on `@leave` | chromium ms · visible frames · opacity | webkit |
|---|---|---|---|
| SWAP, `animation-name: ink-rub-out; animation-duration: 150ms` (POSITIVE control: a real running verb) | `ink-rub-out:running:0:tl` | 152.7–158.8 · 14–16 · **1 → 0** | 146–160 · 9–12 · **1 → 0** |
| **SWAP, the same + `animation-play-state: paused !important`** | `ink-rub-out:paused:0:tl` | **161.9–170.3 · 21–22 · 1.00 on every frame** | **162–185 · 16 · 1.00** |
| **SWAP, the same + `animation-timeline: none !important`** | `ink-rub-out:running:0:tl-null` | **159.9–165.6 · 21–22 · 1.00** | **160–175 · 16–18 · 1.00** |
| line one (red line) as shipped | `running:0:tl` | 149.1–157.4 · 20 · fades | 137–156 · 2–14 · fades |
| **line one, `animation-play-state: paused !important`** (one declaration) | `paused` | **158.2–161 · 20–21 · 1.00** | **188–278 · 14–17 · 1.00** |
| **line one, `animation-timeline: none !important`** (one declaration) | `running`, `tl-null` | **156.8–170.7 · 20–22 · 1.00** | **174–188 · 15–19 · 1.00** |
| line two as shipped | `running:0:tl` | 151.8–155.9 · 18–19 · fades | 151–160 · 14–15 · fades |
| **line two, `paused !important`** (one declaration) | `paused` | **159.8–162.9 · 20 · 1.00** | **159–171 · 16 · 1.00** |
| **line two, `animation-timeline: none !important`** (one declaration) | `running`, `tl-null` | **160.7–168 · 20 · 1.00** | **162–168 · 16–20 · 1.00** |
| line two, `animation-timeline: scroll(root) !important` | `running:null:tl` (currentTime null) | 162.7–164.6 held · visible 1–2 | 162–168 held · 1 |

- The SWAP rows assert the push (`lineTwo === held`) after the leave. Every frame the old node is visible, line two already paints the record. **That's the fold blocker's double paint, 16–22 frames at full ink, by two new spellings**, both engines.
- On line one and line two the harm is the sentence FROZEN at full ink for the rung and then dropped. It isn't erased, and per the idea it lingers. `scroll(root)` reproduces the ghost's held slot on line two.
- **A SWAP real verb by name ALONE** (no duration) runs nothing: 7.6–13 ms, `0s`. The fence is right there, and I record it so it isn't cited as a hole.

**The class cure exists and is ONE clause, PROPOSED, not banked** (`PROPOSED-fence-running.on-WAVE.diff`, on the union's `MarginNote.vue`):

```ts
.some((a) => "animationName" in a && a.playState === "running" && a.timeline === document.timeline)
```

On u9c (`logs/spec-cure-u9c.log`; the whole drop-clock suite + my plants ×2 per engine; load 85.3 → 84.0, peak 112 mid-run):
- Every class plant goes to **4.2–41 ms, `0s`, 1–2 visible frames**: SWAP paused 7–10, SWAP timeline none 8.2–13, line one paused/none 4.2–41, line two paused/none/scroll 8–13.9.
- The positive control keeps the rung (148–160 ms, fades). Every shipped and rung arm stays GREEN: SWAP as shipped 8.1–16, ghosts 4.7–35, line two rung arms 146–158.
- **28 failed = exactly the 7 in-run negatives × 2 × 2.** Their fakes return `{animationName, playState}` with no `timeline`, so they can't blind the cure. They need `timeline: document.timeline` in `fakeAnimations`.
- The unit file reds **4/16** on u9c (the static regex and the stub's objects carry no `playState` or `timeline`; `logs/unit-u9c.log`).

So the cure is three edits (the hook, the spec's fakes, the unit stub plus the static regex), not one. It's the lane's to land with plants. A `scroll()`/view timeline on a leave then becomes a zero-length leave, which is the honest answer: Vue's clock can't follow a timeline it doesn't own.

## 3 · Threshold and clause sabotage on the re-cut gate (`logs/spec-crit3-u9.log`, 12/12 exit 0, load 81.1 → 85.4)

An init script rewrites the hook's `setProperty('animation-duration', '0s', 'important')` to a NEAR-bound length on the ghost swap, ×2 per engine:

| written | chromium held · visible | webkit | `durIs0s` | `ms < 150` | `visible ≤ 2` · `connected ≤ 2` |
|---|---|---|---|---|---|
| 100 ms | 103.8–111.1 · 14 | 110–117 · 12 | RED | **GREEN** | RED · RED |
| 140 ms | 145.4–146.4 · 19–21 | 148–150 · 15 | RED | **GREEN 3/4** | RED · RED |
| 149 ms | 154.3–161.8 · 21–22 | 160–165 · 16–17 | RED | RED | RED · RED |

- The gate reds every plant, but the TIME clause is non-binding below the rung. It admits a 140 ms double paint, and its bound IS the negative's own clock (Vue's `duration + 1`), so a bound ± ε plant can't separate it.
- The binding clauses are the exact `0s` and the 2-frame count.
- The slowest clean leave I read is 36 ms (WebKit, still ghost). A time bound of 2 × 16.7 ms + the clean margin would bite. As cut, it's decoration.
- The lane's `runs = true` source sabotage (28 reds = the 7 zero-length arms × 2 × 2) stands as reported. I didn't re-run it. The disjuncts `"animationName" in a` and `?? false` stay unit-only (declared unreachable). I accept that and don't count it toward the number.

## 4 · Row 2 at its class (`instruments/crit-plants.mjs`, `instruments/reg-live.mjs`; `logs/crit-plants-t9.txt`, `logs/crit-plants-u9.txt`, `logs/reg-live.txt`)

A fresh copy per plant, `node scripts/check-theme-tokens.mjs` bare, the row's line read. The plants are plain ASCII (no `\u` escape in any tool input). The live proof is a blank page per spelling in each engine: `<div style="--motion-whisper: 900ms"><span>`, where the span reads `0s` when the rung is registered `inherits: false` and `900ms` when it isn't.

| plant | tree row (homes v2) | union u9 row | live, chromium · webkit |
|---|---|---|---|
| clean | 0 (exit 0) | 0 (exit 1: the union's own two bare `var()`, identical on wh) | `900ms` · `900ms` (inherits) |
| re-derived: escaped head `--\6d otion-whisper` | **1, RED** | — | — |
| re-derived: `registerProperty(def)` | **1, RED** | — | — |
| **`CSS.registerProperty.call(CSS, {…})`** | **0** | **0** | **registered · registered** |
| **`CSS.registerProperty?.({…})`** | **0** | **0** | **registered · registered** |
| **`Reflect.apply(CSS.registerProperty, CSS, [{…}])`** | **0** | **0** | **registered · registered** |
| **`(0, CSS.registerProperty)({…})`** | **0** | **0** | **registered · registered** |
| **`const k9 = "registerProperty"; CSS[k9]({…})`** | **0** | **0** | **registered · registered** |
| **`let r9; r9 = CSS.registerProperty.bind(CSS); r9({…})`** | **0** | **0** | **registered · registered** |
| `@property/**/--motion-whisper` | 1 | — | — |
| `@property --motion\-whisper` | 1 | — | — |
| `@import` of a sheet outside `src/` from a `src/` sheet | 1 | — | — |
| `replaceSync` with a template literal | 2 | — | — |

- **Six spellings ship a ladder rung `inherits: false` with the row at 0 on the tree and the union, in both engines.** The row's script arm (homes v2 `propertyRegistrations`, `register-script` / `register-any`) needs the literal token run `registerProperty\s*\(` or a `const|let|var x = CSS.registerProperty` declaration. A member-call (`.call`/`.apply`), an optional call, `Reflect.apply`, a parenthesised callee, a computed key bound to a const, and an assignment alias all slip it.
- The class is "a call whose callee resolves to `CSS.registerProperty`". The library can't resolve that by regex. Two honest arms: a `registerProperty` IDENT anywhere in shipped JS (the built chunk, read like cpb C5) is a registration site, UNRESOLVED unless proven a literal call; or the row runs the built page and reads `CSS.registerProperty` through a spy installed before `main`.
- The CSS side holds on every spelling I tried. **The agreement clause** (cpb `--dist` = the row) is a CSS-only agreement, so it can't see any of the six. The lane's "row 2 CLOSED at the class" doesn't stand.
- This is a homes-v2 library row (the chair's instruments lane folds), carried by ERASE's row. Per LAWS P8 §I it's a PROPOSED clause with these six plants, not a lane fork.

## 5 · Constraints

- **AA / T9-R6 / filterBudget.** The union's CSS with and without Δ, and with my cure, normalised for the `data-v-*` scope hash, gives **sha `d3ebcd94664c` on all three** (243,635 B each). There are 15 `filter:` and 14 `backdrop-filter:` declarations on all three. Δ mints no utility and moves no ink. filterBudget 9 isn't touched (no SVG filter moved: the JS change is the hook's key).
- **π vs `74a2b5d9`** (the lane's `pi2.probe.ts`, re-pathed, tree t9 :4240 vs control :4248, ctl/ctl floor in-run; `logs/probe-pi-t9.log`, 4/4 exit 0, load 51.1 → 44.9):

  | cell | chromium · webkit |
  |---|---|
  | 1280×800 fine | strip tree 23.63 → 23.63, control 20.80 → 23.61; docH 800 = 800; **1 unclaimed row (`.board-margin`, +2.83)** |
  | 844×390 coarse | tree 22.09 → 22.09, control 20.80 → 22.09 / 22.06 (wk); docH 410 vs 409; **19 rows** |

  The ctl/ctl floor is identical in every row. I re-derived the lane's π in both engines. It's the control's first-speech growth held at rest, which LEDGER's rest=spoken row claims (the charter's route). I accept the claim as LEDGER's. Δ's union share is 0 by CSS identity plus a JS key that only reads on a leave.
- **M16** (`lint:copy`, check-copy-register): t9 0 · u9 0 · wh 0 · b0 (74a2b5d9) 0.
- **The @property law / the registration row.** See §4: OPEN at its class.
- **The ballot pair.** There's no frame (F-ERASE-2 unframed). Headroom spent: 0 B, and none by me.

## 6 · Battery, bare (every exit written by the command's own wrapper to a file; `logs/bat.txt`, `logs/unit.exit`)

| row | tree t9 | union u9 (+Δ) | union wh (no Δ, the control for Δ) | 74a2b5d9 (b0 archive) | cure u9c |
|---|---|---|---|---|---|
| `marginNote.motion.test.ts` | **0 · 15/15** | **0 · 16/16** | — | — | **1 · 4 failed / 16** (stub + static regex, §2) |
| `lint:theme-tokens` (`--self-test`) | 0 | 1 (two bare `var()`) | 1 (identical census) | 0 | — |
| `lint:ink` | 0 | 0 | 0 | 0 | — |
| `lint:copy` (M16) | 0 | 0 | 0 | 0 | — |
| drop-clock spec + CRIT (×3/×2 per engine) | — | 96/96 · 36/36 · 12/12 · 4/4, exit 0 | — | not run by me (the lane's 18/18 RED at 74a2b5d9 is cited, not re-derived) | 128 passed / 28 failed = the 7 negatives × 2 × 2 |
| `registration row` plants | 6 escapes (§4) | 6 escapes | — | — | — |

I didn't re-run `vue-tsc`, `typecheck:e2e`, eslint, knip, `lint:sleep` or the 70-file vitest sweep. The lane's §9 table is cited for them, not re-derived, and doesn't count toward my number.

## 7 · What the pass earned, row by row (the charter's ten)

| charter row | lane's claim | critic |
|---|---|---|
| 1 fence on a running animation | CLOSED | **OPEN at the class**: the ghost is closed and re-derived both engines/themes; paused, `timeline: none` and `scroll()` reproduce the species (§2). A one-clause cure is proved in-browser, not banked. |
| 2 registration at its class | CLOSED | **OPEN at the class**: 8 lane plants RED (2 re-derived); 6 new script spellings ship at row 0, live-proved both engines (§4). |
| 3 visibility count | CLOSED | **CLOSED** on SWAP. The still-leave `visible ≤ painted` is vacuous; harmless, recorded. |
| 4 user/UA `!important` | declared | declared; accepted as a gap |
| 5 π / reserve law | claimed by LEDGER | re-derived both engines (+2.83 / +1.29, ctl/ctl floor 0), claim accepted as LEDGER's |
| 6 F-ERASE-2 / T9-R8 | unframed / open | unframed (numbers); T9-R8 not re-read by me |
| 7 `postpaint.d.mts` | 0 | homes v2 by sha (residual 0); typecheck not re-run |
| 8 sabotage | fence + 8 clauses | the threshold leg is new here: the time clause is non-binding below the rung (§3). The 2-frame bound has no ± ε plant. |
| 9 vitest 70/70 | 70/70 | cited, the motion file re-run (15/15, 16/16) |
| 10 server guard | 8 up / 8 down / 1 refusal | mine: 4 up / 4 down / 0 refusals |

## Incidents (self-declared)

1. **A spec edited under a running battery.** I sed-edited u9's scratch `affordances.spec.ts` (the SWAP plants gained a duration) while `crit-u9` ran. The first run's three `CRIT swap` rows (7.6–14 ms, `0s`, no animation) are the name-only plant, kept only as the §2 "name alone runs nothing" note. The verdict rows are `crit2-u9`, re-run on the edited file. No ghost or lane arm changed.
2. **One shell `&` launch** (`crit2-u9` via `run-spec2.sh … &`) instead of `run_in_background`. It completed and wrote its exit (0) to its own file, and the next poll read it.
3. **Foreground sleeps** of 20–60 s inside polls, each under 120 s. Three foreground `vitest`/lint chunks ran under 100 s with `timeout 100`.
4. **Shared object store.** The temporary-index `write-tree` in the lane's work tree (my re-cut) wrote loose objects. No ref, no index of any tree, no file of the work tree was touched. `git archive 74a2b5d9` was run from the lane's worktree. No git ran on main or in the control tree. No commit, stash or push anywhere.
5. **Load.** No timing row opened above 85. The cure run peaked at 112 mid-run (u9c is a proposal probe, not a verdict on the lane).
6. No `rm`: every discard is a `mv` to `trash/`. Every scratch tree, archive, log, cacheDir and plant lives under `.claude/t9-scratch/work/pass9/crit-NOTE-ERASE/`.

## Replay

1. Scratch `.claude/t9-scratch/work/pass9/crit-NOTE-ERASE/` holds `bin/` (the lane's `mk-copy.sh`, `build-dir.sh`, `run-spec2.sh` and `parse-leaves.py`, plus its guard as `serve.sh`, all re-pathed). Make `base.tar` with `git archive 74a2b5d9`.
2. Build the copies t9 / u9 / wh / u9c as in §0.
3. Append `instruments/crit-append.ts` to the copy's `e2e/affordances.spec.ts`. Then run `run-spec2.sh <fe> 4240 <label> -g "CRIT|ghost name|GHOST" --repeat-each 3` and the parse.
4. Registration: `node crit-plants.mjs <fe> <tag>`, then `node reg-live.mjs` from a frontend dir.
5. π: the lane's `pi2.probe.ts` with `PI_TREE=4240`. The cure is `PROPOSED-fence-running.on-WAVE.diff` applied on u9.
